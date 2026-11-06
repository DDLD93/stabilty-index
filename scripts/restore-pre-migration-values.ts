/**
 * Puts the past back exactly as it was before scripts/migrate-scale-to-10.ts ran (4 Nov 2026):
 * the original 1–5 survey answers and the originally published edition scores.
 * The 1–10 scale applies from the October 2026 edition onward, so that cycle is left alone.
 *
 * Reference: the full pre-change dump backups/prod-before-scale-20261104T091211Z.dump, extracted
 * (read-only, no database) to plain COPY text with:
 *   docker run --rm -v "<repo>/backups:/in:ro" postgres:17-alpine \
 *     sh -c 'pg_restore --data-only --table=Submission -f - /in/prod-before-scale-20261104T091211Z.dump'
 * saved as backups/pre-change-Submission.copy and backups/pre-change-Snapshot.copy.
 * The migration's own JSON backup is used as a cross-check: both sources must agree.
 *
 *   npx tsx scripts/restore-pre-migration-values.ts            # dry run (default)
 *   npx tsx scripts/restore-pre-migration-values.ts --apply    # write (remote DB in .env)
 *
 * Restored per row: Submission pillarResponses, stabilityScore, updatedAt; Snapshot overallScore,
 * pillarScores, publicSentimentSummary, updatedAt. Cycle names, edition↔cycle links, locks and the
 * tidy-up deletions are kept. One transaction; every restored row is re-read and compared before commit.
 */
import "dotenv/config";
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { Prisma, PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { cleanPeriod, pillarScaleFor } from "../lib/reportFormat";

const AUDIT_ACTION = "RestorePreMigrationValues";
const MIGRATION_DONE = new Date("2026-11-04T09:25:00Z"); // migration finished 09:19:10; nothing edited since
const BACKUPS = path.resolve("backups");
const DUMP_SUBMISSIONS = path.join(BACKUPS, "pre-change-Submission.copy");
const DUMP_SNAPSHOTS = path.join(BACKUPS, "pre-change-Snapshot.copy");
const MIGRATION_JSON = path.join(BACKUPS, "scale-migration-2026-11-04T09-19-09-722Z.json");
const apply = process.argv.includes("--apply");

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error("DATABASE_URL is required");
const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString }) });

// ---------- COPY text parsing ----------
function unescapeCopy(v: string): string | null {
  if (v === "\\N") return null;
  return v.replace(/\\(\d{1,3}|x[0-9a-fA-F]{1,2}|.)/g, (_, e: string) => {
    if (/^\d/.test(e)) return String.fromCharCode(parseInt(e, 8));
    if (e[0] === "x") return String.fromCharCode(parseInt(e.slice(1), 16));
    return ({ b: "\b", f: "\f", n: "\n", r: "\r", t: "\t", v: "\v" } as Record<string, string>)[e] ?? e;
  });
}

