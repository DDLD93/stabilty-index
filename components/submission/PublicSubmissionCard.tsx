"use client";

import { MOODS, NIGERIAN_STATES, PILLAR_KEYS, SPOTLIGHT_TAGS } from "@/lib/constants";
import { useEffect, useMemo, useState } from "react";

type SurveyQuestion = {
  pillarKey: string;
  pillarLabel: string;
  questionText: string;
};

type PublicCycle = {
  id: string;
  monthYear: string;
  surveyQuestions: SurveyQuestion[];
};

type LegacyPayload = {
  stabilityScore: number;
  mood: string;
  oneWord: string;
  spotlightState?: string | null;
  spotlightTags?: string[];
  spotlightComment?: string | null;
};

export function PublicSubmissionCard() {
  const [cycle, setCycle] = useState<PublicCycle | null | "loading">("loading");
  const [pillarValues, setPillarValues] = useState<Record<string, number>>(() =>
    Object.fromEntries(PILLAR_KEYS.map((k) => [k, 3]))
  );
  const [stabilityScore, setStabilityScore] = useState(6);
  const [mood, setMood] = useState<(typeof MOODS)[number]>("Calm");
  const [oneWord, setOneWord] = useState("");
  const [spotlightState, setSpotlightState] = useState<string>("");
  const [spotlightTags, setSpotlightTags] = useState<string[]>([]);
  const [spotlightComment, setSpotlightComment] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  const surveyMode = cycle !== "loading" && cycle !== null && cycle.surveyQuestions?.length === 5;

  const canSubmitLegacy = useMemo(
    () => oneWord.trim().length > 0 && mood.length > 0,
    [oneWord, mood]
  );
  const canSubmitSurvey = useMemo(
    () =>
      PILLAR_KEYS.every(
        (k) => typeof pillarValues[k] === "number" && pillarValues[k] >= 1 && pillarValues[k] <= 5
      ),
    [pillarValues]
  );

  useEffect(() => {
    let cancelled = false;
    fetch("/api/public/cycle")
      .then((res) => res.json())
      .then((data: { cycle: PublicCycle | null }) => {
        if (!cancelled && data.cycle?.surveyQuestions?.length === 5) {
          setCycle(data.cycle);
        } else {
          setCycle(null);
        }
      })
      .catch(() => {
        if (!cancelled) setCycle(null);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  async function submitSurvey(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setStatus("submitting");
    const payload = {
      pillarResponses: { ...pillarValues },
      spotlightState: spotlightState.trim() || null,
      spotlightTags,
      spotlightComment: spotlightComment.trim() || null,
    };
    const res = await fetch("/api/public/submit", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const data = (await res.json().catch(() => null)) as { error?: string } | null;
      setError(data?.error ?? "Submission failed.");
      setStatus("error");
      return;
    }
    setStatus("success");
  }

  async function submitLegacy(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setStatus("submitting");
    const payload: LegacyPayload = {
      stabilityScore,
      mood,
      oneWord: oneWord.trim(),
      spotlightState: spotlightState.trim() ? spotlightState : null,
      spotlightTags,
      spotlightComment: spotlightComment.trim() ? spotlightComment.trim() : null,
    };
    const res = await fetch("/api/public/submit", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const data = (await res.json().catch(() => null)) as { error?: string } | null;
      setError(data?.error ?? "Submission failed.");
      setStatus("error");
      return;
    }
    setStatus("success");
  }

  if (cycle === "loading") {
    return (
      <div className="rounded-3xl border border-black/10 bg-white p-8 shadow-sm">
        <p className="text-[color:var(--nsi-ink-soft)]">Loading check-in…</p>
      </div>
    );
  }

  if (surveyMode && cycle) {
    const questions = cycle.surveyQuestions as SurveyQuestion[];
    return (
      <div className="rounded-3xl border border-black/10 bg-white p-8 shadow-sm">
        <h2 className="font-serif text-2xl font-semibold tracking-tight text-[color:var(--nsi-green)]">
          How stable does Nigeria feel to you right now?
        </h2>
        <p className="mt-2 text-sm text-black/65">
          Rate each pillar from 1 (very unstable) to 5 (very stable). This check-in stores{" "}
          <span className="font-medium">no personal information</span>.
        </p>
        <form className="mt-8 space-y-6" onSubmit={submitSurvey}>
          {questions.map((q) => (
            <fieldset key={q.pillarKey} className="rounded-2xl border border-black/10 bg-[color:var(--nsi-paper)] p-5">
              <legend className="text-sm font-medium text-black/80">{q.questionText}</legend>
              <div className="mt-3 flex flex-wrap gap-3">
                {[1, 2, 3, 4, 5].map((n) => {
                  const checked = pillarValues[q.pillarKey] === n;
                  return (
                    <label
                      key={n}
                      className={`flex cursor-pointer items-center gap-2 rounded-full border px-4 py-2 text-sm transition ${
                        checked
                          ? "border-[color:var(--nsi-green)] bg-[color:var(--nsi-green)] text-white"
                          : "border-black/15 bg-white hover:bg-black/[.03]"
                      }`}
                    >
                      <input
                        type="radio"
                        name={q.pillarKey}
                        value={n}
                        checked={checked}
                        onChange={() => setPillarValues((prev) => ({ ...prev, [q.pillarKey]: n }))}
                        className="sr-only"
                      />
                      {n}
                    </label>
                  );
                })}
              </div>
            </fieldset>
          ))}
          {status === "success" ? (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm text-emerald-800">
              Thanks — your check-in has been recorded.
            </div>
          ) : null}
          {status === "error" && error ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-800">
              {error}
            </div>
          ) : null}
          <button
            className="rounded-xl bg-[color:var(--nsi-green)] px-6 py-3 text-sm font-medium text-white hover:opacity-95 disabled:opacity-60"
            type="submit"
            disabled={!canSubmitSurvey || status === "submitting"}
          >
            {status === "submitting" ? "Submitting…" : "Submit check-in"}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-black/10 bg-white p-8 shadow-sm">
      <h2 className="font-serif text-2xl font-semibold tracking-tight text-[color:var(--nsi-green)]">
        How stable does Nigeria feel to you right now?
      </h2>
      <p className="mt-2 text-sm text-black/65">
        This check-in stores <span className="font-medium">no personal information</span>. Please do not include names,
        phone numbers, or addresses.
      </p>

      <form className="mt-8 space-y-8" onSubmit={submitLegacy}>
        <div className="rounded-2xl border border-black/10 bg-[color:var(--nsi-paper)] p-6">
          <div className="flex items-end justify-between gap-3">
            <div>
              <div className="text-sm font-medium text-black/70">Stability score</div>
              <div className="mt-1 text-xs text-black/55">1 = very unstable, 10 = very stable</div>
            </div>
            <div className="text-3xl font-semibold text-[color:var(--nsi-green)]">
              {stabilityScore}
              <span className="text-base text-black/50">/10</span>
            </div>
          </div>
          <input
            className="mt-4 w-full accent-[color:var(--nsi-green)]"
            type="range"
            min={1}
            max={10}
            value={stabilityScore}
            onChange={(e) => setStabilityScore(Number(e.target.value))}
          />
        </div>

        <div>
          <div className="text-sm font-medium text-black/70">Mood</div>
          <div className="mt-3 flex flex-wrap gap-2">
            {MOODS.map((m) => {
              const active = m === mood;
              return (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMood(m)}
                  className={[
                    "rounded-full px-4 py-2 text-sm transition",
                    active
                      ? "bg-[color:var(--nsi-green)] text-white"
                      : "border border-black/15 bg-white hover:bg-black/[.03]",
                  ].join(" ")}
                >
                  {m}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <label className="block">
            <span className="text-sm font-medium text-black/70">One word to describe Nigeria today</span>
            <input
              className="mt-2 w-full rounded-xl border border-black/10 bg-white px-4 py-3 outline-none focus:border-[color:var(--nsi-green)]"
              value={oneWord}
              onChange={(e) => setOneWord(e.target.value)}
              placeholder="e.g. steady, tense, hopeful…"
              maxLength={40}
              required
            />
          </label>
        </div>

        <div className="rounded-2xl border border-black/10 bg-white p-6">
          <div className="text-sm font-medium text-black/70">State spotlight (optional)</div>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <label className="block">
              <span className="text-xs font-medium text-black/60">State</span>
              <select
                className="mt-1 w-full rounded-xl border border-black/10 bg-white px-4 py-3 outline-none focus:border-[color:var(--nsi-green)]"
                value={spotlightState}
                onChange={(e) => setSpotlightState(e.target.value)}
              >
                <option value="">Select a state</option>
                {NIGERIAN_STATES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="text-xs font-medium text-black/60">Tags</span>
              <div className="mt-2 flex flex-wrap gap-2">
                {SPOTLIGHT_TAGS.map((t) => {
                  const active = spotlightTags.includes(t);
                  return (
                    <button
                      key={t}
                      type="button"
                      onClick={() =>
                        setSpotlightTags((prev) =>
                          prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]
                        )
                      }
                      className={[
                        "rounded-full px-3 py-1.5 text-xs transition",
                        active
                          ? "bg-[color:var(--nsi-gold)] text-black"
                          : "border border-black/15 bg-white hover:bg-black/[.03]",
                      ].join(" ")}
                    >
                      {t}
                    </button>
                  );
                })}
              </div>
            </label>
          </div>

          <label className="mt-4 block">
            <span className="text-xs font-medium text-black/60">Comment (optional)</span>
            <textarea
              className="mt-1 w-full resize-y rounded-xl border border-black/10 bg-white px-4 py-3 outline-none focus:border-[color:var(--nsi-green)]"
              value={spotlightComment}
              onChange={(e) => setSpotlightComment(e.target.value)}
              rows={3}
              placeholder="Keep it anonymous (no names / numbers)."
              maxLength={600}
            />
          </label>
        </div>

        {status === "success" ? (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm text-emerald-800">
            Thanks — your check-in has been recorded.
          </div>
        ) : null}

        {status === "error" && error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-800">
            {error}
          </div>
        ) : null}

        <button
          className="rounded-xl bg-[color:var(--nsi-green)] px-6 py-3 text-sm font-medium text-white hover:opacity-95 disabled:opacity-60"
          type="submit"
          disabled={!canSubmitLegacy || status === "submitting"}
        >
          {status === "submitting" ? "Submitting…" : "Submit check-in"}
        </button>
      </form>
    </div>
  );
}
