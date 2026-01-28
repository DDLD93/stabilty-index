import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdminSession } from "@/lib/adminSession";
import { z } from "zod";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function formatMonthYear(d: Date) {
  return new Intl.DateTimeFormat("en-NG", { month: "long", year: "numeric" }).format(d);
}

const actionSchema = z.object({
  action: z.enum(["OPEN", "CLOSE", "NEXT"]),
});

export async function GET() {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const currentCycle = await db.cycle.findFirst({
    orderBy: { createdAt: "desc" },
    select: { id: true, status: true, monthYear: true, createdAt: true },
  });

  const counts = currentCycle
    ? await db.submission.groupBy({
        by: ["isFlagged"],
        where: { cycleId: currentCycle.id },
        _count: { _all: true },
      })
    : [];

  const total = counts.reduce((acc, c) => acc + c._count._all, 0);
  const flagged = counts.find((c) => c.isFlagged)?._count._all ?? 0;

  return NextResponse.json({ currentCycle, counts: { total, flagged } });
}

export async function PATCH(req: Request) {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const json = await req.json().catch(() => null);
  const parsed = actionSchema.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: "Invalid action." }, { status: 400 });

  const { action } = parsed.data;
  const currentCycle = await db.cycle.findFirst({ orderBy: { createdAt: "desc" } });

  if (!currentCycle) {
    const created = await db.cycle.create({
      data: { status: "OPEN", monthYear: formatMonthYear(new Date()) },
    });
    return NextResponse.json({ currentCycle: created });
  }

  if (action === "OPEN") {
    const updated = await db.cycle.update({ where: { id: currentCycle.id }, data: { status: "OPEN" } });
    await db.auditLog.create({
      data: { adminUserId: (session.user as { id?: string } | undefined)?.id, action: "AdminOpenCycle" },
    });
    return NextResponse.json({ currentCycle: updated });
  }

  if (action === "CLOSE") {
    const updated = await db.cycle.update({ where: { id: currentCycle.id }, data: { status: "CLOSED" } });
    await db.auditLog.create({
      data: { adminUserId: (session.user as { id?: string } | undefined)?.id, action: "AdminCloseCycle" },
    });
    return NextResponse.json({ currentCycle: updated });
  }

  // NEXT: archive current and create a new OPEN cycle
  const archived = await db.cycle.update({
    where: { id: currentCycle.id },
    data: { status: "ARCHIVED" },
  });
  const created = await db.cycle.create({
    data: { status: "OPEN", monthYear: formatMonthYear(new Date()) },
  });
  await db.auditLog.create({
    data: {
      adminUserId: (session.user as { id?: string } | undefined)?.id,
      action: "AdminCreateNextCycle",
      metadata: { archivedCycleId: archived.id, newCycleId: created.id },
    },
  });
  return NextResponse.json({ currentCycle: created });
}

