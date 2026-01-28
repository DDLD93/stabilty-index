import type { Metadata } from "next";
import Link from "next/link";
import { defaultMetadata } from "@/lib/metadata";

export const metadata: Metadata = {
  ...defaultMetadata,
  title: "Contact",
  description:
    "Get in touch with the Nigeria Stability Index. We welcome questions about our methodology, reports, and how to participate.",
  openGraph: {
    ...defaultMetadata.openGraph,
    title: "Contact | Nigeria Stability Index",
    description: "Contact the Nigeria Stability Index.",
    url: `${defaultMetadata.metadataBase}contact`,
  },
  alternates: {
    canonical: "/contact",
  },
};

export default function ContactPage() {
  return (
    <main className="mx-auto w-full max-w-7xl px-6 pb-14 pt-10">
      <section className="nsi-section-card rounded-[30px] px-8 py-9">
        <h1 className="font-serif text-4xl font-semibold tracking-tight text-[color:var(--nsi-ink)]">
          Contact
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-7 text-[color:var(--nsi-ink-soft)]">
          For general enquiries about the Nigeria Stability Index, our
          methodology, or reports, please reach out via email. We aim to respond
          within a few business days.
        </p>
      </section>

      <section className="mt-10 nsi-card-solid rounded-[28px] p-8">
        <h2 className="font-serif text-xl font-semibold tracking-tight text-[color:var(--nsi-ink)]">
          Email
        </h2>
        <a
          href="mailto:contact@NigeriaStabilityIndex.com"
          className="mt-3 inline-block text-[color:var(--nsi-green)] underline underline-offset-4 transition-colors hover:text-[color:var(--nsi-green-deep)]"
        >
          contact@NigeriaStabilityIndex.com
        </a>
        <p className="mt-4 text-sm leading-6 text-[color:var(--nsi-ink-soft)]">
          For media or partnership enquiries, please use the same address and
          include a brief subject line.
        </p>
        <div className="mt-8 flex flex-wrap gap-4">
          <Link
            href="/about"
            className="rounded-lg border border-[color:var(--nsi-card-border)] bg-white px-5 py-2.5 text-sm font-medium text-[color:var(--nsi-ink)] transition-colors hover:bg-[color:var(--nsi-paper)]"
          >
            About NSI
          </Link>
          <Link
            href="/methodology"
            className="rounded-lg border border-[color:var(--nsi-card-border)] bg-white px-5 py-2.5 text-sm font-medium text-[color:var(--nsi-ink)] transition-colors hover:bg-[color:var(--nsi-paper)]"
          >
            Methodology
          </Link>
          <Link
            href="/subscribe"
            className="rounded-lg bg-[color:var(--nsi-gold)] px-5 py-2.5 text-sm font-semibold text-[color:var(--nsi-ink)] transition-all hover:brightness-[0.96]"
          >
            Subscribe
          </Link>
        </div>
      </section>
    </main>
  );
}
