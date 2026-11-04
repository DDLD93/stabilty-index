import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { CycleSurveyForm } from "@/components/admin/CycleSurveyForm";

export const dynamic = "force-dynamic";

export default function AdminCyclePage() {
  return (
    <>
      <AdminPageHeader
        title="Cycle survey"
        description="Define one question per pillar (answered 1–10). Name the cycle after the month the survey asks about: a cycle opened in early November is “October 2026”, published on 11 November."
        breadcrumb={[
          { label: "Dashboard", href: "/admin" },
          { label: "Cycle survey" },
        ]}
      />

      <CycleSurveyForm />
    </>
  );
}
