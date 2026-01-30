"use client";

import { SnapshotListItem, SnapshotModel, prettyDate } from "./types";

type SnapshotSidebarProps = {
  list: SnapshotListItem[];
  selectedId: string | "new";
  onSelect: (id: string | "new") => void;
  model: SnapshotModel;
  loading: boolean;
  locked: boolean;
  published: boolean;
  canSave: boolean;
  error: string | null;
  success: string | null;
  onSave: () => void;
  onPublish: () => void;
  onLock: () => void;
  completionStatus: { completed: number; total: number };
};

export function SnapshotSidebar({
  list,
  selectedId,
  onSelect,
  model,
  loading,
  locked,
  published,
  canSave,
  error,
  success,
  onSave,
  onPublish,
  onLock,
  completionStatus,
}: SnapshotSidebarProps) {
  const completionPercent = Math.round((completionStatus.completed / completionStatus.total) * 100);

  return (
    <aside className="sticky top-6 flex h-fit w-full flex-col gap-6 lg:w-80">
      {/* Snapshot Selector Card */}
      <div className="admin-card">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-[color:var(--nsi-ink-soft)]">
            Snapshots
          </h2>
          {selectedId !== "new" && (
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                locked
                  ? "bg-gray-100 text-gray-700"
                  : published
                    ? "bg-emerald-100 text-emerald-800"
                    : "bg-amber-100 text-amber-800"
              }`}
            >
              {locked ? "Locked" : published ? "Published" : "Draft"}
            </span>
          )}
        </div>

        <select
          className="admin-select mt-4"
          value={selectedId}
          onChange={(e) => onSelect(e.target.value === "new" ? "new" : e.target.value)}
        >
          <option value="new">+ New draft</option>
          {list.map((s) => (
            <option key={s.id} value={s.id}>
              {s.period} {s.isLocked ? "· locked" : s.publishedAt ? "· published" : "· draft"}
            </option>
          ))}
        </select>

        {/* Status Info */}
        <div className="mt-5 space-y-3 border-t border-black/5 pt-5">
          <div className="flex items-center justify-between text-sm">
            <span className="text-[color:var(--nsi-ink-soft)]">Published</span>
            <span className="font-medium text-[color:var(--nsi-ink)]">
              {prettyDate(model.publishedAt ?? null)}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-[color:var(--nsi-ink-soft)]">Period</span>
            <span className="font-medium text-[color:var(--nsi-ink)]">{model.period || "—"}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-[color:var(--nsi-ink-soft)]">Score</span>
            <span className="font-serif text-lg font-semibold text-[color:var(--nsi-green)]">
              {model.overallScore.toFixed(1)}
            </span>
          </div>
        </div>
      </div>

      {/* Progress Card */}
      <div className="admin-card">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-[color:var(--nsi-ink-soft)]">
          Completion
        </h3>
        <div className="mt-3 flex items-center gap-3">
          <div className="h-2 flex-1 overflow-hidden rounded-full bg-black/5">
            <div
              className="h-full rounded-full bg-[color:var(--nsi-green)] transition-all duration-300"
              style={{ width: `${completionPercent}%` }}
            />
          </div>
          <span className="text-sm font-medium text-[color:var(--nsi-ink)]">
            {completionStatus.completed}/{completionStatus.total}
          </span>
        </div>
        <p className="mt-2 text-xs text-[color:var(--nsi-ink-soft)]">
          {completionPercent === 100
            ? "All sections complete"
            : `${completionStatus.total - completionStatus.completed} sections remaining`}
        </p>
      </div>

      {/* Actions Card */}
      <div className="admin-card">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-[color:var(--nsi-ink-soft)]">
          Actions
        </h3>
        <div className="mt-4 flex flex-col gap-2">
          <button
            className="admin-btn-primary w-full justify-center"
            type="button"
            onClick={onSave}
            disabled={loading || locked || !canSave}
          >
            {loading ? (
              <>
                <LoadingSpinner />
                Saving...
              </>
            ) : (
              <>
                <SaveIcon />
                Save draft
              </>
            )}
          </button>

          <button
            className="admin-btn-secondary w-full justify-center"
            type="button"
            onClick={onPublish}
            disabled={loading || locked || !model.id}
          >
            <PublishIcon />
            {published ? "Republish" : "Publish"}
          </button>

          <button
            className="admin-btn-ghost w-full justify-center text-amber-700 hover:bg-amber-50 hover:text-amber-800"
            type="button"
            onClick={onLock}
            disabled={loading || locked || !model.id || !published}
          >
            <LockIcon />
            Lock (irreversible)
          </button>
        </div>

        {/* Feedback Messages */}
        {error && (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
            {error}
          </div>
        )}
        {success && (
          <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
            {success}
          </div>
        )}
      </div>
    </aside>
  );
}

// Icons
function SaveIcon() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}

function PublishIcon() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
  );
}

function LoadingSpinner() {
  return (
    <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
    </svg>
  );
}
