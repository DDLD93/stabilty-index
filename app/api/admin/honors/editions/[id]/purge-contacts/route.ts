import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { audit } from "@/lib/admin/audit";
import { adminOrResponse } from "@/lib/admin/guard";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ id: string }> };

/** Delete nominators' names and emails once an edition is archived (as promised in the privacy notice). */
export async function POST(_req: Request, { params }: Params) {
  const guard = await adminOrResponse();
  if (guard instanceof NextResponse) return guard;
  const { id } = await params;
  const edition = await db.honorsEdition.findUnique({ where: { id }, select: { status: true } });
  if (!edition) return NextResponse.json({ error: "Edition not found." }, { status: 404 });
  if (edition.status !== "ARCHIVED") return NextResponse.json({ error: "Archive the edition first." }, { status: 409 });

  const result = await db.honorsNomination.updateMany({ where: { editionId: id }, data: { nominatorName: null, nominatorEmail: null } });
  await db.honorsEdition.update({ where: { id }, data: { contactsPurgedAt: new Date() } });
  await audit(guard.adminUserId, "HonorsPurgeContacts", { editionId: id, nominations: result.count });
  return NextResponse.json({ ok: true, purged: result.count });
}
