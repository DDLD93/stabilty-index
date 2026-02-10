import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdminSession, getAuditAdminUserId } from "@/lib/adminSession";
import { PILLAR_KEYS } from "@/lib/constants";
import { z } from "zod";
import type { Prisma } from "@prisma/client";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function formatMonthYear(d: Date) {
  return new Intl.DateTimeFormat("en-NG", { month: "long", year: "numeric" }).format(d);
}

const surveyQuestionSchema = z.object({
  pillarKey: z.string(),
  pillarLabel: z.string(),
  questionText: z.string().trim().min(1),
});

const actionSchema = z.object({
  action: z.enum(["OPEN", "CLOSE", "NEXT"]),
});

const surveySchema = z.object({
  surveyQuestions: z.array(surveyQuestionSchema).length(5).refine(
    (arr) => {
      const keys = arr.map((q) => q.pillarKey).sort().join(",");
      const expected = [...PILLAR_KEYS].sort().join(",");
      return keys === expected;
    },
    { message: "Must have one question per pillar (Security, FX & Economy, Investor Confidence, Governance, Social Stability)." }
  ),
  action: z.enum(["OPEN"]).optional(),
});

const patchSchema = z.union([actionSchema, surveySchema]);

export async function GET() {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const currentCycle = await db.cycle.findFirst({
    orderBy: { createdAt: "desc" },
    select: { id: true, status: true, monthYear: true, surveyQuestions: true, createdAt: true },
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

  const adminUserId = await getAuditAdminUserId(session);

  const json = await req.json().catch(() => null);
  const parsed = patchSchema.safeParse(json);
  if (!parsed.success) {
    const msg = parsed.error.errors[0]?.message ?? "Invalid request.";
    return NextResponse.json({ error: msg }, { status: 400 });
  }

  const currentCycle = await db.cycle.findFirst({ orderBy: { createdAt: "desc" } });

  // Survey update: set surveyQuestions (and optionally open)
  if ("surveyQuestions" in parsed.data) {
    const { surveyQuestions, action } = parsed.data;
    const surveyJson = surveyQuestions as unknown as Prisma.InputJsonValue;
    if (!currentCycle) {
      const created = await db.cycle.create({
        data: {
          status: "OPEN",
          monthYear: formatMonthYear(new Date()),
          surveyQuestions: surveyJson,
        },
      });
      await db.auditLog.create({
        data: { ...(adminUserId ? { adminUserId } : {}), action: "AdminOpenCycle" },
      });
      return NextResponse.json({ currentCycle: created });
    }
    const updated = await db.cycle.update({
      where: { id: currentCycle.id },
      data: {
        surveyQuestions: surveyJson,
        ...(action === "OPEN" ? { status: "OPEN" as const } : {}),
      },
    });
    if (action === "OPEN") {
      await db.auditLog.create({
        data: { ...(adminUserId ? { adminUserId } : {}), action: "AdminOpenCycle" },
      });
    }
    return NextResponse.json({ currentCycle: updated });
  }

  const { action } = parsed.data;
  if (!currentCycle) {
    const created = await db.cycle.create({
      data: { status: "OPEN", monthYear: formatMonthYear(new Date()) },
    });
    return NextResponse.json({ currentCycle: created });
  }

  if (action === "OPEN") {
    const updated = await db.cycle.update({ where: { id: currentCycle.id }, data: { status: "OPEN" } });
    await db.auditLog.create({
      data: { ...(adminUserId ? { adminUserId } : {}), action: "AdminOpenCycle" },
    });
    return NextResponse.json({ currentCycle: updated });
  }

  if (action === "CLOSE") {
    const updated = await db.cycle.update({ where: { id: currentCycle.id }, data: { status: "CLOSED" } });
    await db.auditLog.create({
      data: { ...(adminUserId ? { adminUserId } : {}), action: "AdminCloseCycle" },
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
      ...(adminUserId ? { adminUserId } : {}),
      action: "AdminCreateNextCycle",
      metadata: { archivedCycleId: archived.id, newCycleId: created.id },
    },
  });
  return NextResponse.json({ currentCycle: created });
}

