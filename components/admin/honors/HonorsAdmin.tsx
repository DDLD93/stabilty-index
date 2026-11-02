"use client";

import { useEffect, useState } from "react";
import { EDITION_STATUS_LABELS } from "@/lib/honors/constants";
import { api, type Overview } from "./api";
import { CategoriesTab } from "./CategoriesTab";
import { EditionTab } from "./EditionTab";
import { NominationsTab } from "./NominationsTab";
import { VotingTab } from "./VotingTab";
import { WinnersTab } from "./WinnersTab";

const TABS = [
  { id: "edition", label: "Edition & dates" },
  { id: "categories", label: "Categories" },
  { id: "nominations", label: "Nominations" },
  { id: "voting", label: "Finalists & voting" },
  { id: "winners", label: "Winners" },
] as const;
type TabId = (typeof TABS)[number]["id"];

export function HonorsAdmin() {
  const [editionId, setEditionId] = useState<string | null>(null);
  const [data, setData] = useState<Overview | null>(null);
  const [tab, setTab] = useState<TabId>("edition");
  const [error, setError] = useState<string | null>(null);
  const [version, setVersion] = useState(0);

  useEffect(() => {
    let cancelled = false;
    api<Overview>(`/api/admin/honors${editionId ? `?editionId=${editionId}` : ""}`)
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
  }, [editionId, version]);

  const refresh = () => setVersion((v) => v + 1);

  async function createEdition() {
    const year = Number(window.prompt("Year for the new edition", String(new Date().getFullYear() + 1)));
    if (!year) return;
    try {
      const r = await api<{ id: string }>("/api/admin/honors", {
        method: "POST",
        json: { year, title: `NSI Honors ${year}`, copyCategoriesFrom: data?.edition?.id },
      });
      setEditionId(r.id);
    } catch (e) {
      setError((e as Error).message);
    }
  }

  if (error && !data) return <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800">{error}</p>;
  if (!data) return <p className="text-sm text-[color:var(--nsi-ink-soft)]">Loading…</p>;
  if (!data.edition) {
    return (
      <div className="admin-card">
        <p className="text-sm">No Honors edition exists yet. Run <code>npm run db:seed:honors</code> to create NSI Honors 2026 with its ten categories, or create one here.</p>
        <button type="button" className="admin-btn-primary mt-3" onClick={createEdition}>Create an edition</button>
      </div>
    );
  }

  const edition = data.edition;
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <label className="block">
          <span className="text-sm font-medium">Edition</span>
          <select className="admin-select mt-1 min-w-[16rem]" value={edition.id} onChange={(e) => setEditionId(e.target.value)}>
            {data.editions.map((e) => (
              <option key={e.id} value={e.id}>{e.title} · {EDITION_STATUS_LABELS[e.status]}</option>
            ))}
          </select>
        </label>
        <div className="flex gap-2">
          <a href="/honors" target="_blank" className="admin-btn-ghost">View public page</a>
          <button type="button" className="admin-btn-secondary" onClick={createEdition}>New edition</button>
        </div>
      </div>

      {error ? <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800">{error}</p> : null}

      <nav className="-mx-1 flex gap-1 overflow-x-auto px-1 pb-1" role="tablist" aria-label="Honors sections">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={tab === t.id}
            onClick={() => setTab(t.id)}
            className={`whitespace-nowrap rounded-lg px-4 py-2.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--nsi-gold)] focus-visible:ring-offset-1 ${
              tab === t.id ? "bg-[color:var(--nsi-green)] text-white shadow-sm" : "text-[color:var(--nsi-ink-soft)] hover:bg-black/5 hover:text-[color:var(--nsi-ink)]"
            }`}
          >
            {t.label}
          </button>
        ))}
      </nav>

      <div role="tabpanel">
        {tab === "edition" ? <EditionTab key={`${edition.id}-${version}`} edition={edition} mailConfigured={data.mailConfigured} onChanged={refresh} /> : null}
        {tab === "categories" ? <CategoriesTab edition={edition} onChanged={refresh} /> : null}
        {tab === "nominations" ? <NominationsTab edition={edition} onChanged={refresh} /> : null}
        {tab === "voting" ? <VotingTab key={edition.id} edition={edition} onChanged={refresh} /> : null}
        {tab === "winners" ? <WinnersTab key={`${edition.id}-${version}`} edition={edition} onChanged={refresh} /> : null}
      </div>
    </div>
  );
}
