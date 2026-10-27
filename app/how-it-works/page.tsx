import type { Metadata } from "next";
import Link from "next/link";
import { defaultMetadata } from "@/lib/metadata";

export const metadata: Metadata = {
  ...defaultMetadata,
  title: "How It Works",
  description:
    "Learn how the Nigeria Stability Index works. NSI runs in monthly cycles: collect anonymous public sentiment, process inputs, then publish stable snapshots tracking Nigeria's stability.",
  openGraph: {
    ...defaultMetadata.openGraph,
    title: "How Nigeria Stability Index Works",
    description:
      "Learn how NSI runs in monthly cycles: collect anonymous public sentiment, process inputs, then publish stable snapshots.",
    url: `${defaultMetadata.metadataBase}how-it-works`,
  },
  alternates: {
    canonical: "/how-it-works",
  },
};

export default function HowItWorksPage() {
  return (
    <main className="w-full pb-24">
      <section className="border-b-2 border-[color:var(--nsi-ink)] bg-[color:var(--nsi-green-deep)] py-16 text-white">
        <div className="mx-auto w-full max-w-7xl px-6">
          <p className="nsi-kicker-light">Operational Workflow · How It Works</p>
          <h1 className="mt-2 font-serif text-4xl font-bold tracking-tight text-white lg:text-5xl">
            From public signal to stable snapshot
          </h1>
          <p className="mt-5 max-w-3xl border-l-2 border-[color:var(--nsi-gold)] pl-5 text-base leading-relaxed text-white/80">
            NSI runs in disciplined monthly cycles: we collect anonymous public
            sentiment across all five stability pillars, close collection to
            verify and synthesize inputs, then publish a snapshot that remains
            immutable once locked.
          </p>
        </div>
      </section>

      <section className="mx-auto mt-16 grid w-full max-w-7xl gap-6 px-6 md:grid-cols-3">
        <div className="nsi-section-card p-8">
          <div className="font-mono text-xs font-bold uppercase tracking-widest text-[color:var(--nsi-green)]">
            1) Collection
          </div>
          <h2 className="mt-3 font-serif text-2xl font-bold tracking-tight text-[color:var(--nsi-ink)]">
            Public check-in
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-[color:var(--nsi-ink-soft)]">
            Citizens share a 1–5 rating per pillar (or 1–10 overall stability
            score), a mood indicator, a one-word descriptor, and optional state
            spotlight observations.
          </p>
        </div>

        <div className="nsi-section-card p-8">
          <div className="font-mono text-xs font-bold uppercase tracking-widest text-[color:var(--nsi-gold-deep)]">
            2) Processing
          </div>
          <h2 className="mt-3 font-serif text-2xl font-bold tracking-tight text-[color:var(--nsi-ink)]">
            Review and synthesis
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-[color:var(--nsi-ink-soft)]">
            Analysts review submissions, flag anomalous entries, and synthesize
            citizen sentiment alongside empirical macro and security indicators.
          </p>
        </div>

        <div className="nsi-section-card p-8">
          <div className="font-mono text-xs font-bold uppercase tracking-widest text-[color:var(--nsi-terracotta)]">
            3) Publication
          </div>
          <h2 className="mt-3 font-serif text-2xl font-bold tracking-tight text-[color:var(--nsi-ink)]">
            Publish and lock
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-[color:var(--nsi-ink-soft)]">
            When published on the 11th, the snapshot becomes the public report.
            Locking makes the snapshot permanently immutable in our archive.
          </p>
        </div>
      </section>

      <div className="mx-auto mt-12 flex max-w-7xl flex-wrap gap-4 px-6">
        <Link href="/survey" className="btn-nsi-primary">
          Take the Survey →
        </Link>
        <Link href="/methodology" className="btn-nsi-outline">
          Read Full Methodology
        </Link>
      </div>
    </main>
  );
}
