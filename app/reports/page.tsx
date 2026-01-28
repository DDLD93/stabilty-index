import { db } from "@/lib/db";
import { NSIShieldMark } from "@/components/public/icons";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function ReportsPage() {
  const reports = await db.snapshot.findMany({
    where: { publishedAt: { not: null } },
    orderBy: { publishedAt: "desc" },
    select: { id: true, period: true, overallScore: true, overallNarrative: true, publishedAt: true },
  });

  return (
    <main className="mx-auto w-full max-w-7xl px-6 pb-14 pt-10">
      <section className="nsi-card rounded-[30px] px-8 py-9">
        <div className="flex items-center gap-3">
          <NSIShieldMark />
          <h1 className="text-4xl font-semibold tracking-tight text-[color:var(--nsi-ink)]">Reports</h1>
        </div>
        <p className="mt-4 max-w-2xl text-base leading-7 text-black/70">
          Published monthly snapshots of Nigeria’s stability — overall score, pillar summaries, and a highlighted state.
        </p>
      </section>

      {reports.length ? (
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {reports.map((r) => (
            <Link
              key={r.id}
              href={`/reports/${r.id}`}
              className="group overflow-hidden rounded-[28px] border-2 border-black/15 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="bg-[color:var(--nsi-green)] px-7 py-3 text-sm font-semibold text-white">
                {r.period}
              </div>
              <div className="flex items-end justify-between gap-6 px-7 py-7">
                <div>
                  <div className="mt-2 font-serif text-2xl font-semibold tracking-tight text-black group-hover:underline">
                    Nigeria Stability Snapshot
                  </div>
                  <div className="mt-3 text-sm leading-6 text-black/70 line-clamp-2">
                    {r.overallNarrative}
                  </div>
                </div>
                <div className="rounded-2xl border border-black/10 bg-[color:var(--nsi-paper)] px-5 py-4 text-center">
                  <div className="text-xs font-medium text-black/60">Score</div>
                  <div className="mt-1 text-3xl font-semibold text-[color:var(--nsi-green)]">
                    {r.overallScore.toFixed(1)}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="mt-10 rounded-[28px] border-2 border-black/15 bg-white p-8">
          <p className="text-black/70">No published reports yet.</p>
        </div>
      )}
    </main>
  );
}

