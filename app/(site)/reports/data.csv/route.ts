import { PILLARS } from "@/lib/constants";
import { siteConfig } from "@/lib/metadata";
import { listPublishedReports } from "@/lib/snapshots";

export const revalidate = 3600;

const cell = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;

/**
 * Every published edition as CSV. The overall is out of 10; pillar scores use the edition's own scale
 * (out of 5 up to September 2026, out of 10 from October 2026), given in "Pillar scale".
 */
export async function GET() {
  const reports = await listPublishedReports();
  const header = [
    "Edition",
    "Month covered",
    "Survey taken",
    "Published",
    "Overall (out of 10)",
    "Pillar scale",
    ...PILLARS.map((p) => p.label),
    "Report",
  ];
  const rows = reports.map((r) => {
    const byTitle = new Map(r.pillars.map((p) => [p.title.toLowerCase(), p.score]));
    return [
      r.edition,
      r.period,
      r.surveyWindow ?? "",
      new Intl.DateTimeFormat("en-CA", { timeZone: "Africa/Lagos" }).format(r.publishedAt),
      r.overallScore.toFixed(2),
      `out of ${r.pillarMax}`,
      ...PILLARS.map((p) => {
        const v = byTitle.get(p.label.toLowerCase());
        return v === null || v === undefined ? "" : v.toFixed(2);
      }),
      `${siteConfig.url}/reports/${r.id}`,
    ];
  });
  const body = [header, ...rows].map((r) => r.map(cell).join(",")).join("\r\n");
  return new Response("﻿" + body, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="nigeria-stability-index.csv"',
    },
  });
}
