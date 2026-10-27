import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { defaultMetadata } from "@/lib/metadata";
import { SurveyWizard } from "@/components/public/SurveyWizard";
import { NigeriaMapSilhouette } from "@/components/public/icons";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  ...defaultMetadata,
  title: "Citizen Field Survey | Nigeria Stability Index",
  description:
    "Share how Nigeria feels to you — one question per pillar. Your voice shapes the Nigeria Stability Index.",
  openGraph: {
    ...defaultMetadata.openGraph,
    title: "Citizen Field Survey | Nigeria Stability Index",
    description: "Share how Nigeria feels to you. One question per pillar.",
    url: `${defaultMetadata.metadataBase ?? ""}survey`,
  },
  alternates: {
    canonical: "/survey",
  },
};

export default function SurveyPage() {
  return (
    <main className="w-full pb-24">
      {/* Institutional Survey Header Band */}
      <section className="nsi-band relative overflow-hidden border-b border-white/15 py-12 md:py-16">
        <div className="pointer-events-none absolute inset-0 z-0 opacity-20">
          <Image
            src="/images/nigeria-citizens-dialogue.jpg"
            alt="Nigerian citizens participating in community policy dialogue"
            fill
            className="object-cover object-center mix-blend-luminosity"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#062315] via-[#062315]/95 to-[#062315]/80" />
        </div>
        <NigeriaMapSilhouette className="pointer-events-none absolute -right-12 -bottom-12 h-80 w-96 text-white opacity-[0.04]" />

        <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-white/15 pb-4">
            <div className="flex items-center gap-3">
              <span className="inline-block h-2 w-2 rounded-full bg-[color:var(--nsi-gold)]" />
              <span className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-[color:var(--nsi-gold-light)]">
                Public Sentiment Instrument · Anonymous Collection
              </span>
            </div>
            <Link
              href="/"
              className="font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-white/75 transition hover:text-white"
            >
              ← Return to Index Dashboard
            </Link>
          </div>

          <h1 className="font-serif text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-[2.65rem] md:leading-[1.12]">
            Nigeria Stability Index — Citizen Field Survey
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/80">
            Your responses are strictly anonymous and help track how Nigeria is holding together across security, economy, governance, investor confidence, and social stability across all 36 states and the FCT.
          </p>
        </div>
      </section>

      {/* Main Survey Instrument Container */}
      <div className="mx-auto -mt-6 relative z-20 max-w-3xl px-4 sm:px-6">
        <Suspense
          fallback={
            <div className="mx-auto w-full rounded-[3px] border border-[color:var(--nsi-rule-strong)] bg-white p-12 text-center shadow-sm">
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-[color:var(--nsi-ink-muted)]">
                Initializing survey instrument…
              </p>
            </div>
          }
        >
          <SurveyWizard />
        </Suspense>
      </div>
    </main>
  );
}
