import { PILLARS } from "@/lib/constants";
import { siteConfig } from "@/lib/metadata";
import { listPublishedReports } from "@/lib/snapshots";

export const revalidate = 3600;

const cell = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;

/** Every published edition as CSV: overall score out of 10, pillar scores out of 5. */
export async function GET() {
  const reports = await listPublishedReports();
  const header = ["Edition", "Period", "Published", "Overall (out of 10)", ...PILLARS.map((p) => `${p.label} (out of 5)`), "Report"];
  const rows = reports.map((r) => {
    const byTitle = new Map(r.pillars.map((p) => [p.title.toLowerCase(), p.score]));
    return [
      r.edition,
      r.period,
      r.publishedAt.toISOString().slice(0, 10),
      r.overallScore.toFixed(2),
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
