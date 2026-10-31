import { cache } from "react";
import { db } from "@/lib/db";
import { getKeyPointsHtml } from "@/lib/spotlight";
import { cleanPeriod, hasText, type PillarScore } from "@/lib/reportFormat";

export * from "@/lib/reportFormat";

export type ReportSummary = {
  id: string;
  /** "September 2026" (cleaned of editorial suffixes such as "final"). */
  period: string;
  overallScore: number;
  publishedAt: Date;
  /** 1-based count of published editions, in publication order. */
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

/** Every published edition, oldest first, with edition numbers. */
export const listPublishedReports = cache(async (): Promise<ReportSummary[]> => {
  const rows = await db.snapshot.findMany({
    where: { publishedAt: { not: null } },
    orderBy: { publishedAt: "asc" },
    select: { id: true, period: true, overallScore: true, publishedAt: true, pillarScores: true },
  });
  return rows.map((r, i) => ({
    id: r.id,
    period: cleanPeriod(r.period),
    overallScore: r.overallScore,
    publishedAt: r.publishedAt as Date,
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

  return {
    id: row.id,
    period: cleanPeriod(row.period),
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
    previous: index > 0 ? all[index - 1] : index === -1 ? (all.at(-1) ?? null) : null,
    next: index >= 0 && index < all.length - 1 ? all[index + 1] : null,
  };
});

export const getLatestReport = cache(async (): Promise<Report | null> => {
  const all = await listPublishedReports();
  const latest = all.at(-1);
  return latest ? getReport(latest.id) : null;
});

