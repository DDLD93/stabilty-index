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
    setSubmitState(action ?? "update");
    try {
      const res = await fetch("/api/admin/cycle", {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          surveyQuestions: questions,
          ...(action === "OPEN" ? { action: "OPEN" } : {}),
        }),
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
      <div className="rounded-2xl border border-black/10 bg-white p-8 text-center text-[color:var(--nsi-ink-soft)]">
        Loading…
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {cycle && (
        <div className="rounded-2xl border border-black/10 bg-white p-6">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-[color:var(--nsi-ink-soft)]">
            Current cycle
          </h2>
          <p className="mt-2 font-serif text-xl font-semibold text-[color:var(--nsi-ink)]">
            {cycle.monthYear}
          </p>
          <p className="mt-1 text-sm text-[color:var(--nsi-ink-soft)]">
            Status:{" "}
            <span
              className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${
                cycle.status === "OPEN"
                  ? "bg-emerald-100 text-emerald-800"
                  : cycle.status === "CLOSED"
                    ? "bg-amber-100 text-amber-800"
                    : "bg-gray-100 text-gray-700"
              }`}
            >
              {cycle.status}
            </span>
          </p>
        </div>
      )}

      <form
        className="rounded-2xl border border-black/10 bg-white p-6 md:p-8"
        onSubmit={(e) => {
          e.preventDefault();
          submitSurvey(cycle?.status !== "OPEN" ? "OPEN" : undefined);
        }}
      >
        <h2 className="text-sm font-semibold uppercase tracking-wide text-[color:var(--nsi-ink-soft)]">
          Survey questions (one per pillar, scale 1–5)
        </h2>
        <p className="mt-2 max-w-xl text-sm text-[color:var(--nsi-ink-soft)]">
          Define the question text for each stability pillar. Respondents will answer with a radio scale from 1 to 5.
        </p>
        <div className="mt-6 space-y-5">
          {PILLARS.map((pillar, idx) => (
            <div key={pillar.key}>
              <label
                htmlFor={`q-${idx}`}
                className="block text-sm font-medium text-[color:var(--nsi-ink)]"
              >
                {pillar.label}
              </label>
              <input
                id={`q-${idx}`}
                type="text"
                value={questions[idx]?.questionText ?? ""}
                onChange={(e) => updateQuestion(idx, e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-black/15 bg-white px-4 py-2.5 text-[color:var(--nsi-ink)] placeholder:text-black/40 focus:border-[color:var(--nsi-green)] focus:outline-none focus:ring-1 focus:ring-[color:var(--nsi-green)]"
                placeholder={defaultQuestionText(pillar.label)}
                required
              />
            </div>
          ))}
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          {cycle?.status !== "OPEN" ? (
            <button
              type="submit"
              className="rounded-xl bg-[color:var(--nsi-green)] px-4 py-2.5 text-sm font-medium text-white hover:opacity-95 disabled:opacity-60"
              disabled={!!submitState}
            >
              {submitState === "open" ? "Opening…" : "Open cycle"}
            </button>
          ) : (
            <button
              type="submit"
              className="rounded-xl border border-black/15 bg-white px-4 py-2.5 text-sm font-medium hover:bg-black/[.03] disabled:opacity-60"
              disabled={!!submitState}
            >
              {submitState === "update" ? "Saving…" : "Update questions"}
            </button>
          )}
          {cycle?.status === "OPEN" && (
            <button
              type="button"
              className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-2.5 text-sm font-medium text-amber-800 hover:bg-amber-100 disabled:opacity-60"
              disabled={!!submitState}
              onClick={closeCycle}
            >
              {submitState === "close" ? "Closing…" : "Close cycle"}
            </button>
          )}
        </div>
      </form>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {error}
        </div>
      )}
    </div>
  );
}
