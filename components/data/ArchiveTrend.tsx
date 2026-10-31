"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { TrendChart } from "@/components/data/TrendChart";

export type ArchivePoint = { id: string; period: string; shortLabel: string; value: number };

/** The trend chart for the archive: choosing a month offers a link to that edition. */
export function ArchiveTrend({ points }: { points: ArchivePoint[] }) {
  const [selectedId, setSelectedId] = useState(points.at(-1)?.id ?? "");
  const selected = points.find((p) => p.id === selectedId);
  if (points.length === 0) return null;
  return (
    <div className="border border-line p-4 sm:p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h2 className="font-sans text-body font-semibold">
          The index by month, {points[0].period} to {points.at(-1)!.period}
        </h2>
        <p className="text-meta text-ink-3">Out of 10 · choose a month</p>
      </div>
      <TrendChart
        className="mt-4"
        title="Nigeria Stability Index by month"
        points={points.map((p) => ({ id: p.id, label: p.period, shortLabel: p.shortLabel, value: p.value }))}
        selectedId={selectedId}
        onSelect={setSelectedId}
      />
      {selected ? (
        <p className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-line pt-4" aria-live="polite">
          <span>
            <span className="font-semibold">{selected.period}</span>: {selected.value.toFixed(1)} out of 10
          </span>
          <Link
            href={`/reports/${selected.id}`}
            className="inline-flex min-h-11 items-center gap-1.5 font-semibold text-brand underline underline-offset-[0.22em]"
          >
            Open the {selected.period} report <ArrowRight aria-hidden className="size-4" />
          </Link>
        </p>
      ) : null}
    </div>
  );
}
