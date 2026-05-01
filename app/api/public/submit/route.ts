import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { MOODS, NIGERIAN_STATES, PILLAR_KEYS, SPOTLIGHT_TAGS } from "@/lib/constants";
import { isValidReferrerCodeFormat } from "@/lib/agentReferrerCode";

const referrerCodeField = z
  .string()
  .trim()
  .regex(/^\d{6}$/, "Referral code must be exactly 6 digits.")
  .nullish()
  .transform((v) => (v == null || v === "" ? undefined : v));

const legacySchema = z.object({
  stabilityScore: z.number().int().min(1).max(10),
  mood: z.enum(MOODS),
  oneWord: z.string().trim().min(1).max(40),
  spotlightState: z.enum(NIGERIAN_STATES).nullable().optional(),
  spotlightTags: z.array(z.enum(SPOTLIGHT_TAGS)).max(8).optional().default([]),
  spotlightComment: z.string().trim().max(600).nullable().optional(),
  referrerCode: referrerCodeField,
});

const pillarResponsesSchema = z.record(z.string(), z.number().int().min(1).max(5)).refine(
  (obj) => {
    for (const key of PILLAR_KEYS) {
      if (typeof obj[key] !== "number" || obj[key] < 1 || obj[key] > 5) return false;
    }
    return true;
  },
  { message: "Must have a value 1–5 for each pillar." }
);

const submitSchema = z.union([
  legacySchema,
  z.object({
    deviceHash: z.string().min(1).optional(),
    pillarResponses: pillarResponsesSchema,
    mood: z.enum(MOODS).nullable().optional(),
    oneWord: z.string().trim().max(40).nullable().optional(),
    spotlightState: z.enum(NIGERIAN_STATES).nullable().optional(),
    spotlightTags: z.array(z.enum(SPOTLIGHT_TAGS)).max(8).optional().default([]),
    spotlightComment: z.string().trim().max(600).nullable().optional(),
    referrerCode: referrerCodeField,
  }),
]);

function looksLikePII(text: string) {
  // Heuristic checks for emails and phone-like sequences.
  const email = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i;
  const phone = /(\+?\d[\d\s().-]{7,}\d)/;
  return email.test(text) || phone.test(text);
}

function formatMonthYear(d: Date) {
  return new Intl.DateTimeFormat("en-NG", { month: "long", year: "numeric" }).format(d);
}

async function resolveAgentIdForSubmit(
  referrerCode: string | undefined
): Promise<{ agentId: string | undefined } | { error: string }> {
  if (referrerCode == null || referrerCode === "") {
    return { agentId: undefined };
  }
  if (!isValidReferrerCodeFormat(referrerCode)) {
    return { error: "Invalid referral code format." };
  }
  const agent = await db.agent.findFirst({
    where: { referrerCode, isActive: true },
    select: { id: true },
  });
  if (!agent) {
    return { error: "Invalid or inactive referral code." };
  }
  return { agentId: agent.id };
}

export async function POST(req: Request) {
  const json = await req.json().catch(() => null);
  const parsed = submitSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid submission payload.", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const data = parsed.data;
  const isPillarPayload = "pillarResponses" in data && data.pillarResponses != null;
  const referrerCode = "referrerCode" in data ? data.referrerCode : undefined;
  const agentResolve = await resolveAgentIdForSubmit(referrerCode);
  if ("error" in agentResolve) {
    return NextResponse.json({ error: agentResolve.error }, { status: 400 });
  }
  const { agentId } = agentResolve;

  let cycle = await db.cycle.findFirst({
    where: { status: "OPEN" },
    orderBy: { createdAt: "desc" },
    select: { id: true, status: true, surveyQuestions: true },
  });

  if (!cycle) {
    if (isPillarPayload) {
      return NextResponse.json({ error: "No open cycle with survey. Collection is closed or not set up." }, { status: 409 });
    }
    cycle = await db.cycle.create({
      data: { status: "OPEN", monthYear: formatMonthYear(new Date()) },
      select: { id: true, status: true, surveyQuestions: true },
    });
  }

  if (cycle.status !== "OPEN") {
    return NextResponse.json({ error: "Collection is currently closed." }, { status: 409 });
  }

  if (isPillarPayload) {
    const surveyQuestions = cycle.surveyQuestions;
    if (!surveyQuestions || !Array.isArray(surveyQuestions) || (surveyQuestions as unknown[]).length !== 5) {
      return NextResponse.json(
        { error: "Current cycle has no survey. Please use the legacy check-in or wait for admin to set up the cycle." },
        { status: 409 }
      );
    }
    const deviceHash = (data as { deviceHash?: string }).deviceHash;
    if (deviceHash) {
      const existing = await db.submission.findFirst({
        where: { cycleId: cycle.id, deviceHash },
        select: { id: true },
      });
      if (existing) {
        return NextResponse.json(
          { error: "You have already submitted for this cycle." },
          { status: 409 }
        );
      }
    }
    const pillarResponses = data.pillarResponses as Record<string, number>;
    const values = PILLAR_KEYS.map((k) => pillarResponses[k]).filter((v): v is number => typeof v === "number");
    const avg = values.length === 5 ? values.reduce((a, b) => a + b, 0) / 5 : 0;
    const stabilityScore = Math.round(avg * 2);
    const clampedScore = Math.min(10, Math.max(1, stabilityScore));

    const pillarData = data as {
      mood?: string | null;
      oneWord?: string | null;
      spotlightState?: string | null;
      spotlightTags?: string[];
      spotlightComment?: string | null;
    };
    await db.submission.create({
      data: {
        cycleId: cycle.id,
        ...(agentId && { agentId }),
        ...(deviceHash && { deviceHash }),
        stabilityScore: clampedScore,
        mood: pillarData.mood ?? null,
        oneWord: pillarData.oneWord ?? null,
        pillarResponses: pillarResponses as object,
        spotlightState: pillarData.spotlightState ?? null,
        spotlightTags: data.spotlightTags ?? [],
        spotlightComment: pillarData.spotlightComment ?? null,
      },
    });
    return NextResponse.json({ ok: true });
  }

  const legacy = data as z.infer<typeof legacySchema>;

  const freeText = [legacy.oneWord, legacy.spotlightComment ?? ""].join(" ");
  if (looksLikePII(freeText)) {
    return NextResponse.json(
      { error: "Please remove personal info (emails/phone numbers) from your submission." },
      { status: 400 }
    );
  }

  await db.submission.create({
    data: {
      cycleId: cycle.id,
      ...(agentId && { agentId }),
      stabilityScore: legacy.stabilityScore,
      mood: legacy.mood,
      oneWord: legacy.oneWord,
      spotlightState: legacy.spotlightState ?? null,
      spotlightTags: legacy.spotlightTags ?? [],
      spotlightComment: legacy.spotlightComment ?? null,
    },
  });

  return NextResponse.json({ ok: true });
}

