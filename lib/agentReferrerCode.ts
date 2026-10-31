import { randomInt } from "node:crypto";
import type { PrismaClient } from "@prisma/client";

import { REFERRER_CODE_LENGTH as CODE_LEN } from "@/lib/referrerCode";

// Re-exported so existing server imports keep working; client code imports lib/referrerCode directly.
export { normalizeRefQueryParam, isValidReferrerCodeFormat } from "@/lib/referrerCode";

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
