"use client";

import { NIGERIAN_STATES } from "@/lib/constants";
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
  cycleId: string;
};

export function SpotlightFeed() {
  const [stateFilter, setStateFilter] = useState<string>("");
  const [items, setItems] = useState<Item[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const label = useMemo(() => (stateFilter ? stateFilter : "All states"), [stateFilter]);

  async function load(cursor?: string | null) {
    setError(null);
    setLoading(true);
    const url = new URL(window.location.origin + "/api/admin/spotlight");
    url.searchParams.set("take", "60");
    if (stateFilter) url.searchParams.set("state", stateFilter);
    if (cursor) url.searchParams.set("cursor", cursor);
    const res = await fetch(url.toString());
    setLoading(false);
    if (!res.ok) {
      const data = (await res.json().catch(() => null)) as { error?: string } | null;
      setError(data?.error ?? "Failed to load.");
      return;
    }
    const data = (await res.json()) as { items: Item[]; nextCursor: string | null };
    setItems((prev) => (cursor ? [...prev, ...data.items] : data.items));
    setNextCursor(data.nextCursor);
  }

  useEffect(() => {
    void load(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stateFilter]);

  return (
    <div className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <label className="block">
          <div className="text-xs font-medium text-black/60">Filter by state</div>
          <select
            className="mt-1 w-64 max-w-full rounded-xl border border-black/10 bg-white px-4 py-2.5 outline-none focus:border-[color:var(--nsi-green)]"
            value={stateFilter}
            onChange={(e) => setStateFilter(e.target.value)}
          >
            <option value="">All states</option>
            {NIGERIAN_STATES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>

        <div className="text-sm font-medium text-black/70">
          {loading ? "Loading…" : `${items.length} spotlight entries`}{" "}
          <span className="text-black/50">({label})</span>
        </div>
      </div>

      {error ? (
        <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {error}
        </div>
      ) : null}

      <div className="mt-6 space-y-3">
        {items.map((i) => (
          <div key={i.id} className="rounded-2xl border border-black/10 bg-[color:var(--nsi-paper)] p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="text-sm font-medium text-black">
                {i.spotlightState ?? "—"}{" "}
                <span className="text-black/50">·</span>{" "}
                <span className="text-black/70">{new Date(i.createdAt).toLocaleString("en-NG")}</span>
              </div>
              <div className="rounded-full border border-black/10 bg-white px-3 py-1 text-xs">
                Score: <span className="font-semibold text-[color:var(--nsi-green)]">{i.stabilityScore}</span>
              </div>
            </div>
            <div className="mt-3 text-sm text-black/70">
              <span className="font-medium text-black/80">{i.oneWord}</span> · {i.mood}
            </div>
            {i.spotlightTags.length ? (
              <div className="mt-3 flex flex-wrap gap-2">
                {i.spotlightTags.map((t) => (
                  <span key={t} className="rounded-full border border-black/10 bg-white px-3 py-1 text-xs">
                    {t}
                  </span>
                ))}
              </div>
            ) : null}
            {i.spotlightComment ? (
              <div className="mt-3 text-sm leading-6 text-black/70">{i.spotlightComment}</div>
            ) : null}
          </div>
        ))}

        {!items.length && !loading ? (
          <div className="rounded-2xl border border-black/10 bg-white px-5 py-6 text-sm text-black/60">
            No spotlight entries found.
          </div>
        ) : null}
      </div>

      <div className="mt-6 flex items-center justify-between">
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

