import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdminSession } from "@/lib/adminSession";

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
  if (snapshot.isLocked) return NextResponse.json({ error: "Snapshot is locked." }, { status: 409 });

  const updated = await db.snapshot.update({
    where: { id },
    data: { publishedAt: snapshot.publishedAt ?? new Date() },
  });

  await db.auditLog.create({
    data: {
      adminUserId: (session.user as { id?: string } | undefined)?.id,
      action: "AdminPublishSnapshot",
      metadata: { snapshotId: updated.id },
    },
  });

  return NextResponse.json({ snapshot: updated });
}

