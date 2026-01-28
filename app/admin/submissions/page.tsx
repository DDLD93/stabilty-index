import { SubmissionsTable } from "@/components/admin/SubmissionsTable";

export const dynamic = "force-dynamic";

export default function AdminSubmissionsPage() {
  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-12">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-4xl font-semibold tracking-tight text-[color:var(--nsi-green)]">
            Submissions
          </h1>
          <p className="mt-2 text-sm text-black/70">
            Review check-ins, flag entries, and export CSV (flagged entries excluded).
          </p>
        </div>
        <a
          className="rounded-xl border border-black/15 bg-white px-4 py-2 text-sm font-medium hover:bg-black/[.03]"
          href="/api/admin/submissions/export"
        >
          Export CSV
        </a>
      </div>

      <div className="mt-8">
        <SubmissionsTable />
      </div>
    </main>
  );
}

