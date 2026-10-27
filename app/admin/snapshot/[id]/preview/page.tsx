import Link from "next/link";
import { PublicationDashboard } from "@/components/publication/PublicationDashboard";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export default async function AdminSnapshotPreviewPage({ params }: Props) {
  const { id } = await params;

  const snapshot = await db.snapshot.findUnique({
    where: { id },
    select: { id: true, publishedAt: true },
  });

  if (!snapshot) {
    return (
      <div className="rounded-[3px] border border-red-300 bg-red-50 p-8">
        <p className="font-semibold text-red-900">Snapshot not found.</p>
        <Link href="/admin/snapshot" className="mt-4 inline-block font-mono text-xs uppercase tracking-wider text-red-700 hover:underline">
          ← Back to Snapshot Builder
        </Link>
      </div>
    );
  }

  const isDraft = !snapshot.publishedAt;

  return (
    <div className="w-full">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-[color:var(--nsi-rule-strong)] pb-4">
        <div className="rounded-[2px] border border-amber-300 bg-amber-50 px-3.5 py-1.5 font-mono text-xs font-bold uppercase tracking-[0.14em] text-amber-900">
          {isDraft ? "Editorial Preview · Draft State" : "Editorial Preview · Published Edition"}
        </div>
        <Link
          href="/admin/snapshot"
          className="font-mono text-xs font-bold uppercase tracking-[0.14em] text-[color:var(--nsi-green)] hover:underline"
        >
          ← Back to Snapshot Builder
        </Link>
      </div>
      <PublicationDashboard snapshotId={id} />
    </div>
  );
}
