import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { audit } from "@/lib/admin/audit";
import { adminOrResponse, parseBody } from "@/lib/admin/guard";
import { NOMINEE_TYPES, RESERVED_SLUGS } from "@/lib/honors/constants";

export const dynamic = "force-dynamic";

const categoryFields = {
  name: z.string().trim().min(3).max(120),
  shortDescription: z.string().trim().min(10).max(300),
  criteria: z.string().trim().max(1000).nullable().optional(),
  allowedNomineeTypes: z.array(z.enum(NOMINEE_TYPES)).min(1, "Allow at least one kind of nominee."),
};

const slugSchema = z
  .string()
  .trim()
  .min(3)
  .max(60)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lower-case letters, numbers and hyphens.")
  .refine((s) => !(RESERVED_SLUGS as readonly string[]).includes(s), "That address is reserved.");

const createSchema = z.object({ editionId: z.string().min(1), slug: slugSchema, ...categoryFields });

export async function POST(req: Request) {
  const guard = await adminOrResponse();
  if (guard instanceof NextResponse) return guard;
  const body = await parseBody(req, createSchema);
  if (body instanceof NextResponse) return body;

  const clash = await db.honorsCategory.findUnique({ where: { editionId_slug: { editionId: body.editionId, slug: body.slug } } });
  if (clash) return NextResponse.json({ error: "Another category already uses that address." }, { status: 409 });
  const last = await db.honorsCategory.findFirst({ where: { editionId: body.editionId }, orderBy: { sortOrder: "desc" }, select: { sortOrder: true } });

  const created = await db.honorsCategory.create({
    data: { ...body, criteria: body.criteria ?? null, sortOrder: (last?.sortOrder ?? 0) + 1 },
    select: { id: true },
  });
  await audit(guard.adminUserId, "HonorsCategoryCreate", { categoryId: created.id, slug: body.slug });
  return NextResponse.json({ id: created.id }, { status: 201 });
}
