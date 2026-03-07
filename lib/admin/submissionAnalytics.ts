import { db } from "@/lib/db";
import { PILLAR_KEYS } from "@/lib/constants";

export type SubmissionAnalyticsResult = {
  overallAvgScore: number | null;
  avgPerPillar: Record<string, number>;
  moodDistribution: Record<string, number>;
  oneWordCounts: { word: string; count: number }[];
  spotlightByState: Record<string, number>;
  spotlightByTag: Record<string, number>;
  submissionCount: number;
  avgScoreByMood: Record<string, number>;
  avgScoreByState: Record<string, number>;
  scoreDistribution: Record<string, number>;
};

function scoreToBucket(score: number): string {
  if (score <= 3) return "1-3";
  if (score <= 6) return "4-6";
  return "7-10";
}

export async function getSubmissionAnalytics(
  cycleId: string
): Promise<SubmissionAnalyticsResult> {
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

  const submissionCount = submissions.length;

  const scores = submissions
    .map((s) => s.stabilityScore)
    .filter((n): n is number => n != null);
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

  const moodScoreSum: Record<string, number> = {};
  const moodScoreCount: Record<string, number> = {};
  for (const s of submissions) {
    const m = s.mood?.trim();
    const score = s.stabilityScore;
    if (m && typeof score === "number") {
      moodScoreSum[m] = (moodScoreSum[m] ?? 0) + score;
      moodScoreCount[m] = (moodScoreCount[m] ?? 0) + 1;
    }
  }
  const avgScoreByMood: Record<string, number> = {};
  for (const m of Object.keys(moodScoreCount)) {
    const n = moodScoreCount[m];
    if (n > 0) avgScoreByMood[m] = moodScoreSum[m]! / n;
  }

  const stateScoreSum: Record<string, number> = {};
  const stateScoreCount: Record<string, number> = {};
  for (const s of submissions) {
    const state = s.spotlightState?.trim();
    const score = s.stabilityScore;
    if (state && typeof score === "number") {
      stateScoreSum[state] = (stateScoreSum[state] ?? 0) + score;
      stateScoreCount[state] = (stateScoreCount[state] ?? 0) + 1;
    }
  }
  const avgScoreByState: Record<string, number> = {};
  for (const state of Object.keys(stateScoreCount)) {
    const n = stateScoreCount[state];
    if (n > 0) avgScoreByState[state] = stateScoreSum[state]! / n;
  }

  const scoreDistribution: Record<string, number> = {
    "1-3": 0,
    "4-6": 0,
    "7-10": 0,
  };
  for (const s of submissions) {
    const score = s.stabilityScore;
    if (typeof score === "number") {
      const bucket = scoreToBucket(score);
      scoreDistribution[bucket] = (scoreDistribution[bucket] ?? 0) + 1;
    }
  }

  return {
    overallAvgScore,
    avgPerPillar,
    moodDistribution,
    oneWordCounts,
    spotlightByState,
    spotlightByTag,
    submissionCount,
    avgScoreByMood,
    avgScoreByState,
    scoreDistribution,
  };
}
