import type { Metadata } from "next";
import { getPublicSystemState } from "@/lib/systemState";
import { ScoreRing } from "@/components/public/ScoreRing";
import Link from "next/link";
import { defaultMetadata } from "@/lib/metadata";

export const dynamic = "force-dynamic";

type Pillar = { title: string; score: number; summary?: string };
type StateSpotlight = { state?: string; score?: number; bullets?: string[] };
type InstitutionSpotlight = {
  institution?: string;
  summary?: string;
  bullets?: string[];
};

function safeArray<T>(v: unknown): T[] {
  return Array.isArray(v) ? (v as T[]) : [];
}

function safeString(v: unknown): string {
  return typeof v === "string" && v.length > 0 ? v : "";
}

export async function generateMetadata(): Promise<Metadata> {
  const state = await getPublicSystemState();
  const latest = state.latestPublishedSnapshot;
  const displayScore = latest ? latest.overallScore : 6.6;

  return {
    ...defaultMetadata,
    title: "Home",
    description: `Nigeria Stability Index: ${displayScore.toFixed(1)}/10. Tracking how Nigeria is holding together through security, economy, governance, investor confidence, and social stability.`,
    openGraph: {
      ...defaultMetadata.openGraph,
      title: `Nigeria Stability Index - ${displayScore.toFixed(1)}/10`,
      description: `Current stability score: ${displayScore.toFixed(1)}/10. A calm snapshot of how Nigeria is holding together.`,
    },
    twitter: {
      ...defaultMetadata.twitter,
      title: `Nigeria Stability Index - ${displayScore.toFixed(1)}/10`,
      description: `Current stability score: ${displayScore.toFixed(1)}/10. A calm snapshot of how Nigeria is holding together.`,
    },
  };
}

const PILLAR_NAMES = [
  "Security",
  "FX & Economy",
  "Investor Confidence",
  "Governance",
  "Social Stability",
] as const;

