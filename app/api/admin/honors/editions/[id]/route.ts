import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { audit } from "@/lib/admin/audit";
import { adminOrResponse, parseBody } from "@/lib/admin/guard";

export const dynamic = "force-dynamic";

const optionalDate = z
  .string()
  .datetime({ offset: true })
  .nullable()
  .optional()
  .transform((v) => (v === undefined ? undefined : v === null ? null : new Date(v)));

const patchSchema = z.object({
  title: z.string().trim().min(3).max(120).optional(),
  nominationsOpenAt: optionalDate,
  nominationsCloseAt: optionalDate,
  votingOpenAt: optionalDate,
  votingCloseAt: optionalDate,
  ceremonyAt: optionalDate,
  ceremonyVenue: z.string().trim().max(200).nullable().optional(),
  ceremonyDetails: z.string().trim().max(2000).nullable().optional(),
  showVoteResults: z.boolean().optional(),
});

type Params = { params: Promise<{ id: string }> };

export async function PATCH(req: Request, { params }: Params) {
  const guard = await adminOrResponse();
  if (guard instanceof NextResponse) return guard;
  const { id } = await params;
  const body = await parseBody(req, patchSchema);
  if (body instanceof NextResponse) return body;

  const data = Object.fromEntries(Object.entries(body).filter(([, v]) => v !== undefined));
  const check = (a?: Date | null, b?: Date | null) => !a || !b || a < b;
  const current = await db.honorsEdition.findUnique({ where: { id } });
  if (!current) return NextResponse.json({ error: "Edition not found." }, { status: 404 });
  const merged = { ...current, ...data } as typeof current;
  if (!check(merged.nominationsOpenAt, merged.nominationsCloseAt) || !check(merged.votingOpenAt, merged.votingCloseAt)) {
    return NextResponse.json({ error: "Each closing date must be after its opening date." }, { status: 400 });
  }

  await db.honorsEdition.update({ where: { id }, data });
  await audit(guard.adminUserId, "HonorsEditionUpdate", { editionId: id, fields: Object.keys(data) });
  return NextResponse.json({ ok: true });
}
