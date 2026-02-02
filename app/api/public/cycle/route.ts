import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const deviceHash = new URL(req.url).searchParams.get("deviceHash")?.trim() || null;

  const cycle = await db.cycle.findFirst({
    where: { status: "OPEN" },
    orderBy: { createdAt: "desc" },
    select: { id: true, monthYear: true, surveyQuestions: true },
  });

  if (!cycle || !cycle.surveyQuestions || !Array.isArray(cycle.surveyQuestions)) {
    return NextResponse.json({ cycle: null, ...(deviceHash != null && { alreadySubmitted: false }) });
  }

  if ((cycle.surveyQuestions as unknown[]).length !== 5) {
    return NextResponse.json({ cycle: null, ...(deviceHash != null && { alreadySubmitted: false }) });
  }

  let alreadySubmitted = false;
  if (deviceHash) {
    const existing = await db.submission.findFirst({
      where: { cycleId: cycle.id, deviceHash },
      select: { id: true },
    });
    alreadySubmitted = !!existing;
  }

  return NextResponse.json({
    cycle: {
      id: cycle.id,
      monthYear: cycle.monthYear,
      surveyQuestions: cycle.surveyQuestions,
    },
    ...(deviceHash != null && { alreadySubmitted }),
  });
}
