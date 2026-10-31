import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { audit } from "@/lib/admin/audit";
import { adminOrResponse, parseBody } from "@/lib/admin/guard";
import { isMailConfigured } from "@/lib/mailer";

export const dynamic = "force-dynamic";

/** Overview for the admin Honors screen: every edition, and the chosen one in full. */
export async function GET(req: Request) {
  const guard = await adminOrResponse();
  if (guard instanceof NextResponse) return guard;

  const editionId = new URL(req.url).searchParams.get("editionId");
  const editions = await db.honorsEdition.findMany({ orderBy: { year: "desc" }, select: { id: true, year: true, title: true, status: true } });
  const id = editionId ?? editions[0]?.id;
  if (!id) return NextResponse.json({ editions: [], edition: null, mailConfigured: isMailConfigured() });

  const edition = await db.honorsEdition.findUnique({
    where: { id },
    include: {
      categories: {
        orderBy: { sortOrder: "asc" },
        include: { _count: { select: { nominations: true, finalists: true, votes: true } } },
      },
      _count: { select: { nominations: true, finalists: true, votes: true, voteRequests: true } },
    },
  });
  return NextResponse.json({ editions, edition, mailConfigured: isMailConfigured() });
}

const createSchema = z.object({
  year: z.number().int().min(2024).max(2100),
  title: z.string().trim().min(3).max(120),
  copyCategoriesFrom: z.string().optional(),
});

export async function POST(req: Request) {
  const guard = await adminOrResponse();
  if (guard instanceof NextResponse) return guard;
  const body = await parseBody(req, createSchema);
  if (body instanceof NextResponse) return body;

  const exists = await db.honorsEdition.findUnique({ where: { year: body.year }, select: { id: true } });
  if (exists) return NextResponse.json({ error: `An edition for ${body.year} already exists.` }, { status: 409 });

  const source = body.copyCategoriesFrom
    ? await db.honorsCategory.findMany({ where: { editionId: body.copyCategoriesFrom }, orderBy: { sortOrder: "asc" } })
    : [];
  const edition = await db.honorsEdition.create({
    data: {
      year: body.year,
      title: body.title,
      categories: {
        create: source.map((c) => ({
          slug: c.slug,
          name: c.name.replace(/\b20\d{2}\b/g, String(body.year)),
          shortDescription: c.shortDescription.replace(/\b20\d{2}\b/g, String(body.year)),
          criteria: c.criteria?.replace(/\b20\d{2}\b/g, String(body.year)) ?? null,
          allowedNomineeTypes: c.allowedNomineeTypes,
          sortOrder: c.sortOrder,
        })),
      },
    },
    select: { id: true },
  });
  await audit(guard.adminUserId, "HonorsEditionCreate", { editionId: edition.id, year: body.year, copiedCategories: source.length });
  return NextResponse.json({ id: edition.id }, { status: 201 });
}
