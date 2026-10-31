import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { audit } from "@/lib/admin/audit";
import { adminOrResponse, parseBody } from "@/lib/admin/guard";
import { NIGERIAN_STATES } from "@/lib/constants";
import { LIMITS } from "@/lib/honors/constants";

export const dynamic = "force-dynamic";

const patchSchema = z.object({
  displayName: z.string().trim().min(2).max(160).optional(),
  state: z.enum(NIGERIAN_STATES).nullable().optional(),
  summary: z.string().trim().min(20).max(LIMITS.summary).optional(),
  sortOrder: z.number().int().min(0).max(1000).optional(),
  isActive: z.boolean().optional(),
});

type Params = { params: Promise<{ id: string }> };

/**
 * Edit or withdraw a finalist. Once voting has opened the name can't change
 * (people voted for it); withdrawing keeps existing votes but leaves them out of the count.
 */
export async function PATCH(req: Request, { params }: Params) {
  const guard = await adminOrResponse();
  if (guard instanceof NextResponse) return guard;
  const { id } = await params;
  const body = await parseBody(req, patchSchema);
  if (body instanceof NextResponse) return body;

  const finalist = await db.honorsFinalist.findUnique({ where: { id }, include: { edition: { select: { status: true } } } });
  if (!finalist) return NextResponse.json({ error: "Finalist not found." }, { status: 404 });
  const votingStarted = ["VOTING_OPEN", "VOTING_CLOSED", "ANNOUNCED", "ARCHIVED"].includes(finalist.edition.status);
  if (votingStarted && body.displayName && body.displayName !== finalist.displayName) {
    return NextResponse.json({ error: "The name can’t change after voting has opened." }, { status: 409 });
  }

  const data = Object.fromEntries(Object.entries(body).filter(([, v]) => v !== undefined));
  await db.$transaction(async (tx) => {
    await tx.honorsFinalist.update({ where: { id }, data });
    if (body.isActive === false && finalist.nominationId) {
      await tx.honorsNomination.update({ where: { id: finalist.nominationId }, data: { status: "PENDING" } });
    }
  });
  await audit(guard.adminUserId, body.isActive === false ? "HonorsFinalistWithdraw" : "HonorsFinalistUpdate", { finalistId: id, fields: Object.keys(data) });
  return NextResponse.json({ ok: true });
}