export default async function Home() {
  const state = await getPublicSystemState();
  const latest = state.latestPublishedSnapshot;

  const pillars = safeArray<Pillar>(
    ((latest?.pillarScores as { pillars?: unknown })?.pillars ??
      latest?.pillarScores) as unknown
  );
  const pillarList =
    pillars.length >= 5
      ? pillars.slice(0, 5)
      : PILLAR_NAMES.map((title) => ({
          title,
          score: 0,
          summary: "",
        }));

  const stateSpot = (latest?.stateSpotlightContent ?? {}) as StateSpotlight;
  const instSpot = (latest?.institutionSpotlightContent ??
    {}) as InstitutionSpotlight;

  const stateTitle = safeString(stateSpot.state) || "State Spotlight";
  const stateSummary =
    safeArray<string>(stateSpot.bullets)?.[0] ||
    "Evidence-based highlight from our latest snapshot. Not an endorsement.";

  const instTitle =
    safeString(instSpot.institution) || "Institution Spotlight";
  const instSummary =
    safeString(instSpot.summary) ||
    safeArray<string>(instSpot.bullets)?.[0] ||
    "Evidence-based highlight from our latest snapshot. Not an endorsement.";

  const snapshotHref = latest ? `/reports/${latest.id}` : "/reports";
  const stateHref = latest
    ? `/reports/${latest.id}#state-spotlight`
    : "/spotlights#state-spotlight";
  const instHref = latest
    ? `/reports/${latest.id}#institution-spotlight`
    : "/spotlights#institution-spotlight";

  const displayScore = latest ? latest.overallScore : 6.6;
  const period = latest?.period ?? "January 2026";

  return (
    <main className="mx-auto w-full max-w-7xl px-6 pb-14 pt-10">
      {/* Hero */}
      <section className="nsi-section-card relative overflow-hidden rounded-[32px] px-8 py-12 md:px-14 md:py-14">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(ellipse 70% 60% at 85% 15%, oklch(0.38 0.06 164 / 0.08), transparent 55%), radial-gradient(ellipse 50% 50% at 10% 85%, oklch(0.32 0.05 164 / 0.06), transparent 55%)",
          }}
        />
        <div className="relative">
          <h1 className="font-serif text-4xl font-bold leading-[1.15] tracking-tight text-[color:var(--nsi-ink)] md:text-[3.25rem]">
            Tracking How Nigeria
            <br />
            Is Holding Together
          </h1>
          <p className="mt-5 max-w-xl text-[0.9375rem] leading-7 text-[color:var(--nsi-ink-soft)]">
            Beyond the noise: a calm pulse on security, economy, and stability.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href={snapshotHref}
              className="inline-flex items-center rounded-lg bg-[color:var(--nsi-gold)] px-7 py-3.5 text-sm font-semibold text-[color:var(--nsi-ink)] shadow-md transition-all hover:brightness-[0.96] hover:shadow-lg"
              style={{
                boxShadow: "0 4px 14px -4px oklch(0.7 0.12 86 / 0.5)",
              }}
            >
              View Latest Monthly Snapshot
            </Link>
            <Link
              href="/methodology"
              className="inline-flex items-center rounded-lg border-2 border-[color:var(--nsi-green)] bg-transparent px-7 py-3.5 text-sm font-semibold text-[color:var(--nsi-green)] transition-all hover:bg-[color:var(--nsi-green)] hover:text-white"
            >
              See Methodology
            </Link>
          </div>
        </div>
      </section>

      {/* What NSI is */}
      <section className="mt-14 nsi-section-card rounded-[28px] px-8 py-9">
        <h2 className="font-serif text-2xl font-semibold tracking-tight text-[color:var(--nsi-ink)]">
          What NSI is
        </h2>
        <p className="mt-4 max-w-3xl text-[0.9375rem] leading-7 text-[color:var(--nsi-ink-soft)]">
          The Nigeria Stability Index (NSI) is an independent civic measurement
          platform. We track stability through data, public sentiment, and calm
          analysis — non-political, with no campaigning and no advocacy.
        </p>
      </section>

      {/* Monthly Snapshot preview (only place scores appear on Home) */}
      <section className="mt-14">
        <div className="nsi-section-card overflow-hidden rounded-[28px] p-8 md:p-10">
          <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="text-[0.8125rem] font-semibold uppercase tracking-wider text-[color:var(--nsi-ink-soft)]">
                {period} Snapshot
              </div>
              <h3 className="mt-1 font-serif text-xl font-semibold tracking-tight text-[color:var(--nsi-ink)] md:text-2xl">
                Latest stability snapshot
              </h3>
              <ul className="mt-4 space-y-1.5 text-[0.9375rem] text-[color:var(--nsi-ink-soft)]">
                {pillarList.map((p) => (
                  <li key={p.title}>{p.title}</li>
                ))}
              </ul>
              <Link
                href={snapshotHref}
                className="mt-6 inline-flex rounded-lg bg-[color:var(--nsi-green)] px-5 py-2.5 text-sm font-semibold text-white transition-all hover:brightness-[1.08]"
              >
                Open Full Snapshot
              </Link>
            </div>
            <div className="flex shrink-0 justify-center md:justify-end">
              <ScoreRing
                value={displayScore}
                size={100}
                label={`Overall stability score ${displayScore.toFixed(1)}`}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Spotlights preview */}
      <section className="mt-14">
        <h2 className="font-serif text-2xl font-semibold tracking-tight text-[color:var(--nsi-ink)]">
          Spotlights
        </h2>
        <p className="mt-2 text-[0.875rem] italic text-[color:var(--nsi-ink-soft)]">
          Evidence-based spotlight. Not an endorsement.
        </p>
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <div className="nsi-card-solid rounded-[28px] p-8">
            <div className="text-xs font-semibold uppercase tracking-wider text-[color:var(--nsi-green)]">
              State Spotlight
            </div>
            <h3 className="mt-2 font-serif text-xl font-semibold tracking-tight text-[color:var(--nsi-ink)]">
              {stateTitle}
            </h3>
            <p className="mt-3 line-clamp-2 text-sm leading-6 text-[color:var(--nsi-ink-soft)]">
              {stateSummary}
            </p>
            <Link
              href={stateHref}
              className="mt-5 inline-flex rounded-lg bg-[color:var(--nsi-green)] px-5 py-2.5 text-sm font-semibold text-white transition-all hover:brightness-[1.08]"
            >
              Read Spotlight
            </Link>
          </div>
          <div className="nsi-card-solid rounded-[28px] p-8">
            <div className="text-xs font-semibold uppercase tracking-wider text-[color:var(--nsi-green)]">
              Institution Spotlight
            </div>
            <h3 className="mt-2 font-serif text-xl font-semibold tracking-tight text-[color:var(--nsi-ink)]">
              {instTitle}
            </h3>
            <p className="mt-3 line-clamp-2 text-sm leading-6 text-[color:var(--nsi-ink-soft)]">
              {instSummary}
            </p>
            <Link
              href={instHref}
              className="mt-5 inline-flex rounded-lg bg-[color:var(--nsi-green)] px-5 py-2.5 text-sm font-semibold text-white transition-all hover:brightness-[1.08]"
            >
              Read Spotlight
            </Link>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="mt-14">
        <h2 className="font-serif text-2xl font-semibold tracking-tight text-[color:var(--nsi-ink)]">
          How it works
        </h2>
        <div className="mt-6 grid gap-6 md:grid-cols-3">
          <div className="nsi-card-solid rounded-[28px] p-8">
            <div className="text-xs font-semibold uppercase tracking-wider text-[color:var(--nsi-ink-soft)]">
              Step 1
            </div>
            <h3 className="mt-2 font-serif text-lg font-semibold tracking-tight text-[color:var(--nsi-ink)]">
              Collect public signals + verified sources
            </h3>
            <p className="mt-3 text-sm leading-6 text-[color:var(--nsi-ink-soft)]">
              We gather anonymous check-ins and verified data across security,
              economy, governance, investor confidence, and social stability.
            </p>
          </div>
          <div className="nsi-card-solid rounded-[28px] p-8">
            <div className="text-xs font-semibold uppercase tracking-wider text-[color:var(--nsi-ink-soft)]">
              Step 2
            </div>
            <h3 className="mt-2 font-serif text-lg font-semibold tracking-tight text-[color:var(--nsi-ink)]">
              Review + validation
            </h3>
            <p className="mt-3 text-sm leading-6 text-[color:var(--nsi-ink-soft)]">
              Inputs are reviewed and validated. Human review is part of the
              process before we finalize the snapshot.
            </p>
          </div>
          <div className="nsi-card-solid rounded-[28px] p-8">
            <div className="text-xs font-semibold uppercase tracking-wider text-[color:var(--nsi-ink-soft)]">
              Step 3
            </div>
            <h3 className="mt-2 font-serif text-lg font-semibold tracking-tight text-[color:var(--nsi-ink)]">
              Publish monthly snapshot on the 11th
            </h3>
            <p className="mt-3 text-sm leading-6 text-[color:var(--nsi-ink-soft)]">
              We publish a stable snapshot each month. Once locked, it stays
              immutable.
            </p>
          </div>
        </div>
        <p className="mt-6">
          <Link
            href="/methodology"
            className="text-sm font-medium text-[color:var(--nsi-green)] hover:underline"
          >
            Learn more →
          </Link>
        </p>
      </section>

      {/* Subscribe */}
      <section className="nsi-newsletter-section mt-14 overflow-hidden rounded-[28px]">
        <div className="grid gap-6 px-8 py-10 md:grid-cols-2 md:items-center md:px-10">
          <div className="text-white">
            <h3 className="text-[1.375rem] font-bold leading-snug">
              Be part of Nigeria&apos;s stability check-in
            </h3>
            <p className="mt-2 text-[0.9375rem] opacity-80">
              Get monthly updates and reports.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
            <input
              className="h-12 w-full rounded-lg border border-white/25 bg-white/12 px-5 text-[0.9375rem] text-white placeholder:text-white/55 outline-none transition-all focus:border-white/45 focus:bg-white/18 sm:max-w-[280px]"
              placeholder="Email"
              type="email"
              name="email"
              id="home-email"
            />
            <Link
              href="/subscribe"
              className="inline-flex h-12 items-center justify-center rounded-lg bg-[color:var(--nsi-gold)] px-8 text-[0.9375rem] font-semibold text-[color:var(--nsi-ink)] transition-all hover:brightness-[0.96]"
              style={{
                boxShadow: "0 4px 12px -4px oklch(0.7 0.12 86 / 0.5)",
              }}
            >
              Subscribe
            </Link>
          </div>
        </div>
        <p className="border-t border-white/12 px-8 pb-6 pt-4 text-[0.8125rem] text-white/70 md:px-10">
          We use your email only to send monthly updates. No spam. No sharing
          with third parties. Unsubscribe anytime.
        </p>
      </section>
    </main>
  );
}
