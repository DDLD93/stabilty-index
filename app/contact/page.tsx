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
    <main className="w-full pb-20">
      <section className="relative overflow-hidden pt-16">
        <div className="mx-auto w-full max-w-7xl px-6">
          <div className="nsi-section-card px-8 py-10">
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/60 px-4 py-1.5 text-sm font-medium text-[color:var(--nsi-ink)] backdrop-blur-md">
                Contact
              </div>
              <h1 className="mt-6 font-serif text-4xl font-semibold tracking-tight text-[color:var(--nsi-ink)] lg:text-5xl">
                Let&apos;s talk about NSI
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-[color:var(--nsi-ink-soft)]">
                For general enquiries about the Nigeria Stability Index, our
                methodology, or reports, please reach out via email. We aim to respond
                within a few business days.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto mt-12 w-full max-w-7xl px-6">
        <div className="nsi-card-soft p-8">
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
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/about"
              className="rounded-xl border border-black/10 bg-white/70 px-5 py-2.5 text-sm font-medium text-[color:var(--nsi-ink)] backdrop-blur-sm transition-colors hover:bg-white"
            >
              About NSI
            </Link>
            <Link
              href="/methodology"
              className="rounded-xl border border-black/10 bg-white/70 px-5 py-2.5 text-sm font-medium text-[color:var(--nsi-ink)] backdrop-blur-sm transition-colors hover:bg-white"
            >
              Methodology
            </Link>
            <Link
              href="/subscribe"
              className="rounded-xl bg-[color:var(--nsi-gold)] px-5 py-2.5 text-sm font-semibold text-[color:var(--nsi-ink)] transition-all hover:brightness-105"
            >
              Subscribe
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
