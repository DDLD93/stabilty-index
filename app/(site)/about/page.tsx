import type { Metadata } from "next";
import { LinkButton } from "@/components/ui/Button";
import { Figure } from "@/components/ui/Figure";
import { Container, Section } from "@/components/ui/Layout";
import { PageHeader } from "@/components/ui/PageHeader";
import { defaultMetadata } from "@/lib/metadata";
import { photos } from "@/lib/photos";

export const metadata: Metadata = {
  ...defaultMetadata,
  title: "About the index",
  description:
    "The Nigeria Stability Index is an independent, non-political monthly reading of how Nigeria is holding together. A project of the 24 Angels Initiative.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <>
      <PageHeader
        crumbs={[{ href: "/", label: "Home" }, { label: "About" }]}
        title="About the Nigeria Stability Index"
        lede="An independent monthly reading of how Nigeria is holding together, built from what ordinary people say and checked against verified sources. It is non-political: we don’t campaign, endorse or advocate."
        actions={
          <>
            <LinkButton href="/reports">Read the reports</LinkButton>
            <LinkButton href="/methodology" variant="secondary">
              How the index is made
            </LinkButton>
          </>
        }
      />

      <Section className="pt-10 sm:pt-14">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-start lg:gap-16">
            <div className="max-w-[62ch]">
              <h2 className="text-h2">Why it exists</h2>
              <div className="mt-5 flex flex-col gap-4 text-body text-ink-2">
                <p>
                  Most of what we hear about Nigeria’s stability comes from headlines, official statements or one-off
                  surveys. Few sources ask ordinary people the same questions every month and publish the answers on
                  a fixed date, where anyone can check and compare them.
                </p>
                <p>
                  The Nigeria Stability Index does that. Each month people answer five short questions, one for each
                  pillar: security, FX and the economy, investor confidence, governance and social stability.
                  Editors review the answers alongside verified sources and publish one overall reading on the 11th.
                </p>
                <p>
                  Once a report is published it is locked. That makes the numbers safe to quote, and it means a change
                  from one month to the next is a change in what people told us, not a revision.
                </p>
              </div>
            </div>
            <Figure photo={photos.asoRock} sizes="(min-width: 1024px) 50vw, 100vw" aspect="4/3" priority />
          </div>
        </Container>
      </Section>

      <Section tone="surface">
        <Container>
          <h2 className="text-h2">What we do and don’t do</h2>
          <div className="mt-10 grid gap-10 md:grid-cols-2 md:gap-16">
            <div>
              <h3 className="font-sans text-lead font-semibold">We do</h3>
              <ul className="mt-4 flex list-disc flex-col gap-3 pl-5 text-body text-ink-2">
                <li>Ask the same five questions every month, so months can be compared.</li>
                <li>Publish on the 11th, with the edition number and date on every report.</li>
                <li>Spotlight one state and one institution each month, based on published evidence.</li>
                <li>Run NSI Honors, where the public nominates and a verified public vote decides the winners.</li>
              </ul>
            </div>
            <div>
              <h3 className="font-sans text-lead font-semibold">We don’t</h3>
              <ul className="mt-4 flex list-disc flex-col gap-3 pl-5 text-body text-ink-2">
                <li>Take sides in politics, campaign or endorse candidates.</li>
                <li>Ask for your name, phone number or address in the survey.</li>
                <li>Change a report after it has been published.</li>
                <li>Treat a spotlight as an endorsement of a state, institution or official.</li>
              </ul>
            </div>
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:items-center lg:gap-16">
            <div className="grid grid-cols-2 gap-4">
              <Figure photo={photos.dyePit} sizes="(min-width: 1024px) 28vw, 50vw" aspect="1/1" caption={false} />
              <Figure photo={photos.classroom} sizes="(min-width: 1024px) 28vw, 50vw" aspect="1/1" caption={false} />
              <p className="col-span-2 text-meta text-ink-3">
                Left: {photos.dyePit.caption} Photo: {photos.dyePit.credit.creator}, {photos.dyePit.credit.license}. Right:{" "}
                {photos.classroom.caption} Photo: {photos.classroom.credit.creator}, {photos.classroom.credit.license}.
              </p>
            </div>
            <div className="max-w-[60ch]">
              <h2 className="text-h2">Who is behind it</h2>
              <p className="mt-5 text-body text-ink-2">
                The Nigeria Stability Index is a project of the 24 Angels Initiative. A small editorial team runs the
                monthly survey, reviews the answers and writes the reports.
              </p>
              <p className="mt-4 text-body text-ink-2">
                For questions about the method, the data or working with us, write to{" "}
                <a href="mailto:info@nigeriastabilityindex.ng" className="text-brand underline underline-offset-[0.22em]">
                  info@nigeriastabilityindex.ng
                </a>
                .
              </p>
              <div className="mt-8">
                <LinkButton href="/contact" variant="secondary">
                  Contact us
                </LinkButton>
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
