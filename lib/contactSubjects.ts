import { z } from "zod";

export const CONTACT_SUBJECT_KEYS = [
  "general",
  "media",
  "methodology",
  "report_feedback",
  "other",
] as const;

export type ContactSubjectKey = (typeof CONTACT_SUBJECT_KEYS)[number];

export const CONTACT_SUBJECT_LABELS: Record<ContactSubjectKey, string> = {
  general: "General enquiry",
  media: "Media or partnership",
  methodology: "Methodology or data",
  report_feedback: "Report feedback",
  other: "Other",
};

export const contactSubjectSchema = z.enum(CONTACT_SUBJECT_KEYS);
