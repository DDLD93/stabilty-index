"use client";

import { NIGERIAN_STATES } from "@/lib/constants";
import { SnapshotModel } from "./types";
import { KeyPointsEditor } from "./KeyPointsEditor";

type SnapshotHighlightsProps = {
  model: SnapshotModel;
  setModel: React.Dispatch<React.SetStateAction<SnapshotModel>>;
  locked: boolean;
};

export function SnapshotHighlights({ model, setModel, locked }: SnapshotHighlightsProps) {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-3">
        {/* State Spotlight */}
        <div className="rounded-[3px] border border-[color:var(--nsi-rule-strong)] bg-[color:var(--nsi-paper)] p-5">
          <div className="mb-4 border-b border-[color:var(--nsi-rule)] pb-3">
            <span className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-[color:var(--nsi-green)]">
              01 / Sub-National Focus
            </span>
            <h3 className="mt-1 font-serif text-lg font-bold text-[color:var(--nsi-ink)]">
              State Spotlight
            </h3>
          </div>

          <div className="space-y-4">
            <label className="block">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-[color:var(--nsi-ink)]">State</span>
              <select
                className="admin-select mt-1.5 bg-white"
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
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-[color:var(--nsi-ink)]">State Score</span>
              <div className="mt-1.5 flex items-center gap-3">
                <input
                  className="admin-input flex-1 bg-white"
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
                <span className="font-serif text-xl font-bold text-[color:var(--nsi-green)]">
                  {model.stateSpotlightContent.score.toFixed(1)}
                </span>
              </div>
            </label>

            <div>
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-[color:var(--nsi-ink)]">Key Points</span>
              <div className="mt-1.5">
                <KeyPointsEditor
                  value={model.stateSpotlightContent.keyPointsHtml}
                  onChange={(html) =>
                    setModel((m) => ({
                      ...m,
                      stateSpotlightContent: { ...m.stateSpotlightContent, keyPointsHtml: html },
                    }))
                  }
                  disabled={locked}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Institution Spotlight */}
        <div className="rounded-[3px] border border-[color:var(--nsi-rule-strong)] bg-[color:var(--nsi-paper)] p-5">
          <div className="mb-4 border-b border-[color:var(--nsi-rule)] pb-3">
            <span className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-[color:var(--nsi-gold)]">
              02 / Institutional Focus
            </span>
            <h3 className="mt-1 font-serif text-lg font-bold text-[color:var(--nsi-ink)]">
              Institution Spotlight
            </h3>
          </div>

          <div className="space-y-4">
            <label className="block">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-[color:var(--nsi-ink)]">Institution Name</span>
              <input
                className="admin-input mt-1.5 bg-white"
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
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-[color:var(--nsi-ink)]">Summary</span>
              <input
                className="admin-input mt-1.5 bg-white"
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
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-[color:var(--nsi-ink)]">Key Points</span>
              <div className="mt-1.5">
                <KeyPointsEditor
                  value={model.institutionSpotlightContent.keyPointsHtml}
                  onChange={(html) =>
                    setModel((m) => ({
                      ...m,
                      institutionSpotlightContent: {
                        ...m.institutionSpotlightContent,
                        keyPointsHtml: html,
                      },
                    }))
                  }
                  disabled={locked}
                />
              </div>
            </div>
          </div>
        </div>

        {/* On-Ground Street Pulse */}
        <div className="rounded-[3px] border border-[color:var(--nsi-rule-strong)] bg-[color:var(--nsi-paper)] p-5">
          <div className="mb-4 border-b border-[color:var(--nsi-rule)] pb-3">
            <span className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-[color:var(--nsi-terracotta)]">
              03 / Citizen Field Pulse
            </span>
            <h3 className="mt-1 font-serif text-lg font-bold text-[color:var(--nsi-ink)]">
              On-Ground Street Pulse
            </h3>
          </div>

          <div className="space-y-4">
            <label className="block">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-[color:var(--nsi-ink)]">Headline</span>
              <input
                className="admin-input mt-1.5 bg-white"
                value={model.streetPulseSpotlightContent.title}
                onChange={(e) =>
                  setModel((m) => ({
                    ...m,
                    streetPulseSpotlightContent: {
                      ...m.streetPulseSpotlightContent,
                      title: e.target.value,
                    },
                  }))
                }
                disabled={locked}
                placeholder="e.g., Market & transport pulse"
              />
            </label>

            <label className="block">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-[color:var(--nsi-ink)]">Summary</span>
              <input
                className="admin-input mt-1.5 bg-white"
                value={model.streetPulseSpotlightContent.summary}
                onChange={(e) =>
                  setModel((m) => ({
                    ...m,
                    streetPulseSpotlightContent: {
                      ...m.streetPulseSpotlightContent,
                      summary: e.target.value,
                    },
                  }))
                }
                disabled={locked}
                placeholder="Brief summary..."
              />
            </label>

            <div>
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-[color:var(--nsi-ink)]">Key Points</span>
              <div className="mt-1.5">
                <KeyPointsEditor
                  value={model.streetPulseSpotlightContent.keyPointsHtml}
                  onChange={(html) =>
                    setModel((m) => ({
                      ...m,
                      streetPulseSpotlightContent: {
                        ...m.streetPulseSpotlightContent,
                        keyPointsHtml: html,
                      },
                    }))
                  }
                  disabled={locked}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
