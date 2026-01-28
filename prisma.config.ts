import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  // Don't use env() here; it throws for commands that don't need a DB URL (e.g. `prisma generate`).
  datasource: {
    url: process.env.DATABASE_URL ?? "",
  },
});

