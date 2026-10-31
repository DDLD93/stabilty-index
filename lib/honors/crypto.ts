import { createHash, createHmac, randomBytes } from "node:crypto";

function secret(): string {
  const s = process.env.HONORS_HASH_SECRET?.trim() || process.env.NEXTAUTH_SECRET?.trim();
  if (!s) throw new Error("HONORS_HASH_SECRET (or NEXTAUTH_SECRET) must be set.");
  return s;
}

/** Keyed one-way hash, so stored hashes can't be reversed by guessing common emails without the key. */
export function hmac(value: string): string {
  return createHmac("sha256", secret()).update(value).digest("hex");
}

/**
 * Lower-case, trim, drop "+tag", and drop dots for Gmail, so one inbox maps to one
 * identity for one-vote-per-category.
 */
export function normalizeEmail(email: string): string {
  const [rawLocal, rawDomain = ""] = email.trim().toLowerCase().split("@");
  let domain = rawDomain;
  let local = rawLocal.split("+")[0];
  if (domain === "googlemail.com") domain = "gmail.com";
  if (domain === "gmail.com") local = local.replace(/\./g, "");
  return `${local}@${domain}`;
}

export function emailHash(email: string): string {
  return hmac(`email:${normalizeEmail(email)}`);
}

export function newToken(): string {
  return randomBytes(32).toString("base64url");
}

export function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

/** First address in x-forwarded-for (set by the host), hashed. Null when unknown. */
export function getIpHash(req: Request): string | null {
  const forwarded = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const ip = forwarded || req.headers.get("x-real-ip")?.trim();
  return ip ? hmac(`ip:${ip}`) : null;
}

export function deviceKey(deviceHash: string | undefined | null): string | null {
  return deviceHash ? hmac(`device:${deviceHash}`) : null;
}

const REF_ALPHABET = "23456789ABCDEFGHJKMNPQRSTUVWXYZ";

/** Short human reference for a nomination, e.g. H26-7F3K2Q. */
export function newReference(year: number): string {
  const bytes = randomBytes(6);
  let code = "";
  for (const b of bytes) code += REF_ALPHABET[b % REF_ALPHABET.length];
  return `H${String(year).slice(-2)}-${code}`;
}
