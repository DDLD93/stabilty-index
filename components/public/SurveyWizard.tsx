"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { MOODS, PILLAR_KEYS, NIGERIAN_STATES, SPOTLIGHT_TAGS } from "@/lib/constants";
import { getClientDeviceInfo } from "@/lib/clientDeviceInfo";
import { getDeviceHash } from "@/lib/deviceHash";
import { normalizeRefQueryParam } from "@/lib/agentReferrerCode";
import { PillarEditorialGraphic, NSIShieldMark } from "@/components/public/icons";

export type SurveyQuestion = {
  pillarKey: string;
  pillarLabel: string;
  questionText: string;
};

export type Cycle = {
  id: string;
  monthYear: string;
  surveyQuestions: SurveyQuestion[];
};

const SCALE = [
  { value: 1, label: "Very Unstable" },
  { value: 2, label: "Fragile" },
  { value: 3, label: "Moderate" },
  { value: 4, label: "Stable" },
  { value: 5, label: "Very Stable" },
] as const;

const PILLAR_STEPS = 5;
const TOTAL_STEPS = 6; // intro + 5 pillars + optional spotlight

export function SurveyWizard() {
  const searchParams = useSearchParams();
  const refFromUrl = normalizeRefQueryParam(searchParams.get("ref"));
  /** Only set when `/api/public/agent-by-code` confirms an active agent (used on submit). */
  const [referrerCodeToSubmit, setReferrerCodeToSubmit] = useState<string | null>(null);
  const [refLabel, setRefLabel] = useState<string | null>(null);
  const [refCheckDone, setRefCheckDone] = useState(!refFromUrl);

  const [cycle, setCycle] = useState<Cycle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState(0);
  const [pillarResponses, setPillarResponses] = useState<Record<string, number>>({});
  const [mood, setMood] = useState<string | null>(null);
  const [oneWord, setOneWord] = useState("");
  const [spotlightState, setSpotlightState] = useState<string | null>(null);
  const [spotlightTags, setSpotlightTags] = useState<string[]>([]);
  const [spotlightComment, setSpotlightComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [deviceHash, setDeviceHash] = useState<string | null>(null);
  const [alreadySubmitted, setAlreadySubmitted] = useState(false);

  useEffect(() => {
    if (!refFromUrl) {
      setRefLabel(null);
      setReferrerCodeToSubmit(null);
      setRefCheckDone(true);
      return;
    }
    setRefCheckDone(false);
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/public/agent-by-code?code=${encodeURIComponent(refFromUrl)}`);
        const data = (await res.json()) as { valid?: boolean; displayLabel?: string };
        if (cancelled) return;
        if (data.valid && data.displayLabel) {
          setRefLabel(data.displayLabel);
          setReferrerCodeToSubmit(refFromUrl);
        } else {
          setRefLabel(null);
          setReferrerCodeToSubmit(null);
        }
      } catch {
        if (!cancelled) {
          setRefLabel(null);
          setReferrerCodeToSubmit(null);
        }
      } finally {
        if (!cancelled) setRefCheckDone(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [refFromUrl]);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setError(null);
      const hash = getDeviceHash();
      if (!cancelled) setDeviceHash(hash);
      try {
        const url = hash ? `/api/public/cycle?deviceHash=${encodeURIComponent(hash)}` : "/api/public/cycle";
        const res = await fetch(url);
        const data = (await res.json()) as { cycle: Cycle | null; alreadySubmitted?: boolean };
        if (cancelled) return;
        if (data.alreadySubmitted === true) {
          setAlreadySubmitted(true);
          setLoading(false);
          return;
        }
        if (!data.cycle || !Array.isArray(data.cycle.surveyQuestions) || data.cycle.surveyQuestions.length !== 5) {
          setCycle(null);
          return;
        }
        setCycle(data.cycle);
      } catch {
        if (!cancelled) setError("Failed to load survey.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const setPillar = (key: string, value: number) => {
    setPillarResponses((prev) => ({ ...prev, [key]: value }));
  };

  const hasAllPillarAnswers =
    PILLAR_KEYS.every((k) => typeof pillarResponses[k] === "number" && pillarResponses[k] >= 1 && pillarResponses[k] <= 5);

  const goNext = () => {
    if (step < TOTAL_STEPS) setStep((s) => s + 1);
  };

  const goBack = () => {
    if (step > 0) setStep((s) => s - 1);
  };

  const toggleTag = (tag: string) => {
    setSpotlightTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : prev.length >= 8 ? prev : [...prev, tag]
    );
  };

  const handleSubmit = async () => {
    if (!cycle || !hasAllPillarAnswers) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      const deviceInfo = getClientDeviceInfo();
      const res = await fetch("/api/public/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...(deviceHash && { deviceHash }),
          ...(referrerCodeToSubmit && { referrerCode: referrerCodeToSubmit }),
          ...(deviceInfo && { deviceInfo }),
          pillarResponses,
          mood: mood || null,
          oneWord: oneWord.trim() || null,
          spotlightState: spotlightState || null,
          spotlightTags: spotlightTags.length ? spotlightTags : undefined,
          spotlightComment: spotlightComment.trim() || undefined,
        }),
      });
      const data = (await res.json().catch(() => null)) as { error?: string } | null;
      if (!res.ok) {
        setSubmitError(data?.error ?? "Submission failed.");
        return;
      }
      setSubmitted(true);
    } catch {
      setSubmitError("Submission failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto w-full rounded-[3px] border border-[color:var(--nsi-rule-strong)] bg-white p-12 text-center shadow-sm">
        <div className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-[2px] bg-[color:var(--nsi-paper-2)] text-[color:var(--nsi-green)]">
          <NSIShieldMark className="h-5 w-5 animate-pulse" />
        </div>
        <p className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-[color:var(--nsi-ink-muted)]">
          Loading active survey cycle…
        </p>
      </div>
    );
  }

  if (alreadySubmitted) {
    return (
      <div className="mx-auto w-full rounded-[3px] border border-[color:var(--nsi-rule-strong)] bg-white p-10 sm:p-12 text-center shadow-sm">
        <span className="inline-block rounded-[2px] border border-[color:var(--nsi-gold)]/40 bg-[color:var(--nsi-gold-soft)] px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-[color:var(--nsi-ink)]">
          Cycle Response Recorded
        </span>
        <h2 className="mt-4 font-serif text-2xl font-bold text-[color:var(--nsi-ink)]">
          Already Submitted for This Cycle
        </h2>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-[color:var(--nsi-ink-soft)]">
          Your device has already recorded a response for the active reporting cycle. Each device may submit once per monthly cycle to preserve statistical integrity.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/" className="btn-nsi-primary">
            Return to Dashboard
          </Link>
          <Link href="/reports" className="btn-nsi-outline">
            Explore Published Reports
          </Link>
        </div>
      </div>
    );
  }

  if (error || !cycle) {
    return (
      <div className="mx-auto w-full rounded-[3px] border border-[color:var(--nsi-rule-strong)] bg-white p-10 sm:p-12 text-center shadow-sm">
        <span className="inline-block rounded-[2px] border border-[color:var(--nsi-rule-strong)] bg-[color:var(--nsi-paper-2)] px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-[color:var(--nsi-ink-muted)]">
          Collection Closed
        </span>
        <h2 className="mt-4 font-serif text-2xl font-bold text-[color:var(--nsi-ink)]">
          Survey Instrument Not Currently Open
        </h2>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-[color:var(--nsi-ink-soft)]">
          {error ?? "Field data collection for the current cycle may be closed for tabulation or the next cycle is being configured. Please check back shortly."}
        </p>
        <div className="mt-8 flex justify-center">
          <Link href="/" className="btn-nsi-primary">
            Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="mx-auto w-full rounded-[3px] border-t-4 border-t-[color:var(--nsi-green)] border border-[color:var(--nsi-rule-strong)] bg-white p-10 sm:p-12 text-center shadow-sm">
        <span className="inline-block rounded-[2px] bg-[color:var(--nsi-green)]/10 px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-[color:var(--nsi-green)]">
          Submission Confirmed · {cycle.monthYear}
        </span>
        <h2 className="mt-4 font-serif text-3xl font-bold text-[color:var(--nsi-ink)]">
          Thank You for Contributing
        </h2>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-[color:var(--nsi-ink-soft)]">
          Your anonymous ratings have been logged into the national ledger for the <strong>{cycle.monthYear}</strong> edition of the Nigeria Stability Index.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/" className="btn-nsi-primary">
            Back to National Dashboard
          </Link>
          <Link href="/reports" className="btn-nsi-outline">
            View Published Reports
          </Link>
        </div>
      </div>
    );
  }

  const questions = cycle.surveyQuestions;

  return (
    <div className="mx-auto w-full overflow-hidden rounded-[3px] border border-[color:var(--nsi-rule-strong)] bg-white shadow-sm">
      {/* Top Instrument Status Bar */}
      <div className="border-b border-[color:var(--nsi-rule)] bg-[color:var(--nsi-paper-2)] px-5 py-4 sm:px-8">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <span className="inline-block h-2 w-2 rounded-full bg-[color:var(--nsi-green)]" />
            <span className="font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-[color:var(--nsi-ink)]">
              {step === 0
                ? "Instrument Briefing"
                : step <= PILLAR_STEPS
                ? `Pillar Assessment 0${step} / 0${PILLAR_STEPS}`
                : "Sub-National & Sentiment Context (Optional)"}
            </span>
          </div>
          <span className="rounded-[2px] border border-[color:var(--nsi-rule-strong)] bg-white px-2.5 py-0.5 font-mono text-[11px] font-bold text-[color:var(--nsi-green)]">
            Cycle: {cycle.monthYear}
          </span>
        </div>

        {/* Segmented Progress Bar */}
        <div className="mt-3.5 grid grid-cols-6 gap-1.5" aria-hidden>
          {Array.from({ length: TOTAL_STEPS }).map((_, idx) => {
            const targetStep = idx + 1;
            const isCompleted = step > targetStep || (step === targetStep && targetStep === TOTAL_STEPS);
            const isCurrent = step === targetStep;
            return (
              <div
                key={idx}
                className={`h-1.5 rounded-[1px] transition-all ${
                  isCurrent
                    ? "bg-[color:var(--nsi-gold)]"
                    : isCompleted || step > idx
                    ? "bg-[color:var(--nsi-green)]"
                    : "bg-black/10"
                }`}
              />
            );
          })}
        </div>

        {refFromUrl && refCheckDone && refLabel && (
          <p className="mt-3 border-t border-[color:var(--nsi-rule)] pt-2.5 font-mono text-[11px] text-[color:var(--nsi-ink-soft)]">
            Field Enumerator / Referrer Attributed:{" "}
            <span className="font-bold text-[color:var(--nsi-green)]">{refLabel}</span>
          </p>
        )}
        {refFromUrl && refCheckDone && !refLabel && (
          <p className="mt-3 border-t border-[color:var(--nsi-rule)] pt-2.5 font-mono text-[11px] text-[color:var(--nsi-terracotta)]">
            Note: Referral code is inactive. Your response will still be recorded anonymously in the national tally.
          </p>
        )}
      </div>

      {/* Main Step Content */}
      <div className="p-6 sm:p-10">
        {step === 0 && (
          <div>
            <p className="nsi-kicker">Field Survey Protocol</p>
            <h2 className="mt-2 font-serif text-2xl font-bold text-[color:var(--nsi-ink)] sm:text-3xl">
              Share How Nigeria Feels to You Today
            </h2>
            <p className="mt-4 text-base leading-relaxed text-[color:var(--nsi-ink-soft)]">
              This monthly instrument measures public perception across the five core pillars of the Nigeria Stability Index. You will rate five concise questions on a <strong>1 to 5 stability scale</strong>, followed by an optional state-level field report.
            </p>

            <div className="mt-6 grid gap-3 rounded-[3px] border border-[color:var(--nsi-rule)] bg-[color:var(--nsi-paper)] p-5 sm:grid-cols-3">
              <div>
                <div className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-[color:var(--nsi-ink-muted)]">
                  01 / Structure
                </div>
                <div className="mt-1 text-sm font-semibold text-[color:var(--nsi-ink)]">
                  5 Core Pillar Ratings
                </div>
              </div>
              <div>
                <div className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-[color:var(--nsi-ink-muted)]">
                  02 / Duration
                </div>
                <div className="mt-1 text-sm font-semibold text-[color:var(--nsi-ink)]">
                  Under 90 Seconds
                </div>
              </div>
              <div>
                <div className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-[color:var(--nsi-ink-muted)]">
                  03 / Privacy
                </div>
                <div className="mt-1 text-sm font-semibold text-[color:var(--nsi-ink)]">
                  100% Anonymous Ledger
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-end border-t border-[color:var(--nsi-rule)] pt-6">
              <button
                type="button"
                onClick={goNext}
                className="btn-nsi-primary"
              >
                Begin Pillar Assessment →
              </button>
            </div>
          </div>
        )}

        {step >= 1 && step <= PILLAR_STEPS && questions[step - 1] && (() => {
          const q = questions[step - 1];
          const selectedVal = pillarResponses[q.pillarKey];
          return (
            <div>
              {/* Architectural Pillar Graphic Card */}
              <div className="overflow-hidden rounded-[3px] border border-[color:var(--nsi-rule-strong)] bg-[color:var(--nsi-paper)]">
                <div className="relative h-36 w-full border-b border-[color:var(--nsi-rule)]">
                  <PillarEditorialGraphic
                    title={q.pillarKey}
                    score={selectedVal ? selectedVal * 2 : undefined}
                  />
                </div>
                <div className="flex items-center justify-between bg-white px-5 py-3">
                  <span className="font-mono text-xs font-bold uppercase tracking-[0.16em] text-[color:var(--nsi-green)]">
                    Pillar 0{step}: {q.pillarLabel}
                  </span>
                  <span className="font-mono text-[11px] text-[color:var(--nsi-ink-muted)]">
                    Scale 1 (Least Stable) – 5 (Most Stable)
                  </span>
                </div>
              </div>

              <h2 className="mt-7 font-serif text-xl font-bold leading-snug text-[color:var(--nsi-ink)] sm:text-2xl">
                {q.questionText}
              </h2>
              <p className="mt-1.5 text-sm text-[color:var(--nsi-ink-soft)]">
                Select a score from 1 to 5 based on your direct observation and lived experience this month.
              </p>

              {/* 1–5 Rating Scale Buttons */}
              <div className="mt-7 grid grid-cols-5 gap-2 sm:gap-3">
                {SCALE.map(({ value: n, label }) => {
                  const isSelected = selectedVal === n;
                  return (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setPillar(q.pillarKey, n)}
                      className={`group flex flex-col items-center justify-center rounded-[3px] border p-3 text-center transition-all sm:py-4 ${
                        isSelected
                          ? "border-[color:var(--nsi-green)] bg-[color:var(--nsi-green)] text-white shadow-sm"
                          : "border-[color:var(--nsi-rule-strong)] bg-[color:var(--nsi-paper)] text-[color:var(--nsi-ink)] hover:border-[color:var(--nsi-green)] hover:bg-white"
                      }`}
                    >
                      <span className="font-mono text-xl font-bold sm:text-2xl">{n}</span>
                      <span
                        className={`mt-1 hidden text-[10px] font-medium uppercase tracking-wider sm:block ${
                          isSelected ? "text-white/85" : "text-[color:var(--nsi-ink-muted)]"
                        }`}
                      >
                        {label}
                      </span>
                    </button>
                  );
                })}
              </div>
              <div className="mt-2 flex justify-between font-mono text-[10px] uppercase tracking-wider text-[color:var(--nsi-ink-muted)] sm:hidden">
                <span>1 · Very Unstable</span>
                <span>5 · Very Stable</span>
              </div>

              <div className="mt-9 flex items-center justify-between border-t border-[color:var(--nsi-rule)] pt-6">
                <button
                  type="button"
                  onClick={goBack}
                  className="btn-nsi-outline"
                >
                  ← Previous
                </button>
                <button
                  type="button"
                  onClick={goNext}
                  disabled={selectedVal == null}
                  className="btn-nsi-primary disabled:opacity-40"
                >
                  {step === PILLAR_STEPS ? "Continue to Context →" : "Next Pillar →"}
                </button>
              </div>
            </div>
          );
        })()}

        {step === TOTAL_STEPS && (
          <div>
            <p className="nsi-kicker">Final Step · Field Context</p>
            <h2 className="mt-1 font-serif text-2xl font-bold text-[color:var(--nsi-ink)]">
              National Mood & State Spotlight (Optional)
            </h2>
            <p className="mt-2 text-sm text-[color:var(--nsi-ink-soft)]">
              Add your prevailing mood, a single word summary, or a state-specific field note to enrich qualitative analysis.
            </p>

            <div className="mt-7 space-y-6">
              <div>
                <label className="block font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-[color:var(--nsi-ink)]">
                  How are you feeling about Nigeria right now? (Optional)
                </label>
                <div className="mt-2.5 flex flex-wrap gap-2">
                  {MOODS.map((m) => {
                    const active = m === mood;
                    return (
                      <button
                        key={m}
                        type="button"
                        onClick={() => setMood(active ? null : m)}
                        className={`rounded-[2px] border px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] transition-all ${
                          active
                            ? "border-[color:var(--nsi-green)] bg-[color:var(--nsi-green)] text-white"
                            : "border-[color:var(--nsi-rule-strong)] bg-[color:var(--nsi-paper)] text-[color:var(--nsi-ink-soft)] hover:border-[color:var(--nsi-green)] hover:bg-white"
                        }`}
                      >
                        {m}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="block font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-[color:var(--nsi-ink)]">
                    One Word to Describe Nigeria Today
                  </label>
                  <input
                    type="text"
                    value={oneWord}
                    onChange={(e) => setOneWord(e.target.value.slice(0, 40))}
                    maxLength={40}
                    placeholder="e.g. Resilient, Tense, Hopeful…"
                    className="admin-input mt-2 w-full"
                  />
                  <p className="mt-1 font-mono text-[10px] text-[color:var(--nsi-ink-muted)]">
                    {oneWord.length}/40 characters
                  </p>
                </div>

                <div>
                  <label className="block font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-[color:var(--nsi-ink)]">
                    State / Territory Focus
                  </label>
                  <select
                    value={spotlightState ?? ""}
                    onChange={(e) => setSpotlightState(e.target.value || null)}
                    className="admin-select mt-2 w-full"
                  >
                    <option value="">— Select State (Optional) —</option>
                    {NIGERIAN_STATES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-[color:var(--nsi-ink)]">
                  Thematic Tags (Optional, max 8)
                </label>
                <div className="mt-2.5 flex flex-wrap gap-1.5">
                  {SPOTLIGHT_TAGS.map((tag) => {
                    const active = spotlightTags.includes(tag);
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => toggleTag(tag)}
                        className={`rounded-[2px] border px-3 py-1.5 text-xs font-medium transition-all ${
                          active
                            ? "border-[color:var(--nsi-gold)] bg-[color:var(--nsi-gold-soft)] font-semibold text-[color:var(--nsi-ink)]"
                            : "border-[color:var(--nsi-rule-strong)] bg-white text-[color:var(--nsi-ink-soft)] hover:bg-[color:var(--nsi-paper)]"
                        }`}
                      >
                        {tag}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-[color:var(--nsi-ink)]">
                  Field Observation / Comment (Optional, max 600 chars)
                </label>
                <textarea
                  value={spotlightComment}
                  onChange={(e) => setSpotlightComment(e.target.value.slice(0, 600))}
                  rows={3}
                  className="admin-input mt-2 w-full"
                  placeholder="Share any specific local context (please do not include personal names or phone numbers)…"
                />
                <p className="mt-1 font-mono text-[10px] text-[color:var(--nsi-ink-muted)]">
                  {spotlightComment.length}/600 characters
                </p>
              </div>
            </div>

            {submitError && (
              <div className="mt-5 rounded-[3px] border border-red-300 bg-red-50 px-4 py-3 text-sm font-medium text-red-800">
                {submitError}
              </div>
            )}

            <div className="mt-9 flex items-center justify-between border-t border-[color:var(--nsi-rule)] pt-6">
              <button
                type="button"
                onClick={goBack}
                className="btn-nsi-outline"
              >
                ← Back
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitting || !hasAllPillarAnswers}
                className="btn-nsi-primary disabled:opacity-50"
              >
                {submitting ? "Recording Submission…" : "Submit Official Response"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
