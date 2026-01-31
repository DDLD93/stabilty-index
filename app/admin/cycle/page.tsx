import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { CycleSurveyForm } from "@/components/admin/CycleSurveyForm";

export const dynamic = "force-dynamic";

export default function AdminCyclePage() {
  return (
    <>
      <AdminPageHeader
        title="Cycle survey"
        description="Define one question per pillar (scale 1–5). Open the cycle so respondents can submit answers."
        breadcrumb={[
          { label: "Dashboard", href: "/admin" },
          { label: "Cycle survey" },
        ]}
      />

      <CycleSurveyForm />
    </>
  );
}
