import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { hashToken, newToken } from "@/lib/honors/crypto";
import { sendSubscribeConfirmation } from "@/lib/honors/emails";
import { subscribeSchema } from "@/lib/honors/schemas";
import { isMailConfigured } from "@/lib/mailer";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const CONFIRM_HOURS = 48;

export async function POST(req: Request) {
  const parsed = subscribeSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid request." }, { status: 400 });
  }
  // Honeypot: pretend success, store nothing.
  if (parsed.data.website) return NextResponse.json({ ok: true }, { status: 202 });

  if (!isMailConfigured()) {
    return NextResponse.json(
      { error: "Email sign-up is not available right now. Please try again later." },
      { status: 503 },
    );
  }

  const email = parsed.data.email.trim().toLowerCase();
  const existing = await db.subscriber.findUnique({ where: { email } });

  // Throttle repeat requests for the same address.
  if (existing?.status === "PENDING" && existing.updatedAt > new Date(Date.now() - 2 * 60 * 1000)) {
    return NextResponse.json({ ok: true }, { status: 202 });
  }
  if (existing?.status === "CONFIRMED") {
    // Don't reveal subscription status; just accept.
    return NextResponse.json({ ok: true }, { status: 202 });
  }

  const token = newToken();
  const data = {
    status: "PENDING" as const,
    confirmTokenHash: hashToken(token),
    confirmTokenExpiresAt: new Date(Date.now() + CONFIRM_HOURS * 3600 * 1000),
    unsubscribedAt: null,
  };
  await db.subscriber.upsert({
    where: { email },
    create: { email, unsubscribeToken: newToken(), ...data },
    update: data,
  });

  try {
    await sendSubscribeConfirmation(email, token);
  } catch (error) {
    console.error("[subscribe] send failed", error);
    return NextResponse.json({ error: "We couldn’t send the confirmation email. Please try again." }, { status: 502 });
  }
  return NextResponse.json({ ok: true }, { status: 202 });
}
