import type { Prisma } from "@prisma/client";
import { db } from "@/lib/db";

/** Write an admin audit entry. Never throws: auditing must not break the action it records. */
export async function audit(adminUserId: string | null, action: string, metadata?: Record<string, unknown>) {
  try {
    await db.auditLog.create({
      data: {
        ...(adminUserId ? { adminUserId } : {}),
        action,
        ...(metadata ? { metadata: metadata as Prisma.InputJsonValue } : {}),
      },
    });
  } catch (error) {
    console.error("[audit]", action, error);
  }
}
