import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireAdminSession } from "@/lib/adminSession";
import { Prisma } from "@prisma/client";

const updateSchema = z.object({
  period: z.string().min(3).max(60).optional(),
  overallScore: z.number().min(0).max(10).optional(),
  overallNarrative: z.string().min(1).max(2000).optional(),
  pillarScores: z.unknown().optional(),
  stateSpotlightContent: z.unknown().optional(),
  publicSentimentSummary: z.unknown().optional(),
  cycleId: z.string().nullable().optional(),
});

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const snapshot = await db.snapshot.findUnique({ where: { id } });
  if (!snapshot) return NextResponse.json({ error: "Not found." }, { status: 404 });
  return NextResponse.json({ snapshot });
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const existing = await db.snapshot.findUnique({ where: { id }, select: { isLocked: true } });
  if (!existing) return NextResponse.json({ error: "Not found." }, { status: 404 });
  if (existing.isLocked) return NextResponse.json({ error: "Snapshot is locked." }, { status: 409 });

  const json = await req.json().catch(() => null);
  const parsed = updateSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid payload.", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const cycleLink: Pick<Prisma.SnapshotUpdateInput, "cycle"> =
    parsed.data.cycleId === undefined
      ? {}
      : parsed.data.cycleId === null
        ? { cycle: { disconnect: true } }
        : { cycle: { connect: { id: parsed.data.cycleId } } };

  const updateData: Prisma.SnapshotUpdateInput = {
    ...(parsed.data.period !== undefined ? { period: parsed.data.period } : {}),
    ...(parsed.data.overallScore !== undefined ? { overallScore: parsed.data.overallScore } : {}),
    ...(parsed.data.overallNarrative !== undefined
      ? { overallNarrative: parsed.data.overallNarrative }
      : {}),
    ...(parsed.data.pillarScores !== undefined
      ? { pillarScores: parsed.data.pillarScores as Prisma.InputJsonValue }
      : {}),
    ...(parsed.data.stateSpotlightContent !== undefined
      ? { stateSpotlightContent: parsed.data.stateSpotlightContent as Prisma.InputJsonValue }
      : {}),
    ...(parsed.data.publicSentimentSummary !== undefined
      ? { publicSentimentSummary: parsed.data.publicSentimentSummary as Prisma.InputJsonValue }
      : {}),
    ...cycleLink,
  };

  const updated = await db.snapshot.update({
    where: { id },
    data: updateData,
  });

  await db.auditLog.create({
    data: {
      adminUserId: (session.user as { id?: string } | undefined)?.id,
      action: "AdminUpdateSnapshot",
      metadata: { snapshotId: updated.id },
    },
  });

  return NextResponse.json({ snapshot: updated });
}

