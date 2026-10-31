import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const bodySchema = z.object({ token: z.string().min(20).max(200) });

export async function POST(req: Request) {
  const parsed = bodySchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid link." }, { status: 400 });

  const updated = await db.subscriber.updateMany({
    where: { unsubscribeToken: parsed.data.token, status: { not: "UNSUBSCRIBED" } },
    data: { status: "UNSUBSCRIBED", unsubscribedAt: new Date(), confirmTokenHash: null },
  });
  // Same answer whether or not the token matched, so links can't be probed.
  return NextResponse.json({ ok: true, changed: updated.count > 0 });
}
