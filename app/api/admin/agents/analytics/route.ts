import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/adminSession";
import { db } from "@/lib/db";
import { getAgentCountsForCycle } from "@/lib/admin/agentAnalytics";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const url = new URL(req.url);
  let cycleId = url.searchParams.get("cycleId")?.trim() || null;

  if (!cycleId) {
    const current = await db.cycle.findFirst({
      orderBy: { createdAt: "desc" },
      select: { id: true },
    });
    cycleId = current?.id ?? null;
  }

  if (!cycleId) {
    return NextResponse.json({ error: "No cycle found. Create a cycle first." }, { status: 400 });
  }

  const cycle = await db.cycle.findUnique({
    where: { id: cycleId },
    select: { id: true, monthYear: true, status: true },
  });
  if (!cycle) {
    return NextResponse.json({ error: "Cycle not found." }, { status: 404 });
  }

  const data = await getAgentCountsForCycle(cycle.id);

  return NextResponse.json({
    cycle: {
      id: cycle.id,
      monthYear: cycle.monthYear,
      status: cycle.status,
    },
    ...data,
  });
}
