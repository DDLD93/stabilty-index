import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { LinkButton } from "@/components/ui/Button";
import { Figure } from "@/components/ui/Figure";
import { Container, Section } from "@/components/ui/Layout";
import { EmptyState, PageHeader } from "@/components/ui/PageHeader";
import { RichText } from "@/components/ui/RichText";
import { defaultMetadata } from "@/lib/metadata";
import { photos } from "@/lib/photos";
import { formatInstitutionName, formatScore, formatStateName, getReport, listPublishedReports } from "@/lib/snapshots";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  ...defaultMetadata,
  title: "State and institution spotlights",
  description:
    "Each month the Nigeria Stability Index looks closely at one state and one institution, based on published evidence.",
  alternates: { canonical: "/spotlights" },
};

export default async function SpotlightsPage() {
  const summaries = await listPublishedReports();
  const reports = (await Promise.all([...summaries].reverse().map((s) => getReport(s.id)))).filter(
    (r): r is NonNullable<typeof r> => Boolean(r && (r.state || r.institution || r.streetPulse)),
  );
  const [latest, ...earlier] = reports;

  return (
    <>
      <PageHeader
        crumbs={[{ href: "/", label: "Home" }, { label: "Spotlights" }]}
        title="Spotlights"
        lede="Each month the report looks closely at one state and one institution, drawing on published evidence such as official data and independent assessments. A spotlight records what happened; it is not an endorsement."
      />

      {!latest ? (
        <Container className="py-12">
          <EmptyState title="No spotlights yet" action={<LinkButton href="/reports" variant="secondary">See the reports</LinkButton>}>
            Spotlights are published with each monthly report.
          </EmptyState>
        </Container>
      ) : (
        <>
          <Section className="pt-10 sm:pt-14">
            <Container>
              <h2 className="text-h2">{latest.period}</h2>
              <p className="mt-2 text-body text-ink-2">
                From{" "}
                <Link href={`/reports/${latest.id}`} className="text-brand underline underline-offset-[0.22em]">
                  edition {latest.edition} of the index
                </Link>
                .
              </p>

              <div className="mt-10 grid gap-12 lg:grid-cols-2 lg:gap-16">
                {latest.state ? (
                  <article aria-labelledby="latest-state" className="border-t border-ink pt-6">
                    <h3 id="latest-state" className="text-h3">
                      {formatStateName(latest.state.state) || "State spotlight"}
                    </h3>
                    <p className="mt-1 text-meta text-ink-3">
                      State spotlight
                      {latest.state.score !== null ? ` · score ${formatScore(latest.state.score)} out of 10` : ""}
                    </p>
                    <RichText html={latest.state.html} className="mt-5" />
                  </article>
                ) : null}
                {latest.institution ? (
                  <article aria-labelledby="latest-institution" className="border-t border-ink pt-6">
                    <h3 id="latest-institution" className="text-h3">
                      {formatInstitutionName(latest.institution.institution) || "Institution spotlight"}
                    </h3>
                    <p className="mt-1 text-meta text-ink-3">Institution spotlight</p>
                    {latest.institution.summary ? <p className="mt-5 text-lead">{latest.institution.summary}</p> : null}
                    <RichText html={latest.institution.html} className="mt-5" />
                  </article>
                ) : null}
              </div>

              {latest.streetPulse ? (
                <article aria-labelledby="latest-street" className="mt-12 border-t border-ink pt-6 lg:max-w-[calc(50%-2rem)]">
                  <h3 id="latest-street" className="text-h3">
                    {latest.streetPulse.title || "Street pulse"}
                  </h3>
                  <p className="mt-1 text-meta text-ink-3">Street pulse</p>
                  {latest.streetPulse.summary ? <p className="mt-5 text-lead">{latest.streetPulse.summary}</p> : null}
                  <RichText html={latest.streetPulse.html} className="mt-5" />
                </article>
              ) : null}
            </Container>
          </Section>

          <Section tone="surface">
            <Container>
              <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)] lg:gap-16">
                <div>
                  <h2 className="text-h2">Earlier spotlights</h2>
                  <p className="mt-3 text-body text-ink-2">
                    Every state and institution covered so far, month by month. Each links to the full report.
                  </p>
                  <Figure photo={photos.abujaCbd} sizes="(min-width: 1024px) 40vw, 100vw" aspect="4/3" className="mt-8 hidden lg:flex" />
                </div>
                {earlier.length ? (
                  <ol className="border-t border-ink">
                    {earlier.map((r) => (
                      <li key={r.id} className="border-b border-line py-5">
                        <h3 className="font-sans text-body font-semibold">{r.period}</h3>
                        <ul className="mt-2 flex flex-col gap-1">
                          {r.state ? (
                            <li>
                              <Link href={`/reports/${r.id}#state-spotlight`} className="inline-flex min-h-11 items-center gap-1.5 text-brand underline underline-offset-[0.22em]">
                                State: {formatStateName(r.state.state) || "see report"} <ArrowRight aria-hidden className="size-4" />
                              </Link>
                            </li>
                          ) : null}
                          {r.institution ? (
                            <li>
                              <Link href={`/reports/${r.id}#institution-spotlight`} className="inline-flex min-h-11 items-center gap-1.5 text-brand underline underline-offset-[0.22em]">
                                Institution: {formatInstitutionName(r.institution.institution) || "see report"} <ArrowRight aria-hidden className="size-4" />
                              </Link>
                            </li>
                          ) : null}
                        </ul>
                      </li>
                    ))}
                  </ol>
                ) : (
                  <p className="text-body text-ink-2">Earlier months will be listed here as more reports are published.</p>
                )}
              </div>
            </Container>
          </Section>
        </>
      )}
    </>
  );
}
