import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { audit } from "@/lib/admin/audit";
import { adminOrResponse, csvResponse } from "@/lib/admin/guard";

export const dynamic = "force-dynamic";

/** CSV of every nomination in an edition, including nominator contact details (for follow-up). */
export async function GET(req: Request) {
  const guard = await adminOrResponse();
  if (guard instanceof NextResponse) return guard;
  const editionId = new URL(req.url).searchParams.get("editionId");
  if (!editionId) return NextResponse.json({ error: "editionId is required." }, { status: 400 });

  const rows = await db.honorsNomination.findMany({
    where: { editionId },
    orderBy: [{ categoryId: "asc" }, { createdAt: "asc" }],
    include: { category: { select: { name: true } }, agent: { select: { referrerCode: true } } },
  });
  await audit(guard.adminUserId, "HonorsExportNominations", { editionId, rows: rows.length, includesContacts: true });
  return csvResponse(
    `honors-nominations-${editionId}.csv`,
    ["Reference", "Submitted", "Category", "Status", "Nominee", "Type", "State", "LGA", "Affiliation", "Reason", "Evidence", "Nominator", "Nominator email", "Relation", "Agent code", "Admin note"],
    rows.map((n) => [
      n.reference,
      n.createdAt,
      n.category.name,
      n.status,
      n.nomineeName,
      n.nomineeType,
      n.nomineeState,
      n.nomineeLga,
      n.nomineeAffiliation,
      n.reason,
      n.evidenceUrls.join(" "),
      n.nominatorName,
      n.nominatorEmail,
      n.nominatorRelation,
      n.agent?.referrerCode,
      n.adminNote,
    ]),
  );
}
