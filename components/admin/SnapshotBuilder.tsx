"use client";

/* eslint-disable react-hooks/set-state-in-effect */

import { NIGERIAN_STATES } from "@/lib/constants";
import { useEffect, useMemo, useState } from "react";

type SnapshotListItem = {
  id: string;
  period: string;
  overallScore: number;
  publishedAt: string | null;
  isLocked: boolean;
  createdAt: string;
  cycleId: string | null;
};

type SnapshotApiResponse =
  | { error: string }
  | { snapshot: SnapshotModel & { id: string; isLocked: boolean; publishedAt: string | null } };

type Pillar = { title: string; score: number; summary: string };

type SnapshotModel = {
  id?: string;
  cycleId: string | null;
  period: string;
  overallScore: number;
  overallNarrative: string;
  pillarScores: { pillars: Pillar[] };
  stateSpotlightContent: { state: string; score: number; bullets: string[] };
  publicSentimentSummary: { topWords: string[]; averagePublicScore: number; topMood: string };
  publishedAt?: string | null;
  isLocked?: boolean;
};

const defaultSnapshot: SnapshotModel = {
  cycleId: null,
  period: "January 2026",
  overallScore: 6.6,
  overallNarrative: "Cautiously stable",
  pillarScores: {
    pillars: [
      { title: "Security", score: 6.5, summary: "Order holds despite threats." },
      { title: "FX & Economy", score: 6.0, summary: "Fragile, but stabilizing." },
      { title: "Investor Confidence", score: 6.5, summary: "Capital is cautious." },
      { title: "Governance", score: 7.0, summary: "Direction remains consistent." },
      { title: "Social Stability", score: 7.0, summary: "Tensions ease; mood is calm." },
    ],
  },
  stateSpotlightContent: {
    state: "Lagos",
    score: 7.1,
    bullets: ["Strongest in transportation", "Top in public services delivery", "Rising regional influence"],
  },
  publicSentimentSummary: {
    topWords: ["Hopeful", "Steady", "Progressing", "Demanding"],
    averagePublicScore: 6.5,
    topMood: "Cautiously hopeful",
  },
};

function prettyDate(s: string | null) {
  if (!s) return "—";
  const d = new Date(s);
  return Number.isNaN(d.valueOf()) ? "—" : d.toLocaleString("en-NG");
}

function hasError(data: unknown): data is { error: string } {
  if (!data || typeof data !== "object") return false;
  const maybe = data as { error?: unknown };
  return typeof maybe.error === "string" && maybe.error.length > 0;
}

function hasSnapshot<T extends object>(data: unknown): data is { snapshot: T } {
  if (!data || typeof data !== "object") return false;
  const maybe = data as { snapshot?: unknown };
  return !!maybe.snapshot && typeof maybe.snapshot === "object";
}

