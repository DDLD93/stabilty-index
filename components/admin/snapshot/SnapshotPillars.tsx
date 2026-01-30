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
      <p className="text-sm text-[color:var(--nsi-ink-soft)]">
        Define scores and summaries for each of the five stability pillars.
      </p>

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
  const pillarIcons = ["shield", "chart", "trending", "landmark", "users"];
  const pillarColors = [
    "from-red-500/10 to-red-500/5 border-red-500/20",
    "from-blue-500/10 to-blue-500/5 border-blue-500/20",
    "from-emerald-500/10 to-emerald-500/5 border-emerald-500/20",
    "from-purple-500/10 to-purple-500/5 border-purple-500/20",
    "from-amber-500/10 to-amber-500/5 border-amber-500/20",
  ];

  return (
    <div
      className={`rounded-2xl border bg-gradient-to-br p-5 transition-all hover:shadow-md ${pillarColors[index] || pillarColors[0]}`}
    >
      {/* Header with Score */}
      <div className="mb-4 flex items-start justify-between">
        <div className="flex items-center gap-2">
          <PillarIcon type={pillarIcons[index]} />
          <span className="text-xs font-semibold uppercase tracking-wide text-[color:var(--nsi-ink-soft)]">
            Pillar {index + 1}
          </span>
        </div>
        <div className="flex items-baseline gap-0.5">
          <span className="font-serif text-2xl font-bold tabular-nums text-[color:var(--nsi-green)]">
            {pillar.score.toFixed(1)}
          </span>
        </div>
      </div>

      {/* Score Bar */}
      <div className="mb-4 h-1.5 overflow-hidden rounded-full bg-black/5">
        <div
          className="h-full rounded-full bg-[color:var(--nsi-green)] transition-all duration-300"
          style={{ width: `${(pillar.score / 10) * 100}%` }}
        />
      </div>

      {/* Form Fields */}
      <div className="space-y-3">
        <label className="block">
          <span className="text-xs font-medium text-[color:var(--nsi-ink-soft)]">Title</span>
          <input
            className="admin-input mt-1 text-sm"
            value={pillar.title}
            onChange={(e) => onUpdate({ title: e.target.value })}
            disabled={locked}
            placeholder="e.g., Security"
          />
        </label>

        <label className="block">
          <span className="text-xs font-medium text-[color:var(--nsi-ink-soft)]">Score (0-10)</span>
          <input
            className="admin-input mt-1 text-sm"
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
          <span className="text-xs font-medium text-[color:var(--nsi-ink-soft)]">Summary</span>
          <textarea
            className="admin-input mt-1 min-h-[60px] resize-y text-sm"
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

function PillarIcon({ type }: { type: string }) {
  const iconClass = "h-5 w-5 text-[color:var(--nsi-ink-soft)]";
  
  switch (type) {
    case "shield":
      return (
        <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
        </svg>
      );
    case "chart":
      return (
        <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
        </svg>
      );
    case "trending":
      return (
        <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
        </svg>
      );
    case "landmark":
      return (
        <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" />
        </svg>
      );
    case "users":
      return (
        <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
        </svg>
      );
    default:
      return null;
  }
}
