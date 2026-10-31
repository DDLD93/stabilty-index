/** Client-safe formatting helpers and scales for NSI reports. */

/** The overall index is out of 10; each pillar is the average of 1–5 survey answers. */
export const OVERALL_MAX = 10;
export const PILLAR_MIN = 1;
export const PILLAR_MAX = 5;

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

export function change(current: number | null, previous: number | null): Change | null {
  if (current === null || previous === null) return null;
  const value = Math.round((current - previous) * 10) / 10;
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

/** Reports are published on the 11th of the month after the survey month: "October 2026" → "11 November 2026". */
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
