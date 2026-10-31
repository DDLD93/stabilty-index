import { NextResponse } from "next/server";
import type { z } from "zod";
import { getAuditAdminUserId, requireAdminSession } from "@/lib/adminSession";

/** Admin API guard: returns the auditing admin id, or a 401 response to return as-is. */
export async function adminOrResponse(): Promise<{ adminUserId: string | null } | NextResponse> {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return { adminUserId: await getAuditAdminUserId(session) };
}

/** Parse a JSON body with zod; returns data or a 400 response. */
export async function parseBody<T extends z.ZodType>(req: Request, schema: T): Promise<z.infer<T> | NextResponse> {
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid request." }, { status: 400 });
  }
  return parsed.data;
}

export function csvCell(value: unknown): string {
  const s = value === null || value === undefined ? "" : value instanceof Date ? value.toISOString() : String(value);
  // Neutralise spreadsheet formulas and quote everything.
  const safe = /^[=+\-@]/.test(s) ? `'${s}` : s;
  return `"${safe.replace(/"/g, '""')}"`;
}

export function csvResponse(filename: string, header: string[], rows: unknown[][]): Response {
  const body = [header.map(csvCell).join(","), ...rows.map((r) => r.map(csvCell).join(","))].join("\r\n");
  return new Response("﻿" + body, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}
