import type { Metadata } from "next";
import { db } from "@/lib/db";
import { NSIShieldMark } from "@/components/public/icons";
import Link from "next/link";
import { defaultMetadata } from "@/lib/metadata";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  ...defaultMetadata,
  title: "Reports Archive",
  description:
    "Browse monthly stability reports from the Nigeria Stability Index. View detailed snapshots of Nigeria's stability across security, economy, governance, investor confidence, and social stability.",
  openGraph: {
    ...defaultMetadata.openGraph,
    title: "Reports Archive | Nigeria Stability Index",
    description:
      "Browse monthly stability reports from the Nigeria Stability Index. View detailed snapshots of Nigeria's stability.",
    url: `${defaultMetadata.metadataBase}reports`,
  },
  alternates: {
    canonical: "/reports",
  },
};

function ScoreDisplay({ score }: { score: number }) {
  return (
    <div className="flex shrink-0 flex-col items-center gap-0.5">
      <div className="flex items-baseline gap-0.5">
        <span className="text-2xl font-bold text-[color:var(--nsi-green)]">
          {score.toFixed(1)}
        </span>
        <span className="text-sm font-medium text-black/30">/10</span>
      </div>
      <span className="text-[0.6rem] font-semibold uppercase tracking-widest text-black/35">
        Score
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
    <main className="w-full pb-24">
      {/* Page header */}
      <section className="relative overflow-hidden pt-20">
        <div className="mx-auto w-full max-w-4xl px-6">
          <div className="nsi-section-card px-8 py-10">
            <div className="flex items-start gap-4">
              <NSIShieldMark className="mt-1 h-9 w-9 shrink-0" />
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-[color:var(--nsi-green)]">
                  NSI Publication
                </p>
                <h1 className="mt-1 font-serif text-4xl font-semibold tracking-tight text-[color:var(--nsi-ink)] lg:text-5xl">
                  Reports Archive
                </h1>
                <p className="mt-3 max-w-xl text-sm leading-7 text-[color:var(--nsi-ink-soft)]">
                  Monthly snapshots tracking Nigeria&apos;s stability across security,
                  economy, governance, investor confidence, and social cohesion.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {reports.length ? (
        <div className="mx-auto mt-14 w-full max-w-4xl space-y-5 px-6">
          {/* Featured latest report */}
          {featured && (
            <Link href={`/reports/${featured.id}`} className="group block">
              <article className="relative overflow-hidden rounded-3xl border border-black/10 bg-white shadow-md transition-all hover:-translate-y-0.5 hover:shadow-xl">
                {/* Top accent line */}
                <div className="h-1 bg-[color:var(--nsi-green)]" />
                <div className="p-8 sm:p-10">
                  <div className="flex flex-wrap items-start justify-between gap-6">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2.5">
                        <span className="rounded-full bg-[color:var(--nsi-green)]/10 px-3 py-1 text-xs font-bold text-[color:var(--nsi-green)]">
                          Latest Issue
                        </span>
                        <span className="text-sm font-medium text-[color:var(--nsi-ink-soft)]">
                          {featured.period}
                        </span>
                      </div>
                      <h2 className="mt-4 font-serif text-2xl font-bold tracking-tight text-[color:var(--nsi-ink)] sm:text-3xl">
                        Nigeria Stability Index Report
                      </h2>
                      {featured.overallNarrative && (
                        <p className="mt-3 line-clamp-3 text-base leading-7 text-[color:var(--nsi-ink-soft)]">
                          {featured.overallNarrative}
                        </p>
                      )}
                      <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[color:var(--nsi-green)] transition-all group-hover:gap-3">
                        Read full report <span aria-hidden>→</span>
                      </span>
                    </div>
                    <div className="shrink-0 rounded-2xl border border-black/8 bg-[color:var(--nsi-paper)] px-6 py-5 text-center">
                      <ScoreDisplay score={featured.overallScore} />
                    </div>
                  </div>
                </div>
              </article>
            </Link>
          )}

          {/* Divider */}
          {rest.length > 0 && (
            <div className="flex items-center gap-4 pt-2">
              <div className="h-px flex-1 bg-black/8" />
              <span className="text-[0.65rem] font-bold uppercase tracking-widest text-[color:var(--nsi-ink-soft)]">
                Previous Issues
              </span>
              <div className="h-px flex-1 bg-black/8" />
            </div>
          )}

          {/* Previous reports — blog list style */}
          <div className="space-y-3">
            {rest.map((r) => (
              <Link key={r.id} href={`/reports/${r.id}`} className="group block">
                <article className="flex items-center gap-5 rounded-2xl border border-black/8 bg-white px-6 py-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-black/15 hover:shadow-md">
                  {/* Left accent bar */}
                  <div className="hidden h-10 w-1 shrink-0 rounded-full bg-[color:var(--nsi-green)]/20 transition-colors group-hover:bg-[color:var(--nsi-green)] sm:block" />

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className="text-sm font-semibold text-[color:var(--nsi-ink)]">
                        {r.period}
                      </span>
                      <span className="text-xs text-[color:var(--nsi-ink-soft)]">
                        Nigeria Stability Snapshot
                      </span>
                    </div>
                    {r.overallNarrative && (
                      <p className="mt-1 line-clamp-2 text-sm leading-6 text-[color:var(--nsi-ink-soft)]">
                        {r.overallNarrative}
                      </p>
                    )}
                  </div>

                  <div className="flex shrink-0 flex-col items-end gap-1">
                    <ScoreDisplay score={r.overallScore} />
                    <span className="text-xs font-medium text-[color:var(--nsi-ink-soft)] transition-colors group-hover:text-[color:var(--nsi-green)]">
                      Read →
                    </span>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </div>
      ) : (
        <div className="mx-auto mt-20 w-full max-w-4xl px-6">
          <div className="nsi-card-soft p-8">
            <p className="text-[color:var(--nsi-ink-soft)]">No published reports yet.</p>
            <Link
              href="/"
              className="mt-4 inline-block text-sm font-medium text-[color:var(--nsi-green)] hover:underline"
            >
              Back to Home
            </Link>
          </div>
        </div>
      )}
    </main>
  );
}
