import { NextResponse } from "next/server";
import React from "react";
import { renderToBuffer } from "@react-pdf/renderer";
import { db } from "@/lib/db";
import { requireAdminSession } from "@/lib/adminSession";
import { getSubmissionAnalytics } from "@/lib/admin/submissionAnalytics";
import { ReportPdfDocument } from "@/lib/admin/ReportPdfDocument";

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
    return NextResponse.json(
      { error: "No cycle selected" },
      { status: 400 }
    );
  }

  const [cycle, data] = await Promise.all([
    db.cycle.findUnique({
      where: { id: cycleId },
      select: { monthYear: true },
    }),
    getSubmissionAnalytics(cycleId),
  ]);

  const monthYear = cycle?.monthYear ?? "Unknown";
  const generatedAt = new Date().toLocaleString("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  });
  const sanitized = monthYear.replace(/[^a-zA-Z0-9-]/g, "-").slice(0, 32);
  const filename = `stability-report-${sanitized}.pdf`;

  const element = React.createElement(ReportPdfDocument, {
    data,
    monthYear,
    generatedAt,
  });
  const buffer = await renderToBuffer(element);

  return new NextResponse(buffer, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Content-Length": String(buffer.length),
    },
  });
}
