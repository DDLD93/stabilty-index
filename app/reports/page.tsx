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

function ScoreBadge({ score }: { score: number }) {
  return (
    <div className="flex shrink-0 flex-col items-center justify-center rounded-[3px] border border-[color:var(--nsi-rule-strong)] bg-[color:var(--nsi-paper)] px-5 py-3.5 text-center">
      <div className="flex items-baseline gap-0.5">
        <span className="font-serif text-3xl font-bold tabular-nums text-[color:var(--nsi-green)]">
          {score.toFixed(1)}
        </span>
        <span className="font-mono text-xs text-[color:var(--nsi-ink-muted)]">
          /10
        </span>
      </div>
      <span className="mt-1 font-mono text-[0.6rem] font-bold uppercase tracking-widest text-[color:var(--nsi-ink-muted)]">
        Composite
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
      {/* Institutional Page Masthead */}
      <section className="border-b border-[color:var(--nsi-rule-strong)] bg-[color:var(--nsi-green-deep)] py-14 text-white">
        <div className="mx-auto w-full max-w-5xl px-6">
          <div className="flex items-start gap-4">
            <NSIShieldMark className="mt-1 h-10 w-10 shrink-0" />
            <div>
              <p className="nsi-kicker-light">NSI Publications &amp; Briefings</p>
              <h1 className="mt-2 font-serif text-4xl font-bold tracking-tight text-white lg:text-5xl">
                Reports Archive
              </h1>
              <p className="mt-3 max-w-2xl text-base leading-relaxed text-white/75">
                Immutable monthly snapshots tracking Nigeria&apos;s stability across
                Security, FX &amp; Economy, Investor Confidence, Governance, and
                Social Cohesion. Published on the 11th of each month.
              </p>
            </div>
          </div>
        </div>
      </section>

      {reports.length ? (
        <div className="mx-auto mt-12 w-full max-w-5xl space-y-8 px-6">
          {/* Featured Latest Report (Chatham House Flagship Card) */}
          {featured && (
            <Link href={`/reports/${featured.id}`} className="group block">
              <article className="relative overflow-hidden rounded-[4px] border border-[color:var(--nsi-rule-strong)] border-t-4 border-t-[color:var(--nsi-green)] bg-white p-8 shadow-sm transition-all hover:border-[color:var(--nsi-green)] hover:shadow-md sm:p-10">
                <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-start">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="rounded-[2px] bg-[color:var(--nsi-green)] px-2.5 py-1 font-mono text-[0.65rem] font-bold uppercase tracking-widest text-white">
                        Latest Flagship Issue
                      </span>
                      <span className="font-mono text-xs font-semibold uppercase tracking-wider text-[color:var(--nsi-gold-deep)]">
                        {featured.period}
                      </span>
                    </div>

                    <h2 className="mt-4 font-serif text-3xl font-bold tracking-tight text-[color:var(--nsi-ink)] group-hover:text-[color:var(--nsi-green)] sm:text-4xl">
                      Nigeria Stability Index — {featured.period} Report
                    </h2>

                    {featured.overallNarrative && (
                      <p className="mt-4 border-l-2 border-[color:var(--nsi-gold)] pl-4 text-base leading-relaxed text-[color:var(--nsi-ink-soft)]">
                        {featured.overallNarrative}
                      </p>
                    )}

                    <div className="mt-6 inline-flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider text-[color:var(--nsi-green)] group-hover:underline">
                      <span>Read Full Executive Report</span>
                      <span aria-hidden>→</span>
                    </div>
                  </div>

                  <ScoreBadge score={featured.overallScore} />
                </div>
              </article>
            </Link>
          )}

          {/* Previous Issues Ledger */}
          {rest.length > 0 && (
            <div className="pt-4">
              <div className="nsi-section-rule mb-6 flex items-center justify-between">
                <span className="nsi-kicker">Archival Ledger · Previous Issues</span>
                <span className="font-mono text-xs text-[color:var(--nsi-ink-muted)]">
                  {rest.length} {rest.length === 1 ? "Issue" : "Issues"}
                </span>
              </div>

              <div className="divide-y divide-[color:var(--nsi-rule)] overflow-hidden rounded-[4px] border border-[color:var(--nsi-rule-strong)] bg-white">
                {rest.map((r) => (
                  <Link
                    key={r.id}
                    href={`/reports/${r.id}`}
                    className="group block transition-colors hover:bg-[color:var(--nsi-paper)]/60"
                  >
                    <article className="flex flex-col justify-between gap-4 p-6 sm:flex-row sm:items-center sm:px-8">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-3">
                          <span className="font-mono text-xs font-bold uppercase tracking-wider text-[color:var(--nsi-green)]">
                            {r.period}
                          </span>
                          <span className="text-black/20">·</span>
                          <span className="font-mono text-[0.7rem] uppercase tracking-wider text-[color:var(--nsi-ink-muted)]">
                            Nigeria Stability Snapshot
                          </span>
                        </div>
                        {r.overallNarrative && (
                          <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-[color:var(--nsi-ink-soft)]">
                            {r.overallNarrative}
                          </p>
                        )}
                      </div>

                      <div className="flex shrink-0 items-center gap-5">
                        <ScoreBadge score={r.overallScore} />
                        <span className="font-mono text-xs font-bold uppercase tracking-wider text-[color:var(--nsi-green)] group-hover:underline">
                          Read →
                        </span>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="mx-auto mt-14 w-full max-w-5xl px-6">
          <div className="nsi-section-card p-10">
            <p className="font-mono text-xs font-bold uppercase tracking-widest text-[color:var(--nsi-ink-muted)]">
              Archive Status
            </p>
            <p className="mt-2 font-serif text-2xl font-bold text-[color:var(--nsi-ink)]">
              No published reports yet.
            </p>
            <p className="mt-2 text-sm text-[color:var(--nsi-ink-soft)]">
              Monthly stability reports are published on the 11th of each month
              following collection and editorial verification.
            </p>
            <Link
              href="/"
              className="btn-nsi-primary mt-6"
            >
              ← Back to Index Home
            </Link>
          </div>
        </div>
      )}
    </main>
  );
}
