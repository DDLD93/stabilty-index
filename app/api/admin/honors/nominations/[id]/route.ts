import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { audit } from "@/lib/admin/audit";
import { adminOrResponse, parseBody } from "@/lib/admin/guard";

export const dynamic = "force-dynamic";

const patchSchema = z.object({
  status: z.enum(["PENDING", "REJECTED", "DUPLICATE"]).optional(),
  duplicateOfReference: z.string().trim().max(20).nullable().optional(),
  adminNote: z.string().trim().max(1000).nullable().optional(),
});

type Params = { params: Promise<{ id: string }> };

/** Review a nomination: reject, mark duplicate, reset, or add a note. Shortlisting has its own route. */
export async function PATCH(req: Request, { params }: Params) {
  const guard = await adminOrResponse();
  if (guard instanceof NextResponse) return guard;
  const { id } = await params;
  const body = await parseBody(req, patchSchema);
  if (body instanceof NextResponse) return body;

  const nomination = await db.honorsNomination.findUnique({ where: { id }, include: { finalist: { select: { id: true } } } });
  if (!nomination) return NextResponse.json({ error: "Nomination not found." }, { status: 404 });
  if (body.status && nomination.finalist) {
    return NextResponse.json({ error: "This nomination is already a finalist. Withdraw the finalist first." }, { status: 409 });
  }

  let duplicateOfId: string | null | undefined;
  if (body.status === "DUPLICATE") {
    if (!body.duplicateOfReference) return NextResponse.json({ error: "Give the reference of the original nomination." }, { status: 400 });
    const original = await db.honorsNomination.findUnique({ where: { reference: body.duplicateOfReference.toUpperCase() }, select: { id: true } });
    if (!original || original.id === id) return NextResponse.json({ error: "No other nomination has that reference." }, { status: 400 });
    duplicateOfId = original.id;
  } else if (body.status) {
    duplicateOfId = null;
  }

  await db.honorsNomination.update({
    where: { id },
    data: {
      ...(body.status ? { status: body.status, reviewedAt: new Date() } : {}),
      ...(duplicateOfId !== undefined ? { duplicateOfId } : {}),
      ...(body.adminNote !== undefined ? { adminNote: body.adminNote } : {}),
    },
  });
  await audit(guard.adminUserId, "HonorsNominationReview", { nominationId: id, status: body.status ?? null, noted: body.adminNote !== undefined });
  return NextResponse.json({ ok: true });
}
