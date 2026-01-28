import { db } from "@/lib/db";
import { CycleControls } from "@/components/admin/CycleControls";

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
    <main className="mx-auto w-full max-w-6xl px-6 py-12">
      <h1 className="font-serif text-4xl font-semibold tracking-tight text-[color:var(--nsi-green)]">
        Admin dashboard
      </h1>

      <div className="mt-8 grid gap-6 md:grid-cols-3">
        <div className="rounded-3xl border border-black/10 bg-white p-7 shadow-sm md:col-span-2">
          <div className="text-sm font-medium text-black/60">Current cycle</div>
          <div className="mt-2 font-serif text-2xl font-semibold tracking-tight">
            {currentCycle ? currentCycle.monthYear : "—"}
          </div>
          <div className="mt-3 text-sm text-black/70">
            Status:{" "}
            <span className="rounded-full border border-black/10 bg-[color:var(--nsi-paper)] px-2 py-1 text-xs font-medium">
              {currentCycle?.status ?? "NONE"}
            </span>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <CycleControls />
          </div>
        </div>

        <div className="rounded-3xl border border-black/10 bg-white p-7 shadow-sm">
          <div className="text-sm font-medium text-black/60">Submissions</div>
          <div className="mt-2 text-4xl font-semibold tracking-tight text-[color:var(--nsi-green)]">{total}</div>
          <div className="mt-2 text-sm text-black/70">Flagged: {flagged}</div>
          <div className="mt-6 flex flex-col gap-2">
            <a className="rounded-xl bg-[color:var(--nsi-green)] px-4 py-2 text-sm font-medium text-white" href="/admin/submissions">
              Review submissions
            </a>
            <a className="rounded-xl border border-black/15 bg-white px-4 py-2 text-sm font-medium" href="/admin/snapshot">
              Build snapshot
            </a>
            <a className="rounded-xl border border-black/15 bg-white px-4 py-2 text-sm font-medium" href="/admin/spotlight">
              Spotlight feed
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}

