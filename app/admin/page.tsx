import Link from "next/link";
import { db } from "@/lib/db";
import { CycleControls } from "@/components/admin/CycleControls";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const currentCycle = await db.cycle.findFirst({
    orderBy: { createdAt: "desc" },
    select: { id: true, status: true, monthYear: true, createdAt: true },
  });

  const counts = currentCycle
    ? await db.submission.groupBy({
        by: ["isFlagged"],
        where: { cycleId: currentCycle.id },
        _count: { _all: true },
      })
    : [];

  const total = counts.reduce((acc, c) => acc + c._count._all, 0);
  const flagged = counts.find((c) => c.isFlagged)?._count._all ?? 0;

  return (
    <>
      <AdminPageHeader
        title="Dashboard"
        description="Manage the current cycle, submissions, and spotlights."
      />

      <div className="grid w-full gap-6 lg:grid-cols-3">
        {/* Current Cycle Card */}
        <section
          aria-labelledby="cycle-heading"
          className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm lg:col-span-2 lg:p-8"
        >
          <h2
            id="cycle-heading"
            className="text-sm font-semibold uppercase tracking-wide text-[color:var(--nsi-ink-soft)]"
          >
            Current cycle
          </h2>
          <div className="mt-3 font-serif text-3xl font-semibold tracking-tight text-[color:var(--nsi-ink)]">
            {currentCycle ? currentCycle.monthYear : "—"}
          </div>
          <div className="mt-4 flex items-center gap-3 text-sm text-[color:var(--nsi-ink-soft)]">
            <span>Status:</span>
            <span
              className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                currentCycle?.status === "OPEN"
                  ? "bg-emerald-100 text-emerald-800"
                  : currentCycle?.status === "CLOSED"
                    ? "bg-amber-100 text-amber-800"
                    : "bg-gray-100 text-gray-700"
              }`}
            >
              {currentCycle?.status ?? "NONE"}
            </span>
          </div>

          <div className="mt-8 flex flex-wrap gap-3 border-t border-black/5 pt-6">
            <CycleControls />
          </div>
        </section>

        {/* Quick Stats Card */}
        <section
          aria-labelledby="stats-heading"
          className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm lg:p-8"
        >
          <h2
            id="stats-heading"
            className="text-sm font-semibold uppercase tracking-wide text-[color:var(--nsi-ink-soft)]"
          >
            Submissions
          </h2>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-serif text-5xl font-semibold tabular-nums text-[color:var(--nsi-green)]">
              {total}
            </span>
            <span className="text-sm text-[color:var(--nsi-ink-soft)]">total</span>
          </div>
          <div className="mt-2 text-sm text-[color:var(--nsi-ink-soft)]">
            <span className="tabular-nums">{flagged}</span> flagged for review
          </div>

          <nav aria-label="Quick actions" className="mt-8 flex flex-col gap-3">
            <Link
              className="admin-btn-primary text-center"
              href="/admin/submissions"
            >
              Review submissions
            </Link>
            <Link
              className="admin-btn-secondary text-center"
              href="/admin/snapshot"
            >
              Build snapshot
            </Link>
            <Link
              className="admin-btn-secondary text-center"
              href="/admin/spotlight"
            >
              Spotlight feed
            </Link>
          </nav>
        </section>
      </div>
    </>
  );
}
