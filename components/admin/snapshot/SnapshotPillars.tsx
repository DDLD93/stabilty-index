"use client";

import { SnapshotModel, Pillar } from "./types";

type SnapshotPillarsProps = {
  model: SnapshotModel;
  setModel: React.Dispatch<React.SetStateAction<SnapshotModel>>;
  locked: boolean;
};

export function SnapshotPillars({ model, setModel, locked }: SnapshotPillarsProps) {
  const updatePillar = (idx: number, updates: Partial<Pillar>) => {
    setModel((m) => {
      const pillars = [...m.pillarScores.pillars];
      pillars[idx] = { ...pillars[idx], ...updates };
      return { ...m, pillarScores: { pillars } };
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        {model.pillarScores.pillars.map((pillar, idx) => (
          <PillarCard
            key={idx}
            pillar={pillar}
            index={idx}
            locked={locked}
            onUpdate={(updates) => updatePillar(idx, updates)}
          />
        ))}
      </div>
    </div>
  );
}

type PillarCardProps = {
  pillar: Pillar;
  index: number;
  locked: boolean;
  onUpdate: (updates: Partial<Pillar>) => void;
};

function PillarCard({ pillar, index, locked, onUpdate }: PillarCardProps) {
  return (
    <div className="rounded-[3px] border border-[color:var(--nsi-rule-strong)] bg-[color:var(--nsi-paper)] p-5">
      <div className="mb-4 flex items-start justify-between border-b border-[color:var(--nsi-rule)] pb-3">
        <span className="font-mono text-xs font-bold uppercase tracking-[0.16em] text-[color:var(--nsi-ink-muted)]">
          Pillar 0{index + 1}
        </span>
        <span className="font-serif text-2xl font-bold tabular-nums text-[color:var(--nsi-green)]">
          {pillar.score.toFixed(1)}
        </span>
      </div>

      <div className="mb-4 h-1.5 overflow-hidden rounded-[1px] bg-black/10">
        <div
          className="h-full rounded-[1px] bg-[color:var(--nsi-green)] transition-all duration-300"
          style={{ width: `${(pillar.score / 10) * 100}%` }}
        />
      </div>

      <div className="space-y-3">
        <label className="block">
          <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-[color:var(--nsi-ink-soft)]">
            Pillar Title
          </span>
          <input
            className="admin-input mt-1 bg-white text-sm"
            value={pillar.title}
            onChange={(e) => onUpdate({ title: e.target.value })}
            disabled={locked}
            placeholder="e.g., Security"
          />
        </label>

        <label className="block">
          <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-[color:var(--nsi-ink-soft)]">
            Score (0–10)
          </span>
          <input
            className="admin-input mt-1 bg-white text-sm"
            type="number"
            step="0.1"
            min={0}
            max={10}
            value={pillar.score}
            onChange={(e) => onUpdate({ score: Number(e.target.value) })}
            disabled={locked}
          />
        </label>

        <label className="block">
          <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-[color:var(--nsi-ink-soft)]">
            Analytical Summary
          </span>
          <textarea
            className="admin-input mt-1 min-h-[72px] resize-y bg-white text-sm"
            value={pillar.summary}
            onChange={(e) => onUpdate({ summary: e.target.value })}
            disabled={locked}
            placeholder="Brief assessment..."
          />
        </label>
      </div>
    </div>
  );
}
