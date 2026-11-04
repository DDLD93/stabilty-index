import { PILLARS } from "@/lib/constants";
import { previousMonthLabel } from "@/lib/reportFormat";

export type SnapshotListItem = {
  id: string;
  period: string;
  overallScore: number;
  publishedAt: string | null;
  isLocked: boolean;
  createdAt: string;
  cycleId: string | null;
  cycleMonthYear: string | null;
};

export type Pillar = {
  title: string;
  score: number;
  summary: string;
};

export type InstitutionSpotlight = {
  institution: string;
  summary: string;
  keyPointsHtml: string;
};

export type SourceRef = {
  label: string;
  url: string;
};

export type StateSpotlight = {
  state: string;
  score: number;
  keyPointsHtml: string;
};

export type StreetPulseSpotlight = {
  title: string;
  summary: string;
  keyPointsHtml: string;
};

export type PublicSentiment = {
  topWords: string[];
  averagePublicScore: number;
  topMood: string;
};

export type SnapshotModel = {
  id?: string;
  cycleId: string | null;
  period: string;
  overallScore: number;
  overallNarrative: string;
  pillarScores: { pillars: Pillar[] };
  stateSpotlightContent: StateSpotlight;
  institutionSpotlightContent: InstitutionSpotlight;
  streetPulseSpotlightContent: StreetPulseSpotlight;
  sourcesReferences: SourceRef[];
  publicSentimentSummary: PublicSentiment;
  publishedAt?: string | null;
  isLocked?: boolean;
};

export type SnapshotApiResponse =
  | { error: string }
  | { snapshot: SnapshotModel & { id: string; isLocked: boolean; publishedAt: string | null } };

/**
 * A blank edition. Scores start at 0 (not example numbers) so nothing invented can be published;
 * pick the survey cycle and use "Use survey averages" to fill them from the answers.
 */
export const defaultSnapshot: SnapshotModel = {
  cycleId: null,
  period: previousMonthLabel(),
  overallScore: 0,
  overallNarrative: "",
  pillarScores: {
    pillars: PILLARS.map((p) => ({ title: p.label, score: 0, summary: "" })),
  },
  stateSpotlightContent: {
    state: "No StateSpotlight this round",
    score: 0,
    keyPointsHtml: "<ul><li>No report on statespotlight</li></ul>",
  },
  institutionSpotlightContent: {
    institution: "",
    summary: "",
    keyPointsHtml: "",
  },
  streetPulseSpotlightContent: {
    title: "",
    summary: "",
    keyPointsHtml: "",
  },
  sourcesReferences: [],
  publicSentimentSummary: {
    topWords: [],
    averagePublicScore: 0,
    topMood: "",
  },
};

/** Normalize legacy bullets array to keyPointsHtml for backward compatibility. */
export function bulletsToKeyPointsHtml(bullets: unknown): string {
  if (typeof bullets === "string" && bullets.length > 0) return bullets;
  if (!Array.isArray(bullets)) return "";
  const items = bullets.filter((b): b is string => typeof b === "string" && b.trim().length > 0);
  if (items.length === 0) return "";
  return "<ul>" + items.map((b) => "<li>" + escapeHtml(b) + "</li>").join("") + "</ul>";
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// Utility functions
export function prettyDate(s: string | null) {
  if (!s) return "—";
  const d = new Date(s);
  return Number.isNaN(d.valueOf()) ? "—" : d.toLocaleString("en-NG");
}

export function hasError(data: unknown): data is { error: string } {
  if (!data || typeof data !== "object") return false;
  const maybe = data as { error?: unknown };
  return typeof maybe.error === "string" && maybe.error.length > 0;
}

export function hasSnapshot<T extends object>(data: unknown): data is { snapshot: T } {
  if (!data || typeof data !== "object") return false;
  const maybe = data as { snapshot?: unknown };
  return !!maybe.snapshot && typeof maybe.snapshot === "object";
}
