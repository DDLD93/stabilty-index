"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { controlClass, Field, FormMessage } from "@/components/ui/Form";

export function SubscribeForm() {
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "sent">("idle");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Enter a valid email address, like name@example.com.");
      return;
    }
    setState("sending");
    try {
      const res = await fetch("/api/public/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), website }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        setError(data.error ?? "Something went wrong. Please try again.");
        setState("idle");
        return;
      }
      setState("sent");
    } catch {
      setError("Network error. Please check your connection and try again.");
      setState("idle");
    }
  }

  if (state === "sent") {
    return (
      <FormMessage tone="success">
        <p className="font-semibold">Check your inbox</p>
        <p className="mt-1 text-ink-2">
          We’ve sent a confirmation link to {email.trim()}. Open it to start getting updates. It may take a few minutes,
          and it sometimes lands in spam or promotions.
        </p>
      </FormMessage>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
      <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label>
          Website
          <input tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} />
        </label>
      </div>
      <Field label="Email address" error={error}>
        {({ id, describedBy, invalid }) => (
          <div className="flex flex-col gap-3 sm:flex-row">
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
            <Button type="submit" disabled={state === "sending"} aria-busy={state === "sending"} className="shrink-0">
              {state === "sending" ? "Sending…" : "Sign up"}
            </Button>
          </div>
        )}
      </Field>
      <p className="text-small text-ink-3">
        We email when a report is published and when the survey opens. Unsubscribe at any time. We never share your address.
      </p>
    </form>
  );
}
