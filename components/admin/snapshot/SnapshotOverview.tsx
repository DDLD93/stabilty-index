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
      <div className="flex flex-col items-center justify-center rounded-[3px] border border-[color:var(--nsi-rule-strong)] bg-[color:var(--nsi-paper)] p-8">
        <span className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-[color:var(--nsi-ink-muted)]">
          National Composite Score
        </span>
        <div className="mt-2 flex items-baseline gap-1">
          <span className="font-serif text-6xl font-bold tabular-nums text-[color:var(--nsi-green)]">
            {model.overallScore.toFixed(1)}
          </span>
          <span className="font-mono text-xl text-[color:var(--nsi-ink-muted)]">/10</span>
        </div>
        <div className="mt-4 h-2.5 w-full max-w-xs overflow-hidden rounded-[1px] bg-black/10">
          <div
            className="h-full rounded-[1px] bg-[color:var(--nsi-green)] transition-all duration-500"
            style={{ width: `${(model.overallScore / 10) * 100}%` }}
          />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <label className="block">
          <span className="font-mono text-xs font-bold uppercase tracking-[0.14em] text-[color:var(--nsi-ink)]">
            Edition Period
          </span>
          <p className="mt-0.5 text-xs text-[color:var(--nsi-ink-muted)]">Month and year for this snapshot</p>
          <input
            className="admin-input mt-2"
            value={model.period}
            onChange={(e) => setModel((m) => ({ ...m, period: e.target.value }))}
            disabled={locked}
            placeholder="e.g., October 2026"
          />
        </label>

        <label className="block">
          <span className="font-mono text-xs font-bold uppercase tracking-[0.14em] text-[color:var(--nsi-ink)]">
            Overall Score
          </span>
          <p className="mt-0.5 text-xs text-[color:var(--nsi-ink-muted)]">Scale of 0.0 to 10.0</p>
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
        <span className="font-mono text-xs font-bold uppercase tracking-[0.14em] text-[color:var(--nsi-ink)]">
          Executive Narrative
        </span>
        <p className="mt-0.5 text-xs text-[color:var(--nsi-ink-muted)]">
          Synthesis of the overall national stability assessment
        </p>
        <textarea
          className="admin-input mt-2 min-h-[120px] resize-y"
          value={model.overallNarrative}
          onChange={(e) => setModel((m) => ({ ...m, overallNarrative: e.target.value }))}
          disabled={locked}
          placeholder="Describe the overall stability situation..."
        />
      </label>
    </div>
  );
}
