import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { hashToken } from "@/lib/honors/crypto";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const bodySchema = z.object({ token: z.string().min(20).max(200) });

export async function POST(req: Request) {
  const parsed = bodySchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid link." }, { status: 400 });

  const sub = await db.subscriber.findUnique({ where: { confirmTokenHash: hashToken(parsed.data.token) } });
  if (!sub) return NextResponse.json({ error: "This link is not valid or has already been used." }, { status: 404 });
  if (sub.confirmTokenExpiresAt && sub.confirmTokenExpiresAt < new Date()) {
    return NextResponse.json({ error: "This link has expired. Please sign up again." }, { status: 410 });
  }

  await db.subscriber.update({
    where: { id: sub.id },
    data: { status: "CONFIRMED", confirmedAt: new Date(), confirmTokenHash: null, confirmTokenExpiresAt: null },
  });
  return NextResponse.json({ ok: true });
}
