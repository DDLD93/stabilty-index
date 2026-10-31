"use client";

import { useEffect, useState } from "react";
import { NOMINATOR_RELATION_LABELS, NOMINEE_TYPE_SHORT, type NominatorRelation, type NomineeType } from "@/lib/honors/constants";
import { api, type AdminEdition } from "./api";

type Nomination = {
  id: string;
  reference: string;
  createdAt: string;
  status: "PENDING" | "SHORTLISTED" | "REJECTED" | "DUPLICATE";
  nomineeType: NomineeType;
  nomineeName: string;
  nomineeState: string | null;
  nomineeLga: string | null;
  nomineeAffiliation: string | null;
  reason: string;
  evidenceUrls: string[];
  nominatorName: string | null;
  nominatorEmail: string | null;
  nominatorRelation: NominatorRelation;
  adminNote: string | null;
  category: { id: string; name: string };
  finalist: { id: string } | null;
  agent: { name: string; referrerCode: string } | null;
};

type ListResponse = { items: Nomination[]; totalCount: number; page: number; take: number; counts: Record<string, number> };

const STATUS_LABEL: Record<Nomination["status"], string> = {
  PENDING: "To review",
  SHORTLISTED: "Finalist",
  REJECTED: "Rejected",
  DUPLICATE: "Duplicate",
};

