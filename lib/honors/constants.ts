/** Client-safe NSI Honors labels and limits. */

export const NOMINEE_TYPES = ["PUBLIC_INSTITUTION", "STATE_OR_LGA", "ORGANISATION", "INDIVIDUAL"] as const;
export type NomineeType = (typeof NOMINEE_TYPES)[number];

export const NOMINEE_TYPE_LABELS: Record<NomineeType, string> = {
  PUBLIC_INSTITUTION: "A public institution or agency",
  STATE_OR_LGA: "A state or local government area",
  ORGANISATION: "An organisation, company or NGO",
  INDIVIDUAL: "An individual",
};

export const NOMINEE_TYPE_SHORT: Record<NomineeType, string> = {
  PUBLIC_INSTITUTION: "Public institution",
  STATE_OR_LGA: "State or LGA",
  ORGANISATION: "Organisation",
  INDIVIDUAL: "Individual",
};

export const NOMINATOR_RELATIONS = ["INDEPENDENT", "AFFILIATED", "SELF"] as const;
export type NominatorRelation = (typeof NOMINATOR_RELATIONS)[number];

export const NOMINATOR_RELATION_LABELS: Record<NominatorRelation, string> = {
  INDEPENDENT: "I have no connection to the nominee",
  AFFILIATED: "I work for, with or alongside the nominee",
  SELF: "I am nominating myself or my own organisation",
};

export const EDITION_STATUSES = [
  "DRAFT",
  "NOMINATIONS_OPEN",
  "SHORTLISTING",
  "VOTING_OPEN",
  "VOTING_CLOSED",
  "ANNOUNCED",
  "ARCHIVED",
] as const;
export type EditionStatus = (typeof EDITION_STATUSES)[number];

export const EDITION_STATUS_LABELS: Record<EditionStatus, string> = {
  DRAFT: "Draft (not public)",
  NOMINATIONS_OPEN: "Nominations open",
  SHORTLISTING: "Shortlisting",
  VOTING_OPEN: "Public voting open",
  VOTING_CLOSED: "Voting closed",
  ANNOUNCED: "Winners announced",
  ARCHIVED: "Archived",
};

/** Category slugs may not collide with the fixed /honors/* routes. */
export const RESERVED_SLUGS = ["nominate", "vote", "winners", "confirm"] as const;

export const LIMITS = {
  nomineeName: { min: 2, max: 160 },
  reason: { min: 80, max: 2000 },
  affiliation: 160,
  lga: 80,
  evidenceUrls: 5,
  nominatorName: 120,
  citation: 1200,
  summary: 600,
} as const;

/** How long a vote confirmation link stays valid. */
export const VOTE_LINK_HOURS = 24;
