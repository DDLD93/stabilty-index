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
    <main className="w-full pb-20">
      <section className="relative overflow-hidden pt-20">
        <div className="mx-auto w-full max-w-7xl px-6">
          <div className="nsi-section-card px-8 py-12">
            <div className="absolute inset-0 -z-10 opacity-[0.12]">
              <Image
                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop"
                alt="Data Synthesis"
                fill
                className="object-cover"
              />
            </div>
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/60 px-4 py-1.5 text-sm font-medium text-[color:var(--nsi-ink)] backdrop-blur-md">
                Methodology
              </div>
              <h1 className="mt-6 font-serif text-4xl font-semibold tracking-tight text-[color:var(--nsi-ink)] lg:text-5xl">
                How NSI produces a monthly snapshot
              </h1>
              <p className="mt-5 max-w-3xl text-base leading-7 text-[color:var(--nsi-ink-soft)]">
                The Nigeria Stability Index runs in monthly cycles. We collect public
                signals and verified sources, review and validate inputs, then publish
                a stable snapshot on the 11th of each month. Here is how it works.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/reports"
                  className="inline-flex items-center rounded-xl bg-[color:var(--nsi-green)] px-6 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:brightness-110"
                >
                  View Reports Archive
                </Link>
                <Link
                  href="/about"
                  className="inline-flex items-center rounded-xl border border-black/10 bg-white/70 px-6 py-3 text-sm font-semibold text-[color:var(--nsi-ink)] backdrop-blur-sm transition-all hover:bg-white"
                >
                  About NSI
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto mt-12 grid w-full max-w-7xl gap-6 px-6 md:grid-cols-3">
        <div className="nsi-card-soft p-8">
          <div className="text-xs font-semibold uppercase tracking-wider text-[color:var(--nsi-ink-soft)]">
            Step 1
          </div>
          <h2 className="mt-2 font-serif text-2xl font-semibold tracking-tight text-[color:var(--nsi-ink)]">
            Collect public signals + verified sources
          </h2>
          <p className="mt-3 text-sm leading-6 text-[color:var(--nsi-ink-soft)]">
            We gather anonymous public check-ins (stability score, mood,
            one-word descriptor) and combine them with verified data sources
            across security, economy, governance, investor confidence, and
            social stability.
          </p>
        </div>
        <div className="nsi-card-soft p-8">
          <div className="text-xs font-semibold uppercase tracking-wider text-[color:var(--nsi-ink-soft)]">
            Step 2
          </div>
          <h2 className="mt-2 font-serif text-2xl font-semibold tracking-tight text-[color:var(--nsi-ink)]">
            Review + validation
          </h2>
          <p className="mt-3 text-sm leading-6 text-[color:var(--nsi-ink-soft)]">
            Inputs are reviewed, submissions can be flagged where appropriate,
            and the editorial team prepares the official snapshot narrative,
            pillar scores, and spotlights. No automated scoring alone — human
            review is part of the process.
          </p>
        </div>
        <div className="nsi-card-soft p-8">
          <div className="text-xs font-semibold uppercase tracking-wider text-[color:var(--nsi-ink-soft)]">
            Step 3
          </div>
          <h2 className="mt-2 font-serif text-2xl font-semibold tracking-tight text-[color:var(--nsi-ink)]">
            Publish monthly snapshot on the 11th
          </h2>
          <p className="mt-3 text-sm leading-6 text-[color:var(--nsi-ink-soft)]">
            The snapshot is published and becomes the public report. Once
            locked, it stays immutable. Each month we deliver a calm, stable
            pulse on how Nigeria is holding together.
          </p>
        </div>
      </section>

      <section className="mx-auto mt-20 w-full max-w-7xl px-6">
        <div className="nsi-card-soft p-8">
          <h2 className="font-serif text-xl font-semibold tracking-tight text-[color:var(--nsi-ink)]">
          How we measure
          </h2>
          <p className="mt-4 max-w-3xl text-sm leading-6 text-[color:var(--nsi-ink-soft)]">
            We use a mix of public check-ins and editorial analysis, summarized
            into an overall score (1–10) and five pillar scores with short
            narratives. We do not collect personal identifiers. Spotlights on
            states or institutions are evidence-based and are not endorsements.
          </p>
          <Link
            href="/reports"
            className="mt-6 inline-flex rounded-xl bg-[color:var(--nsi-green)] px-6 py-3 text-sm font-semibold text-white transition-all hover:brightness-110"
          >
            View Reports Archive
          </Link>
        </div>
      </section>
    </main>
  );
}
