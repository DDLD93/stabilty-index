/** Client-safe referral code helpers (no Node APIs). Server-only helpers live in lib/agentReferrerCode.ts. */

export const REFERRER_CODE_LENGTH = 6;

export function normalizeRefQueryParam(ref: string | null | undefined): string | null {
  if (ref == null || typeof ref !== "string") return null;
  const trimmed = ref.trim();
  if (!trimmed) return null;
  if (!/^\d{1,6}$/.test(trimmed)) return null;
  return trimmed.padStart(REFERRER_CODE_LENGTH, "0");
}

export function isValidReferrerCodeFormat(code: string): boolean {
  return /^\d{6}$/.test(code);
}
