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
    setCopyMsg("Referral URL copied to clipboard.");
    setTimeout(() => setCopyMsg(null), 2500);
  }

  const pdfHref = cycleId
    ? `/api/admin/agents/report?cycleId=${encodeURIComponent(cycleId)}`
    : "/api/admin/agents/report";

  const tabs: { id: TabId; label: string }[] = [
    { id: "roster", label: "Enumerator Roster" },
    { id: "byCycle", label: "Attribution by Cycle" },
    { id: "crossCycle", label: "Cross-Cycle Matrix" },
  ];

  return (
    <>
      <AdminPageHeader
        title="Field Agents & Enumerators"
        description="Manage accredited field agents, referral codes, and survey attribution across monthly cycles."
        breadcrumb={[
          { label: "Dashboard", href: "/admin" },
          { label: "Field Agents" },
        ]}
        actions={
          <a href={pdfHref} className="admin-btn-secondary" download>
            Export PDF Ledger
          </a>
        }
      />

      {copyMsg && (
        <p className="mb-4 rounded-[2px] border border-emerald-300 bg-emerald-50 px-4 py-2 text-xs font-semibold text-emerald-900" role="status">
          {copyMsg}
        </p>
      )}

      {error && (
        <div className="mb-6 rounded-[3px] border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-900" role="alert">
          {error}
        </div>
      )}

      <nav
        className="mb-8 flex gap-1 overflow-x-auto rounded-[3px] border border-[color:var(--nsi-rule-strong)] bg-white p-1"
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
            className={`whitespace-nowrap rounded-[2px] px-4 py-2 font-mono text-xs font-bold uppercase tracking-[0.14em] transition-colors ${
              tab === t.id
                ? "bg-[color:var(--nsi-green)] text-white"
                : "text-[color:var(--nsi-ink-soft)] hover:bg-[color:var(--nsi-paper)] hover:text-[color:var(--nsi-ink)]"
            }`}
          >
            {t.label}
          </button>
        ))}
      </nav>

      {tab === "roster" && (
        <div className="space-y-8">
          <section className="admin-card md:p-8">
            <h2 className="font-mono text-xs font-bold uppercase tracking-[0.16em] text-[color:var(--nsi-ink)]">
              Register New Field Agent
            </h2>
            <p className="mt-1.5 max-w-xl text-sm text-[color:var(--nsi-ink-soft)]">
              A unique 6-digit referral code is generated automatically. Share the survey URL with{" "}
              <code className="rounded-[2px] bg-[color:var(--nsi-paper-2)] px-1.5 py-0.5 font-mono text-xs">?ref=</code> and the assigned code.
            </p>
            <form className="mt-6 grid gap-4 sm:grid-cols-2" onSubmit={createAgent}>
              <div className="sm:col-span-2">
                <label htmlFor="agent-name" className="block font-mono text-xs font-bold uppercase tracking-[0.14em] text-[color:var(--nsi-ink)]">
                  Full Name
                </label>
                <input
                  id="agent-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="admin-input mt-1.5 w-full max-w-md"
                  autoComplete="name"
                />
              </div>
              <div>
                <label htmlFor="agent-email" className="block font-mono text-xs font-bold uppercase tracking-[0.14em] text-[color:var(--nsi-ink)]">
                  Email Address
                </label>
                <input
                  id="agent-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="admin-input mt-1.5 w-full"
                  autoComplete="email"
                />
              </div>
              <div>
                <label htmlFor="agent-phone" className="block font-mono text-xs font-bold uppercase tracking-[0.14em] text-[color:var(--nsi-ink)]">
                  Phone Number
                </label>
                <input
                  id="agent-phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  className="admin-input mt-1.5 w-full"
                  autoComplete="tel"
                />
              </div>
              <div className="sm:col-span-2 pt-2">
                <button type="submit" disabled={creating} className="admin-btn-primary">
                  {creating ? "Creating…" : "Register Field Agent"}
                </button>
              </div>
            </form>
          </section>

          {editing && (
            <section className="admin-card bg-[color:var(--nsi-paper-2)] md:p-8">
              <h2 className="font-mono text-xs font-bold uppercase tracking-[0.16em] text-[color:var(--nsi-ink)]">
                Edit Agent Record
              </h2>
              <p className="mt-1 font-mono text-xs text-[color:var(--nsi-ink-soft)]">
                Referral code: <span className="font-bold text-[color:var(--nsi-green)]">{editing.referrerCode}</span> (fixed)
              </p>
              <form className="mt-4 grid gap-4 sm:grid-cols-2" onSubmit={saveEdit}>
                <div className="sm:col-span-2">
                  <label className="block font-mono text-xs font-bold uppercase tracking-[0.14em]">Name</label>
                  <input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    required
                    className="admin-input mt-1.5 w-full max-w-md"
                  />
                </div>
                <div>
                  <label className="block font-mono text-xs font-bold uppercase tracking-[0.14em]">Email</label>
                  <input
                    type="email"
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    required
                    className="admin-input mt-1.5 w-full"
                  />
                </div>
                <div>
                  <label className="block font-mono text-xs font-bold uppercase tracking-[0.14em]">Phone</label>
                  <input
                    type="tel"
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    required
                    className="admin-input mt-1.5 w-full"
                  />
                </div>
                <div className="flex flex-wrap gap-2 sm:col-span-2">
                  <button type="submit" className="admin-btn-primary">
                    Save Changes
                  </button>
                  <button type="button" className="admin-btn-secondary" onClick={() => setEditing(null)}>
                    Cancel
                  </button>
                </div>
              </form>
            </section>
          )}

          <section className="admin-card md:p-8">
            <h2 className="font-mono text-xs font-bold uppercase tracking-[0.16em] text-[color:var(--nsi-ink)]">
              Registered Field Roster
            </h2>
            {loading ? (
              <p className="mt-6 text-sm text-[color:var(--nsi-ink-soft)]">Loading roster…</p>
            ) : agents.length === 0 ? (
              <p className="mt-6 text-sm text-[color:var(--nsi-ink-soft)]">No field agents registered yet.</p>
            ) : (
              <div className="mt-6 overflow-x-auto">
                <table className="w-full min-w-[640px] border-collapse text-left text-sm">
                  <thead>
                    <tr className="border-b-2 border-[color:var(--nsi-rule-strong)] font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-[color:var(--nsi-ink-muted)]">
                      <th className="px-3 py-2.5">Name</th>
                      <th className="px-3 py-2.5">Email</th>
                      <th className="px-3 py-2.5">Phone</th>
                      <th className="px-3 py-2.5">Ref Code</th>
                      <th className="px-3 py-2.5">Submissions</th>
                      <th className="px-3 py-2.5">Status</th>
                      <th className="px-3 py-2.5">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[color:var(--nsi-rule)]">
                    {agents.map((a) => (
                      <tr key={a.id} className="hover:bg-[color:var(--nsi-paper)] text-[color:var(--nsi-ink)]">
                        <td className="px-3 py-3 font-semibold">{a.name}</td>
                        <td className="px-3 py-3 text-[color:var(--nsi-ink-soft)]">{a.email}</td>
                        <td className="px-3 py-3 font-mono text-xs">{a.phone}</td>
                        <td className="px-3 py-3 font-mono font-bold tabular-nums text-[color:var(--nsi-green)]">{a.referrerCode}</td>
                        <td className="px-3 py-3 font-mono font-semibold tabular-nums">{a.submissionCount}</td>
                        <td className="px-3 py-3">
                          <span
                            className={`inline-block rounded-[2px] border px-2 py-0.5 font-mono text-[10px] font-bold uppercase ${
                              a.isActive
                                ? "border-emerald-300 bg-emerald-50 text-emerald-900"
                                : "border-gray-300 bg-gray-100 text-gray-600"
                            }`}
                          >
                            {a.isActive ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td className="px-3 py-3">
                          <div className="flex flex-wrap gap-1.5">
                            <button type="button" className="admin-btn-secondary px-2.5 py-1 text-xs" onClick={() => copyReferral(a.referralPath)}>
                              Copy Link
                            </button>
                            <button type="button" className="admin-btn-ghost px-2.5 py-1 text-xs" onClick={() => startEdit(a)}>
                              Edit
                            </button>
                            <button type="button" className="admin-btn-ghost px-2.5 py-1 text-xs" onClick={() => void toggleActive(a)}>
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
        <div className="admin-card space-y-6 md:p-8">
          <div className="flex flex-wrap items-end gap-4">
            <CycleFilter value={cycleId} onChange={setCycleId} id="agents-cycle-filter" />
            <button type="button" className="admin-btn-secondary" onClick={() => void loadPerCycle()} disabled={!cycleId || perCycleLoading}>
              Refresh
            </button>
          </div>
          {perCycleLoading ? (
            <p className="text-sm text-[color:var(--nsi-ink-soft)]">Loading cycle attribution…</p>
          ) : perCycleData ? (
            <>
              <p className="text-sm text-[color:var(--nsi-ink-soft)]">
                <span className="font-bold text-[color:var(--nsi-ink)]">{perCycleData.cycle.monthYear}</span> ({perCycleData.cycle.status}) —{" "}
                <span className="font-mono font-bold tabular-nums">{perCycleData.totalCount}</span> submissions total;{" "}
                <span className="font-mono font-bold tabular-nums">{perCycleData.unattributedCount}</span> direct / unattributed.
              </p>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[400px] border-collapse text-left text-sm">
                  <thead>
                    <tr className="border-b-2 border-[color:var(--nsi-rule-strong)] font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-[color:var(--nsi-ink-muted)]">
                      <th className="py-2.5 pr-4">Agent</th>
                      <th className="py-2.5 pr-4">Code</th>
                      <th className="py-2.5">Attributed Count</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[color:var(--nsi-rule)]">
                    {perCycleData.rows.map((r) => (
                      <tr key={r.agentId ?? "x"}>
                        <td className="py-3 pr-4 font-semibold">{r.name}</td>
                        <td className="py-3 pr-4 font-mono tabular-nums text-[color:var(--nsi-green)]">{r.referrerCode ?? "—"}</td>
                        <td className="py-3 font-mono font-bold tabular-nums">{r.count}</td>
                      </tr>
                    ))}
                    <tr className="bg-[color:var(--nsi-paper)] font-semibold">
                      <td className="py-3 pr-4">Direct / Unattributed</td>
                      <td className="py-3 pr-4">—</td>
                      <td className="py-3 font-mono tabular-nums">{perCycleData.unattributedCount}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </>
          ) : null}
        </div>
      )}

      {tab === "crossCycle" && (
        <div className="admin-card space-y-6 md:p-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <p className="max-w-xl text-sm text-[color:var(--nsi-ink-soft)]">
              Referral-attributed submission counts per field agent across the last 12 cycles.
            </p>
            <button type="button" className="admin-btn-secondary" onClick={() => void loadCross()} disabled={crossLoading}>
              Refresh
            </button>
          </div>
          {crossLoading ? (
            <p className="text-sm text-[color:var(--nsi-ink-soft)]">Loading matrix…</p>
          ) : crossData && crossData.cycles.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full min-w-max border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b-2 border-[color:var(--nsi-rule-strong)] font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-[color:var(--nsi-ink-muted)]">
                    <th className="sticky left-0 z-10 bg-white py-2.5 pr-4">Agent</th>
                    <th className="py-2.5 pr-3">Code</th>
                    {crossData.cycles.map((c) => (
                      <th key={c.id} className="whitespace-nowrap px-2 py-2.5 text-center font-normal">
                        <div className="max-w-[7rem] truncate" title={`${c.monthYear} (${c.status})`}>
                          {c.monthYear}
                        </div>
                      </th>
                    ))}
                    <th className="py-2.5 pl-2 text-center font-bold">Σ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[color:var(--nsi-rule)]">
                  {crossData.matrix.map((row) => (
                    <tr key={row.agentId ?? "unatt"}>
                      <td className="sticky left-0 z-10 bg-white py-2.5 pr-4 font-semibold">{row.name}</td>
                      <td className="py-2.5 pr-3 font-mono tabular-nums text-[color:var(--nsi-green)]">{row.referrerCode ?? "—"}</td>
                      {crossData.cycles.map((c) => (
                        <td key={c.id} className="px-2 py-2.5 text-center font-mono tabular-nums">
                          {row.countsByCycleId[c.id] ?? 0}
                        </td>
                      ))}
                      <td className="py-2.5 pl-2 text-center font-mono font-bold tabular-nums">{row.totalInWindow}</td>
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
