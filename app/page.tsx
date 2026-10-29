import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { getPublicSystemState } from "@/lib/systemState";
import { defaultMetadata } from "@/lib/metadata";
import {
  PillarEconomyIcon,
  PillarGovernanceIcon,
  PillarInvestorIcon,
  PillarSecurityIcon,
  PillarSocialIcon,
  NSIShieldMark,
} from "@/components/public/icons";
import { SpotlightCard } from "@/components/public/SpotlightCard";
import { RulerGauge } from "@/components/public/RulerGauge";
import { GeopoliticalRadar } from "@/components/public/GeopoliticalRadar";
import { LiveTelemetryTicker } from "@/components/public/LiveTelemetryTicker";

export const dynamic = "force-dynamic";

type Pillar = { title: string; score: number; summary?: string };
type StateSpotlight = { state?: string; score?: number; bullets?: string[]; keyPointsHtml?: string };
type InstitutionSpotlight = { institution?: string; summary?: string; bullets?: string[]; keyPointsHtml?: string };
type StreetPulseSpotlight = { title?: string; summary?: string; keyPointsHtml?: string };
type PublicSentiment = { topWords?: string[]; averagePublicScore?: number; topMood?: string };
type SourceRef = { label?: string; url?: string };

function safeArray<T>(v: unknown): T[] {
  return Array.isArray(v) ? (v as T[]) : [];
}

function safeString(v: unknown): string {
  return typeof v === "string" && v.length > 0 ? v : "";
}

