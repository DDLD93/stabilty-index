"use client";

import { useCallback, useEffect, useState } from "react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { CycleFilter } from "@/components/admin/CycleFilter";

type AgentRow = {
  id: string;
  name: string;
  email: string;
  phone: string;
  referrerCode: string;
  isActive: boolean;
  createdAt: string;
  submissionCount: number;
  referralPath: string;
};

type TabId = "roster" | "byCycle" | "crossCycle";

export default function AdminAgentsPage() {
  const [tab, setTab] = useState<TabId>("roster");
  const [agents, setAgents] = useState<AgentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copyMsg, setCopyMsg] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [creating, setCreating] = useState(false);

  const [editing, setEditing] = useState<AgentRow | null>(null);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editPhone, setEditPhone] = useState("");

  const [cycleId, setCycleId] = useState<string | null>(null);
  const [perCycleData, setPerCycleData] = useState<{
    cycle: { id: string; monthYear: string; status: string };
    rows: { agentId: string | null; name: string; referrerCode: string | null; count: number }[];
    unattributedCount: number;
    totalCount: number;
  } | null>(null);
  const [perCycleLoading, setPerCycleLoading] = useState(false);

  const [crossData, setCrossData] = useState<{
    cycles: { id: string; monthYear: string; status: string }[];
    matrix: {
      agentId: string | null;
      name: string;
      referrerCode: string | null;
      countsByCycleId: Record<string, number>;
      totalInWindow: number;
    }[];
  } | null>(null);
  const [crossLoading, setCrossLoading] = useState(false);

  const loadAgents = useCallback(async () => {
    setError(null);
    const res = await fetch("/api/admin/agents");
    if (!res.ok) {
      const d = (await res.json().catch(() => null)) as { error?: string } | null;
      setError(d?.error ?? "Failed to load agents.");
      return;
    }
    const data = (await res.json()) as { agents: AgentRow[] };
    setAgents(data.agents);
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      await loadAgents();
      if (!cancelled) setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [loadAgents]);

  const loadPerCycle = useCallback(async () => {
    setPerCycleLoading(true);
    setError(null);
    const url = new URL("/api/admin/agents/analytics", window.location.origin);
    if (cycleId) url.searchParams.set("cycleId", cycleId);
    const res = await fetch(url.toString());
    setPerCycleLoading(false);
    if (!res.ok) {
      const d = (await res.json().catch(() => null)) as { error?: string } | null;
      setError(d?.error ?? "Failed to load cycle analytics.");
      setPerCycleData(null);
      return;
    }
    setPerCycleData(await res.json());
  }, [cycleId]);

  useEffect(() => {
    if (tab !== "byCycle") return;
    void loadPerCycle();
  }, [tab, loadPerCycle]);

  const loadCross = useCallback(async () => {
    setCrossLoading(true);
    setError(null);
    const res = await fetch("/api/admin/agents/analytics/cross-cycle?limit=12");
    setCrossLoading(false);
    if (!res.ok) {
      const d = (await res.json().catch(() => null)) as { error?: string } | null;
      setError(d?.error ?? "Failed to load cross-cycle data.");
      setCrossData(null);
      return;
    }
    setCrossData(await res.json());
  }, []);

  useEffect(() => {
    if (tab !== "crossCycle") return;
    void loadCross();
  }, [tab, loadCross]);

  async function createAgent(e: React.FormEvent) {
    e.preventDefault();
    setCreating(true);
    setError(null);
    const res = await fetch("/api/admin/agents", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ name: name.trim(), email: email.trim(), phone: phone.trim() }),
    });
    setCreating(false);
    const data = (await res.json().catch(() => null)) as { error?: string; agent?: AgentRow & { referralPath: string } } | null;
    if (!res.ok) {
      setError(data?.error ?? "Create failed.");
      return;
    }
    setName("");
    setEmail("");
    setPhone("");
    await loadAgents();
  }

  async function saveEdit(e: React.FormEvent) {
    e.preventDefault();
    if (!editing) return;
    const res = await fetch(`/api/admin/agents/${editing.id}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        name: editName.trim(),
        email: editEmail.trim(),
        phone: editPhone.trim(),
      }),
    });
    const data = (await res.json().catch(() => null)) as { error?: string } | null;
    if (!res.ok) {
      setError(data?.error ?? "Update failed.");
      return;
    }
    setEditing(null);
    await loadAgents();
  }

  async function toggleActive(a: AgentRow) {
    setError(null);
    const res = await fetch(`/api/admin/agents/${a.id}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ isActive: !a.isActive }),
    });
    if (!res.ok) {
      const d = (await res.json().catch(() => null)) as { error?: string } | null;
      setError(d?.error ?? "Update failed.");
      return;
    }
    await loadAgents();
  }

  function startEdit(a: AgentRow) {
    setEditing(a);
    setEditName(a.name);
    setEditEmail(a.email);
    setEditPhone(a.phone);
  }

  function copyReferral(path: string) {
    const full = `${typeof window !== "undefined" ? window.location.origin : ""}${path}`;
    void navigator.clipboard.writeText(full);
    setCopyMsg("Link copied to clipboard.");
    setTimeout(() => setCopyMsg(null), 2500);
  }

  const pdfHref = cycleId
    ? `/api/admin/agents/report?cycleId=${encodeURIComponent(cycleId)}`
    : "/api/admin/agents/report";

  const tabs: { id: TabId; label: string }[] = [
    { id: "roster", label: "Roster" },
    { id: "byCycle", label: "By cycle" },
    { id: "crossCycle", label: "Cross-cycle" },
  ];

  return (
    <>
      <AdminPageHeader
        title="Agents"
        description="Manage field agents, referral links, and survey attribution by cycle."
        breadcrumb={[
          { label: "Dashboard", href: "/admin" },
          { label: "Agents" },
        ]}
        actions={
          <a href={pdfHref} className="admin-btn-secondary" download>
            Export PDF
          </a>
        }
      />

      {copyMsg && (
        <p className="mb-4 text-sm font-medium text-[color:var(--nsi-green)]" role="status">
          {copyMsg}
        </p>
      )}

      {error && (
        <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800" role="alert">
          {error}
        </div>
      )}

      <nav
        className="mb-8 flex gap-1 overflow-x-auto rounded-xl border border-black/10 bg-white p-1.5"
        role="tablist"
        aria-label="Agents sections"
      >
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={tab === t.id}
            onClick={() => setTab(t.id)}
            className={`whitespace-nowrap rounded-lg px-4 py-2.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--nsi-gold)] focus-visible:ring-offset-1 ${
              tab === t.id
                ? "bg-[color:var(--nsi-green)] text-white shadow-sm"
                : "text-[color:var(--nsi-ink-soft)] hover:bg-black/5 hover:text-[color:var(--nsi-ink)]"
            }`}
          >
            {t.label}
          </button>
        ))}
      </nav>

      {tab === "roster" && (
        <div className="space-y-8">
          <section className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm md:p-8">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-[color:var(--nsi-ink-soft)]">
              New agent
            </h2>
            <p className="mt-2 max-w-xl text-sm text-[color:var(--nsi-ink-soft)]">
              A unique 6-digit referral code is assigned automatically. Share the survey link with{" "}
              <code className="rounded bg-black/5 px-1">?ref=</code> and the code.
            </p>
            <form className="mt-6 grid gap-4 sm:grid-cols-2" onSubmit={createAgent}>
              <div className="sm:col-span-2">
                <label htmlFor="agent-name" className="block text-sm font-medium text-[color:var(--nsi-ink)]">
                  Name
                </label>
                <input
                  id="agent-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="admin-select mt-1.5 w-full max-w-md"
                  autoComplete="name"
                />
              </div>
              <div>
                <label htmlFor="agent-email" className="block text-sm font-medium text-[color:var(--nsi-ink)]">
                  Email
                </label>
                <input
                  id="agent-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="admin-select mt-1.5 w-full"
                  autoComplete="email"
                />
              </div>
              <div>
                <label htmlFor="agent-phone" className="block text-sm font-medium text-[color:var(--nsi-ink)]">
                  Phone
                </label>
                <input
                  id="agent-phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  className="admin-select mt-1.5 w-full"
                  autoComplete="tel"
                />
              </div>
              <div className="sm:col-span-2">
                <button type="submit" disabled={creating} className="admin-btn-primary">
                  {creating ? "Creating…" : "Create agent"}
                </button>
              </div>
            </form>
          </section>

          {editing && (
            <section className="rounded-3xl border border-black/10 bg-[color:var(--nsi-paper-2)] p-6 shadow-sm md:p-8">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-[color:var(--nsi-ink-soft)]">
                Edit agent
              </h2>
              <p className="mt-1 text-xs text-[color:var(--nsi-ink-soft)]">
                Referral code: <span className="font-mono font-semibold">{editing.referrerCode}</span> (fixed)
              </p>
              <form className="mt-4 grid gap-4 sm:grid-cols-2" onSubmit={saveEdit}>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium">Name</label>
                  <input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    required
                    className="admin-select mt-1.5 w-full max-w-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Email</label>
                  <input
                    type="email"
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    required
                    className="admin-select mt-1.5 w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Phone</label>
                  <input
                    type="tel"
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    required
                    className="admin-select mt-1.5 w-full"
                  />
                </div>
                <div className="flex flex-wrap gap-2 sm:col-span-2">
                  <button type="submit" className="admin-btn-primary">
                    Save
                  </button>
                  <button type="button" className="admin-btn-ghost" onClick={() => setEditing(null)}>
                    Cancel
                  </button>
                </div>
              </form>
            </section>
          )}

          <section className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm md:p-8">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-[color:var(--nsi-ink-soft)]">
              All agents
            </h2>
            {loading ? (
              <p className="mt-6 text-sm text-[color:var(--nsi-ink-soft)]">Loading…</p>
            ) : agents.length === 0 ? (
              <p className="mt-6 text-sm text-[color:var(--nsi-ink-soft)]">No agents yet.</p>
            ) : (
              <div className="mt-6 overflow-x-auto">
                <table className="w-full min-w-[640px] border-separate border-spacing-y-2 text-left text-sm">
                  <thead>
                    <tr className="text-xs font-semibold uppercase tracking-wide text-black/60">
                      <th className="px-3 py-2">Name</th>
                      <th className="px-3 py-2">Email</th>
                      <th className="px-3 py-2">Phone</th>
                      <th className="px-3 py-2">Code</th>
                      <th className="px-3 py-2">Subs</th>
                      <th className="px-3 py-2">Active</th>
                      <th className="px-3 py-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {agents.map((a) => (
                      <tr key={a.id} className="bg-[color:var(--nsi-paper)] text-[color:var(--nsi-ink)]">
                        <td className="rounded-l-xl px-3 py-3 font-medium">{a.name}</td>
                        <td className="px-3 py-3">{a.email}</td>
                        <td className="px-3 py-3">{a.phone}</td>
                        <td className="px-3 py-3 font-mono tabular-nums">{a.referrerCode}</td>
                        <td className="px-3 py-3 tabular-nums">{a.submissionCount}</td>
                        <td className="px-3 py-3">{a.isActive ? "Yes" : "No"}</td>
                        <td className="rounded-r-xl px-3 py-3">
                          <div className="flex flex-wrap gap-2">
                            <button type="button" className="admin-btn-secondary text-xs" onClick={() => copyReferral(a.referralPath)}>
                              Copy link
                            </button>
                            <button type="button" className="admin-btn-ghost text-xs" onClick={() => startEdit(a)}>
                              Edit
                            </button>
                            <button type="button" className="admin-btn-ghost text-xs" onClick={() => void toggleActive(a)}>
                              {a.isActive ? "Deactivate" : "Activate"}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>
      )}

      {tab === "byCycle" && (
        <div className="space-y-6 rounded-3xl border border-black/10 bg-white p-6 shadow-sm md:p-8">
          <div className="flex flex-wrap items-end gap-4">
            <CycleFilter value={cycleId} onChange={setCycleId} id="agents-cycle-filter" />
            <button type="button" className="admin-btn-secondary" onClick={() => void loadPerCycle()} disabled={!cycleId || perCycleLoading}>
              Refresh
            </button>
          </div>
          {perCycleLoading ? (
            <p className="text-sm text-[color:var(--nsi-ink-soft)]">Loading…</p>
          ) : perCycleData ? (
            <>
              <p className="text-sm text-black/70">
                <span className="font-semibold">{perCycleData.cycle.monthYear}</span> ({perCycleData.cycle.status}) —{" "}
                <span className="tabular-nums">{perCycleData.totalCount}</span> submissions total;{" "}
                <span className="tabular-nums">{perCycleData.unattributedCount}</span> without agent referral.
              </p>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[400px] text-left text-sm">
                  <thead>
                    <tr className="border-b border-black/10 text-xs font-semibold uppercase text-black/60">
                      <th className="py-2 pr-4">Agent</th>
                      <th className="py-2 pr-4">Code</th>
                      <th className="py-2">Count</th>
                    </tr>
                  </thead>
                  <tbody>
                    {perCycleData.rows.map((r) => (
                      <tr key={r.agentId ?? "x"} className="border-b border-black/5">
                        <td className="py-3 pr-4 font-medium">{r.name}</td>
                        <td className="py-3 pr-4 font-mono tabular-nums">{r.referrerCode ?? "—"}</td>
                        <td className="py-3 tabular-nums">{r.count}</td>
                      </tr>
                    ))}
                    <tr className="bg-black/[0.03] font-medium">
                      <td className="py-3 pr-4">Direct / unattributed</td>
                      <td className="py-3 pr-4">—</td>
                      <td className="py-3 tabular-nums">{perCycleData.unattributedCount}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </>
          ) : null}
        </div>
      )}

      {tab === "crossCycle" && (
        <div className="space-y-6 rounded-3xl border border-black/10 bg-white p-6 shadow-sm md:p-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <p className="max-w-xl text-sm text-[color:var(--nsi-ink-soft)]">
              Referral-attributed submission counts per agent across the last 12 cycles (newest first in columns).
            </p>
            <button type="button" className="admin-btn-secondary" onClick={() => void loadCross()} disabled={crossLoading}>
              Refresh
            </button>
          </div>
          {crossLoading ? (
            <p className="text-sm text-[color:var(--nsi-ink-soft)]">Loading…</p>
          ) : crossData && crossData.cycles.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full min-w-max border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-black/15 text-xs font-semibold uppercase text-black/60">
                    <th className="sticky left-0 z-10 bg-white py-2 pr-4">Agent</th>
                    <th className="py-2 pr-3 font-mono">Code</th>
                    {crossData.cycles.map((c) => (
                      <th key={c.id} className="whitespace-nowrap px-2 py-2 text-center font-normal">
                        <div className="max-w-[7rem] truncate" title={`${c.monthYear} (${c.status})`}>
                          {c.monthYear}
                        </div>
                      </th>
                    ))}
                    <th className="py-2 pl-2 text-center">Σ</th>
                  </tr>
                </thead>
                <tbody>
                  {crossData.matrix.map((row) => (
                    <tr key={row.agentId ?? "unatt"} className="border-b border-black/5">
                      <td className="sticky left-0 z-10 bg-white py-2 pr-4 font-medium">{row.name}</td>
                      <td className="py-2 pr-3 font-mono tabular-nums text-black/70">{row.referrerCode ?? "—"}</td>
                      {crossData.cycles.map((c) => (
                        <td key={c.id} className="px-2 py-2 text-center tabular-nums">
                          {row.countsByCycleId[c.id] ?? 0}
                        </td>
                      ))}
                      <td className="py-2 pl-2 text-center font-semibold tabular-nums">{row.totalInWindow}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-sm text-[color:var(--nsi-ink-soft)]">No cycle data yet.</p>
          )}
        </div>
      )}
    </>
  );
}
