import Image from "next/image";
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

type StateSpotlight = {
  state?: string;
  score?: number;
  bullets?: string[];
  keyPointsHtml?: string;
};
type InstitutionSpotlight = {
  institution?: string;
  summary?: string;
  bullets?: string[];
  keyPointsHtml?: string;
};
type StreetPulseSpotlight = {
  title?: string;
  summary?: string;
  keyPointsHtml?: string;
};

function safeString(v: unknown): string {
  return typeof v === "string" && v.length > 0 ? v : "";
}

function hasStateSpotlight(raw: unknown): raw is StateSpotlight {
  if (!raw || typeof raw !== "object") return false;
  const s = raw as StateSpotlight;
  return Boolean(
    safeString(s.state) ||
      (typeof s.keyPointsHtml === "string" &&
        s.keyPointsHtml.replace(/<[^>]+>/g, "").trim()) ||
      (Array.isArray(s.bullets) && s.bullets.some(Boolean))
  );
}

function hasInstitutionSpotlight(raw: unknown): raw is InstitutionSpotlight {
  if (!raw || typeof raw !== "object") return false;
  const i = raw as InstitutionSpotlight;
  return Boolean(
    safeString(i.institution) ||
      safeString(i.summary) ||
      (typeof i.keyPointsHtml === "string" &&
        i.keyPointsHtml.replace(/<[^>]+>/g, "").trim()) ||
      (Array.isArray(i.bullets) && i.bullets.some(Boolean))
  );
}

function hasStreetPulseSpotlight(raw: unknown): raw is StreetPulseSpotlight {
  if (!raw || typeof raw !== "object") return false;
  const s = raw as StreetPulseSpotlight;
  return Boolean(
    safeString(s.title) ||
      safeString(s.summary) ||
      (typeof s.keyPointsHtml === "string" &&
        s.keyPointsHtml.replace(/<[^>]+>/g, "").trim())
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
  const streetPulseSpot = (snapshot?.streetPulseSpotlightContent ??
    {}) as StreetPulseSpotlight;

  const showStateSpotlight = hasStateSpotlight(snapshot?.stateSpotlightContent);
  const showInstSpotlight = hasInstitutionSpotlight(
    snapshot?.institutionSpotlightContent
  );
  const showStreetPulse = hasStreetPulseSpotlight(
    snapshot?.streetPulseSpotlightContent
  );

  return (
    <main className="w-full pb-24">
      {/* Institutional Masthead */}
      <section className="border-b-2 border-[color:var(--nsi-ink)] bg-[color:var(--nsi-green-deep)] py-16 text-white">
        <div className="mx-auto w-full max-w-7xl px-6">
          <div className="grid items-center gap-10 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <p className="nsi-kicker-light">
                Empirical Dossiers · Sub-National &amp; Institutional
              </p>
              <h1 className="mt-2 font-serif text-4xl font-bold tracking-tight text-white lg:text-5xl">
                Evidence-Based Highlights
              </h1>
              <p className="mt-5 max-w-2xl border-l-2 border-[color:var(--nsi-gold)] pl-5 text-base leading-relaxed text-white/80">
                Each month we highlight a Nigerian state, a public institution,
                and an on-ground street pulse based on empirical evidence and
                citizen check-ins — never political endorsement.
              </p>
              <p className="mt-4 font-mono text-xs uppercase tracking-widest text-[color:var(--nsi-gold-light)]">
                Evidence-based spotlight · Not an endorsement
              </p>
            </div>

            <div className="lg:col-span-5">
              <div className="relative aspect-[16/10] overflow-hidden rounded-[4px] border border-white/20 shadow-xl">
                <Image
                  src="/images/nigeria-street-pulse.jpg"
                  alt="Everyday urban commercial life in Lagos, Nigeria"
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-[#04170e] via-[#04170e]/75 to-transparent p-3.5">
                  <span className="font-mono text-[0.65rem] uppercase tracking-wider text-white/85">
                    Field Monitoring · Commercial &amp; Civic Corridors
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto mt-14 w-full max-w-7xl px-6">
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

      <div className="mx-auto mt-12 flex w-full max-w-7xl justify-center px-6">
        {snapshot ? (
          <Link
            href={`/reports/${snapshot.id}`}
            className="btn-nsi-primary"
          >
            <span>View {snapshot.period} Full Snapshot Report</span>
            <span aria-hidden>→</span>
          </Link>
        ) : (
          <Link href="/reports" className="btn-nsi-outline">
            Browse Reports Archive →
          </Link>
        )}
      </div>
    </main>
  );
}
