"use client";

import { useState } from "react";
import { api, type AdminCategory, type AdminEdition } from "./api";
import { useFinalists, type AdminFinalist } from "./VotingTab";

function CategoryWinner({ category, finalists, canSet, onSaved }: { category: AdminCategory; finalists: AdminFinalist[]; canSet: boolean; onSaved: () => void }) {
  const ranked = [...finalists].filter((f) => f.isActive).sort((a, b) => b.validVotes - a.validVotes);
  const top = ranked[0]?.validVotes ?? 0;
  const leaders = ranked.filter((f) => f.validVotes === top && top > 0);
  const [finalistId, setFinalistId] = useState(category.winnerFinalistId ?? (leaders.length === 1 ? leaders[0].id : ""));
  const [citation, setCitation] = useState(category.winnerCitation ?? "");
  const [note, setNote] = useState(category.winnerNote ?? "");
  const [msg, setMsg] = useState<{ tone: "ok" | "error"; text: string } | null>(null);
  const total = ranked.reduce((s, f) => s + f.validVotes, 0);
  const isOverride = finalistId !== "" && !(leaders.length === 1 && leaders[0].id === finalistId);

  async function save() {
    setMsg(null);
    try {
      const r = await api<{ override: boolean }>(`/api/admin/honors/categories/${category.id}/winner`, {
        method: "PATCH",
        json: { finalistId: finalistId || null, citation: citation || null, note: note || null },
      });
      setMsg({ tone: "ok", text: r.override ? "Saved, with your recorded reason." : "Saved." });
      onSaved();
    } catch (e) {
      setMsg({ tone: "error", text: (e as Error).message });
    }
  }

  async function publish(published: boolean) {
    setMsg(null);
    try {
      await api(`/api/admin/honors/categories/${category.id}/publish`, { method: "POST", json: { published } });
      setMsg({ tone: "ok", text: published ? "Published on the public site." : "Unpublished." });
      onSaved();
    } catch (e) {
      setMsg({ tone: "error", text: (e as Error).message });
    }
  }

  return (
    <section className="admin-card space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="font-semibold">{category.name}</h2>
        <span className="text-xs text-[color:var(--nsi-ink-soft)]">
          {category.winnerPublishedAt ? `Published ${new Date(category.winnerPublishedAt).toLocaleDateString("en-GB")}` : "Not published"}
        </span>
      </div>
      {ranked.length === 0 ? <p className="text-sm text-[color:var(--nsi-ink-soft)]">No active finalists.</p> : null}
      <fieldset disabled={!canSet} className="space-y-2">
        <legend className="sr-only">Winner</legend>
        {ranked.map((f) => (
          <label key={f.id} className="flex items-center justify-between gap-3 rounded-lg border border-black/10 px-3 py-2 text-sm">
            <span className="flex items-center gap-2">
              <input type="radio" name={`winner-${category.id}`} checked={finalistId === f.id} onChange={() => setFinalistId(f.id)} />
              {f.displayName}
              {leaders.some((l) => l.id === f.id) ? <span className="rounded bg-emerald-50 px-1.5 py-0.5 text-xs text-emerald-900">{leaders.length > 1 ? "Tied lead" : "Most votes"}</span> : null}
            </span>
            <span className="tabular-nums">{f.validVotes}{total ? ` · ${Math.round((f.validVotes / total) * 100)}%` : ""}</span>
          </label>
        ))}
      </fieldset>
      {isOverride || leaders.length > 1 ? (
        <label className="block">
          <span className="text-sm font-medium text-amber-900">
            {leaders.length > 1 ? "This award is tied. Explain how the tie was settled." : "This isn’t the finalist with the most votes. Explain why (for example, a disqualification)."}
          </span>
          <textarea rows={2} className="admin-input mt-1" value={note} onChange={(e) => setNote(e.target.value)} />
        </label>
      ) : null}
      <label className="block">
        <span className="text-sm font-medium">Citation (public, plain text; blank line between paragraphs)</span>
        <textarea rows={4} className="admin-input mt-1" value={citation} onChange={(e) => setCitation(e.target.value)} disabled={!canSet} />
      </label>
      {msg ? <p role="status" className={`rounded-lg px-3 py-2 text-sm ${msg.tone === "ok" ? "bg-emerald-50 text-emerald-900" : "bg-red-50 text-red-800"}`}>{msg.text}</p> : null}
      <div className="flex flex-wrap gap-2">
        <button type="button" className="admin-btn-primary" disabled={!canSet} onClick={save}>Save winner</button>
        {category.winnerPublishedAt ? (
          <button type="button" className="admin-btn-secondary" onClick={() => publish(false)}>Unpublish</button>
        ) : (
          <button type="button" className="admin-btn-secondary" disabled={!canSet || !category.winnerFinalistId} onClick={() => publish(true)}>Publish winner</button>
        )}
      </div>
    </section>
  );
}

export function WinnersTab({ edition, onChanged }: { edition: AdminEdition; onChanged: () => void }) {
  const { finalists, reload } = useFinalists(edition.id);
  const canSet = ["VOTING_CLOSED", "ANNOUNCED"].includes(edition.status);
  return (
    <div className="space-y-4">
      {!canSet ? (
        <p className="rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-900">Winners can be set once voting has closed.</p>
      ) : (
        <p className="text-sm text-[color:var(--nsi-ink-soft)]">
          The finalist with the most counted votes wins. Publish each winner when ready, then use “Announce winners” on the Edition tab.
        </p>
      )}
      {edition.categories.filter((c) => c.isActive).map((c) => (
        <CategoryWinner
          key={`${c.id}-${c.winnerFinalistId ?? "none"}-${finalists.length}`}
          category={c}
          finalists={finalists.filter((f) => f.categoryId === c.id)}
          canSet={canSet}
          onSaved={() => {
            void reload();
            onChanged();
          }}
        />
      ))}
    </div>
  );
}
