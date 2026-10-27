"use client";

import { SnapshotModel } from "./types";

type SnapshotSentimentProps = {
  model: SnapshotModel;
  setModel: React.Dispatch<React.SetStateAction<SnapshotModel>>;
  locked: boolean;
};

export function SnapshotSentiment({ model, setModel, locked }: SnapshotSentimentProps) {
  return (
    <div className="space-y-6">
      <div className="rounded-[3px] border border-[color:var(--nsi-rule-strong)] bg-[color:var(--nsi-paper)] p-6">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-[2px] border border-[color:var(--nsi-rule)] bg-white p-4">
            <label className="block">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-[color:var(--nsi-ink)]">
                Dominant National Mood
              </span>
              <input
                className="admin-input mt-2"
                value={model.publicSentimentSummary.topMood}
                onChange={(e) =>
                  setModel((m) => ({
                    ...m,
                    publicSentimentSummary: { ...m.publicSentimentSummary, topMood: e.target.value },
                  }))
                }
                disabled={locked}
                placeholder="e.g., Cautiously hopeful"
              />
            </label>
          </div>

          <div className="rounded-[2px] border border-[color:var(--nsi-rule)] bg-white p-4">
            <label className="block">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-[color:var(--nsi-ink)]">
                Mean Citizen Score
              </span>
              <div className="mt-2 flex items-center gap-3">
                <input
                  className="admin-input flex-1"
                  type="number"
                  step="0.1"
                  min={0}
                  max={10}
                  value={model.publicSentimentSummary.averagePublicScore}
                  onChange={(e) =>
                    setModel((m) => ({
                      ...m,
                      publicSentimentSummary: {
                        ...m.publicSentimentSummary,
                        averagePublicScore: Number(e.target.value),
                      },
                    }))
                  }
                  disabled={locked}
                />
                <div className="flex items-baseline gap-1">
                  <span className="font-serif text-2xl font-bold tabular-nums text-[color:var(--nsi-green)]">
                    {model.publicSentimentSummary.averagePublicScore.toFixed(1)}
                  </span>
                  <span className="font-mono text-xs text-[color:var(--nsi-ink-muted)]">/10</span>
                </div>
              </div>
            </label>
          </div>
        </div>

        <div className="mt-6">
          <label className="block">
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-[color:var(--nsi-ink)]">
              Top Citizen Descriptors (Comma-Separated)
            </span>
            <input
              className="admin-input mt-2 bg-white"
              value={model.publicSentimentSummary.topWords.join(", ")}
              onChange={(e) =>
                setModel((m) => ({
                  ...m,
                  publicSentimentSummary: {
                    ...m.publicSentimentSummary,
                    topWords: e.target.value
                      .split(",")
                      .map((x) => x.trim())
                      .filter(Boolean),
                  },
                }))
              }
              disabled={locked}
              placeholder="e.g., Resilient, Tense, Hopeful"
            />
          </label>

          {model.publicSentimentSummary.topWords.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {model.publicSentimentSummary.topWords.map((word, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center rounded-[2px] border border-[color:var(--nsi-gold)]/40 bg-[color:var(--nsi-gold-soft)] px-3 py-1 font-mono text-xs font-bold text-[color:var(--nsi-ink)]"
                >
                  {word}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
