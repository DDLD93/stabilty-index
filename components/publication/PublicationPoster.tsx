import Link from "next/link";
import {
  NSIBadgeLogo,
  NigeriaMapSilhouette,
  PillarEconomyIcon,
  PillarGovernanceIcon,
  PillarInvestorIcon,
  PillarSecurityIcon,
  PillarSocialIcon,
  SocialFacebookIcon,
  SocialLinkedInIcon,
  SocialXIcon,
  SocialYouTubeIcon,
} from "@/components/public/icons";
import { SemiGauge } from "@/components/public/SemiGauge";

export type PosterPillar = { title: string; score: number; summary?: string };
export type PosterSpotlight = {
  state?: string;
  score?: number;
  bullets?: string[];
};
export type PosterSentiment = {
  topWords?: string[];
  averagePublicScore?: number;
  topMood?: string;
};

export function PublicationPoster({
  snapshotId,
  period,
  overallScore,
  overallNarrative,
  pillars,
  spotlight,
  sentiment,
}: {
  snapshotId: string;
  period: string;
  overallScore: number;
  overallNarrative: string | null;
  pillars: PosterPillar[];
  spotlight: PosterSpotlight;
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

  // Extract edition number from period if possible
  const editionMatch = period.match(/(\d+)/);
  const editionNum = editionMatch ? editionMatch[1].padStart(3, "0") : "001";

  return (
    <div className="overflow-hidden rounded-[30px] border border-black/10 bg-white shadow-lg">
      {/* Header with NSI Badge */}
      <div className="nsi-band relative px-8 py-8 text-white">
        {/* Decorative background */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(ellipse 50% 80% at 85% 30%, oklch(0.4 0.05 164 / 0.4), transparent 50%)",
          }}
        />

        <div className="relative flex flex-col items-center gap-4 md:flex-row md:justify-between">
          {/* Badge Logo and Title */}
          <div className="flex items-center gap-4">
            <NSIBadgeLogo className="h-20 w-16 md:h-24 md:w-20" />
            <div>
              <h1 className="font-serif text-2xl font-bold tracking-tight md:text-3xl">
                Nigeria Stability Index
              </h1>
              <div className="mt-1 inline-block rounded-full border border-white/30 bg-white/10 px-4 py-1 text-sm">
                {period} • Edition {editionNum}
              </div>
            </div>
          </div>

          {/* View report link */}
          <Link
            className="text-sm opacity-90 underline hover:opacity-100"
            href={`/reports/${snapshotId}`}
          >
            View full report
          </Link>
        </div>
      </div>

      {/* Main Content Area */}
      <div
        className="relative px-8 pb-8 pt-6"
        style={{
          background:
            "linear-gradient(180deg, oklch(0.97 0.02 88) 0%, oklch(0.93 0.02 160 / 0.3) 100%)",
        }}
      >
        {/* Tagline */}
        <div className="text-center">
          <p className="font-serif text-base italic text-black/70">
            A calm snapshot of how Nigeria is holding together
          </p>
        </div>

        {/* Overall Score */}
        <div className="mt-6 flex flex-col items-center">
          <div className="flex items-baseline gap-1">
            <span className="text-8xl font-semibold tracking-tight text-[color:var(--nsi-green)] md:text-9xl">
              {overallScore.toFixed(1)}
            </span>
            <span className="text-4xl text-black/50">/10</span>
          </div>
          <div className="mt-3 text-center">
            <div className="text-lg font-semibold text-[color:var(--nsi-green-ink)]">
              Nigeria's Stability Today
            </div>
            <div className="mt-1 font-serif text-lg italic text-black/70">
              {overallNarrative ?? "Cautiously improving"}
            </div>
          </div>
        </div>

        {/* Pillar Cards Row */}
        <div className="mt-8 grid gap-3 sm:grid-cols-2 md:grid-cols-5">
          {pillars.slice(0, 5).map((p) => {
            const Icon = IconFor(p.title);
            return (
              <div
                key={p.title}
                className="overflow-hidden rounded-xl border border-black/8 bg-white shadow-sm"
              >
                {/* Icon header */}
                <div className="flex items-center justify-center bg-[color:var(--nsi-green)] py-3">
                  <Icon className="h-10 w-10" />
                </div>
                {/* Content */}
                <div className="px-3 pb-3 pt-2">
                  <div className="flex items-baseline justify-between gap-1">
                    <div className="text-xs font-semibold text-[color:var(--nsi-ink)]">
                      {p.title}
                    </div>
                    <div className="text-xs font-bold text-[color:var(--nsi-green)]">
                      {Number.isFinite(p.score)
                        ? Number(p.score).toFixed(1)
                        : "—"}
                    </div>
                  </div>
                  <div className="mt-1.5 text-[10px] italic leading-4 text-black/60">
                    {p.summary ?? ""}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* State Highlight and Sentiment Section */}
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {/* Monthly State Highlight */}
          <div className="overflow-hidden rounded-2xl border border-black/8 bg-white md:col-span-2">
            <div className="bg-[color:var(--nsi-green)] px-6 py-3 text-center text-sm font-semibold text-white">
              Monthly State Highlight
            </div>
            <div className="grid gap-6 p-6 md:grid-cols-2">
              {/* State Info */}
              <div>
                <h4 className="font-serif text-2xl font-bold text-[color:var(--nsi-ink)]">
                  {spotlight.state ?? "Lagos State"}
                </h4>
                <p className="mt-1 text-sm italic text-black/60">
                  Infrastructure Leading the Nation
                </p>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-5xl font-semibold tracking-tight text-[color:var(--nsi-green)]">
                    {(spotlight.score ?? 7.1).toFixed(1)}
                  </span>
                  <span className="text-xl text-black/50">/10</span>
                </div>

                <ul className="mt-5 space-y-2">
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
                      <li key={idx} className="flex items-start gap-2 text-sm text-black/70">
                        <svg
                          className="mt-0.5 h-4 w-4 shrink-0 text-[color:var(--nsi-green)]"
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
              </div>

              {/* Nigeria Map */}
              <div className="flex items-center justify-center">
                <NigeriaMapSilhouette className="h-48 w-48 opacity-90" />
              </div>
            </div>
          </div>

          {/* What Nigerians Said */}
          <div className="overflow-hidden rounded-2xl border border-black/8 bg-white">
            <div className="bg-[color:var(--nsi-paper)] px-5 py-4 text-center">
              <h4 className="font-semibold text-[color:var(--nsi-ink)]">
                What Nigerians Said This Month
              </h4>
              <div className="mt-3 flex flex-wrap justify-center gap-x-2 gap-y-1 text-sm">
                {(topWords.length
                  ? topWords
                  : ["Hopeful", "Steady", "Progressing", "Demanding"]
                )
                  .slice(0, 4)
                  .map((w, i) => (
                    <span key={w} className="font-semibold text-black/70">
                      {w}
                      {i < 3 && <span className="mx-1 text-black/30">•</span>}
                    </span>
                  ))}
              </div>

              <div className="mt-4 text-xs text-black/55">Average Public Score</div>
              <div className="mt-1 flex items-baseline justify-center gap-1">
                <span className="text-4xl font-semibold tracking-tight text-[color:var(--nsi-ink)]">
                  {avg !== null ? avg.toFixed(1) : "6.5"}
                </span>
                <span className="text-lg text-black/50">/10</span>
              </div>
            </div>

            {/* Semi Gauge */}
            <div className="px-5 pb-5 pt-2">
              <SemiGauge
                value={avg ?? 6.5}
                label="Average public sentiment gauge"
                size={160}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="nsi-band px-8 py-6 text-white">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <NSIBadgeLogo className="h-16 w-14" />
            <div>
              <div className="font-serif text-lg font-semibold">
                Nigeria Stability Index (NSI)
              </div>
              <div className="text-sm opacity-80">
                Tracking security, economy, governance.
              </div>
            </div>
          </div>

          <div className="text-center text-sm opacity-80">
            www.NigeriaStabilityIndex.org
          </div>

          <div className="flex items-center gap-4">
            <Link
              className="opacity-80 transition-opacity hover:opacity-100"
              href="#"
              aria-label="Facebook"
            >
              <SocialFacebookIcon className="h-5 w-5" />
            </Link>
            <Link
              className="opacity-80 transition-opacity hover:opacity-100"
              href="#"
              aria-label="Twitter/X"
            >
              <SocialXIcon className="h-5 w-5" />
            </Link>
            <Link
              className="opacity-80 transition-opacity hover:opacity-100"
              href="#"
              aria-label="YouTube"
            >
              <SocialYouTubeIcon className="h-5 w-5" />
            </Link>
            <Link
              className="opacity-80 transition-opacity hover:opacity-100"
              href="#"
              aria-label="LinkedIn"
            >
              <SocialLinkedInIcon className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
