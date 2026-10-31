import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { HonorsAdmin } from "@/components/admin/honors/HonorsAdmin";

export const dynamic = "force-dynamic";

export default function AdminHonorsPage() {
  return (
    <>
      <AdminPageHeader
        title="NSI Honors"
        description="Run each edition: dates, categories, nominations, finalists, the public vote and winners."
        breadcrumb={[{ label: "Dashboard", href: "/admin" }, { label: "Honors" }]}
      />
      <HonorsAdmin />
    </>
  );
}
