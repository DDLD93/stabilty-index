import type { Metadata } from "next";
import Link from "next/link";
import { db } from "@/lib/db";
import { defaultMetadata } from "@/lib/metadata";

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

type StateSpotlight = { state?: string; score?: number; bullets?: string[] };
type InstitutionSpotlight = {
  institution?: string;
  summary?: string;
  bullets?: string[];
};

function safeArray<T>(v: unknown): T[] {
  return Array.isArray(v) ? (v as T[]) : [];
}

function safeString(v: unknown): string {
  return typeof v === "string" && v.length > 0 ? v : "";
}

export default async function SpotlightsPage() {
  let snapshot: {
    id: string;
    period: string;
    stateSpotlightContent: unknown;
    institutionSpotlightContent: unknown;
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
      },
    });
  } catch {
    snapshot = null;
  }

  const stateSpot = (snapshot?.stateSpotlightContent ?? {}) as StateSpotlight;
  const instSpot = (snapshot?.institutionSpotlightContent ??
    {}) as InstitutionSpotlight;

  const stateTitle = safeString(stateSpot.state) || "State Spotlight";
  const stateSummary =
    safeArray<string>(stateSpot.bullets)?.[0] ||
    "Evidence-based highlight from our latest snapshot. Not an endorsement.";

  const instTitle =
    safeString(instSpot.institution) || "Institution Spotlight";
  const instSummary =
    safeString(instSpot.summary) ||
    safeArray<string>(instSpot.bullets)?.[0] ||
    "Evidence-based highlight from our latest snapshot. Not an endorsement.";

  const stateHref = snapshot
    ? `/reports/${snapshot.id}#state-spotlight`
    : "/reports";
  const instHref = snapshot
    ? `/reports/${snapshot.id}#institution-spotlight`
    : "/reports";

  return (
    <main className="mx-auto w-full max-w-7xl px-6 pb-14 pt-10">
      <section className="nsi-section-card rounded-[30px] px-8 py-9">
        <h1 className="font-serif text-4xl font-semibold tracking-tight text-[color:var(--nsi-ink)]">
          Spotlights
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-7 text-[color:var(--nsi-ink-soft)]">
          Each month we highlight a state and an institution based on
          evidence, not endorsement. Read the full context in the latest
          snapshot.
        </p>
        <p className="mt-3 text-sm italic text-[color:var(--nsi-ink-soft)]">
          Evidence-based spotlight. Not an endorsement.
        </p>
      </section>

      <section className="mt-10 grid gap-6 md:grid-cols-2">
        <div
          id="state-spotlight"
          className="nsi-card-solid rounded-[28px] p-8 scroll-mt-24"
        >
          <div className="text-xs font-semibold uppercase tracking-wider text-[color:var(--nsi-green)]">
            State Spotlight
          </div>
          <h2 className="mt-2 font-serif text-2xl font-semibold tracking-tight text-[color:var(--nsi-ink)]">
            {stateTitle}
          </h2>
          <p className="mt-3 text-sm leading-6 text-[color:var(--nsi-ink-soft)] line-clamp-2">
            {stateSummary}
          </p>
          <Link
            href={stateHref}
            className="mt-6 inline-flex rounded-lg bg-[color:var(--nsi-green)] px-5 py-2.5 text-sm font-semibold text-white transition-all hover:brightness-[1.08]"
          >
            Read Spotlight
          </Link>
        </div>

        <div
          id="institution-spotlight"
          className="nsi-card-solid rounded-[28px] p-8 scroll-mt-24"
        >
          <div className="text-xs font-semibold uppercase tracking-wider text-[color:var(--nsi-green)]">
            Institution Spotlight
          </div>
          <h2 className="mt-2 font-serif text-2xl font-semibold tracking-tight text-[color:var(--nsi-ink)]">
            {instTitle}
          </h2>
          <p className="mt-3 text-sm leading-6 text-[color:var(--nsi-ink-soft)] line-clamp-2">
            {instSummary}
          </p>
          <Link
            href={instHref}
            className="mt-6 inline-flex rounded-lg bg-[color:var(--nsi-green)] px-5 py-2.5 text-sm font-semibold text-white transition-all hover:brightness-[1.08]"
          >
            Read Spotlight
          </Link>
        </div>
      </section>

      {snapshot ? (
        <div className="mt-8 text-center">
          <Link
            href={`/reports/${snapshot.id}`}
            className="text-sm font-medium text-[color:var(--nsi-green)] hover:underline"
          >
            View {snapshot.period} full snapshot →
          </Link>
        </div>
      ) : (
        <div className="mt-8 text-center text-sm text-[color:var(--nsi-ink-soft)]">
          <Link href="/reports" className="text-[color:var(--nsi-green)] hover:underline">
            Reports Archive
          </Link>
        </div>
      )}
    </main>
  );
}
