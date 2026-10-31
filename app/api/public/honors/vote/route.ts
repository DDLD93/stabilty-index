import { NextResponse } from "next/server";
import type { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import { VOTE_LINK_HOURS } from "@/lib/honors/constants";
import { deviceKey, emailHash, getIpHash, hashToken, newToken } from "@/lib/honors/crypto";
import { sendVoteConfirmation } from "@/lib/honors/emails";
import { isVotingOpen } from "@/lib/honors/phase";
import { voteRequestSchema } from "@/lib/honors/schemas";
import { isMailConfigured } from "@/lib/mailer";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const PER_IP_PER_HOUR = 30; // soft: many people share one mobile-network address
const PER_EMAIL_PER_HOUR = 5;
const EMAILS_PER_DEVICE_PER_DAY = 3;

function maskEmail(email: string) {
  const [local, domain] = email.split("@");
  return `${local.slice(0, 2)}${"•".repeat(Math.max(1, local.length - 2))}@${domain}`;
}

export async function POST(req: Request) {
  const parsed = voteRequestSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Please check your choices." }, { status: 400 });
  }
  const input = parsed.data;

  const edition = await db.honorsEdition.findFirst({ where: { status: "VOTING_OPEN" }, orderBy: { year: "desc" } });
  if (!edition || !isVotingOpen(edition)) {
    return NextResponse.json({ error: "Voting is not open." }, { status: 409 });
  }
  if (!isMailConfigured()) {
    return NextResponse.json({ error: "Voting is temporarily unavailable. Please try again later." }, { status: 503 });
  }
  if (input.website) {
    return NextResponse.json({ maskedEmail: maskEmail(input.email.trim()), expiresInHours: VOTE_LINK_HOURS }, { status: 202 });
  }

  // One choice per category, and every choice must be an active finalist in an active category of this edition.
  const byCategory = new Map(input.selections.map((s) => [s.categoryId, s.finalistId]));
  if (byCategory.size !== input.selections.length) {
    return NextResponse.json({ error: "Choose one finalist per category." }, { status: 400 });
  }
  const finalists = await db.honorsFinalist.findMany({
    where: { id: { in: [...byCategory.values()] }, editionId: edition.id, isActive: true, category: { isActive: true } },
    select: { id: true, categoryId: true, displayName: true, category: { select: { name: true } } },
  });
  const valid = finalists.filter((f) => byCategory.get(f.categoryId) === f.id);
  if (valid.length !== byCategory.size) {
    return NextResponse.json({ error: "One of your choices is no longer on the ballot. Please refresh and try again." }, { status: 400 });
  }

  const ipHash = getIpHash(req);
  const voterHash = emailHash(input.email);
  const device = deviceKey(input.deviceHash);
  const hourAgo = new Date(Date.now() - 3600_000);
  const dayAgo = new Date(Date.now() - 86_400_000);

  const [ipCount, emailCount, deviceEmails] = await Promise.all([
    ipHash ? db.honorsVoteRequest.count({ where: { ipHash, createdAt: { gte: hourAgo } } }) : 0,
    db.honorsVoteRequest.count({ where: { emailHash: voterHash, createdAt: { gte: hourAgo } } }),
    device
      ? db.honorsVoteRequest.findMany({ where: { deviceHash: device, createdAt: { gte: dayAgo } }, select: { emailHash: true }, distinct: ["emailHash"] })
      : Promise.resolve([] as { emailHash: string }[]),
  ]);
  const newEmailOnDevice = !deviceEmails.some((d) => d.emailHash === voterHash);
  if (ipCount >= PER_IP_PER_HOUR || emailCount >= PER_EMAIL_PER_HOUR || (newEmailOnDevice && deviceEmails.length >= EMAILS_PER_DEVICE_PER_DAY)) {
    return NextResponse.json({ error: "Too many vote requests in a short time. Please try again later." }, { status: 429 });
  }

  const token = newToken();
  const expiresAt = new Date(Date.now() + VOTE_LINK_HOURS * 3600_000);
  const request = await db.honorsVoteRequest.create({
    data: {
      editionId: edition.id,
      tokenHash: hashToken(token),
      emailHash: voterHash,
      selections: valid.map((f) => ({ categoryId: f.categoryId, finalistId: f.id })) as unknown as Prisma.InputJsonValue,
      deviceHash: device,
      ipHash,
      expiresAt,
    },
    select: { id: true },
  });

  try {
    await sendVoteConfirmation(input.email.trim(), {
      token,
      editionTitle: edition.title,
      choices: valid.map((f) => `${f.category.name}: ${f.displayName}`),
      hours: VOTE_LINK_HOURS,
    });
  } catch (error) {
    console.error("[honors] vote email failed", error);
    await db.honorsVoteRequest.delete({ where: { id: request.id } }).catch(() => undefined);
    return NextResponse.json({ error: "We couldn’t send the confirmation email. Please check the address and try again." }, { status: 502 });
  }

  return NextResponse.json({ maskedEmail: maskEmail(input.email.trim()), expiresInHours: VOTE_LINK_HOURS }, { status: 202 });
}
