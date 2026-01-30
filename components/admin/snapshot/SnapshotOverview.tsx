"use client";

import { SnapshotModel } from "./types";

type SnapshotOverviewProps = {
  model: SnapshotModel;
  setModel: React.Dispatch<React.SetStateAction<SnapshotModel>>;
  locked: boolean;
};

export function SnapshotOverview({ model, setModel, locked }: SnapshotOverviewProps) {
  return (
    <div className="space-y-6">
      {/* Score Display */}
      <div className="flex flex-col items-center justify-center rounded-2xl border border-[color:var(--nsi-green)]/20 bg-gradient-to-br from-[color:var(--nsi-green)]/5 to-transparent p-8">
        <span className="text-sm font-medium uppercase tracking-wide text-[color:var(--nsi-ink-soft)]">
          Overall Score
        </span>
        <div className="mt-2 flex items-baseline gap-1">
          <span className="font-serif text-6xl font-bold tabular-nums text-[color:var(--nsi-green)]">
            {model.overallScore.toFixed(1)}
          </span>
          <span className="text-2xl text-[color:var(--nsi-ink-soft)]">/10</span>
        </div>
        {/* Score Bar Visualization */}
        <div className="mt-4 h-3 w-full max-w-xs overflow-hidden rounded-full bg-black/5">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[color:var(--nsi-green)] to-[color:var(--nsi-green-teal)] transition-all duration-500"
            style={{ width: `${(model.overallScore / 10) * 100}%` }}
          />
        </div>
      </div>

      {/* Form Fields */}
      <div className="grid gap-6 md:grid-cols-2">
        <label className="block">
          <span className="text-sm font-medium text-[color:var(--nsi-ink)]">Period</span>
          <p className="mt-0.5 text-xs text-[color:var(--nsi-ink-soft)]">Month and year for this snapshot</p>
          <input
            className="admin-input mt-2"
            value={model.period}
            onChange={(e) => setModel((m) => ({ ...m, period: e.target.value }))}
            disabled={locked}
            placeholder="e.g., January 2026"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-[color:var(--nsi-ink)]">Overall Score</span>
          <p className="mt-0.5 text-xs text-[color:var(--nsi-ink-soft)]">Scale of 0 to 10</p>
          <input
            className="admin-input mt-2"
            type="number"
            step="0.1"
            min={0}
            max={10}
            value={model.overallScore}
            onChange={(e) => setModel((m) => ({ ...m, overallScore: Number(e.target.value) }))}
            disabled={locked}
          />
        </label>
      </div>

      <label className="block">
        <span className="text-sm font-medium text-[color:var(--nsi-ink)]">Overall Narrative</span>
        <p className="mt-0.5 text-xs text-[color:var(--nsi-ink-soft)]">
          A brief summary describing the overall stability assessment
        </p>
        <textarea
          className="admin-input mt-2 min-h-[100px] resize-y"
          value={model.overallNarrative}
          onChange={(e) => setModel((m) => ({ ...m, overallNarrative: e.target.value }))}
          disabled={locked}
          placeholder="Describe the overall stability situation..."
        />
      </label>
    </div>
  );
}
