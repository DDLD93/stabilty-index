import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { hashToken } from "@/lib/honors/crypto";
import { isVotingOpen } from "@/lib/honors/phase";
import { voteConfirmSchema } from "@/lib/honors/schemas";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Selection = { categoryId: string; finalistId: string };

/**
 * Confirms a vote request. POST only: email link scanners open GET links
 * automatically, so the page asks the person to press a button.
 */
export async function POST(req: Request) {
  const parsed = voteConfirmSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid link." }, { status: 400 });

  const request = await db.honorsVoteRequest.findUnique({
    where: { tokenHash: hashToken(parsed.data.token) },
    include: { edition: true },
  });
  if (!request) return NextResponse.json({ error: "This link is not valid." }, { status: 404 });
  if (request.consumedAt) return NextResponse.json({ error: "This vote has already been confirmed." }, { status: 410 });
  if (request.expiresAt < new Date()) return NextResponse.json({ error: "This link has expired. Please vote again to get a new one." }, { status: 410 });
  if (!isVotingOpen(request.edition)) return NextResponse.json({ error: "Voting has closed." }, { status: 409 });

  // Claim the request atomically so a double click can't count twice.
  const claimed = await db.honorsVoteRequest.updateMany({
    where: { id: request.id, consumedAt: null },
    data: { consumedAt: new Date() },
  });
  if (claimed.count === 0) return NextResponse.json({ error: "This vote has already been confirmed." }, { status: 410 });

  const selections = (Array.isArray(request.selections) ? request.selections : []) as Selection[];
  const finalists = await db.honorsFinalist.findMany({
    where: { id: { in: selections.map((s) => s.finalistId) } },
    select: { id: true, isActive: true, displayName: true, category: { select: { id: true, slug: true, name: true, isActive: true } } },
  });
  const byId = new Map(finalists.map((f) => [f.id, f]));
  const existing = await db.honorsVote.findMany({
    where: { emailHash: request.emailHash, categoryId: { in: selections.map((s) => s.categoryId) } },
    select: { categoryId: true },
  });
  const alreadyVoted = new Set(existing.map((v) => v.categoryId));

  const results: { category: string; slug: string; finalist: string; status: "recorded" | "already_voted" | "withdrawn" }[] = [];
  const toCreate: { editionId: string; categoryId: string; finalistId: string; emailHash: string; deviceHash: string | null; ipHash: string | null; requestId: string }[] = [];

  for (const s of selections) {
    const f = byId.get(s.finalistId);
    if (!f || f.category.id !== s.categoryId) continue;
    if (!f.isActive || !f.category.isActive) {
      results.push({ category: f.category.name, slug: f.category.slug, finalist: f.displayName, status: "withdrawn" });
    } else if (alreadyVoted.has(s.categoryId)) {
      results.push({ category: f.category.name, slug: f.category.slug, finalist: f.displayName, status: "already_voted" });
    } else {
      toCreate.push({
        editionId: request.editionId,
        categoryId: s.categoryId,
        finalistId: s.finalistId,
        emailHash: request.emailHash,
        deviceHash: request.deviceHash,
        ipHash: request.ipHash,
        requestId: request.id,
      });
      results.push({ category: f.category.name, slug: f.category.slug, finalist: f.displayName, status: "recorded" });
    }
  }

  // The unique (categoryId, emailHash) index settles any race between two confirmations.
  if (toCreate.length) await db.honorsVote.createMany({ data: toCreate, skipDuplicates: true });

  return NextResponse.json({ results });
}
