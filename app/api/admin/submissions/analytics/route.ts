import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdminSession } from "@/lib/adminSession";
import { PILLAR_KEYS } from "@/lib/constants";

export async function GET(req: Request) {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const url = new URL(req.url);
  let cycleId = url.searchParams.get("cycleId")?.trim() || null;

  if (!cycleId) {
    const current = await db.cycle.findFirst({
      orderBy: { createdAt: "desc" },
      select: { id: true },
    });
    cycleId = current?.id ?? null;
  }

  if (!cycleId) {
    return NextResponse.json({
      overallAvgScore: null,
      avgPerPillar: {} as Record<string, number>,
      moodDistribution: {} as Record<string, number>,
      oneWordCounts: [] as { word: string; count: number }[],
      spotlightByState: {} as Record<string, number>,
      spotlightByTag: {} as Record<string, number>,
    });
  }

  const submissions = await db.submission.findMany({
    where: { cycleId, isFlagged: false },
    select: {
      stabilityScore: true,
      mood: true,
      oneWord: true,
      pillarResponses: true,
      spotlightState: true,
      spotlightTags: true,
    },
  });

  const scores = submissions.map((s) => s.stabilityScore).filter((n): n is number => n != null);
  const overallAvgScore =
    scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : null;

  const pillarSums: Record<string, number> = {};
  const pillarCounts: Record<string, number> = {};
  for (const key of PILLAR_KEYS) {
    pillarSums[key] = 0;
    pillarCounts[key] = 0;
  }
  for (const s of submissions) {
    const pr = (s.pillarResponses ?? {}) as Record<string, number>;
    for (const key of PILLAR_KEYS) {
      const v = pr[key];
      if (typeof v === "number") {
        pillarSums[key] += v;
        pillarCounts[key]++;
      }
    }
  }
  const avgPerPillar: Record<string, number> = {};
  for (const key of PILLAR_KEYS) {
    avgPerPillar[key] =
      pillarCounts[key] > 0 ? pillarSums[key] / pillarCounts[key] : 0;
  }

  const moodDistribution: Record<string, number> = {};
  for (const s of submissions) {
    const m = s.mood?.trim();
    if (m) {
      moodDistribution[m] = (moodDistribution[m] ?? 0) + 1;
    }
  }

  const oneWordMap: Record<string, number> = {};
  for (const s of submissions) {
    const w = s.oneWord?.trim().toLowerCase();
    if (w) {
      oneWordMap[w] = (oneWordMap[w] ?? 0) + 1;
    }
  }
  const oneWordCounts = Object.entries(oneWordMap)
    .map(([word, count]) => ({ word, count }))
    .sort((a, b) => b.count - a.count);

  const spotlightByState: Record<string, number> = {};
  for (const s of submissions) {
    const state = s.spotlightState?.trim();
    if (state) {
      spotlightByState[state] = (spotlightByState[state] ?? 0) + 1;
    }
  }

  const spotlightByTag: Record<string, number> = {};
  for (const s of submissions) {
    for (const tag of s.spotlightTags ?? []) {
      const t = tag?.trim();
      if (t) {
        spotlightByTag[t] = (spotlightByTag[t] ?? 0) + 1;
      }
    }
  }

  return NextResponse.json({
    overallAvgScore,
    avgPerPillar,
    moodDistribution,
    oneWordCounts,
    spotlightByState,
    spotlightByTag,
  });
}
