import Link from "next/link";
import {
  NSIBadgeLogo,
  NigeriaMapSilhouette,
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
  const IconFor = (title: string) => {
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

  // Extract edition number from period if possible
  const editionMatch = period.match(/(\d+)/);
  const editionNum = editionMatch ? editionMatch[1].padStart(3, "0") : "002";

  return (
    <div className="overflow-hidden rounded-[30px] border border-black/10 shadow-2xl">
      {/* Centered Header */}
      <div className="nsi-band relative flex flex-col items-center py-10 text-white">
        <div className="flex items-center gap-6">
          <NSIBadgeLogo className="h-28 w-24" />
          <div className="text-left">
            <h1 className="font-serif text-4xl font-bold tracking-tight lg:text-5xl">
              Nigeria Stability Index
            </h1>
            <div className="mt-2 text-xl font-medium opacity-90">
              {period} • Edition {editionNum}
            </div>
          </div>
        </div>
        <div className="mt-8 h-0.5 w-64 bg-white/20" />
      </div>

      {/* Main Content Area - Parchment Textured */}
      <div className="nsi-parchment relative px-10 pb-12 pt-10">
        {/* Tagline */}
        <div className="text-center">
          <p className="font-serif text-xl italic text-black/60">
            A calm snapshot of how Nigeria is holding together
          </p>
        </div>

        {/* Overall Score - Huge Display */}
        <div className="mt-12 flex flex-col items-center">
          <div className="flex items-baseline gap-2">
            <span className="text-[10rem] font-bold tracking-tighter text-[color:var(--nsi-green)] lg:text-[12rem]">
              {overallScore.toFixed(1)}
            </span>
            <span className="text-5xl font-semibold text-black/25 lg:text-6xl">/10</span>
          </div>
          <div className="mt-4 text-center">
            <div className="text-2xl font-bold tracking-tight text-[color:var(--nsi-ink)]">
              Nigeria&apos;s Stability Today
            </div>
            <div className="mt-1 font-serif text-2xl italic text-black/50">
              {overallNarrative ?? "Cautiously improving"}
            </div>
          </div>
        </div>

        {/* Pillar Cards Row - Compact with Green Headers */}
        <div className="mt-16 grid gap-4 sm:grid-cols-2 md:grid-cols-5">
          {pillars.slice(0, 5).map((p) => {
            const Icon = IconFor(p.title);
            return (
              <div
                key={p.title}
                className="overflow-hidden rounded-xl border border-black/10 bg-white shadow-sm"
              >
                <div className="flex items-center justify-center bg-[color:var(--nsi-green)] py-4">
                  <Icon className="h-12 w-12 text-white" />
                </div>
                <div className="p-4">
                  <div className="flex items-baseline justify-between gap-1">
                    <div className="text-[0.8rem] font-bold uppercase tracking-wider text-[color:var(--nsi-ink)]">
                      {p.title}
                    </div>
                    <div className="text-sm font-bold text-[color:var(--nsi-green)]">
                      {p.score.toFixed(1)}
                    </div>
                  </div>
                  <div className="mt-2 text-[0.75rem] italic leading-relaxed text-black/60">
                    {p.summary ?? ""}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Section: Highlights & Sentiment */}
        <div className="mt-16 grid gap-8 lg:grid-cols-3">
          {/* Monthly State Highlight */}
          <div className="overflow-hidden rounded-2xl border border-black/10 bg-white lg:col-span-2">
            <div className="nsi-band py-3 text-center text-sm font-bold text-white">
              Monthly State Highlight
            </div>
            <div className="grid gap-10 p-8 md:grid-cols-2">
              <div className="flex flex-col justify-center">
                <h4 className="font-serif text-3xl font-bold text-[color:var(--nsi-ink)]">
                  {spotlight.state ? `${spotlight.state} State` : "Lagos State"}
                </h4>
                <p className="mt-2 text-lg italic text-black/50">
                  Infrastructure Leading the Nation
                </p>

                <div className="mt-8 text-[1rem] font-medium text-black/70 [&_ul]:space-y-3 [&_ul]:list-none [&_li]:flex [&_li]:items-start [&_li]:gap-3">
                  {stateKeyPointsHtml ? (
                    <SafeHtml html={stateKeyPointsHtml} />
                  ) : (
                    <ul className="space-y-3">
                      {(spotlight.bullets?.length
                        ? spotlight.bullets
                        : [
                            "Strongest in transportation",
                            "Top in public services delivery",
                            "Rising regional influence",
                          ]
                      )
                        .slice(0, 3)
                        .map((b, idx) => (
                          <li key={idx} className="flex items-start gap-3">
                            <svg
                              className="mt-1 h-5 w-5 shrink-0 text-[color:var(--nsi-green)]"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={3}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                            <span>{b}</span>
                          </li>
                        ))}
                    </ul>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-center p-4">
                <div className="relative">
                  <div className="absolute inset-0 scale-110 blur-2xl opacity-10 bg-[color:var(--nsi-gold)] rounded-full" />
                  <NigeriaMapSilhouette className="h-64 w-64 relative opacity-95" />
                </div>
              </div>
            </div>
          </div>

          {/* Sentiment Section */}
          <div className="flex flex-col gap-8">
            <div className="overflow-hidden rounded-2xl border border-black/10 bg-white">
              <div className="bg-black/5 px-6 py-5 text-center border-b border-black/[0.08]">
                <h4 className="text-sm font-bold uppercase tracking-widest text-[color:var(--nsi-ink)]">
                  What Nigerians Said This Month
                </h4>
                {topWords.length > 0 && (
                  <div className="mt-4 flex flex-wrap justify-center gap-x-3 gap-y-1 text-[1rem]">
                    {topWords.slice(0, 4).map((w, i) => (
                      <span key={w} className="font-bold text-black/70">
                        {w}
                        {i < Math.min(3, topWords.length - 1) && (
                          <span className="ml-2 text-black/20">•</span>
                        )}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div className="p-8">
                {avg != null && (
                  <>
                    <div className="mb-6 text-center">
                      <div className="text-xs font-bold uppercase tracking-widest text-black/40">Average Public Score</div>
                      <div className="mt-2 flex items-baseline justify-center gap-1">
                        <span className="text-5xl font-bold text-[color:var(--nsi-ink)]">
                          {avg.toFixed(1)}
                        </span>
                        <span className="text-xl font-semibold text-black/25">/10</span>
                      </div>
                    </div>
                    <div className="flex justify-center">
                      <SemiGauge
                        value={avg}
                        label="Average public sentiment gauge"
                        size={200}
                      />
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Sources / References */}
            <div className="flex-1 overflow-hidden rounded-2xl border border-black/10 bg-white">
              <div className="bg-black/5 px-6 py-4 text-center border-b border-black/[0.08]">
                <h4 className="text-sm font-bold uppercase tracking-widest text-[color:var(--nsi-ink)]">
                  Sources / References
                </h4>
              </div>
              <div className="p-6">
                {sources.length > 0 ? (
                  <ul className="space-y-4">
                    {sources.map((s, idx) => (
                      <li key={idx} className="flex flex-col">
                        <a
                          href={s.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm font-bold text-[color:var(--nsi-green)] hover:underline"
                        >
                          {s.label}
                        </a>
                        <span className="mt-0.5 text-[0.7rem] text-black/40 break-all">{s.url}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-center text-xs italic text-black/40 py-4">Sources pending.</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Institution Highlight */}
        {inst.institution && (
          <div className="mt-8 overflow-hidden rounded-2xl border border-black/10 bg-white">
            <div className="nsi-band py-3 text-center text-sm font-bold text-white">
              Institution Highlight
            </div>
            <div className="p-8">
              <h4 className="font-serif text-2xl font-bold text-[color:var(--nsi-ink)]">
                {inst.institution}
              </h4>
              {inst.summary && (
                <p className="mt-3 text-[1.1rem] leading-relaxed text-black/70">{inst.summary}</p>
              )}
              {(instKeyPointsHtml || (inst.bullets ?? []).length > 0) && (
                <div className="mt-6 text-[1rem] font-medium text-black/70 [&_ul]:grid [&_ul]:gap-4 [&_ul]:sm:grid-cols-2 [&_li]:flex [&_li]:items-start [&_li]:gap-3">
                  {instKeyPointsHtml ? (
                    <SafeHtml html={instKeyPointsHtml} />
                  ) : (
                    <ul className="grid gap-4 sm:grid-cols-2">
                      {inst.bullets!.map((b, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <div className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[color:var(--nsi-green)]" />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
        {hasStreetPulse && (
          <div id="street-pulse-spotlight" className="mt-8 overflow-hidden rounded-2xl border border-black/10 bg-white scroll-mt-24">
            <div className="nsi-band py-3 text-center text-sm font-bold text-white">
              On-Ground Street Pulse
            </div>
            <div className="p-8">
              {(streetPulse.title || streetPulse.summary) && (
                <>
                  {streetPulse.title && (
                    <h4 className="font-serif text-2xl font-bold text-[color:var(--nsi-ink)]">
                      {streetPulse.title}
                    </h4>
                  )}
                  {streetPulse.summary && (
                    <p className="mt-3 text-[1.1rem] leading-relaxed text-black/70">{streetPulse.summary}</p>
                  )}
                </>
              )}
              {streetPulseKeyPointsHtml && (
                <div className="mt-4 text-[1rem] text-black/70 [&_ul]:list-disc [&_ul]:pl-5 [&_li]:mt-1">
                  <SafeHtml html={streetPulseKeyPointsHtml} />
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Footer Band */}
      <div className="nsi-band px-10 py-10 text-white">
        <div className="flex flex-col items-center gap-8 md:flex-row md:justify-between">
          <div className="flex items-center gap-6">
            <NSIBadgeLogo className="h-24 w-20" />
            <div>
              <div className="font-serif text-2xl font-bold">Nigeria Stability Index (NSI)</div>
              <div className="mt-1 text-lg opacity-70">Tracking security, economy, governance.</div>
            </div>
          </div>

          <div className="flex flex-col items-center gap-4">
            <div className="text-xl font-bold tracking-wider">www.NigeriaStabilityIndex.org</div>
            <div className="flex items-center gap-6">
              {SOCIAL.map(({ href, label, Icon }) => (
                <Link
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="opacity-70 transition-all hover:opacity-100 hover:scale-110"
                  aria-label={label}
                >
                  <Icon className="h-6 w-6" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
