import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireAdminSession } from "@/lib/adminSession";

const querySchema = z.object({
  take: z.coerce.number().int().min(1).max(100).default(25),
  cursor: z.string().optional(),
});

export async function GET(req: Request) {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const url = new URL(req.url);
  const parsed = querySchema.safeParse({
    take: url.searchParams.get("take") ?? undefined,
    cursor: url.searchParams.get("cursor") ?? undefined,
  });
  if (!parsed.success) return NextResponse.json({ error: "Invalid query." }, { status: 400 });

  const { take, cursor } = parsed.data;

  const items = await db.submission.findMany({
    take: take + 1,
    ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
    orderBy: { createdAt: "desc" },
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
  });

  const hasMore = items.length > take;
  const page = hasMore ? items.slice(0, take) : items;
  const nextCursor = hasMore ? page[page.length - 1]?.id ?? null : null;

  return NextResponse.json({ items: page, nextCursor });
}

