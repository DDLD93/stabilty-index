import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { defaultMetadata } from "@/lib/metadata";
import { SurveyWizard } from "@/components/public/SurveyWizard";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  ...defaultMetadata,
  title: "Citizen Telemetry Survey | Sovereign Stability Radar",
  description:
    "Share how Nigeria feels to you — five concise pillar questions. Your voice directly calibrates the sovereign national index.",
  openGraph: {
    ...defaultMetadata.openGraph,
    title: "Citizen Telemetry Survey | Nigeria Stability Index",
    description: "Submit your confidential ground rating across Security, Economy, Governance, Investor Trust, and Social Stability.",
    url: `${defaultMetadata.metadataBase ?? ""}survey`,
  },
  alternates: {
    canonical: "/survey",
  },
};

export default function SurveyPage() {
  return (
    <main className="relative min-h-[90vh] w-full pb-24 pt-16 text-slate-100 overflow-hidden">
      {/* Background Ambience */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute top-10 left-1/3 h-96 w-96 rounded-full bg-[#00f59b]/10 blur-[130px]" />
        <div className="absolute bottom-10 right-1/4 h-80 w-80 rounded-full bg-[#f59e0b]/8 blur-[120px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#00f59b08_1px,transparent_1px),linear-gradient(to_bottom,#00f59b08_1px,transparent_1px)] bg-[size:3.5rem_3.5rem]" />
      </div>

      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 font-mono text-xs text-[#00f59b] hover:text-[#fbbf24] transition-colors"
          >
            <span>←</span>
            <span>BACK TO OBSERVATORY RADAR</span>
          </Link>
          <div className="flex items-center gap-2 font-mono text-[11px] text-[#64748b]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#00f59b] animate-ping" />
            <span>TELEMETRY CHANNEL SECURE</span>
          </div>
        </div>

        <div className="mb-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#00f59b]/30 bg-[#07190f] px-3.5 py-1 font-mono text-xs text-[#00f59b] mb-3">
            <span>CITIZEN FEEDBACK PROTOCOL</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-white">
            Calibrate the National Stability Index
          </h1>
          <p className="mt-2 text-sm sm:text-base leading-relaxed text-slate-400">
            One evaluation prompt per stability pillar. Submissions are cryptographically anonymized, 
            aggregated in real time, and synthesized into the monthly Sovereign Dossier.
          </p>
        </div>

        <Suspense
          fallback={
            <div className="observatory-card p-12 text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-2 border-[#00f59b] border-t-transparent" />
              <p className="mt-4 font-mono text-xs text-slate-400">Initializing encrypted telemetry session…</p>
            </div>
          }
        >
          <SurveyWizard />
        </Suspense>
      </div>
    </main>
  );
}