function readCopy(file: string): Record<string, string | null>[] {
  const lines = readFileSync(file, "utf8").split("\n").filter((l) => l.length > 0);
  const header = lines[0].match(/^COPY public\."\w+" \((.+)\) FROM stdin;$/);
  if (!header) throw new Error(`${file}: not a COPY file`);
  const cols = header[1].split(", ").map((c) => c.replace(/"/g, ""));
  return lines.slice(1).map((line) => {
    const cells = line.split("\t");
    if (cells.length !== cols.length) throw new Error(`${file}: row has ${cells.length} fields, expected ${cols.length}`);
    return Object.fromEntries(cols.map((c, i) => [c, unescapeCopy(cells[i])]));
  });
}

/** Stable JSON for comparisons (key order independent). */
function canon(v: unknown): string {
  if (Array.isArray(v)) return `[${v.map(canon).join(",")}]`;
  if (v && typeof v === "object") {
    return `{${Object.keys(v as object).sort().map((k) => `${JSON.stringify(k)}:${canon((v as Record<string, unknown>)[k])}`).join(",")}}`;
  }
  return JSON.stringify(v ?? null);
}
const json = (s: string | null) => (s == null ? null : (JSON.parse(s) as unknown));
const pgTime = (s: string) => new Date(`${s.replace(" ", "T")}Z`); // timestamp(3) columns hold UTC

async function main() {
  console.log(`${apply ? "APPLY" : "DRY RUN"} · reference: ${path.basename(DUMP_SUBMISSIONS)}, ${path.basename(DUMP_SNAPSHOTS)}`);

  const already = await prisma.auditLog.findFirst({ where: { action: AUDIT_ACTION } });
  if (already) {
    console.error(`Refusing: already restored at ${already.createdAt.toISOString()} (AuditLog ${already.id}).`);
    process.exitCode = 1;
    return;
  }

  const dumpSubs = new Map(readCopy(DUMP_SUBMISSIONS).map((r) => [r.id!, r]));
  const dumpSnaps = new Map(readCopy(DUMP_SNAPSHOTS).map((r) => [r.id!, r]));
  const migration = JSON.parse(readFileSync(MIGRATION_JSON, "utf8")) as {
    submissions: { id: string; pillarResponses: unknown; stabilityScore: number | null }[];
    snapshots: { id: string; overallScore: number; pillarScores: unknown; publicSentimentSummary: unknown }[];
  };
  console.log(`Dump: ${dumpSubs.size} submissions, ${dumpSnaps.size} snapshots. Migration backup: ${migration.submissions.length} submissions, ${migration.snapshots.length} editions.`);

  // ---------- current state ----------
  const cycles = await prisma.cycle.findMany({ select: { id: true, monthYear: true } });
  const scaleOf = new Map(cycles.map((c) => [c.id, pillarScaleFor(c.monthYear)]));
  const subs = await prisma.submission.findMany({
    select: { id: true, cycleId: true, pillarResponses: true, stabilityScore: true, updatedAt: true },
  });
  const snaps = await prisma.snapshot.findMany({
    where: { publishedAt: { not: null } },
    select: { id: true, period: true, overallScore: true, pillarScores: true, publicSentimentSummary: true, updatedAt: true },
  });

  // ---------- targets ----------
  const problems: string[] = [];
  const subTargets = subs
    .filter((s) => scaleOf.get(s.cycleId) === 5)
    .map((s) => {
      const d = dumpSubs.get(s.id);
      if (!d) problems.push(`submission ${s.id} is not in the dump`);
      return { s, d };
    })
    .filter((x): x is { s: (typeof subs)[number]; d: Record<string, string | null> } => !!x.d);
  const untouched = subs.length - subTargets.length;
  const snapTargets = snaps
    .map((s) => {
      const d = dumpSnaps.get(s.id);
      if (!d) problems.push(`edition ${s.id} (${s.period}) is not in the dump`);
      return { s, d };
    })
    .filter((x): x is { s: (typeof snaps)[number]; d: Record<string, string | null> } => !!x.d);

  // ---------- checks ----------
  const migSubs = new Map(migration.submissions.map((m) => [m.id, m]));
  for (const { s, d } of subTargets) {
    if (s.updatedAt > MIGRATION_DONE) problems.push(`submission ${s.id} was edited after the migration`);
    const m = migSubs.get(s.id);
    if (!m) problems.push(`submission ${s.id} missing from the migration backup`);
    else if (canon(m.pillarResponses) !== canon(json(d.pillarResponses)) || (m.stabilityScore ?? null) !== (d.stabilityScore == null ? null : Number(d.stabilityScore))) {
      problems.push(`submission ${s.id}: dump and migration backup disagree`);
    }
  }
  const migSnaps = new Map(migration.snapshots.map((m) => [m.id, m]));
  for (const { s, d } of snapTargets) {
    if (s.updatedAt > MIGRATION_DONE) problems.push(`edition ${s.period} was edited after the migration`);
    const m = migSnaps.get(s.id);
    if (!m) problems.push(`edition ${s.period} missing from the migration backup`);
    else if (
      m.overallScore !== Number(d.overallScore) ||
      canon(m.pillarScores) !== canon(json(d.pillarScores)) ||
      canon(m.publicSentimentSummary) !== canon(json(d.publicSentimentSummary))
    ) {
      problems.push(`edition ${s.period}: dump and migration backup disagree`);
    }
  }

  console.log(`\nSubmissions to restore: ${subTargets.length} (cycles up to September 2026). Left on 1–10: ${untouched} (October 2026 onward).`);
  console.log(`Editions to restore: ${snapTargets.length}`);
  const pillarsOf = (v: unknown) => {
    const list = (Array.isArray(v) ? v : (v as { pillars?: unknown[] } | null)?.pillars ?? []) as { score?: unknown }[];
    return list.map((p) => Number(p.score).toFixed(2)).join(" / ");
  };
  for (const { s, d } of [...snapTargets].sort((a, b) => +a.s.updatedAt - +b.s.updatedAt)) {
    console.log(`  ${cleanPeriod(s.period).padEnd(15)} overall ${s.overallScore.toFixed(2)} → ${Number(d.overallScore).toFixed(2)}   pillars → ${pillarsOf(json(d.pillarScores))}`);
  }
  if (problems.length) {
    console.error(`\nStopping: ${problems.length} problem(s):\n- ${problems.slice(0, 30).join("\n- ")}`);
    process.exitCode = 1;
    return;
  }
  console.log("\nChecks passed: dump and migration backup agree; nothing edited since the migration.");
  if (!apply) {
    console.log("Dry run only. Re-run with --apply to write.");
    return;
  }

  // ---------- backup current values ----------
  const backupFile = path.join(BACKUPS, `restore-${new Date().toISOString().replace(/[:.]/g, "-")}.json`);
  writeFileSync(
    backupFile,
    JSON.stringify(
      {
        submissions: subTargets.map(({ s }) => ({ id: s.id, pillarResponses: s.pillarResponses, stabilityScore: s.stabilityScore, updatedAt: s.updatedAt })),
        snapshots: snapTargets.map(({ s }) => ({ id: s.id, overallScore: s.overallScore, pillarScores: s.pillarScores, publicSentimentSummary: s.publicSentimentSummary, updatedAt: s.updatedAt })),
      },
      null,
      2
    ),
    "utf8"
  );
  console.log(`Backup of current values: ${backupFile}`);

  // ---------- write ----------
  await prisma.$transaction(
    async (tx) => {
      const values = subTargets.map(
        ({ d }) => Prisma.sql`(${d.id}, ${d.pillarResponses}::jsonb, ${d.stabilityScore == null ? null : Number(d.stabilityScore)}::int, ${d.updatedAt}::timestamp)`
      );
      const updated = values.length
        ? await tx.$executeRaw`
            UPDATE "Submission" s
            SET "pillarResponses" = v.pr, "stabilityScore" = v.sc, "updatedAt" = v.ua
            FROM (VALUES ${Prisma.join(values)}) AS v(id, pr, sc, ua)
            WHERE s.id = v.id`
        : 0;
      if (updated !== subTargets.length) throw new Error(`Expected ${subTargets.length} submissions, updated ${updated}. Rolled back.`);

      for (const { d } of snapTargets) {
        const n = await tx.$executeRaw`
          UPDATE "Snapshot"
          SET "overallScore" = ${Number(d.overallScore)}::double precision,
              "pillarScores" = ${d.pillarScores}::jsonb,
              "publicSentimentSummary" = ${d.publicSentimentSummary}::jsonb,
              "updatedAt" = ${d.updatedAt}::timestamp
          WHERE id = ${d.id}`;
        if (n !== 1) throw new Error(`Edition ${d.id} not updated. Rolled back.`);
      }

      // Re-read and compare every restored row with the dump before committing.
      const after = await tx.submission.findMany({
        where: { id: { in: subTargets.map(({ s }) => s.id) } },
        select: { id: true, pillarResponses: true, stabilityScore: true, updatedAt: true },
      });
      for (const a of after) {
        const d = dumpSubs.get(a.id)!;
        if (
          canon(a.pillarResponses) !== canon(json(d.pillarResponses)) ||
          a.stabilityScore !== (d.stabilityScore == null ? null : Number(d.stabilityScore)) ||
          +a.updatedAt !== +pgTime(d.updatedAt!)
        ) {
          throw new Error(`Verification failed for submission ${a.id}. Rolled back.`);
        }
      }
      const afterSnaps = await tx.snapshot.findMany({
        where: { id: { in: snapTargets.map(({ s }) => s.id) } },
        select: { id: true, overallScore: true, pillarScores: true, publicSentimentSummary: true },
      });
      for (const a of afterSnaps) {
        const d = dumpSnaps.get(a.id)!;
        if (
          a.overallScore !== Number(d.overallScore) ||
          canon(a.pillarScores) !== canon(json(d.pillarScores)) ||
          canon(a.publicSentimentSummary) !== canon(json(d.publicSentimentSummary))
        ) {
          throw new Error(`Verification failed for edition ${a.id}. Rolled back.`);
        }
      }

      await tx.auditLog.create({
        data: {
          action: AUDIT_ACTION,
          metadata: {
            reference: "backups/prod-before-scale-20261104T091211Z.dump",
            submissionsRestored: updated,
            editionsRestored: snapTargets.map(({ s, d }) => ({ id: s.id, period: cleanPeriod(s.period), overall: [s.overallScore, Number(d.overallScore)] })),
            backupFile: path.basename(backupFile),
          },
        },
      });
    },
    { timeout: 120_000, maxWait: 30_000 }
  );
  console.log("Restored and verified. Re-run scripts/audit-survey-history.ts to check.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
