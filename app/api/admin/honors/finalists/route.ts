import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { audit } from "@/lib/admin/audit";
import { adminOrResponse, parseBody } from "@/lib/admin/guard";
import { NIGERIAN_STATES } from "@/lib/constants";
import { LIMITS, NOMINEE_TYPES } from "@/lib/honors/constants";
import { getTallies } from "@/lib/honors/queries";

export const dynamic = "force-dynamic";

/** Finalists of an edition with valid and void vote counts. */
export async function GET(req: Request) {
  const guard = await adminOrResponse();
  if (guard instanceof NextResponse) return guard;
  const editionId = new URL(req.url).searchParams.get("editionId");
  if (!editionId) return NextResponse.json({ error: "editionId is required." }, { status: 400 });

  const [finalists, tallies, voided] = await Promise.all([
    db.honorsFinalist.findMany({
      where: { editionId },
      orderBy: [{ sortOrder: "asc" }, { displayName: "asc" }],
      include: { nomination: { select: { reference: true } } },
    }),
    getTallies(editionId),
    db.honorsVote.groupBy({ by: ["finalistId"], where: { editionId, isVoid: true }, _count: { _all: true } }),
  ]);
  const voidBy = new Map(voided.map((v) => [v.finalistId, v._count._all]));
  return NextResponse.json({
    finalists: finalists.map((f) => ({ ...f, validVotes: tallies.get(f.id) ?? 0, voidVotes: voidBy.get(f.id) ?? 0 })),
  });
}

const createSchema = z.object({
  categoryId: z.string().min(1),
  displayName: z.string().trim().min(2).max(160),
  nomineeType: z.enum(NOMINEE_TYPES),
  state: z.enum(NIGERIAN_STATES).nullable().optional(),
  summary: z.string().trim().min(20).max(LIMITS.summary),
});

/** Add a finalist by hand (for example, merging several nominations of the same nominee). */
export async function POST(req: Request) {
  const guard = await adminOrResponse();
  if (guard instanceof NextResponse) return guard;
  const body = await parseBody(req, createSchema);
  if (body instanceof NextResponse) return body;

  const category = await db.honorsCategory.findUnique({ where: { id: body.categoryId }, include: { edition: { select: { id: true, status: true } } } });
  if (!category) return NextResponse.json({ error: "Category not found." }, { status: 404 });
  if (!["NOMINATIONS_OPEN", "SHORTLISTING"].includes(category.edition.status)) {
    return NextResponse.json({ error: "Finalists can only be added before voting opens." }, { status: 409 });
  }
  const last = await db.honorsFinalist.findFirst({ where: { categoryId: category.id }, orderBy: { sortOrder: "desc" }, select: { sortOrder: true } });
  const created = await db.honorsFinalist.create({
    data: {
      editionId: category.edition.id,
      categoryId: category.id,
      displayName: body.displayName,
      nomineeType: body.nomineeType,
      state: body.state ?? null,
      summary: body.summary,
      sortOrder: (last?.sortOrder ?? 0) + 1,
    },
    select: { id: true },
  });
  await audit(guard.adminUserId, "HonorsFinalistCreate", { finalistId: created.id, categoryId: category.id });
  return NextResponse.json({ id: created.id }, { status: 201 });
}
