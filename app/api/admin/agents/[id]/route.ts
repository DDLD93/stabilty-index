import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireAdminSession, getAuditAdminUserId } from "@/lib/adminSession";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const patchSchema = z
  .object({
    name: z.string().trim().min(1).max(120).optional(),
    email: z.string().trim().email().max(255).optional(),
    phone: z.string().trim().min(5).max(40).optional(),
    isActive: z.boolean().optional(),
  })
  .refine((o) => Object.keys(o).length > 0, { message: "At least one field required." });

export async function PATCH(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const adminUserId = await getAuditAdminUserId(session);
  const { id } = await ctx.params;

  const json = await req.json().catch(() => null);
  const parsed = patchSchema.safeParse(json);
  if (!parsed.success) {
    const msg = parsed.error.issues[0]?.message ?? "Invalid body.";
    return NextResponse.json({ error: msg, details: parsed.error.flatten() }, { status: 400 });
  }

  const existing = await db.agent.findUnique({ where: { id }, select: { id: true } });
  if (!existing) {
    return NextResponse.json({ error: "Agent not found." }, { status: 404 });
  }

  try {
    const agent = await db.agent.update({
      where: { id },
      data: parsed.data,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        referrerCode: true,
        isActive: true,
        createdAt: true,
        _count: { select: { submissions: true } },
      },
    });

    await db.auditLog.create({
      data: {
        ...(adminUserId ? { adminUserId } : {}),
        action: "AdminUpdateAgent",
        metadata: { agentId: id, fields: Object.keys(parsed.data) },
      },
    });

    return NextResponse.json({
      agent: {
        id: agent.id,
        name: agent.name,
        email: agent.email,
        phone: agent.phone,
        referrerCode: agent.referrerCode,
        isActive: agent.isActive,
        createdAt: agent.createdAt.toISOString(),
        submissionCount: agent._count.submissions,
        referralPath: `/survey?ref=${agent.referrerCode}`,
      },
    });
  } catch (e: unknown) {
    const code = typeof e === "object" && e !== null && "code" in e ? (e as { code?: string }).code : undefined;
    if (code === "P2002") {
      return NextResponse.json({ error: "An agent with this email already exists." }, { status: 409 });
    }
    throw e;
  }
}
