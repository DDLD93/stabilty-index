import Link from "next/link";
import {
  NSIBadgeLogo,
  PillarEconomyIcon,
  PillarGovernanceIcon,
  PillarInvestorIcon,
  PillarSecurityIcon,
  PillarSocialIcon,
  SocialInstagramIcon,
  SocialTikTokIcon,
  SocialXIcon,
} from "@/components/public/icons";
import { SemiGauge } from "@/components/public/SemiGauge";
import { SafeHtml } from "@/components/ui/SafeHtml";
import { getKeyPointsHtml } from "@/lib/spotlight";

export type PosterPillar = { title: string; score: number; summary?: string };
export type PosterSpotlight = {
  state?: string;
  score?: number;
  bullets?: string[];
  keyPointsHtml?: string;
};
export type PosterInstitutionSpotlight = {
  institution?: string;
  summary?: string;
  bullets?: string[];
  keyPointsHtml?: string;
};
export type PosterStreetPulseSpotlight = {
  title?: string;
  summary?: string;
  keyPointsHtml?: string;
};
export type PosterSentiment = {
  topWords?: string[];
  averagePublicScore?: number;
  topMood?: string;
};
export type SourceRef = { label: string; url: string };

const SOCIAL = [
  { href: "https://x.com/Nigeria_NSI", label: "X", Icon: SocialXIcon },
  {
    href: "https://www.instagram.com/nigeriastabilityindex",
    label: "Instagram",
    Icon: SocialInstagramIcon,
  },
  {
    href: "https://www.tiktok.com/@nigeria_nsi",
    label: "TikTok",
    Icon: SocialTikTokIcon,
  },
] as const;

function SectionLabel({
  index,
  children,
}: {
  index: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-4 flex items-center gap-3 border-b-2 border-[color:var(--nsi-ink)] pb-2.5">
      <span className="font-mono text-xs font-bold uppercase tracking-widest text-[color:var(--nsi-gold-deep)]">
        {index}
      </span>
      <span className="text-black/20">/</span>
      <h2 className="font-mono text-xs font-bold uppercase tracking-[0.14em] text-[color:var(--nsi-green)]">
        {children}
      </h2>
    </div>
  );
}

function CheckIcon() {
  return (
    <svg
      className="mt-1 h-4 w-4 shrink-0 text-[color:var(--nsi-green)]"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2.5}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}

