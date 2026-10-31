import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { isValidReferrerCodeFormat } from "@/lib/referrerCode";
import { deviceKey, emailHash, getIpHash, newReference } from "@/lib/honors/crypto";
import { sendNominationReceipt } from "@/lib/honors/emails";
import { isNominationsOpen } from "@/lib/honors/phase";
import { nominationSchema } from "@/lib/honors/schemas";
import { isMailConfigured } from "@/lib/mailer";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const PER_IP_PER_HOUR = 30;
const PER_EMAIL_PER_DAY = 20;

export async function POST(req: Request) {
  const parsed = nominationSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    return NextResponse.json(
      { error: issue?.message ?? "Please check the form.", field: issue?.path?.[0] ?? null },
      { status: 400 },
    );
  }
  const input = parsed.data;

  const category = await db.honorsCategory.findUnique({
    where: { id: input.categoryId },
    include: { edition: true },
  });
  if (!category || !category.isActive) {
    return NextResponse.json({ error: "That category is not available." }, { status: 404 });
  }
  const edition = category.edition;

  // Honeypot: look successful, store nothing.
  if (input.website) {
    return NextResponse.json({ reference: newReference(edition.year) }, { status: 201 });
  }

  if (!isNominationsOpen(edition)) {
    return NextResponse.json({ error: "Nominations are closed." }, { status: 409 });
  }
  if (!category.allowedNomineeTypes.includes(input.nomineeType)) {
    return NextResponse.json({ error: "That kind of nominee can’t be nominated in this category.", field: "nomineeType" }, { status: 400 });
  }

  const ipHash = getIpHash(req);
  const nominatorEmailHash = emailHash(input.nominatorEmail);
  const since = (ms: number) => new Date(Date.now() - ms);

  const [ipCount, emailCount] = await Promise.all([
    ipHash ? db.honorsNomination.count({ where: { ipHash, createdAt: { gte: since(3600_000) } } }) : 0,
    db.honorsNomination.count({ where: { nominatorEmailHash, createdAt: { gte: since(86_400_000) } } }),
  ]);
  if (ipCount >= PER_IP_PER_HOUR || emailCount >= PER_EMAIL_PER_DAY) {
    return NextResponse.json({ error: "Too many nominations in a short time. Please try again later." }, { status: 429 });
  }

  const nomineeName = input.nomineeName.trim();
  const duplicate = await db.honorsNomination.findFirst({
    where: {
      categoryId: category.id,
      nominatorEmailHash,
      nomineeName: { equals: nomineeName, mode: "insensitive" },
    },
    select: { reference: true },
  });
  if (duplicate) {
    return NextResponse.json(
      { error: `You have already nominated ${nomineeName} in this category (reference ${duplicate.reference}).` },
      { status: 409 },
    );
  }

  let agentId: string | undefined;
  if (input.referrerCode && isValidReferrerCodeFormat(input.referrerCode)) {
    const agent = await db.agent.findFirst({ where: { referrerCode: input.referrerCode, isActive: true }, select: { id: true } });
    agentId = agent?.id;
  }

  const nomination = await db.honorsNomination.create({
    data: {
      reference: newReference(edition.year),
      editionId: edition.id,
      categoryId: category.id,
      nomineeType: input.nomineeType,
      nomineeName,
      nomineeState: input.nomineeState ?? null,
      nomineeLga: input.nomineeLga?.trim() || null,
      nomineeAffiliation: input.nomineeAffiliation?.trim() || null,
      reason: input.reason.trim(),
      evidenceUrls: input.evidenceUrls,
      nominatorName: input.nominatorName?.trim() || null,
      nominatorEmail: input.nominatorEmail.trim(),
      nominatorEmailHash,
      nominatorRelation: input.nominatorRelation,
      agentId,
      deviceHash: deviceKey(input.deviceHash),
      ipHash,
    },
    select: { reference: true },
  });

  const receipt = isMailConfigured();
  if (receipt) {
    sendNominationReceipt(input.nominatorEmail.trim(), {
      reference: nomination.reference,
      nominee: nomineeName,
      category: category.name,
      editionTitle: edition.title,
    }).catch((error) => console.error("[honors] nomination receipt failed", error));
  }

  return NextResponse.json({ reference: nomination.reference, receipt }, { status: 201 });
}
