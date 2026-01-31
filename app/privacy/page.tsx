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
    <main className="w-full pb-20">
      <section className="relative overflow-hidden pt-20">
        <div className="mx-auto w-full max-w-7xl px-6">
          <div className="nsi-section-card px-8 py-10">
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/60 px-4 py-1.5 text-sm font-medium text-[color:var(--nsi-ink)] backdrop-blur-md">
                Privacy
              </div>
              <h1 className="mt-6 font-serif text-4xl font-semibold tracking-tight text-[color:var(--nsi-ink)] lg:text-5xl">
                Your data stays calm and minimal
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-[color:var(--nsi-ink-soft)]">
                The Nigeria Stability Index (NSI) respects your privacy. This page
                describes how we handle your information when you use our website,
                subscribe to updates, or participate in check-ins.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto mt-20 w-full max-w-7xl space-y-6 px-6">
        <div className="nsi-card-soft p-8">
          <h2 className="font-serif text-xl font-semibold tracking-tight text-[color:var(--nsi-ink)]">
            Email subscriptions
          </h2>
          <p className="mt-3 text-sm leading-6 text-[color:var(--nsi-ink-soft)]">
            When you subscribe to our newsletter, we collect your email address
            only. We use it to send you monthly updates and report releases. We
            do not sell or share your email with third parties. You can
            unsubscribe at any time via the link in our emails or by contacting
            us.
          </p>
        </div>

        <div className="nsi-card-soft p-8">
          <h2 className="font-serif text-xl font-semibold tracking-tight text-[color:var(--nsi-ink)]">
            Check-in and spotlight data
          </h2>
          <p className="mt-3 text-sm leading-6 text-[color:var(--nsi-ink-soft)]">
            Our public check-in form does not collect personal identifiers. We
            store stability scores, mood, one-word descriptors, and optional
            state spotlight information. Please do not include names, phone
            numbers, or addresses in your submissions. Aggregated data may
            appear in our published snapshots; we do not attribute responses to
            individuals.
          </p>
        </div>

        <div className="nsi-card-soft p-8">
          <h2 className="font-serif text-xl font-semibold tracking-tight text-[color:var(--nsi-ink)]">
            Website usage and cookies
          </h2>
          <p className="mt-3 text-sm leading-6 text-[color:var(--nsi-ink-soft)]">
            We aim to keep our site simple and fast. We do not use third-party
            advertising or analytics that track you across sites. We may use
            minimal, necessary cookies for essential site functionality. We do
            not run autoplay videos or invasive tracking widgets.
          </p>
        </div>

        <div className="nsi-card-soft p-8">
          <h2 className="font-serif text-xl font-semibold tracking-tight text-[color:var(--nsi-ink)]">
            Contact
          </h2>
          <p className="mt-3 text-sm leading-6 text-[color:var(--nsi-ink-soft)]">
            For privacy-related questions or to request removal of your data,
            contact us at{" "}
            <a
              href="mailto:contact@NigeriaStabilityIndex.com"
              className="text-[color:var(--nsi-green)] underline underline-offset-4 hover:text-[color:var(--nsi-green-deep)]"
            >
              contact@NigeriaStabilityIndex.com
            </a>
            .
          </p>
          <Link
            href="/contact"
            className="mt-4 inline-block text-sm font-medium text-[color:var(--nsi-green)] hover:underline"
          >
            Contact page →
          </Link>
        </div>
      </section>
    </main>
  );
}
