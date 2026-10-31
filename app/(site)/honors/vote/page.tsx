import type { Metadata } from "next";
import { VoteBallot } from "@/components/honors/VoteBallot";
import { LinkButton } from "@/components/ui/Button";
import { Container } from "@/components/ui/Layout";
import { Breadcrumb, EmptyState } from "@/components/ui/PageHeader";
import { isVotingOpen } from "@/lib/honors/phase";
import { getActiveFinalists, getPublicEdition } from "@/lib/honors/queries";
import { isMailConfigured } from "@/lib/mailer";
import { defaultMetadata } from "@/lib/metadata";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  ...defaultMetadata,
  title: "Vote: NSI Honors 2026",
  description: "Vote for one finalist in each NSI Honors 2026 award. Votes are confirmed by email.",
  alternates: { canonical: "/honors/vote" },
};

type Props = { searchParams: Promise<{ category?: string }> };

export default async function VotePage({ searchParams }: Props) {
  const { category } = await searchParams;
  const edition = await getPublicEdition();
  const open = edition ? isVotingOpen(edition) : false;
  const mailReady = isMailConfigured();
  const finalists = open && edition ? await getActiveFinalists(edition.id) : [];
  const ballot = (edition?.categories ?? [])
    .map((c) => ({
      id: c.id,
      slug: c.slug,
      name: c.name,
      finalists: finalists.filter((f) => f.categoryId === c.id),
    }))
    .filter((c) => c.finalists.length > 0);

  return (
    <Container className="pt-8 pb-16 sm:pt-10 sm:pb-24">
      <Breadcrumb items={[{ href: "/", label: "Home" }, { href: "/honors", label: "NSI Honors" }, { label: "Vote" }]} className="mb-6" />
      <h1 className="text-h2">Vote for the {edition?.title ?? "NSI Honors"} winners</h1>
      <p className="mt-3 max-w-2xl text-body text-ink-2">
        Choose one finalist in as many awards as you like, then confirm with your email. The finalist with the most
        verified votes in each award wins.
      </p>
      <div className="mt-10">
        {!open || ballot.length === 0 ? (
          <EmptyState
            className="max-w-[40rem]"
            title="Voting isn’t open right now"
            action={
              <div className="flex flex-wrap gap-3">
                <LinkButton href="/honors">About NSI Honors</LinkButton>
                <LinkButton href="/subscribe" variant="secondary">
                  Get an email when voting opens
                </LinkButton>
              </div>
            }
          >
            The public vote opens after the finalists are announced. Dates are posted on the NSI Honors page.
          </EmptyState>
        ) : !mailReady ? (
          <EmptyState className="max-w-[40rem]" title="Voting is paused for a moment" action={<LinkButton href="/honors">About NSI Honors</LinkButton>}>
            We can’t send confirmation emails right now, and every vote must be confirmed by email. Please try again
            later.
          </EmptyState>
        ) : (
          <VoteBallot categories={ballot} focusSlug={category ?? null} />
        )}
      </div>
    </Container>
  );
}
