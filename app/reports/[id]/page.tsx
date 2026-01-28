import { PublicationDashboard } from "@/components/publication/PublicationDashboard";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function ReportDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;

  return (
    <main className="mx-auto w-full max-w-6xl px-6 pb-14 pt-10">
      <Link
        className="nsi-pill inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium text-black/80 hover:bg-white"
        href="/reports"
      >
        <span aria-hidden>←</span>
        <span>Back to reports</span>
      </Link>
      <div className="mt-8">
        <PublicationDashboard snapshotId={id} />
      </div>
    </main>
  );
}

