import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { audit } from "@/lib/admin/audit";
import { adminOrResponse, csvResponse } from "@/lib/admin/guard";

export const dynamic = "force-dynamic";

/** CSV of individual votes. Hashes are shortened; no email addresses exist to export. */
export async function GET(req: Request) {
  const guard = await adminOrResponse();
  if (guard instanceof NextResponse) return guard;
  const editionId = new URL(req.url).searchParams.get("editionId");
  if (!editionId) return NextResponse.json({ error: "editionId is required." }, { status: 400 });

  const votes = await db.honorsVote.findMany({
    where: { editionId },
    orderBy: { createdAt: "asc" },
    include: { category: { select: { name: true } }, finalist: { select: { displayName: true } } },
  });
  await audit(guard.adminUserId, "HonorsExportVotes", { editionId, rows: votes.length });
  const short = (s: string | null) => (s ? s.slice(0, 12) : "");
  return csvResponse(
    `honors-votes-${editionId}.csv`,
    ["Confirmed", "Category", "Finalist", "Voter (hash)", "Network (hash)", "Device (hash)", "Void", "Void reason"],
    votes.map((v) => [v.createdAt, v.category.name, v.finalist.displayName, short(v.emailHash), short(v.ipHash), short(v.deviceHash), v.isVoid ? "yes" : "no", v.voidReason]),
  );
}
