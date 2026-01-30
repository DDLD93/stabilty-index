import { SubmissionsTable } from "@/components/admin/SubmissionsTable";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";

export const dynamic = "force-dynamic";

export default function AdminSubmissionsPage() {
  return (
    <>
      <AdminPageHeader
        title="Submissions"
        description="Review check-ins, flag entries, and export CSV (flagged entries excluded)."
        breadcrumb={[
          { label: "Dashboard", href: "/admin" },
          { label: "Submissions" },
        ]}
        actions={
          <a
            className="admin-btn-secondary"
            href="/api/admin/submissions/export"
            download
          >
            Export CSV
          </a>
        }
      />

      <SubmissionsTable />
    </>
  );
}
