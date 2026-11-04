"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { MOODS, PILLAR_KEYS, NIGERIAN_STATES, SPOTLIGHT_TAGS } from "@/lib/constants";
import { getClientDeviceInfo } from "@/lib/clientDeviceInfo";
import { getDeviceHash } from "@/lib/deviceHash";
import { normalizeRefQueryParam } from "@/lib/referrerCode";
import { Check } from "lucide-react";
import { buttonVariants } from "@/components/ui/Button";
import { PhotoCredit } from "@/components/ui/Figure";
import { controlClass, Field, FormMessage } from "@/components/ui/Form";
import { photos, pillarPhotos, type Photo } from "@/lib/photos";
import { SCALE_MAX, SCALE_MIN, SCALE_VALUES, isScaleAnswer, monthOf, publicationDateFor } from "@/lib/reportFormat";

const introPhoto = photos.dyeWorkers;

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

const PILLAR_STEPS = 5;
const TOTAL_STEPS = 6; // intro + 5 pillars + optional spotlight

function getPillarPhoto(pillarKey: string): Photo | null {
  return pillarPhotos[pillarKey] ?? null;
}

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
    PILLAR_KEYS.every((k) => isScaleAnswer(pillarResponses[k]));

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
          scaleMax: SCALE_MAX,
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


  const shell = (children: React.ReactNode) => (
    <div className="mx-auto w-full max-w-[40rem]" aria-live="polite">
      {children}
    </div>
  );

  if (loading) {
    return shell(
      <div className="border border-line bg-surface px-6 py-10">
        <p className="text-body text-ink-2">Loading the survey…</p>
      </div>
    );
  }

  if (alreadySubmitted) {
    return shell(
      <div className="border-t-4 border-brand bg-surface px-6 py-8 sm:px-8">
        <h2 className="text-h3">You’ve already taken this month’s survey</h2>
        <p className="mt-3 text-body text-ink-2">
          Each device can answer once a month. Thank you for taking part; the results will be in the next report.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/reports" className={buttonVariants()}>
            Read the latest report
          </Link>
          <Link href="/subscribe" className={buttonVariants({ variant: "secondary" })}>
            Get an email when it’s out
          </Link>
        </div>
      </div>
    );
  }

  if (error || !cycle) {
    return shell(
      <div className="border border-line bg-surface px-6 py-8 sm:px-8">
        <h2 className="text-h3">The survey isn’t open right now</h2>
        <p className="mt-3 text-body text-ink-2">
          {error
            ? "We couldn’t load the survey. Please check your connection and try again."
            : "This month’s survey has closed or is still being set up. A new survey opens each month."}
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/subscribe" className={buttonVariants()}>
            Get an email when it opens
          </Link>
          <Link href="/reports" className={buttonVariants({ variant: "secondary" })}>
            Read the reports
          </Link>
        </div>
      </div>
    );
  }

  if (submitted) {
    return shell(
      <div className="border-t-4 border-brand bg-surface px-6 py-8 sm:px-8">
        <h2 className="text-h3">Thank you. Your answers are in.</h2>
        <p className="mt-3 text-body text-ink-2">
          They will count towards the {cycle.monthYear} edition, published on{" "}
          {publicationDateFor(cycle.monthYear) ?? "the 11th of this month"}.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/subscribe" className={buttonVariants()}>
            Get the report by email
          </Link>
          <Link href="/reports" className={buttonVariants({ variant: "secondary" })}>
            Read the latest report
          </Link>
        </div>
      </div>
    );
  }

  const questions = cycle.surveyQuestions;
  const pillarIndex = step >= 1 && step <= PILLAR_STEPS ? step - 1 : null;
  const currentQuestion = pillarIndex !== null ? questions[pillarIndex] : null;
  const photo = currentQuestion ? getPillarPhoto(currentQuestion.pillarKey) : step === 0 ? introPhoto : null;
  const progressLabel =
    step === 0
      ? "Before you start"
      : currentQuestion
        ? `${currentQuestion.pillarLabel}, ${step} of ${PILLAR_STEPS}`
        : "Optional: anything else?";
  const progress = Math.min(step, TOTAL_STEPS) / TOTAL_STEPS;

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,40rem)_minmax(0,1fr)] lg:gap-14">
      <div>
        <div className="border-b border-line pb-4">
          <div className="flex items-baseline justify-between gap-4">
            <p className="font-semibold text-ink">{progressLabel}</p>
            <p className="text-small text-ink-3">{cycle.monthYear} survey</p>
          </div>
          <div
            className="mt-3 h-1.5 w-full bg-data-track"
            role="progressbar"
            aria-label="Survey progress"
            aria-valuemin={0}
            aria-valuemax={TOTAL_STEPS}
            aria-valuenow={Math.min(step, TOTAL_STEPS)}
          >
            <div
              className="h-full bg-brand transition-[width] duration-200 ease-[var(--ease-out-strong)]"
              style={{ width: `${progress * 100}%` }}
            />
          </div>
          {refFromUrl && refCheckDone && refLabel && (
            <p className="mt-3 text-small text-ink-2">
              You’re taking part through <span className="font-semibold text-ink">{refLabel}</span>’s link. Thank you.
            </p>
          )}
          {refFromUrl && refCheckDone && !refLabel && (
            <p className="mt-3 text-small font-semibold text-ink-2">
              This referral link isn’t active any more. You can still take the survey; it just won’t be credited to a
              field agent.
            </p>
          )}
        </div>

        {step === 0 && (
          <div className="pt-8">
            <h2 className="text-h2">Tell us how Nigeria felt to you in {monthOf(cycle.monthYear)}</h2>
            <p className="mt-3 text-body text-ink-2">
              This survey is for the {cycle.monthYear} edition of the index, published on{" "}
              {publicationDateFor(cycle.monthYear) ?? "the 11th of this month"}. Each edition reports the month
              before it is published.
            </p>
            <ul className="mt-6 flex flex-col gap-3 text-body text-ink-2">
              <li className="flex gap-3">
                <Check aria-hidden className="mt-1 size-5 shrink-0 text-brand" />
                Five questions, one for each pillar, answered from {SCALE_MIN} (least stable) to {SCALE_MAX} (most stable).
              </li>
              <li className="flex gap-3">
                <Check aria-hidden className="mt-1 size-5 shrink-0 text-brand" />
                About two minutes. An optional last step lets you add more.
              </li>
              <li className="flex gap-3">
                <Check aria-hidden className="mt-1 size-5 shrink-0 text-brand" />
                No names, phone numbers or addresses. One answer per device each month.
              </li>
            </ul>
            <div className="mt-10">
              <button type="button" onClick={goNext} className={buttonVariants({ size: "lg" })}>
                Start the survey
              </button>
            </div>
          </div>
        )}

        {currentQuestion && pillarIndex !== null && (
          <fieldset className="pt-8">
            <legend className="font-serif text-[clamp(1.375rem,1.2rem+0.8vw,1.75rem)] leading-snug font-semibold text-ink">
              {currentQuestion.questionText}
            </legend>
            <p className="mt-3 text-body text-ink-2">
              Choose a number from {SCALE_MIN} to {SCALE_MAX}.
            </p>

            <div className="mt-6 grid grid-cols-5 gap-2 sm:grid-cols-10">
              {SCALE_VALUES.map((n) => {
                const checked = pillarResponses[currentQuestion.pillarKey] === n;
                return (
                  <label
                    key={n}
                    className={`relative flex min-h-14 cursor-pointer items-center justify-center rounded-control border text-h3 font-semibold tabular-nums transition-[background-color,border-color,color] duration-150 has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-brand ${
                      checked ? "border-brand bg-brand text-white" : "border-line-strong bg-ground text-ink hover:border-ink"
                    }`}
                  >
                    <input
                      type="radio"
                      name={`pillar-${currentQuestion.pillarKey}`}
                      value={n}
                      checked={checked}
                      onChange={() => setPillar(currentQuestion.pillarKey, n)}
                      className="sr-only"
                    />
                    {n}
                    <span className="sr-only">{n === SCALE_MIN ? " (least stable)" : n === SCALE_MAX ? " (most stable)" : ""}</span>
                  </label>
                );
              })}
            </div>
            <div aria-hidden className="mt-2 flex justify-between text-small text-ink-3">
              <span>Least stable</span>
              <span>Most stable</span>
            </div>

            <div className="mt-10 flex items-center justify-between gap-3">
              <button type="button" onClick={goBack} className={buttonVariants({ variant: "secondary" })}>
                Back
              </button>
              <button
                type="button"
                onClick={goNext}
                disabled={pillarResponses[currentQuestion.pillarKey] == null}
                className={buttonVariants()}
              >
                {step === PILLAR_STEPS ? "Continue to the last step" : "Next question"}
              </button>
            </div>
          </fieldset>
        )}

        {step === TOTAL_STEPS && (
          <div className="pt-8">
            <h2 className="text-h2">Anything else?</h2>
            <p className="mt-3 text-body text-ink-2">Everything on this page is optional. You can submit now if you prefer.</p>

            <div className="mt-8 flex flex-col gap-8">
              <fieldset>
                <legend className="text-body font-semibold text-ink">
                  How are you feeling about Nigeria? <span className="font-normal text-ink-3">(optional)</span>
                </legend>
                <div className="mt-3 flex flex-wrap gap-2">
                  {MOODS.map((m) => {
                    const active = m === mood;
                    return (
                      <button
                        key={m}
                        type="button"
                        aria-pressed={active}
                        onClick={() => setMood(active ? null : m)}
                        className={`min-h-11 rounded-control border px-4 text-body transition-[background-color,border-color,color] duration-150 ${
                          active ? "border-brand bg-brand text-white" : "border-line-strong bg-ground text-ink hover:border-ink"
                        }`}
                      >
                        {m}
                      </button>
                    );
                  })}
                </div>
              </fieldset>

              <Field
                label="One word for Nigeria today"
                optional
                hint="For example: steady, tense, hopeful."
                counter={{ value: oneWord.length, max: 40 }}
              >
                {({ id, describedBy }) => (
                  <input
                    id={id}
                    aria-describedby={describedBy}
                    type="text"
                    value={oneWord}
                    onChange={(e) => setOneWord(e.target.value.slice(0, 40))}
                    maxLength={40}
                    className={controlClass}
                  />
                )}
              </Field>

              <Field label="Your state" optional>
                {({ id, describedBy }) => (
                  <select
                    id={id}
                    aria-describedby={describedBy}
                    value={spotlightState ?? ""}
                    onChange={(e) => setSpotlightState(e.target.value || null)}
                    className={controlClass}
                  >
                    <option value="">Prefer not to say</option>
                    {NIGERIAN_STATES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                )}
              </Field>

              <fieldset>
                <legend className="text-body font-semibold text-ink">
                  Topics on your mind <span className="font-normal text-ink-3">(optional, up to 8)</span>
                </legend>
                <div className="mt-3 flex flex-wrap gap-2">
                  {SPOTLIGHT_TAGS.map((tag) => {
                    const checked = spotlightTags.includes(tag);
                    return (
                      <label
                        key={tag}
                        className={`flex min-h-11 cursor-pointer items-center gap-2 rounded-control border px-3.5 text-body transition-[background-color,border-color] duration-150 has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-brand ${
                          checked ? "border-brand bg-brand-tint text-ink" : "border-line-strong bg-ground text-ink hover:border-ink"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleTag(tag)}
                          disabled={!checked && spotlightTags.length >= 8}
                          className="size-4 accent-[var(--color-brand)]"
                        />
                        {tag}
                      </label>
                    );
                  })}
                </div>
              </fieldset>

              <Field
                label="Comment"
                optional
                hint="Please don’t include names, phone numbers or addresses."
                counter={{ value: spotlightComment.length, max: 600 }}
              >
                {({ id, describedBy }) => (
                  <textarea
                    id={id}
                    aria-describedby={describedBy}
                    value={spotlightComment}
                    onChange={(e) => setSpotlightComment(e.target.value.slice(0, 600))}
                    rows={4}
                    className={`${controlClass} resize-y`}
                  />
                )}
              </Field>
            </div>

            {submitError && (
              <FormMessage tone="error" className="mt-6">
                {submitError}
              </FormMessage>
            )}

            <div className="mt-10 flex items-center justify-between gap-3">
              <button type="button" onClick={goBack} className={buttonVariants({ variant: "secondary" })}>
                Back
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitting || !hasAllPillarAnswers}
                aria-busy={submitting}
                className={buttonVariants()}
              >
                {submitting ? "Sending…" : "Submit my answers"}
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="hidden lg:block">
        {photo ? (
          <div className="sticky top-28">
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-surface">
              <Image src={photo.src} alt="" fill sizes="(min-width: 1024px) 35vw, 0px" className="object-cover" />
            </div>
            <PhotoCredit photo={photo} className="mt-2" />
          </div>
        ) : null}
      </div>
    </div>
  );
}
