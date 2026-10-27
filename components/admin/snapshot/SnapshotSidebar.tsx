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
  const selectedCycle = selectedId !== "new" ? list.find((s) => s.id === selectedId)?.cycleMonthYear : null;

  return (
    <aside className="sticky top-6 flex h-fit w-full flex-col gap-6 lg:w-80">
      <div className="admin-card">
        <div className="flex items-center justify-between">
          <h2 className="font-mono text-xs font-bold uppercase tracking-[0.16em] text-[color:var(--nsi-ink-muted)]">
            Snapshots
          </h2>
          {selectedId !== "new" && (
            <span
              className={`inline-flex items-center rounded-[2px] border px-2 py-0.5 font-mono text-[10px] font-bold uppercase ${
                locked
                  ? "border-gray-300 bg-gray-100 text-gray-700"
                  : published
                    ? "border-emerald-300 bg-emerald-50 text-emerald-900"
                    : "border-amber-300 bg-amber-50 text-amber-900"
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
          <option value="new">+ New Draft Snapshot</option>
          {list.map((s) => (
            <option key={s.id} value={s.id}>
              {s.period}
              {s.cycleMonthYear ? ` (${s.cycleMonthYear})` : ""}{" "}
              {s.isLocked ? "· locked" : s.publishedAt ? "· published" : "· draft"}
            </option>
          ))}
        </select>

        {model.id && (
          <div className="mt-4">
            <a
              href={published ? `/reports/${model.id}` : `/admin/snapshot/${model.id}/preview`}
              target="_blank"
              rel="noopener noreferrer"
              className="admin-btn-secondary w-full justify-center text-xs"
            >
              {published ? "View Live Report" : "Preview Draft Report"}
            </a>
          </div>
        )}

        <div className="mt-5 space-y-2.5 border-t border-[color:var(--nsi-rule)] pt-5 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-mono uppercase tracking-wider text-[color:var(--nsi-ink-muted)]">Published</span>
            <span className="font-semibold text-[color:var(--nsi-ink)]">
              {prettyDate(model.publishedAt ?? null)}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-mono uppercase tracking-wider text-[color:var(--nsi-ink-muted)]">Period</span>
            <span className="font-semibold text-[color:var(--nsi-ink)]">{model.period || "—"}</span>
          </div>
          {selectedCycle && (
            <div className="flex items-center justify-between">
              <span className="font-mono uppercase tracking-wider text-[color:var(--nsi-ink-muted)]">Cycle</span>
              <span className="font-semibold text-[color:var(--nsi-ink)]">{selectedCycle}</span>
            </div>
          )}
          <div className="flex items-center justify-between">
            <span className="font-mono uppercase tracking-wider text-[color:var(--nsi-ink-muted)]">Composite Score</span>
            <span className="font-serif text-lg font-bold text-[color:var(--nsi-green)]">
              {model.overallScore.toFixed(1)}
            </span>
          </div>
        </div>
      </div>

      <div className="admin-card">
        <h3 className="font-mono text-xs font-bold uppercase tracking-[0.16em] text-[color:var(--nsi-ink-muted)]">
          Dossier Completion
        </h3>
        <div className="mt-3 flex items-center gap-3">
          <div className="h-2 flex-1 overflow-hidden rounded-[1px] bg-black/10">
            <div
              className="h-full rounded-[1px] bg-[color:var(--nsi-green)] transition-all duration-300"
              style={{ width: `${completionPercent}%` }}
            />
          </div>
          <span className="font-mono text-xs font-bold text-[color:var(--nsi-ink)]">
            {completionStatus.completed}/{completionStatus.total}
          </span>
        </div>
        <p className="mt-2 text-xs text-[color:var(--nsi-ink-soft)]">
          {completionPercent === 100
            ? "All required sections complete"
            : `${completionStatus.total - completionStatus.completed} sections remaining`}
        </p>
      </div>

      <div className="admin-card">
        <h3 className="font-mono text-xs font-bold uppercase tracking-[0.16em] text-[color:var(--nsi-ink-muted)]">
          Publication Controls
        </h3>
        <div className="mt-4 flex flex-col gap-2">
          <button
            className="admin-btn-primary w-full justify-center"
            type="button"
            onClick={onSave}
            disabled={loading || locked || !canSave}
          >
            {loading ? "Saving…" : "Save Draft"}
          </button>

          <button
            className="admin-btn-secondary w-full justify-center"
            type="button"
            onClick={onPublish}
            disabled={loading || locked || !model.id}
          >
            {published ? "Republish Snapshot" : "Publish Snapshot"}
          </button>

          <button
            className="admin-btn-danger w-full justify-center"
            type="button"
            onClick={onLock}
            disabled={loading || locked || !model.id || !published}
          >
            Lock Snapshot (Immutable)
          </button>
        </div>

        {error && (
          <div className="mt-4 rounded-[2px] border border-red-300 bg-red-50 px-3.5 py-2.5 text-xs font-medium text-red-900">
            {error}
          </div>
        )}
        {success && (
          <div className="mt-4 rounded-[2px] border border-emerald-300 bg-emerald-50 px-3.5 py-2.5 text-xs font-medium text-emerald-900">
            {success}
          </div>
        )}
      </div>
    </aside>
  );
}