export function SnapshotBuilder() {
  const [list, setList] = useState<SnapshotListItem[]>([]);
  const [selectedId, setSelectedId] = useState<string | "new">("new");
  const [model, setModel] = useState<SnapshotModel>({ ...defaultSnapshot });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const locked = !!model.isLocked;
  const published = !!model.publishedAt;

  const canSave = useMemo(() => {
    return (
      model.period.trim().length > 2 &&
      model.overallNarrative.trim().length > 0 &&
      model.pillarScores.pillars.length === 5 &&
      model.stateSpotlightContent.bullets.filter(Boolean).length >= 1
    );
  }, [model]);

  async function loadList() {
    const res = await fetch("/api/admin/snapshot?take=20");
    if (!res.ok) return;
    const data = (await res.json()) as { items: SnapshotListItem[] };
    setList(data.items);
  }

  async function loadOne(id: string) {
    setError(null);
    setSuccess(null);
    setLoading(true);
    const res = await fetch(`/api/admin/snapshot/${id}`);
    setLoading(false);
    if (!res.ok) {
      const data = (await res.json().catch(() => null)) as { error?: string } | null;
      setError(data?.error ?? "Failed to load snapshot.");
      return;
    }
    const data = (await res.json()) as SnapshotApiResponse;
    if (!("snapshot" in data)) {
      setError(data.error ?? "Failed to load snapshot.");
      return;
    }
    const snap = data.snapshot;

    // Ensure shapes
    setModel({
      id: snap.id,
      cycleId: snap.cycleId ?? null,
      period: snap.period,
      overallScore: snap.overallScore,
      overallNarrative: snap.overallNarrative,
      pillarScores: (snap.pillarScores as unknown as SnapshotModel["pillarScores"]) ?? { pillars: [] },
      stateSpotlightContent:
        (snap.stateSpotlightContent as unknown as SnapshotModel["stateSpotlightContent"]) ?? {
          state: "",
          score: 0,
          bullets: [],
        },
      publicSentimentSummary:
        (snap.publicSentimentSummary as unknown as SnapshotModel["publicSentimentSummary"]) ?? {
          topWords: [],
          averagePublicScore: 0,
          topMood: "",
        },
      publishedAt: snap.publishedAt ?? null,
      isLocked: snap.isLocked ?? false,
    });
  }

  useEffect(() => {
    void loadList();
  }, []);

  useEffect(() => {
    if (selectedId === "new") {
      setModel({ ...defaultSnapshot });
      return;
    }
    void loadOne(selectedId);
  }, [selectedId]);

  async function save() {
    setError(null);
    setSuccess(null);
    setLoading(true);
    const res = await fetch("/api/admin/snapshot", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        id: model.id,
        cycleId: model.cycleId,
        period: model.period,
        overallScore: model.overallScore,
        overallNarrative: model.overallNarrative,
        pillarScores: model.pillarScores,
        stateSpotlightContent: model.stateSpotlightContent,
        publicSentimentSummary: model.publicSentimentSummary,
      }),
    });
    setLoading(false);

    const data = (await res.json().catch(() => null)) as unknown;
    if (!res.ok) {
      setError(hasError(data) ? data.error : "Save failed.");
      return;
    }

    setSuccess("Saved.");
    if (hasSnapshot<{ id: string; publishedAt: string | null; isLocked: boolean }>(data)) {
      setModel((m) => ({
        ...m,
        id: data.snapshot.id,
        publishedAt: data.snapshot.publishedAt,
        isLocked: data.snapshot.isLocked,
      }));
      await loadList();
      setSelectedId(data.snapshot.id);
    }
  }

  async function publish() {
    if (!model.id) return;
    setError(null);
    setSuccess(null);
    setLoading(true);
    const res = await fetch(`/api/admin/snapshot/${model.id}/publish`, { method: "POST" });
    setLoading(false);
    const data = (await res.json().catch(() => null)) as unknown;
    if (!res.ok) {
      setError(hasError(data) ? data.error : "Publish failed.");
      return;
    }
    setSuccess("Published.");
    setModel((m) => ({
      ...m,
      publishedAt: hasSnapshot<{ publishedAt: string }>(data)
        ? data.snapshot.publishedAt
        : new Date().toISOString(),
    }));
    await loadList();
  }

  async function lock() {
    if (!model.id) return;
    setError(null);
    setSuccess(null);
    setLoading(true);
    const res = await fetch(`/api/admin/snapshot/${model.id}/lock`, { method: "POST" });
    setLoading(false);
    const data = (await res.json().catch(() => null)) as unknown;
    if (!res.ok) {
      setError(hasError(data) ? data.error : "Lock failed.");
      return;
    }
    setSuccess("Locked (immutable).");
    setModel((m) => ({ ...m, isLocked: true }));
    await loadList();
  }

  return (
    <div className="grid gap-6 md:grid-cols-3">
      <div className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm">
        <div className="text-sm font-medium text-black/70">Snapshots</div>
        <select
          className="mt-3 w-full rounded-xl border border-black/10 bg-white px-4 py-3 outline-none focus:border-[color:var(--nsi-green)]"
          value={selectedId}
          onChange={(e) => setSelectedId(e.target.value === "new" ? "new" : e.target.value)}
        >
          <option value="new">+ New draft</option>
          {list.map((s) => (
            <option key={s.id} value={s.id}>
              {s.period} {s.isLocked ? "· locked" : s.publishedAt ? "· published" : "· draft"}
            </option>
          ))}
        </select>

        <div className="mt-5 space-y-2 text-sm text-black/70">
          <div>
            <span className="text-black/50">Published:</span> {prettyDate(model.publishedAt ?? null)}
          </div>
          <div>
            <span className="text-black/50">Locked:</span> {locked ? "Yes" : "No"}
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-2">
          <button
            className="rounded-xl bg-[color:var(--nsi-green)] px-4 py-2 text-sm font-medium text-white hover:opacity-95 disabled:opacity-60"
            type="button"
            onClick={() => void save()}
            disabled={loading || locked || !canSave}
          >
            {loading ? "Saving…" : "Save draft"}
          </button>

          <button
            className="rounded-xl border border-black/15 bg-white px-4 py-2 text-sm font-medium hover:bg-black/[.03] disabled:opacity-60"
            type="button"
            onClick={() => void publish()}
            disabled={loading || locked || !model.id}
          >
            {published ? "Republish (same)" : "Publish"}
          </button>

          <button
            className="rounded-xl border border-black/15 bg-white px-4 py-2 text-sm font-medium hover:bg-black/[.03] disabled:opacity-60"
            type="button"
            onClick={() => void lock()}
            disabled={loading || locked || !model.id || !published}
          >
            Lock (irreversible)
          </button>
        </div>

        {error ? (
          <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
            {error}
          </div>
        ) : null}

        {success ? (
          <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
            {success}
          </div>
        ) : null}
      </div>

      <div className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm md:col-span-2">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="block">
            <div className="text-xs font-medium text-black/60">Month / year</div>
            <input
              className="mt-1 w-full rounded-xl border border-black/10 bg-white px-4 py-3 outline-none focus:border-[color:var(--nsi-green)] disabled:opacity-60"
              value={model.period}
              onChange={(e) => setModel((m) => ({ ...m, period: e.target.value }))}
              disabled={locked}
            />
          </label>

          <label className="block">
            <div className="text-xs font-medium text-black/60">Overall score (0–10)</div>
            <input
              className="mt-1 w-full rounded-xl border border-black/10 bg-white px-4 py-3 outline-none focus:border-[color:var(--nsi-green)] disabled:opacity-60"
              type="number"
              step="0.1"
              min={0}
              max={10}
              value={model.overallScore}
              onChange={(e) => setModel((m) => ({ ...m, overallScore: Number(e.target.value) }))}
              disabled={locked}
            />
          </label>
        </div>

        <label className="mt-4 block">
          <div className="text-xs font-medium text-black/60">Overall narrative</div>
          <textarea
            className="mt-1 w-full resize-y rounded-xl border border-black/10 bg-white px-4 py-3 outline-none focus:border-[color:var(--nsi-green)] disabled:opacity-60"
            rows={2}
            value={model.overallNarrative}
            onChange={(e) => setModel((m) => ({ ...m, overallNarrative: e.target.value }))}
            disabled={locked}
          />
        </label>

        <div className="mt-8">
          <div className="font-serif text-2xl font-semibold tracking-tight text-[color:var(--nsi-green)]">
            Pillars (5)
          </div>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {model.pillarScores.pillars.map((p, idx) => (
              <div key={idx} className="rounded-2xl border border-black/10 bg-[color:var(--nsi-paper)] p-4">
                <label className="block">
                  <div className="text-xs font-medium text-black/60">Title</div>
                  <input
                    className="mt-1 w-full rounded-xl border border-black/10 bg-white px-3 py-2 outline-none disabled:opacity-60"
                    value={p.title}
                    onChange={(e) =>
                      setModel((m) => {
                        const pillars = [...m.pillarScores.pillars];
                        pillars[idx] = { ...pillars[idx], title: e.target.value };
                        return { ...m, pillarScores: { pillars } };
                      })
                    }
                    disabled={locked}
                  />
                </label>
                <label className="mt-3 block">
                  <div className="text-xs font-medium text-black/60">Score</div>
                  <input
                    className="mt-1 w-full rounded-xl border border-black/10 bg-white px-3 py-2 outline-none disabled:opacity-60"
                    type="number"
                    step="0.1"
                    min={0}
                    max={100}
                    value={p.score}
                    onChange={(e) =>
                      setModel((m) => {
                        const pillars = [...m.pillarScores.pillars];
                        pillars[idx] = { ...pillars[idx], score: Number(e.target.value) };
                        return { ...m, pillarScores: { pillars } };
                      })
                    }
                    disabled={locked}
                  />
                </label>
                <label className="mt-3 block">
                  <div className="text-xs font-medium text-black/60">Summary</div>
                  <textarea
                    className="mt-1 w-full resize-y rounded-xl border border-black/10 bg-white px-3 py-2 outline-none disabled:opacity-60"
                    rows={2}
                    value={p.summary}
                    onChange={(e) =>
                      setModel((m) => {
                        const pillars = [...m.pillarScores.pillars];
                        pillars[idx] = { ...pillars[idx], summary: e.target.value };
                        return { ...m, pillarScores: { pillars } };
                      })
                    }
                    disabled={locked}
                  />
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl border border-black/10 bg-white p-5">
            <div className="font-serif text-xl font-semibold tracking-tight text-[color:var(--nsi-green)]">
              State highlight
            </div>
            <label className="mt-4 block">
              <div className="text-xs font-medium text-black/60">State</div>
              <select
                className="mt-1 w-full rounded-xl border border-black/10 bg-white px-4 py-3 outline-none disabled:opacity-60"
                value={model.stateSpotlightContent.state}
                onChange={(e) =>
                  setModel((m) => ({ ...m, stateSpotlightContent: { ...m.stateSpotlightContent, state: e.target.value } }))
                }
                disabled={locked}
              >
                {NIGERIAN_STATES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </label>
            <label className="mt-4 block">
              <div className="text-xs font-medium text-black/60">Score</div>
              <input
                className="mt-1 w-full rounded-xl border border-black/10 bg-white px-4 py-3 outline-none disabled:opacity-60"
                type="number"
                step="0.1"
                min={0}
                max={10}
                value={model.stateSpotlightContent.score}
                onChange={(e) =>
                  setModel((m) => ({
                    ...m,
                    stateSpotlightContent: { ...m.stateSpotlightContent, score: Number(e.target.value) },
                  }))
                }
                disabled={locked}
              />
            </label>
            <div className="mt-4 space-y-3">
              {model.stateSpotlightContent.bullets.slice(0, 3).map((b, idx) => (
                <label key={idx} className="block">
                  <div className="text-xs font-medium text-black/60">Bullet {idx + 1}</div>
                  <input
                    className="mt-1 w-full rounded-xl border border-black/10 bg-white px-4 py-3 outline-none disabled:opacity-60"
                    value={b}
                    onChange={(e) =>
                      setModel((m) => {
                        const bullets = [...m.stateSpotlightContent.bullets];
                        bullets[idx] = e.target.value;
                        return { ...m, stateSpotlightContent: { ...m.stateSpotlightContent, bullets } };
                      })
                    }
                    disabled={locked}
                  />
                </label>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-black/10 bg-white p-5">
            <div className="font-serif text-xl font-semibold tracking-tight text-[color:var(--nsi-green)]">
              Public sentiment summary
            </div>
            <label className="mt-4 block">
              <div className="text-xs font-medium text-black/60">Top words (comma separated)</div>
              <input
                className="mt-1 w-full rounded-xl border border-black/10 bg-white px-4 py-3 outline-none disabled:opacity-60"
                value={model.publicSentimentSummary.topWords.join(", ")}
                onChange={(e) =>
                  setModel((m) => ({
                    ...m,
                    publicSentimentSummary: {
                      ...m.publicSentimentSummary,
                      topWords: e.target.value
                        .split(",")
                        .map((x) => x.trim())
                        .filter(Boolean),
                    },
                  }))
                }
                disabled={locked}
              />
            </label>
            <label className="mt-4 block">
              <div className="text-xs font-medium text-black/60">Average public score</div>
              <input
                className="mt-1 w-full rounded-xl border border-black/10 bg-white px-4 py-3 outline-none disabled:opacity-60"
                type="number"
                step="0.1"
                min={0}
                max={10}
                value={model.publicSentimentSummary.averagePublicScore}
                onChange={(e) =>
                  setModel((m) => ({
                    ...m,
                    publicSentimentSummary: { ...m.publicSentimentSummary, averagePublicScore: Number(e.target.value) },
                  }))
                }
                disabled={locked}
              />
            </label>
            <label className="mt-4 block">
              <div className="text-xs font-medium text-black/60">Top mood</div>
              <input
                className="mt-1 w-full rounded-xl border border-black/10 bg-white px-4 py-3 outline-none disabled:opacity-60"
                value={model.publicSentimentSummary.topMood}
                onChange={(e) =>
                  setModel((m) => ({
                    ...m,
                    publicSentimentSummary: { ...m.publicSentimentSummary, topMood: e.target.value },
                  }))
                }
                disabled={locked}
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}

