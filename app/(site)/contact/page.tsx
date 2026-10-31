import type { Metadata } from "next";
import Link from "next/link";
import { ContactForm } from "@/components/public/ContactForm";
import { Figure } from "@/components/ui/Figure";
import { Container } from "@/components/ui/Layout";
import { PageHeader } from "@/components/ui/PageHeader";
import { defaultMetadata } from "@/lib/metadata";
import { photos } from "@/lib/photos";

export const metadata: Metadata = {
  ...defaultMetadata,
  title: "Contact",
  description: "Questions about the Nigeria Stability Index, its method, its data or NSI Honors? Get in touch.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <>
      <PageHeader
        crumbs={[{ href: "/", label: "Home" }, { label: "Contact" }]}
        title="Contact us"
        lede="Questions about the method, a report, NSI Honors or working with us. We read every message and aim to reply within a few working days."
      />

      <Container className="py-10 sm:py-14">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:gap-16">
          <section aria-labelledby="form-title" className="max-w-2xl">
            <h2 id="form-title" className="text-h3">
              Send a message
            </h2>
            <div className="mt-6">
              <ContactForm />
            </div>
          </section>

          <aside className="flex flex-col gap-8">
            <div>
              <h2 className="text-h3">Or write to us</h2>
              <p className="mt-3 text-body text-ink-2">
                Email{" "}
                <a href="mailto:info@nigeriastabilityindex.ng" className="font-semibold text-brand underline underline-offset-[0.22em]">
                  info@nigeriastabilityindex.ng
                </a>{" "}
                from your own mail app. For media requests, put “Media” in the subject line.
              </p>
            </div>
            <div>
              <h2 className="text-h3">Looking for something else?</h2>
              <ul className="mt-3 flex flex-col">
                <li>
                  <Link href="/methodology" className="flex min-h-11 items-center text-brand underline underline-offset-[0.22em]">
                    How the index is made
                  </Link>
                </li>
                <li>
                  <Link href="/reports" className="flex min-h-11 items-center text-brand underline underline-offset-[0.22em]">
                    Monthly reports
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="flex min-h-11 items-center text-brand underline underline-offset-[0.22em]">
                    Privacy and your data
                  </Link>
                </li>
              </ul>
            </div>
            <Figure photo={photos.danfo} sizes="(min-width: 1024px) 35vw, 100vw" aspect="4/3" className="hidden lg:flex" />
          </aside>
        </div>
      </Container>
    </>
  );
}
