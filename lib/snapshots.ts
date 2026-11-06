import { cache } from "react";
import { db } from "@/lib/db";
import { getKeyPointsHtml } from "@/lib/spotlight";
import { cleanPeriod, hasText, monthNumber, pillarScaleFor, type PillarScore } from "@/lib/reportFormat";

export * from "@/lib/reportFormat";

export type ReportSummary = {
  id: string;
  /** The month this edition covers: "September 2026" (cleaned of editorial suffixes such as "final"). */
  period: string;
  /** When the survey behind it was collected, e.g. "1–7 October 2026"; null when the edition isn't linked to a cycle. */
  surveyWindow: string | null;
  overallScore: number;
  publishedAt: Date;
  /** Scale of this edition's pillar scores: 5 for editions up to September 2026, 10 from October 2026. */
  pillarMax: 5 | 10;
  /** 1-based count of published editions, in the order of the months they cover. */
  edition: number;
  pillars: PillarScore[];
};

export type StateSpotlight = { state: string; score: number | null; html: string };
export type InstitutionSpotlight = { institution: string; summary: string; html: string };
export type StreetPulse = { title: string; summary: string; html: string };
export type Sentiment = { topMood: string; topWords: string[]; averagePublicScore: number | null };
export type SourceRef = { label: string; url: string };

export type Report = ReportSummary & {
  narrative: string;
  state: StateSpotlight | null;
  institution: InstitutionSpotlight | null;
  streetPulse: StreetPulse | null;
  sentiment: Sentiment | null;
  sources: SourceRef[];
  previous: ReportSummary | null;
  next: ReportSummary | null;
};

// ---------- normalising the JSON columns ----------

function str(v: unknown): string {
  return typeof v === "string" ? v.trim() : "";
}

function num(v: unknown): number | null {
  if (v === null || v === undefined || v === "") return null;
  const n = typeof v === "number" ? v : Number(v);
  return Number.isFinite(n) ? n : null;
}

function obj(v: unknown): Record<string, unknown> | null {
  return v && typeof v === "object" && !Array.isArray(v) ? (v as Record<string, unknown>) : null;
}

function normalizePillars(raw: unknown): PillarScore[] {
  const list = obj(raw)?.pillars ?? raw;
  if (!Array.isArray(list)) return [];
  return list
    .map((p) => obj(p))
    .filter((p): p is Record<string, unknown> => Boolean(p && str(p.title)))
    .map((p) => ({ title: str(p.title), score: num(p.score), summary: str(p.summary) }));
}

function normalizeState(raw: unknown): StateSpotlight | null {
  const s = obj(raw);
  if (!s) return null;
  const html = getKeyPointsHtml(s as { keyPointsHtml?: string; bullets?: unknown });
  const state = str(s.state);
  if (!state && !hasText(html)) return null;
  const score = num(s.score);
  return { state, score: score && score > 0 ? score : null, html: hasText(html) ? html : "" };
}

function normalizeInstitution(raw: unknown): InstitutionSpotlight | null {
  const s = obj(raw);
  if (!s) return null;
  const html = getKeyPointsHtml(s as { keyPointsHtml?: string; bullets?: unknown });
  const institution = str(s.institution);
  const summary = str(s.summary);
  if (!institution && !summary && !hasText(html)) return null;
  return { institution, summary, html: hasText(html) ? html : "" };
}

function normalizeStreetPulse(raw: unknown): StreetPulse | null {
  const s = obj(raw);
  if (!s) return null;
  const html = str(s.keyPointsHtml);
  const title = str(s.title);
  const summary = str(s.summary);
  if (!title && !summary && !hasText(html)) return null;
  return { title, summary, html: hasText(html) ? html : "" };
}

function normalizeSentiment(raw: unknown): Sentiment | null {
  const s = obj(raw);
  if (!s) return null;
  const topWords = Array.isArray(s.topWords) ? s.topWords.map(str).filter(Boolean) : [];
  const topMood = str(s.topMood);
  const averagePublicScore = num(s.averagePublicScore);
  if (!topMood && topWords.length === 0 && averagePublicScore === null) return null;
  return { topMood, topWords, averagePublicScore };
}

function normalizeSources(raw: unknown): SourceRef[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((x) => obj(x))
    .filter((x): x is Record<string, unknown> => Boolean(x))
    .map((x) => ({ label: str(x.label), url: str(x.url) }))
    .filter((x) => x.label && /^https?:\/\//i.test(x.url));
}

// ---------- queries ----------

const dayMonth = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", timeZone: "Africa/Lagos" });
const dayMonthYear = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "Africa/Lagos" });

