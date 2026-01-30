import { SpotlightFeed } from "@/components/admin/SpotlightFeed";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";

export const dynamic = "force-dynamic";

export default function AdminSpotlightPage() {
  return (
    <>
      <AdminPageHeader
        title="State spotlight feed"
        description="Filter spotlight submissions by state (flagged entries excluded)."
        breadcrumb={[
          { label: "Dashboard", href: "/admin" },
          { label: "Spotlight feed" },
        ]}
      />

      <SpotlightFeed />
    </>
  );
}
