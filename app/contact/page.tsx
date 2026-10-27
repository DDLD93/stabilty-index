import type { Metadata } from "next";
import Link from "next/link";
import { ContactForm } from "@/components/public/ContactForm";
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
    <main className="w-full pb-24">
      <section className="border-b-2 border-[color:var(--nsi-ink)] bg-[color:var(--nsi-green-deep)] py-16 text-white">
        <div className="mx-auto w-full max-w-7xl px-6">
          <p className="nsi-kicker-light">Correspondence · Research Desk</p>
          <h1 className="mt-2 font-serif text-4xl font-bold tracking-tight text-white lg:text-5xl">
            Let&apos;s talk about NSI
          </h1>
          <p className="mt-5 max-w-2xl border-l-2 border-[color:var(--nsi-gold)] pl-5 text-base leading-relaxed text-white/80">
            For general enquiries about the Nigeria Stability Index, our
            methodology, media briefings, or institutional reports, please reach
            out below. We respond within a few business days.
          </p>
        </div>
      </section>

      <section className="mx-auto mt-16 w-full max-w-7xl px-6">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="nsi-section-card p-8 sm:p-10 lg:col-span-8">
            <span className="nsi-kicker">01 / Direct Inquiry</span>
            <h2 className="mt-2 font-serif text-2xl font-bold tracking-tight text-[color:var(--nsi-ink)]">
              Send a message to the research desk
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[color:var(--nsi-ink-soft)]">
              Complete the inquiry form below or write directly to our official
              correspondence address.
            </p>
            <ContactForm />
          </div>

          <aside className="space-y-6 lg:col-span-4">
            <div className="rounded-[4px] border border-[color:var(--nsi-rule-strong)] bg-white p-6 sm:p-8">
              <span className="nsi-kicker">02 / Direct Email</span>
              <h3 className="mt-2 font-serif text-xl font-bold text-[color:var(--nsi-ink)]">
                Official Correspondence
              </h3>
              <a
                href="mailto:info@nigeriastabilityIndex.ng"
                className="mt-3 inline-block font-mono text-sm font-bold text-[color:var(--nsi-green)] underline underline-offset-4 hover:text-[color:var(--nsi-green-deep)]"
              >
                info@nigeriastabilityIndex.ng
              </a>
              <p className="mt-4 text-xs leading-relaxed text-[color:var(--nsi-ink-soft)]">
                For press, academic research citations, or institutional
                partnership enquiries, select the corresponding subject in the
                form or reference it in your email subject line.
              </p>
            </div>

            <div className="rounded-[4px] border border-[color:var(--nsi-rule-strong)] bg-white p-6 sm:p-8">
              <span className="nsi-kicker">03 / Reference Links</span>
              <div className="mt-4 flex flex-col gap-2.5">
                <Link href="/about" className="btn-nsi-outline justify-between py-2.5 text-xs">
                  <span>About NSI</span>
                  <span aria-hidden>→</span>
                </Link>
                <Link href="/methodology" className="btn-nsi-outline justify-between py-2.5 text-xs">
                  <span>Methodology</span>
                  <span aria-hidden>→</span>
                </Link>
                <Link href="/subscribe" className="btn-nsi-gold justify-between py-2.5 text-xs">
                  <span>Subscribe to Dispatch</span>
                  <span aria-hidden>→</span>
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
