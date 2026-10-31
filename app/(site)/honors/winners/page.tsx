import type { Metadata } from "next";
import Link from "next/link";
import { GoldRule } from "@/components/honors/shared";
import { LinkButton } from "@/components/ui/Button";
import { Container } from "@/components/ui/Layout";
import { EmptyState, PageHeader } from "@/components/ui/PageHeader";
import { NOMINEE_TYPE_SHORT } from "@/lib/honors/constants";
import { getPublicEdition, getPublishedWinners } from "@/lib/honors/queries";
import { defaultMetadata } from "@/lib/metadata";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  ...defaultMetadata,
  title: "NSI Honors 2026 winners",
  description: "The winners of NSI Honors 2026, chosen by a verified public vote.",
  alternates: { canonical: "/honors/winners" },
};

export default async function WinnersPage() {
  const edition = await getPublicEdition();
  const winners = edition ? await getPublishedWinners(edition.id) : [];

  return (
    <>
      <PageHeader
        crumbs={[{ href: "/", label: "Home" }, { href: "/honors", label: "NSI Honors" }, { label: "Winners" }]}
        title={`${edition?.title ?? "NSI Honors"} winners`}
        lede="Chosen by a verified public vote from finalists shortlisted out of public nominations."
      />
      <Container className="py-10 sm:py-14">
        {winners.length === 0 ? (
          <EmptyState
            title="Winners haven’t been announced yet"
            action={<LinkButton href="/honors">About NSI Honors</LinkButton>}
          >
            Winners are announced after the public vote closes. Dates are posted on the NSI Honors page.
          </EmptyState>
        ) : (
          <ol className="grid gap-x-12 gap-y-14 md:grid-cols-2">
            {winners.map((w) => (
              <li key={w.id}>
                <GoldRule />
                <h2 className="mt-4 font-sans text-body font-semibold text-gold-ink">{w.name}</h2>
                <p className="mt-1 font-serif text-h2 font-semibold">{w.winnerFinalist?.displayName}</p>
                {w.winnerFinalist ? (
                  <p className="mt-1 text-small text-ink-3">
                    {NOMINEE_TYPE_SHORT[w.winnerFinalist.nomineeType]}
                    {w.winnerFinalist.state ? ` · ${w.winnerFinalist.state}` : ""}
                  </p>
                ) : null}
                {w.winnerCitation ? (
                  <div className="mt-4 flex max-w-[60ch] flex-col gap-3 text-body text-ink-2">
                    {w.winnerCitation.split(/\n{2,}/).map((p, i) => (
                      <p key={i}>{p}</p>
                    ))}
                  </div>
                ) : null}
                <Link href={`/honors/${w.slug}`} className="mt-4 inline-flex min-h-11 items-center font-semibold text-brand underline underline-offset-[0.22em]">
                  All finalists in this award
                </Link>
              </li>
            ))}
          </ol>
        )}
      </Container>
    </>
  );
}
