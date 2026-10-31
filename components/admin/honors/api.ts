"use client";

import type { EditionStatus, NomineeType } from "@/lib/honors/constants";

export type AdminCategory = {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  criteria: string | null;
  allowedNomineeTypes: NomineeType[];
  sortOrder: number;
  isActive: boolean;
  winnerFinalistId: string | null;
  winnerCitation: string | null;
  winnerNote: string | null;
  winnerPublishedAt: string | null;
  _count: { nominations: number; finalists: number; votes: number };
};

export type AdminEdition = {
  id: string;
  year: number;
  title: string;
  status: EditionStatus;
  nominationsOpenAt: string | null;
  nominationsCloseAt: string | null;
  votingOpenAt: string | null;
  votingCloseAt: string | null;
  ceremonyAt: string | null;
  ceremonyVenue: string | null;
  ceremonyDetails: string | null;
  showVoteResults: boolean;
  contactsPurgedAt: string | null;
  categories: AdminCategory[];
  _count: { nominations: number; finalists: number; votes: number; voteRequests: number };
};

export type Overview = {
  editions: { id: string; year: number; title: string; status: EditionStatus }[];
  edition: AdminEdition | null;
  mailConfigured: boolean;
};

/** JSON fetch that throws the API's error message. */
export async function api<T>(url: string, init?: RequestInit & { json?: unknown }): Promise<T> {
  const res = await fetch(url, {
    ...init,
    headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) },
    body: init?.json !== undefined ? JSON.stringify(init.json) : init?.body,
  });
  const data = (await res.json().catch(() => ({}))) as T & { error?: string };
  if (!res.ok) throw new Error(data.error ?? `Request failed (${res.status}).`);
  return data;
}

/** ISO → value for <input type="datetime-local"> in Lagos time (UTC+1, no DST). */
export function toLagosInput(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(new Date(iso).getTime() + 60 * 60 * 1000);
  return d.toISOString().slice(0, 16);
}

/** <input type="datetime-local"> value (Lagos time) → ISO, or null when empty. */
export function fromLagosInput(value: string): string | null {
  return value ? `${value}:00+01:00` : null;
}
