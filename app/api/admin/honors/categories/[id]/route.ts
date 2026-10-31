import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { audit } from "@/lib/admin/audit";
import { adminOrResponse, parseBody } from "@/lib/admin/guard";
import { NOMINEE_TYPES } from "@/lib/honors/constants";

export const dynamic = "force-dynamic";

const patchSchema = z.object({
  name: z.string().trim().min(3).max(120).optional(),
  shortDescription: z.string().trim().min(10).max(300).optional(),
  criteria: z.string().trim().max(1000).nullable().optional(),
  allowedNomineeTypes: z.array(z.enum(NOMINEE_TYPES)).min(1).optional(),
  sortOrder: z.number().int().min(0).max(1000).optional(),
  isActive: z.boolean().optional(),
});

type Params = { params: Promise<{ id: string }> };

export async function PATCH(req: Request, { params }: Params) {
  const guard = await adminOrResponse();
  if (guard instanceof NextResponse) return guard;
  const { id } = await params;
  const body = await parseBody(req, patchSchema);
  if (body instanceof NextResponse) return body;

  const category = await db.honorsCategory.findUnique({ where: { id }, include: { edition: { select: { status: true } } } });
  if (!category) return NextResponse.json({ error: "Category not found." }, { status: 404 });
  if (body.isActive === false && ["VOTING_OPEN", "VOTING_CLOSED"].includes(category.edition.status)) {
    return NextResponse.json({ error: "Categories can’t be switched off during or after voting." }, { status: 409 });
  }

  const data = Object.fromEntries(Object.entries(body).filter(([, v]) => v !== undefined));
  await db.honorsCategory.update({ where: { id }, data });
  await audit(guard.adminUserId, "HonorsCategoryUpdate", { categoryId: id, fields: Object.keys(data) });
  return NextResponse.json({ ok: true });
}
