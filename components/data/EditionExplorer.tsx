"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { ChangeText } from "@/components/data/ChangeText";
import { PillarTable } from "@/components/data/PillarTable";
import { TrendChart } from "@/components/data/TrendChart";
import { change, editionDateline, monthOf, type PillarScore } from "@/lib/reportFormat";

export type ExplorerEdition = {
  id: string;
  period: string;
  surveyWindow: string | null;
  pillarMax: 5 | 10;
  overallScore: number;
  publishedAt: string;
  edition: number;
  pillars: PillarScore[];
};

const SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function shortLabel(period: string) {
  const [month] = period.split(" ");
  const i = SHORT.findIndex((m) => month?.toLowerCase().startsWith(m.toLowerCase()));
  return i >= 0 ? SHORT[i] : period.slice(0, 3);
}

/**
 * Home page reading: the selected edition's score, the trend across all
 * editions, and that edition's five pillars. Choosing a month on the chart
 * switches the score and the pillars to that edition.
 */
export function EditionExplorer({
  editions,
  intro,
  actions,
}: {
  editions: ExplorerEdition[];
  intro: React.ReactNode;
  actions?: React.ReactNode;
}) {
  const [selectedId, setSelectedId] = useState(editions.at(-1)?.id ?? "");
  const index = Math.max(0, editions.findIndex((e) => e.id === selectedId));
  const current = editions[index];
  const previous = index > 0 ? editions[index - 1] : null;
  const isLatest = index === editions.length - 1;
  // Pillar changes are only shown between editions on the same scale (1–5 until September 2026, then 1–10).
  const samePillarScale = !!previous && previous.pillarMax === current?.pillarMax;
  const first = editions[0];

  if (!current) return null;

  return (
    <>
      <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:items-stretch lg:gap-16">
        <div>
          {intro}

          <div className="mt-8 border-t border-line pt-6 lg:mt-6 lg:pt-5" aria-live="polite">
            <p className="text-meta text-ink-3">
              {isLatest ? "Latest edition" : `Edition ${current.edition}`} ·{" "}
              {editionDateline({ ...current, publishedAt: new Date(current.publishedAt) })}
            </p>
            <p className="mt-2 flex items-baseline gap-3">
              <span className="text-[4.25rem] leading-none font-semibold tracking-[-0.03em] sm:text-[5.25rem]">
                {current.overallScore.toFixed(1)}
              </span>
              <span className="text-lead text-ink-2">out of 10</span>
            </p>
            <p className="mt-3 text-body">
              {previous ? (
                <ChangeText
                  change={change(current.overallScore, previous.overallScore)}
                  since={monthOf(previous.period)}
                />
              ) : (
                <span className="text-ink-2">The first published edition.</span>
              )}
            </p>
            <p className="mt-2 text-small text-ink-3">
              From anonymous public check-ins, reviewed by editors.{" "}
              <Link href="/methodology" className="text-brand underline underline-offset-[0.22em]">
                How the score is made
              </Link>
            </p>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 lg:mt-6">
            {actions}
            <Link
              href={`/reports/${current.id}`}
              className="inline-flex min-h-11 items-center gap-1.5 font-semibold text-brand underline decoration-1 underline-offset-[0.22em] hover:decoration-2"
            >
              Read the {current.period} report
              <ArrowRight aria-hidden className="size-4" />
            </Link>
          </div>
        </div>

        <div className="flex flex-col border border-line bg-ground p-4 sm:p-6">
          <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
            <h2 className="font-sans text-body font-semibold">
              The index since {first.period}
            </h2>
            <p className="text-meta text-ink-3">Out of 10 · choose a month</p>
          </div>
          <TrendChart
            className="mt-4"
            fill
            title={`Nigeria Stability Index by month, ${first.period} to ${editions.at(-1)!.period}`}
            points={editions.map((e) => ({
              id: e.id,
              label: e.period,
              shortLabel: shortLabel(e.period),
              value: e.overallScore,
            }))}
            selectedId={selectedId}
            onSelect={setSelectedId}
          />
          <p className="mt-3 border-t border-line pt-3 text-meta text-ink-3">
            Source: NSI monthly reports.{" "}
            <a href="/reports/data.csv" className="text-brand underline underline-offset-[0.22em]" download>
              Download the data (CSV)
            </a>
          </p>
        </div>
      </div>

      {current.pillars.length > 0 ? (
        <div className="mt-10 lg:mt-9">
          <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-2 border-b border-ink pb-3">
            <h2 className="text-h3">The five pillars, {current.period}</h2>
            <p className="text-meta text-ink-3">
              Average of public answers on a 1 to {current.pillarMax} scale; the line under each pillar is the editors’
              summary.{samePillarScale ? ` The black tick marks ${monthOf(previous!.period)}.` : null}
            </p>
          </div>
          <PillarTable
            pillars={current.pillars}
            max={current.pillarMax}
            previous={samePillarScale ? previous!.pillars : undefined}
            previousLabel={samePillarScale ? monthOf(previous!.period) : undefined}
            caption={`Pillar scores for ${current.period}, out of ${current.pillarMax}`}
          />
        </div>
      ) : null}
    </>
  );
}
