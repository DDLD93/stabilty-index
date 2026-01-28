import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";

export type PublicPhase =
  | "COLLECTION_OPEN"
  | "PROCESSING_CLOSED"
  | "PUBLICATION_LIVE";

export type PublicSystemState = {
  phase: PublicPhase;
  currentCycle: { id: string; status: "OPEN" | "CLOSED" | "ARCHIVED"; monthYear: string } | null;
  latestPublishedSnapshot:
    | {
        id: string;
        period: string;
        overallScore: number;
        overallNarrative?: string | null;
        pillarScores?: unknown;
        publicSentimentSummary?: unknown;
      }
    | null;
};

function isMissingTableError(error: unknown) {
  // Prisma uses P2021 when a table/view isn't present in the connected database.
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2021";
}

export async function getPublicSystemState(): Promise<PublicSystemState> {
  let currentCycle: { id: string; status: "OPEN" | "CLOSED" | "ARCHIVED"; monthYear: string } | null = null;
  let latestPublishedSnapshot:
    | {
        id: string;
        period: string;
        overallScore: number;
        cycleId: string | null;
        overallNarrative?: string | null;
        pillarScores?: unknown;
        publicSentimentSummary?: unknown;
      }
    | null = null;

  try {
    currentCycle = await db.cycle.findFirst({
      orderBy: { createdAt: "desc" },
      select: { id: true, status: true, monthYear: true },
    });

    latestPublishedSnapshot = await db.snapshot.findFirst({
      where: { publishedAt: { not: null } },
      orderBy: { publishedAt: "desc" },
      select: {
        id: true,
        period: true,
        overallScore: true,
        cycleId: true,
        overallNarrative: true,
        pillarScores: true,
        publicSentimentSummary: true,
      },
    });
  } catch (error) {
    // Allow the app to boot on a fresh database before migrations are applied.
    if (isMissingTableError(error)) {
      return { phase: "COLLECTION_OPEN", currentCycle: null, latestPublishedSnapshot: null };
    }
    throw error;
  }

  // If no cycle exists yet, treat as collection open (admin can still set it up).
  if (!currentCycle) {
    return { phase: "COLLECTION_OPEN", currentCycle: null, latestPublishedSnapshot: null };
  }

  const hasPublishedForCurrent = await db.snapshot.findFirst({
    where: { cycleId: currentCycle.id, publishedAt: { not: null } },
    select: { id: true },
  });

  // Per plan: current cycle state takes precedence over past publications.
  if (currentCycle.status === "OPEN" && !hasPublishedForCurrent) {
    return {
      phase: "COLLECTION_OPEN",
      currentCycle,
      latestPublishedSnapshot: latestPublishedSnapshot
        ? {
            id: latestPublishedSnapshot.id,
            period: latestPublishedSnapshot.period,
            overallScore: latestPublishedSnapshot.overallScore,
            overallNarrative: latestPublishedSnapshot.overallNarrative,
            pillarScores: latestPublishedSnapshot.pillarScores,
            publicSentimentSummary: latestPublishedSnapshot.publicSentimentSummary,
          }
        : null,
    };
  }

  if (currentCycle.status === "CLOSED" && !hasPublishedForCurrent) {
    return {
      phase: "PROCESSING_CLOSED",
      currentCycle,
      latestPublishedSnapshot: latestPublishedSnapshot
        ? {
            id: latestPublishedSnapshot.id,
            period: latestPublishedSnapshot.period,
            overallScore: latestPublishedSnapshot.overallScore,
            overallNarrative: latestPublishedSnapshot.overallNarrative,
            pillarScores: latestPublishedSnapshot.pillarScores,
            publicSentimentSummary: latestPublishedSnapshot.publicSentimentSummary,
          }
        : null,
    };
  }

  if (latestPublishedSnapshot) {
    return {
      phase: "PUBLICATION_LIVE",
      currentCycle,
      latestPublishedSnapshot: {
        id: latestPublishedSnapshot.id,
        period: latestPublishedSnapshot.period,
        overallScore: latestPublishedSnapshot.overallScore,
        overallNarrative: latestPublishedSnapshot.overallNarrative,
        pillarScores: latestPublishedSnapshot.pillarScores,
        publicSentimentSummary: latestPublishedSnapshot.publicSentimentSummary,
      },
    };
  }

  return { phase: "COLLECTION_OPEN", currentCycle, latestPublishedSnapshot: null };
}

