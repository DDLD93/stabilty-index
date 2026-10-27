"use client";

import { NIGERIAN_STATES } from "@/lib/constants";
import { useCallback, useEffect, useMemo, useState } from "react";
import { CycleFilter } from "./CycleFilter";

type Item = {
  id: string;
  createdAt: string;
  stabilityScore: number | null;
  mood: string | null;
  oneWord: string | null;
  spotlightState: string | null;
  spotlightTags: string[];
  spotlightComment: string | null;
  cycleId: string;
};

export function SpotlightFeed() {
  const [stateFilter, setStateFilter] = useState<string>("");
  const [cycleId, setCycleId] = useState<string | null>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const label = useMemo(
    () => (stateFilter ? stateFilter : "All states"),
    [stateFilter]
  );

  const load = useCallback(
    async (cursor?: string | null) => {
      setError(null);
      setLoading(true);
      const url = new URL(window.location.origin + "/api/admin/spotlight");
      url.searchParams.set("take", "60");
      if (stateFilter) url.searchParams.set("state", stateFilter);
      if (cursor) url.searchParams.set("cursor", cursor);
      if (cycleId) url.searchParams.set("cycleId", cycleId);
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
    },
    [stateFilter, cycleId]
  );

  useEffect(() => {
    void load(null);
  }, [load]);

  return (
    <div className="admin-card md:p-8">
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {loading
          ? "Loading spotlight entries..."
          : error
            ? `Error: ${error}`
            : `${items.length} spotlight entries loaded for ${label}`}
      </div>

      <div className="mb-6 flex flex-wrap items-end gap-4">
        <CycleFilter
          value={cycleId}
          onChange={(id) => {
            setCycleId(id);
            setItems([]);
            setNextCursor(null);
          }}
          showAllOption={false}
          id="spotlight-cycle-filter"
        />
      </div>

      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-[color:var(--nsi-rule)] pb-5">
        <div className="w-full sm:w-auto">
          <label htmlFor="state-filter" className="block">
            <span className="font-mono text-xs font-bold uppercase tracking-[0.14em] text-[color:var(--nsi-ink-muted)]">
              Filter by State / Territory
            </span>
            <select
              id="state-filter"
              className="admin-select mt-1.5 w-full sm:w-72"
              value={stateFilter}
              onChange={(e) => setStateFilter(e.target.value)}
            >
              <option value="">All 36 States & FCT</option>
              {NIGERIAN_STATES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-[0.14em] text-[color:var(--nsi-ink)]">
          <span className="tabular-nums text-[color:var(--nsi-green)]">{items.length}</span> spotlight entries
          <span className="text-[color:var(--nsi-ink-muted)]">({label})</span>
        </div>
      </div>

      {error && (
        <div
          role="alert"
          className="mt-6 rounded-[3px] border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-900"
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
            className="rounded-[3px] border border-[color:var(--nsi-rule-strong)] bg-[color:var(--nsi-paper)] p-5 transition-colors hover:bg-white"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="text-sm text-[color:var(--nsi-ink)]">
                <span className="font-serif font-bold">
                  {item.spotlightState ?? "Unspecified State"}
                </span>
                <span className="mx-2 text-black/30">·</span>
                <time
                  dateTime={item.createdAt}
                  className="font-mono text-xs text-[color:var(--nsi-ink-muted)]"
                >
                  {new Date(item.createdAt).toLocaleString("en-NG", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </time>
              </div>
              <div className="inline-flex items-center gap-1.5 rounded-[2px] border border-[color:var(--nsi-rule-strong)] bg-white px-2.5 py-1 font-mono text-xs">
                <span className="text-[color:var(--nsi-ink-muted)]">Score:</span>
                <span className="font-bold text-[color:var(--nsi-green)]">
                  {item.stabilityScore ?? "—"}
                </span>
              </div>
            </div>

            <div className="mt-2.5 text-sm text-[color:var(--nsi-ink-soft)]">
              <span className="font-semibold text-[color:var(--nsi-ink)]">{item.oneWord ?? "—"}</span>
              <span className="mx-2 text-black/30">·</span>
              <span>{item.mood ?? "—"}</span>
            </div>

            {item.spotlightTags.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {item.spotlightTags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-[2px] border border-[color:var(--nsi-green)]/25 bg-[color:var(--nsi-green)]/5 px-2.5 py-0.5 font-mono text-[11px] font-semibold text-[color:var(--nsi-green)]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {item.spotlightComment && (
              <blockquote className="mt-4 border-l-2 border-[color:var(--nsi-gold)] pl-4 font-serif text-sm italic leading-relaxed text-[color:var(--nsi-ink)]">
                &ldquo;{item.spotlightComment}&rdquo;
              </blockquote>
            )}
          </article>
        ))}

        {!items.length && !loading && (
          <div className="rounded-[3px] border border-[color:var(--nsi-rule)] bg-white px-5 py-12 text-center font-mono text-xs uppercase tracking-[0.16em] text-[color:var(--nsi-ink-muted)]">
            No citizen spotlight entries found for {label}.
          </div>
        )}
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-[color:var(--nsi-rule)] pt-6">
        <button
          className="admin-btn-secondary"
          type="button"
          onClick={() => void load(null)}
          disabled={loading}
          aria-label="Refresh spotlight entries"
        >
          {loading ? "Refreshing…" : "Refresh Feed"}
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
          {loading ? "Loading…" : nextCursor ? "Load More Entries" : "All Entries Loaded"}
        </button>
      </div>
    </div>
  );
}