/** "1 October 2026" + "7 October 2026" → "1–7 October 2026"; spans across months keep both months. */
function formatWindow(from: Date, to: Date): string {
  const a = dayMonthYear.formatToParts(from);
  const b = dayMonthYear.formatToParts(to);
  const part = (p: Intl.DateTimeFormatPart[], t: string) => p.find((x) => x.type === t)?.value;
  if (part(a, "month") === part(b, "month") && part(a, "year") === part(b, "year")) {
    return part(a, "day") === part(b, "day")
      ? dayMonthYear.format(to)
      : `${part(a, "day")}–${dayMonthYear.format(to)}`;
  }
  return `${part(a, "year") === part(b, "year") ? dayMonth.format(from) : dayMonthYear.format(from)} – ${dayMonthYear.format(to)}`;
}

/** Collection dates (first and last answer) for each cycle that has answers. */
const surveyWindows = cache(async (cycleIds: string[]): Promise<Map<string, string>> => {
  if (cycleIds.length === 0) return new Map();
  const rows = await db.submission.groupBy({
    by: ["cycleId"],
    where: { cycleId: { in: cycleIds } },
    _min: { createdAt: true },
    _max: { createdAt: true },
  });
  return new Map(
    rows
      .filter((r) => r._min.createdAt && r._max.createdAt)
      .map((r) => [r.cycleId, formatWindow(r._min.createdAt as Date, r._max.createdAt as Date)])
  );
});

/** Survey-month order, falling back to publication date when a period can't be read. */
function byCoveredMonth<T extends { period: string; publishedAt: Date }>(a: T, b: T): number {
  const ma = monthNumber(a.period);
  const mb = monthNumber(b.period);
  if (ma !== null && mb !== null && ma !== mb) return ma - mb;
  return +a.publishedAt - +b.publishedAt;
}

/** Every published edition, oldest month first, with edition numbers. */
export const listPublishedReports = cache(async (): Promise<ReportSummary[]> => {
  const rows = await db.snapshot.findMany({
    where: { publishedAt: { not: null } },
    orderBy: { publishedAt: "asc" },
    select: { id: true, cycleId: true, period: true, overallScore: true, publishedAt: true, pillarScores: true },
  });
  const windows = await surveyWindows(rows.map((r) => r.cycleId).filter((id): id is string => !!id));
  return rows
    .map((r) => ({ ...r, period: cleanPeriod(r.period), publishedAt: r.publishedAt as Date }))
    .sort(byCoveredMonth)
    .map((r, i) => ({
      id: r.id,
      period: r.period,
      surveyWindow: r.cycleId ? (windows.get(r.cycleId) ?? null) : null,
      pillarMax: pillarScaleFor(r.period),
      overallScore: r.overallScore,
      publishedAt: r.publishedAt,
      edition: i + 1,
      pillars: normalizePillars(r.pillarScores),
    }));
});

/** A published report with its neighbours. Returns null for drafts unless `allowDraft` (admin preview). */
export const getReport = cache(async (id: string, allowDraft = false): Promise<Report | null> => {
  const row = await db.snapshot.findUnique({ where: { id } });
  if (!row) return null;
  if (!row.publishedAt && !allowDraft) return null;

  const all = await listPublishedReports();
  const index = all.findIndex((r) => r.id === id);
  const period = cleanPeriod(row.period);
  // A draft preview compares against the latest edition that covers an earlier month.
  const draftMonth = monthNumber(period);
  const draftPrevious =
    index === -1
      ? ([...all].reverse().find((r) => draftMonth === null || (monthNumber(r.period) ?? -1) < draftMonth) ?? null)
      : null;
  const windows = row.cycleId ? await surveyWindows([row.cycleId]) : new Map<string, string>();

  return {
    id: row.id,
    period,
    surveyWindow: row.cycleId ? (windows.get(row.cycleId) ?? null) : null,
    pillarMax: pillarScaleFor(period),
    overallScore: row.overallScore,
    publishedAt: row.publishedAt ?? row.updatedAt,
    edition: index >= 0 ? index + 1 : all.length + 1,
    pillars: normalizePillars(row.pillarScores),
    narrative: str(row.overallNarrative),
    state: normalizeState(row.stateSpotlightContent),
    institution: normalizeInstitution(row.institutionSpotlightContent),
    streetPulse: normalizeStreetPulse(row.streetPulseSpotlightContent),
    sentiment: normalizeSentiment(row.publicSentimentSummary),
    sources: normalizeSources(row.sourcesReferences),
    previous: index > 0 ? all[index - 1] : draftPrevious,
    next: index >= 0 && index < all.length - 1 ? all[index + 1] : null,
  };
});

export const getLatestReport = cache(async (): Promise<Report | null> => {
  const all = await listPublishedReports();
  const latest = all.at(-1);
  return latest ? getReport(latest.id) : null;
});

