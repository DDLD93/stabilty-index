import { SnapshotBuilder } from "@/components/admin/SnapshotBuilder";

export const dynamic = "force-dynamic";

export default function AdminSnapshotPage() {
  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-12">
      <h1 className="font-serif text-4xl font-semibold tracking-tight text-[color:var(--nsi-green)]">
        Snapshot builder
      </h1>
      <p className="mt-2 text-sm text-black/70">
        Draft, publish, and lock a monthly snapshot. Locked snapshots cannot be edited.
      </p>
      <div className="mt-8">
        <SnapshotBuilder />
      </div>
    </main>
  );
}

