"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Action = "OPEN" | "CLOSE" | "NEXT";

async function send(action: Action) {
  const res = await fetch("/api/admin/cycle", {
    method: "PATCH",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ action }),
  });
  if (!res.ok) {
    const data = (await res.json().catch(() => null)) as { error?: string } | null;
    throw new Error(data?.error ?? "Request failed.");
  }
}

export function CycleControls() {
  const router = useRouter();
  const [loading, setLoading] = useState<Action | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function onClick(action: Action) {
    setError(null);
    setLoading(action);
    try {
      await send(action);
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Request failed.");
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="flex flex-wrap gap-3">
      <button
        className="rounded-xl border border-black/15 bg-white px-4 py-2 text-sm font-medium hover:bg-black/[.03] disabled:opacity-60"
        type="button"
        disabled={!!loading}
        onClick={() => onClick("OPEN")}
      >
        {loading === "OPEN" ? "Opening…" : "Open collection"}
      </button>

      <button
        className="rounded-xl bg-[color:var(--nsi-green)] px-4 py-2 text-sm font-medium text-white hover:opacity-95 disabled:opacity-60"
        type="button"
        disabled={!!loading}
        onClick={() => onClick("CLOSE")}
      >
        {loading === "CLOSE" ? "Closing…" : "Close collection"}
      </button>

      <button
        className="rounded-xl border border-black/15 bg-white px-4 py-2 text-sm font-medium hover:bg-black/[.03] disabled:opacity-60"
        type="button"
        disabled={!!loading}
        onClick={() => onClick("NEXT")}
      >
        {loading === "NEXT" ? "Creating…" : "Create next cycle"}
      </button>

      {error ? (
        <div className="w-full rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {error}
        </div>
      ) : null}
    </div>
  );
}

