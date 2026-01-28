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
    <main className="mx-auto w-full max-w-7xl px-6 pb-14 pt-10">
      <section className="nsi-section-card rounded-[30px] px-8 py-9">
        <h1 className="font-serif text-4xl font-semibold tracking-tight text-[color:var(--nsi-ink)]">
          About the Nigeria Stability Index
        </h1>
        <p className="mt-5 max-w-3xl text-base leading-7 text-[color:var(--nsi-ink-soft)]">
          The Nigeria Stability Index (NSI) is an independent civic measurement
          platform. We track how Nigeria is holding together through calm,
          structured monthly snapshots across security, economy, governance,
          investor confidence, and social stability — non-political, with no
          campaigning and no advocacy.
        </p>
      </section>

      <section className="mt-10 grid gap-6 md:grid-cols-2">
        <div className="nsi-card-solid rounded-[28px] p-8">
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

        <div className="nsi-card-solid rounded-[28px] p-8">
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
