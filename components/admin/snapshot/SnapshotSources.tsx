"use client";

import { SnapshotModel, SourceRef } from "./types";

type SnapshotSourcesProps = {
  model: SnapshotModel;
  setModel: React.Dispatch<React.SetStateAction<SnapshotModel>>;
  locked: boolean;
};

export function SnapshotSources({ model, setModel, locked }: SnapshotSourcesProps) {
  const addSource = () => {
    setModel((m) => ({
      ...m,
      sourcesReferences: [...m.sourcesReferences, { label: "", url: "" }],
    }));
  };

  const updateSource = (idx: number, updates: Partial<SourceRef>) => {
    setModel((m) => {
      const list = [...m.sourcesReferences];
      list[idx] = { ...list[idx]!, ...updates };
      return { ...m, sourcesReferences: list };
    });
  };

  const removeSource = (idx: number) => {
    setModel((m) => ({
      ...m,
      sourcesReferences: m.sourcesReferences.filter((_, i) => i !== idx),
    }));
  };

  return (
    <div className="space-y-6">
      {model.sourcesReferences.length === 0 ? (
        <div className="rounded-[3px] border border-dashed border-[color:var(--nsi-rule-strong)] bg-[color:var(--nsi-paper)] p-8 text-center">
          <p className="font-mono text-xs uppercase tracking-[0.14em] text-[color:var(--nsi-ink-muted)]">
            No reference sources attached yet
          </p>
          <button
            type="button"
            onClick={addSource}
            disabled={locked}
            className="admin-btn-secondary mt-4"
          >
            + Add Reference Source
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {model.sourcesReferences.map((source, idx) => (
            <div
              key={idx}
              className="group rounded-[3px] border border-[color:var(--nsi-rule-strong)] bg-[color:var(--nsi-paper)] p-4"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[2px] border border-[color:var(--nsi-rule-strong)] bg-white font-mono text-xs font-bold text-[color:var(--nsi-green)]">
                  0{idx + 1}
                </div>

                <div className="flex-1 space-y-3">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <label className="block">
                      <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-[color:var(--nsi-ink-soft)]">
                        Citation Label
                      </span>
                      <input
                        className="admin-input mt-1 bg-white text-sm"
                        placeholder="e.g., NBS CPI & Inflation Report"
                        value={source.label}
                        onChange={(e) => updateSource(idx, { label: e.target.value })}
                        disabled={locked}
                      />
                    </label>
                    <label className="block">
                      <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-[color:var(--nsi-ink-soft)]">
                        URL
                      </span>
                      <input
                        className="admin-input mt-1 bg-white text-sm"
                        type="url"
                        placeholder="https://..."
                        value={source.url}
                        onChange={(e) => updateSource(idx, { url: e.target.value })}
                        disabled={locked}
                      />
                    </label>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => removeSource(idx)}
                  disabled={locked}
                  className="admin-btn-danger px-2.5 py-1 text-xs"
                  aria-label="Remove source"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={addSource}
            disabled={locked}
            className="admin-btn-secondary w-full justify-center"
          >
            + Add Another Reference Source
          </button>
        </div>
      )}
    </div>
  );
}
