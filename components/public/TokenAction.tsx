"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { FormMessage } from "@/components/ui/Form";

/**
 * A button that POSTs an emailed token. Links are never acted on by GET,
 * because mail scanners open links automatically.
 */
export function TokenAction({
  endpoint,
  token,
  label,
  busyLabel,
  successTitle,
  successBody,
}: {
  endpoint: string;
  token: string;
  label: string;
  busyLabel: string;
  successTitle: string;
  successBody: string;
}) {
  const [state, setState] = useState<"idle" | "busy" | "done">("idle");
  const [error, setError] = useState<string | null>(null);

  async function run() {
    setState("busy");
    setError(null);
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        setError(data.error ?? "Something went wrong. Please try again.");
        setState("idle");
        return;
      }
      setState("done");
    } catch {
      setError("Network error. Please check your connection and try again.");
      setState("idle");
    }
  }

  if (state === "done") {
    return (
      <FormMessage tone="success">
        <p className="font-semibold">{successTitle}</p>
        <p className="mt-1 text-ink-2">{successBody}</p>
      </FormMessage>
    );
  }
  return (
    <div className="flex flex-col gap-4">
      {error ? <FormMessage tone="error">{error}</FormMessage> : null}
      <div>
        <Button onClick={run} disabled={state === "busy"} aria-busy={state === "busy"}>
          {state === "busy" ? busyLabel : label}
        </Button>
      </div>
    </div>
  );
}
