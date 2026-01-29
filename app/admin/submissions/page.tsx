import { SubmissionsTable } from "@/components/admin/SubmissionsTable";

export const dynamic = "force-dynamic";

export default function AdminSubmissionsPage() {
  return (
    <main className="w-full pb-20">
      <section className="relative overflow-hidden pt-16">
        <div className="mx-auto w-full max-w-6xl px-6">
          <div className="nsi-section-card px-8 py-10">
            <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/60 px-4 py-1.5 text-xs font-medium text-[color:var(--nsi-ink)] backdrop-blur-md">
                  Admin
                </div>
                <h1 className="mt-4 font-serif text-4xl font-semibold tracking-tight text-[color:var(--nsi-ink)]">
                  Submissions
                </h1>
                <p className="mt-3 text-sm text-[color:var(--nsi-ink-soft)]">
                  Review check-ins, flag entries, and export CSV (flagged entries excluded).
                </p>
              </div>
              <a
                className="rounded-xl border border-black/15 bg-white/70 px-4 py-2 text-sm font-medium text-[color:var(--nsi-ink)] backdrop-blur-sm transition-all hover:bg-white"
                href="/api/admin/submissions/export"
              >
                Export CSV
              </a>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto mt-10 w-full max-w-6xl px-6">
        <SubmissionsTable />
      </div>
    </main>
  );
}

