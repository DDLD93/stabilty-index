import Link from "next/link";
import { Suspense } from "react";
import { db } from "@/lib/db";
import { CycleControls } from "@/components/admin/CycleControls";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { DashboardCycleFilter } from "@/components/admin/DashboardCycleFilter";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Promise<{ cycleId?: string | string[] }> | { cycleId?: string | string[] };
};

export default async function AdminPage(props: PageProps) {
  const searchParams = await Promise.resolve(props.searchParams);
  const cycleIdParam = searchParams.cycleId;
  const cycleId = typeof cycleIdParam === "string" ? cycleIdParam : Array.isArray(cycleIdParam) ? cycleIdParam[0] : undefined;

  const displayCycle = cycleId
    ? await db.cycle.findUnique({
        where: { id: cycleId },
        select: { id: true, status: true, monthYear: true, createdAt: true },
      })
    : await db.cycle.findFirst({
        orderBy: { createdAt: "desc" },
        select: { id: true, status: true, monthYear: true, createdAt: true },
      });

  const counts = displayCycle
    ? await db.submission.groupBy({
        by: ["isFlagged"],
        where: { cycleId: displayCycle.id },
        _count: { _all: true },
      })
    : [];

  const total = counts.reduce((acc, c) => acc + c._count._all, 0);
  const flagged = counts.find((c) => c.isFlagged)?._count._all ?? 0;

  return (
    <>
      <AdminPageHeader
        title="Editorial Command Dashboard"
        description="Manage the active monthly survey cycle, field submissions ledger, and publication snapshots."
      />

      <Suspense fallback={<div className="mb-4 h-10 animate-pulse rounded-[2px] bg-black/5" />}>
        <DashboardCycleFilter selectedCycleId={displayCycle?.id ?? null} />
      </Suspense>

      <div className="grid w-full gap-6 lg:grid-cols-3">
        {/* Current Cycle Card */}
        <section
          aria-labelledby="cycle-heading"
          className="admin-card lg:col-span-2 lg:p-8"
        >
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[color:var(--nsi-rule)] pb-4">
            <h2
              id="cycle-heading"
              className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-[color:var(--nsi-ink-muted)]"
            >
              Active Survey Cycle
            </h2>
            <span
              className={`inline-flex items-center rounded-[2px] border px-2.5 py-0.5 font-mono text-[11px] font-bold uppercase tracking-wider ${
                displayCycle?.status === "OPEN"
                  ? "border-emerald-300 bg-emerald-50 text-emerald-900"
                  : displayCycle?.status === "CLOSED"
                    ? "border-amber-300 bg-amber-50 text-amber-900"
                    : "border-gray-300 bg-gray-100 text-gray-700"
              }`}
            >
              Status: {displayCycle?.status ?? "NONE"}
            </span>
          </div>

          <div className="mt-5 font-serif text-3xl font-bold tracking-tight text-[color:var(--nsi-ink)] sm:text-4xl">
            {displayCycle ? displayCycle.monthYear : "No Cycle Selected"}
          </div>
          <p className="mt-2 text-sm text-[color:var(--nsi-ink-soft)]">
            Control public data collection status or define the 5 pillar survey questions for this reporting period.
          </p>

          <div className="mt-8 flex flex-wrap gap-3 border-t border-[color:var(--nsi-rule)] pt-6">
            <CycleControls cycleStatus={displayCycle?.status ?? null} />
            <Link
              className="admin-btn-secondary"
              href="/admin/cycle"
            >
              Configure Pillar Questions →
            </Link>
          </div>
        </section>

        {/* Quick Stats Card */}
        <section
          aria-labelledby="stats-heading"
          className="admin-card lg:p-8"
        >
          <h2
            id="stats-heading"
            className="border-b border-[color:var(--nsi-rule)] pb-4 font-mono text-xs font-bold uppercase tracking-[0.18em] text-[color:var(--nsi-ink-muted)]"
          >
            Field Ledger Volume
          </h2>
          <div className="mt-5 flex items-baseline gap-2.5">
            <span className="font-serif text-5xl font-bold tabular-nums text-[color:var(--nsi-green)]">
              {total}
            </span>
            <span className="font-mono text-xs uppercase tracking-wider text-[color:var(--nsi-ink-muted)]">
              recorded entries
            </span>
          </div>
          <div className="mt-2 font-mono text-xs text-[color:var(--nsi-ink-soft)]">
            <span className="font-bold tabular-nums text-[color:var(--nsi-terracotta)]">{flagged}</span> flagged for editorial review
          </div>

          <nav aria-label="Quick actions" className="mt-8 flex flex-col gap-2.5 border-t border-[color:var(--nsi-rule)] pt-6">
            <Link
              className="admin-btn-primary text-center"
              href="/admin/submissions"
            >
              Audit Submissions Ledger
            </Link>
            <Link
              className="admin-btn-secondary text-center"
              href="/admin/snapshot"
            >
              Build Monthly Snapshot
            </Link>
            <Link
              className="admin-btn-secondary text-center"
              href="/admin/spotlight"
            >
              Curate Citizen Spotlights
            </Link>
          </nav>
        </section>
      </div>
    </>
  );
}
