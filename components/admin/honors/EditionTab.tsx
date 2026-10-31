"use client";

import { useState } from "react";
import { EDITION_STATUS_LABELS, type EditionStatus } from "@/lib/honors/constants";
import { ALLOWED_TRANSITIONS } from "@/lib/honors/phase";
import { api, fromLagosInput, toLagosInput, type AdminEdition } from "./api";

const ACTION_LABELS: Partial<Record<EditionStatus, string>> = {
  NOMINATIONS_OPEN: "Open nominations",
  SHORTLISTING: "Close nominations and start shortlisting",
  VOTING_OPEN: "Open public voting",
  VOTING_CLOSED: "Close voting",
  ANNOUNCED: "Announce winners",
  ARCHIVED: "Archive edition",
  DRAFT: "Move back to draft",
};

export function EditionTab({ edition, mailConfigured, onChanged }: { edition: AdminEdition; mailConfigured: boolean; onChanged: () => void }) {
  const [form, setForm] = useState({
    title: edition.title,
    nominationsOpenAt: toLagosInput(edition.nominationsOpenAt),
    nominationsCloseAt: toLagosInput(edition.nominationsCloseAt),
    votingOpenAt: toLagosInput(edition.votingOpenAt),
    votingCloseAt: toLagosInput(edition.votingCloseAt),
    ceremonyAt: toLagosInput(edition.ceremonyAt),
    ceremonyVenue: edition.ceremonyVenue ?? "",
    ceremonyDetails: edition.ceremonyDetails ?? "",
    showVoteResults: edition.showVoteResults,
  });
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ tone: "ok" | "error"; text: string } | null>(null);

  async function save() {
    setBusy(true);
    setMessage(null);
    try {
      await api(`/api/admin/honors/editions/${edition.id}`, {
        method: "PATCH",
        json: {
          title: form.title,
          nominationsOpenAt: fromLagosInput(form.nominationsOpenAt),
          nominationsCloseAt: fromLagosInput(form.nominationsCloseAt),
          votingOpenAt: fromLagosInput(form.votingOpenAt),
          votingCloseAt: fromLagosInput(form.votingCloseAt),
          ceremonyAt: fromLagosInput(form.ceremonyAt),
          ceremonyVenue: form.ceremonyVenue || null,
          ceremonyDetails: form.ceremonyDetails || null,
          showVoteResults: form.showVoteResults,
        },
      });
      setMessage({ tone: "ok", text: "Saved." });
      onChanged();
    } catch (e) {
      setMessage({ tone: "error", text: (e as Error).message });
    } finally {
      setBusy(false);
    }
  }

  async function move(to: EditionStatus) {
    if (!window.confirm(`${ACTION_LABELS[to] ?? to}? This changes what the public sees.`)) return;
    setBusy(true);
    setMessage(null);
    try {
      await api(`/api/admin/honors/editions/${edition.id}/status`, { method: "POST", json: { to } });
      setMessage({ tone: "ok", text: `Status changed to ${EDITION_STATUS_LABELS[to]}.` });
      onChanged();
    } catch (e) {
      setMessage({ tone: "error", text: (e as Error).message });
    } finally {
      setBusy(false);
    }
  }

  async function purge() {
    if (!window.confirm("Delete every nominator’s name and email for this edition? This can’t be undone.")) return;
    try {
      const r = await api<{ purged: number }>(`/api/admin/honors/editions/${edition.id}/purge-contacts`, { method: "POST" });
      setMessage({ tone: "ok", text: `Removed contact details from ${r.purged} nominations.` });
      onChanged();
    } catch (e) {
      setMessage({ tone: "error", text: (e as Error).message });
    }
  }

  const dateField = (key: keyof typeof form, label: string) => (
    <label className="block">
      <span className="text-sm font-medium">{label}</span>
      <input
        type="datetime-local"
        className="admin-input mt-1"
        value={form[key] as string}
        onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
      />
    </label>
  );

  return (
    <div className="space-y-6">
      <section className="admin-card">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-serif text-lg font-semibold">Stage</h2>
            <p className="mt-1 text-sm text-[color:var(--nsi-ink-soft)]">
              Now: <strong className="text-[color:var(--nsi-ink)]">{EDITION_STATUS_LABELS[edition.status]}</strong>.{" "}
              {edition._count.nominations} nominations, {edition._count.finalists} finalists, {edition._count.votes} confirmed votes.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {ALLOWED_TRANSITIONS[edition.status].map((to, i) => (
              <button key={to} type="button" disabled={busy} onClick={() => move(to)} className={i === 0 ? "admin-btn-primary" : "admin-btn-secondary"}>
                {ACTION_LABELS[to] ?? to}
              </button>
            ))}
          </div>
        </div>
        {!mailConfigured ? (
          <p className="mt-4 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-900">
            Email (SMTP) is not configured. Nominations still work, but public voting can’t open until it is, because every
            vote is confirmed by email.
          </p>
        ) : null}
        {message ? (
          <p role="status" className={`mt-4 rounded-lg px-3 py-2 text-sm ${message.tone === "ok" ? "bg-emerald-50 text-emerald-900" : "bg-red-50 text-red-800"}`}>
            {message.text}
          </p>
        ) : null}
      </section>

      <section className="admin-card space-y-5">
        <h2 className="font-serif text-lg font-semibold">Details and dates</h2>
        <p className="text-sm text-[color:var(--nsi-ink-soft)]">
          Times are Lagos time. Leave a date empty to show “To be announced”. Dates narrow each stage; the stage itself
          is set with the buttons above.
        </p>
        <label className="block">
          <span className="text-sm font-medium">Title</span>
          <input className="admin-input mt-1" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} />
        </label>
        <div className="grid gap-4 sm:grid-cols-2">
          {dateField("nominationsOpenAt", "Nominations open")}
          {dateField("nominationsCloseAt", "Nominations close")}
          {dateField("votingOpenAt", "Voting opens")}
          {dateField("votingCloseAt", "Voting closes")}
          {dateField("ceremonyAt", "Winners announced / ceremony")}
          <label className="block">
            <span className="text-sm font-medium">Ceremony venue</span>
            <input className="admin-input mt-1" value={form.ceremonyVenue} onChange={(e) => setForm((f) => ({ ...f, ceremonyVenue: e.target.value }))} />
          </label>
        </div>
        <label className="block">
          <span className="text-sm font-medium">Ceremony details (optional, plain text)</span>
          <textarea rows={3} className="admin-input mt-1" value={form.ceremonyDetails} onChange={(e) => setForm((f) => ({ ...f, ceremonyDetails: e.target.value }))} />
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={form.showVoteResults} onChange={(e) => setForm((f) => ({ ...f, showVoteResults: e.target.checked }))} />
          Show each finalist’s share of the vote once a winner is published
        </label>
        <div>
          <button type="button" className="admin-btn-primary" disabled={busy} onClick={save}>
            Save details
          </button>
        </div>
      </section>

      {edition.status === "ARCHIVED" ? (
        <section className="admin-card">
          <h2 className="font-serif text-lg font-semibold">Nominator contact details</h2>
          <p className="mt-1 text-sm text-[color:var(--nsi-ink-soft)]">
            {edition.contactsPurgedAt
              ? `Deleted on ${new Date(edition.contactsPurgedAt).toLocaleDateString("en-GB")}.`
              : "The privacy notice promises to delete nominators’ names and emails once an edition is archived."}
          </p>
          {!edition.contactsPurgedAt ? (
            <button type="button" className="admin-btn-danger mt-3" onClick={purge}>
              Delete nominator contacts
            </button>
          ) : null}
        </section>
      ) : null}
    </div>
  );
}
