import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { audit } from "@/lib/admin/audit";
import { adminOrResponse, parseBody } from "@/lib/admin/guard";
import { LIMITS } from "@/lib/honors/constants";

export const dynamic = "force-dynamic";

const bodySchema = z.object({
  finalistId: z.string().min(1).nullable(),
  citation: z.string().trim().max(LIMITS.citation).nullable().optional(),
  note: z.string().trim().max(1000).nullable().optional(),
});

type Params = { params: Promise<{ id: string }> };

/**
 * Set a category's winner after voting closes. The public vote decides: picking anyone
 * other than the clear vote leader needs a written reason (disqualification or a tie).
 */
export async function PATCH(req: Request, { params }: Params) {
  const guard = await adminOrResponse();
  if (guard instanceof NextResponse) return guard;
  const { id } = await params;
  const body = await parseBody(req, bodySchema);
  if (body instanceof NextResponse) return body;

  const category = await db.honorsCategory.findUnique({
    where: { id },
    include: { edition: { select: { status: true } }, finalists: { where: { isActive: true }, select: { id: true } } },
  });
  if (!category) return NextResponse.json({ error: "Category not found." }, { status: 404 });
  if (!["VOTING_CLOSED", "ANNOUNCED"].includes(category.edition.status)) {
    return NextResponse.json({ error: "Winners can be set once voting has closed." }, { status: 409 });
  }

  if (body.finalistId === null) {
    await db.honorsCategory.update({ where: { id }, data: { winnerFinalistId: null, winnerPublishedAt: null, winnerNote: null } });
    await audit(guard.adminUserId, "HonorsWinnerClear", { categoryId: id });
    return NextResponse.json({ ok: true });
  }
  if (!category.finalists.some((f) => f.id === body.finalistId)) {
    return NextResponse.json({ error: "That finalist isn’t active in this category." }, { status: 400 });
  }

  const counts = await db.honorsVote.groupBy({
    by: ["finalistId"],
    where: { categoryId: id, isVoid: false, finalistId: { in: category.finalists.map((f) => f.id) } },
    _count: { _all: true },
  });
  const top = Math.max(0, ...counts.map((c) => c._count._all));
  const leaders = counts.filter((c) => c._count._all === top && top > 0).map((c) => c.finalistId);
  const isClearLeader = leaders.length === 1 && leaders[0] === body.finalistId;
  const note = body.note?.trim() || null;
  if (!isClearLeader && (!note || note.length < 20)) {
    return NextResponse.json(
      {
        error:
          leaders.length > 1
            ? "This category is tied. Explain how the tie was settled (at least 20 characters)."
            : "This finalist doesn’t have the most verified votes. Explain why (at least 20 characters), for example a disqualification.",
        leaders,
      },
      { status: 400 },
    );
  }

  await db.honorsCategory.update({
    where: { id },
    data: {
      winnerFinalistId: body.finalistId,
      ...(body.citation !== undefined ? { winnerCitation: body.citation } : {}),
      winnerNote: isClearLeader ? null : note,
    },
  });
  await audit(guard.adminUserId, "HonorsWinnerSet", { categoryId: id, finalistId: body.finalistId, override: !isClearLeader, note: isClearLeader ? null : note });
  return NextResponse.json({ ok: true, override: !isClearLeader });
}
