"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { PILLARS } from "@/lib/constants";

type SurveyQuestion = {
  pillarKey: string;
  pillarLabel: string;
  questionText: string;
};

type Cycle = {
  id: string;
  status: string;
  monthYear: string;
  surveyQuestions: SurveyQuestion[] | null;
  createdAt: string;
};

const defaultQuestionText = (pillarLabel: string) =>
  `How stable is ${pillarLabel} in Nigeria this month?`;

export function CycleSurveyForm() {
  const router = useRouter();
  const [cycle, setCycle] = useState<Cycle | null>(null);
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState<SurveyQuestion[]>(() =>
    PILLARS.map((p) => ({
      pillarKey: p.key,
      pillarLabel: p.label,
      questionText: defaultQuestionText(p.label),
    }))
  );
  const [submitState, setSubmitState] = useState<"idle" | "open" | "update" | "close" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [cycleName, setCycleName] = useState("");

  useEffect(() => {
    async function load() {
      setError(null);
      try {
        const res = await fetch("/api/admin/cycle");
        if (!res.ok) {
          setError("Failed to load cycle.");
          return;
        }
        const data = (await res.json()) as { currentCycle: Cycle | null };
        setCycle(data.currentCycle ?? null);
        if (data.currentCycle?.surveyQuestions && Array.isArray(data.currentCycle.surveyQuestions)) {
          const existing = data.currentCycle.surveyQuestions as SurveyQuestion[];
          if (existing.length === 5) {
            const ordered = PILLARS.map(
              (p) =>
                existing.find((q) => q.pillarKey === p.key) ?? {
                  pillarKey: p.key,
                  pillarLabel: p.label,
                  questionText: defaultQuestionText(p.label),
                }
            );
            setQuestions(ordered);
          }
        }
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  async function submitSurvey(action?: "OPEN") {
    setError(null);
    setSubmitState(action === "OPEN" ? "open" : "update");
    try {
      const body: { surveyQuestions: SurveyQuestion[]; action?: "OPEN"; monthYear?: string } = {
        surveyQuestions: questions,
        ...(action === "OPEN" ? { action: "OPEN" } : {}),
      };
      if (cycleName.trim()) body.monthYear = cycleName.trim();
      const res = await fetch("/api/admin/cycle", {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = (await res.json().catch(() => null)) as { error?: string; currentCycle?: Cycle } | null;
      if (!res.ok) {
        throw new Error(data?.error ?? "Request failed.");
      }
      if (data?.currentCycle) setCycle(data.currentCycle);
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Request failed.");
    } finally {
      setSubmitState(null);
    }
  }

  async function closeCycle() {
    setError(null);
    setSubmitState("close");
    try {
      const res = await fetch("/api/admin/cycle", {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ action: "CLOSE" }),
      });
      const data = (await res.json().catch(() => null)) as { error?: string; currentCycle?: Cycle } | null;
      if (!res.ok) throw new Error(data?.error ?? "Request failed.");
      if (data?.currentCycle) setCycle(data.currentCycle);
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Request failed.");
    } finally {
      setSubmitState(null);
    }
  }

  const updateQuestion = (index: number, questionText: string) => {
    setQuestions((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], questionText };
      return next;
    });
  };

  if (loading) {
    return (
      <div className="admin-card p-8 text-center text-[color:var(--nsi-ink-soft)]">
        Loading cycle configuration…
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {cycle && (
        <div className="admin-card">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="font-mono text-xs font-bold uppercase tracking-[0.16em] text-[color:var(--nsi-ink-muted)]">
                Current Cycle
              </h2>
              <p className="mt-1 font-serif text-2xl font-bold text-[color:var(--nsi-ink)]">
                {cycle.monthYear}
              </p>
            </div>
            <span
              className={`inline-flex rounded-[2px] border px-2.5 py-1 font-mono text-xs font-bold uppercase ${
                cycle.status === "OPEN"
                  ? "border-emerald-300 bg-emerald-50 text-emerald-900"
                  : cycle.status === "CLOSED"
                    ? "border-amber-300 bg-amber-50 text-amber-900"
                    : "border-gray-300 bg-gray-100 text-gray-700"
              }`}
            >
              {cycle.status}
            </span>
          </div>
        </div>
      )}

      <form
        className="admin-card md:p-8"
        onSubmit={(e) => {
          e.preventDefault();
          const shouldOpen = cycle?.status !== "OPEN" && cycle?.status !== "ARCHIVED";
          submitSurvey(shouldOpen ? "OPEN" : undefined);
        }}
      >
        <h2 className="font-mono text-xs font-bold uppercase tracking-[0.16em] text-[color:var(--nsi-ink)]">
          Survey Instrument Questions (1–5 Rating Scale)
        </h2>
        <p className="mt-1.5 max-w-xl text-sm text-[color:var(--nsi-ink-soft)]">
          Define the question prompt for each stability pillar. Respondents rate each prompt from 1 (least stable) to 5 (most stable).
        </p>

        {(cycle?.status !== "OPEN" || !cycle) && (
          <div className="mt-6">
            <label htmlFor="cycle-name" className="block font-mono text-xs font-bold uppercase tracking-[0.14em] text-[color:var(--nsi-ink)]">
              Cycle Edition Title (Optional)
            </label>
            <input
              id="cycle-name"
              type="text"
              value={cycleName}
              onChange={(e) => setCycleName(e.target.value)}
              placeholder={cycle?.monthYear ?? new Intl.DateTimeFormat("en-NG", { month: "long", year: "numeric" }).format(new Date())}
              className="admin-input mt-1.5 w-full max-w-xs"
              aria-label="Cycle name"
            />
            <p className="mt-1 text-xs text-[color:var(--nsi-ink-muted)]">
              Used when creating or opening a cycle (e.g. Month and Year). Leave blank to use the default.
            </p>
          </div>
        )}

        <div className="mt-6 space-y-5">
          {PILLARS.map((pillar, idx) => (
            <div key={pillar.key}>
              <label
                htmlFor={`q-${idx}`}
                className="block font-mono text-xs font-bold uppercase tracking-[0.14em] text-[color:var(--nsi-ink)]"
              >
                0{idx + 1} / {pillar.label}
              </label>
              <input
                id={`q-${idx}`}
                type="text"
                value={questions[idx]?.questionText ?? ""}
                onChange={(e) => updateQuestion(idx, e.target.value)}
                className="admin-input mt-1.5 w-full"
                placeholder={defaultQuestionText(pillar.label)}
                required
              />
            </div>
          ))}
        </div>
        <div className="mt-8 flex flex-wrap gap-3 border-t border-[color:var(--nsi-rule)] pt-6">
          {cycle?.status === "ARCHIVED" && (
            <p className="w-full text-sm text-[color:var(--nsi-ink-soft)]">
              Archived cycles cannot be reopened. Create a new cycle from the dashboard instead.
            </p>
          )}
          {cycle?.status !== "OPEN" && cycle?.status !== "ARCHIVED" ? (
            <button
              type="submit"
              className="admin-btn-primary disabled:opacity-50"
              disabled={!!submitState}
            >
              {submitState === "open" ? "Opening…" : "Open Cycle"}
            </button>
          ) : cycle?.status === "OPEN" ? (
            <button
              type="submit"
              className="admin-btn-secondary disabled:opacity-50"
              disabled={!!submitState}
            >
              {submitState === "update" ? "Saving…" : "Update Questions"}
            </button>
          ) : null}
          {cycle?.status === "OPEN" && (
            <button
              type="button"
              className="admin-btn-danger disabled:opacity-50"
              disabled={!!submitState}
              onClick={closeCycle}
            >
              {submitState === "close" ? "Closing…" : "Close Cycle"}
            </button>
          )}
        </div>
      </form>

      {error && (
        <div className="rounded-[3px] border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-900">
          {error}
        </div>
      )}
    </div>
  );
}
