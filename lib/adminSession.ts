import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function requireAdminSession() {
  const session = await getServerSession(authOptions);
  return session;
}

/** Returns AdminUser id only if it exists in DB (avoids AuditLog FK violation). */
export async function getAuditAdminUserId(
  session: Awaited<ReturnType<typeof requireAdminSession>>
): Promise<string | null> {
  const rawId = (session?.user as { id?: string } | undefined)?.id;
  if (!rawId) return null;
  const admin = await db.adminUser.findUnique({ where: { id: rawId }, select: { id: true } });
  return admin?.id ?? null;
}

