"use client";

import { useEffect, useMemo, useState } from "react";
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
  isFlagged: boolean;
  cycleId: string;
};

type Page = { items: Item[]; nextCursor: string | null };

export function SubmissionsTable() {
  const [items, setItems] = useState<Item[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showFlagged, setShowFlagged] = useState(false);

  const filtered = useMemo(
    () => (showFlagged ? items : items.filter((i) => !i.isFlagged)),
    [items, showFlagged]
  );

  async function load(cursor?: string | null) {
    setError(null);
    setLoading(true);
    const url = new URL(window.location.origin + "/api/admin/submissions");
    url.searchParams.set("take", "25");
    if (cursor) url.searchParams.set("cursor", cursor);
    const res = await fetch(url.toString());
    setLoading(false);
    if (!res.ok) {
      const data = (await res.json().catch(() => null)) as { error?: string } | null;
      setError(data?.error ?? "Failed to load.");
      return;
    }
    const data = (await res.json()) as Page;
    setItems((prev) => (cursor ? [...prev, ...data.items] : data.items));
    setNextCursor(data.nextCursor);
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load(null);
  }, []);

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

  return (
    <div className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm md:p-8">
      {/* Live region for screen reader announcements */}
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {loading
          ? "Loading submissions..."
          : error
            ? `Error: ${error}`
            : `${filtered.length} submissions loaded`}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="text-sm font-medium text-black/70">
          <span className="tabular-nums">{filtered.length}</span> entries
          {showFlagged && items.filter((i) => i.isFlagged).length > 0 && (
            <span className="ml-2 text-black/50">
              ({items.filter((i) => i.isFlagged).length} flagged)
            </span>
          )}
        </div>
        <label className="inline-flex cursor-pointer items-center gap-2 text-sm text-black/70">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-black/20 accent-[color:var(--nsi-green)] focus:ring-2 focus:ring-[color:var(--nsi-gold)] focus:ring-offset-2"
            checked={showFlagged}
            onChange={(e) => setShowFlagged(e.target.checked)}
          />
          Show flagged
        </label>
      </div>

      {error && (
        <div
          role="alert"
          className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
        >
          {error}
        </div>
      )}

      <div
        role="region"
        aria-label="Submissions data table"
        className="mt-6 overflow-x-auto"
      >
        <table className="w-full border-separate border-spacing-y-2">
          <caption className="sr-only">
            List of submissions for the current cycle. Use the flag button to
            mark entries for review.
          </caption>
          <thead>
            <tr className="text-left text-xs font-semibold uppercase tracking-wide text-black/60">
              <th scope="col" className="px-4 py-3">
                When
              </th>
              <th scope="col" className="px-4 py-3">
                Score
              </th>
              {PILLARS.map((p) => (
                <th key={p.key} scope="col" className="px-4 py-3">
                  {p.label}
                </th>
              ))}
              <th scope="col" className="px-4 py-3">
                Mood
              </th>
              <th scope="col" className="px-4 py-3">
                One word
              </th>
              <th scope="col" className="px-4 py-3">
                Spotlight
              </th>
              <th scope="col" className="px-4 py-3">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((s) => (
              <tr
                key={s.id}
                className={`rounded-2xl text-sm transition-colors ${
                  s.isFlagged
                    ? "bg-amber-50"
                    : "bg-[color:var(--nsi-paper)] hover:bg-[color:var(--nsi-paper-2)]"
                }`}
              >
                <td className="whitespace-nowrap px-4 py-4">
                  <time dateTime={s.createdAt}>
                    {new Date(s.createdAt).toLocaleString("en-NG", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </time>
                </td>
                <td className="px-4 py-4">
                  {s.stabilityScore != null ? (
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[color:var(--nsi-green)]/10 font-semibold text-[color:var(--nsi-green)]">
                      {s.stabilityScore}
                    </span>
                  ) : (
                    <span className="text-black/40">—</span>
                  )}
                </td>
                {PILLARS.map((p) => (
                  <td key={p.key} className="px-4 py-4">
                    {s.pillarResponses?.[p.key] != null ? (
                      <span className="font-medium">{s.pillarResponses[p.key]}</span>
                    ) : (
                      <span className="text-black/40">—</span>
                    )}
                  </td>
                ))}
                <td className="px-4 py-4">{s.mood ?? "—"}</td>
                <td className="px-4 py-4 font-medium">{s.oneWord ?? "—"}</td>
                <td className="px-4 py-4">
                  {s.spotlightState ? (
                    <div>
                      <div className="font-medium">{s.spotlightState}</div>
                      <div className="line-clamp-1 text-xs text-black/60">
                        {[...s.spotlightTags, s.spotlightComment ?? ""]
                          .filter(Boolean)
                          .join(" · ")}
                      </div>
                    </div>
                  ) : (
                    <span className="text-black/40">—</span>
                  )}
                </td>
                <td className="px-4 py-4">
                  <button
                    type="button"
                    className={`rounded-xl px-3 py-1.5 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--nsi-gold)] focus-visible:ring-offset-2 ${
                      s.isFlagged
                        ? "border border-black/15 bg-white text-black/70 hover:bg-black/[.03]"
                        : "bg-[color:var(--nsi-green)] text-white hover:brightness-110"
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
                  className="px-4 py-12 text-center text-sm text-black/60"
                  colSpan={6 + PILLARS.length}
                >
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-3xl">📭</span>
                    <span>No submissions yet.</span>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-black/5 pt-6">
        <button
          className="inline-flex items-center gap-2 rounded-xl border border-black/15 bg-white px-4 py-2.5 text-sm font-medium transition-colors hover:bg-black/[.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--nsi-gold)] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
          type="button"
          onClick={() => void load(null)}
          disabled={loading}
          aria-label="Refresh submissions list"
        >
          {loading ? (
            <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-black/20 border-t-black/70" />
          ) : null}
          Refresh
        </button>
        <button
          className="inline-flex items-center gap-2 rounded-xl bg-[color:var(--nsi-green)] px-4 py-2.5 text-sm font-medium text-white shadow-md transition-colors hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--nsi-gold)] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
          type="button"
          onClick={() => void load(nextCursor)}
          disabled={loading || !nextCursor}
          aria-label={nextCursor ? "Load more submissions" : "All submissions loaded"}
        >
          {loading ? (
            <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
          ) : null}
          {loading ? "Loading…" : nextCursor ? "Load more" : "All loaded"}
        </button>
      </div>
    </div>
  );
}
