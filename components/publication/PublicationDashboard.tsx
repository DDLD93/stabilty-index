import { ReportArticle } from "@/components/publication/ReportArticle";
import { getReport } from "@/lib/snapshots";

/**
 * Renders one edition. Drafts render only when `allowDraft` is set, which only
 * the admin preview does; the public route 404s on anything unpublished.
 */
export async function PublicationDashboard({ snapshotId, allowDraft = false }: { snapshotId: string | null; allowDraft?: boolean }) {
  const report = snapshotId ? await getReport(snapshotId, allowDraft) : null;
  if (!report) {
    return (
      <div className="border border-line bg-surface p-8">
        <p className="font-semibold">This report could not be found.</p>
      </div>
    );
  }
  return <ReportArticle report={report} preview={allowDraft} />;
}
