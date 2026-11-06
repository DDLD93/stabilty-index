/** Client-safe formatting helpers and scales for NSI reports. */

/**
 * Survey answers are whole numbers from 1 (least stable) to 10 (most stable).
 * Each pillar score is the average of its answers; the overall index is the average
 * of each person's reading, out of 10.
 *
 * Editions up to September 2026 were collected on a 1–5 scale and are kept exactly as
 * published: their answers and pillar scores are out of 5, their overall out of 10.
 * The 1–10 scale applies from the October 2026 edition onward.
 */
export const TEN_POINT_FROM = "October 2026";

/** Pillar (and answer) scale for the edition or cycle covering `period`: 5 before October 2026, 10 from then on. */
export function pillarScaleFor(period: string | null | undefined): 5 | 10 {
  const m = monthNumber(period);
  const from = monthNumber(TEN_POINT_FROM);
  return m !== null && from !== null && m < from ? 5 : 10;
}

export const SCALE_MIN = 1;
export const SCALE_MAX = 10;
export const SCALE_VALUES: readonly number[] = Array.from({ length: SCALE_MAX - SCALE_MIN + 1 }, (_, i) => SCALE_MIN + i);
export const OVERALL_MAX = SCALE_MAX;
export const PILLAR_MIN = 0;
export const PILLAR_MAX = SCALE_MAX;

/** True for a whole-number answer on the survey scale. */
export function isScaleAnswer(v: unknown): v is number {
  return typeof v === "number" && Number.isInteger(v) && v >= SCALE_MIN && v <= SCALE_MAX;
}

/**
 * One person's overall reading out of 10: the mean of their pillar answers, scaled to /10
 * (on the old 1–5 scale that is mean × 2, as it always was). Null unless every key is answered.
 */
export function overallFromPillars(
  responses: Record<string, unknown>,
  keys: readonly string[],
  scaleMax: 5 | 10 = 10
): number | null {
  const vals = keys
    .map((k) => responses[k])
    .filter((v): v is number => typeof v === "number" && Number.isInteger(v) && v >= SCALE_MIN && v <= scaleMax);
  if (keys.length === 0 || vals.length !== keys.length) return null;
  return (vals.reduce((a, b) => a + b, 0) / vals.length) * (OVERALL_MAX / scaleMax);
}

export type PillarScore = { title: string; score: number | null; summary: string };

/** True when admin rich text has visible words in it. */
export function hasText(html: string): boolean {
  return html.replace(/<[^>]+>/g, "").replace(/&nbsp;/g, " ").trim().length > 0;
}

export function cleanPeriod(period: string): string {
  const match = period.trim().match(/^([A-Za-z]+)\s+(\d{4})/);
  return match ? `${match[1][0].toUpperCase()}${match[1].slice(1).toLowerCase()} ${match[2]}` : period.trim();
}

export function formatScore(n: number | null, digits = 1): string {
  return n === null ? "—" : n.toFixed(digits);
}

export function formatDate(d: Date): string {
  return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "Africa/Lagos" }).format(d);
}

/** "Kaduna" → "Kaduna State"; "FCT" → "Federal Capital Territory"; names already ending in "State" stay. */
export function formatStateName(name: string): string {
  const n = name.trim();
  if (!n) return n;
  if (/^(fct|federal capital territory|abuja)$/i.test(n)) return "Federal Capital Territory";
  if (/\bstate$/i.test(n)) return n;
  return `${n} State`;
}

/** Title-case an institution name entered in capitals ("CENTRAL BANK OF NIGERIA (CBN)"). */
export function formatInstitutionName(name: string): string {
  const n = name.trim();
  if (n !== n.toUpperCase()) return n;
  const small = new Set(["of", "and", "for", "the", "in", "on", "to"]);
  return n
    .toLowerCase()
    .split(/\s+/)
    .map((w, i) => {
      if (/^\(.+\)$/.test(w)) return w.toUpperCase();
      if (i > 0 && small.has(w)) return w;
      return w.charAt(0).toUpperCase() + w.slice(1);
    })
    .join(" ");
}

