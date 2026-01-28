import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireAdminSession } from "@/lib/adminSession";

const bodySchema = z.object({
  flagged: z.boolean(),
});

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const json = await req.json().catch(() => null);
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: "Invalid payload." }, { status: 400 });

  const updated = await db.submission.update({
    where: { id },
    data: { isFlagged: parsed.data.flagged },
  });

  await db.auditLog.create({
    data: {
      adminUserId: (session.user as { id?: string } | undefined)?.id,
      action: parsed.data.flagged ? "AdminFlagSubmission" : "AdminUnflagSubmission",
      metadata: { submissionId: id },
    },
  });

  return NextResponse.json({ ok: true, submission: { id: updated.id, isFlagged: updated.isFlagged } });
}

