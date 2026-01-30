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
      <p className="text-sm text-[color:var(--nsi-ink-soft)]">
        Capture the public mood and sentiment from submissions and external sources.
      </p>

      <div className="rounded-2xl border border-black/10 bg-gradient-to-br from-amber-500/5 to-transparent p-6">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10">
            <HeartIcon className="h-5 w-5 text-amber-600" />
          </div>
          <div>
            <h3 className="font-serif text-lg font-semibold text-[color:var(--nsi-ink)]">
              Public Sentiment
            </h3>
            <p className="text-xs text-[color:var(--nsi-ink-soft)]">Aggregated from public submissions</p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Top Mood */}
          <div className="rounded-xl border border-amber-500/20 bg-white/50 p-4">
            <label className="block">
              <span className="text-sm font-medium text-[color:var(--nsi-ink)]">Top Mood</span>
              <p className="mt-0.5 text-xs text-[color:var(--nsi-ink-soft)]">
                The dominant sentiment this period
              </p>
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

          {/* Average Score */}
          <div className="rounded-xl border border-amber-500/20 bg-white/50 p-4">
            <label className="block">
              <span className="text-sm font-medium text-[color:var(--nsi-ink)]">Average Public Score</span>
              <p className="mt-0.5 text-xs text-[color:var(--nsi-ink-soft)]">
                Mean score from public submissions
              </p>
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
                  <span className="font-serif text-2xl font-bold tabular-nums text-amber-600">
                    {model.publicSentimentSummary.averagePublicScore.toFixed(1)}
                  </span>
                  <span className="text-sm text-[color:var(--nsi-ink-soft)]">/10</span>
                </div>
              </div>
            </label>
          </div>
        </div>

        {/* Top Words */}
        <div className="mt-6">
          <label className="block">
            <span className="text-sm font-medium text-[color:var(--nsi-ink)]">Top Words</span>
            <p className="mt-0.5 text-xs text-[color:var(--nsi-ink-soft)]">
              Common keywords from submissions (comma-separated)
            </p>
            <input
              className="admin-input mt-2"
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
              placeholder="e.g., Hopeful, Steady, Progressing"
            />
          </label>

          {/* Word Tags Preview */}
          {model.publicSentimentSummary.topWords.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {model.publicSentimentSummary.topWords.map((word, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center rounded-full bg-amber-100 px-3 py-1 text-sm font-medium text-amber-800"
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

function HeartIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z" />
    </svg>
  );
}
