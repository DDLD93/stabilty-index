import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { normalizeRefQueryParam, isValidReferrerCodeFormat } from "@/lib/agentReferrerCode";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Public: validate referral code for UX (no PII beyond first name). */
export async function GET(req: Request) {
  const raw = new URL(req.url).searchParams.get("code");
  const normalized = normalizeRefQueryParam(raw);
  if (!normalized || !isValidReferrerCodeFormat(normalized)) {
    return NextResponse.json({ valid: false as const });
  }

  const agent = await db.agent.findFirst({
    where: { referrerCode: normalized, isActive: true },
    select: { name: true },
  });

  if (!agent) {
    return NextResponse.json({ valid: false as const });
  }

  const firstName = agent.name.trim().split(/\s+/)[0] ?? agent.name;
  return NextResponse.json({
    valid: true as const,
    displayLabel: firstName,
  });
}
