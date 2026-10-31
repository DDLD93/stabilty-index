import type { Metadata } from "next";
import { ConfirmVote } from "@/components/honors/ConfirmVote";
import { LinkButton } from "@/components/ui/Button";
import { Container } from "@/components/ui/Layout";
import { EmptyState } from "@/components/ui/PageHeader";
import { db } from "@/lib/db";
import { hashToken } from "@/lib/honors/crypto";
import { isVotingOpen } from "@/lib/honors/phase";
import { defaultMetadata } from "@/lib/metadata";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  ...defaultMetadata,
  title: "Confirm your vote",
  robots: { index: false, follow: false },
};

type Props = { searchParams: Promise<{ token?: string }> };

type Selection = { categoryId: string; finalistId: string };

export default async function ConfirmVotePage({ searchParams }: Props) {
  const { token } = await searchParams;
  // Look the request up without using it: only the button press confirms.
  const request = token && token.length >= 20 ? await db.honorsVoteRequest.findUnique({ where: { tokenHash: hashToken(token) }, include: { edition: true } }) : null;

  let problem: { title: string; body: string } | null = null;
  if (!token) problem = { title: "Open the link from your email", body: "To confirm a vote, open the link we emailed you. It brings you back to this page." };
  else if (!request) problem = { title: "This link isn’t valid", body: "It may have been copied incompletely. Try opening it straight from the email, or vote again to get a new one." };
  else if (request.consumedAt) problem = { title: "This vote is already confirmed", body: "Each link works once. Your earlier confirmation still stands." };
  else if (request.expiresAt < new Date()) problem = { title: "This link has expired", body: "Confirmation links last 24 hours. Vote again to get a new one." };
  else if (!isVotingOpen(request.edition)) problem = { title: "Voting has closed", body: "This link was not confirmed before voting closed, so it can’t be counted." };

  const selections = (request && Array.isArray(request.selections) ? request.selections : []) as Selection[];
  const finalists = selections.length
    ? await db.honorsFinalist.findMany({
        where: { id: { in: selections.map((s) => s.finalistId) } },
        select: { id: true, displayName: true, category: { select: { name: true, sortOrder: true } } },
        orderBy: { category: { sortOrder: "asc" } },
      })
    : [];

  return (
    <Container className="pt-10 pb-16 sm:pt-14 sm:pb-24">
      <div className="max-w-[40rem]">
        <h1 className="text-h2">Confirm your vote</h1>
        {problem ? (
          <EmptyState
            className="mt-8"
            title={problem.title}
            action={
              <div className="flex flex-wrap gap-3">
                <LinkButton href="/honors/vote">Go to the ballot</LinkButton>
                <LinkButton href="/honors" variant="secondary">
                  About NSI Honors
                </LinkButton>
              </div>
            }
          >
            {problem.body}
          </EmptyState>
        ) : (
          <>
            <p className="mt-3 text-body text-ink-2">Check your choices, then press the button. Your vote counts once confirmed.</p>
            <ul className="mt-8 border-t border-ink">
              {finalists.map((f) => (
                <li key={f.id} className="border-b border-line py-4">
                  <span className="block text-small text-ink-3">{f.category.name}</span>
                  <span className="block font-serif text-h3 font-semibold">{f.displayName}</span>
                </li>
              ))}
            </ul>
            <div className="mt-8">
              <ConfirmVote token={token!} />
            </div>
          </>
        )}
      </div>
    </Container>
  );
}