export function PublicationPoster({
  period,
  overallScore,
  overallNarrative,
  pillars,
  spotlight,
  institutionSpotlight,
  streetPulseSpotlight,
  sourcesReferences,
  sentiment,
}: {
  snapshotId: string;
  period: string;
  overallScore: number;
  overallNarrative: string | null;
  pillars: PosterPillar[];
  spotlight: PosterSpotlight;
  institutionSpotlight?: PosterInstitutionSpotlight;
  streetPulseSpotlight?: PosterStreetPulseSpotlight;
  sourcesReferences?: SourceRef[];
  sentiment: PosterSentiment;
}) {
  const iconFor = (title: string) => {
    const t = title.toLowerCase();
    if (t.includes("security")) return PillarSecurityIcon;
    if (t.includes("econom")) return PillarEconomyIcon;
    if (t.includes("invest")) return PillarInvestorIcon;
    if (t.includes("govern")) return PillarGovernanceIcon;
    return PillarSocialIcon;
  };

  const avg = sentiment.averagePublicScore ?? null;
  const topWords = sentiment.topWords ?? [];
  const inst = institutionSpotlight ?? {};
  const streetPulse = streetPulseSpotlight ?? {};
  const sources = sourcesReferences ?? [];
  const hasSentiment = topWords.length > 0 || avg != null || Boolean(sentiment.topMood);
  const stateKeyPointsHtml = getKeyPointsHtml(spotlight);
  const instKeyPointsHtml = getKeyPointsHtml(inst);
  const streetPulseKeyPointsHtml =
    typeof streetPulse.keyPointsHtml === "string"
      ? streetPulse.keyPointsHtml
      : "";
  const hasStreetPulse =
    streetPulse.title ||
    streetPulse.summary ||
    streetPulseKeyPointsHtml.trim();

  const editionMatch = period.match(/(\d+)/);
  const editionNum = editionMatch ? editionMatch[1].padStart(3, "0") : "001";

  return (
    <article className="overflow-hidden rounded-[4px] border border-[color:var(--nsi-rule-strong)] bg-white shadow-lg">
      {/* ── Flagship Report Masthead ──────────────────────────────────── */}
      <header className="nsi-band relative px-6 py-10 text-white sm:px-12 sm:py-12">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          {/* Logo + Publication Identity */}
          <div className="flex items-start gap-5">
            <NSIBadgeLogo className="h-20 w-28 shrink-0 drop-shadow-md" />
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-[2px] border border-[color:var(--nsi-gold)]/50 bg-[color:var(--nsi-gold)]/15 px-2 py-0.5 font-mono text-[0.65rem] font-bold uppercase tracking-widest text-[color:var(--nsi-gold-light)]">
                  Issue {editionNum}
                </span>
                <span className="font-mono text-[0.68rem] uppercase tracking-widest text-white/60">
                  Nigeria Stability Index
                </span>
              </div>
              <h1 className="mt-2 font-serif text-3xl font-bold leading-tight text-white sm:text-4xl">
                {period} Report
              </h1>
              <p className="mt-1 font-mono text-xs uppercase tracking-wider text-white/60">
                Empirical Synthesis · 36 States &amp; FCT Abuja
              </p>
            </div>
          </div>

          {/* Composite Index Score Callout */}
          <div className="flex flex-col items-start rounded-[3px] border border-white/15 bg-black/20 px-6 py-4 sm:items-end">
            <span className="font-mono text-[0.65rem] font-bold uppercase tracking-widest text-[color:var(--nsi-gold-light)]">
              Composite Stability Score
            </span>
            <div className="mt-1 flex items-baseline gap-1.5">
              <span className="font-serif text-6xl font-bold leading-none tabular-nums text-[color:var(--nsi-gold-light)] sm:text-7xl">
                {overallScore.toFixed(1)}
              </span>
              <span className="font-mono text-2xl font-normal text-white/35">
                /10
              </span>
            </div>
          </div>
        </div>

        {/* Executive Narrative Pull-Quote */}
        {overallNarrative && (
          <div className="mt-8 border-t border-white/15 pt-6">
            <p className="border-l-2 border-[color:var(--nsi-gold)] pl-4 font-serif text-lg italic leading-relaxed text-white/90 sm:text-xl">
              &ldquo;{overallNarrative}&rdquo;
            </p>
          </div>
        )}
      </header>

      {/* ── Five-Pillar Scorecard Strip ──────────────────────────────── */}
      <div className="border-b border-[color:var(--nsi-rule-strong)] bg-white px-6 py-8 sm:px-12">
        <div className="mb-5 flex items-center justify-between">
          <p className="font-mono text-xs font-bold uppercase tracking-widest text-[color:var(--nsi-ink)]">
            Five-Pillar Index Breakdown
          </p>
          <span className="font-mono text-[0.68rem] uppercase tracking-wider text-[color:var(--nsi-ink-muted)]">
            Scale: 1.0 (Critical) – 10.0 (Resilient)
          </span>
        </div>

        <div className="grid grid-cols-1 divide-y divide-[color:var(--nsi-rule)] border border-[color:var(--nsi-rule-strong)] sm:grid-cols-5 sm:divide-x sm:divide-y-0">
          {pillars.slice(0, 5).map((p, idx) => {
            const Icon = iconFor(p.title);
            const pct = Math.min((p.score / 10) * 100, 100);
            return (
              <div key={p.title} className="flex flex-col justify-between p-4 sm:p-5">
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-[0.65rem] font-bold uppercase tracking-widest text-[color:var(--nsi-ink-muted)]">
                      0{idx + 1}
                    </span>
                    <Icon className="h-5 w-5 text-[color:var(--nsi-green)]" />
                  </div>
                  <div className="mt-3 flex items-baseline justify-between gap-2">
                    <p className="font-mono text-xs font-bold uppercase tracking-wider text-[color:var(--nsi-ink)]">
                      {p.title}
                    </p>
                    <span className="font-serif text-2xl font-bold tabular-nums text-[color:var(--nsi-green)]">
                      {p.score.toFixed(1)}
                    </span>
                  </div>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-[1px] bg-[color:var(--nsi-paper-2)]">
                    <div
                      className="h-full bg-[color:var(--nsi-green)] transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
                {p.summary && (
                  <p className="mt-3 text-xs leading-relaxed text-[color:var(--nsi-ink-soft)]">
                    {p.summary}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Main Report Dossier Body ─────────────────────────────────── */}
      <div className="bg-[color:var(--nsi-paper)] px-6 py-10 sm:px-12 sm:py-12">
        <div className="grid gap-10 lg:grid-cols-12">
          {/* Primary Analytical Column (8 Cols) */}
          <div className="space-y-10 lg:col-span-8">
            {/* State Highlight */}
            <section id="state-spotlight" className="scroll-mt-24">
              <SectionLabel index="01">Monthly State Highlight</SectionLabel>
              <div className="rounded-[4px] border border-[color:var(--nsi-rule-strong)] bg-white p-6 sm:p-8">
                <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[color:var(--nsi-rule)] pb-5">
                  <div>
                    <span className="font-mono text-[0.68rem] font-bold uppercase tracking-widest text-[color:var(--nsi-ink-muted)]">
                      Sub-National Evidence Spotlight
                    </span>
                    <h3 className="mt-1 font-serif text-2xl font-bold tracking-tight text-[color:var(--nsi-ink)] sm:text-3xl">
                      {spotlight.state
                        ? `${spotlight.state} State`
                        : "State Spotlight"}
                    </h3>
                  </div>
                  {spotlight.score != null && (
                    <div className="flex shrink-0 items-baseline gap-1 rounded-[3px] border border-[color:var(--nsi-green)]/30 bg-[color:var(--nsi-emerald-tint)] px-4 py-2">
                      <span className="font-mono text-2xl font-bold tabular-nums text-[color:var(--nsi-green)]">
                        {spotlight.score.toFixed(1)}
                      </span>
                      <span className="font-mono text-xs text-[color:var(--nsi-ink-soft)]">
                        /10
                      </span>
                    </div>
                  )}
                </div>

                <div className="mt-6 text-[0.95rem] leading-7 text-[color:var(--nsi-ink-soft)] [&_li]:mt-2 [&_ul]:list-disc [&_ul]:pl-5">
                  {stateKeyPointsHtml ? (
                    <SafeHtml html={stateKeyPointsHtml} />
                  ) : (
                    <ul className="list-none space-y-3 pl-0">
                      {(spotlight.bullets ?? []).slice(0, 5).map((b, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <CheckIcon />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </section>

            {/* Institution Highlight */}
            {inst.institution && (
              <section id="institution-spotlight" className="scroll-mt-24">
                <SectionLabel index="02">Institution Highlight</SectionLabel>
                <div className="rounded-[4px] border border-[color:var(--nsi-rule-strong)] bg-white p-6 sm:p-8">
                  <div className="border-b border-[color:var(--nsi-rule)] pb-4">
                    <span className="font-mono text-[0.68rem] font-bold uppercase tracking-widest text-[color:var(--nsi-gold-deep)]">
                      Public Institution Assessment
                    </span>
                    <h3 className="mt-1 font-serif text-2xl font-bold tracking-tight text-[color:var(--nsi-ink)] sm:text-3xl">
                      {inst.institution}
                    </h3>
                    {inst.summary && (
                      <p className="mt-2 text-base font-medium leading-relaxed text-[color:var(--nsi-ink-soft)]">
                        {inst.summary}
                      </p>
                    )}
                  </div>

                  {(instKeyPointsHtml || (inst.bullets ?? []).length > 0) && (
                    <div className="mt-6 text-[0.95rem] leading-7 text-[color:var(--nsi-ink-soft)] [&_li]:mt-2 [&_ul]:list-disc [&_ul]:pl-5">
                      {instKeyPointsHtml ? (
                        <SafeHtml html={instKeyPointsHtml} />
                      ) : (
                        <ul className="grid list-none gap-3 pl-0 sm:grid-cols-2">
                          {inst.bullets!.map((b, i) => (
                            <li key={i} className="flex items-start gap-3">
                              <div className="mt-2.5 h-1.5 w-1.5 shrink-0 bg-[color:var(--nsi-green)]" />
                              <span>{b}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* Street Pulse */}
            {hasStreetPulse && (
              <section id="street-pulse-spotlight" className="scroll-mt-24">
                <SectionLabel index="03">On-Ground Street Pulse</SectionLabel>
                <div className="rounded-[4px] border border-[color:var(--nsi-rule-strong)] bg-white p-6 sm:p-8">
                  {streetPulse.title && (
                    <h3 className="font-serif text-2xl font-bold tracking-tight text-[color:var(--nsi-ink)]">
                      {streetPulse.title}
                    </h3>
                  )}
                  {streetPulse.summary && (
                    <p className="mt-2 border-l-2 border-[color:var(--nsi-gold)] pl-4 text-base font-medium leading-relaxed text-[color:var(--nsi-ink-soft)]">
                      {streetPulse.summary}
                    </p>
                  )}
                  {streetPulseKeyPointsHtml && (
                    <div className="mt-5 text-[0.95rem] leading-7 text-[color:var(--nsi-ink-soft)] [&_li]:mt-2 [&_ul]:list-disc [&_ul]:pl-5">
                      <SafeHtml html={streetPulseKeyPointsHtml} />
                    </div>
                  )}
                </div>
              </section>
            )}
          </div>

          {/* Right Sidebar: Citizen Sentiment & Sources (4 Cols) */}
          <div className="space-y-6 lg:col-span-4">
            {/* Public Sentiment Readout */}
            {hasSentiment && (
              <div className="overflow-hidden rounded-[4px] border border-[color:var(--nsi-rule-strong)] bg-white">
                <div className="border-b border-[color:var(--nsi-rule)] bg-[color:var(--nsi-paper-2)] px-6 py-4">
                  <h3 className="font-mono text-xs font-bold uppercase tracking-widest text-[color:var(--nsi-ink)]">
                    What Nigerians Said
                  </h3>
                </div>
                <div className="p-6">
                  {topWords.length > 0 && (
                    <div className="mb-6">
                      <p className="mb-2.5 font-mono text-[0.65rem] font-bold uppercase tracking-widest text-[color:var(--nsi-ink-muted)]">
                        Top Citizen Descriptors
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {topWords.slice(0, 6).map((w) => (
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

                  {avg != null && (
                    <div className="border-t border-[color:var(--nsi-rule)] pt-5 text-center">
                      <p className="font-mono text-[0.65rem] font-bold uppercase tracking-widest text-[color:var(--nsi-ink-muted)]">
                        Average Public Check-In Score
                      </p>
                      <div className="mt-2 flex items-baseline justify-center gap-1">
                        <span className="font-serif text-5xl font-bold tabular-nums text-[color:var(--nsi-green)]">
                          {avg.toFixed(1)}
                        </span>
                        <span className="font-mono text-lg text-[color:var(--nsi-ink-muted)]">
                          /10
                        </span>
                      </div>
                      <div className="mt-4 flex justify-center">
                        <SemiGauge
                          value={avg}
                          label="Average public sentiment gauge"
                          size={180}
                        />
                      </div>
                    </div>
                  )}

                  {sentiment.topMood && (
                    <div className="mt-4 border-t border-[color:var(--nsi-rule)] pt-4 text-center">
                      <span className="font-mono text-[0.65rem] uppercase tracking-widest text-[color:var(--nsi-ink-muted)]">
                        Dominant Mood:{" "}
                      </span>
                      <span className="font-serif text-base font-bold italic text-[color:var(--nsi-gold-deep)]">
                        &ldquo;{sentiment.topMood}&rdquo;
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Sources & References */}
            <div className="overflow-hidden rounded-[4px] border border-[color:var(--nsi-rule-strong)] bg-white">
              <div className="border-b border-[color:var(--nsi-rule)] bg-[color:var(--nsi-paper-2)] px-6 py-4">
                <h3 className="font-mono text-xs font-bold uppercase tracking-widest text-[color:var(--nsi-ink)]">
                  Sources &amp; References
                </h3>
              </div>
              {sources.length > 0 ? (
                <div className="p-6">
                  <ul className="divide-y divide-[color:var(--nsi-rule)]">
                    {sources.map((s, i) => (
                      <li key={i} className="py-3 first:pt-0 last:pb-0">
                        <a
                          href={s.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group block"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-sm font-semibold text-[color:var(--nsi-green)] group-hover:underline">
                              [{String(i + 1).padStart(2, "0")}] {s.label}
                            </span>
                            <span className="font-mono text-xs text-[color:var(--nsi-ink-muted)]">
                              ↗
                            </span>
                          </div>
                          <p className="mt-0.5 line-clamp-1 break-all font-mono text-[0.65rem] text-[color:var(--nsi-ink-muted)]">
                            {s.url}
                          </p>
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p className="p-6 text-center font-mono text-xs uppercase tracking-wider text-[color:var(--nsi-ink-muted)]">
                  Sources pending publication.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Report Colophon Band ─────────────────────────────────────── */}
      <footer className="nsi-band px-6 py-8 text-white sm:px-12">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <NSIBadgeLogo className="h-14 w-20 shrink-0 drop-shadow-sm" />
            <div>
              <p className="font-serif text-lg font-bold">
                Nigeria Stability Index (NSI)
              </p>
              <p className="mt-0.5 font-mono text-xs uppercase tracking-wider text-white/60">
                Tracking security, economy, governance &amp; social cohesion.
              </p>
            </div>
          </div>

          <div className="flex flex-col items-start gap-3 sm:items-end">
            <p className="font-mono text-xs tracking-wider text-[color:var(--nsi-gold-light)]">
              WWW.NIGERIASTABILITYINDEX.ORG
            </p>
            <div className="flex items-center gap-4">
              {SOCIAL.map(({ href, label, Icon }) => (
                <Link
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/65 transition-colors hover:text-[color:var(--nsi-gold-light)]"
                  aria-label={label}
                >
                  <Icon className="h-4 w-4" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </article>
  );
}
