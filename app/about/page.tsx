import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { defaultMetadata } from "@/lib/metadata";
import { NigeriaMapSilhouette } from "@/components/public/icons";

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
    <main className="w-full pb-24">
      {/* Institutional Masthead */}
      <section className="border-b-2 border-[color:var(--nsi-ink)] bg-[color:var(--nsi-green-deep)] py-16 text-white lg:py-20">
        <div className="mx-auto w-full max-w-7xl px-6">
          <div className="grid items-center gap-12 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <p className="nsi-kicker-light">Institutional Mandate · About NSI</p>
              <h1 className="mt-3 font-serif text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl">
                About the Nigeria Stability Index
              </h1>
              <p className="mt-6 max-w-2xl border-l-2 border-[color:var(--nsi-gold)] pl-5 text-base leading-relaxed text-white/80 sm:text-lg">
                The Nigeria Stability Index (NSI) is an independent civic
                measurement platform. We track how Nigeria is holding together
                through calm, structured monthly snapshots across security,
                economy, governance, investor confidence, and social stability —
                non-political, with no campaigning and no advocacy.
              </p>
              <div className="mt-8 flex flex-wrap gap-3.5">
                <Link href="/reports" className="btn-nsi-gold">
                  <span>View Reports Archive</span>
                  <span aria-hidden>→</span>
                </Link>
                <Link
                  href="/methodology"
                  className="inline-flex items-center gap-2 rounded-[3px] border border-white/25 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:border-white hover:bg-white/10"
                >
                  Research Methodology
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="relative aspect-[4/3] overflow-hidden rounded-[4px] border border-white/20 shadow-2xl">
                <Image
                  src="/images/nigeria-research-desk.jpg"
                  alt="Nigerian policy researchers analyzing regional stability data in Abuja"
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-[#04170e] via-[#04170e]/80 to-transparent p-4">
                  <p className="font-mono text-[0.68rem] uppercase tracking-wider text-[color:var(--nsi-gold-light)]">
                    Abuja Research Desk · Empirical Synthesis Across 36 States &amp; FCT
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Principles Grid */}
      <section className="mx-auto mt-16 w-full max-w-7xl px-6">
        <div className="nsi-section-rule mb-8">
          <p className="nsi-kicker">01 / Institutional Charter</p>
          <h2 className="mt-1 font-serif text-3xl font-bold text-[color:var(--nsi-ink)]">
            Core Principles &amp; Measurement Scope
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="nsi-section-card p-8">
            <div className="font-mono text-xs font-bold uppercase tracking-widest text-[color:var(--nsi-green)]">
              01 / What We Measure
            </div>
            <h3 className="mt-3 font-serif text-2xl font-bold tracking-tight text-[color:var(--nsi-ink)]">
              A calm monthly pulse
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-[color:var(--nsi-ink-soft)]">
              A structured synthesis of public check-ins and empirical analysis,
              distilled into a composite stability score (1–10) and five pillar
              scores with concise analytical narratives.
            </p>
          </div>

          <div className="nsi-section-card p-8">
            <div className="font-mono text-xs font-bold uppercase tracking-widest text-[color:var(--nsi-gold-deep)]">
              02 / What We Don&apos;t Collect
            </div>
            <h3 className="mt-3 font-serif text-2xl font-bold tracking-tight text-[color:var(--nsi-ink)]">
              No personal identifiers
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-[color:var(--nsi-ink-soft)]">
              The citizen check-in form stores no personal identifiers. We ask
              participants to avoid sharing names, phone numbers, or residential
              addresses in submissions.
            </p>
          </div>

          <div className="nsi-section-card p-8">
            <div className="font-mono text-xs font-bold uppercase tracking-widest text-[color:var(--nsi-terracotta)]">
              03 / Editorial Independence
            </div>
            <h3 className="mt-3 font-serif text-2xl font-bold tracking-tight text-[color:var(--nsi-ink)]">
              Evidence, not endorsement
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-[color:var(--nsi-ink-soft)]">
              State and institutional spotlights highlight verifiable trends and
              citizen-reported realities. They are strictly analytical briefs,
              never political endorsements.
            </p>
          </div>
        </div>
      </section>

      {/* Nigerian Context & The 24 Angels Initiative */}
      <section className="mx-auto mt-16 w-full max-w-7xl px-6">
        <div className="overflow-hidden rounded-[4px] border border-[color:var(--nsi-rule-strong)] bg-white">
          <div className="grid lg:grid-cols-12">
            <div className="p-8 sm:p-12 lg:col-span-7">
              <span className="nsi-kicker">02 / Institutional Stewardship</span>
              <h2 className="mt-2 font-serif text-3xl font-bold text-[color:var(--nsi-ink)]">
                Built for Nigerian policymakers, researchers, and citizens
              </h2>
              <p className="mt-4 text-sm leading-7 text-[color:var(--nsi-ink-soft)] sm:text-base">
                Public discourse in Nigeria often swings between alarmism and
                unverified optimism. The Nigeria Stability Index provides a
                consistent, longitudinal benchmark published on the 11th of
                every month — enabling citizens, civil society, journalists, and
                institutional leaders to track real trajectories over time.
              </p>
              <div className="mt-6 flex items-center gap-6 border-t border-[color:var(--nsi-rule)] pt-6">
                <Image
                  src="/nsi-logo-full.webp"
                  alt="Nigeria Stability Index Official Logo"
                  width={132}
                  height={90}
                  className="h-20 w-auto shrink-0 object-contain"
                />
                <div>
                  <div className="font-mono text-xs font-bold uppercase tracking-wider text-[color:var(--nsi-gold-deep)]">
                    A Project Of
                  </div>
                  <div className="font-serif text-xl font-bold text-[color:var(--nsi-ink)]">
                    The 24 Angels Initiative
                  </div>
                  <p className="mt-1 text-xs text-[color:var(--nsi-ink-soft)]">
                    Advancing civic literacy, empirical governance tracking, and
                    public-interest research in Nigeria.
                  </p>
                </div>
              </div>
            </div>

            <div className="relative min-h-[280px] lg:col-span-5">
              <Image
                src="/images/nigeria-citizens-dialogue.jpg"
                alt="Nigerian community forum and civic dialogue"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
