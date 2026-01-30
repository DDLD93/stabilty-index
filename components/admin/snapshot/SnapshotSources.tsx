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
      <p className="text-sm text-[color:var(--nsi-ink-soft)]">
        Add verifiable sources and references to support this snapshot&apos;s data and analysis.
      </p>

      {model.sourcesReferences.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-black/10 bg-[color:var(--nsi-paper)] p-8 text-center">
          <LinkIcon className="mx-auto h-10 w-10 text-[color:var(--nsi-ink-soft)]/50" />
          <p className="mt-3 text-sm text-[color:var(--nsi-ink-soft)]">No sources added yet</p>
          <button
            type="button"
            onClick={addSource}
            disabled={locked}
            className="admin-btn-secondary mt-4"
          >
            <PlusIcon className="h-4 w-4" />
            Add first source
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {model.sourcesReferences.map((source, idx) => (
            <div
              key={idx}
              className="group rounded-xl border border-black/10 bg-white p-4 transition-all hover:border-black/20 hover:shadow-sm"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 text-sm font-medium text-blue-600">
                  {idx + 1}
                </div>

                <div className="flex-1 space-y-3">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <label className="block">
                      <span className="text-xs font-medium text-[color:var(--nsi-ink-soft)]">Label</span>
                      <input
                        className="admin-input mt-1 text-sm"
                        placeholder="e.g., NBS Report"
                        value={source.label}
                        onChange={(e) => updateSource(idx, { label: e.target.value })}
                        disabled={locked}
                      />
                    </label>
                    <label className="block">
                      <span className="text-xs font-medium text-[color:var(--nsi-ink-soft)]">URL</span>
                      <input
                        className="admin-input mt-1 text-sm"
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
                  className="shrink-0 rounded-lg p-2 text-[color:var(--nsi-ink-soft)] opacity-0 transition-all hover:bg-red-50 hover:text-red-600 group-hover:opacity-100 disabled:opacity-0"
                  aria-label="Remove source"
                >
                  <TrashIcon className="h-4 w-4" />
                </button>
              </div>

              {/* Preview Link */}
              {source.url && (
                <div className="ml-12 mt-2">
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-blue-600 hover:underline"
                  >
                    <ExternalLinkIcon className="h-3 w-3" />
                    Preview link
                  </a>
                </div>
              )}
            </div>
          ))}

          <button
            type="button"
            onClick={addSource}
            disabled={locked}
            className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-black/10 bg-white px-4 py-3 text-sm font-medium text-[color:var(--nsi-ink-soft)] transition-all hover:border-black/20 hover:bg-[color:var(--nsi-paper)] disabled:opacity-60"
          >
            <PlusIcon className="h-4 w-4" />
            Add another source
          </button>
        </div>
      )}
    </div>
  );
}

function LinkIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
    </svg>
  );
}

function PlusIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
  );
}

function TrashIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
    </svg>
  );
}

function ExternalLinkIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
    </svg>
  );
}
