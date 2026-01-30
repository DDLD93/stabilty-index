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

  const label = useMemo(
    () => (stateFilter ? stateFilter : "All states"),
    [stateFilter]
  );

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
      const data = (await res.json().catch(() => null)) as {
        error?: string;
      } | null;
      setError(data?.error ?? "Failed to load.");
      return;
    }
    const data = (await res.json()) as {
      items: Item[];
      nextCursor: string | null;
    };
    setItems((prev) => (cursor ? [...prev, ...data.items] : data.items));
    setNextCursor(data.nextCursor);
  }

  useEffect(() => {
    void load(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stateFilter]);

  return (
    <div className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm md:p-8">
      {/* Live region for screen reader announcements */}
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {loading
          ? "Loading spotlight entries..."
          : error
            ? `Error: ${error}`
            : `${items.length} spotlight entries loaded for ${label}`}
      </div>

      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="w-full sm:w-auto">
          <label htmlFor="state-filter" className="block">
            <span className="text-xs font-semibold uppercase tracking-wide text-black/60">
              Filter by state
            </span>
            <select
              id="state-filter"
              className="admin-select mt-2 w-full sm:w-72"
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
        </div>

        <div className="flex items-center gap-2 text-sm font-medium text-black/70">
          {loading && (
            <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-black/20 border-t-black/70" />
          )}
          <span className="tabular-nums">{items.length}</span> spotlight entries
          <span className="text-black/50">({label})</span>
        </div>
      </div>

      {error && (
        <div
          role="alert"
          className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
        >
          {error}
        </div>
      )}

      <div
        role="feed"
        aria-label="Spotlight entries"
        aria-busy={loading}
        className="mt-6 space-y-4"
      >
        {items.map((item, index) => (
          <article
            key={item.id}
            aria-posinset={index + 1}
            aria-setsize={items.length}
            className="rounded-2xl border border-black/10 bg-[color:var(--nsi-paper)] p-5 transition-colors hover:border-black/15 hover:bg-[color:var(--nsi-paper-2)]"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="text-sm font-medium text-black">
                <span className="font-semibold">
                  {item.spotlightState ?? "Unknown state"}
                </span>
                <span className="mx-2 text-black/30">·</span>
                <time
                  dateTime={item.createdAt}
                  className="text-black/60"
                >
                  {new Date(item.createdAt).toLocaleString("en-NG", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </time>
              </div>
              <div className="inline-flex items-center gap-1.5 rounded-full border border-black/10 bg-white px-3 py-1 text-xs">
                <span className="text-black/60">Score:</span>
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[color:var(--nsi-green)]/10 font-semibold text-[color:var(--nsi-green)]">
                  {item.stabilityScore}
                </span>
              </div>
            </div>

            <div className="mt-3 text-sm text-black/70">
              <span className="font-semibold text-black">{item.oneWord}</span>
              <span className="mx-2 text-black/30">·</span>
              <span>{item.mood}</span>
            </div>

            {item.spotlightTags.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {item.spotlightTags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-[color:var(--nsi-green)]/20 bg-[color:var(--nsi-green)]/5 px-3 py-1 text-xs font-medium text-[color:var(--nsi-green)]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {item.spotlightComment && (
              <blockquote className="mt-4 border-l-2 border-[color:var(--nsi-green)]/30 pl-4 text-sm leading-relaxed text-black/70">
                {item.spotlightComment}
              </blockquote>
            )}
          </article>
        ))}

        {!items.length && !loading && (
          <div className="rounded-2xl border border-black/10 bg-white px-5 py-12 text-center text-sm text-black/60">
            <div className="flex flex-col items-center gap-2">
              <span className="text-3xl">✨</span>
              <span>No spotlight entries found for {label}.</span>
            </div>
          </div>
        )}
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-black/5 pt-6">
        <button
          className="admin-btn-secondary"
          type="button"
          onClick={() => void load(null)}
          disabled={loading}
          aria-label="Refresh spotlight entries"
        >
          {loading && (
            <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-black/20 border-t-black/70" />
          )}
          Refresh
        </button>
        <button
          className="admin-btn-primary"
          type="button"
          onClick={() => void load(nextCursor)}
          disabled={loading || !nextCursor}
          aria-label={
            nextCursor ? "Load more spotlight entries" : "All entries loaded"
          }
        >
          {loading && (
            <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
          )}
          {loading ? "Loading…" : nextCursor ? "Load more" : "All loaded"}
        </button>
      </div>
    </div>
  );
}
