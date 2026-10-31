"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { Plus, X } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/Button";
import { controlClass, Field, FormMessage } from "@/components/ui/Form";
import { NIGERIAN_STATES } from "@/lib/constants";
import { getDeviceHash } from "@/lib/deviceHash";
import {
  LIMITS,
  NOMINATOR_RELATION_LABELS,
  NOMINATOR_RELATIONS,
  NOMINEE_TYPE_LABELS,
  type NominatorRelation,
  type NomineeType,
} from "@/lib/honors/constants";
import { nominationStepSchemas } from "@/lib/honors/schemas";
import { normalizeRefQueryParam } from "@/lib/referrerCode";
import { cn } from "@/lib/utils";

export type WizardCategory = {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  allowedNomineeTypes: NomineeType[];
};

type Draft = {
  categoryId: string;
  nomineeType: NomineeType | "";
  nomineeName: string;
  nomineeState: string;
  nomineeLga: string;
  nomineeAffiliation: string;
  reason: string;
  evidenceUrls: string[];
  nominatorName: string;
  nominatorEmail: string;
  nominatorRelation: NominatorRelation | "";
  consent: boolean;
  website: string;
};

const STEPS = ["Category", "Nominee", "Why", "About you", "Check and send"] as const;
const STORAGE_KEY = "nsi_honors_nomination_draft";

const emptyDraft = (categoryId = ""): Draft => ({
  categoryId,
  nomineeType: "",
  nomineeName: "",
  nomineeState: "",
  nomineeLga: "",
  nomineeAffiliation: "",
  reason: "",
  evidenceUrls: [""],
  nominatorName: "",
  nominatorEmail: "",
  nominatorRelation: "",
  consent: false,
  website: "",
});

type Errors = Partial<Record<keyof Draft | "form", string>>;

