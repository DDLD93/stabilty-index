import { cache } from "react";
import { db } from "@/lib/db";

const categorySelect = {
  id: true,
  slug: true,
  name: true,
  shortDescription: true,
  criteria: true,
  allowedNomineeTypes: true,
  sortOrder: true,
  winnerFinalistId: true,
  winnerCitation: true,
  winnerPublishedAt: true,
} as const;

/** The edition the public sees: the latest one that isn't a draft. */
export const getPublicEdition = cache(async () => {
  return db.honorsEdition.findFirst({
    where: { status: { not: "DRAFT" } },
    orderBy: { year: "desc" },
    include: {
      categories: { where: { isActive: true }, orderBy: { sortOrder: "asc" }, select: categorySelect },
    },
  });
});

/** The edition for a given year, drafts included (used to show categories while details are pending). */
export const getEditionForYear = cache(async (year: number) => {
  return db.honorsEdition.findUnique({
    where: { year },
    include: {
      categories: { where: { isActive: true }, orderBy: { sortOrder: "asc" }, select: categorySelect },
    },
  });
});

export type PublicEdition = NonNullable<Awaited<ReturnType<typeof getPublicEdition>>>;
export type PublicCategory = PublicEdition["categories"][number];

export const getActiveFinalists = cache(async (editionId: string) => {
  return db.honorsFinalist.findMany({
    where: { editionId, isActive: true, category: { isActive: true } },
    orderBy: [{ categoryId: "asc" }, { sortOrder: "asc" }, { displayName: "asc" }],
    select: { id: true, categoryId: true, displayName: true, nomineeType: true, state: true, summary: true },
  });
});

export type PublicFinalist = Awaited<ReturnType<typeof getActiveFinalists>>[number];

export const getPublishedWinners = cache(async (editionId: string) => {
  return db.honorsCategory.findMany({
    where: { editionId, isActive: true, winnerPublishedAt: { not: null }, winnerFinalistId: { not: null } },
    orderBy: { sortOrder: "asc" },
    select: {
      id: true,
      slug: true,
      name: true,
      winnerCitation: true,
      winnerPublishedAt: true,
      winnerFinalist: { select: { id: true, displayName: true, nomineeType: true, state: true, summary: true } },
    },
  });
});

/** Valid (non-void) votes per finalist. */
export async function getTallies(editionId: string): Promise<Map<string, number>> {
  const rows = await db.honorsVote.groupBy({
    by: ["finalistId"],
    where: { editionId, isVoid: false },
    _count: { _all: true },
  });
  return new Map(rows.map((r) => [r.finalistId, r._count._all]));
}
