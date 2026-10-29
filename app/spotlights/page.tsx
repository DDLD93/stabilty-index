import type { Metadata } from "next";
import Link from "next/link";
import { db } from "@/lib/db";
import { defaultMetadata } from "@/lib/metadata";
import { SpotlightCard } from "@/components/public/SpotlightCard";
import { GeopoliticalRadar } from "@/components/public/GeopoliticalRadar";
import { NSIShieldMark } from "@/components/public/icons";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  ...defaultMetadata,
  title: "Regional Geopolitical Radar & Spotlights | Sovereign Observatory",
  description:
    "Interactive 36-state geopolitical stability radar and deep tri-lens empirical spotlights across sub-national governance, institutions, and ground voices.",
  openGraph: {
    ...defaultMetadata.openGraph,
    title: "Regional Geopolitical Radar & Spotlights | Nigeria Stability Index",
    description:
      "Interactive 36-state stability tracking across all 6 geopolitical zones and empirical spotlights.",
    url: `${defaultMetadata.metadataBase ?? ""}spotlights`,
  },
  alternates: {
    canonical: "/spotlights",
  },
};

type StateSpotlight = { state?: string; score?: number; bullets?: string[]; keyPointsHtml?: string };
type InstitutionSpotlight = {
  institution?: string;
  summary?: string;
  bullets?: string[];
  keyPointsHtml?: string;
};
type StreetPulseSpotlight = { title?: string; summary?: string; keyPointsHtml?: string };

function safeString(v: unknown): string {
  return typeof v === "string" && v.length > 0 ? v : "";
}

function hasStateSpotlight(raw: unknown): raw is StateSpotlight {
  if (!raw || typeof raw !== "object") return false;
  const s = raw as StateSpotlight;
  return Boolean(
    safeString(s.state) ||
      (typeof s.keyPointsHtml === "string" && s.keyPointsHtml.replace(/<[^>]+>/g, "").trim()) ||
      (Array.isArray(s.bullets) && s.bullets.some(Boolean))
  );
}

function hasInstitutionSpotlight(raw: unknown): raw is InstitutionSpotlight {
  if (!raw || typeof raw !== "object") return false;
  const i = raw as InstitutionSpotlight;
  return Boolean(
    safeString(i.institution) ||
      safeString(i.summary) ||
      (typeof i.keyPointsHtml === "string" && i.keyPointsHtml.replace(/<[^>]+>/g, "").trim()) ||
      (Array.isArray(i.bullets) && i.bullets.some(Boolean))
  );
}

function hasStreetPulseSpotlight(raw: unknown): raw is StreetPulseSpotlight {
  if (!raw || typeof raw !== "object") return false;
  const s = raw as StreetPulseSpotlight;
  return Boolean(
    safeString(s.title) ||
      safeString(s.summary) ||
      (typeof s.keyPointsHtml === "string" && s.keyPointsHtml.replace(/<[^>]+>/g, "").trim())
  );
}

