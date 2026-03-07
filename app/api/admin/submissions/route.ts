import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireAdminSession } from "@/lib/adminSession";

const querySchema = z.object({
  take: z.coerce.number().int().min(1).max(100).default(25),
  page: z.coerce.number().int().min(1).default(1),
  cycleId: z.string().optional(),
});

export async function GET(req: Request) {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const url = new URL(req.url);
  const parsed = querySchema.safeParse({
    take: url.searchParams.get("take") ?? undefined,
    page: url.searchParams.get("page") ?? undefined,
    cycleId: url.searchParams.get("cycleId") ?? undefined,
  });
  if (!parsed.success) return NextResponse.json({ error: "Invalid query." }, { status: 400 });

  const { take, page, cycleId: queryCycleId } = parsed.data;

  let cycleId = queryCycleId;
  if (!cycleId) {
    const current = await db.cycle.findFirst({
      orderBy: { createdAt: "desc" },
      select: { id: true },
    });
    cycleId = current?.id ?? "";
  }

  const where = cycleId ? { cycleId } : {};

  const [totalCount, items] = await Promise.all([
    db.submission.count({ where }),
    db.submission.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * take,
      take,
      select: {
        id: true,
        createdAt: true,
        stabilityScore: true,
        mood: true,
        oneWord: true,
        pillarResponses: true,
        spotlightState: true,
        spotlightTags: true,
        spotlightComment: true,
        isFlagged: true,
        cycleId: true,
      },
    }),
  ]);

  return NextResponse.json({ items, totalCount });
}

