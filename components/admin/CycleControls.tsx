"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Action = "OPEN" | "CLOSE" | "NEXT";

async function send(action: Action, monthYear?: string) {
  const body: { action: Action; monthYear?: string } = { action };
  if (monthYear?.trim()) body.monthYear = monthYear.trim();
  const res = await fetch("/api/admin/cycle", {
    method: "PATCH",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const data = (await res.json().catch(() => null)) as { error?: string } | null;
    throw new Error(data?.error ?? "Request failed.");
  }
}

const defaultMonthYear = () =>
  new Intl.DateTimeFormat("en-NG", { month: "long", year: "numeric" }).format(new Date());

type CycleStatus = "OPEN" | "CLOSED" | "ARCHIVED";

type CycleControlsProps = {
  cycleStatus?: CycleStatus | null;
};

export function CycleControls({ cycleStatus = null }: CycleControlsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState<Action | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showNextModal, setShowNextModal] = useState(false);
  const [nextCycleName, setNextCycleName] = useState("");

  const cannotOpen = cycleStatus === "ARCHIVED";

  async function onClick(action: Action, monthYear?: string) {
    setError(null);
    setLoading(action);
    try {
      await send(action, monthYear);
      setShowNextModal(false);
      setNextCycleName("");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Request failed.");
    } finally {
      setLoading(null);
    }
  }

  function openNextModal() {
    setNextCycleName(defaultMonthYear());
    setShowNextModal(true);
  }

  return (
    <div className="flex flex-wrap gap-3">
      <button
        className="rounded-xl border border-black/15 bg-white px-4 py-2 text-sm font-medium hover:bg-black/[.03] disabled:opacity-60"
        type="button"
        disabled={!!loading || cannotOpen}
        onClick={() => onClick("OPEN")}
        title={cannotOpen ? "Archived cycles cannot be reopened." : undefined}
        aria-label={cannotOpen ? "Open collection (archived cycles cannot be reopened)" : "Open collection"}
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
        onClick={openNextModal}
      >
        {loading === "NEXT" ? "Creating…" : "Create next cycle"}
      </button>

      {showNextModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="next-cycle-title"
        >
          <div className="w-full max-w-sm rounded-2xl border border-black/10 bg-white p-6 shadow-lg">
            <h2 id="next-cycle-title" className="text-sm font-semibold uppercase tracking-wide text-[color:var(--nsi-ink-soft)]">
              New cycle name
            </h2>
            <p className="mt-1 text-sm text-[color:var(--nsi-ink-soft)]">
              Optionally edit the name for the new cycle (e.g. month and year).
            </p>
            <input
              type="text"
              value={nextCycleName}
              onChange={(e) => setNextCycleName(e.target.value)}
              placeholder={defaultMonthYear()}
              className="mt-4 w-full rounded-xl border border-black/15 bg-white px-4 py-2.5 text-[color:var(--nsi-ink)] placeholder:text-black/40 focus:border-[color:var(--nsi-green)] focus:outline-none focus:ring-1 focus:ring-[color:var(--nsi-green)]"
              aria-label="Cycle name"
            />
            <div className="mt-6 flex gap-3">
              <button
                type="button"
                className="rounded-xl border border-black/15 bg-white px-4 py-2 text-sm font-medium hover:bg-black/[.03]"
                onClick={() => {
                  setShowNextModal(false);
                  setNextCycleName("");
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                className="rounded-xl bg-[color:var(--nsi-green)] px-4 py-2 text-sm font-medium text-white hover:opacity-95 disabled:opacity-60"
                disabled={loading === "NEXT"}
                onClick={() => onClick("NEXT", nextCycleName)}
              >
                {loading === "NEXT" ? "Creating…" : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}

      {error ? (
        <div className="w-full rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {error}
        </div>
      ) : null}
    </div>
  );
}

