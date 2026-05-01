import { randomInt } from "node:crypto";
import type { PrismaClient } from "@prisma/client";

const CODE_LEN = 6;

export function normalizeRefQueryParam(ref: string | null | undefined): string | null {
  if (ref == null || typeof ref !== "string") return null;
  const trimmed = ref.trim();
  if (!trimmed) return null;
  if (!/^\d{1,6}$/.test(trimmed)) return null;
  return trimmed.padStart(CODE_LEN, "0");
}

export function isValidReferrerCodeFormat(code: string): boolean {
  return /^\d{6}$/.test(code);
}

/** Cryptographic 6-digit string (leading zeros). Caller must ensure uniqueness in DB. */
export function randomSixDigitCode(): string {
  return String(randomInt(0, 1_000_000)).padStart(CODE_LEN, "0");
}

export async function allocateUniqueReferrerCode(db: PrismaClient): Promise<string> {
  for (let i = 0; i < 64; i++) {
    const code = randomSixDigitCode();
    const clash = await db.agent.findUnique({
      where: { referrerCode: code },
      select: { id: true },
    });
    if (!clash) return code;
  }
  throw new Error("Could not allocate a unique referrer code");
}
