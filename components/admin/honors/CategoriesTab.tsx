"use client";

import { useState } from "react";
import { NOMINEE_TYPE_SHORT, NOMINEE_TYPES, type NomineeType } from "@/lib/honors/constants";
import { api, type AdminCategory, type AdminEdition } from "./api";

type Draft = { name: string; shortDescription: string; criteria: string; allowedNomineeTypes: NomineeType[]; slug?: string };

function CategoryForm({ initial, withSlug, onSubmit, onCancel, busy }: { initial: Draft; withSlug?: boolean; onSubmit: (d: Draft) => void; onCancel: () => void; busy: boolean }) {
  const [d, setD] = useState<Draft>(initial);
  return (
    <div className="space-y-3">
      {withSlug ? (
        <label className="block">
          <span className="text-sm font-medium">Web address</span>
          <span className="block text-xs text-[color:var(--nsi-ink-soft)]">/honors/… lower-case words joined by hyphens</span>
          <input className="admin-input mt-1" value={d.slug ?? ""} onChange={(e) => setD({ ...d, slug: e.target.value })} />
        </label>
      ) : null}
      <label className="block">
        <span className="text-sm font-medium">Name</span>
        <input className="admin-input mt-1" value={d.name} onChange={(e) => setD({ ...d, name: e.target.value })} />
      </label>
      <label className="block">
        <span className="text-sm font-medium">One-line description</span>
        <input className="admin-input mt-1" value={d.shortDescription} onChange={(e) => setD({ ...d, shortDescription: e.target.value })} />
      </label>
      <label className="block">
        <span className="text-sm font-medium">What the award looks for</span>
        <textarea rows={3} className="admin-input mt-1" value={d.criteria} onChange={(e) => setD({ ...d, criteria: e.target.value })} />
      </label>
      <fieldset>
        <legend className="text-sm font-medium">Who can be nominated</legend>
        <div className="mt-1 flex flex-wrap gap-3">
          {NOMINEE_TYPES.map((t) => (
            <label key={t} className="flex items-center gap-1.5 text-sm">
              <input
                type="checkbox"
                checked={d.allowedNomineeTypes.includes(t)}
                onChange={(e) =>
                  setD({ ...d, allowedNomineeTypes: e.target.checked ? [...d.allowedNomineeTypes, t] : d.allowedNomineeTypes.filter((x) => x !== t) })
                }
              />
              {NOMINEE_TYPE_SHORT[t]}
            </label>
          ))}
        </div>
      </fieldset>
      <div className="flex gap-2">
        <button type="button" className="admin-btn-primary" disabled={busy} onClick={() => onSubmit(d)}>
          Save
        </button>
        <button type="button" className="admin-btn-ghost" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </div>
  );
}

export function CategoriesTab({ edition, onChanged }: { edition: AdminEdition; onChanged: () => void }) {
  const [editing, setEditing] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function run(fn: () => Promise<unknown>) {
    setBusy(true);
    setError(null);
    try {
      await fn();
      setEditing(null);
      setAdding(false);
      onChanged();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  const patch = (c: AdminCategory, json: Record<string, unknown>) => run(() => api(`/api/admin/honors/categories/${c.id}`, { method: "PATCH", json }));
  const sorted = [...edition.categories].sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <div className="space-y-4">
      {error ? <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800">{error}</p> : null}
      {sorted.map((c, i) => (
        <article key={c.id} className="admin-card">
          {editing === c.id ? (
            <CategoryForm
              busy={busy}
              initial={{ name: c.name, shortDescription: c.shortDescription, criteria: c.criteria ?? "", allowedNomineeTypes: c.allowedNomineeTypes }}
              onCancel={() => setEditing(null)}
              onSubmit={(d) => patch(c, { name: d.name, shortDescription: d.shortDescription, criteria: d.criteria || null, allowedNomineeTypes: d.allowedNomineeTypes })}
            />
          ) : (
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <h3 className="font-semibold">
                  {c.name} {!c.isActive ? <span className="ml-1 rounded bg-black/5 px-1.5 py-0.5 text-xs font-normal">Hidden</span> : null}
                </h3>
                <p className="text-sm text-[color:var(--nsi-ink-soft)]">/honors/{c.slug}</p>
                <p className="mt-1 text-sm">{c.shortDescription}</p>
                <p className="mt-1 text-xs text-[color:var(--nsi-ink-soft)]">
                  {c.allowedNomineeTypes.map((t) => NOMINEE_TYPE_SHORT[t]).join(", ")} · {c._count.nominations} nominations · {c._count.finalists} finalists · {c._count.votes} votes
                </p>
              </div>
              <div className="flex shrink-0 flex-wrap gap-2">
                <button type="button" className="admin-btn-secondary" onClick={() => setEditing(c.id)}>Edit</button>
                <button
                  type="button"
                  className="admin-btn-ghost"
                  disabled={busy || i === 0}
                  onClick={() => {
                    const prev = sorted[i - 1];
                    // Swap positions; fall back to distinct values if the two were equal.
                    const a = prev.sortOrder === c.sortOrder ? i - 1 : prev.sortOrder;
                    const b = prev.sortOrder === c.sortOrder ? i : c.sortOrder;
                    run(async () => {
                      await api(`/api/admin/honors/categories/${c.id}`, { method: "PATCH", json: { sortOrder: a } });
                      await api(`/api/admin/honors/categories/${prev.id}`, { method: "PATCH", json: { sortOrder: b } });
                    });
                  }}
                >
                  Move up
                </button>
                <button type="button" className="admin-btn-ghost" disabled={busy} onClick={() => patch(c, { isActive: !c.isActive })}>
                  {c.isActive ? "Hide" : "Show"}
                </button>
              </div>
            </div>
          )}
        </article>
      ))}

      {adding ? (
        <div className="admin-card">
          <CategoryForm
            withSlug
            busy={busy}
            initial={{ slug: "", name: "", shortDescription: "", criteria: "", allowedNomineeTypes: [...NOMINEE_TYPES] }}
            onCancel={() => setAdding(false)}
            onSubmit={(d) =>
              run(() =>
                api("/api/admin/honors/categories", {
                  method: "POST",
                  json: { editionId: edition.id, slug: d.slug, name: d.name, shortDescription: d.shortDescription, criteria: d.criteria || null, allowedNomineeTypes: d.allowedNomineeTypes },
                }),
              )
            }
          />
        </div>
      ) : (
        <button type="button" className="admin-btn-secondary" onClick={() => setAdding(true)}>
          Add a category
        </button>
      )}
    </div>
  );
}
