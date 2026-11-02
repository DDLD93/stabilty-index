import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { categoryPhoto, GoldRule, Timeline } from "@/components/honors/shared";
import { LinkButton } from "@/components/ui/Button";
import { PhotoCredit } from "@/components/ui/Figure";
import { Container, Section } from "@/components/ui/Layout";
import { Breadcrumb } from "@/components/ui/PageHeader";
import { NOMINEE_TYPE_SHORT, type EditionStatus } from "@/lib/honors/constants";
import { getTimeline, isNominationsOpen, isVotingOpen } from "@/lib/honors/phase";
import { getEditionForYear, getPublicEdition, getPublishedWinners } from "@/lib/honors/queries";
import { defaultMetadata } from "@/lib/metadata";
import { photos } from "@/lib/photos";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  ...defaultMetadata,
  title: "NSI Honors 2026",
  description:
    "Ten awards for the institutions, communities and people who made a real difference to Nigerians in 2026. Nominated by the public, decided by a verified public vote.",
  alternates: { canonical: "/honors" },
};

const STAGE_TEXT: Record<string, string> = {
  nominate:
    "Tell us who deserves recognition and why, with links to evidence such as news reports, official data or project pages. You can nominate in more than one category.",
  shortlist:
    "The NSI team checks every nomination against the category’s criteria and the evidence, and names the finalists for each award.",
  vote: "Anyone can vote for one finalist per category. Votes count once they are confirmed by email, one per email address per category.",
  announce: "The finalist with the most verified votes in each category wins. Results are published here with a short citation for each winner.",
};

