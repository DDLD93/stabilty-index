import Link from "next/link";
import Image from "next/image";
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

function SectionLabel({ children, accent = "emerald" }: { children: React.ReactNode; accent?: "emerald" | "amber" | "cyan" }) {
  const colorClass =
    accent === "amber" ? "text-[#fbbf24]" : accent === "cyan" ? "text-[#38bdf8]" : "text-[#00f59b]";
  return (
    <div className="mb-5 flex items-center gap-3">
      <div className="h-px flex-1 bg-white/10" />
      <h2 className={`font-mono text-xs font-bold uppercase tracking-widest ${colorClass}`}>
        {children}
      </h2>
      <div className="h-px flex-1 bg-white/10" />
    </div>
  );
}

function CheckIcon() {
  return (
    <svg
      className="mt-0.5 h-4 w-4 shrink-0 text-[#00f59b]"
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
    <article className="observatory-card overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.85)]">
      {/* Hero Band */}
      <header className="relative border-b border-[#00f59b]/20 bg-gradient-to-r from-[#031109] via-[#071f13] to-[#041009] px-8 py-12 text-white sm:px-12">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          {/* Logo + title */}
          <div className="flex items-center gap-5">
            <div className="relative flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border border-[#00f59b]/40 bg-[#06190e] p-2 shadow-[0_0_25px_rgba(0,245,155,0.3)]">
              <Image
                src="/nsi-emblem.webp"
                alt="NSI Emblem"
                width={64}
                height={64}
                className="object-contain"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#00f59b]">
                  SOVEREIGN STABILITY OBSERVATORY
                </span>
                <span className="rounded bg-[#00f59b]/15 px-2 py-0.5 font-mono text-[10px] text-[#00f59b] border border-[#00f59b]/30">
                  DECLASSIFIED DOSSIER
                </span>
              </div>
              <h1 className="mt-1 font-serif text-3xl font-bold sm:text-4xl">
                {period} National Snapshot
              </h1>
              <p className="mt-1 font-mono text-xs text-slate-400">
                OFFICIAL REPORT EDITION {editionNum} · REF NSI-PUB-{editionNum}
              </p>
            </div>
          </div>

          {/* Overall score dial */}
          <div className="flex flex-col items-start gap-1 sm:items-end">
            <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#00f59b]">
              COMPOSITE CALIBRATION
            </span>
            <div className="flex items-baseline gap-1.5 font-mono">
              <span className="text-6xl font-black text-[#00f59b] leading-none drop-shadow-[0_0_25px_rgba(0,245,155,0.5)] sm:text-7xl">
                {overallScore.toFixed(1)}
              </span>
              <span className="text-2xl font-semibold text-slate-500">/ 10</span>
            </div>
          </div>
        </div>

        {/* Narrative tagline */}
        {overallNarrative && (
          <div className="mt-8 border-t border-[#00f59b]/15 pt-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#fbbf24]/30 bg-[#2b1f09]/80 px-4 py-1.5 font-mono text-xs text-[#fbbf24]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#fbbf24] animate-ping" />
              <span>CONSENSUS ASSESSMENT</span>
            </div>
            <p className="mt-3 font-serif text-xl italic leading-relaxed text-slate-200 sm:text-2xl">
              &ldquo;{overallNarrative}&rdquo;
            </p>
          </div>
        )}
      </header>

      {/* Pillar Scores Strip */}
      <div className="border-b border-[#00f59b]/15 bg-[#040e08]/90 px-8 py-8 sm:px-12">
        <div className="flex items-center justify-between mb-6">
          <p className="font-mono text-xs font-bold uppercase tracking-widest text-[#00f59b]">
            DISAGGREGATED PILLAR TELEMETRY
          </p>
          <span className="font-mono text-[11px] text-slate-400">AUTONOMOUS 1–10 METRIC</span>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
          {pillars.slice(0, 5).map((p) => {
            const Icon = iconFor(p.title);
            const pct = Math.min((p.score / 10) * 100, 100);
            return (
              <div
                key={p.title}
                className="flex flex-col justify-between rounded-xl border border-white/5 bg-black/40 p-4 transition-all hover:border-[#00f59b]/30 hover:bg-[#081a10]"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <Icon className="h-5 w-5 text-[#00f59b]" />
                    <span className="font-mono text-lg font-bold text-[#00f59b]">
                      {p.score.toFixed(1)}
                    </span>
                  </div>
                  <p className="mt-3 font-mono text-xs font-bold uppercase tracking-wider text-white">
                    {p.title}
                  </p>
                  {p.summary && (
                    <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-slate-400">
                      {p.summary}
                    </p>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-white/5">
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-black/80">
                    <div
                      className="h-full bg-gradient-to-r from-[#00f59b] to-[#fbbf24]"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Article Body */}
      <div className="px-8 py-10 sm:px-12 bg-[#030a06]">
        <div className="grid gap-10 lg:grid-cols-12">

          {/* Main content column */}
          <div className="space-y-10 lg:col-span-8">

            {/* State Highlight */}
            <section>
              <SectionLabel accent="cyan">Sub-National Regional Highlight</SectionLabel>
              <div className="rounded-2xl border border-[#38bdf8]/20 bg-[#06161c]/80 p-7 sm:p-8 backdrop-blur-md">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <span className="font-mono text-[10px] uppercase tracking-wider text-[#38bdf8]">
                      REGIONAL JURISDICTION
                    </span>
                    <h3 className="font-serif text-2xl font-bold tracking-tight text-white sm:text-3xl">
                      {spotlight.state ? `${spotlight.state} State` : "Sub-National Corridor"}
                    </h3>
                  </div>

                  {spotlight.score != null && (
                    <div className="flex shrink-0 items-baseline gap-1 rounded-xl border border-[#38bdf8]/30 bg-black/50 px-4 py-2 font-mono">
                      <span className="text-2xl font-bold text-[#38bdf8]">
                        {spotlight.score.toFixed(1)}
                      </span>
                      <span className="text-xs text-slate-500">/ 10</span>
                    </div>
                  )}
                </div>

                <div className="mt-6 text-sm leading-relaxed text-slate-300 [&_li]:flex [&_li]:items-start [&_li]:gap-3 [&_ul]:list-none [&_ul]:space-y-3">
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
                <SectionLabel accent="emerald">Governance Apparatus Highlight</SectionLabel>
                <div className="rounded-2xl border border-[#00f59b]/20 bg-[#05180f]/80 p-7 sm:p-8 backdrop-blur-md">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-[#00f59b]">
                    REGULATORY DISCLOSURE
                  </span>
                  <h3 className="font-serif text-2xl font-bold tracking-tight text-white sm:text-3xl">
                    {inst.institution}
                  </h3>

                  {inst.summary && (
                    <p className="mt-3 text-sm sm:text-base leading-relaxed text-slate-200 font-medium">
                      {inst.summary}
                    </p>
                  )}

                  {(instKeyPointsHtml || (inst.bullets ?? []).length > 0) && (
                    <div className="mt-6 text-sm leading-relaxed text-slate-300 [&_li]:flex [&_li]:items-start [&_li]:gap-3 [&_ul]:grid [&_ul]:gap-3 [&_ul]:sm:grid-cols-2">
                      {instKeyPointsHtml ? (
                        <SafeHtml html={instKeyPointsHtml} />
                      ) : (
                        <ul className="grid gap-3 sm:grid-cols-2">
                          {inst.bullets!.map((b, i) => (
                            <li key={i} className="flex items-start gap-3">
                              <div className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#00f59b]" />
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
                <SectionLabel accent="amber">On-Ground Street Pulse</SectionLabel>
                <div className="rounded-2xl border border-[#f59e0b]/20 bg-[#171207]/80 p-7 sm:p-8 backdrop-blur-md">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-[#fbbf24]">
                    COMMUNITY FEEDBACK AUDIT
                  </span>
                  {streetPulse.title && (
                    <h3 className="font-serif text-2xl font-bold tracking-tight text-white">
                      {streetPulse.title}
                    </h3>
                  )}
                  {streetPulse.summary && (
                    <p className="mt-3 font-serif text-lg italic text-[#fbbf24] leading-relaxed">
                      &ldquo;{streetPulse.summary}&rdquo;
                    </p>
                  )}
                  {streetPulseKeyPointsHtml && (
                    <div className="mt-5 text-sm leading-relaxed text-slate-300 [&_li]:mt-2 [&_ul]:list-disc [&_ul]:pl-5">
                      <SafeHtml html={streetPulseKeyPointsHtml} />
                    </div>
                  )}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-8 lg:col-span-4">

            {/* Public Sentiment */}
            {hasSentiment && (
              <div className="rounded-2xl border border-[#00f59b]/20 bg-[#07160e]/90 p-6 backdrop-blur-md">
                <div className="border-b border-[#00f59b]/15 pb-4">
                  <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-[#00f59b]">
                    Nationwide Sentiment
                  </h3>
                </div>

                <div className="pt-6">
                  {topWords.length > 0 && (
                    <div className="mb-6 flex flex-wrap gap-2">
                      {topWords.slice(0, 5).map((w) => (
                        <span
                          key={w}
                          className="rounded-lg border border-[#00f59b]/25 bg-[#0a2315] px-3 py-1 font-mono text-xs text-[#00f59b]"
                        >
                          #{w}
                        </span>
                      ))}
                    </div>
                  )}

                  {avg != null && (
                    <div className="text-center rounded-xl border border-white/5 bg-black/40 p-4">
                      <p className="font-mono text-[10px] uppercase tracking-wider text-slate-400">
                        Citizen Average Rating
                      </p>
                      <div className="mt-2 flex items-baseline justify-center gap-1 font-mono">
                        <span className="text-4xl font-extrabold text-[#00f59b]">
                          {avg.toFixed(1)}
                        </span>
                        <span className="text-base text-slate-500">/ 10</span>
                      </div>
                    </div>
                  )}

                  {sentiment.topMood && (
                    <p className="mt-4 text-center font-mono text-xs text-slate-300">
                      Prevailing Tone:{" "}
                      <span className="font-bold text-[#fbbf24]">
                        &ldquo;{sentiment.topMood}&rdquo;
                      </span>
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Sources & Methodological Grounding */}
            <div className="rounded-2xl border border-[#00f59b]/20 bg-[#07160e]/90 p-6 backdrop-blur-md">
              <div className="border-b border-[#00f59b]/15 pb-4">
                <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-[#38bdf8]">
                  Verified Data Sources
                </h3>
              </div>

              <div className="pt-6">
                {sources.length > 0 ? (
                  <ul className="space-y-3">
                    {sources.map((s, i) => (
                      <li key={i}>
                        <a
                          href={s.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group block rounded-lg border border-white/5 bg-black/30 p-3 transition-all hover:border-[#38bdf8]/40 hover:bg-[#0a1e28]"
                        >
                          <div className="flex items-center justify-between text-xs font-semibold text-slate-200 group-hover:text-white">
                            <span>{s.label}</span>
                            <span className="text-[#38bdf8]">↗</span>
                          </div>
                          <p className="mt-1 truncate font-mono text-[10px] text-slate-500">
                            {s.url}
                          </p>
                        </a>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="font-mono text-xs text-slate-500">
                    Sourced from NBS, CBN, ACLED, and nationwide citizen field returns.
                  </p>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Footer Band */}
      <footer className="border-t border-[#00f59b]/15 bg-[#030906] px-8 py-8 text-white sm:px-12">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <Image
              src="/nsi-emblem.webp"
              alt="NSI"
              width={40}
              height={40}
              className="object-contain"
            />
            <div>
              <p className="font-serif text-base font-bold">Nigeria Stability Index (NSI)</p>
              <p className="text-xs text-slate-400">
                A non-partisan civic public good by The 24 Angels Initiative.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-5">
            {SOCIAL.map(({ href, label, Icon }) => (
              <Link
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-[#00f59b] transition-colors"
                aria-label={label}
              >
                <Icon className="h-5 w-5" />
              </Link>
            ))}
          </div>
        </div>
      </footer>
    </article>
  );
}
