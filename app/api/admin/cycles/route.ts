import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdminSession } from "@/lib/adminSession";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const cycles = await db.cycle.findMany({
    orderBy: { createdAt: "desc" },
    select: { id: true, monthYear: true, status: true },
  });

  const currentCycleId = cycles[0]?.id ?? null;

  return NextResponse.json({ cycles, currentCycleId });
}
