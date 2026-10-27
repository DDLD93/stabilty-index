import Image from "next/image";
import type { Metadata } from "next";
import { getPublicSystemState } from "@/lib/systemState";
import Link from "next/link";
import { defaultMetadata } from "@/lib/metadata";
import {
  NigeriaMapSilhouette,
  PillarEconomyIcon,
  PillarEditorialGraphic,
  PillarGovernanceIcon,
  PillarInvestorIcon,
  PillarSecurityIcon,
  PillarSocialIcon,
} from "@/components/public/icons";
import { SpotlightCard } from "@/components/public/SpotlightCard";
import { RulerGauge } from "@/components/public/RulerGauge";

export const dynamic = "force-dynamic";

type Pillar = { title: string; score: number; summary?: string };
type StateSpotlight = {
  state?: string;
  score?: number;
  bullets?: string[];
  keyPointsHtml?: string;
};
type InstitutionSpotlight = {
  institution?: string;
  summary?: string;
  bullets?: string[];
  keyPointsHtml?: string;
};
type StreetPulseSpotlight = {
  title?: string;
  summary?: string;
  keyPointsHtml?: string;
};
type PublicSentiment = {
  topWords?: string[];
  averagePublicScore?: number;
  topMood?: string;
};
type SourceRef = { label?: string; url?: string };

function safeArray<T>(v: unknown): T[] {
  return Array.isArray(v) ? (v as T[]) : [];
}

function safeString(v: unknown): string {
  return typeof v === "string" && v.length > 0 ? v : "";
}

function safeNumber(v: unknown): number | null {
  const n = typeof v === "number" ? v : Number(v);
  return Number.isFinite(n) ? n : null;
}

function hasStateSpotlight(raw: unknown): raw is StateSpotlight {
  if (!raw || typeof raw !== "object") return false;
  const s = raw as StateSpotlight;
  return Boolean(
    safeString(s.state) ||
      (typeof s.keyPointsHtml === "string" &&
        s.keyPointsHtml.replace(/<[^>]+>/g, "").trim()) ||
      (Array.isArray(s.bullets) && s.bullets.some(Boolean))
  );
}

function hasInstitutionSpotlight(raw: unknown): raw is InstitutionSpotlight {
  if (!raw || typeof raw !== "object") return false;
  const i = raw as InstitutionSpotlight;
  return Boolean(
    safeString(i.institution) ||
      safeString(i.summary) ||
      (typeof i.keyPointsHtml === "string" &&
        i.keyPointsHtml.replace(/<[^>]+>/g, "").trim()) ||
      (Array.isArray(i.bullets) && i.bullets.some(Boolean))
  );
}

function hasStreetPulseSpotlight(raw: unknown): raw is StreetPulseSpotlight {
  if (!raw || typeof raw !== "object") return false;
  const s = raw as StreetPulseSpotlight;
  return Boolean(
    safeString(s.title) ||
      safeString(s.summary) ||
      (typeof s.keyPointsHtml === "string" &&
        s.keyPointsHtml.replace(/<[^>]+>/g, "").trim())
  );
}

function hasSentiment(raw: unknown): raw is PublicSentiment {
  if (!raw || typeof raw !== "object") return false;
  const s = raw as PublicSentiment;
  return Boolean(
    safeString(s.topMood) ||
      (Array.isArray(s.topWords) && s.topWords.length > 0) ||
      safeNumber(s.averagePublicScore) != null
  );
}

function hasSources(raw: unknown): raw is SourceRef[] {
  if (!Array.isArray(raw)) return false;
  return raw.some(
    (x) =>
      x &&
      typeof x === "object" &&
      safeString((x as SourceRef).label) &&
      safeString((x as SourceRef).url)
  );
}

