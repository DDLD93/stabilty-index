import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Layout";
import { PageHeader } from "@/components/ui/PageHeader";
import { defaultMetadata } from "@/lib/metadata";

export const metadata: Metadata = {
  ...defaultMetadata,
  title: "Privacy",
  description: "What the Nigeria Stability Index collects through the survey, email updates, NSI Honors and the contact form, and how it is used.",
  alternates: { canonical: "/privacy" },
};

const SECTIONS = [
  { id: "survey", title: "The monthly survey" },
  { id: "honors", title: "NSI Honors nominations and votes" },
  { id: "email", title: "Email updates" },
  { id: "contact", title: "The contact form" },
  { id: "website", title: "Using this website" },
  { id: "rights", title: "Your choices" },
];

export default function PrivacyPage() {
  return (
    <>
      <PageHeader
        crumbs={[{ href: "/", label: "Home" }, { label: "Privacy" }]}
        title="Privacy"
        lede="We collect as little as we can, use it only to run the index and its programmes, and never sell it. This page explains what we collect and why."
      />

      <Container className="py-10 sm:py-14">
        <div className="grid gap-10 lg:grid-cols-[14rem_minmax(0,1fr)] lg:gap-16">
          <nav aria-label="On this page" className="lg:sticky lg:top-28 lg:self-start">
            <p className="text-meta font-semibold text-ink-3">On this page</p>
            <ul className="mt-3 flex flex-col">
              {SECTIONS.map((s) => (
                <li key={s.id}>
                  <a href={`#${s.id}`} className="flex min-h-11 items-center text-small text-brand underline underline-offset-[0.22em]">
                    {s.title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex max-w-[68ch] flex-col gap-12 text-body text-ink-2">
            <section id="survey" className="scroll-mt-28">
              <h2 className="text-h3 text-ink">The monthly survey</h2>
              <p className="mt-4">
                The survey does not ask for your name, phone number or address, and please don’t include them in your
                answers or comments. We store:
              </p>
              <ul className="mt-3 flex list-disc flex-col gap-2 pl-5">
                <li>your five answers and anything you add in the optional last step (mood, one word, state, topics, comment);</li>
                <li>
                  a random identifier kept in your browser, so the same device can answer only once a month;
                </li>
                <li>
                  basic device details (time zone, language, screen and window size, and the browser’s own platform
                  hints), used to spot automated or duplicate answers;
                </li>
                <li>the referral code, if you arrived through a field agent’s link.</li>
              </ul>
              <p className="mt-4">
                Published reports show only totals and averages. We never publish individual answers or link them to a
                person.
              </p>
            </section>

            <section id="honors" className="scroll-mt-28">
              <h2 className="text-h3 text-ink">NSI Honors nominations and votes</h2>
              <p className="mt-4">
                <strong className="text-ink">Nominations.</strong> We store the nomination and your name and email, so
                the team can ask follow-up questions and confirm receipt. Your contact details are not published and
                are deleted once the edition is archived.
              </p>
              <p className="mt-4">
                <strong className="text-ink">Votes.</strong> To make sure each person votes once per category, we
                email you a confirmation link. We keep only a scrambled (one-way hashed) form of your email address
                with your vote, never the address itself. We also keep scrambled forms of your network address and
                device identifier to detect bulk voting.
              </p>
            </section>

            <section id="email" className="scroll-mt-28">
              <h2 className="text-h3 text-ink">Email updates</h2>
              <p className="mt-4">
                If you sign up for updates we store your email address and the date you confirmed it. We use it only to
                send report releases and survey reminders. Every email has an unsubscribe link, and you can also ask us
                to remove you.
              </p>
            </section>

            <section id="contact" className="scroll-mt-28">
              <h2 className="text-h3 text-ink">The contact form</h2>
              <p className="mt-4">
                Messages you send through the contact form go to our team by email, with the name and email address
                you give, so we can reply.
              </p>
            </section>

            <section id="website" className="scroll-mt-28">
              <h2 className="text-h3 text-ink">Using this website</h2>
              <p className="mt-4">
                We don’t run advertising or third-party tracking across sites. The site uses only what it needs to work,
                such as the survey identifier described above.
              </p>
            </section>

            <section id="rights" className="scroll-mt-28">
              <h2 className="text-h3 text-ink">Your choices</h2>
              <p className="mt-4">
                To ask about your data or to have it removed, write to{" "}
                <a href="mailto:info@nigeriastabilityindex.ng" className="text-brand underline underline-offset-[0.22em]">
                  info@nigeriastabilityindex.ng
                </a>{" "}
                or use the{" "}
                <Link href="/contact" className="text-brand underline underline-offset-[0.22em]">
                  contact form
                </Link>
                .
              </p>
            </section>
          </div>
        </div>
      </Container>
    </>
  );
}
