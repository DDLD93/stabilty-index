import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { audit } from "@/lib/admin/audit";
import { adminOrResponse, csvResponse } from "@/lib/admin/guard";
import { siteOrigin } from "@/lib/mailer";

export const dynamic = "force-dynamic";

/** CSV of confirmed email subscribers, each with their personal unsubscribe link for mailings. */
export async function GET() {
  const guard = await adminOrResponse();
  if (guard instanceof NextResponse) return guard;
  const subs = await db.subscriber.findMany({ where: { status: "CONFIRMED" }, orderBy: { confirmedAt: "asc" } });
  await audit(guard.adminUserId, "SubscribersExport", { rows: subs.length });
  return csvResponse(
    "nsi-subscribers.csv",
    ["Email", "Confirmed", "Unsubscribe link"],
    subs.map((s) => [s.email, s.confirmedAt, `${siteOrigin()}/subscribe/unsubscribe?token=${s.unsubscribeToken}`]),
  );
}
