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
  submissionCount?: number;
  avgScoreByMood?: Record<string, number>;
  avgScoreByState?: Record<string, number>;
  scoreDistribution?: Record<string, number>;
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
      <div className="admin-card md:p-8">
        <p className="text-sm text-[color:var(--nsi-ink-soft)]">Select a cycle to view statistical breakdown.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="admin-card md:p-8">
        <p className="font-mono text-xs uppercase tracking-[0.16em] text-[color:var(--nsi-ink-muted)]">
          Computing cycle analytics…
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-card md:p-8">
        <div
          role="alert"
          className="rounded-[3px] border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-900"
        >
          {error}
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="admin-card md:p-8">
        <p className="text-sm text-[color:var(--nsi-ink-soft)]">No analytics data available.</p>
      </div>
    );
  }

  const hasAny =
    data.overallAvgScore != null ||
    Object.values(data.avgPerPillar).some((v) => v > 0) ||
    Object.keys(data.moodDistribution).length > 0 ||
    data.oneWordCounts.length > 0 ||
    Object.keys(data.spotlightByState).length > 0 ||
    Object.keys(data.spotlightByTag).length > 0 ||
    (data.submissionCount ?? 0) > 0 ||
    Object.keys(data.avgScoreByMood ?? {}).length > 0 ||
    Object.keys(data.avgScoreByState ?? {}).length > 0 ||
    Object.values(data.scoreDistribution ?? {}).some((v) => (v ?? 0) > 0);

  if (!hasAny) {
    const reportHrefEmpty = `/api/admin/submissions/report?cycleId=${encodeURIComponent(cycleId)}`;
    return (
      <div className="admin-card md:p-8">
        <p className="text-sm text-[color:var(--nsi-ink-soft)]">No submissions recorded for this cycle.</p>
        <a
          href={reportHrefEmpty}
          download
          className="admin-btn-secondary mt-4 inline-flex items-center gap-2"
        >
          Download PDF Report
        </a>
      </div>
    );
  }

  const moodEntries: { mood: string; count: number }[] = MOODS.map((m) => ({
    mood: m,
    count: data.moodDistribution[m] ?? 0,
  })).filter((e) => e.count > 0);
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

  const scoreDist = data.scoreDistribution ?? {};
  const distMax = Math.max(
    scoreDist["1-3"] ?? 0,
    scoreDist["4-6"] ?? 0,
    scoreDist["7-10"] ?? 0,
    1
  );
  const avgByMoodEntries = Object.entries(data.avgScoreByMood ?? {})
    .filter(([, v]) => v > 0)
    .sort((a, b) => b[1] - a[1]);
  const avgByStateEntries = Object.entries(data.avgScoreByState ?? {})
    .filter(([, v]) => v > 0)
    .sort((a, b) => b[1] - a[1]);

  const reportHref = `/api/admin/submissions/report?cycleId=${encodeURIComponent(cycleId)}`;

  return (
    <div className="admin-card md:p-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-[color:var(--nsi-rule)] pb-4">
        {data.submissionCount != null && (
          <span className="font-mono text-xs font-bold uppercase tracking-[0.14em] text-[color:var(--nsi-ink)]">
            Sample Size: <span className="text-[color:var(--nsi-green)]">{data.submissionCount}</span> response{data.submissionCount === 1 ? "" : "s"}
          </span>
        )}
        <a
          href={reportHref}
          download
          className="admin-btn-secondary inline-flex items-center gap-2"
        >
          Download PDF Report
        </a>
      </div>
      <div className="space-y-8">
        {/* Overall average score */}
        <section>
          <h3 className="font-mono text-xs font-bold uppercase tracking-[0.16em] text-[color:var(--nsi-ink-muted)]">
            Composite Mean Score
          </h3>
          <p className="mt-2 font-serif text-4xl font-bold text-[color:var(--nsi-green)]">
            {data.overallAvgScore != null
              ? data.overallAvgScore.toFixed(2)
              : "—"}
          </p>
        </section>

        {/* Average per pillar */}
        <section>
          <h3 className="font-mono text-xs font-bold uppercase tracking-[0.16em] text-[color:var(--nsi-ink-muted)]">
            Mean Score by Pillar
          </h3>
          <ul className="mt-3 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
            {PILLARS.map((p) => (
              <li
                key={p.key}
                className="flex items-center justify-between rounded-[2px] border border-[color:var(--nsi-rule)] bg-[color:var(--nsi-paper)] px-4 py-3"
              >
                <span className="text-sm font-semibold text-[color:var(--nsi-ink)]">{p.label}</span>
                <span className="font-mono font-bold tabular-nums text-[color:var(--nsi-green)]">
                  {(data.avgPerPillar[p.key] ?? 0) > 0
                    ? (data.avgPerPillar[p.key] ?? 0).toFixed(2)
                    : "—"}
                </span>
              </li>
            ))}
          </ul>
        </section>

        {/* Score distribution */}
        {(scoreDist["1-3"] ?? 0) + (scoreDist["4-6"] ?? 0) + (scoreDist["7-10"] ?? 0) > 0 && (
          <section>
            <h3 className="font-mono text-xs font-bold uppercase tracking-[0.16em] text-[color:var(--nsi-ink-muted)]">
              Score Band Distribution
            </h3>
            <ul className="mt-3 space-y-2">
              {(["7-10", "4-6", "1-3"] as const).map((bucket) => {
                const n = scoreDist[bucket] ?? 0;
                const pct = distMax > 0 ? (n / distMax) * 100 : 0;
                return (
                  <li
                    key={bucket}
                    className="flex items-center gap-3 rounded-[2px] border border-[color:var(--nsi-rule)] bg-[color:var(--nsi-paper)] px-4 py-2.5"
                  >
                    <span className="w-10 font-mono text-xs font-bold">{bucket}</span>
                    <span className="w-8 font-mono text-xs tabular-nums text-[color:var(--nsi-ink-soft)]">{n}</span>
                    <div className="min-w-[80px] flex-1 rounded-[1px] bg-black/10">
                      <div
                        className="h-2 rounded-[1px] bg-[color:var(--nsi-green)]"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>
        )}

        {/* Score by mood */}
        {avgByMoodEntries.length > 0 && (
          <section>
            <h3 className="font-mono text-xs font-bold uppercase tracking-[0.16em] text-[color:var(--nsi-ink-muted)]">
              Mean Score by National Mood
            </h3>
            <ul className="mt-3 grid gap-2 sm:grid-cols-2">
              {avgByMoodEntries.map(([mood, avg]) => (
                <li
                  key={mood}
                  className="flex items-center justify-between rounded-[2px] border border-[color:var(--nsi-rule)] bg-[color:var(--nsi-paper)] px-4 py-2.5"
                >
                  <span className="text-sm font-semibold">{mood}</span>
                  <span className="font-mono font-bold tabular-nums text-[color:var(--nsi-green)]">
                    {avg.toFixed(2)}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Score by state */}
        {avgByStateEntries.length > 0 && (
          <section>
            <h3 className="font-mono text-xs font-bold uppercase tracking-[0.16em] text-[color:var(--nsi-ink-muted)]">
              Mean Score by State
            </h3>
            <ul className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {avgByStateEntries.map(([state, avg]) => (
                <li
                  key={state}
                  className="flex items-center justify-between rounded-[2px] border border-[color:var(--nsi-rule)] bg-[color:var(--nsi-paper)] px-4 py-2.5"
                >
                  <span className="text-sm font-semibold">{state}</span>
                  <span className="font-mono font-bold tabular-nums text-[color:var(--nsi-green)]">
                    {avg.toFixed(2)}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Mood */}
        <section>
          <h3 className="font-mono text-xs font-bold uppercase tracking-[0.16em] text-[color:var(--nsi-ink-muted)]">
            Mood Frequency
          </h3>
          {moodEntries.length === 0 ? (
            <p className="mt-2 text-sm text-[color:var(--nsi-ink-muted)]">No mood data.</p>
          ) : (
            <ul className="mt-3 space-y-2">
              {moodEntries.map(({ mood, count }) => (
                <li
                  key={mood}
                  className="flex items-center justify-between rounded-[2px] border border-[color:var(--nsi-rule)] bg-[color:var(--nsi-paper)] px-4 py-2.5"
                >
                  <span className="text-sm font-semibold">{mood}</span>
                  <span className="font-mono text-xs font-bold tabular-nums text-[color:var(--nsi-ink-soft)]">{count}</span>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* One word */}
        <section>
          <h3 className="font-mono text-xs font-bold uppercase tracking-[0.16em] text-[color:var(--nsi-ink-muted)]">
            One-Word Descriptors
          </h3>
          {data.oneWordCounts.length === 0 ? (
            <p className="mt-2 text-sm text-[color:var(--nsi-ink-muted)]">No one-word data.</p>
          ) : (
            <ul className="mt-3 flex flex-wrap gap-2">
              {data.oneWordCounts.slice(0, 30).map(({ word, count }) => (
                <li
                  key={word}
                  className="rounded-[2px] border border-[color:var(--nsi-rule-strong)] bg-[color:var(--nsi-paper)] px-3 py-1.5 text-xs"
                >
                  <span className="font-semibold">{word}</span>
                  <span className="ml-1.5 font-mono tabular-nums text-[color:var(--nsi-ink-muted)]">({count})</span>
                </li>
              ))}
              {data.oneWordCounts.length > 30 && (
                <li className="text-xs text-[color:var(--nsi-ink-muted)]">
                  +{data.oneWordCounts.length - 30} more
                </li>
              )}
            </ul>
          )}
        </section>

        {/* Spotlight by state */}
        <section>
          <h3 className="font-mono text-xs font-bold uppercase tracking-[0.16em] text-[color:var(--nsi-ink-muted)]">
            Spotlight Volume by State
          </h3>
          {stateEntries.length === 0 ? (
            <p className="mt-2 text-sm text-[color:var(--nsi-ink-muted)]">No spotlight state data.</p>
          ) : (
            <ul className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {stateEntries.map(([state, count]) => (
                <li
                  key={state}
                  className="flex items-center justify-between rounded-[2px] border border-[color:var(--nsi-rule)] bg-[color:var(--nsi-paper)] px-4 py-2.5"
                >
                  <span className="text-sm font-semibold">{state}</span>
                  <span className="font-mono text-xs font-bold tabular-nums text-[color:var(--nsi-ink-soft)]">{count}</span>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Spotlight by tag */}
        <section>
          <h3 className="font-mono text-xs font-bold uppercase tracking-[0.16em] text-[color:var(--nsi-ink-muted)]">
            Spotlight Volume by Thematic Tag
          </h3>
          {tagEntries.length === 0 ? (
            <p className="mt-2 text-sm text-[color:var(--nsi-ink-muted)]">No spotlight tag data.</p>
          ) : (
            <ul className="mt-3 flex flex-wrap gap-2">
              {tagEntries.map(([tag, count]) => (
                <li
                  key={tag}
                  className="rounded-[2px] border border-[color:var(--nsi-rule-strong)] bg-[color:var(--nsi-paper)] px-3 py-1.5 text-xs"
                >
                  <span className="font-semibold">{tag}</span>
                  <span className="ml-1.5 font-mono tabular-nums text-[color:var(--nsi-ink-muted)]">({count})</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
