import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { EditionExplorer } from "@/components/data/EditionExplorer";
import { LinkButton } from "@/components/ui/Button";
import { Figure, PhotoCredit } from "@/components/ui/Figure";
import { Container, Section } from "@/components/ui/Layout";
import { EmptyState } from "@/components/ui/PageHeader";
import { defaultMetadata } from "@/lib/metadata";
import { photos } from "@/lib/photos";
import {
  excerpt,
  formatInstitutionName,
  formatStateName,
  getLatestReport,
  listPublishedReports,
  monthOf,
  publicationDateFor,
} from "@/lib/snapshots";
import { getPublicSystemState } from "@/lib/systemState";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const latest = (await listPublishedReports()).at(-1);
  const description = latest
    ? `In ${latest.period} the Nigeria Stability Index read ${latest.overallScore.toFixed(1)} out of 10. A monthly reading of security, the economy, investor confidence, governance and social stability.`
    : "A monthly reading of how Nigeria is holding together across security, the economy, investor confidence, governance and social stability.";
  const title = latest ? `Nigeria Stability Index: ${latest.overallScore.toFixed(1)} out of 10 in ${latest.period}` : "Nigeria Stability Index";
  return {
    ...defaultMetadata,
    title: { absolute: title },
    description,
    openGraph: { ...defaultMetadata.openGraph, title, description },
    twitter: { ...defaultMetadata.twitter, title, description },
  };
}

