"use client";

import { useState } from "react";
import { SubmissionsTable } from "@/components/admin/SubmissionsTable";
import { SubmissionsAnalytics } from "@/components/admin/SubmissionsAnalytics";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { CycleFilter } from "@/components/admin/CycleFilter";

type TabId = "submissions" | "analytics";

const tabs: { id: TabId; label: string }[] = [
  { id: "submissions", label: "Submissions Ledger" },
  { id: "analytics", label: "Statistical Breakdown" },
];

export default function AdminSubmissionsPage() {
  const [cycleId, setCycleId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabId>("submissions");

  return (
    <>
      <AdminPageHeader
        title="Field Submissions Ledger"
        description="Audit citizen check-ins, flag anomalous entries, and export clean CSV data (flagged entries excluded)."
        breadcrumb={[
          { label: "Dashboard", href: "/admin" },
          { label: "Submissions" },
        ]}
      />

      <div className="space-y-6">
        <div className="flex flex-wrap items-end gap-4">
          <CycleFilter
            value={cycleId}
            onChange={setCycleId}
            showAllOption={false}
            id="submissions-cycle-filter"
          />
        </div>

        <nav
          role="tablist"
          aria-label="Submissions view"
          className="flex gap-1 overflow-x-auto rounded-[3px] border border-[color:var(--nsi-rule-strong)] bg-white p-1"
          onKeyDown={(e) => {
            const idx = tabs.findIndex((t) => t.id === activeTab);
            if (e.key === "ArrowRight" && idx < tabs.length - 1) {
              setActiveTab(tabs[idx + 1].id);
            } else if (e.key === "ArrowLeft" && idx > 0) {
              setActiveTab(tabs[idx - 1].id);
            }
          }}
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={activeTab === tab.id}
              aria-controls={`panel-${tab.id}`}
              tabIndex={activeTab === tab.id ? 0 : -1}
              onClick={() => setActiveTab(tab.id)}
              className={`whitespace-nowrap rounded-[2px] px-4 py-2 font-mono text-xs font-bold uppercase tracking-[0.14em] transition-all ${
                activeTab === tab.id
                  ? "bg-[color:var(--nsi-green)] text-white"
                  : "text-[color:var(--nsi-ink-soft)] hover:bg-[color:var(--nsi-paper)] hover:text-[color:var(--nsi-ink)]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        <div
          role="tabpanel"
          id="panel-submissions"
          aria-labelledby="submissions"
          className={activeTab !== "submissions" ? "sr-only" : undefined}
        >
          <SubmissionsTable cycleId={cycleId} />
        </div>
        <div
          role="tabpanel"
          id="panel-analytics"
          aria-labelledby="analytics"
          className={activeTab !== "analytics" ? "sr-only" : undefined}
        >
          <SubmissionsAnalytics cycleId={cycleId} />
        </div>
      </div>
    </>
  );
}