export function NominationWizard({
  categories,
  initialCategorySlug,
  refParam,
  editionTitle,
}: {
  categories: WizardCategory[];
  initialCategorySlug?: string | null;
  refParam?: string | null;
  editionTitle: string;
}) {
  const initialCategory = categories.find((c) => c.slug === initialCategorySlug)?.id ?? "";
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState<Draft>(() => emptyDraft(initialCategory));
  const [errors, setErrors] = useState<Errors>({});
  const [sending, setSending] = useState(false);
  const [reference, setReference] = useState<string | null>(null);
  const [receiptSent, setReceiptSent] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const referrerCode = normalizeRefQueryParam(refParam ?? null);

  // Restore an unfinished draft from this tab.
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as Draft;
        setDraft({ ...parsed, categoryId: initialCategory || parsed.categoryId, website: "" });
      }
    } catch {
      // ignore unreadable drafts
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    try {
      if (!reference) sessionStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
    } catch {
      // storage may be unavailable
    }
  }, [draft, reference]);

  const category = useMemo(() => categories.find((c) => c.id === draft.categoryId), [categories, draft.categoryId]);
  const set = <K extends keyof Draft>(key: K, value: Draft[K]) => setDraft((d) => ({ ...d, [key]: value }));

  function goTo(next: number) {
    setStep(next);
    setErrors({});
    requestAnimationFrame(() => headingRef.current?.focus());
  }

  function validate(index: number): boolean {
    const e: Errors = {};
    const cleanUrls = draft.evidenceUrls.map((u) => u.trim()).filter(Boolean);
    const result =
      index === 0
        ? nominationStepSchemas.category.safeParse({ categoryId: draft.categoryId, nomineeType: draft.nomineeType || undefined })
        : index === 1
          ? nominationStepSchemas.nominee.safeParse({
              nomineeName: draft.nomineeName,
              nomineeState: draft.nomineeState || null,
              nomineeLga: draft.nomineeLga || null,
              nomineeAffiliation: draft.nomineeAffiliation || null,
            })
          : index === 2
            ? nominationStepSchemas.reason.safeParse({ reason: draft.reason, evidenceUrls: cleanUrls })
            : index === 3
              ? nominationStepSchemas.you.safeParse({
                  nominatorName: draft.nominatorName || null,
                  nominatorEmail: draft.nominatorEmail.trim(),
                  nominatorRelation: draft.nominatorRelation || undefined,
                  consent: draft.consent,
                })
              : { success: true as const };
    if (!result.success) {
      for (const issue of result.error.issues) {
        const key = String(issue.path[0] ?? "form") as keyof Draft;
        if (!e[key]) e[key] = issue.message;
      }
    }
    if (index === 0 && category && draft.nomineeType && !category.allowedNomineeTypes.includes(draft.nomineeType)) {
      e.nomineeType = "This category doesn’t accept that kind of nominee.";
    }
    if (index === 1 && draft.nomineeType === "STATE_OR_LGA" && !draft.nomineeState) {
      e.nomineeState = "Choose the state.";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function next() {
    if (validate(step)) goTo(step + 1);
  }

  async function submit() {
    for (let i = 0; i < 4; i++) {
      if (!validate(i)) {
        goTo(i);
        return;
      }
    }
    setSending(true);
    setErrors({});
    try {
      const res = await fetch("/api/public/honors/nominations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          categoryId: draft.categoryId,
          nomineeType: draft.nomineeType,
          nomineeName: draft.nomineeName,
          nomineeState: draft.nomineeState || null,
          nomineeLga: draft.nomineeLga || null,
          nomineeAffiliation: draft.nomineeAffiliation || null,
          reason: draft.reason,
          evidenceUrls: draft.evidenceUrls.map((u) => u.trim()).filter(Boolean),
          nominatorName: draft.nominatorName || null,
          nominatorEmail: draft.nominatorEmail.trim(),
          nominatorRelation: draft.nominatorRelation,
          consent: draft.consent,
          deviceHash: getDeviceHash() ?? undefined,
          ...(referrerCode ? { referrerCode } : {}),
          website: draft.website,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { reference?: string; receipt?: boolean; error?: string };
      if (!res.ok || !data.reference) {
        setErrors({ form: data.error ?? "Something went wrong. Please try again." });
        return;
      }
      setReference(data.reference);
      setReceiptSent(Boolean(data.receipt));
      try {
        sessionStorage.removeItem(STORAGE_KEY);
      } catch {}
      requestAnimationFrame(() => headingRef.current?.focus());
    } catch {
      setErrors({ form: "Network error. Please check your connection and try again." });
    } finally {
      setSending(false);
    }
  }

  if (reference) {
    return (
      <div className="max-w-[40rem] border-t-4 border-gold bg-gold-tint px-6 py-8 sm:px-8">
        <h2 ref={headingRef} tabIndex={-1} className="text-h2 focus:outline-none">
          Thank you. Your nomination is in.
        </h2>
        <p className="mt-4 text-body">
          Your reference is <strong className="tabular-nums">{reference}</strong>.
          {receiptSent ? <> A copy is on its way to {draft.nominatorEmail.trim()}.</> : <> Please note it down.</>}
        </p>
        <p className="mt-3 text-body text-ink-2">
          The team reviews every nomination for {editionTitle}. Finalists will be announced before the public vote.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button
            variant="gold"
            onClick={() => {
              setReference(null);
              setDraft((d) => ({ ...emptyDraft(), nominatorName: d.nominatorName, nominatorEmail: d.nominatorEmail, nominatorRelation: "" }));
              goTo(0);
            }}
          >
            Nominate someone else
          </Button>
          <Link href="/honors" className={buttonVariants({ variant: "secondary" })}>
            Back to NSI Honors
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[40rem]">
      <ol className="flex flex-wrap gap-x-4 gap-y-2 border-b border-line pb-4 text-small" aria-label="Nomination steps">
        {STEPS.map((label, i) => (
          <li key={label} aria-current={i === step ? "step" : undefined} className={cn(i === step ? "font-semibold text-ink" : i < step ? "text-brand" : "text-ink-3")}>
            {i + 1}. {label}
          </li>
        ))}
      </ol>

      <form
        className="pt-8"
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          if (step < 4) next();
          else void submit();
        }}
      >
        <h2 ref={headingRef} tabIndex={-1} className="text-h2 focus:outline-none">
          {step === 0 && "Which award, and who are you nominating?"}
          {step === 1 && "Tell us about the nominee"}
          {step === 2 && "Why do they deserve it?"}
          {step === 3 && "About you"}
          {step === 4 && "Check your nomination"}
        </h2>

        {/* Honeypot: hidden from people, tempting to bots. */}
        <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
          <label>
            Website
            <input tabIndex={-1} autoComplete="off" value={draft.website} onChange={(e) => set("website", e.target.value)} />
          </label>
        </div>

        <div className="mt-8 flex flex-col gap-8">
          {step === 0 && (
            <>
              <fieldset>
                <legend className="text-body font-semibold">Award</legend>
                {errors.categoryId ? <p className="mt-1.5 text-small font-semibold text-negative">{errors.categoryId}</p> : null}
                <div className="mt-3 flex flex-col gap-2">
                  {categories.map((c) => (
                    <label
                      key={c.id}
                      className={cn(
                        "flex cursor-pointer gap-3 rounded-control border px-4 py-3 transition-[border-color,background-color] duration-150 has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-brand",
                        draft.categoryId === c.id ? "border-gold bg-gold-tint" : "border-line-strong hover:border-ink",
                      )}
                    >
                      <input
                        type="radio"
                        name="categoryId"
                        value={c.id}
                        checked={draft.categoryId === c.id}
                        onChange={() => {
                          set("categoryId", c.id);
                          if (draft.nomineeType && !c.allowedNomineeTypes.includes(draft.nomineeType as NomineeType)) set("nomineeType", "");
                        }}
                        className="mt-1 size-4 shrink-0 accent-[var(--color-brand)]"
                      />
                      <span>
                        <span className="block font-semibold">{c.name}</span>
                        <span className="mt-0.5 block text-small text-ink-2">{c.shortDescription}</span>
                      </span>
                    </label>
                  ))}
                </div>
              </fieldset>

              <fieldset disabled={!category}>
                <legend className="text-body font-semibold">You are nominating</legend>
                {errors.nomineeType ? <p className="mt-1.5 text-small font-semibold text-negative">{errors.nomineeType}</p> : null}
                {!category ? <p className="mt-1 text-small text-ink-3">Choose an award first.</p> : null}
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  {(category?.allowedNomineeTypes ?? []).map((t) => (
                    <label
                      key={t}
                      className={cn(
                        "flex min-h-12 cursor-pointer items-center gap-3 rounded-control border px-4 py-2 has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-brand",
                        draft.nomineeType === t ? "border-gold bg-gold-tint" : "border-line-strong hover:border-ink",
                      )}
                    >
                      <input
                        type="radio"
                        name="nomineeType"
                        value={t}
                        checked={draft.nomineeType === t}
                        onChange={() => set("nomineeType", t)}
                        className="size-4 shrink-0 accent-[var(--color-brand)]"
                      />
                      {NOMINEE_TYPE_LABELS[t]}
                    </label>
                  ))}
                </div>
              </fieldset>
            </>
          )}

          {step === 1 && (
            <>
              <Field
                label={draft.nomineeType === "INDIVIDUAL" ? "Full name" : draft.nomineeType === "STATE_OR_LGA" ? "State or LGA name" : "Name of the institution or organisation"}
                error={errors.nomineeName}
                hint="As it is commonly known. Names with Yoruba, Igbo or Hausa letters are fine."
              >
                {({ id, describedBy, invalid }) => (
                  <input
                    id={id}
                    aria-describedby={describedBy}
                    aria-invalid={invalid}
                    className={controlClass}
                    value={draft.nomineeName}
                    maxLength={LIMITS.nomineeName.max}
                    onChange={(e) => set("nomineeName", e.target.value)}
                    autoComplete="off"
                  />
                )}
              </Field>
              <div className="grid gap-6 sm:grid-cols-2">
                <Field label="State" optional={draft.nomineeType !== "STATE_OR_LGA"} error={errors.nomineeState}>
                  {({ id, describedBy, invalid }) => (
                    <select
                      id={id}
                      aria-describedby={describedBy}
                      aria-invalid={invalid}
                      className={controlClass}
                      value={draft.nomineeState}
                      onChange={(e) => set("nomineeState", e.target.value)}
                    >
                      <option value="">{draft.nomineeType === "STATE_OR_LGA" ? "Choose a state" : "Not specific to one state"}</option>
                      {NIGERIAN_STATES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  )}
                </Field>
                <Field label="Local government area" optional error={errors.nomineeLga}>
                  {({ id, describedBy, invalid }) => (
                    <input
                      id={id}
                      aria-describedby={describedBy}
                      aria-invalid={invalid}
                      className={controlClass}
                      value={draft.nomineeLga}
                      maxLength={LIMITS.lga}
                      onChange={(e) => set("nomineeLga", e.target.value)}
                    />
                  )}
                </Field>
              </div>
              {draft.nomineeType === "INDIVIDUAL" ? (
                <Field label="Role or organisation" optional hint="For example: headteacher, Lagos State Ministry of Health." error={errors.nomineeAffiliation}>
                  {({ id, describedBy, invalid }) => (
                    <input
                      id={id}
                      aria-describedby={describedBy}
                      aria-invalid={invalid}
                      className={controlClass}
                      value={draft.nomineeAffiliation}
                      maxLength={LIMITS.affiliation}
                      onChange={(e) => set("nomineeAffiliation", e.target.value)}
                    />
                  )}
                </Field>
              ) : null}
            </>
          )}

          {step === 2 && (
            <>
              <Field
                label="What did they do in 2026, and what changed for people?"
                hint="Be specific: what happened, where, and who benefited."
                error={errors.reason}
                counter={{ value: draft.reason.trim().length, max: LIMITS.reason.max }}
              >
                {({ id, describedBy, invalid }) => (
                  <textarea
                    id={id}
                    aria-describedby={describedBy}
                    aria-invalid={invalid}
                    rows={8}
                    className={`${controlClass} resize-y`}
                    value={draft.reason}
                    maxLength={LIMITS.reason.max}
                    onChange={(e) => set("reason", e.target.value)}
                  />
                )}
              </Field>
              <fieldset>
                <legend className="text-body font-semibold">
                  Links to evidence <span className="font-normal text-ink-3">(optional, up to {LIMITS.evidenceUrls})</span>
                </legend>
                <p className="mt-1 text-small text-ink-2">News reports, official figures, project pages. Each starting with https://</p>
                {errors.evidenceUrls ? <p className="mt-1.5 text-small font-semibold text-negative">{errors.evidenceUrls}</p> : null}
                <div className="mt-3 flex flex-col gap-2">
                  {draft.evidenceUrls.map((url, i) => (
                    <div key={i} className="flex gap-2">
                      <label className="sr-only" htmlFor={`evidence-${i}`}>
                        Evidence link {i + 1}
                      </label>
                      <input
                        id={`evidence-${i}`}
                        type="url"
                        inputMode="url"
                        className={controlClass}
                        value={url}
                        placeholder="https://"
                        onChange={(e) => set("evidenceUrls", draft.evidenceUrls.map((u, j) => (j === i ? e.target.value : u)))}
                      />
                      {draft.evidenceUrls.length > 1 ? (
                        <button
                          type="button"
                          onClick={() => set("evidenceUrls", draft.evidenceUrls.filter((_, j) => j !== i))}
                          className="inline-flex size-12 shrink-0 items-center justify-center rounded-control border border-line-strong hover:border-ink"
                        >
                          <X aria-hidden className="size-4" />
                          <span className="sr-only">Remove link {i + 1}</span>
                        </button>
                      ) : null}
                    </div>
                  ))}
                </div>
                {draft.evidenceUrls.length < LIMITS.evidenceUrls ? (
                  <Button variant="quiet" className="mt-2" onClick={() => set("evidenceUrls", [...draft.evidenceUrls, ""])}>
                    <Plus aria-hidden className="size-4" /> Add another link
                  </Button>
                ) : null}
              </fieldset>
            </>
          )}

          {step === 3 && (
            <>
              <div className="grid gap-6 sm:grid-cols-2">
                <Field label="Your name" optional error={errors.nominatorName}>
                  {({ id, describedBy, invalid }) => (
                    <input
                      id={id}
                      aria-describedby={describedBy}
                      aria-invalid={invalid}
                      className={controlClass}
                      autoComplete="name"
                      value={draft.nominatorName}
                      maxLength={LIMITS.nominatorName}
                      onChange={(e) => set("nominatorName", e.target.value)}
                    />
                  )}
                </Field>
                <Field label="Your email address" hint="For your receipt and any follow-up. Never published." error={errors.nominatorEmail}>
                  {({ id, describedBy, invalid }) => (
                    <input
                      id={id}
                      aria-describedby={describedBy}
                      aria-invalid={invalid}
                      type="email"
                      inputMode="email"
                      autoComplete="email"
                      className={controlClass}
                      value={draft.nominatorEmail}
                      onChange={(e) => set("nominatorEmail", e.target.value)}
                    />
                  )}
                </Field>
              </div>
              <fieldset>
                <legend className="text-body font-semibold">How do you know the nominee?</legend>
                {errors.nominatorRelation ? <p className="mt-1.5 text-small font-semibold text-negative">{errors.nominatorRelation}</p> : null}
                <div className="mt-3 flex flex-col gap-2">
                  {NOMINATOR_RELATIONS.map((r) => (
                    <label
                      key={r}
                      className={cn(
                        "flex min-h-12 cursor-pointer items-center gap-3 rounded-control border px-4 py-2 has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-brand",
                        draft.nominatorRelation === r ? "border-gold bg-gold-tint" : "border-line-strong hover:border-ink",
                      )}
                    >
                      <input
                        type="radio"
                        name="nominatorRelation"
                        value={r}
                        checked={draft.nominatorRelation === r}
                        onChange={() => set("nominatorRelation", r)}
                        className="size-4 shrink-0 accent-[var(--color-brand)]"
                      />
                      {NOMINATOR_RELATION_LABELS[r]}
                    </label>
                  ))}
                </div>
              </fieldset>
              <div>
                <label className="flex cursor-pointer items-start gap-3">
                  <input
                    type="checkbox"
                    checked={draft.consent}
                    onChange={(e) => set("consent", e.target.checked)}
                    aria-invalid={Boolean(errors.consent)}
                    className="mt-1 size-5 shrink-0 accent-[var(--color-brand)]"
                  />
                  <span className="text-body">
                    The information I’ve given is true to the best of my knowledge, and NSI may contact me about this
                    nomination. I have read the{" "}
                    <Link href="/privacy#honors" className="text-brand underline underline-offset-[0.22em]" target="_blank">
                      privacy notice
                    </Link>
                    .
                  </span>
                </label>
                {errors.consent ? <p className="mt-1.5 text-small font-semibold text-negative">{errors.consent}</p> : null}
              </div>
            </>
          )}

          {step === 4 && (
            <dl className="border-t border-ink">
              {[
                ["Award", category?.name ?? "—", 0],
                ["Nominating", draft.nomineeType ? NOMINEE_TYPE_LABELS[draft.nomineeType] : "—", 0],
                ["Nominee", [draft.nomineeName, draft.nomineeAffiliation, draft.nomineeLga, draft.nomineeState].filter(Boolean).join(", "), 1],
                ["Why", draft.reason, 2],
                ["Evidence", draft.evidenceUrls.filter((u) => u.trim()).join("\n") || "None added", 2],
                ["Your details", [draft.nominatorName, draft.nominatorEmail].filter(Boolean).join(", "), 3],
              ].map(([label, value, stepIndex]) => (
                <div key={label as string} className="grid gap-1 border-b border-line py-4 sm:grid-cols-[9rem_minmax(0,1fr)_auto] sm:gap-4">
                  <dt className="font-semibold">{label}</dt>
                  <dd className="text-body break-words whitespace-pre-line text-ink-2">{value}</dd>
                  <dd>
                    <Button variant="quiet" size="sm" onClick={() => goTo(stepIndex as number)}>
                      Change<span className="sr-only"> {String(label).toLowerCase()}</span>
                    </Button>
                  </dd>
                </div>
              ))}
            </dl>
          )}
        </div>

        {errors.form ? (
          <FormMessage tone="error" className="mt-6">
            {errors.form}
          </FormMessage>
        ) : null}

        <div className="mt-10 flex items-center justify-between gap-3">
          {step > 0 ? (
            <Button variant="secondary" onClick={() => goTo(step - 1)}>
              Back
            </Button>
          ) : (
            <span />
          )}
          <Button type="submit" variant={step === 4 ? "gold" : "primary"} disabled={sending} aria-busy={sending}>
            {step < 4 ? "Continue" : sending ? "Sending…" : "Send nomination"}
          </Button>
        </div>
      </form>
    </div>
  );
}
