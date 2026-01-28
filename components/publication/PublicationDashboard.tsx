import { db } from "@/lib/db";
import { PublicationPoster } from "@/components/publication/PublicationPoster";

type Pillar = { title: string; score: number; summary?: string };
type Spotlight = { state?: string; score?: number; bullets?: string[] };
type Sentiment = { topWords?: string[]; averagePublicScore?: number; topMood?: string };

function safeArray<T>(v: unknown): T[] {
  return Array.isArray(v) ? (v as T[]) : [];
}

function safeNumber(v: unknown): number | null {
  const n = typeof v === "number" ? v : Number(v);
  return Number.isFinite(n) ? n : null;
}

export async function PublicationDashboard({ snapshotId }: { snapshotId: string | null }) {
  if (!snapshotId) {
    return (
      <div className="rounded-3xl border border-black/10 bg-white p-8">
        <h2 className="font-serif text-2xl font-semibold tracking-tight text-[color:var(--nsi-green)]">
          Latest report
        </h2>
        <p className="mt-2 text-black/70">No published snapshot is available yet.</p>
      </div>
    );
  }

  const snapshot = await db.snapshot.findUnique({
    where: { id: snapshotId },
    select: {
      period: true,
      overallScore: true,
      overallNarrative: true,
      pillarScores: true,
      stateSpotlightContent: true,
      publicSentimentSummary: true,
    },
  });

  if (!snapshot) {
    return (
      <div className="rounded-3xl border border-black/10 bg-white p-8">
        <p className="text-black/70">Snapshot not found.</p>
      </div>
    );
  }

  const pillars = safeArray<Pillar>((snapshot.pillarScores as { pillars?: unknown })?.pillars ?? snapshot.pillarScores);
  const spotlight = (snapshot.stateSpotlightContent ?? {}) as Spotlight;
  const sentiment = (snapshot.publicSentimentSummary ?? {}) as Sentiment;
  const avgPublic = safeNumber(sentiment.averagePublicScore) ?? undefined;
  const topWords = safeArray<string>(sentiment.topWords);

  return (
    <PublicationPoster
      snapshotId={snapshotId}
      period={snapshot.period}
      overallScore={snapshot.overallScore}
      overallNarrative={snapshot.overallNarrative}
      pillars={
        pillars.length
          ? pillars
          : [
              { title: "Security", score: 0, summary: "—" },
              { title: "FX & Economy", score: 0, summary: "—" },
              { title: "Investor Confidence", score: 0, summary: "—" },
              { title: "Governance", score: 0, summary: "—" },
              { title: "Social Stability", score: 0, summary: "—" },
            ]
      }
      spotlight={{
        state: spotlight.state,
        score: safeNumber(spotlight.score) ?? undefined,
        bullets: safeArray<string>(spotlight.bullets),
      }}
      sentiment={{
        topWords,
        averagePublicScore: avgPublic,
        topMood: sentiment.topMood,
      }}
    />
  );
}

