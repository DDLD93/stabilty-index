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

async function main() {
  // await clearAllTables();
  await seedAdmin();
  // await seedDemoAgent();
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