export type Change = { value: number; direction: "up" | "down" | "same" };

/** Change between two scores as displayed: both are rounded to 1 decimal first, so the label matches the numbers shown. */
export function change(current: number | null, previous: number | null): Change | null {
  if (current === null || previous === null) return null;
  const value = (Math.round(current * 10) - Math.round(previous * 10)) / 10;
  return { value: Math.abs(value), direction: value > 0 ? "up" : value < 0 ? "down" : "same" };
}

export function describeChange(c: Change | null, since: string): string {
  if (!c) return "";
  if (c.direction === "same") return `unchanged from ${since}`;
  return `${c.direction} ${c.value.toFixed(1)} from ${since}`;
}

/** First month name of a period: "September 2026" → "September". */
export function monthOf(period: string): string {
  return period.split(/\s+/)[0] ?? period;
}

const MONTHS = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];

/**
 * The standard dateline for an edition, making clear it reports the previous month:
 * "Covers October 2026 · Survey taken 1–7 November 2026 · Published 11 November 2026".
 */
export function editionDateline(e: { period: string; surveyWindow?: string | null; publishedAt: Date }): string {
  return [
    `Covers ${e.period}`,
    e.surveyWindow ? `Survey taken ${e.surveyWindow}` : null,
    `Published ${formatDate(e.publishedAt)}`,
  ]
    .filter(Boolean)
    .join(" · ");
}

/** "October 2026" → sortable month number (year × 12 + month index), or null. */
export function monthNumber(period: string | null | undefined): number | null {
  const match = period?.trim().match(/^([A-Za-z]+)\s+(\d{4})/);
  if (!match) return null;
  const m = MONTHS.findIndex((name) => name.startsWith(match[1].toLowerCase().slice(0, 3)));
  return m < 0 ? null : Number(match[2]) * 12 + m;
}

/** Year of a period string ("December 2026" → "2026"). */
export function yearOf(period: string): string | null {
  return period.match(/\b(\d{4})\b/)?.[1] ?? null;
}

/** The month before `d` in Lagos time, e.g. any day in November 2026 → "October 2026". */
export function previousMonthLabel(d: Date = new Date()): string {
  const parts = new Intl.DateTimeFormat("en-GB", { month: "numeric", year: "numeric", timeZone: "Africa/Lagos" }).formatToParts(d);
  const m = Number(parts.find((p) => p.type === "month")?.value) - 1;
  const y = Number(parts.find((p) => p.type === "year")?.value);
  const pm = (m + 11) % 12;
  return `${MONTHS[pm][0].toUpperCase()}${MONTHS[pm].slice(1)} ${m === 0 ? y - 1 : y}`;
}

/**
 * Each edition describes one month (the "period"). Its survey is taken in the first days of the
 * FOLLOWING month, and the edition is published on the 11th of that following month:
 * "October 2026" → "11 November 2026".
 */
export function publicationDateFor(monthYear: string | null | undefined): string | null {
  const match = monthYear?.trim().match(/^([A-Za-z]+)\s+(\d{4})/);
  if (!match) return null;
  const m = MONTHS.findIndex((name) => name.startsWith(match[1].toLowerCase().slice(0, 3)));
  if (m < 0) return null;
  const year = Number(match[2]) + (m === 11 ? 1 : 0);
  const month = (m + 1) % 12;
  return `11 ${MONTHS[month][0].toUpperCase()}${MONTHS[month].slice(1)} ${year}`;
}

/** Plain-text excerpt of admin rich text, cut at a word boundary. */
export function excerpt(html: string, max = 260): string {
  const text = html
    .replace(/<\/(p|li|h\d)>/gi, " ")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&rsquo;/g, "’")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  return `${cut.slice(0, cut.lastIndexOf(" ")).replace(/[,;:.\s]+$/, "")}…`;
}
