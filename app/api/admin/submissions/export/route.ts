import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdminSession, getAuditAdminUserId } from "@/lib/adminSession";
import { PILLARS } from "@/lib/constants";

function csvEscape(v: string) {
  const s = v.replaceAll(`"`, `""`);
  return `"${s}"`;
}

export async function GET() {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const adminUserId = await getAuditAdminUserId(session);

  const rows = await db.submission.findMany({
    where: { isFlagged: false },
    orderBy: { createdAt: "desc" },
    select: {
      createdAt: true,
      stabilityScore: true,
      mood: true,
      oneWord: true,
      pillarResponses: true,
      spotlightState: true,
      spotlightTags: true,
      spotlightComment: true,
      cycleId: true,
    },
  });

  const pillarCols = PILLARS.map((p) => p.key);
  const header = [
    "createdAt",
    "cycleId",
    "stabilityScore",
    "mood",
    "oneWord",
    ...pillarCols,
    "spotlightState",
    "spotlightTags",
    "spotlightComment",
  ].join(",");

  const body = rows
    .map((r) => {
      const pr = (r.pillarResponses ?? {}) as Record<string, number>;
      const pillarVals = pillarCols.map((k) => (pr[k] != null ? String(pr[k]) : ""));
      return [
        csvEscape(r.createdAt.toISOString()),
        csvEscape(r.cycleId),
        r.stabilityScore != null ? String(r.stabilityScore) : "",
        csvEscape(r.mood ?? ""),
        csvEscape(r.oneWord ?? ""),
        ...pillarVals,
        csvEscape(r.spotlightState ?? ""),
        csvEscape(r.spotlightTags.join("|")),
        csvEscape(r.spotlightComment ?? ""),
      ].join(",");
    })
    .join("\n");

  await db.auditLog.create({
    data: {
      ...(adminUserId ? { adminUserId } : {}),
      action: "AdminExportCsv",
      metadata: { rows: rows.length },
    },
  });

  return new NextResponse([header, body].filter(Boolean).join("\n"), {
    headers: {
      "content-type": "text/csv; charset=utf-8",
      "content-disposition": `attachment; filename="nsi_submissions.csv"`,
    },
  });
}

