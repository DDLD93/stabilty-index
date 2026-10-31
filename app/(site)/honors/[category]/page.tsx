import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { categoryPhoto, GoldRule } from "@/components/honors/shared";
import { LinkButton } from "@/components/ui/Button";
import { Figure } from "@/components/ui/Figure";
import { Container } from "@/components/ui/Layout";
import { Breadcrumb } from "@/components/ui/PageHeader";
import { NOMINEE_TYPE_LABELS, NOMINEE_TYPE_SHORT } from "@/lib/honors/constants";
import { isNominationsOpen, isVotingOpen, showsFinalists } from "@/lib/honors/phase";
import { getActiveFinalists, getEditionForYear, getPublicEdition, getTallies } from "@/lib/honors/queries";
import { defaultMetadata } from "@/lib/metadata";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ category: string }> };

async function load(slug: string) {
  const edition = (await getPublicEdition()) ?? (await getEditionForYear(2026));
  const category = edition?.categories.find((c) => c.slug === slug);
  return edition && category ? { edition, category } : null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category: slug } = await params;
  const found = await load(slug);
  if (!found) return { ...defaultMetadata, title: "Category not found", robots: { index: false } };
  return {
    ...defaultMetadata,
    title: `${found.category.name}: ${found.edition.title}`,
    description: found.category.shortDescription,
    alternates: { canonical: `/honors/${slug}` },
  };
}

export default async function HonorsCategoryPage({ params }: Props) {
  const { category: slug } = await params;
  const found = await load(slug);
  if (!found) notFound();
  const { edition, category } = found;

  const finalistsVisible = showsFinalists(edition.status);
  const finalists = finalistsVisible ? (await getActiveFinalists(edition.id)).filter((f) => f.categoryId === category.id) : [];
  const winnerPublished = Boolean(category.winnerPublishedAt && category.winnerFinalistId);
  const winner = winnerPublished ? finalists.find((f) => f.id === category.winnerFinalistId) : null;
  const tallies = winnerPublished && edition.showVoteResults ? await getTallies(edition.id) : null;
  const totalVotes = tallies ? finalists.reduce((sum, f) => sum + (tallies.get(f.id) ?? 0), 0) : 0;
  const nominationsOpen = isNominationsOpen(edition);
  const votingOpen = isVotingOpen(edition);
  const photo = categoryPhoto(category.slug);

  return (
    <>
      <header className="border-b border-line pt-8 pb-10 sm:pt-10 sm:pb-14">
        <Container>
          <Breadcrumb
            items={[{ href: "/", label: "Home" }, { href: "/honors", label: "NSI Honors" }, { label: category.name }]}
            className="mb-8"
          />
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:items-start lg:gap-16">
            <div>
              <GoldRule />
              <h1 className="mt-6 text-display">{category.name}</h1>
              <p className="mt-5 max-w-2xl text-lead text-ink-2">{category.shortDescription}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                {nominationsOpen ? (
                  <LinkButton href={`/honors/nominate?category=${category.slug}`} variant="gold">
                    Nominate for this award
                  </LinkButton>
                ) : null}
                {votingOpen && finalists.length ? (
                  <LinkButton href={`/honors/vote?category=${category.slug}`} variant="gold">
                    Vote in this category
                  </LinkButton>
                ) : null}
                <LinkButton href="/honors#categories" variant="secondary">
                  All categories
                </LinkButton>
              </div>
            </div>
            <Figure photo={photo} sizes="(min-width: 1024px) 40vw, 100vw" aspect="4/3" priority />
          </div>
        </Container>
      </header>

      <Container className="py-10 sm:py-14">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:gap-16">
          <div className="flex flex-col gap-12">
            {winner ? (
              <section aria-labelledby="winner-title" className="border-t-4 border-gold bg-gold-tint px-6 py-6">
                <h2 id="winner-title" className="text-small font-semibold text-gold-ink">
                  Winner, {edition.title}
                </h2>
                <p className="mt-2 font-serif text-h2 font-semibold">{winner.displayName}</p>
                <p className="mt-1 text-small text-ink-2">
                  {NOMINEE_TYPE_SHORT[winner.nomineeType]}
                  {winner.state ? ` · ${winner.state}` : ""}
                </p>
                {category.winnerCitation ? (
                  <div className="mt-4 flex flex-col gap-3 text-body">
                    {category.winnerCitation.split(/\n{2,}/).map((para, i) => (
                      <p key={i}>{para}</p>
                    ))}
                  </div>
                ) : null}
              </section>
            ) : null}

            {finalistsVisible ? (
              <section aria-labelledby="finalists-title">
                <h2 id="finalists-title" className="text-h2">
                  Finalists
                </h2>
                {finalists.length ? (
                  <ul className="mt-6 border-t border-ink">
                    {finalists.map((f) => {
                      const votes = tallies?.get(f.id) ?? 0;
                      return (
                        <li key={f.id} className="border-b border-line py-5">
                          <p className="font-serif text-h3 font-semibold">
                            {f.displayName}
                            {f.id === category.winnerFinalistId && winnerPublished ? <span className="sr-only"> (winner)</span> : null}
                          </p>
                          <p className="mt-1 text-small text-ink-3">
                            {NOMINEE_TYPE_SHORT[f.nomineeType]}
                            {f.state ? ` · ${f.state}` : ""}
                          </p>
                          <p className="mt-3 max-w-[65ch] text-body text-ink-2">{f.summary}</p>
                          {tallies && totalVotes > 0 ? (
                            <p className="mt-3 text-small tabular-nums text-ink-2">
                              {Math.round((votes / totalVotes) * 100)}% of verified votes ({votes.toLocaleString("en-GB")})
                            </p>
                          ) : null}
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <p className="mt-4 text-body text-ink-2">Finalists for this category have not been announced yet.</p>
                )}
              </section>
            ) : null}

            <section aria-labelledby="criteria-title">
              <h2 id="criteria-title" className="text-h2">
                What this award looks for
              </h2>
              <p className="mt-4 max-w-[65ch] text-body text-ink-2">{category.criteria ?? category.shortDescription}</p>
              <p className="mt-4 max-w-[65ch] text-body text-ink-2">
                Nominations should point to evidence: news reports, official figures, project pages or other sources
                the team can check.
              </p>
            </section>
          </div>

          <aside className="flex flex-col gap-8">
            <div className="border-t border-ink pt-5">
              <h2 className="font-sans text-body font-semibold">Who can be nominated</h2>
              <ul className="mt-3 flex list-disc flex-col gap-2 pl-5 text-body text-ink-2">
                {category.allowedNomineeTypes.map((t) => (
                  <li key={t}>{NOMINEE_TYPE_LABELS[t]}</li>
                ))}
              </ul>
            </div>
            <div className="border-t border-ink pt-5">
              <h2 className="font-sans text-body font-semibold">How the winner is chosen</h2>
              <p className="mt-3 text-body text-ink-2">
                Finalists are shortlisted from public nominations. The finalist with the most verified public votes
                wins.{" "}
                <Link href="/honors#how-it-works" className="text-brand underline underline-offset-[0.22em]">
                  How it works
                </Link>
              </p>
            </div>
            <Link href="/honors" className="inline-flex min-h-11 items-center gap-1.5 font-semibold text-brand underline underline-offset-[0.22em]">
              <ArrowLeft aria-hidden className="size-4" /> Back to NSI Honors
            </Link>
          </aside>
        </div>
      </Container>
    </>
  );
}
