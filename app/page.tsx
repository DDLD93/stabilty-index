import Image from "next/image";
import type { Metadata } from "next";
import { getPublicSystemState } from "@/lib/systemState";
import Link from "next/link";
import { defaultMetadata } from "@/lib/metadata";
import {
  PillarEconomyIcon,
  PillarGovernanceIcon,
  PillarInvestorIcon,
  PillarSecurityIcon,
  PillarSocialIcon,
} from "@/components/public/icons";
import { RulerGauge } from "@/components/public/RulerGauge";

export const dynamic = "force-dynamic";

type Pillar = { title: string; score: number; summary?: string };

function safeArray<T>(v: unknown): T[] {
  return Array.isArray(v) ? (v as T[]) : [];
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

  const snapshotHref = latest ? `/reports/${latest.id}` : "/reports";
  const displayScore = latest ? latest.overallScore : 6.6;
  const period = latest?.period ?? "January 2026";
  const narrative = latest?.overallNarrative ?? "Cautiously Stable";

  const IconFor = (title: string) => {
    const t = title.toLowerCase();
    if (t.includes("security")) return PillarSecurityIcon;
    if (t.includes("econom")) return PillarEconomyIcon;
    if (t.includes("invest")) return PillarInvestorIcon;
    if (t.includes("govern")) return PillarGovernanceIcon;
    return PillarSocialIcon;
  };

  const ImageFor = (title: string) => {
    const t = title.toLowerCase();
    if (t.includes("security")) return "/pillars/security.png"; 
    if (t.includes("econom")) return "/pillars/economy.png"; 
    if (t.includes("invest")) return "/pillars/investor.png"; 
    if (t.includes("govern")) return "/pillars/governance.png"; 
    return "/pillars/social.png"; 
  };

  const moods = ["Calm", "Hopeful", "Tired", "Tense", "Optimistic", "Uncertain"];

  return (
    <main className="w-full pb-20">
      {/* Hero Section - Immersive Full Width */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-20">
        <div className="absolute inset-0 -z-10">
          <Image
            src="/abuja-skyline.png"
            alt="Abuja Skyline"
            fill
            className="object-cover opacity-20 grayscale brightness-110"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-[color:var(--nsi-paper)]/40 backdrop-blur-[1px]" />
        </div>
        
        <div className="mx-auto w-full max-w-7xl px-6">
          <div className="grid items-center gap-12 md:grid-cols-2 lg:gap-20">
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 rounded-full bg-black/5 px-4 py-1.5 text-sm font-medium text-[color:var(--nsi-ink)] backdrop-blur-md border border-black/10 mb-6">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[color:var(--nsi-gold)] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[color:var(--nsi-gold)]"></span>
                </span>
                Live Updates: {period}
              </div>
              <h1 className="font-serif text-5xl font-bold leading-[1.1] tracking-tight text-[color:var(--nsi-ink)] lg:text-7xl drop-shadow-sm">
                Tracking How Nigeria
                <br />
                <span className="text-[color:var(--nsi-green)]">Is Holding Together</span>
              </h1>
              <p className="mt-8 max-w-lg text-lg leading-relaxed text-[color:var(--nsi-ink-soft)] backdrop-blur-[1px]">
                Beyond the noise: a calm, data-driven pulse on security, economy, governance, and the nation&apos;s stability.
              </p>
              <div className="mt-12 flex flex-wrap gap-4">
                <Link
                  href={snapshotHref}
                  className="inline-flex items-center rounded-xl bg-[color:var(--nsi-gold)] px-8 py-4 text-lg font-bold text-[color:var(--nsi-ink)] shadow-2xl transition-all hover:scale-105 hover:brightness-110"
                >
                  View Full Report
                </Link>
                <Link
                  href="/about"
                  className="inline-flex items-center rounded-xl bg-black/5 px-8 py-4 text-lg font-bold text-[color:var(--nsi-ink)] backdrop-blur-md border border-black/10 transition-all hover:bg-black/10"
                >
                  Our Methodology
                </Link>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center text-center relative py-12">
              <div className="nsi-score-display relative p-12 rounded-[3rem] border-black/10 bg-white/40 backdrop-blur-xl shadow-2xl">
                <div className="flex items-baseline gap-2 relative z-10">
                  <span className="text-[8rem] font-bold tracking-tighter text-[color:var(--nsi-green)] lg:text-[11rem] drop-shadow-sm">
                    {displayScore.toFixed(1)}
                  </span>
                  <span className="text-5xl font-semibold text-black/20 lg:text-6xl">/10</span>
                </div>
                <div className="mt-4 relative z-10">
                  <div className="text-xl font-bold text-[color:var(--nsi-ink)] tracking-widest uppercase">
                    Stability Index
                  </div>
                  <div className="mt-3 font-serif text-2xl italic text-[color:var(--nsi-ink-soft)]">
                    &ldquo;{narrative}&rdquo;
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content Container */}
      <div className="mx-auto max-w-7xl px-6">
        {/* Pillar Grid */}
        <section className="mt-12 grid gap-6 sm:grid-cols-2 md:grid-cols-5">
          {pillarList.map((p) => {
            const pillarImage = ImageFor(p.title);
            return (
              <div
                key={p.title}
                className="group flex flex-col overflow-hidden rounded-2xl border border-black/10 bg-white shadow-lg transition-all hover:-translate-y-2 hover:shadow-xl"
              >
                <div className="relative h-40 w-full flex items-center justify-center overflow-hidden p-4">
                  <Image
                    src={pillarImage}
                    alt={p.title}
                    fill
                    className="object-contain p-4 transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
                <div className="p-5 border-t border-black/5 bg-[color:var(--nsi-paper-2)]">
                  <div className="flex items-center justify-between gap-1">
                    <h3 className="text-xs font-black uppercase tracking-widest text-[color:var(--nsi-ink)]">
                      {p.title}
                    </h3>
                    <span className="text-lg font-bold text-[color:var(--nsi-green)]">
                      {p.score.toFixed(1)}
                    </span>
                  </div>
                  <p className="mt-3 text-[0.8rem] italic leading-relaxed text-[color:var(--nsi-ink-soft)]">
                    {p.summary || "Summary of the pillar status this month."}
                  </p>
                </div>
              </div>
            );
          })}
        </section>

        {/* Mood Section */}
        <section className="mt-32 text-center py-16 rounded-[3rem] bg-white/60 backdrop-blur-sm border border-black/5 shadow-sm">
          <h2 className="font-serif text-3xl font-bold text-[color:var(--nsi-ink)]">
            How stable does Nigeria feel to you right now?
          </h2>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            {moods.map((mood) => (
              <button
                key={mood}
                className="px-8 py-3 rounded-xl bg-white border border-black/10 text-[color:var(--nsi-ink-soft)] font-medium transition-all hover:bg-[color:var(--nsi-gold)] hover:text-[color:var(--nsi-ink)] hover:scale-105"
              >
                {mood}
              </button>
            ))}
          </div>
          <p className="mt-8 text-lg italic text-[color:var(--nsi-ink-soft)]">
            Top mood this week: <span className="font-semibold text-[color:var(--nsi-gold-deep)]">&ldquo;Cautiously hopeful&rdquo;</span>
          </p>
        </section>

        {/* Report Section */}
        <section className="mt-32 overflow-hidden rounded-[3rem] border border-black/10 bg-white shadow-2xl">
          <div className="nsi-band py-6 text-center text-white">
            <h2 className="font-serif text-2xl font-bold">{period} Snapshot</h2>
          </div>
          <div className="grid gap-12 p-8 md:grid-cols-2 md:p-16">
            <div className="flex flex-col justify-center">
              <div className="relative mb-8 flex items-end gap-3">
                <span className="text-8xl font-bold text-[color:var(--nsi-green)]">{displayScore.toFixed(1)}</span>
                <span className="mb-3 text-2xl font-medium text-black/20">/10</span>
              </div>
              <div className="mb-10">
                <RulerGauge value={displayScore} />
              </div>
              <p className="text-lg leading-relaxed text-[color:var(--nsi-ink-soft)]">
                The Nigeria Stability Index (NSI) is a civic project tracking the country&apos;s stability
                through data, public sentiment, and calm analysis.
                <br /><br />
                <span className="inline-block font-medium italic text-[color:var(--nsi-gold-deep)]">A project of the 24 Angels Initiative.</span>
              </p>
            </div>

            <div>
              <div className="overflow-hidden rounded-2xl border border-black/5 bg-[color:var(--nsi-paper-2)]">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-black/5 text-[color:var(--nsi-ink)]">
                      <th className="px-8 py-5 font-bold uppercase tracking-widest text-xs">{period} Pillars</th>
                      <th className="px-8 py-5 text-right font-bold uppercase tracking-widest text-xs">Score</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-black/5 text-[color:var(--nsi-ink)]">
                    {pillarList.map((p) => (
                      <tr key={p.title} className="hover:bg-white/50 transition-colors">
                        <td className="px-8 py-5 font-medium">{p.title}</td>
                        <td className="px-8 py-5 text-right font-bold text-[color:var(--nsi-green)]">{p.score.toFixed(1)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-10">
                <Link
                  href={snapshotHref}
                  className="inline-flex w-full items-center justify-center rounded-xl bg-[color:var(--nsi-green)] px-8 py-5 text-lg font-bold text-white shadow-xl transition-all hover:brightness-110 hover:scale-[1.02]"
                >
                  Download Executive Summary (PDF)
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Newsletter */}
        <section className="mt-32 rounded-[3rem] p-12 md:p-20 relative overflow-hidden border border-black/10">
          <div className="absolute inset-0 -z-10">
            <Image
              src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=2070&auto=format&fit=crop"
              alt="Community"
              fill
              className="object-cover opacity-20 grayscale"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-white to-[color:var(--nsi-paper)]/90" />
          </div>
          <div className="grid gap-12 md:grid-cols-2 md:items-center relative z-10">
            <div>
              <h2 className="text-4xl font-bold leading-tight text-[color:var(--nsi-ink)]">
                Be part of Nigeria&apos;s <br />
                <span className="text-[color:var(--nsi-green)]">stability check-in.</span>
              </h2>
              <p className="mt-6 text-xl text-[color:var(--nsi-ink-soft)]">
                Get monthly updates and deep-dive reports directly to your inbox.
              </p>
            </div>
            <div className="flex flex-col gap-4 sm:flex-row">
              <input
                type="email"
                placeholder="Enter your email"
                className="h-16 flex-1 rounded-xl border border-black/10 bg-white/50 px-8 text-[color:var(--nsi-ink)] placeholder:text-black/30 outline-none focus:border-[color:var(--nsi-green)] focus:bg-white transition-all"
              />
              <button className="h-16 rounded-xl bg-[color:var(--nsi-gold)] px-10 text-lg font-bold text-[color:var(--nsi-ink)] shadow-2xl transition-all hover:scale-105 hover:brightness-110">
                Join Us
              </button>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
