import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { defaultMetadata } from "@/lib/metadata";
import { NSIShieldMark } from "@/components/public/icons";

export const metadata: Metadata = {
  ...defaultMetadata,
  title: "About The Observatory | Sovereign Intelligence & Civic Public Good",
  description:
    "Learn about the Nigeria Stability Index (NSI) — an independent civic observatory measuring Nigeria's macro-resilience through empirical telemetry, institutional disclosures, and nationwide citizen perception.",
  openGraph: {
    ...defaultMetadata.openGraph,
    title: "About The Observatory | Nigeria Stability Index",
    description:
      "The Nigeria Stability Index is an autonomous civic public good tracking national resilience with scientific neutrality.",
    url: `${defaultMetadata.metadataBase ?? ""}about`,
  },
  alternates: {
    canonical: "/about",
  },
};

export default function AboutPage() {
  return (
    <main className="relative min-h-[90vh] w-full pb-24 pt-16 text-slate-100 overflow-hidden">
      {/* Background Ambience */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute top-10 left-1/4 h-96 w-96 rounded-full bg-[#00f59b]/10 blur-[140px]" />
        <div className="absolute top-1/2 right-1/4 h-80 w-80 rounded-full bg-[#f59e0b]/8 blur-[120px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#00f59b08_1px,transparent_1px),linear-gradient(to_bottom,#00f59b08_1px,transparent_1px)] bg-[size:3.5rem_3.5rem]" />
      </div>

      <div className="mx-auto w-full max-w-5xl px-6">
        {/* Hero Card */}
        <div className="observatory-card p-8 sm:p-12 relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-[#00f59b]/15 pb-8">
            <div className="flex items-center gap-4">
              <div className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-[#00f59b]/40 bg-[#07190f] p-2 shadow-[0_0_20px_rgba(0,245,155,0.25)]">
                <NSIShieldMark className="h-10 w-10 text-[#00f59b]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#00f59b]">
                    MISSION CHARTER
                  </span>
                  <span className="rounded bg-[#00f59b]/15 px-2 py-0.5 font-mono text-[10px] text-[#00f59b] border border-[#00f59b]/30">
                    NON-PARTISAN
                  </span>
                </div>
                <h1 className="mt-1 font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white">
                  About the Sovereign Observatory
                </h1>
              </div>
            </div>

            <Link
              href="/survey"
              className="inline-flex items-center gap-2 rounded-xl border border-[#00f59b] bg-[#00f59b] px-5 py-3 font-mono text-xs font-bold text-black shadow-[0_0_15px_rgba(0,245,155,0.3)] transition-all hover:bg-[#22ffb0] shrink-0"
            >
              <span>PARTICIPATE IN SURVEY</span>
              <span>→</span>
            </Link>
          </div>

          <div className="mt-8 grid gap-8 md:grid-cols-12 md:items-center">
            <div className="md:col-span-7">
              <p className="text-base sm:text-lg leading-relaxed text-slate-200">
                The <strong>Nigeria Stability Index (NSI)</strong> is an independent civic measurement
                and geopolitical observability platform. We track how Nigeria is holding together through calm,
                rigorous monthly syntheses across security, economy, governance, investor confidence, and social cohesion.
              </p>
              <p className="mt-4 text-sm leading-relaxed text-slate-400">
                Operating strictly outside the noise of election cycles, partisan political rhetoric, and social media outrage, 
                the NSI delivers an unvarnished empirical baseline for policy researchers, domestic enterprises, global investors, 
                and Nigerian citizens alike.
              </p>
            </div>

            <div className="md:col-span-5 relative h-56 rounded-2xl overflow-hidden border border-[#00f59b]/25">
              <Image
                src="/images/nigeria_research_desk.jpg"
                alt="Nigerian Economic Research Team"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#030805] via-transparent to-transparent opacity-80" />
              <div className="absolute bottom-3 left-3 right-3 font-mono text-[10px] text-slate-300 bg-black/60 backdrop-blur-sm p-2 rounded-lg border border-white/5">
                Empirical Policy Research Desk · Abuja FCT
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-4 pt-6 border-t border-white/5">
            <Link
              href="/reports"
              className="rounded-xl border border-[#00f59b] bg-[#00f59b]/20 px-6 py-2.5 font-mono text-xs font-bold text-[#00f59b] hover:bg-[#00f59b] hover:text-black transition-all"
            >
              VIEW MONTHLY REPORTS →
            </Link>
            <Link
              href="/methodology"
              className="rounded-xl border border-white/10 bg-white/5 px-6 py-2.5 font-mono text-xs font-semibold text-slate-300 hover:bg-white/10 hover:text-white transition-all"
            >
              METHODOLOGICAL AUDIT →
            </Link>
          </div>
        </div>

        {/* Core Principles Grid */}
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          <div className="observatory-card p-6">
            <div className="font-mono text-xs font-bold uppercase tracking-wider text-[#00f59b]">
              PRINCIPLE I
            </div>
            <h3 className="mt-3 font-serif text-xl font-bold text-white">
              Triangulated Evidence
            </h3>
            <p className="mt-2 text-xs sm:text-sm leading-relaxed text-slate-400">
              No single source holds monopoly on ground reality. We synthesize official statistical bulletins (NBS, CBN), 
              conflict event tracking (ACLED), and direct nationwide citizen perception surveys.
            </p>
          </div>

          <div className="observatory-card p-6">
            <div className="font-mono text-xs font-bold uppercase tracking-wider text-[#38bdf8]">
              PRINCIPLE II
            </div>
            <h3 className="mt-3 font-serif text-xl font-bold text-white">
              Absolute Non-Partisanship
            </h3>
            <p className="mt-2 text-xs sm:text-sm leading-relaxed text-slate-400">
              Zero political affiliations, campaign advocacy, or commercial bias. The index evaluates structural resilience 
              solely against standardized governance, security, and economic benchmarks.
            </p>
          </div>

          <div className="observatory-card p-6">
            <div className="font-mono text-xs font-bold uppercase tracking-wider text-[#fbbf24]">
              PRINCIPLE III
            </div>
            <h3 className="mt-3 font-serif text-xl font-bold text-white">
              Total Citizen Anonymity
            </h3>
            <p className="mt-2 text-xs sm:text-sm leading-relaxed text-slate-400">
              Citizen responses are cryptographically hashed and stripped of all personal identifiable information (PII). 
              Your voice informs national intelligence without compromising privacy.
            </p>
          </div>
        </div>

        {/* Initiative Colophon Box */}
        <div className="mt-12 observatory-card p-8 sm:p-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div>
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#fbbf24]">
                PHILANTHROPIC SPONSORSHIP
              </span>
              <h3 className="mt-1 font-serif text-2xl font-bold text-white">
                The 24 Angels Initiative
              </h3>
              <p className="mt-2 text-sm text-slate-400 max-w-xl">
                The Nigeria Stability Index was conceived and underwritten by The 24 Angels Initiative as an open public good 
                to foster democratic accountability, economic resilience, and fact-based national dialogue.
              </p>
            </div>
            <Link
              href="/contact"
              className="rounded-xl border border-white/15 bg-white/5 px-6 py-3 font-mono text-xs font-semibold text-slate-200 hover:bg-white/10 shrink-0"
            >
              CONTACT FIELD OFFICE →
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
