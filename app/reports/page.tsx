import type { Metadata } from "next";
import { db } from "@/lib/db";
import { NSIShieldMark } from "@/components/public/icons";
import Link from "next/link";
import { defaultMetadata } from "@/lib/metadata";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  ...defaultMetadata,
  title: "Intelligence Dossiers & Reports | Sovereign Observatory Archive",
  description:
    "Browse monthly stability reports from the Nigeria Stability Index. View detailed empirical snapshots across security, economy, governance, investor confidence, and social cohesion.",
  openGraph: {
    ...defaultMetadata.openGraph,
    title: "Intelligence Dossiers & Reports | Nigeria Stability Index",
    description:
      "Explore comprehensive monthly stability intelligence across 36 states and FCT.",
    url: `${defaultMetadata.metadataBase ?? ""}reports`,
  },
  alternates: {
    canonical: "/reports",
  },
};

function ScoreDisplay({ score }: { score: number }) {
  return (
    <div className="flex shrink-0 flex-col items-center gap-0.5 rounded-xl border border-[#00f59b]/25 bg-black/60 px-4 py-3 shadow-[0_0_15px_rgba(0,245,155,0.15)]">
      <div className="flex items-baseline gap-1 font-mono">
        <span className="text-3xl font-black text-[#00f59b] drop-shadow-[0_0_10px_rgba(0,245,155,0.4)]">
          {score.toFixed(1)}
        </span>
        <span className="text-xs text-slate-500">/ 10</span>
      </div>
      <span className="font-mono text-[9px] font-bold uppercase tracking-wider text-slate-400">
        COMPOSITE
      </span>
    </div>
  );
}

