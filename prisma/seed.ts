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

/** NSI Honors 2026: a DRAFT edition with no dates and the eight categories. Never overwrites admin edits. */
const ALL_NOMINEE_TYPES = ["PUBLIC_INSTITUTION", "STATE_OR_LGA", "ORGANISATION", "INDIVIDUAL"] as const;

const HONORS_2026_CATEGORIES: {
  slug: string;
  name: string;
  shortDescription: string;
  criteria: string;
  allowedNomineeTypes?: (typeof ALL_NOMINEE_TYPES)[number][];
}[] = [
  {
    slug: "public-institution",
    name: "Public Institution of 2026",
    shortDescription: "A public institution, agency, state or LGA that served people noticeably better in 2026.",
    criteria: "Improvements in service delivery, transparency or responsiveness that the public could see in 2026, backed by evidence.",
    allowedNomineeTypes: ["PUBLIC_INSTITUTION", "STATE_OR_LGA"],
  },
  {
    slug: "education-impact",
    name: "Education Impact of 2026",
    shortDescription: "Work that widened access to learning or improved its quality in 2026.",
    criteria: "More children or adults learning, better schools, teachers or outcomes in 2026, backed by evidence.",
  },
  {
    slug: "healthcare-impact",
    name: "Healthcare Impact of 2026",
    shortDescription: "Work that brought better or more reachable healthcare to people in 2026.",
    criteria: "Wider access to care, better facilities or services, or improved health outcomes in 2026, backed by evidence.",
  },
  {
    slug: "infrastructure-impact",
    name: "Infrastructure Impact of 2026",
    shortDescription: "Roads, power, water, transport or other infrastructure delivered or kept working in 2026.",
    criteria: "Infrastructure completed, repaired or maintained in 2026 with clear public benefit, backed by evidence.",
  },
  {
    slug: "community-development",
    name: "Community Development of 2026",
    shortDescription: "Work that strengthened a community’s livelihoods, services or cohesion in 2026.",
    criteria: "Lasting improvements a community can point to in 2026, such as jobs, local services or peace, backed by evidence.",
  },
  {
    slug: "digital-innovation",
    name: "Digital Innovation of 2026",
    shortDescription: "Technology that solved a public problem or widened access for Nigerians in 2026.",
    criteria: "A digital product, service or programme with real users and measurable public benefit in 2026.",
  },
  {
    slug: "agricultural-impact",
    name: "Agricultural Impact of 2026",
    shortDescription: "Work that raised food production, farmer incomes or food security in 2026.",
    criteria: "Better harvests, farmer livelihoods, storage, markets or food security in 2026, backed by evidence.",
  },
  {
    slug: "security-impact",
    name: "Security Impact of 2026",
    shortDescription: "Contributions to safety, peacebuilding or reduced violence in 2026.",
    criteria: "Communities made safer or conflicts eased in 2026, backed by evidence.",
  },
];

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

async function main() {
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