export async function generateMetadata(): Promise<Metadata> {
  const state = await getPublicSystemState();
  const latest = state.latestPublishedSnapshot;
  const displayScore = latest ? latest.overallScore : 0.0;

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

  const snapshotHref = latest ? `/reports/${latest.id}` : "/reports";
  const displayScore = latest ? latest.overallScore : 0.0;
  const period = latest?.period ?? "January 2026";
  const narrative = latest?.overallNarrative ?? "Cautiously Stable";

  const stateSpot = (latest?.stateSpotlightContent ?? {}) as StateSpotlight;
  const instSpot = (latest?.institutionSpotlightContent ??
    {}) as InstitutionSpotlight;
  const streetPulseSpot = (latest?.streetPulseSpotlightContent ??
    {}) as StreetPulseSpotlight;
  const sentiment = (latest?.publicSentimentSummary ?? {}) as PublicSentiment;
  const sourcesRaw = latest?.sourcesReferences;
  const sources = Array.isArray(sourcesRaw)
    ? (sourcesRaw as SourceRef[]).filter(
        (x) => x && safeString(x.label) && safeString(x.url)
      )
    : [];

  const showStateSpotlight = hasStateSpotlight(latest?.stateSpotlightContent);
  const showInstSpotlight = hasInstitutionSpotlight(
    latest?.institutionSpotlightContent
  );
  const showStreetPulse = hasStreetPulseSpotlight(
    latest?.streetPulseSpotlightContent
  );
  const showSentiment = hasSentiment(latest?.publicSentimentSummary);
  const showSources = hasSources(latest?.sourcesReferences);

  const cycle = state.currentCycle;
  const cycleOpen = cycle?.status === "OPEN";

  const IconFor = (title: string) => {
    const t = title.toLowerCase();
    if (t.includes("security")) return PillarSecurityIcon;
    if (t.includes("econom")) return PillarEconomyIcon;
    if (t.includes("invest")) return PillarInvestorIcon;
    if (t.includes("govern")) return PillarGovernanceIcon;
    return PillarSocialIcon;
  };

  return (
    <main className="w-full pb-20">
      {/* ── Editorial Flagship Hero (Chatham House / Afrobarometer Inspired) ── */}
      <section className="relative overflow-hidden border-b-2 border-[color:var(--nsi-ink)] bg-[color:var(--nsi-green-deep)] text-white">
        {/* Authentic Nigerian Documentary Photography Backdrop */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/nigeria-civic-hero.jpg"
            alt="Abuja Central Business District and Aso Rock at morning light"
            fill
            className="object-cover object-center opacity-28 mix-blend-luminosity"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#04170e] via-[#062315]/92 to-[#062315]/75" />
          <div className="absolute inset-0 bg-[radial-gradient(#c88a2b_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.06]" />
        </div>

        <div className="relative z-10 mx-auto w-full max-w-7xl px-6 py-16 lg:py-24">
          <div className="grid items-start gap-12 lg:grid-cols-12 lg:gap-12">
            {/* Left Editorial Lead (7 Cols) */}
            <div className="lg:col-span-7">
              {/* Top Kicker & Live Status Strip */}
              <div className="flex flex-wrap items-center gap-3 border-b border-white/15 pb-5">
                <div className="inline-flex items-center gap-2 rounded-[2px] border border-[color:var(--nsi-gold)]/50 bg-[color:var(--nsi-gold)]/15 px-3 py-1 font-mono text-xs font-bold uppercase tracking-widest text-[color:var(--nsi-gold-light)]">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[color:var(--nsi-gold-light)] opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-[color:var(--nsi-gold-light)]" />
                  </span>
                  Published Snapshot: {period}
                </div>

                {cycle && (
                  <div className="inline-flex items-center gap-2 rounded-[2px] border border-white/20 bg-white/[0.06] px-3 py-1 font-mono text-xs uppercase tracking-wider text-white/85">
                    {cycleOpen && (
                      <>
                        <span className="h-2 w-2 rounded-full bg-emerald-400" />
                        <span>Survey Open: {cycle.monthYear}</span>
                      </>
                    )}
                    {cycle.status === "CLOSED" && (
                      <span className="text-white/70">
                        Collection closed for {cycle.monthYear} · Synthesis in progress
                      </span>
                    )}
                    {cycle.status === "ARCHIVED" && (
                      <span className="text-white/60">Cycle Archived</span>
                    )}
                  </div>
                )}
              </div>

              {/* Headline */}
              <h1 className="mt-7 font-serif text-4xl font-bold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-[3.65rem]">
                Tracking How Nigeria{" "}
                <span className="italic font-normal text-[color:var(--nsi-gold-light)]">
                  Is Holding Together.
                </span>
              </h1>

              {/* Editorial Lead Paragraph */}
              <p className="mt-6 max-w-2xl border-l-2 border-[color:var(--nsi-gold)] pl-5 text-base leading-relaxed text-white/80 sm:text-lg">
                Beyond partisan noise and daily headlines: an independent,
                empirical monthly barometer measuring Nigeria&apos;s institutional
                resilience, macro-economic pulse, security environment, and
                citizen sentiment across all 36 states and the FCT.
              </p>

              {/* Primary CTAs */}
              <div className="mt-9 flex flex-wrap items-center gap-3.5">
                {cycleOpen && (
                  <Link
                    href="/survey"
                    className="btn-nsi-gold"
                  >
                    <span>Take the Citizen Survey</span>
                    <span aria-hidden>→</span>
                  </Link>
                )}
                <Link
                  href={snapshotHref}
                  className={
                    cycleOpen
                      ? "inline-flex items-center gap-2.5 rounded-[3px] border border-white/30 bg-white/10 px-6 py-3.5 text-sm font-semibold tracking-wide text-white transition-colors hover:border-white hover:bg-white hover:text-[color:var(--nsi-ink)]"
                      : "btn-nsi-gold"
                  }
                >
                  <span>Read Full {period} Report</span>
                  <span aria-hidden>→</span>
                </Link>
                <Link
                  href="/methodology"
                  className="inline-flex items-center gap-2 rounded-[3px] border border-white/20 px-5 py-3.5 text-sm font-medium text-white/80 transition-colors hover:border-white/50 hover:text-white"
                >
                  Our Methodology
                </Link>
              </div>

              {/* Institutional Key Metrics Bar */}
              <dl className="mt-12 grid grid-cols-3 gap-4 border-t border-white/15 pt-6">
                <div>
                  <dt className="font-mono text-[0.65rem] uppercase tracking-widest text-white/55">
                    Analytical Framework
                  </dt>
                  <dd className="mt-1 font-serif text-lg font-semibold text-white">
                    5 Core Pillars
                  </dd>
                </div>
                <div className="border-l border-white/15 pl-4">
                  <dt className="font-mono text-[0.65rem] uppercase tracking-widest text-white/55">
                    Geographic Scope
                  </dt>
                  <dd className="mt-1 font-serif text-lg font-semibold text-white">
                    36 States &amp; FCT
                  </dd>
                </div>
                <div className="border-l border-white/15 pl-4">
                  <dt className="font-mono text-[0.65rem] uppercase tracking-widest text-white/55">
                    Release Cadence
                  </dt>
                  <dd className="mt-1 font-serif text-lg font-semibold text-white">
                    11th Monthly
                  </dd>
                </div>
              </dl>
            </div>

            {/* Right Executive Scorecard Dossier (5 Cols) */}
            <div className="lg:col-span-5">
              <div className="overflow-hidden rounded-[4px] border border-white/20 bg-[#04170e]/90 shadow-2xl">
                {/* Top Brass Header */}
                <div className="flex items-center justify-between border-b border-white/15 bg-white/[0.04] px-6 py-3.5">
                  <div className="flex items-center gap-2.5">
                    <Image
                      src="/nsi-emblem.webp"
                      alt="NSI Emblem"
                      width={36}
                      height={24}
                      className="h-6 w-9 object-contain"
                    />
                    <span className="font-mono text-[0.7rem] font-bold uppercase tracking-[0.15em] text-[color:var(--nsi-gold-light)]">
                      National Composite Index
                    </span>
                  </div>
                  <span className="font-mono text-[0.68rem] uppercase tracking-wider text-white/60">
                    {period}
                  </span>
                </div>

                <div className="p-6 sm:p-8">
                  {/* Giant Tabular Score */}
                  <div className="flex items-baseline justify-between gap-4 border-b border-white/12 pb-6">
                    <div>
                      <div className="font-mono text-[0.68rem] uppercase tracking-widest text-white/55">
                        Stability Score
                      </div>
                      <div className="mt-1 flex items-baseline gap-2">
                        <span className="font-serif text-7xl font-bold tracking-tight tabular-nums text-[color:var(--nsi-gold-light)] sm:text-8xl">
                          {displayScore.toFixed(1)}
                        </span>
                        <span className="font-mono text-2xl font-normal text-white/40">
                          / 10.0
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="inline-block rounded-[2px] border border-[color:var(--nsi-gold)]/40 bg-[color:var(--nsi-gold)]/15 px-2.5 py-1 font-mono text-[0.65rem] font-bold uppercase tracking-widest text-[color:var(--nsi-gold-light)]">
                        Index Classification
                      </span>
                      <div className="mt-2 font-serif text-lg italic text-white/90">
                        &ldquo;{narrative}&rdquo;
                      </div>
                    </div>
                  </div>

                  {/* Mini Pillar Bar Breakdown inside Hero Scorecard */}
                  <div className="mt-6 space-y-3">
                    <div className="flex items-center justify-between font-mono text-[0.65rem] uppercase tracking-widest text-white/50">
                      <span>Pillar Component</span>
                      <span>Index (0–10)</span>
                    </div>
                    {pillarList.map((p) => {
                      const pct = Math.max(0, Math.min(100, (p.score / 10) * 100));
                      return (
                        <div key={p.title} className="space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-medium text-white/85">
                              {p.title}
                            </span>
                            <span className="font-mono font-bold tabular-nums text-[color:var(--nsi-gold-light)]">
                              {p.score.toFixed(1)}
                            </span>
                          </div>
                          <div className="h-1.5 w-full overflow-hidden rounded-[1px] bg-white/10">
                            <div
                              className="h-full bg-[color:var(--nsi-gold)] transition-all duration-500"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-7 border-t border-white/12 pt-4 flex items-center justify-between text-xs text-white/65">
                    <span className="font-mono text-[0.65rem] uppercase tracking-wider">
                      Source: NSI Research Desk
                    </span>
                    <Link
                      href={snapshotHref}
                      className="font-mono text-[0.7rem] font-bold uppercase tracking-wider text-[color:var(--nsi-gold-light)] hover:underline"
                    >
                      Full Breakdown →
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Main Content Container ─────────────────────────────────────── */}
      <div className="mx-auto max-w-7xl px-6">
        {/* SECTION 01: Five Pillars Assessment */}
        <section className="mt-16">
          <div className="nsi-section-rule flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="nsi-kicker">01 / Macro &amp; Civic Indicators</p>
              <h2 className="mt-1 font-serif text-3xl font-bold tracking-tight text-[color:var(--nsi-ink)]">
                Five-Pillar Stability Assessment
              </h2>
            </div>
            <p className="max-w-md text-xs leading-relaxed text-[color:var(--nsi-ink-soft)]">
              Each pillar is scored monthly on a 1.0–10.0 empirical scale,
              combining public survey signals with verified institutional data.
            </p>
          </div>

          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
            {pillarList.map((p, idx) => {
              const Icon = IconFor(p.title);
              const pct = Math.max(0, Math.min(100, (p.score / 10) * 100));
              return (
                <article
                  key={p.title}
                  className="group flex flex-col justify-between overflow-hidden rounded-[4px] border border-[color:var(--nsi-rule-strong)] bg-white transition-all hover:border-[color:var(--nsi-green)] hover:shadow-md"
                >
                  <div>
                    {/* Top Index Header */}
                    <div className="flex items-center justify-between border-b border-[color:var(--nsi-rule)] px-4 py-2.5">
                      <span className="font-mono text-[0.65rem] font-bold uppercase tracking-widest text-[color:var(--nsi-ink-muted)]">
                        Pillar 0{idx + 1}
                      </span>
                      <Icon className="h-5 w-5 text-[color:var(--nsi-green)]" />
                    </div>

                    {/* Bespoke Vector Infographic Header */}
                    <div className="relative h-28 w-full overflow-hidden border-b border-[color:var(--nsi-rule)]">
                      <PillarEditorialGraphic
                        title={p.title}
                        score={p.score}
                        className="h-full w-full transition-transform duration-300 group-hover:scale-[1.03]"
                      />
                    </div>

                    {/* Score & Title */}
                    <div className="p-5">
                      <div className="flex items-baseline justify-between gap-2">
                        <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-[color:var(--nsi-ink)]">
                          {p.title}
                        </h3>
                        <span className="font-serif text-2xl font-bold tabular-nums text-[color:var(--nsi-green)]">
                          {p.score.toFixed(1)}
                        </span>
                      </div>

                      {/* Linear Score Bar */}
                      <div className="mt-2.5 h-1.5 w-full overflow-hidden rounded-[1px] bg-[color:var(--nsi-paper-2)]">
                        <div
                          className="h-full bg-[color:var(--nsi-green)]"
                          style={{ width: `${pct}%` }}
                        />
                      </div>

                      <p className="mt-4 text-xs leading-relaxed text-[color:var(--nsi-ink-soft)]">
                        {p.summary ||
                          "Empirical indicator tracking monthly performance and resilience across Nigeria."}
                      </p>
                    </div>
                  </div>

                  <div className="border-t border-[color:var(--nsi-rule)] bg-[color:var(--nsi-paper)] px-5 py-2.5">
                    <Link
                      href={snapshotHref}
                      className="flex items-center justify-between font-mono text-[0.65rem] font-semibold uppercase tracking-wider text-[color:var(--nsi-green)] group-hover:underline"
                    >
                      <span>Indicator Notes</span>
                      <span aria-hidden>→</span>
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* SECTION 02: State, Institution & Street Pulse Spotlights */}
        <section className="mt-20">
          <div className="nsi-section-rule mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="nsi-kicker">02 / Sub-National &amp; Institutional Focus</p>
              <h2 className="mt-1 font-serif text-3xl font-bold tracking-tight text-[color:var(--nsi-ink)]">
                Monthly Spotlights &amp; Street Pulse
              </h2>
            </div>
            <Link
              href="/spotlights"
              className="font-mono text-xs font-bold uppercase tracking-wider text-[color:var(--nsi-green)] hover:underline"
            >
              Explore All Spotlights →
            </Link>
          </div>

          <SpotlightCard
            stateSpot={stateSpot}
            instSpot={instSpot}
            streetPulseSpot={streetPulseSpot}
            showState={showStateSpotlight}
            showInst={showInstSpotlight}
            showStreetPulse={showStreetPulse}
            reportHref={latest ? `/reports/${latest.id}` : "/spotlights"}
          />
        </section>

        {/* SECTION 03: Citizen Sentiment & Verifiable Sources (Afrobarometer + BudgIT style) */}
        <section className="mt-20">
          <div className="nsi-section-rule mb-8">
            <p className="nsi-kicker">03 / Public Opinion &amp; Empirical Sources</p>
            <h2 className="mt-1 font-serif text-3xl font-bold tracking-tight text-[color:var(--nsi-ink)]">
              Citizen Pulse &amp; Reference Ledger
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Left: What Nigerians Said */}
            {showSentiment ? (
              <div className="flex flex-col justify-between overflow-hidden rounded-[4px] border border-[color:var(--nsi-rule-strong)] bg-white">
                <div>
                  <div className="flex items-center justify-between border-b border-[color:var(--nsi-rule)] bg-[color:var(--nsi-paper)] px-6 py-4">
                    <h3 className="font-mono text-xs font-bold uppercase tracking-widest text-[color:var(--nsi-ink)]">
                      What Nigerians Said ({period})
                    </h3>
                    <span className="font-mono text-[0.65rem] uppercase tracking-wider text-[color:var(--nsi-green)]">
                      Public Survey Signal
                    </span>
                  </div>
                  <div className="p-6 sm:p-8">
                    <div className="grid gap-6 sm:grid-cols-2">
                      {safeString(sentiment.topMood) && (
                        <div className="border-l-2 border-[color:var(--nsi-gold)] pl-4">
                          <div className="font-mono text-[0.65rem] uppercase tracking-widest text-[color:var(--nsi-ink-muted)]">
                            Dominant National Mood
                          </div>
                          <div className="mt-1 font-serif text-2xl font-bold text-[color:var(--nsi-ink)]">
                            &ldquo;{sentiment.topMood}&rdquo;
                          </div>
                        </div>
                      )}
                      {safeNumber(sentiment.averagePublicScore) != null && (
                        <div className="border-l-2 border-[color:var(--nsi-green)] pl-4">
                          <div className="font-mono text-[0.65rem] uppercase tracking-widest text-[color:var(--nsi-ink-muted)]">
                            Average Public Rating
                          </div>
                          <div className="mt-1 font-serif text-3xl font-bold tabular-nums text-[color:var(--nsi-green)]">
                            {safeNumber(sentiment.averagePublicScore)!.toFixed(1)}
                            <span className="font-mono text-sm font-normal text-[color:var(--nsi-ink-muted)]">
                              {" "}
                              / 10
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    {safeArray<string>(sentiment.topWords).length > 0 && (
                      <div className="mt-6 border-t border-[color:var(--nsi-rule)] pt-5">
                        <div className="font-mono text-[0.65rem] uppercase tracking-widest text-[color:var(--nsi-ink-muted)]">
                          Top Citizen Descriptors
                        </div>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {safeArray<string>(sentiment.topWords)
                            .slice(0, 6)
                            .map((w) => (
                              <span
                                key={w}
                                className="rounded-[2px] border border-[color:var(--nsi-rule-strong)] bg-[color:var(--nsi-paper)] px-3 py-1 font-mono text-xs font-semibold text-[color:var(--nsi-ink)]"
                              >
                                {w}
                              </span>
                            ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="border-t border-[color:var(--nsi-rule)] bg-[color:var(--nsi-paper)] px-6 py-3 text-xs text-[color:var(--nsi-ink-soft)]">
                  Synthesized from anonymous citizen check-ins across Nigeria.
                </div>
              </div>
            ) : (
              <div className="flex flex-col justify-between overflow-hidden rounded-[4px] border border-[color:var(--nsi-rule-strong)] bg-white">
                <div className="border-b border-[color:var(--nsi-rule)] bg-[color:var(--nsi-paper)] px-6 py-4">
                  <h3 className="font-mono text-xs font-bold uppercase tracking-widest text-[color:var(--nsi-ink)]">
                    What Nigerians Said
                  </h3>
                </div>
                <div className="flex flex-1 flex-col items-start justify-center p-8">
                  <p className="font-mono text-xs font-semibold uppercase tracking-wider text-[color:var(--nsi-ink-muted)]">
                    Public Sentiment Summary
                  </p>
                  <p className="mt-2 text-sm text-[color:var(--nsi-ink-soft)]">
                    Citizen mood distribution and descriptor rankings will be
                    published alongside the monthly report.
                  </p>
                </div>
              </div>
            )}

            {/* Right: Sources & References */}
            {showSources ? (
              <div className="flex flex-col justify-between overflow-hidden rounded-[4px] border border-[color:var(--nsi-rule-strong)] bg-white">
                <div>
                  <div className="flex items-center justify-between border-b border-[color:var(--nsi-rule)] bg-[color:var(--nsi-paper)] px-6 py-4">
                    <h3 className="font-mono text-xs font-bold uppercase tracking-widest text-[color:var(--nsi-ink)]">
                      Sources &amp; Empirical References
                    </h3>
                    <span className="font-mono text-[0.65rem] uppercase tracking-wider text-[color:var(--nsi-ink-muted)]">
                      Verified Data
                    </span>
                  </div>
                  <div className="p-6 sm:p-8">
                    <ul className="divide-y divide-[color:var(--nsi-rule)]">
                      {sources.slice(0, 5).map((s, idx) => (
                        <li key={idx} className="py-3 first:pt-0 last:pb-0">
                          <a
                            href={s.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group flex items-center justify-between gap-4 text-sm font-medium text-[color:var(--nsi-ink)] transition-colors hover:text-[color:var(--nsi-green)]"
                          >
                            <span className="flex items-center gap-3">
                              <span className="font-mono text-xs font-bold text-[color:var(--nsi-gold-deep)]">
                                [{String(idx + 1).padStart(2, "0")}]
                              </span>
                              <span className="group-hover:underline">{s.label}</span>
                            </span>
                            <span className="font-mono text-xs text-[color:var(--nsi-ink-muted)]">
                              ↗
                            </span>
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="border-t border-[color:var(--nsi-rule)] bg-[color:var(--nsi-paper)] px-6 py-3">
                  <Link
                    href={snapshotHref}
                    className="font-mono text-xs font-bold uppercase tracking-wider text-[color:var(--nsi-green)] hover:underline"
                  >
                    {sources.length > 5
                      ? `View all ${sources.length} citations in full report →`
                      : "Inspect full bibliography in report →"}
                  </Link>
                </div>
              </div>
            ) : (
              <div className="flex flex-col justify-between overflow-hidden rounded-[4px] border border-[color:var(--nsi-rule-strong)] bg-white">
                <div className="border-b border-[color:var(--nsi-rule)] bg-[color:var(--nsi-paper)] px-6 py-4">
                  <h3 className="font-mono text-xs font-bold uppercase tracking-widest text-[color:var(--nsi-ink)]">
                    Sources &amp; Empirical References
                  </h3>
                </div>
                <div className="flex flex-1 flex-col items-start justify-center p-8">
                  <p className="font-mono text-xs font-semibold uppercase tracking-wider text-[color:var(--nsi-ink-muted)]">
                    Reference Index
                  </p>
                  <p className="mt-2 text-sm text-[color:var(--nsi-ink-soft)]">
                    Institutional datasets and verified reference links are
                    published with each locked monthly snapshot.
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* SECTION 04: Participatory Citizen Survey Callout with Authentic Nigerian Photojournalism */}
        <section className="mt-20 overflow-hidden rounded-[4px] border border-[color:var(--nsi-rule-strong)] bg-white shadow-sm">
          <div className="grid md:grid-cols-12">
            <div className="relative min-h-[280px] md:col-span-5">
              <Image
                src="/images/nigeria-citizens-dialogue.jpg"
                alt="Nigerian citizens and researchers in policy dialogue"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:to-black/20" />
              <div className="absolute bottom-4 left-4 right-4 rounded-[2px] bg-[#04170e]/85 px-3 py-2 text-[0.7rem] font-mono uppercase tracking-wider text-white/90">
                Citizen Check-In · Anonymous &amp; Non-Partisan
              </div>
            </div>

            <div className="flex flex-col justify-center p-8 sm:p-12 md:col-span-7">
              <span className="nsi-kicker">04 / Public Participation</span>
              <h2 className="mt-2 font-serif text-3xl font-bold text-[color:var(--nsi-ink)] sm:text-4xl">
                {cycleOpen
                  ? "Share how Nigeria feels to you"
                  : "How stable does Nigeria feel to you?"}
              </h2>
              <p className="mt-4 max-w-xl text-base leading-relaxed text-[color:var(--nsi-ink-soft)]">
                One structured question per pillar. Your anonymous check-in
                combines with empirical indicators to shape the monthly Nigeria
                Stability Index. No personal identifiers are ever collected.
              </p>

              {cycleOpen ? (
                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <Link href="/survey" className="btn-nsi-primary">
                    <span>Take the survey</span>
                    <span aria-hidden>→</span>
                  </Link>
                  <span className="font-mono text-xs uppercase tracking-wider text-[color:var(--nsi-ink-muted)]">
                    Takes 2 minutes · 100% Anonymous
                  </span>
                </div>
              ) : (
                <div className="mt-6 rounded-[3px] border border-[color:var(--nsi-rule)] bg-[color:var(--nsi-paper)] px-5 py-4 text-sm text-[color:var(--nsi-ink-soft)]">
                  {showSentiment && safeString(sentiment.topMood) ? (
                    <>
                      Top mood this period:{" "}
                      <span className="font-semibold text-[color:var(--nsi-gold-deep)]">
                        &ldquo;{sentiment.topMood}&rdquo;
                      </span>
                    </>
                  ) : (
                    "Survey opens each monthly cycle. Check back soon."
                  )}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* SECTION 05: Executive Report & Scorecard Table */}
        <section className="mt-20 overflow-hidden rounded-[4px] border border-[color:var(--nsi-rule-strong)] bg-white shadow-sm">
          <div className="nsi-band flex flex-col justify-between gap-2 px-6 py-4 text-white sm:flex-row sm:items-center sm:px-8">
            <div className="flex items-center gap-3">
              <span className="inline-block h-2 w-2 bg-[color:var(--nsi-gold)]" />
              <h2 className="font-mono text-xs font-bold uppercase tracking-[0.15em]">
                {period} Snapshot · Executive Summary
              </h2>
            </div>
            <span className="font-mono text-[0.68rem] uppercase tracking-wider text-white/65">
              The 24 Angels Initiative
            </span>
          </div>

          <div className="grid gap-10 p-6 sm:p-10 lg:grid-cols-12 lg:p-12">
            {/* Left Gauge & Map Summary (6 Cols) */}
            <div className="flex flex-col justify-between lg:col-span-6">
              <div>
                <div className="flex items-start justify-between gap-4 border-b border-[color:var(--nsi-rule)] pb-6">
                  <div>
                    <div className="font-mono text-xs font-bold uppercase tracking-widest text-[color:var(--nsi-ink-muted)]">
                      Composite Index Rating
                    </div>
                    <div className="mt-1 flex items-baseline gap-2">
                      <span className="font-serif text-7xl font-bold tabular-nums text-[color:var(--nsi-green)]">
                        {displayScore.toFixed(1)}
                      </span>
                      <span className="font-mono text-2xl text-[color:var(--nsi-ink-muted)]">
                        / 10
                      </span>
                    </div>
                  </div>
                  <NigeriaMapSilhouette className="hidden h-24 w-28 shrink-0 sm:block" />
                </div>

                <div className="my-8">
                  <RulerGauge value={displayScore} showValue={false} />
                </div>

                <p className="text-sm leading-relaxed text-[color:var(--nsi-ink-soft)]">
                  The Nigeria Stability Index (NSI) is an independent civic
                  measurement platform tracking the country&apos;s stability through
                  empirical data, public sentiment, and calm institutional
                  analysis.
                </p>
              </div>

              <div className="mt-6 border-t border-[color:var(--nsi-rule)] pt-4 font-serif text-sm italic text-[color:var(--nsi-gold-deep)]">
                A project of the 24 Angels Initiative.
              </div>
            </div>

            {/* Right Tabular Ledger (6 Cols) */}
            <div className="flex flex-col justify-between lg:col-span-6">
              <div className="overflow-hidden rounded-[3px] border border-[color:var(--nsi-rule-strong)]">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-[color:var(--nsi-rule-strong)] bg-[color:var(--nsi-paper)] text-[color:var(--nsi-ink)]">
                      <th className="px-5 py-3.5 font-mono text-xs font-bold uppercase tracking-wider">
                        {period} Pillars
                      </th>
                      <th className="px-5 py-3.5 font-mono text-xs font-bold uppercase tracking-wider">
                        Trajectory
                      </th>
                      <th className="px-5 py-3.5 text-right font-mono text-xs font-bold uppercase tracking-wider">
                        Score
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[color:var(--nsi-rule)] bg-white">
                    {pillarList.map((p) => {
                      const pct = Math.max(0, Math.min(100, (p.score / 10) * 100));
                      return (
                        <tr
                          key={p.title}
                          className="transition-colors hover:bg-[color:var(--nsi-paper)]/60"
                        >
                          <td className="px-5 py-3.5 font-semibold text-[color:var(--nsi-ink)]">
                            {p.title}
                          </td>
                          <td className="px-5 py-3.5">
                            <div className="h-2 w-24 overflow-hidden rounded-[1px] bg-[color:var(--nsi-paper-2)] sm:w-32">
                              <div
                                className="h-full bg-[color:var(--nsi-green)]"
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                          </td>
                          <td className="px-5 py-3.5 text-right font-mono text-base font-bold tabular-nums text-[color:var(--nsi-green)]">
                            {p.score.toFixed(1)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="mt-6">
                <Link
                  href={snapshotHref}
                  className="btn-nsi-primary w-full justify-between px-6 py-4"
                >
                  <span>Download Executive Summary &amp; Full Report</span>
                  <span aria-hidden>→</span>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 06: Monthly Dispatch Subscription */}
        <section className="mt-20 overflow-hidden rounded-[4px] border border-[color:var(--nsi-rule-strong)] border-t-4 border-t-[color:var(--nsi-gold)] bg-[color:var(--nsi-green-deep)] p-8 text-white sm:p-12 lg:p-16">
          <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-7">
              <span className="nsi-kicker-light">06 / Monthly Research Dispatch</span>
              <h2 className="mt-2 font-serif text-3xl font-bold leading-tight text-white sm:text-4xl">
                Be part of Nigeria&apos;s{" "}
                <span className="italic font-normal text-[color:var(--nsi-gold-light)]">
                  stability check-in.
                </span>
              </h2>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/75 sm:text-base">
                Receive monthly stability snapshots, sub-national spotlight
                briefings, and methodology notes directly from the NSI research
                desk on the 11th of every month.
              </p>
            </div>

            <div className="lg:col-span-5">
              <form
                action="/subscribe"
                method="get"
                className="flex flex-col gap-3 sm:flex-row"
              >
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email address"
                  aria-label="Email address"
                  className="h-12 flex-1 rounded-[3px] border border-white/25 bg-white/10 px-4 text-sm text-white placeholder:text-white/50 focus:border-[color:var(--nsi-gold)] focus:bg-white/15 focus:outline-none"
                />
                <button
                  type="submit"
                  className="h-12 shrink-0 rounded-[3px] bg-[color:var(--nsi-gold)] px-7 text-xs font-bold uppercase tracking-wider text-[color:var(--nsi-ink)] transition-colors hover:bg-[color:var(--nsi-gold-light)]"
                >
                  Join Dispatch
                </button>
              </form>
              <p className="mt-3 font-mono text-[0.68rem] text-white/50">
                No spam · No third-party sharing · Unsubscribe anytime.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
