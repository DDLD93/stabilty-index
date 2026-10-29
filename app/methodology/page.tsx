import Image from "next/image";
import type { Metadata } from "next";
import Link from "next/link";
import { defaultMetadata } from "@/lib/metadata";
import { NSIShieldMark } from "@/components/public/icons";

export const metadata: Metadata = {
  ...defaultMetadata,
  title: "Methodological Framework | Sovereign Stability Observatory",
  description:
    "Explore how the Nigeria Stability Index calculates its monthly composite score across 5 sovereign pillars, triangulating institutional data and grassroots citizen telemetry.",
  openGraph: {
    ...defaultMetadata.openGraph,
    title: "Methodological Framework | Nigeria Stability Index",
    description:
      "Mathematical weighting, data verification protocols, and monthly publication cycles of the NSI framework.",
    url: `${defaultMetadata.metadataBase ?? ""}methodology`,
  },
  alternates: {
    canonical: "/methodology",
  },
};

export default function MethodologyPage() {
  const PILLARS_BREAKDOWN = [
    { title: "Security & Territorial Integrity", weight: "25%", color: "text-[#f43f5e]", desc: "Armed conflict incidents, territorial containment, border surveillance, and citizen physical safety perception." },
    { title: "FX Liquidity & Macro-Economy", weight: "25%", color: "text-[#38bdf8]", desc: "Interbank foreign exchange liquidity, consumer price index (CPI), food inflation, and monetary policy transmission." },
    { title: "Investor Confidence & Capital Flows", weight: "20%", color: "text-[#fbbf24]", desc: "Foreign direct investment (FDI), capital importation, sovereign bond yields, and commercial regulatory predictability." },
    { title: "Governance & Institutional Trust", weight: "15%", color: "text-[#00f59b]", desc: "Judicial independence, public financial transparency, state executive performance, and inter-agency coherence." },
    { title: "Social Stability & Cohesion", weight: "15%", color: "text-[#a78bfa]", desc: "Labor market stability, community resilience, educational continuity, and grassroots street sentiment." },
  ];

  return (
    <main className="relative min-h-[90vh] w-full pb-24 pt-16 text-slate-100 overflow-hidden">
      {/* Background Ambience */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute top-10 left-1/4 h-96 w-96 rounded-full bg-[#00f59b]/10 blur-[140px]" />
        <div className="absolute top-1/2 right-1/4 h-80 w-80 rounded-full bg-[#38bdf8]/8 blur-[120px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#00f59b08_1px,transparent_1px),linear-gradient(to_bottom,#00f59b08_1px,transparent_1px)] bg-[size:3.5rem_3.5rem]" />
      </div>

      <div className="mx-auto w-full max-w-5xl px-6">
        {/* Header Card */}
        <div className="observatory-card p-8 sm:p-12 relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-[#00f59b]/15 pb-8">
            <div className="flex items-center gap-4">
              <div className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-[#00f59b]/40 bg-[#07190f] p-2 shadow-[0_0_20px_rgba(0,245,155,0.25)]">
                <NSIShieldMark className="h-10 w-10 text-[#00f59b]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#38bdf8]">
                    METHODOLOGICAL RUBRIC
                  </span>
                  <span className="rounded bg-[#38bdf8]/15 px-2 py-0.5 font-mono text-[10px] text-[#38bdf8] border border-[#38bdf8]/30">
                    QUANTITATIVE CALIBRATION
                  </span>
                </div>
                <h1 className="mt-1 font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white">
                  The Science of National Observability
                </h1>
              </div>
            </div>

            <Link
              href="/reports"
              className="inline-flex items-center gap-2 rounded-xl border border-[#00f59b] bg-[#00f59b] px-5 py-3 font-mono text-xs font-bold text-black shadow-[0_0_15px_rgba(0,245,155,0.3)] transition-all hover:bg-[#22ffb0] shrink-0"
            >
              <span>AUDIT REPORTS</span>
              <span>→</span>
            </Link>
          </div>

          <p className="mt-6 text-base sm:text-lg leading-relaxed text-slate-200">
            The <strong>Nigeria Stability Index (NSI)</strong> runs on an autonomous, 30-day cyclical calendar. 
            We combine high-frequency administrative disclosures with nationwide anonymous citizen sentiment, producing an unvarnished composite score between <strong>1.0 (Critical Fragility)</strong> and <strong>10.0 (Optimal Stability)</strong>.
          </p>
        </div>

        {/* 3-Step Monthly Observability Cycle */}
        <div className="mt-12">
          <div className="font-mono text-xs font-bold uppercase tracking-wider text-[#00f59b] mb-4">
            THE 30-DAY OPERATIONAL CADENCE
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="observatory-card p-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="font-mono text-xs text-[#00f59b] font-bold">PHASE 01</span>
                <span className="font-mono text-[10px] text-slate-500">DAYS 01 – 25</span>
              </div>
              <h3 className="mt-4 font-serif text-xl font-bold text-white">
                Multi-Stream Ingestion
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-slate-400 leading-relaxed">
                Collection of nationwide citizen survey check-ins across 36 states and FCT, combined with high-frequency statistical reports from the CBN, NBS, and conflict monitors.
              </p>
            </div>

            <div className="observatory-card p-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="font-mono text-xs text-[#fbbf24] font-bold">PHASE 02</span>
                <span className="font-mono text-[10px] text-slate-500">DAYS 26 – 30</span>
              </div>
              <h3 className="mt-4 font-serif text-xl font-bold text-white">
                Triangulation & Audit
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-slate-400 leading-relaxed">
                Editorial and econometric review of raw data. Extreme outlier scrubbing, cross-validation with sub-national field bureaus, and final algorithm synthesis.
              </p>
            </div>

            <div className="observatory-card p-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="font-mono text-xs text-[#38bdf8] font-bold">PHASE 03</span>
                <span className="font-mono text-[10px] text-slate-500">CALENDAR DAY 11</span>
              </div>
              <h3 className="mt-4 font-serif text-xl font-bold text-white">
                Public Declassification
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-slate-400 leading-relaxed">
                Official release of the Monthly Stability Dossier, disaggregated pillar ratings, sub-national spotlights, and public open-access data download.
              </p>
            </div>
          </div>
        </div>

        {/* Five Pillar Weighting Breakdown */}
        <div className="mt-12 observatory-card p-8 sm:p-10">
          <div className="border-b border-[#00f59b]/15 pb-4 mb-6">
            <h2 className="font-mono text-xs font-bold uppercase tracking-wider text-[#00f59b]">
              MATHEMATICAL PILLAR WEIGHTINGS
            </h2>
            <p className="mt-1 text-sm text-slate-400">
              Composite stability score computation matrix: Score = Σ (Pillar_i × Weight_i)
            </p>
          </div>

          <div className="space-y-4">
            {PILLARS_BREAKDOWN.map((p, i) => (
              <div
                key={i}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-white/5 bg-black/40 p-5"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-bold text-slate-500">0{i + 1}.</span>
                    <h4 className="font-serif text-lg font-bold text-white">{p.title}</h4>
                  </div>
                  <p className="mt-1.5 text-xs text-slate-400 pl-7">{p.desc}</p>
                </div>
                <div className="flex items-baseline gap-2 pl-7 sm:pl-0">
                  <span className={`font-mono text-2xl font-black ${p.color}`}>{p.weight}</span>
                  <span className="font-mono text-[10px] text-slate-500 uppercase">WEIGHT</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </main>
  );
}
