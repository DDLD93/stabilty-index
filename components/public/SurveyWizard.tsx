"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { PILLAR_KEYS, NIGERIAN_STATES, SPOTLIGHT_TAGS } from "@/lib/constants";
import { getDeviceHash } from "@/lib/deviceHash";

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

const SCALE = [1, 2, 3, 4, 5] as const;
const PILLAR_STEPS = 5;
const TOTAL_STEPS = 6; // intro + 5 pillars + optional spotlight

function getPillarImage(pillarKey: string): string {
  const t = pillarKey.toLowerCase();
  if (t.includes("security")) return "/pillars/security.png";
  if (t.includes("econom")) return "/pillars/economy.png";
  if (t.includes("invest")) return "/pillars/investor.png";
  if (t.includes("govern")) return "/pillars/governance.png";
  return "/pillars/social.png";
}

export function SurveyWizard() {
  const [cycle, setCycle] = useState<Cycle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState(0);
  const [pillarResponses, setPillarResponses] = useState<Record<string, number>>({});
  const [spotlightState, setSpotlightState] = useState<string | null>(null);
  const [spotlightTags, setSpotlightTags] = useState<string[]>([]);
  const [spotlightComment, setSpotlightComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [deviceHash, setDeviceHash] = useState<string | null>(null);
  const [alreadySubmitted, setAlreadySubmitted] = useState(false);

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
      const res = await fetch("/api/public/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...(deviceHash && { deviceHash }),
          pillarResponses,
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
      <div className="mx-auto max-w-xl rounded-2xl border border-black/10 bg-white p-12 text-center shadow-lg">
        <p className="text-[color:var(--nsi-ink-soft)]">Loading survey…</p>
      </div>
    );
  }

  if (alreadySubmitted) {
    return (
      <div className="mx-auto max-w-xl rounded-2xl border border-black/10 bg-white p-12 text-center shadow-lg">
        <h2 className="font-serif text-xl font-semibold text-[color:var(--nsi-ink)]">Already submitted</h2>
        <p className="mt-4 text-[color:var(--nsi-ink-soft)]">You&apos;ve already submitted for this cycle.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link
            href="/"
            className="inline-flex rounded-xl bg-[color:var(--nsi-green)] px-6 py-3 text-sm font-semibold text-white transition-all hover:brightness-110"
          >
            Back to home
          </Link>
          <Link
            href="/reports"
            className="inline-flex rounded-xl border border-black/15 bg-white px-6 py-3 text-sm font-semibold text-[color:var(--nsi-ink)] transition-all hover:bg-black/5"
          >
            View reports
          </Link>
        </div>
      </div>
    );
  }

  if (error || !cycle) {
    return (
      <div className="mx-auto max-w-xl rounded-2xl border border-black/10 bg-white p-12 text-center shadow-lg">
        <h2 className="font-serif text-xl font-semibold text-[color:var(--nsi-ink)]">Survey is not available right now</h2>
        <p className="mt-4 text-[color:var(--nsi-ink-soft)]">
          {error ?? "Collection may be closed or the survey is still being set up. Check back later."}
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex rounded-xl bg-[color:var(--nsi-green)] px-6 py-3 text-sm font-semibold text-white transition-all hover:brightness-110"
        >
          Back to home
        </Link>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="mx-auto max-w-xl rounded-2xl border border-black/10 bg-white p-12 text-center shadow-lg">
        <h2 className="font-serif text-2xl font-semibold text-[color:var(--nsi-ink)]">Thank you</h2>
        <p className="mt-4 text-[color:var(--nsi-ink-soft)]">Your responses have been recorded and help shape the Nigeria Stability Index.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link
            href="/"
            className="inline-flex rounded-xl bg-[color:var(--nsi-green)] px-6 py-3 text-sm font-semibold text-white transition-all hover:brightness-110"
          >
            Back to home
          </Link>
          <Link
            href="/reports"
            className="inline-flex rounded-xl border border-black/15 bg-white px-6 py-3 text-sm font-semibold text-[color:var(--nsi-ink)] transition-all hover:bg-black/5"
          >
            View reports
          </Link>
        </div>
      </div>
    );
  }

  const questions = cycle.surveyQuestions;

  return (
    <div className="mx-auto max-w-xl rounded-2xl border border-black/10 bg-white shadow-lg">
      <div className="border-b border-black/5 bg-black/5 px-6 py-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-bold uppercase tracking-widest text-[color:var(--nsi-ink)]">
            {step === 0 ? "Intro" : step <= PILLAR_STEPS ? `Step ${step} of ${TOTAL_STEPS}` : "Optional"}
          </span>
          <span className="text-xs text-[color:var(--nsi-ink-soft)]">{cycle.monthYear}</span>
        </div>
      </div>

      <div className="p-8">
        {step === 0 && (
          <>
            <h2 className="font-serif text-2xl font-semibold text-[color:var(--nsi-ink)]">
              Share how Nigeria feels to you
            </h2>
            <p className="mt-4 text-[color:var(--nsi-ink-soft)]">
              One question per pillar — your voice shapes the index. You&apos;ll answer five short questions (scale 1–5), then optionally add a state or comment.
            </p>
            <div className="mt-10 flex justify-end">
              <button
                type="button"
                onClick={goNext}
                className="rounded-xl bg-[color:var(--nsi-green)] px-8 py-3 text-sm font-semibold text-white transition-all hover:brightness-110"
              >
                Start
              </button>
            </div>
          </>
        )}

        {step >= 1 && step <= PILLAR_STEPS && questions[step - 1] && (() => {
          const q = questions[step - 1];
          const pillarImage = getPillarImage(q.pillarKey);
          return (
          <>
            <div className="flex items-center gap-4 rounded-xl border border-black/5 bg-[color:var(--nsi-paper-2)] p-4">
              <div className="relative h-12 w-12 shrink-0 overflow-hidden">
                <Image
                  src={pillarImage}
                  alt={q.pillarLabel}
                  fill
                  className="object-contain"
                />
              </div>
              <span className="text-sm font-bold uppercase tracking-widest text-[color:var(--nsi-ink)]">
                {q.pillarLabel}
              </span>
            </div>
            <h2 className="mt-6 font-serif text-xl font-semibold text-[color:var(--nsi-ink)]">
              {q.questionText}
            </h2>
            <p className="mt-1 text-sm text-[color:var(--nsi-ink-soft)]">
              Choose 1 (least stable) to 5 (most stable).
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              {SCALE.map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setPillar(questions[step - 1].pillarKey, n)}
                  className={`min-w-[3rem] rounded-xl border-2 px-6 py-4 text-lg font-bold transition-all ${
                    pillarResponses[questions[step - 1].pillarKey] === n
                      ? "border-[color:var(--nsi-green)] bg-[color:var(--nsi-green)]/10 text-[color:var(--nsi-green)]"
                      : "border-black/15 bg-white text-[color:var(--nsi-ink-soft)] hover:border-black/25 hover:bg-black/5"
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
            <div className="mt-10 flex justify-between">
              <button
                type="button"
                onClick={goBack}
                className="rounded-xl border border-black/15 px-6 py-2.5 text-sm font-medium text-[color:var(--nsi-ink)] transition-all hover:bg-black/5"
              >
                Back
              </button>
              {pillarResponses[questions[step - 1].pillarKey] != null && (
                <button
                  type="button"
                  onClick={goNext}
                  className="rounded-xl bg-[color:var(--nsi-green)] px-6 py-2.5 text-sm font-semibold text-white transition-all hover:brightness-110"
                >
                  Next
                </button>
              )}
            </div>
          </>
          );
        })()}

        {step === TOTAL_STEPS && (
          <>
            <h2 className="font-serif text-xl font-semibold text-[color:var(--nsi-ink)]">Anything else?</h2>
            <p className="mt-2 text-sm text-[color:var(--nsi-ink-soft)]">
              Optional: highlight a state, add tags, or a short comment.
            </p>
            <div className="mt-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-[color:var(--nsi-ink)]">State</label>
                <select
                  value={spotlightState ?? ""}
                  onChange={(e) => setSpotlightState(e.target.value || null)}
                  className="mt-1.5 w-full rounded-xl border border-black/15 bg-white px-4 py-2.5 text-[color:var(--nsi-ink)] focus:border-[color:var(--nsi-green)] focus:outline-none focus:ring-1 focus:ring-[color:var(--nsi-green)]"
                >
                  <option value="">— None —</option>
                  {NIGERIAN_STATES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[color:var(--nsi-ink)]">Tags (optional, max 8)</label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {SPOTLIGHT_TAGS.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleTag(tag)}
                      className={`rounded-lg border px-3 py-1.5 text-sm transition-all ${
                        spotlightTags.includes(tag)
                          ? "border-[color:var(--nsi-green)] bg-[color:var(--nsi-green)]/10 text-[color:var(--nsi-green)]"
                          : "border-black/15 text-[color:var(--nsi-ink-soft)] hover:bg-black/5"
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[color:var(--nsi-ink)]">Comment (optional, max 600 chars)</label>
                <textarea
                  value={spotlightComment}
                  onChange={(e) => setSpotlightComment(e.target.value.slice(0, 600))}
                  rows={3}
                  className="mt-1.5 w-full rounded-xl border border-black/15 bg-white px-4 py-2.5 text-[color:var(--nsi-ink)] placeholder:text-black/40 focus:border-[color:var(--nsi-green)] focus:outline-none focus:ring-1 focus:ring-[color:var(--nsi-green)]"
                  placeholder="Any additional context…"
                />
                <p className="mt-1 text-xs text-[color:var(--nsi-ink-soft)]">{spotlightComment.length}/600</p>
              </div>
            </div>
            {submitError && (
              <p className="mt-4 text-sm text-red-600">{submitError}</p>
            )}
            <div className="mt-10 flex justify-between">
              <button
                type="button"
                onClick={goBack}
                className="rounded-xl border border-black/15 px-6 py-2.5 text-sm font-medium text-[color:var(--nsi-ink)] transition-all hover:bg-black/5"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitting || !hasAllPillarAnswers}
                className="rounded-xl bg-[color:var(--nsi-green)] px-8 py-2.5 text-sm font-semibold text-white transition-all hover:brightness-110 disabled:opacity-60"
              >
                {submitting ? "Submitting…" : "Submit"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