export default async function ReportsPage() {
  const reports = await db.snapshot.findMany({
    where: { publishedAt: { not: null } },
    orderBy: { publishedAt: "desc" },
    select: {
      id: true,
      period: true,
      overallScore: true,
      overallNarrative: true,
      publishedAt: true,
    },
  });

  const [featured, ...rest] = reports;

  return (
    <main className="relative min-h-[90vh] w-full pb-24 pt-16 text-slate-100 overflow-hidden">
      {/* Background Ambience */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute top-10 left-1/4 h-96 w-96 rounded-full bg-[#00f59b]/10 blur-[140px]" />
        <div className="absolute top-1/2 right-1/4 h-80 w-80 rounded-full bg-[#f59e0b]/8 blur-[120px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#00f59b08_1px,transparent_1px),linear-gradient(to_bottom,#00f59b08_1px,transparent_1px)] bg-[size:3.5rem_3.5rem]" />
      </div>

      {/* Header section */}
      <section className="relative">
        <div className="mx-auto w-full max-w-5xl px-6">
          <div className="observatory-card p-8 sm:p-12">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-[#00f59b]/15 pb-8">
              <div className="flex items-center gap-4">
                <div className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-[#00f59b]/40 bg-[#07190f] p-2 shadow-[0_0_20px_rgba(0,245,155,0.25)]">
                  <NSIShieldMark className="h-10 w-10 text-[#00f59b]" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#00f59b]">
                      OFFICIAL INTELLIGENCE ARCHIVE
                    </span>
                    <span className="rounded bg-[#00f59b]/15 px-2 py-0.5 font-mono text-[10px] text-[#00f59b] border border-[#00f59b]/30">
                      PUBLIC DOSSIERS
                    </span>
                  </div>
                  <h1 className="mt-1 font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white">
                    Sovereign Stability Reports
                  </h1>
                </div>
              </div>

              <Link
                href="/survey"
                className="inline-flex items-center gap-2 rounded-xl border border-[#00f59b] bg-[#00f59b] px-5 py-3 font-mono text-xs font-bold text-black shadow-[0_0_15px_rgba(0,245,155,0.3)] transition-all hover:bg-[#22ffb0] shrink-0"
              >
                <span>TAKE LIVE SURVEY</span>
                <span>→</span>
              </Link>
            </div>

            <p className="mt-6 max-w-2xl text-sm sm:text-base leading-relaxed text-slate-300">
              Monthly sovereign syntheses tracking Nigeria&apos;s macro-resilience across territorial defense, 
              exchange rate liquidity, policy governance, investor sentiment, and civic street sentiment.
            </p>
          </div>
        </div>
      </section>

      {reports.length > 0 ? (
        <div className="mx-auto mt-12 w-full max-w-5xl space-y-8 px-6">
          {/* Featured latest report */}
          {featured && (
            <Link href={`/reports/${featured.id}`} className="group block">
              <article className="observatory-card relative overflow-hidden p-8 sm:p-10 transition-all duration-300 hover:border-[#00f59b]/60 hover:shadow-[0_0_35px_rgba(0,245,155,0.2)]">
                {/* Glowing top line */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#00f59b] via-[#38bdf8] to-[#f59e0b]" />

                <div className="flex flex-wrap items-start justify-between gap-6">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="rounded-full border border-[#00f59b]/40 bg-[#00f59b]/15 px-3 py-1 font-mono text-xs font-bold text-[#00f59b]">
                        LATEST PUBLISHED ISSUE
                      </span>
                      <span className="font-mono text-sm font-semibold text-[#fbbf24]">
                        {featured.period}
                      </span>
                    </div>

                    <h2 className="mt-4 font-serif text-2xl sm:text-3xl font-bold tracking-tight text-white group-hover:text-[#00f59b] transition-colors">
                      Nigeria Stability Index Report — {featured.period}
                    </h2>

                    {featured.overallNarrative && (
                      <p className="mt-3 line-clamp-3 text-sm sm:text-base leading-relaxed text-slate-300">
                        &ldquo;{featured.overallNarrative}&rdquo;
                      </p>
                    )}

                    <div className="mt-6 inline-flex items-center gap-2 font-mono text-xs font-bold text-[#00f59b] group-hover:translate-x-1 transition-transform">
                      <span>OPEN COMPLETE INTELLIGENCE DOSSIER</span>
                      <span>→</span>
                    </div>
                  </div>

                  <ScoreDisplay score={featured.overallScore} />
                </div>
              </article>
            </Link>
          )}

          {/* Divider */}
          {rest.length > 0 && (
            <div className="flex items-center gap-4 pt-4">
              <div className="h-px flex-1 bg-[#00f59b]/15" />
              <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#00f59b]">
                HISTORICAL ISSUES ARCHIVE
              </span>
              <div className="h-px flex-1 bg-[#00f59b]/15" />
            </div>
          )}

          {/* Previous reports */}
          <div className="space-y-4">
            {rest.map((r) => (
              <Link key={r.id} href={`/reports/${r.id}`} className="group block">
                <article className="observatory-card flex items-center justify-between gap-5 p-6 transition-all duration-300 hover:border-[#00f59b]/40 hover:bg-[#081b10]">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="font-mono text-sm font-bold text-white group-hover:text-[#00f59b] transition-colors">
                        {r.period}
                      </span>
                      <span className="font-mono text-xs text-slate-500">
                        Monthly Snapshot
                      </span>
                    </div>
                    {r.overallNarrative && (
                      <p className="mt-1.5 line-clamp-2 text-xs sm:text-sm text-slate-400">
                        {r.overallNarrative}
                      </p>
                    )}
                  </div>

                  <div className="flex shrink-0 items-center gap-4">
                    <ScoreDisplay score={r.overallScore} />
                    <span className="font-mono text-xs font-bold text-[#00f59b] group-hover:translate-x-1 transition-transform hidden sm:inline">
                      →
                    </span>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </div>
      ) : (
        <div className="mx-auto mt-16 w-full max-w-5xl px-6">
          <div className="observatory-card p-10 text-center">
            <h3 className="font-serif text-xl font-bold text-white">First Issue Finalizing</h3>
            <p className="mt-2 text-sm text-slate-400">
              The inaugural snapshot is currently undergoing methodological synthesis.
            </p>
            <Link
              href="/"
              className="mt-6 inline-flex rounded-xl border border-[#00f59b] bg-[#00f59b] px-6 py-2.5 font-mono text-xs font-bold text-black"
            >
              RETURN TO OBSERVATORY
            </Link>
          </div>
        </div>
      )}
    </main>
  );
}
