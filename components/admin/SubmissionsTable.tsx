"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { formatDeviceInfoSummary } from "@/lib/clientDeviceInfo";
import { PILLARS } from "@/lib/constants";

type Item = {
  id: string;
  createdAt: string;
  stabilityScore: number | null;
  mood: string | null;
  oneWord: string | null;
  pillarResponses: Record<string, number> | null;
  spotlightState: string | null;
  spotlightTags: string[];
  spotlightComment: string | null;
  deviceInfo?: unknown | null;
  isFlagged: boolean;
  cycleId: string;
  agent: { name: string; referrerCode: string } | null;
};

type PageResponse = { items: Item[]; totalCount: number };

const PAGE_SIZE = 25;

type SubmissionsTableProps = {
  cycleId: string | null;
};

export function SubmissionsTable({ cycleId }: SubmissionsTableProps) {
  const [items, setItems] = useState<Item[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showFlagged, setShowFlagged] = useState(false);

  const filtered = useMemo(
    () => (showFlagged ? items : items.filter((i) => !i.isFlagged)),
    [items, showFlagged]
  );

  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

  const load = useCallback(
    async (pageNum: number) => {
      setError(null);
      setLoading(true);
      const url = new URL(window.location.origin + "/api/admin/submissions");
      url.searchParams.set("take", String(PAGE_SIZE));
      url.searchParams.set("page", String(pageNum));
      if (cycleId) url.searchParams.set("cycleId", cycleId);
      const res = await fetch(url.toString());
      setLoading(false);
      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as { error?: string } | null;
        setError(data?.error ?? "Failed to load.");
        return;
      }
      const data = (await res.json()) as PageResponse;
      setItems(data.items);
      setTotalCount(data.totalCount);
    },
    [cycleId]
  );

  useEffect(() => {
    setPage(1);
    void load(1);
  }, [cycleId, load]);

  useEffect(() => {
    if (page > 1) void load(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  async function toggleFlag(id: string, flagged: boolean) {
    setError(null);
    const res = await fetch(`/api/admin/submissions/${id}/flag`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ flagged }),
    });
    if (!res.ok) {
      const data = (await res.json().catch(() => null)) as { error?: string } | null;
      setError(data?.error ?? "Update failed.");
      return;
    }
    setItems((prev) => prev.map((x) => (x.id === id ? { ...x, isFlagged: flagged } : x)));
  }

  const exportHref = cycleId
    ? `/api/admin/submissions/export?cycleId=${encodeURIComponent(cycleId)}`
    : "/api/admin/submissions/export";

  const goToPage = (p: number) => {
    const next = Math.max(1, Math.min(p, totalPages));
    setPage(next);
  };

  return (
    <div className="admin-card md:p-8">
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {loading
          ? "Loading submissions..."
          : error
            ? `Error: ${error}`
            : `${filtered.length} submissions loaded`}
      </div>

      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-[color:var(--nsi-rule)] pb-4">
        <div className="flex items-center gap-4">
          <div className="font-mono text-xs font-bold uppercase tracking-[0.14em] text-[color:var(--nsi-ink)]">
            <span className="tabular-nums text-[color:var(--nsi-green)]">{filtered.length}</span> entries displayed
            {showFlagged && items.filter((i) => i.isFlagged).length > 0 && (
              <span className="ml-2 text-[color:var(--nsi-terracotta)]">
                ({items.filter((i) => i.isFlagged).length} flagged)
              </span>
            )}
          </div>
          <label className="inline-flex cursor-pointer items-center gap-2 font-mono text-xs text-[color:var(--nsi-ink-soft)]">
            <input
              type="checkbox"
              className="h-4 w-4 rounded-[2px] border-[color:var(--nsi-rule-strong)] accent-[color:var(--nsi-green)]"
              checked={showFlagged}
              onChange={(e) => setShowFlagged(e.target.checked)}
            />
            Show Flagged
          </label>
        </div>
        <a href={exportHref} download className="admin-btn-secondary">
          Export Clean CSV
        </a>
      </div>

      {error && (
        <div
          role="alert"
          className="mt-4 rounded-[3px] border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-900"
        >
          {error}
        </div>
      )}

      <div
        role="region"
        aria-label="Submissions data table"
        className="mt-4 overflow-x-auto"
      >
        <table className="w-full border-collapse text-left text-sm">
          <caption className="sr-only">
            List of submissions for the current cycle. Use the flag button to
            mark entries for review.
          </caption>
          <thead>
            <tr className="border-b-2 border-[color:var(--nsi-rule-strong)] font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-[color:var(--nsi-ink-muted)]">
              <th scope="col" className="px-3 py-3">
                Timestamp
              </th>
              <th scope="col" className="px-3 py-3">
                Score
              </th>
              <th scope="col" className="px-3 py-3">
                Agent
              </th>
              <th scope="col" className="px-3 py-3 max-w-[10rem]">
                Device
              </th>
              {PILLARS.map((p) => (
                <th key={p.key} scope="col" className="px-3 py-3">
                  {p.label}
                </th>
              ))}
              <th scope="col" className="px-3 py-3">
                Mood
              </th>
              <th scope="col" className="px-3 py-3">
                One Word
              </th>
              <th scope="col" className="px-3 py-3">
                Spotlight
              </th>
              <th scope="col" className="px-3 py-3">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[color:var(--nsi-rule)]">
            {filtered.map((s) => (
              <tr
                key={s.id}
                className={`text-sm transition-colors ${
                  s.isFlagged
                    ? "bg-amber-50/80"
                    : "hover:bg-[color:var(--nsi-paper)]"
                }`}
              >
                <td className="whitespace-nowrap px-3 py-3.5 font-mono text-xs text-[color:var(--nsi-ink-soft)]">
                  <time dateTime={s.createdAt}>
                    {new Date(s.createdAt).toLocaleString("en-NG", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </time>
                </td>
                <td className="px-3 py-3.5">
                  {s.stabilityScore != null ? (
                    <span className="inline-flex h-7 w-7 items-center justify-center rounded-[2px] border border-[color:var(--nsi-green)]/25 bg-[color:var(--nsi-green)]/10 font-mono text-xs font-bold text-[color:var(--nsi-green)]">
                      {s.stabilityScore}
                    </span>
                  ) : (
                    <span className="text-black/40">—</span>
                  )}
                </td>
                <td className="max-w-[8rem] px-3 py-3.5 text-xs">
                  {s.agent ? (
                    <div>
                      <div className="font-semibold leading-tight">{s.agent.name}</div>
                      <div className="font-mono text-[11px] text-[color:var(--nsi-ink-muted)]">{s.agent.referrerCode}</div>
                    </div>
                  ) : (
                    <span className="text-black/40">—</span>
                  )}
                </td>
                <td className="max-w-[10rem] px-3 py-3.5 font-mono text-[11px] leading-snug text-[color:var(--nsi-ink-muted)]">
                  {formatDeviceInfoSummary(s.deviceInfo)}
                </td>
                {PILLARS.map((p) => (
                  <td key={p.key} className="px-3 py-3.5 font-mono text-xs font-bold">
                    {s.pillarResponses?.[p.key] != null ? (
                      <span>{s.pillarResponses[p.key]}</span>
                    ) : (
                      <span className="text-black/40">—</span>
                    )}
                  </td>
                ))}
                <td className="px-3 py-3.5">{s.mood ?? "—"}</td>
                <td className="px-3 py-3.5 font-semibold">{s.oneWord ?? "—"}</td>
                <td className="px-3 py-3.5">
                  {s.spotlightState ? (
                    <div>
                      <div className="font-semibold">{s.spotlightState}</div>
                      <div className="line-clamp-1 text-xs text-[color:var(--nsi-ink-soft)]">
                        {[...s.spotlightTags, s.spotlightComment ?? ""]
                          .filter(Boolean)
                          .join(" · ")}
                      </div>
                    </div>
                  ) : (
                    <span className="text-black/40">—</span>
                  )}
                </td>
                <td className="px-3 py-3.5">
                  <button
                    type="button"
                    className={`rounded-[2px] px-2.5 py-1 font-mono text-[11px] font-bold uppercase tracking-wider transition-colors ${
                      s.isFlagged
                        ? "border border-[color:var(--nsi-rule-strong)] bg-white text-[color:var(--nsi-ink)] hover:bg-[color:var(--nsi-paper)]"
                        : "bg-[color:var(--nsi-green)] text-white hover:bg-[color:var(--nsi-green-deep)]"
                    }`}
                    onClick={() => void toggleFlag(s.id, !s.isFlagged)}
                    aria-label={
                      s.isFlagged
                        ? `Remove flag from submission from ${s.spotlightState || "unknown state"}`
                        : `Flag submission from ${s.spotlightState || "unknown state"}`
                    }
                  >
                    {s.isFlagged ? "Unflag" : "Flag"}
                  </button>
                </td>
              </tr>
            ))}
            {!filtered.length && !loading && (
              <tr>
                <td
                  className="px-4 py-12 text-center font-mono text-xs uppercase tracking-[0.16em] text-[color:var(--nsi-ink-muted)]"
                  colSpan={8 + PILLARS.length}
                >
                  No field submissions recorded for this view.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-[color:var(--nsi-rule)] pt-6">
        <button
          className="admin-btn-secondary"
          type="button"
          onClick={() => void load(page)}
          disabled={loading}
          aria-label="Refresh submissions list"
        >
          {loading ? "Refreshing…" : "Refresh Ledger"}
        </button>
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs text-[color:var(--nsi-ink-soft)]">
            Page <span className="font-bold tabular-nums">{page}</span> of{" "}
            <span className="font-bold tabular-nums">{totalPages}</span>
          </span>
          <div className="flex gap-1">
            <button
              type="button"
              className="admin-btn-secondary px-3 py-1.5 text-xs"
              onClick={() => goToPage(1)}
              disabled={loading || page <= 1}
              aria-label="First page"
            >
              First
            </button>
            <button
              type="button"
              className="admin-btn-secondary px-3 py-1.5 text-xs"
              onClick={() => goToPage(page - 1)}
              disabled={loading || page <= 1}
              aria-label="Previous page"
            >
              Prev
            </button>
            <button
              type="button"
              className="admin-btn-secondary px-3 py-1.5 text-xs"
              onClick={() => goToPage(page + 1)}
              disabled={loading || page >= totalPages}
              aria-label="Next page"
            >
              Next
            </button>
            <button
              type="button"
              className="admin-btn-secondary px-3 py-1.5 text-xs"
              onClick={() => goToPage(totalPages)}
              disabled={loading || page >= totalPages}
              aria-label="Last page"
            >
              Last
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
