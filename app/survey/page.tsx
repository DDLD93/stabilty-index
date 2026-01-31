import type { Metadata } from "next";
import Link from "next/link";
import { defaultMetadata } from "@/lib/metadata";
import { SurveyWizard } from "@/components/public/SurveyWizard";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  ...defaultMetadata,
  title: "Take the Survey | Nigeria Stability Index",
  description:
    "Share how Nigeria feels to you — one question per pillar. Your voice shapes the Nigeria Stability Index.",
  openGraph: {
    ...defaultMetadata.openGraph,
    title: "Take the Survey | Nigeria Stability Index",
    description: "Share how Nigeria feels to you. One question per pillar.",
    url: `${defaultMetadata.metadataBase ?? ""}survey`,
  },
  alternates: {
    canonical: "/survey",
  },
};

export default function SurveyPage() {
  return (
    <main className="w-full pb-20 pt-16">
      <div className="mx-auto max-w-3xl px-6">
        <div className="mb-8 flex items-center justify-between">
          <Link
            href="/"
            className="text-sm font-medium text-[color:var(--nsi-ink-soft)] hover:text-[color:var(--nsi-green)] hover:underline"
          >
            ← Back to home
          </Link>
        </div>
        <h1 className="mb-2 font-serif text-3xl font-bold tracking-tight text-[color:var(--nsi-ink)]">
          Nigeria Stability Index — Survey
        </h1>
        <p className="mb-10 text-[color:var(--nsi-ink-soft)]">
          Your responses are anonymous and help us track how Nigeria is holding together across security, economy, governance, investor confidence, and social stability.
        </p>
        <SurveyWizard />
      </div>
    </main>
  );
}
