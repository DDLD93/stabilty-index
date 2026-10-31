import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ArchiveTrend } from "@/components/data/ArchiveTrend";
import { ChangeText } from "@/components/data/ChangeText";
import { LinkButton } from "@/components/ui/Button";
import { Container } from "@/components/ui/Layout";
import { EmptyState, PageHeader } from "@/components/ui/PageHeader";
import { defaultMetadata } from "@/lib/metadata";
import { change, formatDate, listPublishedReports, monthOf } from "@/lib/snapshots";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  ...defaultMetadata,
  title: "Monthly reports",
  description:
    "Every published edition of the Nigeria Stability Index, with its overall score, pillar scores and spotlights.",
  alternates: { canonical: "/reports" },
};

const SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const short = (period: string) => SHORT.find((m) => period.toLowerCase().startsWith(m.toLowerCase())) ?? period.slice(0, 3);

export default async function ReportsPage() {
  const reports = await listPublishedReports();
  const newestFirst = [...reports].reverse();

  return (
    <>
      <PageHeader
        crumbs={[{ href: "/", label: "Home" }, { label: "Reports" }]}
        title="Monthly reports"
        lede="Every edition of the index since it began. A new report is published on the 11th of each month and locked once it is out, so the numbers you cite will not change."
      />

      <Container className="py-10 sm:py-14">
        {reports.length === 0 ? (
          <EmptyState
            title="No reports published yet"
            action={<LinkButton href="/methodology" variant="secondary">How the index is made</LinkButton>}
          >
            The first report will appear here on the 11th after the first monthly survey closes.
          </EmptyState>
        ) : (
          <div className="grid grid-cols-[minmax(0,1fr)] gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:items-start lg:gap-16">
            <div className="lg:sticky lg:top-28">
              <ArchiveTrend
                points={reports.map((r) => ({ id: r.id, period: r.period, shortLabel: short(r.period), value: r.overallScore }))}
              />
            </div>

            <section aria-labelledby="editions-title">
              <h2 id="editions-title" className="sr-only">
                All editions, newest first
              </h2>
              <ol className="border-t border-ink">
                {newestFirst.map((r, i) => {
                  const prev = newestFirst[i + 1];
                  return (
                    <li key={r.id} className="border-b border-line">
                      <Link
                        href={`/reports/${r.id}`}
                        className="group grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-6 gap-y-1 py-5"
                      >
                        <span>
                          <span className="block font-serif text-h3 font-semibold group-hover:underline group-hover:underline-offset-[0.18em]">
                            {r.period}
                          </span>
                          <span className="mt-1 block text-small text-ink-3">
                            Edition {r.edition} · Published {formatDate(r.publishedAt)}
                            {i === 0 ? " · Latest" : null}
                          </span>
                        </span>
                        <span className="row-span-2 flex items-center gap-4 text-right">
                          <span>
                            <span className="block text-h3 font-semibold tabular-nums">{r.overallScore.toFixed(1)}</span>
                            <span className="block text-meta text-ink-3">out of 10</span>
                          </span>
                          <ArrowRight aria-hidden className="size-5 text-brand transition-transform duration-150 group-hover:translate-x-0.5" />
                        </span>
                        <span className="text-small">
                          {prev ? (
                            <ChangeText change={change(r.overallScore, prev.overallScore)} since={monthOf(prev.period)} />
                          ) : (
                            <span className="text-ink-3">First edition</span>
                          )}
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ol>
            </section>
          </div>
        )}
      </Container>
    </>
  );
}
