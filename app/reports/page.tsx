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

  return (
    <main className="w-full pb-20">
      <section className="relative overflow-hidden pt-16">
        <div className="mx-auto w-full max-w-7xl px-6">
          <div className="nsi-section-card px-8 py-10">
            <div className="relative z-10">
              <div className="flex items-center gap-3">
                <NSIShieldMark className="h-10 w-10" />
                <h1 className="font-serif text-4xl font-semibold tracking-tight text-[color:var(--nsi-ink)] lg:text-5xl">
                  Reports Archive
                </h1>
              </div>
              <p className="mt-4 max-w-2xl text-base leading-7 text-[color:var(--nsi-ink-soft)]">
                Published monthly snapshots of Nigeria&apos;s stability — overall
                score, pillar summaries, and highlighted state and institution
                spotlights.
              </p>
            </div>
          </div>
        </div>
      </section>

      {reports.length ? (
        <div className="mx-auto mt-12 grid w-full max-w-7xl gap-6 px-6 md:grid-cols-2">
          {reports.map((r) => (
            <article
              key={r.id}
              className="overflow-hidden rounded-[28px] border border-black/10 bg-white shadow-lg transition-all hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="bg-[color:var(--nsi-green)] px-7 py-3 text-sm font-semibold text-white">
                {r.period}
              </div>
              <div className="flex flex-col gap-6 px-7 py-7">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <h2 className="font-serif text-xl font-semibold tracking-tight text-[color:var(--nsi-ink)] md:text-2xl">
                      Nigeria Stability Snapshot
                    </h2>
                    <p className="mt-3 line-clamp-2 text-sm leading-6 text-[color:var(--nsi-ink-soft)]">
                      {r.overallNarrative}
                    </p>
                  </div>
                  <div className="shrink-0 rounded-2xl border border-black/10 bg-[color:var(--nsi-paper)] px-5 py-4 text-center">
                    <div className="text-xs font-medium text-[color:var(--nsi-ink-soft)]">
                      Score
                    </div>
                    <div className="mt-1 text-3xl font-semibold text-[color:var(--nsi-green)]">
                      {r.overallScore.toFixed(1)}
                    </div>
                  </div>
                </div>
                <Link
                  href={`/reports/${r.id}`}
                  className="inline-flex w-full items-center justify-center rounded-xl bg-[color:var(--nsi-green)] px-5 py-3 text-sm font-semibold text-white transition-all hover:brightness-110"
                >
                  View Snapshot
                </Link>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="mx-auto mt-12 w-full max-w-7xl px-6">
          <div className="nsi-card-soft p-8">
            <p className="text-[color:var(--nsi-ink-soft)]">
              No published reports yet.
            </p>
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
