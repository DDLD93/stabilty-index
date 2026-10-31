import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { audit } from "@/lib/admin/audit";
import { adminOrResponse, parseBody } from "@/lib/admin/guard";

export const dynamic = "force-dynamic";

const bodySchema = z.object({
  editionId: z.string().min(1),
  by: z.enum(["ipHash", "deviceHash"]),
  value: z.string().min(16).max(128),
  void: z.boolean(),
  reason: z.string().trim().min(10, "Give a reason of at least 10 characters.").max(500),
});

/** Void (or restore) every vote from one network or device in an edition. Recorded in the audit log. */
export async function POST(req: Request) {
  const guard = await adminOrResponse();
  if (guard instanceof NextResponse) return guard;
  const body = await parseBody(req, bodySchema);
  if (body instanceof NextResponse) return body;

  const edition = await db.honorsEdition.findUnique({ where: { id: body.editionId }, select: { status: true } });
  if (!edition) return NextResponse.json({ error: "Edition not found." }, { status: 404 });
  if (["ANNOUNCED", "ARCHIVED"].includes(edition.status)) {
    return NextResponse.json({ error: "Votes can’t change after winners are announced." }, { status: 409 });
  }

  const result = await db.honorsVote.updateMany({
    where: { editionId: body.editionId, [body.by]: body.value },
    data: body.void ? { isVoid: true, voidReason: body.reason } : { isVoid: false, voidReason: null },
  });
  await audit(guard.adminUserId, body.void ? "HonorsVotesVoid" : "HonorsVotesRestore", {
    editionId: body.editionId,
    by: body.by,
    value: body.value.slice(0, 12),
    count: result.count,
    reason: body.reason,
  });
  return NextResponse.json({ ok: true, count: result.count });
}
