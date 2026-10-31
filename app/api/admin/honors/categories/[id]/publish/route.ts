import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { audit } from "@/lib/admin/audit";
import { adminOrResponse, parseBody } from "@/lib/admin/guard";

export const dynamic = "force-dynamic";

const bodySchema = z.object({ published: z.boolean() });

type Params = { params: Promise<{ id: string }> };

/** Publish or unpublish a category's winner on the public pages. */
export async function POST(req: Request, { params }: Params) {
  const guard = await adminOrResponse();
  if (guard instanceof NextResponse) return guard;
  const { id } = await params;
  const body = await parseBody(req, bodySchema);
  if (body instanceof NextResponse) return body;

  const category = await db.honorsCategory.findUnique({ where: { id }, include: { edition: { select: { status: true } } } });
  if (!category) return NextResponse.json({ error: "Category not found." }, { status: 404 });
  if (body.published && !category.winnerFinalistId) return NextResponse.json({ error: "Choose a winner first." }, { status: 409 });
  if (body.published && !["VOTING_CLOSED", "ANNOUNCED"].includes(category.edition.status)) {
    return NextResponse.json({ error: "Winners can be published once voting has closed." }, { status: 409 });
  }

  await db.honorsCategory.update({ where: { id }, data: { winnerPublishedAt: body.published ? new Date() : null } });
  await audit(guard.adminUserId, body.published ? "HonorsWinnerPublish" : "HonorsWinnerUnpublish", { categoryId: id });
  return NextResponse.json({ ok: true });
}
