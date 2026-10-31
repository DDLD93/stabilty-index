"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { Button, buttonVariants } from "@/components/ui/Button";
import { FormMessage } from "@/components/ui/Form";

type Result = { category: string; slug: string; finalist: string; status: "recorded" | "already_voted" | "withdrawn" };

const STATUS_TEXT: Record<Result["status"], string> = {
  recorded: "Vote counted",
  already_voted: "Not counted: this email has already voted in this award",
  withdrawn: "Not counted: this finalist has been withdrawn",
};

/** Confirms on a button press (POST), never on page load. */
export function ConfirmVote({ token }: { token: string }) {
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<Result[]>([]);
  const headingRef = useRef<HTMLHeadingElement>(null);

  async function confirm() {
    setState("sending");
    setError(null);
    try {
      const res = await fetch("/api/public/honors/vote/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      const data = (await res.json().catch(() => ({}))) as { results?: Result[]; error?: string };
      if (!res.ok || !data.results) {
        setError(data.error ?? "Something went wrong. Please try again.");
        setState("error");
        return;
      }
      setResults(data.results);
      setState("done");
      window.history.replaceState(null, "", "/honors/vote/confirm");
      requestAnimationFrame(() => headingRef.current?.focus());
    } catch {
      setError("Network error. Please check your connection and try again.");
      setState("error");
    }
  }

  if (state === "done") {
    const counted = results.filter((r) => r.status === "recorded").length;
    return (
      <div className="border-t-4 border-gold bg-gold-tint px-6 py-8 sm:px-8">
        <h2 ref={headingRef} tabIndex={-1} className="text-h2 focus:outline-none">
          {counted > 0 ? "Thank you. Your vote is confirmed." : "Nothing new was counted"}
        </h2>
        <ul className="mt-6 border-t border-line">
          {results.map((r) => (
            <li key={r.slug} className="border-b border-line py-3">
              <span className="block font-semibold">{r.category}</span>
              <span className="block text-small text-ink-2">
                {r.finalist}: {STATUS_TEXT[r.status]}
              </span>
            </li>
          ))}
        </ul>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/honors" className={buttonVariants({ variant: "gold" })}>
            Back to NSI Honors
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      {error ? (
        <FormMessage tone="error" className="mb-6">
          {error}
        </FormMessage>
      ) : null}
      <Button variant="gold" size="lg" onClick={confirm} disabled={state === "sending"} aria-busy={state === "sending"}>
        {state === "sending" ? "Confirming…" : "Confirm my vote"}
      </Button>
    </div>
  );
}
