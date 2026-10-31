import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { adminOrResponse } from "@/lib/admin/guard";

export const dynamic = "force-dynamic";

/**
 * Voting health: totals, unconfirmed requests, and the networks/devices with the
 * most votes (shown as short hash prefixes; a large cluster is a prompt to look, not proof).
 */
export async function GET(req: Request) {
  const guard = await adminOrResponse();
  if (guard instanceof NextResponse) return guard;
  const editionId = new URL(req.url).searchParams.get("editionId");
  if (!editionId) return NextResponse.json({ error: "editionId is required." }, { status: 400 });

  const [valid, voided, pending, ipClusters, deviceClusters] = await Promise.all([
    db.honorsVote.count({ where: { editionId, isVoid: false } }),
    db.honorsVote.count({ where: { editionId, isVoid: true } }),
    db.honorsVoteRequest.count({ where: { editionId, consumedAt: null, expiresAt: { gt: new Date() } } }),
    db.honorsVote.groupBy({
      by: ["ipHash"],
      where: { editionId, ipHash: { not: null } },
      _count: { _all: true },
      orderBy: { _count: { ipHash: "desc" } },
      take: 10,
    }),
    db.honorsVote.groupBy({
      by: ["deviceHash"],
      where: { editionId, deviceHash: { not: null } },
      _count: { _all: true },
      orderBy: { _count: { deviceHash: "desc" } },
      take: 10,
    }),
  ]);

  const voidCounts = async (field: "ipHash" | "deviceHash", values: string[]) => {
    if (!values.length) return new Map<string, number>();
    const rows = await db.honorsVote.groupBy({
      by: [field],
      where: { editionId, isVoid: true, [field]: { in: values } },
      _count: { _all: true },
    });
    return new Map(rows.map((r) => [(r as Record<string, unknown>)[field] as string, r._count._all]));
  };
  const ipVoid = await voidCounts("ipHash", ipClusters.map((c) => c.ipHash!).filter(Boolean));
  const devVoid = await voidCounts("deviceHash", deviceClusters.map((c) => c.deviceHash!).filter(Boolean));

  return NextResponse.json({
    totals: { valid, voided, pendingConfirmations: pending },
    clusters: [
      ...ipClusters.map((c) => ({ kind: "ipHash" as const, value: c.ipHash!, votes: c._count._all, voided: ipVoid.get(c.ipHash!) ?? 0 })),
      ...deviceClusters.map((c) => ({ kind: "deviceHash" as const, value: c.deviceHash!, votes: c._count._all, voided: devVoid.get(c.deviceHash!) ?? 0 })),
    ]
      .filter((c) => c.votes > 1)
      .sort((a, b) => b.votes - a.votes),
  });
}
