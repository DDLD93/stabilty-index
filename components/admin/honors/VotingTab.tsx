"use client";

import { useCallback, useEffect, useState } from "react";
import { NIGERIAN_STATES } from "@/lib/constants";
import { NOMINEE_TYPE_SHORT, NOMINEE_TYPES, type NomineeType } from "@/lib/honors/constants";
import { api, type AdminEdition } from "./api";

export type AdminFinalist = {
  id: string;
  categoryId: string;
  displayName: string;
  nomineeType: NomineeType;
  state: string | null;
  summary: string;
  isActive: boolean;
  sortOrder: number;
  validVotes: number;
  voidVotes: number;
  nomination: { reference: string } | null;
};

type VoteSummary = {
  totals: { valid: number; voided: number; pendingConfirmations: number };
  clusters: { kind: "ipHash" | "deviceHash"; value: string; votes: number; voided: number }[];
};

export function useFinalists(editionId: string) {
  const [finalists, setFinalists] = useState<AdminFinalist[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [key, setKey] = useState(0);
  useEffect(() => {
    let cancelled = false;
    api<{ finalists: AdminFinalist[] }>(`/api/admin/honors/finalists?editionId=${editionId}`)
      .then((r) => {
        if (!cancelled) setFinalists(r.finalists);
      })
      .catch((e: Error) => {
        if (!cancelled) setError(e.message);
      });
    return () => {
      cancelled = true;
    };
  }, [editionId, key]);
  const reload = useCallback(() => setKey((k) => k + 1), []);
  return { finalists, reload, error };
}

export function VotingTab({ edition, onChanged }: { edition: AdminEdition; onChanged: () => void }) {
  const { finalists, reload, error: loadError } = useFinalists(edition.id);
  const [summary, setSummary] = useState<VoteSummary | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [adding, setAdding] = useState<string | null>(null);
  const [draft, setDraft] = useState({ displayName: "", nomineeType: "ORGANISATION" as NomineeType, state: "", summary: "" });
  const canAdd = ["NOMINATIONS_OPEN", "SHORTLISTING"].includes(edition.status);

  const [summaryKey, setSummaryKey] = useState(0);
  useEffect(() => {
    let cancelled = false;
    api<VoteSummary>(`/api/admin/honors/votes?editionId=${edition.id}`)
      .then((r) => {
        if (!cancelled) setSummary(r);
      })
      .catch((e: Error) => {
        if (!cancelled) setError(e.message);
      });
    return () => {
      cancelled = true;
    };
  }, [edition.id, summaryKey]);

  async function run(fn: () => Promise<unknown>) {
    setError(null);
    try {
      await fn();
      reload();
      setSummaryKey((k) => k + 1);
      onChanged();
    } catch (e) {
      setError((e as Error).message);
    }
  }

  return (
    <div className="space-y-6">
      {error || loadError ? <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800">{error ?? loadError}</p> : null}

      <section className="admin-card">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-serif text-lg font-semibold">Votes</h2>
          <a className="admin-btn-secondary" href={`/api/admin/honors/votes/export?editionId=${edition.id}`}>Download votes CSV</a>
        </div>
        <dl className="mt-3 grid grid-cols-3 gap-3 text-sm">
          <div><dt className="text-[color:var(--nsi-ink-soft)]">Counted</dt><dd className="text-xl font-semibold tabular-nums">{summary?.totals.valid ?? "—"}</dd></div>
          <div><dt className="text-[color:var(--nsi-ink-soft)]">Voided</dt><dd className="text-xl font-semibold tabular-nums">{summary?.totals.voided ?? "—"}</dd></div>
          <div><dt className="text-[color:var(--nsi-ink-soft)]">Awaiting email confirmation</dt><dd className="text-xl font-semibold tabular-nums">{summary?.totals.pendingConfirmations ?? "—"}</dd></div>
        </dl>
        {summary?.clusters.length ? (
          <div className="mt-5">
            <h3 className="text-sm font-semibold">Most votes from one network or device</h3>
            <p className="text-xs text-[color:var(--nsi-ink-soft)]">
              Many people can share one mobile-network address, so a large number here is a reason to look closer, not proof of abuse.
            </p>
            <div className="mt-2 overflow-x-auto">
              <table className="w-full min-w-[32rem] text-left text-sm">
                <thead className="text-xs text-[color:var(--nsi-ink-soft)]">
                  <tr><th className="py-2 pr-3">Source</th><th className="py-2 pr-3">ID (hashed)</th><th className="py-2 pr-3 text-right">Votes</th><th className="py-2 pr-3 text-right">Voided</th><th className="py-2"><span className="sr-only">Action</span></th></tr>
                </thead>
                <tbody>
                  {summary.clusters.map((c) => (
                    <tr key={c.kind + c.value} className="border-t border-black/5">
                      <td className="py-2 pr-3">{c.kind === "ipHash" ? "Network" : "Device"}</td>
                      <td className="py-2 pr-3 font-mono text-xs">{c.value.slice(0, 12)}…</td>
                      <td className="py-2 pr-3 text-right tabular-nums">{c.votes}</td>
                      <td className="py-2 pr-3 text-right tabular-nums">{c.voided}</td>
                      <td className="py-2 text-right">
                        <button
                          type="button"
                          className={c.voided < c.votes ? "admin-btn-danger px-3 py-1.5" : "admin-btn-secondary px-3 py-1.5"}
                          onClick={() => {
                            const voiding = c.voided < c.votes;
                            const reason = window.prompt(voiding ? "Why are these votes being voided? (recorded in the audit log)" : "Why are these votes being restored?");
                            if (reason) void run(() => api("/api/admin/honors/votes/void", { method: "POST", json: { editionId: edition.id, by: c.kind, value: c.value, void: voiding, reason } }));
                          }}
                        >
                          {c.voided < c.votes ? "Void all" : "Restore"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : null}
      </section>

      {edition.categories.map((cat) => {
        const list = finalists.filter((f) => f.categoryId === cat.id);
        return (
          <section key={cat.id} className="admin-card">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="font-semibold">{cat.name}</h2>
              <span className="text-xs text-[color:var(--nsi-ink-soft)]">{list.filter((f) => f.isActive).length} active finalists</span>
            </div>
            {list.length === 0 ? <p className="mt-2 text-sm text-[color:var(--nsi-ink-soft)]">No finalists yet. Shortlist from the Nominations tab.</p> : null}
            <ul className="mt-3 divide-y divide-black/5">
              {list.map((f) => (
                <li key={f.id} className="flex flex-col gap-2 py-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <p className={`font-medium ${f.isActive ? "" : "line-through opacity-60"}`}>{f.displayName}</p>
                    <p className="text-xs text-[color:var(--nsi-ink-soft)]">
                      {NOMINEE_TYPE_SHORT[f.nomineeType]}{f.state ? ` · ${f.state}` : ""}{f.nomination ? ` · from ${f.nomination.reference}` : " · added by hand"}
                    </p>
                    <p className="mt-1 text-sm">{f.summary}</p>
                  </div>
                  <div className="flex shrink-0 items-center gap-3">
                    <span className="text-sm tabular-nums">{f.validVotes} votes{f.voidVotes ? ` (+${f.voidVotes} void)` : ""}</span>
                    <button
                      type="button"
                      className="admin-btn-ghost px-3 py-1.5"
                      onClick={() => {
                        const summaryText = window.prompt("Public summary", f.summary);
                        if (summaryText && summaryText !== f.summary) void run(() => api(`/api/admin/honors/finalists/${f.id}`, { method: "PATCH", json: { summary: summaryText } }));
                      }}
                    >
                      Edit summary
                    </button>
                    <button
                      type="button"
                      className="admin-btn-secondary px-3 py-1.5"
                      onClick={() => {
                        if (f.isActive && !window.confirm(`Withdraw ${f.displayName}? Existing votes stay recorded but stop counting.`)) return;
                        void run(() => api(`/api/admin/honors/finalists/${f.id}`, { method: "PATCH", json: { isActive: !f.isActive } }));
                      }}
                    >
                      {f.isActive ? "Withdraw" : "Reinstate"}
                    </button>
                  </div>
                </li>
              ))}
            </ul>
            {canAdd ? (
              adding === cat.id ? (
                <div className="mt-3 space-y-3 rounded-xl bg-black/[0.02] p-4">
                  <div className="grid gap-3 sm:grid-cols-3">
                    <label className="block sm:col-span-1">
                      <span className="text-sm font-medium">Name</span>
                      <input className="admin-input mt-1" value={draft.displayName} onChange={(e) => setDraft((d) => ({ ...d, displayName: e.target.value }))} />
                    </label>
                    <label className="block">
                      <span className="text-sm font-medium">Type</span>
                      <select className="admin-select mt-1" value={draft.nomineeType} onChange={(e) => setDraft((d) => ({ ...d, nomineeType: e.target.value as NomineeType }))}>
                        {NOMINEE_TYPES.filter((t) => cat.allowedNomineeTypes.includes(t)).map((t) => <option key={t} value={t}>{NOMINEE_TYPE_SHORT[t]}</option>)}
                      </select>
                    </label>
                    <label className="block">
                      <span className="text-sm font-medium">State</span>
                      <select className="admin-select mt-1" value={draft.state} onChange={(e) => setDraft((d) => ({ ...d, state: e.target.value }))}>
                        <option value="">—</option>
                        {NIGERIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </label>
                  </div>
                  <label className="block">
                    <span className="text-sm font-medium">Public summary</span>
                    <textarea rows={2} className="admin-input mt-1" value={draft.summary} onChange={(e) => setDraft((d) => ({ ...d, summary: e.target.value }))} />
                  </label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      className="admin-btn-primary"
                      onClick={() =>
                        run(async () => {
                          await api("/api/admin/honors/finalists", { method: "POST", json: { categoryId: cat.id, displayName: draft.displayName, nomineeType: draft.nomineeType, state: draft.state || null, summary: draft.summary } });
                          setAdding(null);
                          setDraft({ displayName: "", nomineeType: "ORGANISATION", state: "", summary: "" });
                        })
                      }
                    >
                      Add finalist
                    </button>
                    <button type="button" className="admin-btn-ghost" onClick={() => setAdding(null)}>Cancel</button>
                  </div>
                </div>
              ) : (
                <button type="button" className="admin-btn-ghost mt-2" onClick={() => setAdding(cat.id)}>Add a finalist by hand</button>
              )
            ) : null}
          </section>
        );
      })}
    </div>
  );
}
