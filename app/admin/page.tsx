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
    <main className="w-full pb-20">
      <section className="relative overflow-hidden pt-16">
        <div className="mx-auto w-full max-w-6xl px-6">
          <div className="nsi-section-card px-8 py-10">
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/60 px-4 py-1.5 text-xs font-medium text-[color:var(--nsi-ink)] backdrop-blur-md">
                Admin
              </div>
              <h1 className="mt-4 font-serif text-4xl font-semibold tracking-tight text-[color:var(--nsi-ink)]">
                Admin dashboard
              </h1>
              <p className="mt-3 text-sm text-[color:var(--nsi-ink-soft)]">
                Manage the current cycle, submissions, and spotlights.
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto mt-10 grid w-full max-w-6xl gap-6 px-6 md:grid-cols-3">
        <div className="nsi-card-soft p-7 md:col-span-2">
          <div className="text-sm font-medium text-[color:var(--nsi-ink-soft)]">Current cycle</div>
          <div className="mt-2 font-serif text-2xl font-semibold tracking-tight text-[color:var(--nsi-ink)]">
            {currentCycle ? currentCycle.monthYear : "—"}
          </div>
          <div className="mt-3 text-sm text-[color:var(--nsi-ink-soft)]">
            Status:{" "}
            <span className="rounded-full border border-black/10 bg-[color:var(--nsi-paper)] px-2 py-1 text-xs font-medium text-[color:var(--nsi-ink)]">
              {currentCycle?.status ?? "NONE"}
            </span>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <CycleControls />
          </div>
        </div>

        <div className="nsi-card-soft p-7">
          <div className="text-sm font-medium text-[color:var(--nsi-ink-soft)]">Submissions</div>
          <div className="mt-2 text-4xl font-semibold tracking-tight text-[color:var(--nsi-green)]">{total}</div>
          <div className="mt-2 text-sm text-[color:var(--nsi-ink-soft)]">Flagged: {flagged}</div>
          <div className="mt-6 flex flex-col gap-2">
            <a className="rounded-xl bg-[color:var(--nsi-green)] px-4 py-2 text-sm font-medium text-white shadow-md transition-all hover:brightness-110" href="/admin/submissions">
              Review submissions
            </a>
            <a className="rounded-xl border border-black/15 bg-white/70 px-4 py-2 text-sm font-medium text-[color:var(--nsi-ink)] backdrop-blur-sm" href="/admin/snapshot">
              Build snapshot
            </a>
            <a className="rounded-xl border border-black/15 bg-white/70 px-4 py-2 text-sm font-medium text-[color:var(--nsi-ink)] backdrop-blur-sm" href="/admin/spotlight">
              Spotlight feed
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}

