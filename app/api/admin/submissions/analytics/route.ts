import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdminSession } from "@/lib/adminSession";
import { getSubmissionAnalytics } from "@/lib/admin/submissionAnalytics";

const emptyAnalytics = {
  overallAvgScore: null as number | null,
  avgPerPillar: {} as Record<string, number>,
  moodDistribution: {} as Record<string, number>,
  oneWordCounts: [] as { word: string; count: number }[],
  spotlightByState: {} as Record<string, number>,
  spotlightByTag: {} as Record<string, number>,
  submissionCount: 0,
  avgScoreByMood: {} as Record<string, number>,
  avgScoreByState: {} as Record<string, number>,
  scoreDistribution: {} as Record<string, number>,
};

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
    return NextResponse.json(emptyAnalytics);
  }

  const result = await getSubmissionAnalytics(cycleId);
  return NextResponse.json(result);
}