export default async function Home() {
  const [state, editions, latest] = await Promise.all([getPublicSystemState(), listPublishedReports(), getLatestReport()]);
  const surveyOpen = state.phase === "COLLECTION_OPEN" && state.currentCycle?.status === "OPEN";
  const cycleMonth = state.currentCycle ? monthOf(state.currentCycle.monthYear) : null;
  const nextPublication = publicationDateFor(state.currentCycle?.monthYear);

  const intro = (
    <>
      <h1 className="text-display">How Nigeria is holding together</h1>
      <p className="mt-5 max-w-xl text-lead text-ink-2">
        A monthly reading built from what Nigerians tell us. People answer five questions about security, the
        economy, investment, governance and social life; editors check the answers against verified sources and
        publish the result on the 11th of the following month.
      </p>
      <p className="mt-3 max-w-xl text-body text-ink-2">
        <strong className="font-semibold text-ink">Each edition reports the previous month.</strong> The survey runs
        in the first days of a month and asks about the month just ended, so the reading published on 11 November
        covers October.
      </p>
    </>
  );

  const primaryAction = surveyOpen ? (
    <LinkButton href="/survey">Take the {cycleMonth} survey</LinkButton>
  ) : (
    <LinkButton href="/methodology" variant="secondary">
      How the index is made
    </LinkButton>
  );

  return (
    <>
      <Section className="pt-8 pb-14 sm:pt-12 lg:pt-8 lg:pb-16">
        <Container>
          {editions.length > 0 ? (
            <EditionExplorer
              intro={intro}
              actions={primaryAction}
              editions={editions.map((e) => ({ ...e, publishedAt: e.publishedAt.toISOString() }))}
            />
          ) : (
            <div className="max-w-3xl">
              {intro}
              <EmptyState className="mt-10" title="The first report is on its way" action={primaryAction}>
                No monthly report has been published yet. The first reading will appear here on the 11th after the
                first survey closes.
              </EmptyState>
            </div>
          )}

          {state.phase === "PROCESSING_CLOSED" && cycleMonth ? (
            <p className="mt-10 bg-surface px-5 py-4 text-body text-ink-2">
              The {cycleMonth} survey has closed. Editors are reviewing the answers
              {nextPublication ? <>, and the report will be published on {nextPublication}</> : null}.
            </p>
          ) : null}
        </Container>
      </Section>

      <figure className="reveal">
        <div className="relative aspect-[4/3] w-full bg-surface sm:aspect-[21/9]">
          <Image
            src={photos.balogunMarket.src}
            alt={photos.balogunMarket.alt}
            fill
            sizes="100vw"
            className="object-cover"
          />
        </div>
        <Container>
          <PhotoCredit photo={photos.balogunMarket} className="mt-2" />
        </Container>
      </figure>

      {latest && (latest.state || latest.institution) ? (
        <Section>
          <Container>
            <div className="mb-10 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div className="max-w-2xl">
                <h2 className="text-h2">In the {latest.period} spotlight</h2>
                <p className="mt-3 text-lead text-ink-2">
                  Each month the report looks closely at one state and one institution. Spotlights are based on
                  published evidence and are not endorsements.
                </p>
              </div>
              <Link href="/spotlights" className="inline-flex min-h-11 items-center gap-1.5 font-semibold text-brand underline underline-offset-[0.22em]">
                All spotlights <ArrowRight aria-hidden className="size-4" />
              </Link>
            </div>

            <div className="reveal-stagger grid gap-10 border-t border-ink pt-8 md:grid-cols-2 md:gap-14">
              {latest.state ? (
                <article>
                  <h3 className="text-h3">{formatStateName(latest.state.state) || "State spotlight"}</h3>
                  <p className="mt-1 text-meta text-ink-3">State spotlight, {latest.period}</p>
                  {latest.state.html ? <p className="mt-3 text-body text-ink-2">{excerpt(latest.state.html, 300)}</p> : null}
                  <Link
                    href={`/reports/${latest.id}#state-spotlight`}
                    className="mt-4 inline-flex min-h-11 items-center gap-1.5 font-semibold text-brand underline underline-offset-[0.22em]"
                  >
                    Read the state spotlight <ArrowRight aria-hidden className="size-4" />
                  </Link>
                </article>
              ) : null}
              {latest.institution ? (
                <article>
                  <h3 className="text-h3">{formatInstitutionName(latest.institution.institution) || "Institution spotlight"}</h3>
                  <p className="mt-1 text-meta text-ink-3">Institution spotlight, {latest.period}</p>
                  {latest.institution.summary || latest.institution.html ? (
                    <p className="mt-3 text-body text-ink-2">
                      {latest.institution.summary || excerpt(latest.institution.html, 300)}
                    </p>
                  ) : null}
                  <Link
                    href={`/reports/${latest.id}#institution-spotlight`}
                    className="mt-4 inline-flex min-h-11 items-center gap-1.5 font-semibold text-brand underline underline-offset-[0.22em]"
                  >
                    Read the institution spotlight <ArrowRight aria-hidden className="size-4" />
                  </Link>
                </article>
              ) : null}
            </div>
          </Container>
        </Section>
      ) : null}

      {latest?.sentiment ? (
        <Section tone="surface">
          <Container>
            <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
              <div className="reveal">
                <h2 className="text-h2">In one word, {monthOf(latest.period)} felt…</h2>
                {latest.sentiment.topMood ? (
                  <p className="mt-6 font-serif text-[clamp(2.75rem,2rem+3vw,4.5rem)] leading-none font-semibold text-ink">
                    {latest.sentiment.topMood.toLowerCase()}
                  </p>
                ) : null}
                <p className="mt-6 max-w-lg text-body text-ink-2">
                  The word survey respondents used most when asked to describe the month.
                  {latest.sentiment.topWords.length > 1 ? (
                    <>
                      {" "}Others that came up often:{" "}
                      {latest.sentiment.topWords
                        .filter((w) => w.toLowerCase() !== latest.sentiment?.topMood.toLowerCase())
                        .map((w) => w.toLowerCase())
                        .join(", ")}
                      .
                    </>
                  ) : null}
                </p>
              </div>
              <Figure photo={photos.thirdMainlandBridge} sizes="(min-width: 1024px) 50vw, 100vw" aspect="4/3" />
            </div>
          </Container>
        </Section>
      ) : null}

      <Section>
        <Container>
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:items-center lg:gap-16">
            <Figure photo={photos.votersQueue} sizes="(min-width: 1024px) 55vw, 100vw" aspect="3/2" className="reveal" />
            <div>
              {surveyOpen ? (
                <>
                  <h2 className="text-h2">The {cycleMonth} survey is open</h2>
                  <p className="mt-4 text-lead text-ink-2">
                    Five questions about {cycleMonth}, one for each pillar, answered on a scale of 1 to 10. It takes
                    about two minutes. Your answers go into the {state.currentCycle?.monthYear} edition
                    {nextPublication ? <>, published on {nextPublication}</> : null}. We don’t ask for your name, phone
                    number or address.
                  </p>
                  <div className="mt-8 flex flex-wrap gap-3">
                    <LinkButton href="/survey">Take the {cycleMonth} survey</LinkButton>
                    <LinkButton href="/methodology" variant="secondary">
                      What we ask and why
                    </LinkButton>
                  </div>
                </>
              ) : (
                <>
                  <h2 className="text-h2">Add your voice next month</h2>
                  <p className="mt-4 text-lead text-ink-2">
                    The survey opens once a month. Five questions, about two minutes, and no names or phone numbers.
                    Get an email when the next one opens.
                  </p>
                  <div className="mt-8 flex flex-wrap gap-3">
                    <LinkButton href="/subscribe">Get email updates</LinkButton>
                    <LinkButton href="/methodology" variant="secondary">
                      How the index is made
                    </LinkButton>
                  </div>
                </>
              )}
            </div>
          </div>
        </Container>
      </Section>

      <section className="relative isolate overflow-hidden bg-ink text-white">
        <Image
          src={photos.durbar.src}
          alt=""
          fill
          sizes="100vw"
          className="-z-10 object-cover"
        />
        <div aria-hidden className="absolute inset-0 -z-10 bg-ink/60 lg:bg-[linear-gradient(90deg,rgb(20_33_27/0.85)_0%,rgb(20_33_27/0.6)_50%,rgb(20_33_27/0.2)_100%)]" />
        <Container className="py-section">
          <div className="max-w-2xl">
            <div aria-hidden className="h-1 w-16 bg-gold" />
            <h2 className="mt-6 text-h2 text-white">NSI Honors 2026</h2>
            <p className="mt-4 text-lead text-white/85">
              Ten awards for the institutions, communities and people who made a real difference to Nigerians in
              2026. Nominated by the public, decided by a verified public vote.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <LinkButton href="/honors" variant="gold">
                See the ten categories
              </LinkButton>
            </div>
          </div>
        </Container>
        <Container className="pb-4">
          <PhotoCredit photo={photos.durbar} inverse />
        </Container>
      </section>

      <Section>
        <Container>
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] lg:gap-16">
            <div>
              <h2 className="text-h2">About the index</h2>
              <p className="mt-4 text-body text-ink-2">
                The Nigeria Stability Index is independent and non-political. It is a project of the 24 Angels
                Initiative.
              </p>
              <Link href="/about" className="mt-4 inline-flex min-h-11 items-center gap-1.5 font-semibold text-brand underline underline-offset-[0.22em]">
                About NSI <ArrowRight aria-hidden className="size-4" />
              </Link>
            </div>
            <dl className="reveal-stagger grid gap-px border-y border-line bg-line sm:grid-cols-3">
              <div className="bg-ground py-6 sm:px-6 sm:first:pl-0">
                <dt className="font-serif text-h3 font-semibold">On the 11th</dt>
                <dd className="mt-2 text-small text-ink-2">Each month’s reading is published on the 11th of the next month and then locked, so it can be cited.</dd>
              </div>
              <div className="bg-ground py-6 sm:px-6">
                <dt className="font-serif text-h3 font-semibold">Five pillars</dt>
                <dd className="mt-2 text-small text-ink-2">Security, FX and the economy, investor confidence, governance and social stability.</dd>
              </div>
              <div className="bg-ground py-6 sm:px-6">
                <dt className="font-serif text-h3 font-semibold">People, then evidence</dt>
                <dd className="mt-2 text-small text-ink-2">Anonymous public answers, checked by editors against verified sources.</dd>
              </div>
            </dl>
          </div>
        </Container>
      </Section>
    </>
  );
}
