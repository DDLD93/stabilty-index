import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdminSession } from "@/lib/adminSession";

function csvEscape(v: string) {
  const s = v.replaceAll(`"`, `""`);
  return `"${s}"`;
}

export async function GET() {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const rows = await db.submission.findMany({
    where: { isFlagged: false },
    orderBy: { createdAt: "desc" },
    select: {
      createdAt: true,
      stabilityScore: true,
      mood: true,
      oneWord: true,
      spotlightState: true,
      spotlightTags: true,
      spotlightComment: true,
      cycleId: true,
    },
  });

  const header = [
    "createdAt",
    "cycleId",
    "stabilityScore",
    "mood",
    "oneWord",
    "spotlightState",
    "spotlightTags",
    "spotlightComment",
  ].join(",");

  const body = rows
    .map((r) =>
      [
        csvEscape(r.createdAt.toISOString()),
        csvEscape(r.cycleId),
        String(r.stabilityScore),
        csvEscape(r.mood),
        csvEscape(r.oneWord),
        csvEscape(r.spotlightState ?? ""),
        csvEscape(r.spotlightTags.join("|")),
        csvEscape(r.spotlightComment ?? ""),
      ].join(",")
    )
    .join("\n");

  await db.auditLog.create({
    data: {
      adminUserId: (session.user as { id?: string } | undefined)?.id,
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