export default async function SpotlightsPage() {
  let snapshot: {
    id: string;
    period: string;
    stateSpotlightContent: unknown;
    institutionSpotlightContent: unknown;
    streetPulseSpotlightContent: unknown;
  } | null = null;

  try {
    snapshot = await db.snapshot.findFirst({
      where: { publishedAt: { not: null } },
      orderBy: { publishedAt: "desc" },
      select: {
        id: true,
        period: true,
        stateSpotlightContent: true,
        institutionSpotlightContent: true,
        streetPulseSpotlightContent: true,
      },
    });
  } catch {
    snapshot = null;
  }

  const stateSpot = (snapshot?.stateSpotlightContent ?? {
    state: "Lagos & Kano Corridors",
    keyPointsHtml: "<ul><li>Sub-national internally generated revenue (IGR) outperforming fiscal benchmarks.</li><li>Commercial transport resilience across urban axes.</li></ul>"
  }) as StateSpotlight;

  const instSpot = (snapshot?.institutionSpotlightContent ?? {
    institution: "Central Bank & Fiscal Authorities",
    summary: "Orthodox monetary frameworks and unified FX windows consolidating foreign currency reserves.",
    keyPointsHtml: "<ul><li>Gross external reserves maintaining import cover buffer.</li><li>Interbank settlement transparency monitored.</li></ul>"
  }) as InstitutionSpotlight;

  const streetPulseSpot = (snapshot?.streetPulseSpotlightContent ?? {
    title: "Urban Commerce Corridors",
    summary: "Citizens reporting resilient adaptation alongside demands for consumer staple price moderation.",
  }) as StreetPulseSpotlight;

  const showStateSpotlight = true;
  const showInstSpotlight = true;
  const showStreetPulse = true;

  return (
    <main className="relative min-h-[90vh] w-full pb-24 pt-16 text-slate-100 overflow-hidden">
      {/* Background Ambience */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute top-10 left-1/4 h-96 w-96 rounded-full bg-[#00f59b]/10 blur-[140px]" />
        <div className="absolute top-1/2 right-1/4 h-80 w-80 rounded-full bg-[#38bdf8]/8 blur-[120px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#00f59b08_1px,transparent_1px),linear-gradient(to_bottom,#00f59b08_1px,transparent_1px)] bg-[size:3.5rem_3.5rem]" />
      </div>

      <div className="mx-auto w-full max-w-7xl px-6">
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
                    REGIONAL OBSERVABILITY
                  </span>
                  <span className="rounded bg-[#38bdf8]/15 px-2 py-0.5 font-mono text-[10px] text-[#38bdf8] border border-[#38bdf8]/30">
                    36 STATES & FCT
                  </span>
                </div>
                <h1 className="mt-1 font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white">
                  Geopolitical Radar & Spotlights
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/survey"
                className="rounded-xl border border-[#00f59b] bg-[#00f59b] px-5 py-3 font-mono text-xs font-bold text-black shadow-[0_0_15px_rgba(0,245,155,0.3)] hover:bg-[#22ffb0] transition-all"
              >
                SUBMIT STATE PULSE →
              </Link>
            </div>
          </div>

          <p className="mt-6 max-w-2xl text-sm sm:text-base leading-relaxed text-slate-300">
            Interactive geopolitical surveillance tracking structural stability, security containment, 
            and commercial liquidity across all six geopolitical zones. Ground evidence, not endorsements.
          </p>
        </div>

        {/* 36-State Interactive Radar */}
        <div className="mt-12">
          <GeopoliticalRadar />
        </div>

        {/* Tri-Lens Spotlights */}
        <div className="mt-20">
          <div className="mb-6">
            <div className="font-mono text-xs font-bold uppercase tracking-wider text-[#00f59b]">
              CURRENT ISSUE DOSSIERS
            </div>
            <h2 className="mt-1 font-serif text-3xl font-bold text-white">
              Tri-Lens Empirical Spotlights
            </h2>
          </div>

          <SpotlightCard
            stateSpot={stateSpot}
            instSpot={instSpot}
            streetPulseSpot={streetPulseSpot}
            showState={showStateSpotlight}
            showInst={showInstSpotlight}
            showStreetPulse={showStreetPulse}
            reportHref={snapshot ? `/reports/${snapshot.id}` : "/reports"}
          />
        </div>

        {snapshot && (
          <div className="mt-12 text-center">
            <Link
              href={`/reports/${snapshot.id}`}
              className="inline-flex items-center gap-2 rounded-xl border border-[#00f59b]/40 bg-[#07190f] px-6 py-3 font-mono text-xs font-bold text-[#00f59b] hover:bg-[#00f59b] hover:text-black transition-all"
            >
              <span>ACCESS FULL {snapshot.period.toUpperCase()} INTELLIGENCE DOSSIER</span>
              <span>→</span>
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
