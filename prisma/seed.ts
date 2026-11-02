import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";
import { allocateUniqueReferrerCode } from "../lib/agentReferrerCode";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is required. Set it in .env");
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

const ADMIN_EMAIL = process.env.SEED_ADMIN_EMAIL ?? "admin@system.com";
const ADMIN_PASSWORD = process.env.SEED_ADMIN_PASSWORD ?? "12345678";

/** Clear all tables (schema order: respect FK; do not seed after). */
async function clearAllTables() {
  await prisma.auditLog.deleteMany();
  await prisma.adminUser.deleteMany();
  // await prisma.snapshot.deleteMany();
  // await prisma.submission.deleteMany();
  // await prisma.cycle.deleteMany();
  console.log("Cleared all tables.");
}

async function seedAdmin() {
  const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 10);
  const admin = await prisma.adminUser.upsert({
    where: { email: ADMIN_EMAIL },
    update: { passwordHash },
    create: {
      email: ADMIN_EMAIL,
      passwordHash,
    },
  });
  console.log("Seeded admin user:", admin.email);
}

/** Optional demo agent for referral testing (`/survey?ref=<code>`). */
async function seedDemoAgent() {
  const email = "demo.agent@stability-index.local";
  const existing = await prisma.agent.findUnique({ where: { email } });
  if (existing) {
    console.log("Demo agent already exists:", email, "code:", existing.referrerCode);
    return;
  }
  const referrerCode = await allocateUniqueReferrerCode(prisma);
  await prisma.agent.create({
    data: {
      name: "Demo Agent",
      email,
      phone: "+2348000000000",
      referrerCode,
    },
  });
  console.log("Seeded demo agent:", email, "referral /survey?ref=" + referrerCode);
}

/**
 * NSI Honors 2026: a DRAFT edition with no dates and the ten official categories.
 * The default run never overwrites admin edits; `--sync-categories` replaces the set (see syncHonors2026Categories).
 */
const ALL_NOMINEE_TYPES = ["PUBLIC_INSTITUTION", "STATE_OR_LGA", "ORGANISATION", "INDIVIDUAL"] as const;

const HONORS_2026_CATEGORIES: {
  slug: string;
  name: string;
  shortDescription: string;
  criteria: string;
  allowedNomineeTypes?: (typeof ALL_NOMINEE_TYPES)[number][];
}[] = [
  {
    slug: "public-service-leadership",
    name: "Public Service Leadership 2026",
    shortDescription: "A public servant or public body whose leadership measurably improved life for Nigerians in 2026.",
    criteria: "Leadership in government or the public service in 2026 that delivered visible, evidenced improvements for the public, with integrity and accountability.",
    allowedNomineeTypes: ["INDIVIDUAL", "PUBLIC_INSTITUTION", "STATE_OR_LGA"],
  },
  {
    slug: "education-impact",
    name: "Education Impact 2026",
    shortDescription: "Work that widened access to learning or improved its quality in 2026.",
    criteria: "More children or adults learning, better schools, teachers or outcomes in 2026, backed by evidence.",
  },
  {
    slug: "healthcare-impact",
    name: "Healthcare Impact 2026",
    shortDescription: "Work that brought better or more reachable healthcare to people in 2026.",
    criteria: "Wider access to care, better facilities or services, or improved health outcomes in 2026, backed by evidence.",
  },
  {
    slug: "community-development",
    name: "Community Development 2026",
    shortDescription: "Work that strengthened a community’s livelihoods, services or cohesion in 2026.",
    criteria: "Lasting improvements a community can point to in 2026, such as jobs, local services or peace, backed by evidence.",
  },
  {
    slug: "agricultural-impact",
    name: "Agricultural Impact 2026",
    shortDescription: "Work that raised food production, farmer incomes or food security in 2026.",
    criteria: "Better harvests, farmer livelihoods, storage, markets or food security in 2026, backed by evidence.",
  },
  {
    slug: "public-institution-excellence",
    name: "Public Institution Excellence 2026",
    shortDescription: "A public institution, agency, state or LGA that served people noticeably better in 2026.",
    criteria: "Improvements in service delivery, transparency or responsiveness that the public could see in 2026, backed by evidence.",
    allowedNomineeTypes: ["PUBLIC_INSTITUTION", "STATE_OR_LGA"],
  },
  {
    slug: "infrastructure-impact",
    name: "Infrastructure Impact 2026",
    shortDescription: "Roads, power, water, transport or other infrastructure delivered or kept working in 2026.",
    criteria: "Infrastructure completed, repaired or maintained in 2026 with clear public benefit, backed by evidence.",
  },
  {
    slug: "digital-innovation",
    name: "Digital Innovation 2026",
    shortDescription: "Technology that solved a public problem or widened access for Nigerians in 2026.",
    criteria: "A digital product, service or programme with real users and measurable public benefit in 2026.",
  },
  {
    slug: "security-impact",
    name: "Security Impact 2026",
    shortDescription: "Contributions to safety, peacebuilding or reduced violence in 2026.",
    criteria: "Communities made safer or conflicts eased in 2026, backed by evidence.",
  },
  {
    slug: "youth-development-impact",
    name: "Youth Development Impact 2026",
    shortDescription: "Work that opened up skills, jobs or opportunities for young Nigerians in 2026.",
    criteria: "More young people trained, employed, supported or given a voice in 2026, backed by evidence.",
  },
];

