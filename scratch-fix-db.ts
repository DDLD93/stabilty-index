import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is required");
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

const defaultQuestions = [
  {
    pillarKey: "Security",
    pillarLabel: "Security",
    questionText: "How stable is Security in Nigeria this month?"
  },
  {
    pillarKey: "FX & Economy",
    pillarLabel: "FX & Economy",
    questionText: "How stable is FX & Economy in Nigeria this month?"
  },
  {
    pillarKey: "Investor Confidence",
    pillarLabel: "Investor Confidence",
    questionText: "How stable is Investor Confidence in Nigeria this month?"
  },
  {
    pillarKey: "Governance",
    pillarLabel: "Governance",
    questionText: "How stable is Governance in Nigeria this month?"
  },
  {
    pillarKey: "Social Stability",
    pillarLabel: "Social Stability",
    questionText: "How stable is Social Stability in Nigeria this month?"
  }
];

async function main() {
  const openCycle = await prisma.cycle.findFirst({
    where: { status: "OPEN" },
  });

  if (!openCycle) {
    console.log("No open cycle found in database!");
    return;
  }

  console.log(`Found open cycle: ${openCycle.monthYear} (${openCycle.id})`);
  console.log("Updating surveyQuestions with default questions...");

  const updated = await prisma.cycle.update({
    where: { id: openCycle.id },
    data: {
      surveyQuestions: defaultQuestions,
    },
  });

  console.log("Update successful!");
  console.log(JSON.stringify(updated, null, 2));
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
  });
