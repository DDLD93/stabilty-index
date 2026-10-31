import type { Metadata } from "next";
import { Suspense } from "react";
import { SurveyWizard } from "@/components/public/SurveyWizard";
import { Container } from "@/components/ui/Layout";
import { Breadcrumb } from "@/components/ui/PageHeader";
import { defaultMetadata } from "@/lib/metadata";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  ...defaultMetadata,
  title: "Take the monthly survey",
  description:
    "Five questions, about two minutes, no names or phone numbers. Your answers shape the Nigeria Stability Index.",
  alternates: { canonical: "/survey" },
};

export default function SurveyPage() {
  return (
    <Container className="pt-8 pb-16 sm:pt-10 sm:pb-24">
      <Breadcrumb items={[{ href: "/", label: "Home" }, { label: "Survey" }]} className="mb-6" />
      <h1 className="text-h2">Monthly survey</h1>
      <p className="mt-3 max-w-2xl text-body text-ink-2">
        Your answers are anonymous and count towards this month’s reading of the Nigeria Stability Index.
      </p>
      <div className="mt-10">
        <Suspense
          fallback={
            <div className="max-w-[40rem] border border-line bg-surface px-6 py-10">
              <p className="text-body text-ink-2">Loading the survey…</p>
            </div>
          }
        >
          <SurveyWizard />
        </Suspense>
      </div>
    </Container>
  );
}