const COUNT_WORDS = ["no", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve"];

/** "ten" for 10, so the heading follows whichever categories are live; numerals past twelve. */
function countWord(n: number): string {
  return COUNT_WORDS[n] ?? String(n);
}

const FAQ = [
  {
    q: "Who can nominate?",
    a: "Anyone. You give your name and email so the team can follow up, and you tell us how you know the nominee. Your contact details are never published.",
  },
  {
    q: "Who can be nominated?",
    a: "Public institutions and agencies, states and local government areas, organisations, companies and NGOs, and individuals. Each category lists who is eligible for it.",
  },
  {
    q: "How are winners chosen?",
    a: "The NSI team reviews nominations and shortlists finalists for each category. The public then votes, and the finalist with the most verified votes wins. The team only steps in to remove fraudulent votes or settle a tie, and records the reason.",
  },
  {
    q: "How do you stop fake votes?",
    a: "Each vote must be confirmed through a link sent to the voter’s email, and each email address can vote once per category. We also watch for bulk voting from one device or network and remove votes that break the rules.",
  },
  {
    q: "Is an award an endorsement by NSI?",
    a: "No. NSI runs the process and publishes the result. Winners are chosen by the public vote, not by NSI’s editors, and the monthly index stays independent of the awards.",
  },
];

export default async function HonorsPage() {
  const edition = (await getPublicEdition()) ?? (await getEditionForYear(2026));
  const status: EditionStatus = edition?.status ?? "DRAFT";
  const isDraft = status === "DRAFT";
  const nominationsOpen = edition ? isNominationsOpen(edition) : false;
  const votingOpen = edition ? isVotingOpen(edition) : false;
  const winners = edition && !isDraft ? await getPublishedWinners(edition.id) : [];
  const title = edition?.title ?? "NSI Honors 2026";
  const categories = edition?.categories ?? [];

  const phaseLine = isDraft
    ? "Nominations open soon. Dates will be announced here."
    : nominationsOpen
      ? "Nominations are open."
      : status === "NOMINATIONS_OPEN"
        ? "Nominations will open shortly."
        : status === "SHORTLISTING"
          ? "Nominations have closed. Finalists will be announced before the public vote."
          : votingOpen
            ? "The public vote is open."
            : status === "VOTING_OPEN" || status === "VOTING_CLOSED"
              ? "Voting has closed. Winners will be announced soon."
              : "The winners have been announced.";

  const primary = nominationsOpen ? (
    <LinkButton href="/honors/nominate" variant="gold">
      Make a nomination
    </LinkButton>
  ) : votingOpen ? (
    <LinkButton href="/honors/vote" variant="gold">
      Vote now
    </LinkButton>
  ) : winners.length ? (
    <LinkButton href="/honors/winners" variant="gold">
      See the winners
    </LinkButton>
  ) : (
    <LinkButton href="/subscribe" variant="gold">
      Get an email when nominations open
    </LinkButton>
  );

  return (
    <>
      <section className="relative isolate overflow-hidden bg-ink text-white">
        <Image src={photos.durbar.src} alt="" fill priority sizes="100vw" className="-z-10 object-cover" />
        <div aria-hidden className="absolute inset-0 -z-10 bg-ink/55 lg:bg-[linear-gradient(90deg,rgb(20_33_27/0.82)_0%,rgb(20_33_27/0.55)_55%,rgb(20_33_27/0.25)_100%)]" />
        <Container className="pt-8 pb-14 sm:pb-20">
          <Breadcrumb
            items={[{ href: "/", label: "Home" }, { label: "NSI Honors" }]}
            className="mb-10 text-white/75 [&_a]:text-white/85 [&_a]:decoration-white/40 [&_span[aria-current]]:text-white [&_svg]:text-white/60"
          />
          <div className="max-w-3xl">
            <GoldRule />
            <h1 className="mt-6 text-display text-white">{title}</h1>
            <p className="mt-5 max-w-2xl text-lead text-white/85">
              Ten awards for the institutions, communities and people who made a real difference to Nigerians in
              2026. You nominate; a verified public vote decides.
            </p>
            <p className="mt-6 font-semibold text-gold">{phaseLine}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              {primary}
              <LinkButton href="#how-it-works" variant="inverse">
                How it works
              </LinkButton>
            </div>
          </div>
        </Container>
        <Container className="pb-4">
          <PhotoCredit photo={photos.durbar} inverse />
        </Container>
      </section>

      {winners.length ? (
        <Section>
          <Container>
            <h2 className="text-h2">The winners</h2>
            <ul className="mt-8 grid gap-6 border-t border-ink pt-6 md:grid-cols-2">
              {winners.map((w) => (
                <li key={w.id}>
                  <Link href={`/honors/${w.slug}`} className="group block">
                    <span className="text-small text-ink-3">{w.name}</span>
                    <span className="mt-1 block font-serif text-h3 font-semibold group-hover:underline">{w.winnerFinalist?.displayName}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </Container>
        </Section>
      ) : null}

      <Section id="categories" className="scroll-mt-20">
        <Container>
          <div className="max-w-2xl">
            <h2 className="text-h2">
              {categories.length === 1 ? "The category" : `The ${countWord(categories.length)} categories`}
            </h2>
            <p className="mt-4 text-lead text-ink-2">
              Each award recognises work done in 2026, backed by evidence. Choose a category to read what it looks for
              and who can be nominated.
            </p>
          </div>
          <ul className="reveal-stagger mt-10 grid gap-x-8 gap-y-6 sm:mt-12 sm:grid-cols-2 sm:gap-y-12 xl:grid-cols-5">
            {categories.map((c) => {
              const photo = categoryPhoto(c.slug);
              return (
                <li key={c.id}>
                  <Link href={`/honors/${c.slug}`} className="group grid h-full grid-cols-[5.5rem_minmax(0,1fr)] items-start gap-x-4 sm:flex sm:flex-col">
                    <span className="relative row-span-2 block aspect-square overflow-hidden bg-surface sm:aspect-[3/2] sm:w-full">
                      <Image
                        src={photo.src}
                        alt=""
                        fill
                        sizes="(min-width: 1280px) 18vw, (min-width: 640px) 45vw, 88px"
                        className="object-cover transition-transform duration-200 ease-[var(--ease-out-strong)] [@media(hover:hover)]:group-hover:scale-[1.03]"
                      />
                    </span>
                    <span className="font-serif text-h3 font-semibold group-hover:underline group-hover:underline-offset-[0.18em] sm:mt-4">
                      {c.name}
                    </span>
                    <span className="mt-1 text-small text-ink-2 sm:mt-2">{c.shortDescription}</span>
                    <span className="mt-3 hidden text-meta text-ink-3 sm:block">
                      Open to: {c.allowedNomineeTypes.map((t) => NOMINEE_TYPE_SHORT[t]).join(", ")}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
          <p className="mt-10 text-meta text-ink-3">
            Category photos show the kind of work each award recognises. They do not show nominees or winners.{" "}
            <Link href="/credits" className="underline">
              Photo credits
            </Link>
          </p>
        </Container>
      </Section>

      <Section tone="surface" id="how-it-works" className="scroll-mt-20">
        <Container>
          <div className="max-w-2xl">
            <h2 className="text-h2">How it works</h2>
            <p className="mt-4 text-lead text-ink-2">
              Four stages, in this order. Dates appear here as soon as they are set.
            </p>
          </div>
          {edition ? <Timeline steps={getTimeline(edition)} descriptions={STAGE_TEXT} className="mt-10 border border-line" /> : null}
        </Container>
      </Section>

      <Section>
        <Container>
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)] lg:gap-16">
            <div>
              <h2 className="text-h2">Questions</h2>
              <p className="mt-4 text-body text-ink-2">
                Anything else?{" "}
                <Link href="/contact" className="text-brand underline underline-offset-[0.22em]">
                  Contact the team
                </Link>
                .
              </p>
            </div>
            <div className="border-t border-ink">
              {FAQ.map((item) => (
                <details key={item.q} className="group border-b border-line">
                  <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 py-3 font-semibold">
                    {item.q}
                    <ArrowRight aria-hidden className="size-5 shrink-0 text-ink-3 transition-transform duration-200 group-open:rotate-90" />
                  </summary>
                  <p className="pb-5 text-body text-ink-2">{item.a}</p>
                </details>
              ))}
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
