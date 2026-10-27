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
    <div className="flex flex-wrap gap-2.5">
      <button
        className="admin-btn-secondary disabled:opacity-50"
        type="button"
        disabled={!!loading || cannotOpen}
        onClick={() => onClick("OPEN")}
        title={cannotOpen ? "Archived cycles cannot be reopened." : undefined}
        aria-label={cannotOpen ? "Open collection (archived cycles cannot be reopened)" : "Open collection"}
      >
        {loading === "OPEN" ? "Opening…" : "Open Collection"}
      </button>

      <button
        className="admin-btn-primary disabled:opacity-50"
        type="button"
        disabled={!!loading}
        onClick={() => onClick("CLOSE")}
      >
        {loading === "CLOSE" ? "Closing…" : "Close Collection"}
      </button>

      <button
        className="admin-btn-secondary disabled:opacity-50"
        type="button"
        disabled={!!loading}
        onClick={openNextModal}
      >
        {loading === "NEXT" ? "Creating…" : "Create Next Cycle"}
      </button>

      {showNextModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="next-cycle-title"
        >
          <div className="w-full max-w-sm rounded-[3px] border border-[color:var(--nsi-rule-strong)] bg-white p-6 shadow-lg">
            <h2 id="next-cycle-title" className="font-mono text-xs font-bold uppercase tracking-[0.16em] text-[color:var(--nsi-ink)]">
              Initialize New Reporting Cycle
            </h2>
            <p className="mt-1.5 text-sm text-[color:var(--nsi-ink-soft)]">
              Specify the edition title for the new cycle (e.g. Month and Year).
            </p>
            <input
              type="text"
              value={nextCycleName}
              onChange={(e) => setNextCycleName(e.target.value)}
              placeholder={defaultMonthYear()}
              className="admin-input mt-4 w-full"
              aria-label="Cycle name"
            />
            <div className="mt-6 flex justify-end gap-2.5">
              <button
                type="button"
                className="admin-btn-secondary"
                onClick={() => {
                  setShowNextModal(false);
                  setNextCycleName("");
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                className="admin-btn-primary disabled:opacity-50"
                disabled={loading === "NEXT"}
                onClick={() => onClick("NEXT", nextCycleName)}
              >
                {loading === "NEXT" ? "Creating…" : "Create Cycle"}
              </button>
            </div>
          </div>
        </div>
      )}

      {error ? (
        <div className="w-full rounded-[3px] border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-900">
          {error}
        </div>
      ) : null}
    </div>
  );
}
