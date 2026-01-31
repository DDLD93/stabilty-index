import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { defaultMetadata } from "@/lib/metadata";

export const metadata: Metadata = {
  ...defaultMetadata,
  title: "About",
  description:
    "Learn about the Nigeria Stability Index (NSI) - an independent civic measurement platform tracking Nigeria's stability through data, public sentiment, and calm analysis. Non-political, no campaigning, no advocacy.",
  openGraph: {
    ...defaultMetadata.openGraph,
    title: "About | Nigeria Stability Index",
    description:
      "The Nigeria Stability Index (NSI) is an independent civic measurement platform. Non-political, no campaigning, no advocacy.",
    url: `${defaultMetadata.metadataBase}about`,
  },
  alternates: {
    canonical: "/about",
  },
};

export default function AboutPage() {
  return (
    <main className="w-full pb-20">
      <section className="relative overflow-hidden pt-20">
        <div className="mx-auto w-full max-w-7xl px-6">
          <div className="nsi-section-card px-8 py-12">
            <div className="absolute inset-0 -z-10 opacity-[0.12]">
              <Image
                src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop"
                alt="Calm Workspace"
                fill
                className="object-cover"
              />
            </div>
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/60 px-4 py-1.5 text-sm font-medium text-[color:var(--nsi-ink)] backdrop-blur-md">
                About NSI
              </div>
              <h1 className="mt-6 font-serif text-4xl font-semibold tracking-tight text-[color:var(--nsi-ink)] lg:text-5xl">
                About the Nigeria Stability Index
              </h1>
              <p className="mt-5 max-w-3xl text-base leading-7 text-[color:var(--nsi-ink-soft)]">
                The Nigeria Stability Index (NSI) is an independent civic measurement
                platform. We track how Nigeria is holding together through calm,
                structured monthly snapshots across security, economy, governance,
                investor confidence, and social stability — non-political, with no
                campaigning and no advocacy.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/reports"
                  className="inline-flex items-center rounded-xl bg-[color:var(--nsi-green)] px-6 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:brightness-110"
                >
                  View Reports
                </Link>
                <Link
                  href="/methodology"
                  className="inline-flex items-center rounded-xl border border-black/10 bg-white/70 px-6 py-3 text-sm font-semibold text-[color:var(--nsi-ink)] backdrop-blur-sm transition-all hover:bg-white"
                >
                  Methodology
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto mt-20 grid w-full max-w-7xl gap-6 px-6 md:grid-cols-2">
        <div className="nsi-card-soft p-8">
          <div className="text-xs font-semibold uppercase tracking-wider text-[color:var(--nsi-ink-soft)]">
            What we measure
          </div>
          <h2 className="mt-2 font-serif text-2xl font-semibold tracking-tight text-[color:var(--nsi-ink)]">
            A calm monthly pulse
          </h2>
          <p className="mt-3 text-sm leading-6 text-[color:var(--nsi-ink-soft)]">
            A mix of public check-ins and editorial analysis, summarized into
            an overall score and five pillar scores with short narratives.
          </p>
        </div>

        <div className="nsi-card-soft p-8">
          <div className="text-xs font-semibold uppercase tracking-wider text-[color:var(--nsi-ink-soft)]">
            What we don&apos;t collect
          </div>
          <h2 className="mt-2 font-serif text-2xl font-semibold tracking-tight text-[color:var(--nsi-ink)]">
            No personal identifiers
          </h2>
          <p className="mt-3 text-sm leading-6 text-[color:var(--nsi-ink-soft)]">
            The check-in form stores no personal identifiers. Please avoid
            sharing names, phone numbers, or addresses in submissions.
          </p>
        </div>
      </section>
    </main>
  );
}
