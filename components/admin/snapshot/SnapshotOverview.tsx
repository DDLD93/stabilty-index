"use client";

import { useEffect, useState } from "react";
import { PILLARS } from "@/lib/constants";
import { OVERALL_MAX, cleanPeriod, publicationDateFor } from "@/lib/reportFormat";
import { SnapshotModel } from "./types";

type SnapshotOverviewProps = {
  model: SnapshotModel;
  setModel: React.Dispatch<React.SetStateAction<SnapshotModel>>;
  locked: boolean;
};

type CycleOption = {
  id: string;
  monthYear: string;
  status: string;
  createdAt: string;
  submissionCount: number;
};

type Analytics = {
  overallAvgScore: number | null;
  avgPerPillar: Record<string, number>;
  submissionCount: number;
};

const round2 = (n: number) => Math.round(n * 100) / 100;

export function SnapshotOverview({ model, setModel, locked }: SnapshotOverviewProps) {
  const [cycles, setCycles] = useState<CycleOption[]>([]);
  const [filling, setFilling] = useState(false);
  const [fillMessage, setFillMessage] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/admin/cycles")
      .then((r) => (r.ok ? r.json() : null))
      .then((data: { cycles: CycleOption[] } | null) => {
        if (!cancelled && data) setCycles(data.cycles);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  const selectedCycle = cycles.find((c) => c.id === model.cycleId) ?? null;
  const publishOn = publicationDateFor(model.period);

  function chooseCycle(id: string) {
    const cycle = cycles.find((c) => c.id === id) ?? null;
    setFillMessage(null);
    setModel((m) => ({
      ...m,
      cycleId: cycle?.id ?? null,
      // The edition describes the same month as its survey cycle.
      period: cycle ? cleanPeriod(cycle.monthYear) : m.period,
    }));
  }

  /** Copy the cycle's survey averages into the overall and pillar scores (editors can still adjust). */
  async function fillFromSurvey() {
    if (!model.cycleId) return;
    setFilling(true);
    setFillMessage(null);
    try {
      const res = await fetch(`/api/admin/submissions/analytics?cycleId=${encodeURIComponent(model.cycleId)}`);
      if (!res.ok) throw new Error();
      const a = (await res.json()) as Analytics;
      if (!a.submissionCount || a.overallAvgScore == null) {
        setFillMessage("This cycle has no counted answers yet.");
        return;
      }
      setModel((m) => ({
        ...m,
        overallScore: round2(a.overallAvgScore ?? 0),
        pillarScores: {
          pillars: m.pillarScores.pillars.map((p, i) => {
            const key =
              PILLARS.find((x) => x.label.toLowerCase() === p.title.trim().toLowerCase())?.key ?? PILLARS[i]?.key;
            const avg = key ? a.avgPerPillar[key] : undefined;
            return typeof avg === "number" && avg > 0 ? { ...p, score: round2(avg) } : p;
          }),
        },
        publicSentimentSummary: {
          ...m.publicSentimentSummary,
          averagePublicScore: round2(a.overallAvgScore ?? 0),
        },
      }));
      setFillMessage(`Filled from ${a.submissionCount} counted answers.`);
    } catch {
      setFillMessage("Could not load the survey averages.");
    } finally {
      setFilling(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Score Display */}
      <div className="flex flex-col items-center justify-center rounded-2xl border border-[color:var(--nsi-green)]/20 bg-gradient-to-br from-[color:var(--nsi-green)]/5 to-transparent p-8">
        <span className="text-sm font-medium uppercase tracking-wide text-[color:var(--nsi-ink-soft)]">
          Overall Score
        </span>
        <div className="mt-2 flex items-baseline gap-1">
          <span className="font-serif text-6xl font-bold tabular-nums text-[color:var(--nsi-green)]">
            {model.overallScore.toFixed(1)}
          </span>
          <span className="text-2xl text-[color:var(--nsi-ink-soft)]">/{OVERALL_MAX}</span>
        </div>
        {/* Score Bar Visualization */}
        <div className="mt-4 h-3 w-full max-w-xs overflow-hidden rounded-full bg-black/5">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[color:var(--nsi-green)] to-[color:var(--nsi-green-teal)] transition-all duration-500"
            style={{ width: `${Math.min(100, Math.max(0, (model.overallScore / OVERALL_MAX) * 100))}%` }}
          />
        </div>
      </div>

      {/* Survey cycle: links the edition to the answers it reports */}
      <div className="rounded-xl border border-black/10 bg-white p-4">
        <label className="block">
          <span className="text-sm font-medium text-[color:var(--nsi-ink)]">Survey cycle</span>
          <p className="mt-0.5 text-xs text-[color:var(--nsi-ink-soft)]">
            The survey this edition reports. Each edition covers the month before it is published: the October survey
            is collected in early November and published on 11 November.
          </p>
          <select
            className="admin-input mt-2"
            value={model.cycleId ?? ""}
            onChange={(e) => chooseCycle(e.target.value)}
            disabled={locked}
          >
            <option value="">Choose a cycle…</option>
            {cycles.map((c) => (
              <option key={c.id} value={c.id}>
                {c.monthYear} · {c.submissionCount} answers · opened{" "}
                {new Date(c.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                {c.status === "OPEN" ? " · open" : ""}
              </option>
            ))}
          </select>
        </label>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <button
            type="button"
            className="rounded-lg border border-black/15 bg-white px-3 py-1.5 text-sm font-medium hover:bg-black/[.03] disabled:opacity-50"
            onClick={fillFromSurvey}
            disabled={locked || !model.cycleId || filling}
          >
            {filling ? "Loading…" : "Use survey averages"}
          </button>
          <span className="text-xs text-[color:var(--nsi-ink-soft)]" aria-live="polite">
            {fillMessage ??
              (selectedCycle
                ? "Sets the overall score, the five pillar scores and the average public score from this cycle's answers."
                : "Pick a cycle to fill the scores from its answers.")}
          </span>
        </div>
      </div>

      {/* Form Fields */}
      <div className="grid gap-6 md:grid-cols-2">
        <label className="block">
          <span className="text-sm font-medium text-[color:var(--nsi-ink)]">Period (month this edition covers)</span>
          <p className="mt-0.5 text-xs text-[color:var(--nsi-ink-soft)]">
            {publishOn ? `Published on the site as the ${cleanPeriod(model.period)} edition, due ${publishOn}.` : "Month and year, e.g. October 2026."}
          </p>
          <input
            className="admin-input mt-2"
            value={model.period}
            onChange={(e) => setModel((m) => ({ ...m, period: e.target.value }))}
            disabled={locked}
            placeholder="e.g., October 2026"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-[color:var(--nsi-ink)]">Overall Score</span>
          <p className="mt-0.5 text-xs text-[color:var(--nsi-ink-soft)]">
            Out of {OVERALL_MAX}: the average of every person&rsquo;s five answers
          </p>
          <input
            className="admin-input mt-2"
            type="number"
            step="0.01"
            min={0}
            max={OVERALL_MAX}
            value={model.overallScore}
            onChange={(e) => setModel((m) => ({ ...m, overallScore: Number(e.target.value) }))}
            disabled={locked}
          />
        </label>
      </div>

      <label className="block">
        <span className="text-sm font-medium text-[color:var(--nsi-ink)]">Overall Narrative</span>
        <p className="mt-0.5 text-xs text-[color:var(--nsi-ink-soft)]">
          A brief summary describing the overall stability assessment
        </p>
        <textarea
          className="admin-input mt-2 min-h-[100px] resize-y"
          value={model.overallNarrative}
          onChange={(e) => setModel((m) => ({ ...m, overallNarrative: e.target.value }))}
          disabled={locked}
          placeholder="Describe the overall stability situation..."
        />
      </label>
    </div>
  );
}
