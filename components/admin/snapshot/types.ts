export type SnapshotListItem = {
  id: string;
  period: string;
  overallScore: number;
  publishedAt: string | null;
  isLocked: boolean;
  createdAt: string;
  cycleId: string | null;
};

export type Pillar = {
  title: string;
  score: number;
  summary: string;
};

export type InstitutionSpotlight = {
  institution: string;
  summary: string;
  bullets: string[];
};

export type SourceRef = {
  label: string;
  url: string;
};

export type StateSpotlight = {
  state: string;
  score: number;
  bullets: string[];
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
  sourcesReferences: SourceRef[];
  publicSentimentSummary: PublicSentiment;
  publishedAt?: string | null;
  isLocked?: boolean;
};

export type SnapshotApiResponse =
  | { error: string }
  | { snapshot: SnapshotModel & { id: string; isLocked: boolean; publishedAt: string | null } };

export const defaultSnapshot: SnapshotModel = {
  cycleId: null,
  period: "January 2026",
  overallScore: 6.6,
  overallNarrative: "Cautiously stable",
  pillarScores: {
    pillars: [
      { title: "Security", score: 6.5, summary: "Order holds despite threats." },
      { title: "FX & Economy", score: 6.0, summary: "Fragile, but stabilizing." },
      { title: "Investor Confidence", score: 6.5, summary: "Capital is cautious." },
      { title: "Governance", score: 7.0, summary: "Direction remains consistent." },
      { title: "Social Stability", score: 7.0, summary: "Tensions ease; mood is calm." },
    ],
  },
  stateSpotlightContent: {
    state: "Lagos",
    score: 7.1,
    bullets: ["Strongest in transportation", "Top in public services delivery", "Rising regional influence"],
  },
  institutionSpotlightContent: {
    institution: "",
    summary: "",
    bullets: [],
  },
  sourcesReferences: [],
  publicSentimentSummary: {
    topWords: ["Hopeful", "Steady", "Progressing", "Demanding"],
    averagePublicScore: 6.5,
    topMood: "Cautiously hopeful",
  },
};

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
