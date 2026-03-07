"use client";

import { useEffect, useState } from "react";
import { PILLARS, MOODS } from "@/lib/constants";

type AnalyticsData = {
  overallAvgScore: number | null;
  avgPerPillar: Record<string, number>;
  moodDistribution: Record<string, number>;
  oneWordCounts: { word: string; count: number }[];
  spotlightByState: Record<string, number>;
  spotlightByTag: Record<string, number>;
};

type SubmissionsAnalyticsProps = {
  cycleId: string | null;
};

export function SubmissionsAnalytics({ cycleId }: SubmissionsAnalyticsProps) {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!cycleId) {
      setData(null);
      setError(null);
      return;
    }
    let cancelled = false;
    setError(null);
    setLoading(true);
    fetch(`/api/admin/submissions/analytics?cycleId=${encodeURIComponent(cycleId)}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load analytics.");
        return res.json();
      })
      .then((json: AnalyticsData) => {
        if (!cancelled) setData(json);
      })
      .catch((e) => {
        if (!cancelled) setError(e instanceof Error ? e.message : "Failed to load analytics.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [cycleId]);

  if (!cycleId) {
    return (
      <div className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm md:p-8">
        <p className="text-sm text-black/60">Select a cycle to view analytics.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm md:p-8">
        <div className="flex items-center gap-2 text-sm text-black/60">
          <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-black/20 border-t-black/70" />
          Loading analytics…
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm md:p-8">
        <div
          role="alert"
          className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
        >
          {error}
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm md:p-8">
        <p className="text-sm text-black/60">No analytics data.</p>
      </div>
    );
  }

  const hasAny =
    data.overallAvgScore != null ||
    Object.values(data.avgPerPillar).some((v) => v > 0) ||
    Object.keys(data.moodDistribution).length > 0 ||
    data.oneWordCounts.length > 0 ||
    Object.keys(data.spotlightByState).length > 0 ||
    Object.keys(data.spotlightByTag).length > 0;

  if (!hasAny) {
    return (
      <div className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm md:p-8">
        <p className="text-sm text-black/60">No submissions for this cycle.</p>
      </div>
    );
  }

  const moodEntries = MOODS.map((m) => ({ mood: m, count: data.moodDistribution[m] ?? 0 })).filter(
    (e) => e.count > 0
  );
  if (moodEntries.length === 0) {
    Object.entries(data.moodDistribution).forEach(([mood, count]) => {
      if (!MOODS.includes(mood as (typeof MOODS)[number])) moodEntries.push({ mood, count });
    });
  }
  moodEntries.sort((a, b) => b.count - a.count);

  const stateEntries = Object.entries(data.spotlightByState)
    .filter(([, c]) => c > 0)
    .sort((a, b) => b[1] - a[1]);
  const tagEntries = Object.entries(data.spotlightByTag)
    .filter(([, c]) => c > 0)
    .sort((a, b) => b[1] - a[1]);

  return (
    <div className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm md:p-8">
      <div className="space-y-8">
        {/* Overall average score */}
        <section>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-black/60">
            Overall average score
          </h3>
          <p className="mt-2 text-3xl font-semibold text-[color:var(--nsi-green)]">
            {data.overallAvgScore != null
              ? data.overallAvgScore.toFixed(2)
              : "—"}
          </p>
        </section>

        {/* Average per pillar */}
        <section>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-black/60">
            Average score per pillar
          </h3>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {PILLARS.map((p) => (
              <li
                key={p.key}
                className="flex items-center justify-between rounded-xl bg-[color:var(--nsi-paper)] px-4 py-3"
              >
                <span className="text-sm font-medium text-black/80">{p.label}</span>
                <span className="tabular-nums font-semibold text-[color:var(--nsi-green)]">
                  {(data.avgPerPillar[p.key] ?? 0) > 0
                    ? (data.avgPerPillar[p.key] ?? 0).toFixed(2)
                    : "—"}
                </span>
              </li>
            ))}
          </ul>
        </section>

        {/* Mood */}
        <section>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-black/60">
            Mood
          </h3>
          {moodEntries.length === 0 ? (
            <p className="mt-2 text-sm text-black/50">No mood data.</p>
          ) : (
            <ul className="mt-3 space-y-2">
              {moodEntries.map(({ mood, count }) => (
                <li
                  key={mood}
                  className="flex items-center justify-between rounded-xl bg-[color:var(--nsi-paper)] px-4 py-2"
                >
                  <span className="text-sm font-medium">{mood}</span>
                  <span className="tabular-nums text-sm text-black/60">{count}</span>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* One word */}
        <section>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-black/60">
            One word
          </h3>
          {data.oneWordCounts.length === 0 ? (
            <p className="mt-2 text-sm text-black/50">No one-word data.</p>
          ) : (
            <ul className="mt-3 flex flex-wrap gap-2">
              {data.oneWordCounts.slice(0, 30).map(({ word, count }) => (
                <li
                  key={word}
                  className="rounded-lg bg-[color:var(--nsi-paper)] px-3 py-1.5 text-sm"
                >
                  <span className="font-medium">{word}</span>
                  <span className="ml-1.5 tabular-nums text-black/60">({count})</span>
                </li>
              ))}
              {data.oneWordCounts.length > 30 && (
                <li className="text-sm text-black/50">
                  +{data.oneWordCounts.length - 30} more
                </li>
              )}
            </ul>
          )}
        </section>

        {/* Spotlight by state */}
        <section>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-black/60">
            Spotlight by state
          </h3>
          {stateEntries.length === 0 ? (
            <p className="mt-2 text-sm text-black/50">No spotlight state data.</p>
          ) : (
            <ul className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {stateEntries.map(([state, count]) => (
                <li
                  key={state}
                  className="flex items-center justify-between rounded-xl bg-[color:var(--nsi-paper)] px-4 py-2"
                >
                  <span className="text-sm font-medium">{state}</span>
                  <span className="tabular-nums text-sm text-black/60">{count}</span>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Spotlight by tag */}
        <section>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-black/60">
            Spotlight by tag
          </h3>
          {tagEntries.length === 0 ? (
            <p className="mt-2 text-sm text-black/50">No spotlight tag data.</p>
          ) : (
            <ul className="mt-3 flex flex-wrap gap-2">
              {tagEntries.map(([tag, count]) => (
                <li
                  key={tag}
                  className="rounded-lg bg-[color:var(--nsi-paper)] px-3 py-1.5 text-sm"
                >
                  <span className="font-medium">{tag}</span>
                  <span className="ml-1.5 tabular-nums text-black/60">({count})</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