export function NominationsTab({ edition, onChanged }: { edition: AdminEdition; onChanged: () => void }) {
  const [categoryId, setCategoryId] = useState("");
  const [status, setStatus] = useState("PENDING");
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [data, setData] = useState<ListResponse | null>(null);
  const [open, setOpen] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [shortlistFor, setShortlistFor] = useState<Nomination | null>(null);
  const [shortlist, setShortlist] = useState({ displayName: "", summary: "" });

  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    const params = new URLSearchParams({ editionId: edition.id, page: String(page), take: "25" });
    if (categoryId) params.set("categoryId", categoryId);
    if (status) params.set("status", status);
    if (q.trim()) params.set("q", q.trim());
    api<ListResponse>(`/api/admin/honors/nominations?${params}`)
      .then((r) => {
        if (cancelled) return;
        setData(r);
        setError(null);
      })
      .catch((e: Error) => {
        if (!cancelled) setError(e.message);
      });
    return () => {
      cancelled = true;
    };
  }, [edition.id, page, categoryId, status, q, reloadKey]);

  async function act(id: string, json: Record<string, unknown>) {
    try {
      await api(`/api/admin/honors/nominations/${id}`, { method: "PATCH", json });
      setReloadKey((k) => k + 1);
      onChanged();
    } catch (e) {
      setError((e as Error).message);
    }
  }

  async function doShortlist() {
    if (!shortlistFor) return;
    try {
      await api(`/api/admin/honors/nominations/${shortlistFor.id}/shortlist`, { method: "POST", json: shortlist });
      setShortlistFor(null);
      setReloadKey((k) => k + 1);
      onChanged();
    } catch (e) {
      setError((e as Error).message);
    }
  }

  const pages = data ? Math.max(1, Math.ceil(data.totalCount / data.take)) : 1;

  return (
    <div className="space-y-4">
      <div className="admin-card flex flex-wrap items-end gap-3">
        <label className="block min-w-[12rem] flex-1">
          <span className="text-sm font-medium">Category</span>
          <select className="admin-select mt-1" value={categoryId} onChange={(e) => { setCategoryId(e.target.value); setPage(1); }}>
            <option value="">All categories</option>
            {edition.categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </label>
        <label className="block min-w-[10rem]">
          <span className="text-sm font-medium">Status</span>
          <select className="admin-select mt-1" value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }}>
            <option value="">All</option>
            {Object.entries(STATUS_LABEL).map(([k, v]) => (
              <option key={k} value={k}>{v} {data?.counts[k] !== undefined ? `(${data.counts[k]})` : ""}</option>
            ))}
          </select>
        </label>
        <label className="block min-w-[12rem] flex-1">
          <span className="text-sm font-medium">Search</span>
          <input className="admin-input mt-1" placeholder="Nominee, state or reference" value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }} />
        </label>
        <a className="admin-btn-secondary" href={`/api/admin/honors/nominations/export?editionId=${edition.id}`}>
          Download CSV
        </a>
      </div>

      {error ? <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800">{error}</p> : null}

      {shortlistFor ? (
        <div className="admin-card space-y-3 border-[color:var(--nsi-gold)]">
          <h3 className="font-semibold">Make “{shortlistFor.nomineeName}” a finalist in {shortlistFor.category.name}</h3>
          <label className="block">
            <span className="text-sm font-medium">Public name</span>
            <input className="admin-input mt-1" value={shortlist.displayName} onChange={(e) => setShortlist((s) => ({ ...s, displayName: e.target.value }))} />
          </label>
          <label className="block">
            <span className="text-sm font-medium">Public summary (shown on the ballot, 20–600 characters)</span>
            <textarea rows={3} className="admin-input mt-1" value={shortlist.summary} onChange={(e) => setShortlist((s) => ({ ...s, summary: e.target.value }))} />
          </label>
          <div className="flex gap-2">
            <button type="button" className="admin-btn-primary" onClick={doShortlist}>Add as finalist</button>
            <button type="button" className="admin-btn-ghost" onClick={() => setShortlistFor(null)}>Cancel</button>
          </div>
        </div>
      ) : null}

      <div className="overflow-x-auto rounded-2xl border border-black/10 bg-white">
        <table className="w-full min-w-[44rem] text-left text-sm">
          <thead className="border-b border-black/10 bg-black/[0.03] text-xs text-[color:var(--nsi-ink-soft)]">
            <tr>
              <th className="px-4 py-3 font-semibold">Nominee</th>
              <th className="px-4 py-3 font-semibold">Category</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 font-semibold">Received</th>
              <th className="px-4 py-3 font-semibold"><span className="sr-only">Actions</span></th>
            </tr>
          </thead>
          <tbody>
            {data?.items.length === 0 ? (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-[color:var(--nsi-ink-soft)]">No nominations match.</td></tr>
            ) : null}
            {data?.items.map((n) => (
              <FragmentRow key={n.id}>
                <tr className="border-b border-black/5 align-top">
                  <td className="px-4 py-3">
                    <button type="button" className="text-left font-semibold hover:underline" aria-expanded={open === n.id} onClick={() => setOpen(open === n.id ? null : n.id)}>
                      {n.nomineeName}
                    </button>
                    <div className="text-xs text-[color:var(--nsi-ink-soft)]">
                      {NOMINEE_TYPE_SHORT[n.nomineeType]}{n.nomineeState ? ` · ${n.nomineeState}` : ""} · {n.reference}
                    </div>
                  </td>
                  <td className="px-4 py-3">{n.category.name}</td>
                  <td className="px-4 py-3">{STATUS_LABEL[n.status]}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{new Date(n.createdAt).toLocaleDateString("en-GB")}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap justify-end gap-1.5">
                      {!n.finalist && ["NOMINATIONS_OPEN", "SHORTLISTING"].includes(edition.status) ? (
                        <button type="button" className="admin-btn-primary px-3 py-1.5" onClick={() => { setShortlistFor(n); setShortlist({ displayName: n.nomineeName, summary: "" }); }}>
                          Shortlist
                        </button>
                      ) : null}
                      {!n.finalist && n.status !== "REJECTED" ? (
                        <button type="button" className="admin-btn-secondary px-3 py-1.5" onClick={() => act(n.id, { status: "REJECTED" })}>Reject</button>
                      ) : null}
                      {!n.finalist && n.status !== "DUPLICATE" ? (
                        <button
                          type="button"
                          className="admin-btn-ghost px-3 py-1.5"
                          onClick={() => {
                            const ref = window.prompt("Reference of the original nomination (e.g. H26-ABC123)");
                            if (ref) void act(n.id, { status: "DUPLICATE", duplicateOfReference: ref });
                          }}
                        >
                          Duplicate
                        </button>
                      ) : null}
                      {!n.finalist && n.status !== "PENDING" ? (
                        <button type="button" className="admin-btn-ghost px-3 py-1.5" onClick={() => act(n.id, { status: "PENDING" })}>Reset</button>
                      ) : null}
                    </div>
                  </td>
                </tr>
                {open === n.id ? (
                  <tr className="border-b border-black/5 bg-black/[0.02]">
                    <td colSpan={5} className="space-y-3 px-4 py-4">
                      <p className="whitespace-pre-line">{n.reason}</p>
                      {n.evidenceUrls.length ? (
                        <ul className="list-disc pl-5">
                          {n.evidenceUrls.map((u) => (
                            <li key={u}><a href={u} target="_blank" rel="nofollow noopener noreferrer ugc" className="break-all text-[color:var(--nsi-green)] underline">{u}</a></li>
                          ))}
                        </ul>
                      ) : <p className="text-[color:var(--nsi-ink-soft)]">No evidence links.</p>}
                      <p className="text-xs text-[color:var(--nsi-ink-soft)]">
                        From {n.nominatorName ?? "(no name)"} {n.nominatorEmail ? `<${n.nominatorEmail}>` : "(contact deleted)"} · {NOMINATOR_RELATION_LABELS[n.nominatorRelation]}
                        {n.agent ? ` · via agent ${n.agent.name} (${n.agent.referrerCode})` : ""}
                        {n.nomineeAffiliation ? ` · ${n.nomineeAffiliation}` : ""}{n.nomineeLga ? ` · ${n.nomineeLga} LGA` : ""}
                      </p>
                      <NoteEditor initial={n.adminNote ?? ""} onSave={(note) => act(n.id, { adminNote: note || null })} />
                    </td>
                  </tr>
                ) : null}
              </FragmentRow>
            ))}
          </tbody>
        </table>
      </div>

      {data && pages > 1 ? (
        <div className="flex items-center justify-between text-sm">
          <span>Page {page} of {pages} · {data.totalCount} nominations</span>
          <div className="flex gap-2">
            <button type="button" className="admin-btn-secondary" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>Previous</button>
            <button type="button" className="admin-btn-secondary" disabled={page >= pages} onClick={() => setPage((p) => p + 1)}>Next</button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function FragmentRow({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

function NoteEditor({ initial, onSave }: { initial: string; onSave: (note: string) => void }) {
  const [note, setNote] = useState(initial);
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-start">
      <label className="block flex-1">
        <span className="sr-only">Internal note</span>
        <textarea rows={2} className="admin-input" placeholder="Internal note (not public)" value={note} onChange={(e) => setNote(e.target.value)} />
      </label>
      <button type="button" className="admin-btn-secondary" onClick={() => onSave(note)}>Save note</button>
    </div>
  );
}
