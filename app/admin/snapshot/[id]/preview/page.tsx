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
      <div className="rounded-2xl border border-red-200 bg-red-50 p-8">
        <p className="font-medium text-red-800">Snapshot not found.</p>
        <Link href="/admin/snapshot" className="mt-4 inline-block text-sm text-red-600 hover:underline">
          Back to Snapshot builder
        </Link>
      </div>
    );
  }

  const isDraft = !snapshot.publishedAt;

  return (
    <div className="w-full">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-2 text-sm font-medium text-amber-800">
          {isDraft ? "Preview (draft)" : "Preview (published)"}
        </div>
        <Link
          href={`/admin/snapshot`}
          className="text-sm font-medium text-[color:var(--nsi-green)] hover:underline"
        >
          ← Back to Snapshot builder
        </Link>
      </div>
      <PublicationDashboard snapshotId={id} />
    </div>
  );
}
