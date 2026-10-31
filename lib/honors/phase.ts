/** Client-safe NSI Honors phase rules. The edition status is what opens and closes each stage. */

import type { EditionStatus } from "@/lib/honors/constants";

export type EditionDates = {
  status: EditionStatus;
  nominationsOpenAt: Date | string | null;
  nominationsCloseAt: Date | string | null;
  votingOpenAt: Date | string | null;
  votingCloseAt: Date | string | null;
  ceremonyAt: Date | string | null;
};

/** Allowed status changes (admin). Going back from voting is only allowed while no votes exist; the API checks that. */
export const ALLOWED_TRANSITIONS: Record<EditionStatus, EditionStatus[]> = {
  DRAFT: ["NOMINATIONS_OPEN"],
  NOMINATIONS_OPEN: ["SHORTLISTING", "DRAFT"],
  SHORTLISTING: ["VOTING_OPEN", "NOMINATIONS_OPEN"],
  VOTING_OPEN: ["VOTING_CLOSED", "SHORTLISTING"],
  VOTING_CLOSED: ["ANNOUNCED", "VOTING_OPEN"],
  ANNOUNCED: ["ARCHIVED"],
  ARCHIVED: [],
};

const toDate = (d: Date | string | null) => (d ? new Date(d) : null);

/** Status sets the stage; optional dates narrow it (nothing opens before its date or after its close). */
export function isNominationsOpen(e: EditionDates, now = new Date()): boolean {
  if (e.status !== "NOMINATIONS_OPEN") return false;
  const open = toDate(e.nominationsOpenAt);
  const close = toDate(e.nominationsCloseAt);
  return (!open || now >= open) && (!close || now < close);
}

export function isVotingOpen(e: EditionDates, now = new Date()): boolean {
  if (e.status !== "VOTING_OPEN") return false;
  const open = toDate(e.votingOpenAt);
  const close = toDate(e.votingCloseAt);
  return (!open || now >= open) && (!close || now < close);
}

export function showsFinalists(status: EditionStatus): boolean {
  return status === "VOTING_OPEN" || status === "VOTING_CLOSED" || status === "ANNOUNCED" || status === "ARCHIVED";
}

export function formatLagos(d: Date | string | null, withTime = false): string | null {
  const date = toDate(d);
  if (!date) return null;
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    ...(withTime ? { hour: "numeric", minute: "2-digit" } : {}),
    timeZone: "Africa/Lagos",
  }).format(date);
}

export type TimelineStep = { key: string; label: string; when: string; state: "done" | "current" | "upcoming" };

const ORDER: EditionStatus[] = ["NOMINATIONS_OPEN", "SHORTLISTING", "VOTING_OPEN", "VOTING_CLOSED", "ANNOUNCED"];

/** The public timeline. Any date not yet set reads "To be announced". */
export function getTimeline(e: EditionDates): TimelineStep[] {
  const tba = "To be announced";
  const range = (a: Date | string | null, b: Date | string | null) => {
    const from = formatLagos(a);
    const to = formatLagos(b);
    if (from && to) return `${from} to ${to}`;
    if (from) return `From ${from}`;
    if (to) return `Until ${to}`;
    return tba;
  };
  const currentIndex = e.status === "ARCHIVED" ? ORDER.length : ORDER.indexOf(e.status);
  const stateFor = (stepStatuses: EditionStatus[]): TimelineStep["state"] => {
    const idx = Math.max(...stepStatuses.map((s) => ORDER.indexOf(s)));
    const first = Math.min(...stepStatuses.map((s) => ORDER.indexOf(s)));
    if (currentIndex > idx) return "done";
    if (currentIndex >= first) return "current";
    return "upcoming";
  };
  const steps: TimelineStep[] = [
    { key: "nominate", label: "Public nominations", when: range(e.nominationsOpenAt, e.nominationsCloseAt), state: stateFor(["NOMINATIONS_OPEN"]) },
    { key: "shortlist", label: "Finalists announced", when: formatLagos(e.votingOpenAt) ? `By ${formatLagos(e.votingOpenAt)}` : tba, state: stateFor(["SHORTLISTING"]) },
    { key: "vote", label: "Public vote", when: range(e.votingOpenAt, e.votingCloseAt), state: stateFor(["VOTING_OPEN", "VOTING_CLOSED"]) },
    { key: "announce", label: "Winners announced", when: formatLagos(e.ceremonyAt) ?? tba, state: stateFor(["ANNOUNCED"]) },
  ];
  // A finished stage with no date set reads "Completed", not "To be announced".
  return steps.map((s) => (s.when === tba && (s.state === "done" || (s.key === "announce" && s.state === "current")) ? { ...s, when: "Completed" } : s));
}
