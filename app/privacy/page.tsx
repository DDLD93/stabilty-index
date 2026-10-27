import type { Metadata } from "next";
import Link from "next/link";
import { defaultMetadata } from "@/lib/metadata";

export const metadata: Metadata = {
  ...defaultMetadata,
  title: "Privacy",
  description:
    "Privacy policy for the Nigeria Stability Index. How we handle email subscriptions, check-in data, and your information.",
  openGraph: {
    ...defaultMetadata.openGraph,
    title: "Privacy | Nigeria Stability Index",
    description: "Privacy policy for the Nigeria Stability Index.",
    url: `${defaultMetadata.metadataBase}privacy`,
  },
  alternates: {
    canonical: "/privacy",
  },
};

export default function PrivacyPage() {
  return (
    <main className="w-full pb-24">
      <section className="border-b-2 border-[color:var(--nsi-ink)] bg-[color:var(--nsi-green-deep)] py-16 text-white">
        <div className="mx-auto w-full max-w-5xl px-6">
          <p className="nsi-kicker-light">Data Ethics &amp; Anonymity Charter</p>
          <h1 className="mt-2 font-serif text-4xl font-bold tracking-tight text-white lg:text-5xl">
            Your data stays calm and minimal
          </h1>
          <p className="mt-5 max-w-2xl border-l-2 border-[color:var(--nsi-gold)] pl-5 text-base leading-relaxed text-white/80">
            The Nigeria Stability Index (NSI) respects your privacy. This charter
            describes how we handle information when you browse our publications,
            subscribe to dispatches, or participate in monthly check-ins.
          </p>
        </div>
      </section>

      <section className="mx-auto mt-14 w-full max-w-5xl space-y-6 px-6">
        <div className="nsi-section-card p-8">
          <span className="nsi-kicker">01 / Dispatch Subscriptions</span>
          <h2 className="mt-2 font-serif text-2xl font-bold tracking-tight text-[color:var(--nsi-ink)]">
            Email subscriptions
          </h2>
          <p className="mt-3 text-sm leading-7 text-[color:var(--nsi-ink-soft)]">
            When you subscribe to our newsletter, we collect your email address
            only. We use it to send you monthly updates and report releases. We
            do not sell or share your email with third parties. You can
            unsubscribe at any time via the link in our emails or by contacting
            us.
          </p>
        </div>

        <div className="nsi-section-card p-8">
          <span className="nsi-kicker">02 / Survey Anonymity</span>
          <h2 className="mt-2 font-serif text-2xl font-bold tracking-tight text-[color:var(--nsi-ink)]">
            Check-in and spotlight data
          </h2>
          <p className="mt-3 text-sm leading-7 text-[color:var(--nsi-ink-soft)]">
            Our public check-in form does not collect personal identifiers. We
            store stability scores, mood, one-word descriptors, and optional
            state spotlight information. Please do not include names, phone
            numbers, or addresses in your submissions. Aggregated data may
            appear in our published snapshots; we do not attribute responses to
            individuals.
          </p>
        </div>

        <div className="nsi-section-card p-8">
          <span className="nsi-kicker">03 / Platform Telemetry</span>
          <h2 className="mt-2 font-serif text-2xl font-bold tracking-tight text-[color:var(--nsi-ink)]">
            Website usage and cookies
          </h2>
          <p className="mt-3 text-sm leading-7 text-[color:var(--nsi-ink-soft)]">
            We aim to keep our site simple and fast. We do not use third-party
            advertising or analytics that track you across sites. We may use
            minimal, necessary cookies for essential site functionality. We do
            not run autoplay videos or invasive tracking widgets.
          </p>
        </div>

        <div className="nsi-section-card p-8">
          <span className="nsi-kicker">04 / Data Inquiries</span>
          <h2 className="mt-2 font-serif text-2xl font-bold tracking-tight text-[color:var(--nsi-ink)]">
            Contact
          </h2>
          <p className="mt-3 text-sm leading-7 text-[color:var(--nsi-ink-soft)]">
            For privacy-related questions or to request removal of your data,
            contact us at{" "}
            <a
              href="mailto:info@nigeriastabilityIndex.ng"
              className="font-mono font-semibold text-[color:var(--nsi-green)] underline underline-offset-4 hover:text-[color:var(--nsi-green-deep)]"
            >
              info@nigeriastabilityIndex.ng
            </a>
            .
          </p>
          <Link
            href="/contact"
            className="mt-4 inline-block font-mono text-xs font-bold uppercase tracking-wider text-[color:var(--nsi-green)] hover:underline"
          >
            Contact Desk →
          </Link>
        </div>
      </section>
    </main>
  );
}
