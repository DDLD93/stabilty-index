import { NextResponse } from "next/server";
import React from "react";
import { renderToBuffer } from "@react-pdf/renderer";
import { db } from "@/lib/db";
import { requireAdminSession } from "@/lib/adminSession";
import { AgentsReportPdfDocument } from "@/lib/admin/AgentsReportPdfDocument";
import { getAgentCountsForCycle, getCrossCycleAgentMatrix } from "@/lib/admin/agentAnalytics";

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

  const rosterRaw = await db.agent.findMany({
    orderBy: { name: "asc" },
    select: {
      name: true,
      email: true,
      phone: true,
      referrerCode: true,
      isActive: true,
      _count: { select: { submissions: true } },
    },
  });

  const roster = rosterRaw.map((a) => ({
    name: a.name,
    email: a.email,
    phone: a.phone,
    referrerCode: a.referrerCode,
    isActive: a.isActive,
    submissionCount: a._count.submissions,
  }));

  let perCycle: {
    monthYear: string;
    rows: Awaited<ReturnType<typeof getAgentCountsForCycle>>["rows"];
    unattributedCount: number;
    totalCount: number;
  } | null = null;

  if (cycleId) {
    const cycle = await db.cycle.findUnique({
      where: { id: cycleId },
      select: { monthYear: true },
    });
    if (cycle) {
      const data = await getAgentCountsForCycle(cycleId);
      perCycle = {
        monthYear: cycle.monthYear,
        rows: data.rows,
        unattributedCount: data.unattributedCount,
        totalCount: data.totalCount,
      };
    }
  }

  const crossCycle = await getCrossCycleAgentMatrix(12);

  const generatedAt = new Date().toLocaleString("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  const filename = `agent-report-${new Date().toISOString().slice(0, 10)}.pdf`;

  const element = React.createElement(AgentsReportPdfDocument, {
    generatedAt,
    roster,
    perCycle,
    crossCycle,
  });
  const buffer = await renderToBuffer(element as Parameters<typeof renderToBuffer>[0]);
  const body = new Uint8Array(buffer.byteLength);
  body.set(buffer);

  return new NextResponse(body, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Content-Length": String(body.byteLength),
    },
  });
}
