"use client";

import { useEffect, useMemo, useState } from "react";

type Item = {
  id: string;
  createdAt: string;
  stabilityScore: number;
  mood: string;
  oneWord: string;
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
    <div className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="text-sm font-medium text-black/70">{filtered.length} entries</div>
        <label className="inline-flex items-center gap-2 text-sm text-black/70">
          <input
            type="checkbox"
            className="accent-[color:var(--nsi-green)]"
            checked={showFlagged}
            onChange={(e) => setShowFlagged(e.target.checked)}
          />
          Show flagged
        </label>
      </div>

      {error ? (
        <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {error}
        </div>
      ) : null}

      <div className="mt-5 overflow-x-auto">
        <table className="w-full border-separate border-spacing-y-2">
          <thead>
            <tr className="text-left text-xs font-medium text-black/60">
              <th className="px-3 py-2">When</th>
              <th className="px-3 py-2">Score</th>
              <th className="px-3 py-2">Mood</th>
              <th className="px-3 py-2">One word</th>
              <th className="px-3 py-2">Spotlight</th>
              <th className="px-3 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((s) => (
              <tr key={s.id} className="rounded-2xl bg-[color:var(--nsi-paper)] text-sm">
                <td className="px-3 py-3 whitespace-nowrap">
                  {new Date(s.createdAt).toLocaleString("en-NG")}
                </td>
                <td className="px-3 py-3 font-semibold text-[color:var(--nsi-green)]">{s.stabilityScore}</td>
                <td className="px-3 py-3">{s.mood}</td>
                <td className="px-3 py-3">{s.oneWord}</td>
                <td className="px-3 py-3">
                  {s.spotlightState ? (
                    <div>
                      <div className="font-medium">{s.spotlightState}</div>
                      <div className="text-xs text-black/60 line-clamp-1">
                        {[...s.spotlightTags, s.spotlightComment ?? ""].filter(Boolean).join(" · ")}
                      </div>
                    </div>
                  ) : (
                    <span className="text-black/50">—</span>
                  )}
                </td>
                <td className="px-3 py-3">
                  <button
                    type="button"
                    className={[
                      "rounded-xl px-3 py-1.5 text-xs font-medium",
                      s.isFlagged
                        ? "border border-black/15 bg-white hover:bg-black/[.03]"
                        : "bg-[color:var(--nsi-green)] text-white hover:opacity-95",
                    ].join(" ")}
                    onClick={() => void toggleFlag(s.id, !s.isFlagged)}
                  >
                    {s.isFlagged ? "Unflag" : "Flag"}
                  </button>
                </td>
              </tr>
            ))}
            {!filtered.length && !loading ? (
              <tr>
                <td className="px-3 py-6 text-sm text-black/60" colSpan={6}>
                  No submissions yet.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      <div className="mt-5 flex items-center justify-between">
        <button
          className="rounded-xl border border-black/15 bg-white px-4 py-2 text-sm font-medium hover:bg-black/[.03] disabled:opacity-60"
          type="button"
          onClick={() => void load(null)}
          disabled={loading}
        >
          Refresh
        </button>
        <button
          className="rounded-xl bg-[color:var(--nsi-green)] px-4 py-2 text-sm font-medium text-white hover:opacity-95 disabled:opacity-60"
          type="button"
          onClick={() => void load(nextCursor)}
          disabled={loading || !nextCursor}
        >
          {loading ? "Loading…" : nextCursor ? "Load more" : "No more"}
        </button>
      </div>
    </div>
  );
}

