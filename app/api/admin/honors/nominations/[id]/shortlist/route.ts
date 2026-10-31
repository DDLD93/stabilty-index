import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { audit } from "@/lib/admin/audit";
import { adminOrResponse, parseBody } from "@/lib/admin/guard";
import { LIMITS } from "@/lib/honors/constants";

export const dynamic = "force-dynamic";

const bodySchema = z.object({
  displayName: z.string().trim().min(2).max(160),
  summary: z.string().trim().min(20, "Write a short public summary (at least 20 characters).").max(LIMITS.summary),
});

type Params = { params: Promise<{ id: string }> };

/** Turn a nomination into a finalist (several nominations for the same nominee can share one finalist; shortlist one). */
export async function POST(req: Request, { params }: Params) {
  const guard = await adminOrResponse();
  if (guard instanceof NextResponse) return guard;
  const { id } = await params;
  const body = await parseBody(req, bodySchema);
  if (body instanceof NextResponse) return body;

  const nomination = await db.honorsNomination.findUnique({ where: { id }, include: { finalist: true, edition: { select: { status: true } } } });
  if (!nomination) return NextResponse.json({ error: "Nomination not found." }, { status: 404 });
  if (nomination.finalist) return NextResponse.json({ error: "Already a finalist." }, { status: 409 });
  if (!["NOMINATIONS_OPEN", "SHORTLISTING"].includes(nomination.edition.status)) {
    return NextResponse.json({ error: "Finalists can only be added before voting opens." }, { status: 409 });
  }

  const last = await db.honorsFinalist.findFirst({ where: { categoryId: nomination.categoryId }, orderBy: { sortOrder: "desc" }, select: { sortOrder: true } });
  const finalist = await db.$transaction(async (tx) => {
    const f = await tx.honorsFinalist.create({
      data: {
        editionId: nomination.editionId,
        categoryId: nomination.categoryId,
        nominationId: nomination.id,
        displayName: body.displayName,
        nomineeType: nomination.nomineeType,
        state: nomination.nomineeState,
        summary: body.summary,
        sortOrder: (last?.sortOrder ?? 0) + 1,
      },
      select: { id: true },
    });
    await tx.honorsNomination.update({ where: { id }, data: { status: "SHORTLISTED", reviewedAt: new Date() } });
    return f;
  });
  await audit(guard.adminUserId, "HonorsShortlist", { nominationId: id, finalistId: finalist.id });
  return NextResponse.json({ id: finalist.id }, { status: 201 });
}
