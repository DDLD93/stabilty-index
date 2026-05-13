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
  { href: "https://www.tiktok.com/@nigeria_nsi", label: "TikTok", Icon: SocialTikTokIcon },
] as const;

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-5 flex items-center gap-3">
      <div className="h-px flex-1 bg-black/8" />
      <h2 className="text-[0.6rem] font-bold uppercase tracking-widest text-[color:var(--nsi-green)]">
        {children}
      </h2>
      <div className="h-px flex-1 bg-black/8" />
    </div>
  );
}

function CheckIcon() {
  return (
    <svg
      className="mt-0.5 h-4 w-4 shrink-0 text-[color:var(--nsi-green)]"
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
  snapshotId,
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
  const hasSentiment = topWords.length > 0 || avg != null;
  const stateKeyPointsHtml = getKeyPointsHtml(spotlight);
  const instKeyPointsHtml = getKeyPointsHtml(inst);
  const streetPulseKeyPointsHtml =
    typeof streetPulse.keyPointsHtml === "string" ? streetPulse.keyPointsHtml : "";
  const hasStreetPulse =
    streetPulse.title || streetPulse.summary || streetPulseKeyPointsHtml.trim();

  const editionMatch = period.match(/(\d+)/);
  const editionNum = editionMatch ? editionMatch[1].padStart(3, "0") : "001";

  return (
    <article className="overflow-hidden rounded-[30px] border border-black/10 shadow-2xl">

      {/* ── Hero Band ─────────────────────────────────────────────────── */}
      <header className="nsi-band relative px-8 py-12 text-white sm:px-12">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">

          {/* Logo + title */}
          <div className="flex items-center gap-5">
            <NSIBadgeLogo className="h-20 w-16 shrink-0" />
            <div>
              <p className="text-[0.6rem] font-bold uppercase tracking-widest text-white/50">
                Nigeria Stability Index
              </p>
              <h1 className="mt-1.5 font-serif text-2xl font-bold leading-tight sm:text-3xl">
                {period} Report
              </h1>
              <p className="mt-1 text-sm text-white/50">Edition {editionNum}</p>
            </div>
          </div>

          {/* Overall score */}
          <div className="flex flex-col items-start gap-1 sm:items-end">
            <span className="text-[0.6rem] font-bold uppercase tracking-widest text-white/40">
              Overall Score
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-6xl font-bold text-[color:var(--nsi-gold)] leading-none sm:text-7xl">
                {overallScore.toFixed(1)}
              </span>
              <span className="text-2xl font-medium text-white/25">/10</span>
            </div>
          </div>
        </div>

        {/* Narrative tagline */}
        {overallNarrative && (
          <p className="mt-8 border-t border-white/10 pt-6 font-serif text-base italic leading-relaxed text-white/60 sm:text-lg">
            &ldquo;{overallNarrative}&rdquo;
          </p>
        )}
      </header>

      {/* ── Pillar Scores Strip ──────────────────────────────────────── */}
      <div className="border-b border-black/8 bg-white px-8 py-7 sm:px-12">
        <p className="mb-5 text-[0.6rem] font-bold uppercase tracking-widest text-[color:var(--nsi-ink-soft)]">
          Pillar Scores
        </p>
        <div className="grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-5">
          {pillars.slice(0, 5).map((p) => {
            const Icon = iconFor(p.title);
            const pct = Math.min((p.score / 10) * 100, 100);
            return (
              <div key={p.title} className="flex flex-col gap-2">
                <div className="flex items-center justify-between gap-2">
                  <Icon className="h-5 w-5 text-[color:var(--nsi-green)]" />
                  <span className="text-sm font-bold text-[color:var(--nsi-green)]">
                    {p.score.toFixed(1)}
                  </span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-black/8">
                  <div
                    className="h-full rounded-full bg-[color:var(--nsi-green)] transition-all"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <p className="text-[0.6rem] font-bold uppercase tracking-wider text-[color:var(--nsi-ink-soft)]">
                  {p.title}
                </p>
                {p.summary && (
                  <p className="line-clamp-2 text-[0.7rem] italic leading-relaxed text-black/45">
                    {p.summary}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Article Body ─────────────────────────────────────────────── */}
      <div className="bg-[color:var(--nsi-paper)] px-8 py-10 sm:px-12">
        <div className="grid gap-10 lg:grid-cols-3">

          {/* Main content column */}
          <div className="space-y-10 lg:col-span-2">

            {/* State Highlight */}
            <section>
              <SectionLabel>Monthly State Highlight</SectionLabel>
              <div className="rounded-2xl border border-black/8 bg-white p-7 sm:p-8">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <h3 className="font-serif text-2xl font-bold tracking-tight text-[color:var(--nsi-ink)] sm:text-3xl">
                    {spotlight.state ? `${spotlight.state} State` : "State Spotlight"}
                  </h3>
                  {spotlight.score != null && (
                    <div className="flex shrink-0 items-baseline gap-0.5 rounded-xl border border-black/8 bg-[color:var(--nsi-paper)] px-4 py-2">
                      <span className="text-xl font-bold text-[color:var(--nsi-green)]">
                        {spotlight.score.toFixed(1)}
                      </span>
                      <span className="text-sm text-black/30">/10</span>
                    </div>
                  )}
                </div>

                <div className="mt-6 text-[0.9375rem] leading-7 text-black/70 [&_li]:flex [&_li]:items-start [&_li]:gap-3 [&_ul]:list-none [&_ul]:space-y-3">
                  {stateKeyPointsHtml ? (
                    <SafeHtml html={stateKeyPointsHtml} />
                  ) : (
                    <ul className="space-y-3">
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
              <section>
                <SectionLabel>Institution Highlight</SectionLabel>
                <div className="rounded-2xl border border-black/8 bg-white p-7 sm:p-8">
                  <h3 className="font-serif text-xl font-bold tracking-tight text-[color:var(--nsi-ink)] sm:text-2xl">
                    {inst.institution}
                  </h3>
                  {inst.summary && (
                    <p className="mt-3 text-[1rem] leading-7 text-black/65">{inst.summary}</p>
                  )}
                  {(instKeyPointsHtml || (inst.bullets ?? []).length > 0) && (
                    <div className="mt-6 text-[0.9375rem] leading-7 text-black/70 [&_li]:flex [&_li]:items-start [&_li]:gap-3 [&_ul]:grid [&_ul]:gap-3 [&_ul]:sm:grid-cols-2">
                      {instKeyPointsHtml ? (
                        <SafeHtml html={instKeyPointsHtml} />
                      ) : (
                        <ul className="grid gap-3 sm:grid-cols-2">
                          {inst.bullets!.map((b, i) => (
                            <li key={i} className="flex items-start gap-3">
                              <div className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[color:var(--nsi-green)]" />
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
                <SectionLabel>On-Ground Street Pulse</SectionLabel>
                <div className="rounded-2xl border border-black/8 bg-white p-7 sm:p-8">
                  {streetPulse.title && (
                    <h3 className="font-serif text-xl font-bold tracking-tight text-[color:var(--nsi-ink)]">
                      {streetPulse.title}
                    </h3>
                  )}
                  {streetPulse.summary && (
                    <p className="mt-3 text-[1rem] leading-7 text-black/65">
                      {streetPulse.summary}
                    </p>
                  )}
                  {streetPulseKeyPointsHtml && (
                    <div className="mt-5 text-[0.9375rem] leading-7 text-black/70 [&_li]:mt-2 [&_ul]:list-disc [&_ul]:pl-5">
                      <SafeHtml html={streetPulseKeyPointsHtml} />
                    </div>
                  )}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">

            {/* Public Sentiment */}
            {hasSentiment && (
              <div className="overflow-hidden rounded-2xl border border-black/8 bg-white">
                <div className="border-b border-black/8 px-6 py-4">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-[color:var(--nsi-ink)]">
                    Public Sentiment
                  </h3>
                </div>
                <div className="p-6">
                  {topWords.length > 0 && (
                    <div className="mb-5 flex flex-wrap gap-2">
                      {topWords.slice(0, 4).map((w) => (
                        <span
                          key={w}
                          className="rounded-full border border-black/8 bg-[color:var(--nsi-paper)] px-3 py-1 text-xs font-semibold text-[color:var(--nsi-ink-soft)]"
                        >
                          {w}
                        </span>
                      ))}
                    </div>
                  )}
                  {avg != null && (
                    <>
                      <div className="text-center">
                        <p className="text-[0.6rem] font-bold uppercase tracking-widest text-black/35">
                          Average Public Score
                        </p>
                        <div className="mt-2 flex items-baseline justify-center gap-1">
                          <span className="text-4xl font-bold text-[color:var(--nsi-ink)]">
                            {avg.toFixed(1)}
                          </span>
                          <span className="text-lg font-medium text-black/25">/10</span>
                        </div>
                      </div>
                      <div className="mt-4 flex justify-center">
                        <SemiGauge value={avg} label="Average public sentiment gauge" size={180} />
                      </div>
                    </>
                  )}
                  {sentiment.topMood && (
                    <p className="mt-3 text-center text-sm text-black/45">
                      Top mood:{" "}
                      <span className="font-semibold text-[color:var(--nsi-ink)]">
                        {sentiment.topMood}
                      </span>
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Sources */}
            {sources.length > 0 && (
              <div className="overflow-hidden rounded-2xl border border-black/8 bg-white">
                <div className="border-b border-black/8 px-6 py-4">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-[color:var(--nsi-ink)]">
                    Sources & References
                  </h3>
                </div>
                <div className="p-6">
                  <ul className="space-y-4">
                    {sources.map((s, i) => (
                      <li key={i}>
                        <a
                          href={s.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm font-semibold text-[color:var(--nsi-green)] hover:underline"
                        >
                          {s.label}
                        </a>
                        <p className="mt-0.5 line-clamp-1 break-all text-[0.65rem] text-black/30">
                          {s.url}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Empty sources placeholder */}
            {sources.length === 0 && (
              <div className="overflow-hidden rounded-2xl border border-black/8 bg-white">
                <div className="border-b border-black/8 px-6 py-4">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-[color:var(--nsi-ink)]">
                    Sources & References
                  </h3>
                </div>
                <p className="p-6 text-center text-xs italic text-black/35">
                  Sources pending.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Footer Band ──────────────────────────────────────────────── */}
      <footer className="nsi-band px-8 py-9 text-white sm:px-12">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <NSIBadgeLogo className="h-16 w-14 shrink-0" />
            <div>
              <p className="font-serif text-lg font-bold">Nigeria Stability Index (NSI)</p>
              <p className="mt-0.5 text-sm text-white/55">
                Tracking security, economy, governance.
              </p>
            </div>
          </div>

          <div className="flex flex-col items-start gap-3 sm:items-end">
            <p className="text-sm font-medium text-white/60">www.NigeriaStabilityIndex.org</p>
            <div className="flex items-center gap-5">
              {SOCIAL.map(({ href, label, Icon }) => (
                <Link
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="opacity-55 transition-all hover:scale-110 hover:opacity-100"
                  aria-label={label}
                >
                  <Icon className="h-5 w-5" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </article>
  );
}
