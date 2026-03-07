"use client";

import { useState } from "react";
import { SubmissionsTable } from "@/components/admin/SubmissionsTable";
import { SubmissionsAnalytics } from "@/components/admin/SubmissionsAnalytics";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { CycleFilter } from "@/components/admin/CycleFilter";

type TabId = "submissions" | "analytics";

const tabs: { id: TabId; label: string }[] = [
  { id: "submissions", label: "Submissions" },
  { id: "analytics", label: "Analytics" },
];

export default function AdminSubmissionsPage() {
  const [cycleId, setCycleId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabId>("submissions");

  return (
    <>
      <AdminPageHeader
        title="Submissions"
        description="Review check-ins, flag entries, and export CSV (flagged entries excluded)."
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
          className="flex gap-1 overflow-x-auto rounded-xl border border-black/10 bg-white p-1.5 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-black/10"
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
              className={`whitespace-nowrap rounded-lg px-4 py-2.5 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--nsi-gold)] focus-visible:ring-offset-1 ${
                activeTab === tab.id
                  ? "bg-[color:var(--nsi-green)] text-white shadow-sm"
                  : "text-[color:var(--nsi-ink-soft)] hover:bg-black/5 hover:text-[color:var(--nsi-ink)]"
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