/** Slugs retired from earlier drafts of the list, mapped to their replacement, so a sync renames instead of deleting. */
const HONORS_2026_RENAMED_SLUGS: Record<string, string> = {
  "public-institution": "public-institution-excellence",
};

async function seedHonors2026() {
  const edition = await prisma.honorsEdition.upsert({
    where: { year: 2026 },
    update: {},
    create: { year: 2026, title: "NSI Honors 2026", status: "DRAFT" },
  });
  for (const [i, c] of HONORS_2026_CATEGORIES.entries()) {
    await prisma.honorsCategory.upsert({
      where: { editionId_slug: { editionId: edition.id, slug: c.slug } },
      update: {},
      create: {
        editionId: edition.id,
        slug: c.slug,
        name: c.name,
        shortDescription: c.shortDescription,
        criteria: c.criteria,
        allowedNomineeTypes: [...(c.allowedNomineeTypes ?? ALL_NOMINEE_TYPES)],
        sortOrder: i + 1,
      },
    });
  }
  console.log(`Seeded ${edition.title} (${edition.status}) with ${HONORS_2026_CATEGORIES.length} categories.`);
}

/**
 * Makes the 2026 edition's categories exactly HONORS_2026_CATEGORIES: renames retired slugs, overwrites
 * names, copy, eligibility and order, and deletes anything else. Refuses once the edition has any
 * nominations, finalists or votes, because changing categories after the public has used them would
 * mislead nominators and voters.
 */
async function syncHonors2026Categories() {
  const edition = await prisma.honorsEdition.findUnique({ where: { year: 2026 }, select: { id: true, title: true } });
  if (!edition) {
    console.log("No 2026 edition yet; creating it.");
    await seedHonors2026();
    return;
  }

  const [nominations, finalists, votes] = await Promise.all([
    prisma.honorsNomination.count({ where: { editionId: edition.id } }),
    prisma.honorsFinalist.count({ where: { editionId: edition.id } }),
    prisma.honorsVote.count({ where: { editionId: edition.id } }),
  ]);
  if (nominations + finalists + votes > 0) {
    throw new Error(
      `Refusing to sync categories: ${edition.title} already has ${nominations} nominations, ${finalists} finalists and ${votes} votes. ` +
        "Edit categories in admin instead.",
    );
  }

  const wanted = new Set(HONORS_2026_CATEGORIES.map((c) => c.slug));
  const report = { renamed: [] as string[], created: [] as string[], updated: [] as string[], deleted: [] as string[] };

  await prisma.$transaction(async (tx) => {
    const existing = await tx.honorsCategory.findMany({ where: { editionId: edition.id }, select: { id: true, slug: true } });
    const slugs = new Set(existing.map((c) => c.slug));

    for (const [from, to] of Object.entries(HONORS_2026_RENAMED_SLUGS)) {
      if (slugs.has(from) && !slugs.has(to)) {
        await tx.honorsCategory.update({ where: { editionId_slug: { editionId: edition.id, slug: from } }, data: { slug: to } });
        slugs.delete(from);
        slugs.add(to);
        report.renamed.push(`${from} → ${to}`);
      }
    }

    for (const [i, c] of HONORS_2026_CATEGORIES.entries()) {
      const fields = {
        name: c.name,
        shortDescription: c.shortDescription,
        criteria: c.criteria,
        allowedNomineeTypes: [...(c.allowedNomineeTypes ?? ALL_NOMINEE_TYPES)],
        sortOrder: i + 1,
        isActive: true,
      };
      await tx.honorsCategory.upsert({
        where: { editionId_slug: { editionId: edition.id, slug: c.slug } },
        update: fields,
        create: { editionId: edition.id, slug: c.slug, ...fields },
      });
      (slugs.has(c.slug) ? report.updated : report.created).push(c.slug);
    }

    const extra = [...slugs].filter((s) => !wanted.has(s));
    if (extra.length) {
      await tx.honorsCategory.deleteMany({ where: { editionId: edition.id, slug: { in: extra } } });
      report.deleted.push(...extra);
    }
  });

  console.log(`Synced ${edition.title} to ${HONORS_2026_CATEGORIES.length} categories.`);
  for (const [k, v] of Object.entries(report)) console.log(`  ${k} (${v.length}): ${v.join(", ") || "—"}`);
}

async function main() {
  // `npm run db:seed:honors -- --sync-categories` replaces the 2026 category set (only while it has no activity).
  if (process.argv.includes("--sync-categories")) {
    await syncHonors2026Categories();
    return;
  }
  // `npm run db:seed:honors` seeds Honors only and never touches the admin account.
  if (process.argv.includes("--honors-only")) {
    await seedHonors2026();
    return;
  }
  // await clearAllTables();
  await seedAdmin();
  await seedHonors2026();
  // await seedDemoAgent();
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
