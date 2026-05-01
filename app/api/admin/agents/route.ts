import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireAdminSession, getAuditAdminUserId } from "@/lib/adminSession";
import { allocateUniqueReferrerCode } from "@/lib/agentReferrerCode";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const createSchema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(255),
  phone: z.string().trim().min(5).max(40),
});

export async function GET() {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const agents = await db.agent.findMany({
    orderBy: { createdAt: "desc" },
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

  return NextResponse.json({
    agents: agents.map((a) => ({
      id: a.id,
      name: a.name,
      email: a.email,
      phone: a.phone,
      referrerCode: a.referrerCode,
      isActive: a.isActive,
      createdAt: a.createdAt.toISOString(),
      submissionCount: a._count.submissions,
      referralPath: `/survey?ref=${a.referrerCode}`,
    })),
  });
}

export async function POST(req: Request) {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const adminUserId = await getAuditAdminUserId(session);

  const json = await req.json().catch(() => null);
  const parsed = createSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid body.", details: parsed.error.flatten() }, { status: 400 });
  }

  const { name, email, phone } = parsed.data;

  const referrerCode = await allocateUniqueReferrerCode(db);

  try {
    const agent = await db.agent.create({
      data: { name, email, phone, referrerCode },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        referrerCode: true,
        isActive: true,
        createdAt: true,
      },
    });

    await db.auditLog.create({
      data: {
        ...(adminUserId ? { adminUserId } : {}),
        action: "AdminCreateAgent",
        metadata: { agentId: agent.id, referrerCode: agent.referrerCode },
      },
    });

    return NextResponse.json({
      agent: {
        ...agent,
        createdAt: agent.createdAt.toISOString(),
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
