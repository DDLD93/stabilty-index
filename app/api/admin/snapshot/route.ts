import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireAdminSession } from "@/lib/adminSession";
import { Prisma } from "@prisma/client";

const listSchema = z.object({
  take: z.coerce.number().int().min(1).max(50).default(20),
});

const upsertSchema = z.object({
  id: z.string().optional(),
  cycleId: z.string().nullable().optional(),
  period: z.string().min(3).max(60),
  overallScore: z.number().min(0).max(10),
  overallNarrative: z.string().min(1).max(2000),
  pillarScores: z.unknown(),
  stateSpotlightContent: z.unknown(),
  publicSentimentSummary: z.unknown(),
});

export async function GET(req: Request) {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const url = new URL(req.url);
  const parsed = listSchema.safeParse({ take: url.searchParams.get("take") ?? undefined });
  if (!parsed.success) return NextResponse.json({ error: "Invalid query." }, { status: 400 });

  const items = await db.snapshot.findMany({
    take: parsed.data.take,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      period: true,
      overallScore: true,
      publishedAt: true,
      isLocked: true,
      createdAt: true,
      cycleId: true,
    },
  });

  return NextResponse.json({ items });
}

export async function POST(req: Request) {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const json = await req.json().catch(() => null);
  const parsed = upsertSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid snapshot payload.", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const data = parsed.data;

  if (data.id) {
    const existing = await db.snapshot.findUnique({ where: { id: data.id }, select: { isLocked: true } });
    if (!existing) return NextResponse.json({ error: "Not found." }, { status: 404 });
    if (existing.isLocked) return NextResponse.json({ error: "Snapshot is locked." }, { status: 409 });

    const cycleLink: Pick<Prisma.SnapshotUpdateInput, "cycle"> =
      data.cycleId === undefined
        ? {}
        : data.cycleId === null
          ? { cycle: { disconnect: true } }
          : { cycle: { connect: { id: data.cycleId } } };

    const updated = await db.snapshot.update({
      where: { id: data.id },
      data: {
        period: data.period,
        overallScore: data.overallScore,
        overallNarrative: data.overallNarrative,
        pillarScores: data.pillarScores as Prisma.InputJsonValue,
        stateSpotlightContent: data.stateSpotlightContent as Prisma.InputJsonValue,
        publicSentimentSummary: data.publicSentimentSummary as Prisma.InputJsonValue,
        ...cycleLink,
      },
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

  const createCycleLink: Pick<Prisma.SnapshotCreateInput, "cycle"> =
    data.cycleId && data.cycleId.length ? { cycle: { connect: { id: data.cycleId } } } : {};

  const created = await db.snapshot.create({
    data: {
      period: data.period,
      overallScore: data.overallScore,
      overallNarrative: data.overallNarrative,
      pillarScores: data.pillarScores as Prisma.InputJsonValue,
      stateSpotlightContent: data.stateSpotlightContent as Prisma.InputJsonValue,
      publicSentimentSummary: data.publicSentimentSummary as Prisma.InputJsonValue,
      ...createCycleLink,
    },
  });

  await db.auditLog.create({
    data: {
      adminUserId: (session.user as { id?: string } | undefined)?.id,
      action: "AdminCreateSnapshotDraft",
      metadata: { snapshotId: created.id },
    },
  });

  return NextResponse.json({ snapshot: created });
}

