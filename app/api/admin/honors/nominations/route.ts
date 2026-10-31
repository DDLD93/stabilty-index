import { NextResponse } from "next/server";
import type { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import { adminOrResponse } from "@/lib/admin/guard";

export const dynamic = "force-dynamic";

const STATUSES = ["PENDING", "SHORTLISTED", "REJECTED", "DUPLICATE"] as const;

/** Paged nominations for review, filtered by category, status and a name/reference search. */
export async function GET(req: Request) {
  const guard = await adminOrResponse();
  if (guard instanceof NextResponse) return guard;

  const sp = new URL(req.url).searchParams;
  const editionId = sp.get("editionId");
  if (!editionId) return NextResponse.json({ error: "editionId is required." }, { status: 400 });
  const categoryId = sp.get("categoryId") || undefined;
  const statusParam = sp.get("status");
  const status = STATUSES.find((s) => s === statusParam);
  const q = sp.get("q")?.trim();
  const take = Math.min(100, Math.max(5, Number(sp.get("take")) || 25));
  const page = Math.max(1, Number(sp.get("page")) || 1);

  const where: Prisma.HonorsNominationWhereInput = {
    editionId,
    ...(categoryId ? { categoryId } : {}),
    ...(status ? { status } : {}),
    ...(q
      ? {
          OR: [
            { nomineeName: { contains: q, mode: "insensitive" } },
            { reference: { contains: q.toUpperCase() } },
            { nomineeState: { contains: q, mode: "insensitive" } },
          ],
        }
      : {}),
  };

  const [items, totalCount, byStatus] = await Promise.all([
    db.honorsNomination.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * take,
      take,
      include: { category: { select: { id: true, name: true } }, finalist: { select: { id: true } }, agent: { select: { name: true, referrerCode: true } } },
    }),
    db.honorsNomination.count({ where }),
    db.honorsNomination.groupBy({ by: ["status"], where: { editionId, ...(categoryId ? { categoryId } : {}) }, _count: { _all: true } }),
  ]);

  return NextResponse.json({
    items,
    totalCount,
    page,
    take,
    counts: Object.fromEntries(byStatus.map((s) => [s.status, s._count._all])),
  });
}
