"use client";

import { NIGERIAN_STATES } from "@/lib/constants";
import { SnapshotModel } from "./types";

type SnapshotHighlightsProps = {
  model: SnapshotModel;
  setModel: React.Dispatch<React.SetStateAction<SnapshotModel>>;
  locked: boolean;
};

export function SnapshotHighlights({ model, setModel, locked }: SnapshotHighlightsProps) {
  return (
    <div className="space-y-8">
      <p className="text-sm text-[color:var(--nsi-ink-soft)]">
        Feature a state and institution in this month&apos;s spotlight sections.
      </p>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* State Spotlight */}
        <div className="rounded-2xl border border-black/10 bg-gradient-to-br from-emerald-500/5 to-transparent p-6">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10">
              <MapIcon className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-semibold text-[color:var(--nsi-ink)]">
                State Spotlight
              </h3>
              <p className="text-xs text-[color:var(--nsi-ink-soft)]">Featured state analysis</p>
            </div>
          </div>

          <div className="space-y-4">
            <label className="block">
              <span className="text-sm font-medium text-[color:var(--nsi-ink)]">State</span>
              <select
                className="admin-select mt-1"
                value={model.stateSpotlightContent.state}
                onChange={(e) =>
                  setModel((m) => ({
                    ...m,
                    stateSpotlightContent: { ...m.stateSpotlightContent, state: e.target.value },
                  }))
                }
                disabled={locked}
              >
                {NIGERIAN_STATES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="text-sm font-medium text-[color:var(--nsi-ink)]">State Score</span>
              <div className="mt-1 flex items-center gap-3">
                <input
                  className="admin-input flex-1"
                  type="number"
                  step="0.1"
                  min={0}
                  max={10}
                  value={model.stateSpotlightContent.score}
                  onChange={(e) =>
                    setModel((m) => ({
                      ...m,
                      stateSpotlightContent: { ...m.stateSpotlightContent, score: Number(e.target.value) },
                    }))
                  }
                  disabled={locked}
                />
                <span className="font-serif text-xl font-semibold text-emerald-600">
                  {model.stateSpotlightContent.score.toFixed(1)}
                </span>
              </div>
            </label>

            <div>
              <span className="text-sm font-medium text-[color:var(--nsi-ink)]">Key Points</span>
              <p className="mt-0.5 text-xs text-[color:var(--nsi-ink-soft)]">3 bullet points about this state</p>
              <div className="mt-2 space-y-2">
                {[0, 1, 2].map((idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-xs font-medium text-emerald-600">
                      {idx + 1}
                    </span>
                    <input
                      className="admin-input flex-1 text-sm"
                      value={model.stateSpotlightContent.bullets[idx] ?? ""}
                      onChange={(e) =>
                        setModel((m) => {
                          const bullets = [...m.stateSpotlightContent.bullets];
                          while (bullets.length <= idx) bullets.push("");
                          bullets[idx] = e.target.value;
                          return { ...m, stateSpotlightContent: { ...m.stateSpotlightContent, bullets } };
                        })
                      }
                      disabled={locked}
                      placeholder={`Point ${idx + 1}`}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Institution Spotlight */}
        <div className="rounded-2xl border border-black/10 bg-gradient-to-br from-purple-500/5 to-transparent p-6">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10">
              <BuildingIcon className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-semibold text-[color:var(--nsi-ink)]">
                Institution Spotlight
              </h3>
              <p className="text-xs text-[color:var(--nsi-ink-soft)]">Featured institution analysis</p>
            </div>
          </div>

          <div className="space-y-4">
            <label className="block">
              <span className="text-sm font-medium text-[color:var(--nsi-ink)]">Institution Name</span>
              <input
                className="admin-input mt-1"
                value={model.institutionSpotlightContent.institution}
                onChange={(e) =>
                  setModel((m) => ({
                    ...m,
                    institutionSpotlightContent: {
                      ...m.institutionSpotlightContent,
                      institution: e.target.value,
                    },
                  }))
                }
                disabled={locked}
                placeholder="e.g., Central Bank of Nigeria"
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-[color:var(--nsi-ink)]">Summary</span>
              <input
                className="admin-input mt-1"
                value={model.institutionSpotlightContent.summary}
                onChange={(e) =>
                  setModel((m) => ({
                    ...m,
                    institutionSpotlightContent: {
                      ...m.institutionSpotlightContent,
                      summary: e.target.value,
                    },
                  }))
                }
                disabled={locked}
                placeholder="Brief description of the institution's role..."
              />
            </label>

            <div>
              <span className="text-sm font-medium text-[color:var(--nsi-ink)]">Key Points</span>
              <p className="mt-0.5 text-xs text-[color:var(--nsi-ink-soft)]">3 bullet points about this institution</p>
              <div className="mt-2 space-y-2">
                {[0, 1, 2].map((idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-purple-500/10 text-xs font-medium text-purple-600">
                      {idx + 1}
                    </span>
                    <input
                      className="admin-input flex-1 text-sm"
                      value={model.institutionSpotlightContent.bullets[idx] ?? ""}
                      onChange={(e) =>
                        setModel((m) => {
                          const bullets = [...m.institutionSpotlightContent.bullets];
                          while (bullets.length <= idx) bullets.push("");
                          bullets[idx] = e.target.value;
                          return {
                            ...m,
                            institutionSpotlightContent: {
                              ...m.institutionSpotlightContent,
                              bullets,
                            },
                          };
                        })
                      }
                      disabled={locked}
                      placeholder={`Point ${idx + 1}`}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MapIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z" />
    </svg>
  );
}

function BuildingIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" />
    </svg>
  );
}
