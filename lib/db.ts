import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

function createClient() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is required to use Prisma Client.");
  }

  // DATABASE_POOL_MAX caps pool connections (e.g. 1 for the single-connection local Prisma dev database).
  const max = Number(process.env.DATABASE_POOL_MAX) || undefined;
  const adapter = new PrismaPg({ connectionString, ...(max ? { max } : {}) });
  return new PrismaClient({
    adapter,
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });
}

export function getDb(): PrismaClient {
  if (globalForPrisma.prisma) return globalForPrisma.prisma;
  const client = createClient();
  if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = client;
  return client;
}

// Lazy proxy so importing modules doesn't require DATABASE_URL at build-time.
export const db = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    const client = getDb();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (client as any)[prop];
  },
});

