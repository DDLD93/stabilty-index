import { SnapshotBuilder } from "@/components/admin/SnapshotBuilder";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";

export const dynamic = "force-dynamic";

export default function AdminSnapshotPage() {
  return (
    <>
      <AdminPageHeader
        title="Snapshot builder"
        description="Draft, publish, and lock a monthly snapshot. Locked snapshots cannot be edited."
        breadcrumb={[
          { label: "Dashboard", href: "/admin" },
          { label: "Snapshot builder" },
        ]}
      />

      <SnapshotBuilder />
    </>
  );
}
