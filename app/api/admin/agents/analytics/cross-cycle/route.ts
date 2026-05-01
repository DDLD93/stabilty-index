import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdminSession } from "@/lib/adminSession";
import { getCrossCycleAgentMatrix } from "@/lib/admin/agentAnalytics";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const querySchema = z.object({
  limit: z.coerce.number().int().min(1).max(48).optional().default(12),
});

export async function GET(req: Request) {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const url = new URL(req.url);
  const parsed = querySchema.safeParse({ limit: url.searchParams.get("limit") ?? undefined });
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid limit (1–48)." }, { status: 400 });
  }
  const limit = parsed.data.limit;

  const data = await getCrossCycleAgentMatrix(limit);

  return NextResponse.json(data);
}
