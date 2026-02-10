import type { Metadata } from "next";
import Link from "next/link";
import { db } from "@/lib/db";
import { defaultMetadata } from "@/lib/metadata";
import { SpotlightCard } from "@/components/public/SpotlightCard";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  ...defaultMetadata,
  title: "Spotlights",
  description:
    "State and Institution Spotlights from the Nigeria Stability Index. Evidence-based highlights — not endorsements.",
  openGraph: {
    ...defaultMetadata.openGraph,
    title: "Spotlights | Nigeria Stability Index",
    description:
      "State and Institution Spotlights from the Nigeria Stability Index.",
    url: `${defaultMetadata.metadataBase}spotlights`,
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

  const stateSpot = (snapshot?.stateSpotlightContent ?? {}) as StateSpotlight;
  const instSpot = (snapshot?.institutionSpotlightContent ??
    {}) as InstitutionSpotlight;
  const streetPulseSpot = (snapshot?.streetPulseSpotlightContent ?? {}) as StreetPulseSpotlight;

  const showStateSpotlight = hasStateSpotlight(snapshot?.stateSpotlightContent);
  const showInstSpotlight = hasInstitutionSpotlight(
    snapshot?.institutionSpotlightContent
  );
  const showStreetPulse = hasStreetPulseSpotlight(snapshot?.streetPulseSpotlightContent);

  return (
    <main className="w-full pb-20">
      <section className="relative overflow-hidden pt-20">
        <div className="mx-auto w-full max-w-7xl px-6">
          <div className="nsi-section-card px-8 py-10">
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/60 px-4 py-1.5 text-sm font-medium text-[color:var(--nsi-ink)] backdrop-blur-md">
                Spotlights
              </div>
              <h1 className="mt-6 font-serif text-4xl font-semibold tracking-tight text-[color:var(--nsi-ink)] lg:text-5xl">
                Evidence-based highlights
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-[color:var(--nsi-ink-soft)]">
                Each month we highlight a state and an institution based on
                evidence, not endorsement. Read the full context in the latest
                snapshot.
              </p>
              <p className="mt-3 text-sm italic text-[color:var(--nsi-ink-soft)]">
                Evidence-based spotlight. Not an endorsement.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto mt-20 w-full max-w-7xl px-6">
        <SpotlightCard
          stateSpot={stateSpot}
          instSpot={instSpot}
          streetPulseSpot={streetPulseSpot}
          showState={showStateSpotlight}
          showInst={showInstSpotlight}
          showStreetPulse={showStreetPulse}
          reportHref={snapshot ? `/reports/${snapshot.id}` : "/spotlights"}
        />
      </section>

      {snapshot ? (
        <div className="mx-auto mt-20 w-full max-w-7xl px-6 text-center">
          <Link
            href={`/reports/${snapshot.id}`}
            className="text-sm font-medium text-[color:var(--nsi-green)] hover:underline"
          >
            View {snapshot.period} full snapshot →
          </Link>
        </div>
      ) : (
        <div className="mx-auto mt-10 w-full max-w-7xl px-6 text-center text-sm text-[color:var(--nsi-ink-soft)]">
          <Link href="/reports" className="text-[color:var(--nsi-green)] hover:underline">
            Reports Archive
          </Link>
        </div>
      )}
    </main>
  );
}