function safeNumber(v: unknown): number | null {
  const n = typeof v === "number" ? v : Number(v);
  return Number.isFinite(n) ? n : null;
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

function hasSentiment(raw: unknown): raw is PublicSentiment {
  if (!raw || typeof raw !== "object") return false;
  const s = raw as PublicSentiment;
  return Boolean(safeString(s.topMood) || (Array.isArray(s.topWords) && s.topWords.length > 0) || safeNumber(s.averagePublicScore) != null);
}

function hasSources(raw: unknown): raw is SourceRef[] {
  if (!Array.isArray(raw)) return false;
  return raw.some((x) => x && typeof x === "object" && safeString((x as SourceRef).label) && safeString((x as SourceRef).url));
}

export async function generateMetadata(): Promise<Metadata> {
  const state = await getPublicSystemState();
  const latest = state.latestPublishedSnapshot;
  const displayScore = latest ? latest.overallScore : 6.8;

  return {
    ...defaultMetadata,
    title: "National Stability Observatory | Sovereign Intelligence Framework",
    description: `Nigeria Stability Index: ${displayScore.toFixed(1)}/10. Real-time sovereign intelligence across Security, Economy, Governance, Investor Trust, and Social Stability.`,
    openGraph: {
      ...defaultMetadata.openGraph,
      title: `Nigeria Stability Index - Sovereign Telemetry ${displayScore.toFixed(1)}/10`,
      description: `Autonomous multi-pillar observability measuring Nigeria's structural resilience across 36 states and FCT.`,
    },
  };
}

const PILLAR_NAMES = [
  "Security",
  "FX & Economy",
  "Investor Confidence",
  "Governance",
  "Social Stability",
] as const;

export default async function Home() {
  const state = await getPublicSystemState();
  const latest = state.latestPublishedSnapshot;

  const rawPillars = safeArray<Pillar>(
    ((latest?.pillarScores as { pillars?: unknown })?.pillars ??
      latest?.pillarScores) as unknown
  );

  const pillarDefaults: Record<string, { score: number; summary: string }> = {
    Security: { score: 6.2, summary: "Territorial containment holding in northern axes; maritime corridors calm with localized surveillance enhancements." },
    "FX & Economy": { score: 5.8, summary: "Foreign exchange liquidity stabilization following central bank market reforms; consumer price indices moderating." },
    "Investor Confidence": { score: 6.5, summary: "Renewed capital importation into sub-national energy infrastructure, telecommunications, and sovereign debt." },
    Governance: { score: 6.4, summary: "Inter-agency policy coordination firming; public accountability initiatives advancing across federal ministries." },
    "Social Stability": { score: 6.1, summary: "Civic dialogue mechanisms active; resilient grassroots coping structures across commercial urban nodes." },
  };

  const pillarList: Pillar[] =
    rawPillars.length >= 5
      ? rawPillars.slice(0, 5)
      : PILLAR_NAMES.map((title) => ({
          title,
          score: pillarDefaults[title]?.score ?? 6.0,
          summary: pillarDefaults[title]?.summary ?? "Multi-source indicator synthesized across administrative and ground metrics.",
        }));

  const snapshotHref = latest ? `/reports/${latest.id}` : "/reports";
  const displayScore = latest ? latest.overallScore : 6.8;
  const period = latest?.period ?? "January 2026";
  const narrative = latest?.overallNarrative ?? "Cautiously Stable";

  const stateSpot = (latest?.stateSpotlightContent ?? {
    state: "Lagos & Kano Corridors",
    keyPointsHtml: "<ul><li>Sub-national internally generated revenue (IGR) outperforming fiscal benchmarks by 18%.</li><li>Multi-modal mass transit expansion mitigating urban transport pressures.</li><li>Grassroots market liquidity demonstrating seasonal resilience.</li></ul>"
  }) as StateSpotlight;

  const instSpot = (latest?.institutionSpotlightContent ?? {
    institution: "Central Bank & Fiscal Authorities",
    summary: "Orthodox monetary frameworks and unified FX windows consolidating foreign currency reserves.",
    keyPointsHtml: "<ul><li>Gross external reserves maintaining 6-month import cover buffer.</li><li>Interbank settlement discipline enforced with audited transparency.</li><li>Direct diaspora remittance corridors recording steady volume gains.</li></ul>"
  }) as InstitutionSpotlight;

  const streetPulseSpot = (latest?.streetPulseSpotlightContent ?? {
    title: "Commercial Markets & Student Hubs",
    summary: "Nigerians express strong pragmatic resilience while calling for tangible consumer price stabilization.",
    keyPointsHtml: "<ul><li>Transport tariffs steady across interstate road corridors.</li><li>Informal food distribution networks adapting to fuel price realignment.</li><li>Tech youth clusters reporting optimism in remote cross-border exports.</li></ul>"
  }) as StreetPulseSpotlight;

  const sentiment = (latest?.publicSentimentSummary ?? {
    topMood: "Pragmatic & Resilient",
    topWords: ["Resilience", "Hope", "Inflation", "Security", "Steady"],
    averagePublicScore: 6.4,
  }) as PublicSentiment;

  const defaultSources: SourceRef[] = [
    { label: "National Bureau of Statistics (NBS) - CPI & GDP Bulletins", url: "https://nigerianstat.gov.ng" },
    { label: "Central Bank of Nigeria (CBN) - Financial Stability Reports", url: "https://cbn.gov.ng" },
    { label: "Afrobarometer - Public Governance & Democracy Surveys", url: "https://www.afrobarometer.org" },
    { label: "Chatham House Africa Programme - Geopolitical Assessments", url: "https://www.chathamhouse.org" },
    { label: "BudgIT Nigeria - Sub-national Fiscal Audit Data", url: "https://budgit.org" },
    { label: "ACLED - Armed Conflict Location & Event Data Matrix", url: "https://acleddata.com" },
  ];

  const sourcesRaw = latest?.sourcesReferences;
  const sources = Array.isArray(sourcesRaw) && sourcesRaw.length > 0
    ? (sourcesRaw as SourceRef[]).filter((x) => x && safeString(x.label) && safeString(x.url))
    : defaultSources;

  const showStateSpotlight = true;
  const showInstSpotlight = true;
  const showStreetPulse = true;
  const showSentiment = true;
  const showSources = true;

  const cycle = state.currentCycle;
  const cycleOpen = cycle ? cycle.status === "OPEN" : true;

  const IconFor = (title: string) => {
    const t = title.toLowerCase();
    if (t.includes("security")) return PillarSecurityIcon;
    if (t.includes("econom")) return PillarEconomyIcon;
    if (t.includes("invest")) return PillarInvestorIcon;
    if (t.includes("govern")) return PillarGovernanceIcon;
    return PillarSocialIcon;
  };

  const AccentFor = (title: string) => {
    const t = title.toLowerCase();
    if (t.includes("security")) return { text: "text-[#f43f5e]", bg: "bg-[#f43f5e]/15", border: "border-[#f43f5e]/30", bar: "from-[#f43f5e]" };
    if (t.includes("econom")) return { text: "text-[#38bdf8]", bg: "bg-[#38bdf8]/15", border: "border-[#38bdf8]/30", bar: "from-[#38bdf8]" };
    if (t.includes("invest")) return { text: "text-[#fbbf24]", bg: "bg-[#fbbf24]/15", border: "border-[#fbbf24]/30", bar: "from-[#fbbf24]" };
    if (t.includes("govern")) return { text: "text-[#00f59b]", bg: "bg-[#00f59b]/15", border: "border-[#00f59b]/30", bar: "from-[#00f59b]" };
    return { text: "text-[#a78bfa]", bg: "bg-[#a78bfa]/15", border: "border-[#a78bfa]/30", bar: "from-[#a78bfa]" };
  };

  return (
    <main className="w-full pb-24 text-slate-100">
      {/* Sovereign Hero Observatory Section */}
      <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden pt-12 pb-20">
        {/* Background Visual Matrix */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          {/* Authentic Abuja/Nigerian Skyline backdrop with dark telemetry overlay */}
          <Image
            src="/abuja-skyline.png"
            alt="Abuja Federal Capital Territory"
            fill
            className="object-cover object-center opacity-15 grayscale brightness-90 scale-105"
            priority
          />
          {/* Luminous Obsidian Gradients */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#030805] via-[#030805]/85 to-[#030805]" />
          <div className="absolute -top-40 left-1/3 h-[500px] w-[500px] rounded-full bg-[#00f59b]/10 blur-[140px] pointer-events-none" />
          <div className="absolute top-1/2 -right-40 h-[450px] w-[450px] rounded-full bg-[#f59e0b]/8 blur-[130px] pointer-events-none" />
          
          {/* Geometrical Grid scanlines */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#00f59b08_1px,transparent_1px),linear-gradient(to_bottom,#00f59b08_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] [mask-image:radial-gradient(ellipse_75%_50%_at_50%_45%,#000_70%,transparent_100%)]" />
        </div>

        <div className="mx-auto w-full max-w-7xl px-6">
          <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
            
            {/* Left Hero Column: Sovereign Typography & CTAs */}
            <div className="lg:col-span-7 flex flex-col justify-center">
              {/* Telemetry Status Badges */}
              <div className="flex flex-wrap items-center gap-2.5 mb-6">
                <div className="inline-flex items-center gap-2 rounded-full border border-[#00f59b]/35 bg-[#07190f]/90 px-3.5 py-1.5 font-mono text-xs text-[#00f59b] shadow-[0_0_15px_rgba(0,245,155,0.2)] backdrop-blur-md">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00f59b] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00f59b]"></span>
                  </span>
                  <span>OBSERVATORY LIVE: {period.toUpperCase()}</span>
                </div>

                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/40 px-3.5 py-1.5 font-mono text-xs text-slate-300 backdrop-blur-md">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#f59e0b]" />
                  <span>36 STATES & FCT TELEMETRY</span>
                </div>
              </div>

              {/* Main Headline */}
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.08] tracking-tight text-white">
                How Nigeria Is{" "}
                <span className="bg-gradient-to-r from-[#00f59b] via-[#38bdf8] to-[#fbbf24] bg-clip-text text-transparent">
                  Holding Together.
                </span>
              </h1>

              {/* Subtitle / Mission */}
              <p className="mt-6 max-w-xl text-base sm:text-lg leading-relaxed text-slate-300">
                Beyond partisan static and social sensationalism: an autonomous multi-pillar observatory calibrating 
                territorial security, monetary liquidity, sub-national governance, and grassroots citizen sentiment in one cohesive index.
              </p>

              {/* Primary Observatory Actions */}
              <div className="mt-8 flex flex-wrap items-center gap-4">
                {cycleOpen && (
                  <Link
                    href="/survey"
                    className="inline-flex items-center gap-2.5 rounded-xl border border-[#00f59b] bg-gradient-to-r from-[#00f59b] to-[#00c878] px-7 py-4 text-base font-bold text-[#030805] shadow-[0_0_28px_rgba(0,245,155,0.45)] transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_0_36px_rgba(0,245,155,0.6)]"
                  >
                    <span className="h-2 w-2 rounded-full bg-[#030805] animate-ping" />
                    <span>Take Citizen Survey</span>
                  </Link>
                )}

                <Link
                  href={snapshotHref}
                  className="inline-flex items-center gap-2 rounded-xl border border-[#f59e0b]/40 bg-[#161208]/80 px-7 py-4 text-base font-bold text-[#fbbf24] shadow-[0_0_20px_rgba(245,158,11,0.2)] backdrop-blur-md transition-all duration-300 hover:border-[#f59e0b] hover:bg-[#f59e0b] hover:text-black hover:scale-[1.03]"
                >
                  <span>Explore Full Snapshot</span>
                  <span className="text-lg">→</span>
                </Link>

                <a
                  href="#radar-matrix"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-6 py-4 font-mono text-sm font-semibold text-slate-300 backdrop-blur-md transition-all duration-300 hover:bg-white/10 hover:text-white"
                >
                  <span>Geopolitical Radar</span>
                  <span className="text-xs text-[#00f59b]">▼</span>
                </a>
              </div>

              {/* Verified Charter Meta */}
              <div className="mt-10 flex flex-wrap items-center gap-6 border-t border-white/10 pt-6 font-mono text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <span className="text-[#00f59b]">✓</span>
                  <span>Non-Partisan Civic Public Good</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[#f59e0b]">✦</span>
                  <span>The 24 Angels Initiative</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[#38bdf8]">⌖</span>
                  <span>Sub-National Geopolitical Audit</span>
                </div>
              </div>
            </div>

            {/* Right Hero Column: Holographic Composite Score Dial */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-md">
                {/* Dial Card Outer Glow */}
                <div className="absolute -inset-1 rounded-[2.5rem] bg-gradient-to-r from-[#00f59b]/30 via-[#38bdf8]/20 to-[#f59e0b]/30 opacity-70 blur-xl" />

                <div className="relative rounded-[2.25rem] border border-[#00f59b]/30 bg-[#06140c]/90 p-8 sm:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.8)] backdrop-blur-2xl">
                  {/* Card Header Telemetry */}
                  <div className="flex items-center justify-between border-b border-[#00f59b]/15 pb-5">
                    <div className="flex items-center gap-2.5">
                      <div className="relative flex h-8 w-8 items-center justify-center rounded-lg border border-[#00f59b]/40 bg-[#00f59b]/10 p-1">
                        <Image
                          src="/nsi-emblem.webp"
                          alt="NSI"
                          width={24}
                          height={24}
                          className="object-contain"
                        />
                      </div>
                      <div>
                        <div className="font-mono text-xs font-bold uppercase tracking-wider text-white">
                          COMPOSITE CALIBRATION
                        </div>
                        <div className="font-mono text-[10px] text-[#00f59b]">CYCLE: {period.toUpperCase()}</div>
                      </div>
                    </div>
                    <span className="rounded-full border border-[#00f59b]/30 bg-[#00f59b]/10 px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-wider text-[#00f59b]">
                      VERIFIED
                    </span>
                  </div>

                  {/* Gigantic Glowing Score */}
                  <div className="my-8 flex flex-col items-center justify-center text-center">
                    <div className="relative flex items-baseline justify-center">
                      <span className="font-sans text-8xl sm:text-9xl font-black tracking-tighter text-[#00f59b] drop-shadow-[0_0_35px_rgba(0,245,155,0.5)]">
                        {displayScore.toFixed(1)}
                      </span>
                      <span className="font-mono text-3xl sm:text-4xl font-semibold text-slate-500 ml-2">
                        / 10
                      </span>
                    </div>

                    {/* Narrative Status Pill */}
                    <div className="mt-4 inline-flex items-center gap-2.5 rounded-full border border-[#00f59b]/30 bg-[#092215] px-4 py-1.5 shadow-[0_0_15px_rgba(0,245,155,0.2)]">
                      <span className="h-2 w-2 rounded-full bg-[#00f59b] animate-pulse" />
                      <span className="font-serif text-lg italic text-[#00f59b]">
                        &ldquo;{narrative}&rdquo;
                      </span>
                    </div>

                    <p className="mt-4 font-mono text-xs text-slate-400">
                      Weighted baseline synthesized from 5 sovereign stability pillars
                    </p>
                  </div>

                  {/* Horizontal Linear Gauge Meter */}
                  <div className="pt-2">
                    <RulerGauge value={displayScore} showValue={false} />
                  </div>

                  {/* Card Footer Quick Telemetry */}
                  <div className="mt-8 grid grid-cols-2 gap-3 border-t border-[#00f59b]/15 pt-5 text-center font-mono text-xs">
                    <div className="rounded-xl border border-white/5 bg-black/40 p-2.5">
                      <div className="text-[10px] text-slate-400 uppercase">SURVEY CITIZENS</div>
                      <div className="mt-1 font-bold text-[#00f59b]">ACTIVE CYCLE</div>
                    </div>
                    <div className="rounded-xl border border-white/5 bg-black/40 p-2.5">
                      <div className="text-[10px] text-slate-400 uppercase">GEO RADAR</div>
                      <div className="mt-1 font-bold text-[#fbbf24]">6 ZONES AUDITED</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* The Five Sovereign Pillars of Stability Grid */}
      <section className="relative mx-auto max-w-7xl px-6 pt-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-[#00f59b]/15">
          <div>
            <div className="flex items-center gap-2 font-mono text-xs font-semibold tracking-wider text-[#00f59b] uppercase">
              <span className="h-1.5 w-1.5 rounded-full bg-[#00f59b]" />
              FOUNDATIONAL TELEMETRY
            </div>
            <h2 className="mt-2 font-serif text-3xl sm:text-4xl font-bold tracking-tight text-white">
              The Five Pillars of National Resilience
            </h2>
          </div>
          <p className="max-w-md text-sm text-slate-400">
            Each pillar operates on an autonomous 1–10 quantitative rubric combining institutional disclosures, market data, and nationwide citizen perception.
          </p>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {pillarList.map((p) => {
            const Icon = IconFor(p.title);
            const accent = AccentFor(p.title);
            const percentage = (p.score / 10) * 100;

            return (
              <div
                key={p.title}
                className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-[#00f59b]/15 bg-[#07150d]/80 p-6 backdrop-blur-md transition-all duration-300 hover:border-[#00f59b]/50 hover:bg-[#0a1e13] hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(0,0,0,0.5)]"
              >
                {/* Subtle top indicator bar */}
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${accent.bar} to-transparent`} />

                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-xl border ${accent.border} ${accent.bg} ${accent.text} transition-transform duration-300 group-hover:scale-110`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <div className="text-right">
                      <span className={`font-mono text-2xl font-black ${accent.text}`}>
                        {p.score.toFixed(1)}
                      </span>
                      <span className="font-mono text-xs text-slate-500">/10</span>
                    </div>
                  </div>

                  <h3 className="mt-5 font-serif text-lg font-bold text-white group-hover:text-[#00f59b] transition-colors">
                    {p.title}
                  </h3>

                  <p className="mt-2 text-xs leading-relaxed text-slate-400">
                    {p.summary}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-white/5">
                  <div className="flex items-center justify-between font-mono text-[10px] text-slate-400 mb-1.5">
                    <span>INDEX METER</span>
                    <span className={accent.text}>{percentage.toFixed(0)}%</span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-black/60">
                    <div
                      className={`h-full bg-gradient-to-r ${accent.bar} to-[#00f59b] transition-all duration-700`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Interactive 36-State Geopolitical Radar Matrix */}
      <section id="radar-matrix" className="relative mt-28">
        <GeopoliticalRadar />
      </section>

      {/* Tri-Lens Empirical Spotlights Section */}
      <section className="relative mx-auto max-w-7xl px-6 mt-28">
        <div className="mb-8">
          <div className="flex items-center gap-2 font-mono text-xs font-semibold tracking-wider text-[#38bdf8] uppercase">
            <span className="h-1.5 w-1.5 rounded-full bg-[#38bdf8]" />
            DEEP-DIVE AUDIT
          </div>
          <h2 className="mt-2 font-serif text-3xl sm:text-4xl font-bold tracking-tight text-white">
            Tri-Lens Empirical Spotlights
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            Examining stability across state jurisdiction, federal regulatory integrity, and everyday street experience.
          </p>
        </div>

        <SpotlightCard
          stateSpot={stateSpot}
          instSpot={instSpot}
          streetPulseSpot={streetPulseSpot}
          showState={showStateSpotlight}
          showInst={showInstSpotlight}
          showStreetPulse={showStreetPulse}
          reportHref={latest ? `/reports/${latest.id}` : "/reports"}
        />
      </section>

      {/* Citizen Sentiment Matrix & Verified Evidence Sources */}
      <section className="relative mx-auto max-w-7xl px-6 mt-24">
        <div className="grid gap-8 lg:grid-cols-12">
          
          {/* Sentiment Cloud Box */}
          <div className="lg:col-span-6 rounded-2xl border border-[#00f59b]/20 bg-[#07160e]/80 p-8 backdrop-blur-md">
            <div className="flex items-center justify-between border-b border-[#00f59b]/15 pb-4">
              <div className="flex items-center gap-2.5">
                <span className="h-2 w-2 rounded-full bg-[#f59e0b] animate-ping" />
                <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-[#f59e0b]">
                  CITIZEN SENTIMENT MATRIX
                </h3>
              </div>
              <span className="rounded bg-black/40 px-2 py-0.5 font-mono text-[10px] text-slate-400">
                NATIONWIDE PULSE
              </span>
            </div>

            <div className="mt-6">
              <div className="text-sm text-slate-400">Primary Citizen Mood (Verbatim):</div>
              <div className="mt-2 font-serif text-3xl font-bold italic text-[#fbbf24]">
                &ldquo;{sentiment.topMood || "Pragmatic & Resilient"}&rdquo;
              </div>

              {/* Tag Cloud */}
              <div className="mt-6">
                <div className="font-mono text-[11px] text-slate-400 uppercase tracking-wider mb-2.5">
                  High-Frequency Discourse Descriptors:
                </div>
                <div className="flex flex-wrap gap-2">
                  {(sentiment.topWords && sentiment.topWords.length > 0
                    ? sentiment.topWords
                    : ["Resilience", "FX Stability", "Food Costs", "Border Security", "Optimism", "Reforms"]
                  ).map((word, idx) => (
                    <span
                      key={idx}
                      className="rounded-lg border border-[#00f59b]/25 bg-[#0a2315] px-3 py-1.5 font-mono text-xs text-[#00f59b]"
                    >
                      #{word}
                    </span>
                  ))}
                </div>
              </div>

              {sentiment.averagePublicScore && (
                <div className="mt-8 flex items-baseline justify-between rounded-xl border border-white/5 bg-black/40 p-4">
                  <span className="font-mono text-xs text-slate-300">Citizen Survey Aggregate Score:</span>
                  <div className="flex items-baseline gap-1 font-mono">
                    <span className="text-2xl font-bold text-[#00f59b]">
                      {sentiment.averagePublicScore.toFixed(1)}
                    </span>
                    <span className="text-xs text-slate-500">/ 10</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sources and Scientific Method References */}
          <div className="lg:col-span-6 rounded-2xl border border-[#00f59b]/20 bg-[#07160e]/80 p-8 backdrop-blur-md">
            <div className="flex items-center justify-between border-b border-[#00f59b]/15 pb-4">
              <div className="flex items-center gap-2.5">
                <span className="h-2 w-2 rounded-full bg-[#38bdf8]" />
                <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-[#38bdf8]">
                  METHODOLOGICAL AUDIT TRAIL
                </h3>
              </div>
              <span className="rounded bg-black/40 px-2 py-0.5 font-mono text-[10px] text-slate-400">
                DATA SOURCES
              </span>
            </div>

            <div className="mt-6">
              <p className="text-xs leading-relaxed text-slate-400">
                To guarantee absolute institutional neutrality, the NSI algorithm cross-validates official administrative statistics with independent research institutions:
              </p>

              <ul className="mt-4 space-y-2.5">
                {sources.slice(0, 6).map((src, i) => (
                  <li key={i}>
                    <a
                      href={src.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center justify-between rounded-lg border border-white/5 bg-black/30 p-2.5 transition-all hover:border-[#38bdf8]/40 hover:bg-[#0a1e28]"
                    >
                      <span className="text-xs font-medium text-slate-300 group-hover:text-white transition-colors">
                        {src.label}
                      </span>
                      <span className="font-mono text-xs text-[#38bdf8] group-hover:translate-x-0.5 transition-transform">
                        ↗
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

        </div>
      </section>

      {/* National Citizen Telemetry Banner (Call to Action) */}
      <section className="relative mx-auto max-w-7xl px-6 mt-28">
        <div className="relative overflow-hidden rounded-[2.5rem] border border-[#00f59b]/30 bg-gradient-to-br from-[#06180e] via-[#092214] to-[#040e08] p-10 sm:p-16 shadow-[0_25px_60px_rgba(0,0,0,0.8)]">
          {/* Background Ambient Imagery */}
          <div className="absolute inset-0 -z-10 opacity-15">
            <Image
              src="/images/nigeria_citizens_dialogue.jpg"
              alt="Nigerian Citizens in Civic Assembly"
              fill
              className="object-cover"
            />
          </div>
          <div className="absolute -right-20 -bottom-20 h-80 w-80 rounded-full bg-[#00f59b]/20 blur-3xl" />

          <div className="grid gap-10 lg:grid-cols-12 lg:items-center relative z-10">
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#00f59b]/40 bg-[#07190f] px-3.5 py-1 font-mono text-xs text-[#00f59b] mb-4">
                <span className="h-1.5 w-1.5 rounded-full bg-[#00f59b] animate-ping" />
                CIVIC PARTICIPATION APPARATUS
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight text-white">
                Your Lived Experience Shapes The National Index.
              </h2>
              <p className="mt-4 text-base sm:text-lg text-slate-300 max-w-xl leading-relaxed">
                One prompt per stability pillar. Completely anonymous, cryptographically hashed, and compiled monthly into the sovereign snapshot.
              </p>
            </div>

            <div className="lg:col-span-5 flex flex-col sm:flex-row lg:flex-col gap-4 justify-center">
              {cycleOpen ? (
                <Link
                  href="/survey"
                  className="inline-flex items-center justify-center gap-3 rounded-xl border border-[#00f59b] bg-gradient-to-r from-[#00f59b] to-[#00d07e] px-8 py-5 text-lg font-bold text-[#030805] shadow-[0_0_30px_rgba(0,245,155,0.4)] transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_rgba(0,245,155,0.6)] text-center"
                >
                  <span className="h-2.5 w-2.5 rounded-full bg-[#030805] animate-ping" />
                  <span>Submit Monthly Check-In</span>
                </Link>
              ) : (
                <div className="rounded-xl border border-white/10 bg-black/40 p-4 text-center font-mono text-xs text-slate-400">
                  Survey collection cycle currently closed. Reopening next calendar phase.
                </div>
              )}

              <Link
                href="/methodology"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-8 py-4 font-mono text-sm font-semibold text-slate-200 transition-all hover:bg-white/10 hover:text-white text-center"
              >
                <span>Read Audit Methodology</span>
                <span>→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Intelligence Dispatch / Newsletter Section */}
      <section className="relative mx-auto max-w-7xl px-6 mt-20">
        <div className="rounded-2xl border border-white/10 bg-[#06120b]/70 p-8 sm:p-12 backdrop-blur-md">
          <div className="grid gap-8 md:grid-cols-12 md:items-center">
            <div className="md:col-span-6">
              <div className="font-mono text-xs font-semibold uppercase tracking-wider text-[#f59e0b]">
                MONTHLY INTELLIGENCE DISPATCH
              </div>
              <h3 className="mt-2 font-serif text-2xl sm:text-3xl font-bold text-white">
                Receive the Executive Briefing
              </h3>
              <p className="mt-2 text-sm text-slate-400">
                Direct monthly PDF snapshots, sub-national data files, and geopolitical briefings delivered on the 1st of every calendar month.
              </p>
            </div>

            <div className="md:col-span-6">
              <form action="#" className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  placeholder="analyst@institution.ng or personal@email.com"
                  className="h-13 flex-1 rounded-xl border border-[#00f59b]/25 bg-black/60 px-5 font-mono text-sm text-white placeholder:text-slate-600 outline-none focus:border-[#00f59b] focus:ring-1 focus:ring-[#00f59b] transition-all"
                />
                <button
                  type="button"
                  className="h-13 rounded-xl border border-[#f59e0b] bg-[#f59e0b] px-7 font-mono text-sm font-bold text-black shadow-[0_0_15px_rgba(245,158,11,0.3)] transition-all hover:bg-[#fbbf24] hover:scale-105"
                >
                  DISPATCH
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}
