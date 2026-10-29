"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { MOODS, PILLAR_KEYS, NIGERIAN_STATES, SPOTLIGHT_TAGS } from "@/lib/constants";
import { getClientDeviceInfo } from "@/lib/clientDeviceInfo";
import { getDeviceHash } from "@/lib/deviceHash";
import { normalizeRefQueryParam } from "@/lib/agentReferrerCode";

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
const SCALE_LABELS: Record<number, string> = {
  1: "Critical Distress",
  2: "Under Strain",
  3: "Moderate / Neutral",
  4: "Stable Progress",
  5: "Strong Stability",
};

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
  const searchParams = useSearchParams();
  const refFromUrl = normalizeRefQueryParam(searchParams.get("ref"));
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
        if (!cancelled) setError("Failed to initialize encrypted telemetry session.");
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
        setSubmitError(data?.error ?? "Telemetry submission failed.");
        return;
      }
      setSubmitted(true);
    } catch {
      setSubmitError("Network connection interrupted. Please re-submit.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="observatory-card p-12 text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-2 border-[#00f59b] border-t-transparent" />
        <p className="mt-4 font-mono text-xs text-slate-400">Loading sovereign survey parameters…</p>
      </div>
    );
  }

  if (alreadySubmitted) {
    return (
      <div className="observatory-card p-10 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-[#00f59b]/40 bg-[#00f59b]/15 text-[#00f59b]">
          ✓
        </div>
        <h2 className="mt-5 font-serif text-2xl font-bold text-white">Telemetry Already Logged</h2>
        <p className="mt-3 text-sm text-slate-400 max-w-md mx-auto">
          Your ground perspective for this cycle has been recorded. To protect index integrity, each device contributes once per monthly cycle.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link
            href="/"
            className="rounded-xl border border-[#00f59b] bg-[#00f59b] px-6 py-3 font-mono text-xs font-bold text-black shadow-[0_0_20px_rgba(0,245,155,0.3)] transition-all hover:bg-[#22ffb0]"
          >
            RETURN TO OBSERVATORY
          </Link>
          <Link
            href="/reports"
            className="rounded-xl border border-white/10 bg-white/5 px-6 py-3 font-mono text-xs font-semibold text-slate-300 transition-all hover:bg-white/10 hover:text-white"
          >
            VIEW PUBLISHED REPORTS
          </Link>
        </div>
      </div>
    );
  }

  if (error || !cycle) {
    return (
      <div className="observatory-card p-10 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-[#f59e0b]/40 bg-[#f59e0b]/15 text-[#f59e0b]">
          !
        </div>
        <h2 className="mt-5 font-serif text-2xl font-bold text-white">Survey Channel Closed</h2>
        <p className="mt-3 text-sm text-slate-400 max-w-md mx-auto">
          {error ?? "The data intake window for this monthly period is concluded or undergoing calibration. Check back for the upcoming cycle."}
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex rounded-xl border border-[#00f59b] bg-[#00f59b] px-6 py-3 font-mono text-xs font-bold text-black transition-all hover:bg-[#22ffb0]"
        >
          BACK TO HOME
        </Link>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="observatory-card p-10 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-[#00f59b] bg-[#00f59b]/20 text-[#00f59b] shadow-[0_0_25px_rgba(0,245,155,0.4)]">
          <span className="text-2xl font-bold">✓</span>
        </div>
        <h2 className="mt-6 font-serif text-3xl font-bold text-white">Telemetry Recorded</h2>
        <p className="mt-3 text-sm text-slate-300 max-w-lg mx-auto leading-relaxed">
          Thank you for strengthening democratic observability. Your submission has been securely anonymized 
          and integrated into the computation of the <strong className="text-[#00f59b]">{cycle.monthYear} Stability Index</strong>.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link
            href="/"
            className="rounded-xl border border-[#00f59b] bg-[#00f59b] px-7 py-3.5 font-mono text-xs font-bold text-black shadow-[0_0_20px_rgba(0,245,155,0.4)] transition-all hover:bg-[#22ffb0]"
          >
            OBSERVATORY DASHBOARD
          </Link>
          <Link
            href="/reports"
            className="rounded-xl border border-white/15 bg-white/5 px-7 py-3.5 font-mono text-xs font-semibold text-slate-200 transition-all hover:bg-white/10"
          >
            EXPLORE HISTORIC DOSSIERS
          </Link>
        </div>
      </div>
    );
  }

  const questions = cycle.surveyQuestions;

  return (
    <div className="observatory-card overflow-hidden">
      {/* Telemetry Header */}
      <div className="border-b border-[#00f59b]/15 bg-[#040e08]/90 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#00f59b]">
              {step === 0 ? "PROTOCOL INTRO" : step <= PILLAR_STEPS ? `PILLAR EVALUATION ${step} OF ${PILLAR_STEPS}` : "COMMUNITY SPOTLIGHT"}
            </span>
          </div>
          <span className="rounded bg-black/40 px-2.5 py-1 font-mono text-[11px] text-[#fbbf24] border border-[#f59e0b]/20">
            {cycle.monthYear.toUpperCase()}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-black/60">
          <div
            className="h-full bg-gradient-to-r from-[#00f59b] to-[#fbbf24] transition-all duration-300"
            style={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
          />
        </div>

        {refFromUrl && refCheckDone && refLabel && (
          <p className="mt-2.5 font-mono text-[11px] text-slate-400">
            Verified Partner Node: <span className="font-semibold text-[#00f59b]">{refLabel}</span>
          </p>
        )}
      </div>

      <div className="p-6 sm:p-10">
        {step === 0 && (
          <>
            <div className="flex items-center gap-3 mb-4">
              <span className="flex h-3 w-3 rounded-full bg-[#00f59b] animate-ping" />
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#00f59b]">
                INDEPENDENT CITIZEN AUDIT
              </span>
            </div>

            <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Evaluate National Stability
            </h2>
            <p className="mt-4 text-sm sm:text-base leading-relaxed text-slate-300">
              Your voice is critical. You will rate five core pillars on a 1 (Critical Distress) to 5 (Strong Stability) scale:
            </p>

            <div className="mt-6 space-y-2 font-mono text-xs text-slate-300">
              <div className="flex items-center gap-2 p-2 rounded-lg bg-black/30 border border-white/5">
                <span className="text-[#f43f5e]">1.</span> <strong>Security:</strong> Territorial defense, kidnapping containment, police safety
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-black/30 border border-white/5">
                <span className="text-[#38bdf8]">2.</span> <strong>FX & Economy:</strong> Naira value, inflation pressure, market prices
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-black/30 border border-white/5">
                <span className="text-[#fbbf24]">3.</span> <strong>Investor Trust:</strong> Business climate, infrastructure, commerce viability
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-black/30 border border-white/5">
                <span className="text-[#00f59b]">4.</span> <strong>Governance:</strong> Accountability, public services, policy coherence
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-black/30 border border-white/5">
                <span className="text-[#a78bfa]">5.</span> <strong>Social Stability:</strong> Community cohesion, food security, civic sentiment
              </div>
            </div>

            <div className="mt-8 flex justify-end">
              <button
                type="button"
                onClick={goNext}
                className="inline-flex items-center gap-2 rounded-xl border border-[#00f59b] bg-[#00f59b] px-8 py-3.5 font-mono text-xs font-bold text-black shadow-[0_0_20px_rgba(0,245,155,0.35)] transition-all hover:bg-[#22ffb0] hover:scale-105"
              >
                <span>COMMENCE EVALUATION</span>
                <span>→</span>
              </button>
            </div>
          </>
        )}

        {step >= 1 && step <= PILLAR_STEPS && questions[step - 1] && (() => {
          const q = questions[step - 1];
          const pillarImage = getPillarImage(q.pillarKey);
          const currentVal = pillarResponses[q.pillarKey];

          return (
            <>
              {/* Question visualizer banner */}
              <div className="overflow-hidden rounded-2xl border border-[#00f59b]/20 bg-[#040e08]/80 shadow-[inset_0_2px_10px_rgba(0,0,0,0.6)]">
                <div className="relative flex h-36 w-full items-center justify-center p-4">
                  <Image
                    src={pillarImage}
                    alt={q.pillarLabel}
                    fill
                    className="object-contain p-4 transition-transform duration-500 hover:scale-105"
                    priority
                  />
                </div>
                <div className="border-t border-[#00f59b]/15 bg-black/40 px-6 py-3 flex items-center justify-between">
                  <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#00f59b]">
                    {q.pillarLabel}
                  </span>
                  <span className="font-mono text-[11px] text-slate-400">
                    PILLAR {step} OF 5
                  </span>
                </div>
              </div>

              <h2 className="mt-8 font-serif text-xl sm:text-2xl font-bold tracking-tight text-white">
                {q.questionText}
              </h2>

              <p className="mt-2 font-mono text-xs text-slate-400">
                Rate on an empirical scale: 1 (Critical Distress) to 5 (Strong Stability).
              </p>

              {/* Glowing 1-5 Haptic Rating Scale */}
              <div className="mt-8 grid grid-cols-5 gap-2 sm:gap-3">
                {SCALE.map((n) => {
                  const isSelected = currentVal === n;
                  return (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setPillar(q.pillarKey, n)}
                      className={`group relative flex flex-col items-center justify-center rounded-xl border p-3 sm:p-5 transition-all duration-200 ${
                        isSelected
                          ? "border-[#00f59b] bg-[#00f59b]/20 shadow-[0_0_20px_rgba(0,245,155,0.4)] scale-105"
                          : "border-white/10 bg-black/40 hover:border-[#00f59b]/40 hover:bg-[#07190f]"
                      }`}
                    >
                      <span className={`font-mono text-2xl sm:text-3xl font-black ${isSelected ? "text-[#00f59b]" : "text-slate-300 group-hover:text-white"}`}>
                        {n}
                      </span>
                      <span className={`mt-1 font-mono text-[9px] uppercase tracking-wider text-center hidden sm:block ${isSelected ? "text-[#00f59b]" : "text-slate-500"}`}>
                        {SCALE_LABELS[n]}
                      </span>
                    </button>
                  );
                })}
              </div>

              {currentVal && (
                <div className="mt-4 text-center font-mono text-xs text-[#00f59b]">
                  Selected: <strong>{currentVal} — {SCALE_LABELS[currentVal]}</strong>
                </div>
              )}

              <div className="mt-10 flex items-center justify-between pt-4 border-t border-white/5">
                <button
                  type="button"
                  onClick={goBack}
                  className="rounded-xl border border-white/15 bg-white/5 px-6 py-2.5 font-mono text-xs font-semibold text-slate-300 transition-all hover:bg-white/10 hover:text-white"
                >
                  ← BACK
                </button>
                {currentVal != null && (
                  <button
                    type="button"
                    onClick={goNext}
                    className="rounded-xl border border-[#00f59b] bg-[#00f59b] px-7 py-2.5 font-mono text-xs font-bold text-black shadow-[0_0_15px_rgba(0,245,155,0.3)] transition-all hover:bg-[#22ffb0] hover:scale-105"
                  >
                    NEXT PILLAR →
                  </button>
                )}
              </div>
            </>
          );
        })()}

        {step === TOTAL_STEPS && (
          <>
            <div className="flex items-center gap-2 mb-3">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#fbbf24]">
                STEP 6: REGIONAL CONTEXT & CITIZEN PULSE (OPTIONAL)
              </span>
            </div>

            <h2 className="font-serif text-2xl font-bold tracking-tight text-white">
              Ground Perspectives
            </h2>
            <p className="mt-2 text-sm text-slate-300">
              Provide localized context to enrich regional intelligence analysis. All fields are non-mandatory.
            </p>

            <div className="mt-6 space-y-6">
              {/* Mood Selector */}
              <div>
                <label className="block font-mono text-xs font-semibold uppercase tracking-wider text-slate-300">
                  Primary State of Mind
                </label>
                <div className="mt-2.5 flex flex-wrap gap-2">
                  {MOODS.map((m) => {
                    const active = m === mood;
                    return (
                      <button
                        key={m}
                        type="button"
                        onClick={() => setMood(active ? null : m)}
                        className={`rounded-lg px-3.5 py-1.5 font-mono text-xs transition-all ${
                          active
                            ? "border border-[#00f59b] bg-[#00f59b] text-black font-bold shadow-[0_0_12px_rgba(0,245,155,0.4)]"
                            : "border border-white/10 bg-black/40 text-slate-300 hover:border-white/20 hover:bg-[#07190f]"
                        }`}
                      >
                        {m}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* One Word Descriptor */}
              <div>
                <label className="block font-mono text-xs font-semibold uppercase tracking-wider text-slate-300">
                  One Word for Nigeria Right Now
                </label>
                <input
                  type="text"
                  value={oneWord}
                  onChange={(e) => setOneWord(e.target.value.slice(0, 40))}
                  maxLength={40}
                  placeholder="e.g. Resilient, Strained, Hopeful, Adapting…"
                  className="mt-2 w-full rounded-xl border border-[#00f59b]/25 bg-black/60 px-4 py-3 font-mono text-sm text-white placeholder:text-slate-600 focus:border-[#00f59b] focus:ring-1 focus:ring-[#00f59b] outline-none"
                />
                <p className="mt-1 font-mono text-[10px] text-slate-500">{oneWord.length}/40 characters</p>
              </div>

              {/* State Selection */}
              <div>
                <label className="block font-mono text-xs font-semibold uppercase tracking-wider text-slate-300">
                  Sub-National State Jurisdiction
                </label>
                <select
                  value={spotlightState ?? ""}
                  onChange={(e) => setSpotlightState(e.target.value || null)}
                  className="mt-2 w-full rounded-xl border border-[#00f59b]/25 bg-[#051109] px-4 py-3 font-mono text-sm text-white focus:border-[#00f59b] focus:ring-1 focus:ring-[#00f59b] outline-none"
                >
                  <option value="">— Nationwide / Unspecified —</option>
                  {NIGERIAN_STATES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              {/* Thematic Tags */}
              <div>
                <label className="block font-mono text-xs font-semibold uppercase tracking-wider text-slate-300">
                  Relevant Thematic Focus (Select up to 8)
                </label>
                <div className="mt-2.5 flex flex-wrap gap-2">
                  {SPOTLIGHT_TAGS.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleTag(tag)}
                      className={`rounded-lg border px-3 py-1.5 font-mono text-xs transition-all ${
                        spotlightTags.includes(tag)
                          ? "border-[#fbbf24] bg-[#fbbf24]/20 text-[#fbbf24] shadow-[0_0_10px_rgba(251,191,36,0.3)]"
                          : "border-white/10 bg-black/40 text-slate-400 hover:border-white/20 hover:text-slate-200"
                      }`}
                    >
                      #{tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* Freeform Comment */}
              <div>
                <label className="block font-mono text-xs font-semibold uppercase tracking-wider text-slate-300">
                  Qualitative Street Briefing (Max 600 characters)
                </label>
                <textarea
                  value={spotlightComment}
                  onChange={(e) => setSpotlightComment(e.target.value.slice(0, 600))}
                  rows={3}
                  className="mt-2 w-full rounded-xl border border-[#00f59b]/25 bg-black/60 px-4 py-3 text-sm text-white placeholder:text-slate-600 focus:border-[#00f59b] focus:ring-1 focus:ring-[#00f59b] outline-none"
                  placeholder="Share notable observations regarding markets, transport, security, or communal life in your area…"
                />
                <p className="mt-1 font-mono text-[10px] text-slate-500">{spotlightComment.length}/600 characters</p>
              </div>
            </div>

            {submitError && (
              <div className="mt-5 rounded-xl border border-red-500/30 bg-red-950/40 p-3.5 text-center font-mono text-xs text-red-400">
                {submitError}
              </div>
            )}

            <div className="mt-10 flex items-center justify-between pt-4 border-t border-white/5">
              <button
                type="button"
                onClick={goBack}
                className="rounded-xl border border-white/15 bg-white/5 px-6 py-2.5 font-mono text-xs font-semibold text-slate-300 transition-all hover:bg-white/10 hover:text-white"
              >
                ← BACK
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitting || !hasAllPillarAnswers}
                className="inline-flex items-center gap-2 rounded-xl border border-[#00f59b] bg-gradient-to-r from-[#00f59b] to-[#00d07e] px-8 py-3.5 font-mono text-xs font-bold text-black shadow-[0_0_25px_rgba(0,245,155,0.4)] transition-all hover:scale-105 hover:shadow-[0_0_35px_rgba(0,245,155,0.6)] disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <span className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-black border-t-transparent" />
                    <span>TRANSMITTING TELEMETRY…</span>
                  </>
                ) : (
                  <>
                    <span>SUBMIT CITIZEN PULSE</span>
                    <span>✓</span>
                  </>
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
