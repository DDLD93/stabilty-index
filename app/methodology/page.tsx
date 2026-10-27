import Image from "next/image";
import type { Metadata } from "next";
import Link from "next/link";
import { defaultMetadata } from "@/lib/metadata";

export const metadata: Metadata = {
  ...defaultMetadata,
  title: "Methodology",
  description:
    "Learn how the Nigeria Stability Index works. NSI runs in monthly cycles: collect public signals and verified sources, review and validate, then publish a stable monthly snapshot on the 11th.",
  openGraph: {
    ...defaultMetadata.openGraph,
    title: "Methodology | Nigeria Stability Index",
    description:
      "How NSI works: collect public signals and verified sources, review and validate, publish monthly snapshot on the 11th.",
    url: `${defaultMetadata.metadataBase}methodology`,
  },
  alternates: {
    canonical: "/methodology",
  },
};

export default function MethodologyPage() {
  return (
    <main className="w-full pb-24">
      {/* Masthead */}
      <section className="border-b-2 border-[color:var(--nsi-ink)] bg-[color:var(--nsi-green-deep)] py-16 text-white lg:py-20">
        <div className="mx-auto w-full max-w-7xl px-6">
          <div className="grid items-center gap-12 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <p className="nsi-kicker-light">
                Analytical Framework · Research Methodology
              </p>
              <h1 className="mt-2 font-serif text-4xl font-bold leading-tight tracking-tight text-white lg:text-5xl">
                How NSI produces a monthly snapshot
              </h1>
              <p className="mt-5 max-w-2xl border-l-2 border-[color:var(--nsi-gold)] pl-5 text-base leading-relaxed text-white/80">
                The Nigeria Stability Index runs in structured monthly cycles.
                We collect anonymous public signals and verified institutional
                sources, review and validate inputs, then publish an immutable
                snapshot on the 11th of each month.
              </p>
              <div className="mt-8 flex flex-wrap gap-3.5">
                <Link href="/reports" className="btn-nsi-gold">
                  <span>View Reports Archive</span>
                  <span aria-hidden>→</span>
                </Link>
                <Link
                  href="/about"
                  className="inline-flex items-center gap-2 rounded-[3px] border border-white/25 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:border-white hover:bg-white/10"
                >
                  About NSI
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="relative aspect-[4/3] overflow-hidden rounded-[4px] border border-white/20 shadow-2xl">
                <Image
                  src="/images/nigeria-research-desk.jpg"
                  alt="Nigerian policy analysts synthesizing monthly stability indicators"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Three-Phase Cycle Architecture */}
      <section className="mx-auto mt-16 w-full max-w-7xl px-6">
        <div className="nsi-section-rule mb-8">
          <p className="nsi-kicker">01 / Monthly Production Cycle</p>
          <h2 className="mt-1 font-serif text-3xl font-bold text-[color:var(--nsi-ink)]">
            Three-Stage Verification &amp; Publication Protocol
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="nsi-section-card p-8">
            <div className="font-mono text-xs font-bold uppercase tracking-widest text-[color:var(--nsi-green)]">
              Step 1 · Signal Collection
            </div>
            <h3 className="mt-3 font-serif text-2xl font-bold tracking-tight text-[color:var(--nsi-ink)]">
              Collect public signals + verified sources
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-[color:var(--nsi-ink-soft)]">
              We gather anonymous public check-ins (pillar ratings, mood,
              one-word descriptor, and sub-national observations) and combine
              them with verified datasets across security, economy, governance,
              investor confidence, and social stability.
            </p>
          </div>

          <div className="nsi-section-card p-8">
            <div className="font-mono text-xs font-bold uppercase tracking-widest text-[color:var(--nsi-gold-deep)]">
              Step 2 · Editorial Synthesis
            </div>
            <h3 className="mt-3 font-serif text-2xl font-bold tracking-tight text-[color:var(--nsi-ink)]">
              Review + validation
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-[color:var(--nsi-ink-soft)]">
              Inputs are audited, anomalous submissions can be flagged, and the
              research team prepares the official snapshot narrative, pillar
              scores, and evidence spotlights. No automated scoring alone —
              human editorial review is integral to the process.
            </p>
          </div>

          <div className="nsi-section-card p-8">
            <div className="font-mono text-xs font-bold uppercase tracking-widest text-[color:var(--nsi-terracotta)]">
              Step 3 · Immutable Release
            </div>
            <h3 className="mt-3 font-serif text-2xl font-bold tracking-tight text-[color:var(--nsi-ink)]">
              Publish monthly snapshot on the 11th
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-[color:var(--nsi-ink-soft)]">
              The snapshot is published and becomes the official public report.
              Once locked, it remains permanently immutable in the archive —
              delivering a calm, longitudinal record of how Nigeria is holding
              together.
            </p>
          </div>
        </div>
      </section>

      {/* Calibration & Scoring Note */}
      <section className="mx-auto mt-16 w-full max-w-7xl px-6">
        <div className="overflow-hidden rounded-[4px] border border-[color:var(--nsi-rule-strong)] bg-white p-8 sm:p-10">
          <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-8">
              <span className="nsi-kicker">02 / Index Calibration</span>
              <h2 className="mt-2 font-serif text-2xl font-bold tracking-tight text-[color:var(--nsi-ink)] sm:text-3xl">
                How we measure &amp; protect respondent anonymity
              </h2>
              <p className="mt-4 text-sm leading-7 text-[color:var(--nsi-ink-soft)] sm:text-base">
                We use a disciplined combination of citizen check-ins and
                empirical research desk analysis, summarized into an overall
                score (1–10) and five pillar scores with short narratives. We do
                not collect personal identifiers. Spotlights on states or
                institutions are strictly evidence-based and are not
                endorsements.
              </p>
            </div>
            <div className="flex lg:col-span-4 lg:justify-end">
              <Link href="/reports" className="btn-nsi-primary">
                <span>View Reports Archive</span>
                <span aria-hidden>→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
