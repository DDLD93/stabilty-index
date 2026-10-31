"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Button, buttonVariants } from "@/components/ui/Button";
import { controlClass, Field, FormMessage } from "@/components/ui/Form";
import { getDeviceHash } from "@/lib/deviceHash";
import { NOMINEE_TYPE_SHORT, type NomineeType } from "@/lib/honors/constants";
import { cn } from "@/lib/utils";

export type BallotCategory = {
  id: string;
  slug: string;
  name: string;
  finalists: { id: string; displayName: string; nomineeType: NomineeType; state: string | null; summary: string }[];
};

/**
 * One radio group per category (every category optional), then an email to
 * confirm. Nothing counts until the emailed link is confirmed.
 */
export function VoteBallot({ categories, focusSlug }: { categories: BallotCategory[]; focusSlug?: string | null }) {
  const [choices, setChoices] = useState<Record<string, string>>({});
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [website, setWebsite] = useState("");
  const [errors, setErrors] = useState<{ email?: string; consent?: string; form?: string }>({});
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState<{ maskedEmail: string; hours: number } | null>(null);
  const [cooldown, setCooldown] = useState(0);
  const sentRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (!focusSlug) return;
    document.getElementById(`ballot-${focusSlug}`)?.scrollIntoView({ block: "start" });
  }, [focusSlug]);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = window.setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => window.clearTimeout(t);
  }, [cooldown]);

  const chosen = Object.entries(choices).filter(([, v]) => v);

  async function send() {
    const e: typeof errors = {};
    if (chosen.length === 0) e.form = "Choose at least one finalist before continuing.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) e.email = "Enter a valid email address, like name@example.com.";
    if (!consent) e.consent = "Please confirm to continue.";
    setErrors(e);
    if (Object.keys(e).length) return;

    setSending(true);
    try {
      const res = await fetch("/api/public/honors/vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          selections: chosen.map(([categoryId, finalistId]) => ({ categoryId, finalistId })),
          email: email.trim(),
          consent,
          deviceHash: getDeviceHash() ?? undefined,
          website,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { maskedEmail?: string; expiresInHours?: number; error?: string };
      if (!res.ok || !data.maskedEmail) {
        setErrors({ form: data.error ?? "Something went wrong. Please try again." });
        return;
      }
      setSent({ maskedEmail: data.maskedEmail, hours: data.expiresInHours ?? 24 });
      setCooldown(60);
      requestAnimationFrame(() => sentRef.current?.focus());
    } catch {
      setErrors({ form: "Network error. Please check your connection and try again." });
    } finally {
      setSending(false);
    }
  }

  if (sent) {
    return (
      <div className="max-w-[40rem] border-t-4 border-gold bg-gold-tint px-6 py-8 sm:px-8">
        <h2 ref={sentRef} tabIndex={-1} className="text-h2 focus:outline-none">
          Check your email to confirm
        </h2>
        <p className="mt-4 text-body">
          We’ve sent a link to <strong>{sent.maskedEmail}</strong>. Your vote counts only after you open it and press
          “Confirm my vote”. The link expires in {sent.hours} hours.
        </p>
        <p className="mt-3 text-body text-ink-2">Not there after a few minutes? Check your spam or promotions folder.</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button variant="secondary" disabled={cooldown > 0 || sending} onClick={send}>
            {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend the email"}
          </Button>
          <Button variant="quiet" onClick={() => setSent(null)}>
            Use a different email
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        void send();
      }}
      className="max-w-[44rem]"
    >
      <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label>
          Website
          <input tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} />
        </label>
      </div>

      <div className="flex flex-col gap-12">
        {categories.map((c) => (
          <fieldset key={c.id} id={`ballot-${c.slug}`} className="scroll-mt-28">
            <legend className="w-full border-b border-ink pb-3 font-serif text-h3 font-semibold">{c.name}</legend>
            <div className="mt-4 flex flex-col gap-2">
              {c.finalists.map((f) => {
                const checked = choices[c.id] === f.id;
                return (
                  <label
                    key={f.id}
                    className={cn(
                      "flex cursor-pointer gap-3 rounded-control border px-4 py-4 transition-[border-color,background-color] duration-150 has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-brand",
                      checked ? "border-gold bg-gold-tint" : "border-line-strong hover:border-ink",
                    )}
                  >
                    <input
                      type="radio"
                      name={`category-${c.id}`}
                      value={f.id}
                      checked={checked}
                      onChange={() => setChoices((prev) => ({ ...prev, [c.id]: f.id }))}
                      className="mt-1 size-5 shrink-0 accent-[var(--color-brand)]"
                    />
                    <span>
                      <span className="block font-semibold">{f.displayName}</span>
                      <span className="block text-small text-ink-3">
                        {NOMINEE_TYPE_SHORT[f.nomineeType]}
                        {f.state ? ` · ${f.state}` : ""}
                      </span>
                      <span className="mt-1.5 block text-small text-ink-2">{f.summary}</span>
                    </span>
                  </label>
                );
              })}
            </div>
            {choices[c.id] ? (
              <Button variant="quiet" size="sm" className="mt-2" onClick={() => setChoices((prev) => ({ ...prev, [c.id]: "" }))}>
                Clear my choice for {c.name}
              </Button>
            ) : (
              <p className="mt-2 text-small text-ink-3">Optional. Skip this award if you prefer.</p>
            )}
          </fieldset>
        ))}
      </div>

      <div className="mt-14 border-t border-ink pt-8">
        <h2 className="text-h3">Confirm by email</h2>
        <p className="mt-2 max-w-[60ch] text-body text-ink-2">
          You have chosen {chosen.length} of {categories.length} awards. We’ll email you a link; your vote counts once you
          confirm it. One vote per email address per award.
        </p>
        <div className="mt-6 flex flex-col gap-6">
          <Field label="Your email address" error={errors.email} hint="Used only to confirm your vote. We keep a scrambled form of it, never the address itself.">
            {({ id, describedBy, invalid }) => (
              <input
                id={id}
                aria-describedby={describedBy}
                aria-invalid={invalid}
                type="email"
                inputMode="email"
                autoComplete="email"
                className={controlClass}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            )}
          </Field>
          <div>
            <label className="flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                aria-invalid={Boolean(errors.consent)}
                className="mt-1 size-5 shrink-0 accent-[var(--color-brand)]"
              />
              <span className="text-body">
                I am voting once, for myself. I understand votes that break the rules are removed. (
                <Link href="/privacy#honors" className="text-brand underline underline-offset-[0.22em]" target="_blank">
                  Privacy notice
                </Link>
                )
              </span>
            </label>
            {errors.consent ? <p className="mt-1.5 text-small font-semibold text-negative">{errors.consent}</p> : null}
          </div>
        </div>
        {errors.form ? (
          <FormMessage tone="error" className="mt-6">
            {errors.form}
          </FormMessage>
        ) : null}
        <div className="mt-8">
          <button type="submit" disabled={sending} aria-busy={sending} className={buttonVariants({ variant: "gold", size: "lg" })}>
            {sending ? "Sending…" : "Email me the confirmation link"}
          </button>
        </div>
      </div>
    </form>
  );
}
