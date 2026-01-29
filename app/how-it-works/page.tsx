import type { Metadata } from "next";
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
    <main className="w-full pb-20">
      <section className="relative overflow-hidden pt-16">
        <div className="mx-auto w-full max-w-7xl px-6">
          <div className="nsi-section-card px-8 py-10">
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/60 px-4 py-1.5 text-sm font-medium text-[color:var(--nsi-ink)] backdrop-blur-md">
                How it works
              </div>
              <h1 className="mt-6 font-serif text-4xl font-semibold tracking-tight text-[color:var(--nsi-ink)] lg:text-5xl">
                From public signal to stable snapshot
              </h1>
              <p className="mt-5 max-w-3xl text-base leading-7 text-[color:var(--nsi-ink-soft)]">
                NSI runs in monthly cycles: we collect anonymous public sentiment, close collection to process inputs, then
                publish a snapshot that stays stable once locked.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto mt-12 grid w-full max-w-7xl gap-6 px-6 md:grid-cols-3">
        <div className="nsi-card-soft p-8">
          <div className="text-xs font-semibold uppercase tracking-wider text-[color:var(--nsi-ink-soft)]">
            1) Collection
          </div>
          <h2 className="mt-2 font-serif text-2xl font-semibold tracking-tight text-[color:var(--nsi-ink)]">
            Public check-in
          </h2>
          <p className="mt-3 text-sm leading-6 text-[color:var(--nsi-ink-soft)]">
            Visitors share a 1–10 stability score, a mood, a one-word descriptor, and optionally a state spotlight.
          </p>
        </div>
        <div className="nsi-card-soft p-8">
          <div className="text-xs font-semibold uppercase tracking-wider text-[color:var(--nsi-ink-soft)]">
            2) Processing
          </div>
          <h2 className="mt-2 font-serif text-2xl font-semibold tracking-tight text-[color:var(--nsi-ink)]">
            Review and synthesis
          </h2>
          <p className="mt-3 text-sm leading-6 text-[color:var(--nsi-ink-soft)]">
            Admins can review submissions, flag entries, and prepare the official snapshot narrative and pillar scores.
          </p>
        </div>
        <div className="nsi-card-soft p-8">
          <div className="text-xs font-semibold uppercase tracking-wider text-[color:var(--nsi-ink-soft)]">
            3) Publication
          </div>
          <h2 className="mt-2 font-serif text-2xl font-semibold tracking-tight text-[color:var(--nsi-ink)]">
            Publish and lock
          </h2>
          <p className="mt-3 text-sm leading-6 text-[color:var(--nsi-ink-soft)]">
            When published, the snapshot becomes the public dashboard. Locking makes the snapshot immutable.
          </p>
        </div>
      </section>
    </main>
  );
}

