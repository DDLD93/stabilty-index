import { getPublicSystemState } from "@/lib/systemState";
import { PublicationDashboard } from "@/components/publication/PublicationDashboard";
import { PublicSubmissionCard } from "@/components/submission/PublicSubmissionCard";
import {
  PillarEconomyIcon,
  PillarGovernanceIcon,
  PillarInvestorIcon,
  PillarSecurityIcon,
  PillarSocialIcon,
} from "@/components/public/icons";
import { RulerGauge } from "@/components/public/RulerGauge";
import Link from "next/link";

export const dynamic = "force-dynamic";

type Pillar = { title: string; score: number; summary?: string };

function safeArray<T>(v: unknown): T[] {
  return Array.isArray(v) ? (v as T[]) : [];
}

function safeNumber(v: unknown): number | null {
  const n = typeof v === "number" ? v : Number(v);
  return Number.isFinite(n) ? n : null;
}

export default async function Home() {
  const state = await getPublicSystemState();
  const latest = state.latestPublishedSnapshot;

  const pillars = safeArray<Pillar>(
    ((latest?.pillarScores as { pillars?: unknown })?.pillars ??
      latest?.pillarScores) as unknown
  );
  const sentiment = (latest?.publicSentimentSummary ?? {}) as {
    averagePublicScore?: unknown;
    topMood?: unknown;
  };
  const avgPublic = safeNumber(sentiment.averagePublicScore);
  const topMood =
    typeof sentiment.topMood === "string" ? sentiment.topMood : null;
  const displayScore = latest ? latest.overallScore : null;

  const fallbackPillars: Pillar[] = [
    { title: "Security", score: 6.5, summary: "Order holds despite threats." },
    { title: "FX & Economy", score: 6.0, summary: "Fragile, but stabilizing." },
    {
      title: "Investor Confidence",
      score: 6.5,
      summary: "Capital is cautious.",
    },
    { title: "Governance", score: 7.0, summary: "Direction is consistent." },
    { title: "Social Stability", score: 7.0, summary: "Tensions, but calm." },
  ];
  const pillarList = pillars.length ? pillars : fallbackPillars;

  const IconFor = (title: string) => {
    const t = title.toLowerCase();
    if (t.includes("security")) return PillarSecurityIcon;
    if (t.includes("econom")) return PillarEconomyIcon;
    if (t.includes("invest")) return PillarInvestorIcon;
    if (t.includes("govern")) return PillarGovernanceIcon;
    return PillarSocialIcon;
  };

  return (
    <main className="mx-auto w-full max-w-7xl px-6 pb-14 pt-10">
      {/* Hero Section */}
      <section className="nsi-section-card relative overflow-hidden rounded-[32px] px-8 py-10 md:px-12">
        {/* Background decorative gradient */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(ellipse 60% 50% at 80% 20%, oklch(0.35 0.05 164 / 0.15), transparent 50%), radial-gradient(ellipse 40% 40% at 15% 80%, oklch(0.3 0.04 164 / 0.1), transparent 50%)",
          }}
        />

        <div className="relative grid gap-10 md:grid-cols-2 md:items-center">
          {/* Left - Title and CTA */}
          <div>
            <h1 className="text-4xl font-semibold leading-tight tracking-tight text-[color:var(--nsi-ink)] md:text-5xl">
              Tracking How Nigeria
              <br />
              Is Holding Together
            </h1>
            <p className="mt-4 max-w-xl text-base leading-7 text-[color:var(--nsi-ink-soft)]">
              Beyond the noise: A calm pulse on security, economy, and
              stability.
            </p>
            <div className="mt-6">
              <Link
                href="/reports"
                className="inline-flex items-center rounded-lg bg-[color:var(--nsi-gold)] px-6 py-3 text-sm font-semibold text-black shadow-sm transition-all hover:brightness-[0.97]"
              >
                Check Nigeria's Stability Now
              </Link>
            </div>
          </div>

          {/* Right - Score Display */}
          <div className="flex flex-col items-center justify-center rounded-3xl border-2 border-black/15 bg-white/80 px-8 py-8 backdrop-blur-sm">
            <div className="flex items-baseline gap-1">
              <span className="text-7xl font-semibold tracking-tight text-[color:var(--nsi-green)] md:text-8xl">
                {displayScore !== null ? displayScore.toFixed(1) : "6.6"}
              </span>
              <span className="text-3xl text-black/50">/10</span>
            </div>
            <div className="mt-3 text-center">
              <div className="text-base font-semibold text-[color:var(--nsi-green-ink)]">
                Nigeria's Stability Today
              </div>
              <div className="mt-1 font-serif text-base italic text-black/70">
                {state.phase === "PUBLICATION_LIVE"
                  ? "Cautiously Stable"
                  : "Cautiously Stable"}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pillar Cards Section */}
      <section className="mt-8 grid gap-4 sm:grid-cols-2 md:grid-cols-5">
        {pillarList.slice(0, 5).map((p) => {
          const Icon = IconFor(p.title);
          return (
            <div key={p.title} className="nsi-pillar-card">
              {/* Icon header */}
              <div className="nsi-pillar-header">
                <Icon className="h-12 w-12" />
              </div>
              {/* Content */}
              <div className="px-4 pb-4 pt-3">
                <div className="flex items-baseline justify-between gap-2">
                  <div className="text-sm font-semibold text-[color:var(--nsi-ink)]">
                    {p.title}
                  </div>
                  <div className="text-sm font-bold text-[color:var(--nsi-green)]">
                    {Number.isFinite(p.score) ? Number(p.score).toFixed(1) : "—"}
                  </div>
                </div>
                <div className="mt-2 text-xs italic leading-5 text-black/60">
                  {p.summary ?? ""}
                </div>
              </div>
            </div>
          );
        })}
      </section>

      {/* Mood Check-in Section */}
      <section className="mt-8 nsi-section-card rounded-[28px] px-8 py-8">
        <div className="text-center">
          <h2 className="font-serif text-xl font-semibold text-[color:var(--nsi-ink)]">
            How <span className="text-[color:var(--nsi-green)]">stable</span>{" "}
            does Nigeria feel to you right now?
          </h2>
          <div className="mt-5 flex flex-wrap justify-center gap-3">
            {["Calm", "Hopeful", "Tired", "Tense", "Optimistic", "Uncertain"].map(
              (m, idx) => (
                <button
                  key={m}
                  type="button"
                  className={`nsi-mood-pill ${m === "Tense" ? "active" : ""}`}
                >
                  {m}
                </button>
              )
            )}
          </div>
          <div className="mt-4 text-sm text-black/60">
            Top mood this week:{" "}
            <span className="font-serif italic text-black/80">
              {topMood ? `"${topMood}"` : '"Cautiously hopeful"'}
            </span>
          </div>
        </div>
      </section>

      {/* Monthly Report Section */}
      <section className="mt-8 grid gap-6 md:grid-cols-2">
        {/* Left - NSI Description with Ruler Gauge */}
        <div className="nsi-section-card rounded-[28px] p-8">
          <div className="flex items-baseline gap-2">
            <h3 className="font-serif text-xl font-semibold text-[color:var(--nsi-ink)]">
              Nigeria Stability Index
            </h3>
            <span className="text-lg text-black/50">(NSI)</span>
          </div>
          <div className="mt-1 text-sm text-black/60">
            {latest?.period ?? "January 2026"} Report
          </div>

          {/* Ruler Gauge */}
          <div className="mt-6">
            <RulerGauge
              value={avgPublic ?? displayScore ?? 6.3}
              label="Current public rating gauge"
            />
            <div className="mt-2 text-xs text-black/55">
              Current public rating:{" "}
              <span className="font-semibold text-[color:var(--nsi-ink)]">
                {(avgPublic ?? displayScore ?? 6.3).toFixed(1)}/10
              </span>
            </div>
          </div>

          <p className="mt-6 text-sm leading-6 text-black/70">
            The Nigeria Stability Index (NSI) is a civic project tracking the
            country's stability through data, public sentiment, and calm
            analysis.
          </p>
          <p className="mt-4 text-sm text-black/70">
            A project of the{" "}
            <span className="font-semibold text-[color:var(--nsi-green)]">
              24 Angels Initiative
            </span>
            .
          </p>
        </div>

        {/* Right - Report Breakdown */}
        <div className="overflow-hidden rounded-[28px] border-2 border-black/15 bg-white shadow-sm">
          {/* Header */}
          <div className="nsi-report-header">
            {latest?.period ?? "January 2026"} Report
          </div>

          {/* Scores */}
          <div className="px-6 py-6">
            <div className="space-y-3">
              {pillarList.slice(0, 5).map((p) => (
                <div
                  key={p.title}
                  className="flex items-center justify-between border-b border-black/8 pb-3 last:border-0"
                >
                  <span className="text-sm text-black/75">{p.title}</span>
                  <span className="text-lg font-semibold text-[color:var(--nsi-green)]">
                    {Number.isFinite(p.score)
                      ? Number(p.score).toFixed(1)
                      : "—"}
                  </span>
                </div>
              ))}
            </div>

            {/* Download Button */}
            <Link
              href={latest ? `/reports/${latest.id}` : "/reports"}
              className="mt-6 flex w-full items-center justify-center rounded-lg bg-[color:var(--nsi-green)] px-5 py-3 text-sm font-semibold text-white transition-all hover:brightness-[1.05]"
            >
              Download Full Report (PDF)
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="mt-10 overflow-hidden rounded-[28px] border-2 border-white/20 bg-[color:var(--nsi-green)]">
        <div className="grid gap-6 px-8 py-8 md:grid-cols-2 md:items-center">
          <div className="text-white">
            <h3 className="text-xl font-semibold">
              Be part of Nigeria's stability check-in.
            </h3>
            <p className="mt-1 text-sm opacity-85">
              Get monthly updates and reports.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <input
              className="h-11 w-full rounded-md border border-white/20 bg-white/10 px-4 text-sm text-white placeholder:text-white/60 outline-none focus:border-white/40 sm:max-w-xs"
              placeholder="Email"
              type="email"
            />
            <Link
              href="/subscribe"
              className="inline-flex h-11 items-center justify-center rounded-md bg-[color:var(--nsi-gold)] px-6 text-sm font-semibold text-black transition-all hover:brightness-[0.97]"
            >
              Subscribe
            </Link>
          </div>
        </div>
        {/* 24 Angels branding */}
        <div className="flex items-center justify-end border-t border-white/15 px-8 py-4">
          <div className="text-right text-white">
            <div className="text-xs opacity-70">A project of</div>
            <div className="font-serif text-lg font-semibold tracking-tight">
              <span className="text-[color:var(--nsi-gold)]">'24</span> Angels
              Initiative
            </div>
          </div>
        </div>
      </section>

      {/* Collection Open Section */}
      {state.phase === "COLLECTION_OPEN" ? (
        <section className="mt-12">
          <PublicSubmissionCard />
        </section>
      ) : null}

      {/* Processing Closed Section */}
      {state.phase === "PROCESSING_CLOSED" ? (
        <section className="mt-12 nsi-section-card rounded-[28px] p-8">
          <h2 className="font-serif text-2xl font-semibold tracking-tight text-[color:var(--nsi-green)]">
            Collection is closed for this cycle
          </h2>
          <p className="mt-3 text-black/70">
            We're compiling submissions into the next stability snapshot. Check
            back soon for the published report.
          </p>
        </section>
      ) : null}

      {/* Publication Live Section */}
      {state.phase === "PUBLICATION_LIVE" ? (
        <section className="mt-12">
          <PublicationDashboard snapshotId={latest?.id ?? null} />
        </section>
      ) : null}
    </main>
  );
}
