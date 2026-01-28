import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { MOODS, NIGERIAN_STATES, SPOTLIGHT_TAGS } from "@/lib/constants";

const submitSchema = z.object({
  stabilityScore: z.number().int().min(1).max(10),
  mood: z.enum(MOODS),
  oneWord: z.string().trim().min(1).max(40),
  spotlightState: z.enum(NIGERIAN_STATES).nullable().optional(),
  spotlightTags: z.array(z.enum(SPOTLIGHT_TAGS)).max(8).optional().default([]),
  spotlightComment: z.string().trim().max(600).nullable().optional(),
});

function looksLikePII(text: string) {
  // Heuristic checks for emails and phone-like sequences.
  const email = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i;
  const phone = /(\+?\d[\d\s().-]{7,}\d)/;
  return email.test(text) || phone.test(text);
}

function formatMonthYear(d: Date) {
  return new Intl.DateTimeFormat("en-NG", { month: "long", year: "numeric" }).format(d);
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
  const freeText = [data.oneWord, data.spotlightComment ?? ""].join(" ");
  if (looksLikePII(freeText)) {
    return NextResponse.json(
      { error: "Please remove personal info (emails/phone numbers) from your submission." },
      { status: 400 }
    );
  }

  let cycle = await db.cycle.findFirst({
    where: { status: "OPEN" },
    orderBy: { createdAt: "desc" },
    select: { id: true, status: true },
  });

  if (!cycle) {
    // Bootstraps initial collection cycle (admin can later close/advance cycles).
    cycle = await db.cycle.create({
      data: { status: "OPEN", monthYear: formatMonthYear(new Date()) },
      select: { id: true, status: true },
    });
  }

  if (cycle.status !== "OPEN") {
    return NextResponse.json({ error: "Collection is currently closed." }, { status: 409 });
  }

  await db.submission.create({
    data: {
      cycleId: cycle.id,
      stabilityScore: data.stabilityScore,
      mood: data.mood,
      oneWord: data.oneWord,
      spotlightState: data.spotlightState ?? null,
      spotlightTags: data.spotlightTags ?? [],
      spotlightComment: data.spotlightComment ?? null,
    },
  });

  return NextResponse.json({ ok: true });
}

