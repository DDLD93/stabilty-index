import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { audit } from "@/lib/admin/audit";
import { adminOrResponse, parseBody } from "@/lib/admin/guard";
import { EDITION_STATUSES } from "@/lib/honors/constants";
import { ALLOWED_TRANSITIONS } from "@/lib/honors/phase";
import { isMailConfigured } from "@/lib/mailer";

export const dynamic = "force-dynamic";

const bodySchema = z.object({ to: z.enum(EDITION_STATUSES) });

type Params = { params: Promise<{ id: string }> };

/** Move an edition to its next (or previous) stage, with the checks each stage needs. */
export async function POST(req: Request, { params }: Params) {
  const guard = await adminOrResponse();
  if (guard instanceof NextResponse) return guard;
  const { id } = await params;
  const body = await parseBody(req, bodySchema);
  if (body instanceof NextResponse) return body;

  const edition = await db.honorsEdition.findUnique({
    where: { id },
    include: { categories: { where: { isActive: true }, include: { finalists: { where: { isActive: true }, select: { id: true } } } } },
  });
  if (!edition) return NextResponse.json({ error: "Edition not found." }, { status: 404 });

  const from = edition.status;
  const to = body.to;
  if (!ALLOWED_TRANSITIONS[from].includes(to)) {
    return NextResponse.json({ error: `Can’t move from ${from} to ${to}.` }, { status: 409 });
  }

  const reasons: string[] = [];
  if (to !== "DRAFT" && edition.categories.length === 0) reasons.push("The edition has no active categories.");
  if (["NOMINATIONS_OPEN", "VOTING_OPEN"].includes(to)) {
    const other = await db.honorsEdition.findFirst({
      where: { id: { not: id }, status: { in: ["NOMINATIONS_OPEN", "SHORTLISTING", "VOTING_OPEN", "VOTING_CLOSED"] } },
      select: { title: true },
    });
    if (other) reasons.push(`${other.title} is still running. Finish or archive it first.`);
  }
  if (to === "VOTING_OPEN") {
    if (!isMailConfigured()) reasons.push("Email (SMTP) isn’t configured, so votes can’t be confirmed.");
    const thin = edition.categories.filter((c) => c.finalists.length < 2).map((c) => c.name);
    if (thin.length) reasons.push(`These categories need at least 2 finalists: ${thin.join(", ")}.`);
  }
  if (from === "VOTING_OPEN" && to === "SHORTLISTING") {
    const votes = await db.honorsVote.count({ where: { editionId: id } });
    if (votes > 0) reasons.push("Votes have already been cast; voting can be closed but not undone.");
  }
  if (to === "ANNOUNCED") {
    const published = edition.categories.filter((c) => c.winnerPublishedAt).length;
    if (published === 0) reasons.push("Publish at least one winner before announcing.");
  }
  if (reasons.length) return NextResponse.json({ error: reasons.join(" "), reasons }, { status: 409 });

  await db.honorsEdition.update({ where: { id }, data: { status: to } });
  await audit(guard.adminUserId, "HonorsEditionStatus", { editionId: id, from, to });
  return NextResponse.json({ ok: true, status: to });
}
