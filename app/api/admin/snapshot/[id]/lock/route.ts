import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdminSession, getAuditAdminUserId } from "@/lib/adminSession";

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const snapshot = await db.snapshot.findUnique({
    where: { id },
    select: { id: true, isLocked: true, publishedAt: true },
  });
  if (!snapshot) return NextResponse.json({ error: "Not found." }, { status: 404 });
  if (snapshot.isLocked) return NextResponse.json({ error: "Snapshot is already locked." }, { status: 409 });
  if (!snapshot.publishedAt) return NextResponse.json({ error: "Publish before locking." }, { status: 409 });

  const updated = await db.snapshot.update({
    where: { id },
    data: { isLocked: true },
  });

  const adminUserId = await getAuditAdminUserId(session);
  await db.auditLog.create({
    data: {
      ...(adminUserId ? { adminUserId } : {}),
      action: "AdminLockSnapshot",
      metadata: { snapshotId: updated.id },
    },
  });

  return NextResponse.json({ snapshot: updated });
}

