import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const cycle = await db.cycle.findFirst({
    where: { status: "OPEN" },
    orderBy: { createdAt: "desc" },
    select: { id: true, monthYear: true, surveyQuestions: true },
  });

  if (!cycle || !cycle.surveyQuestions || !Array.isArray(cycle.surveyQuestions)) {
    return NextResponse.json({ cycle: null });
  }

  if ((cycle.surveyQuestions as unknown[]).length !== 5) {
    return NextResponse.json({ cycle: null });
  }

  return NextResponse.json({
    cycle: {
      id: cycle.id,
      monthYear: cycle.monthYear,
      surveyQuestions: cycle.surveyQuestions,
    },
  });
}
