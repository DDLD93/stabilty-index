/**
 * One-off migration from the 1–5 survey scale to 1–10, plus the history fixes found by
 * scripts/audit-survey-history.ts.
 *
 *   npx tsx scripts/migrate-scale-to-10.ts --cutoff=2026-11-04T12:00:00Z            # dry run (default)
 *   npx tsx scripts/migrate-scale-to-10.ts --cutoff=2026-11-04T12:00:00Z --apply    # write
 *
 * --cutoff is the moment the 1–10 survey went live. Only submissions created BEFORE it are
 * converted, so 1–10 answers are never doubled. Scripts load `.env`, i.e. the remote database.
 *
 * What it does (all in one transaction, refused if it has run before):
 *  1. Submissions before the cutoff: every pillar answer ×2 (1–5 → 2–10); stabilityScore recomputed
 *     as round(mean) — numerically the same as before. Legacy rows without pillar answers are untouched.
 *  2. The open cycle labelled with the month it opened in is renamed to the previous month
 *     (cycles are named after the month the survey asks about: opened 1 Nov → "October 2026").
 *  3. Every published edition is linked to the cycle whose answers were collected just before it was
 *     published, and its overall and five pillar scores are recomputed from those answers on the
 *     1–10 scale (fixing the mismatches the audit found). Narratives and spotlights are not touched.
 *  4. Tidy-up: cycles feeding an edition are named after the month it covers; empty duplicate cycles
 *     (no answers, not open, no edition) are deleted; drafts listed in --delete-drafts=id,id are
 *     deleted; every published edition is locked.
 *  5. An AuditLog row "ScaleMigrateTo10" records what changed.
 * A JSON backup of every value it changes is written first (backups/, git-ignored).
 */
import "dotenv/config";
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { Prisma, PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { PILLAR_KEYS } from "../lib/constants";
import { cleanPeriod, monthNumber, previousMonthLabel } from "../lib/reportFormat";

const AUDIT_ACTION = "ScaleMigrateTo10";
const args = process.argv.slice(2);
const apply = args.includes("--apply");
const cutoffArg = args.find((a) => a.startsWith("--cutoff="))?.slice("--cutoff=".length);
const cutoff = cutoffArg ? new Date(cutoffArg) : null;
if (!cutoff || Number.isNaN(+cutoff)) {
  console.error("Missing or invalid --cutoff=<ISO date-time> (the moment the 1–10 survey went live).");
  process.exit(1);
}
if (+cutoff > Date.now()) {
  console.error("--cutoff is in the future; use the deploy time of the 1–10 survey.");
  process.exit(1);
}

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error("DATABASE_URL is required");
const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString }) });

const r2 = (n: number) => Math.round(n * 100) / 100;
const mean = (xs: number[]) => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : null);
const isOld = (v: unknown): v is number => typeof v === "number" && Number.isInteger(v) && v >= 1 && v <= 5;

type PillarJson = { title: string; score: number; summary?: string; [k: string]: unknown };

async function main() {
  console.log(`${apply ? "APPLY" : "DRY RUN"} · cutoff ${cutoff!.toISOString()}`);

  const already = await prisma.auditLog.findFirst({ where: { action: AUDIT_ACTION } });
  if (already) {
    console.error(`Refusing: this migration already ran at ${already.createdAt.toISOString()} (AuditLog ${already.id}).`);
    process.exitCode = 1;
    return;
  }

  // ---------- 1. submissions ----------
  const subs = await prisma.submission.findMany({
    select: { id: true, cycleId: true, createdAt: true, isFlagged: true, stabilityScore: true, pillarResponses: true },
  });
  const before = subs.filter((s) => s.createdAt < cutoff!);
  const toConvert: { id: string; old: Record<string, unknown>; oldScore: number | null; next: Record<string, number>; nextScore: number }[] = [];
  const skipped: { id: string; reason: string }[] = [];
  for (const s of before) {
    const pr = s.pillarResponses as Record<string, unknown> | null;
    if (!pr || typeof pr !== "object" || Object.keys(pr).length === 0) continue; // legacy 1–10 check-in
    const values = Object.values(pr);
    if (!values.every(isOld)) {
      skipped.push({ id: s.id, reason: `answers not all whole numbers 1–5: ${JSON.stringify(pr)}` });
      continue;
    }
    const next = Object.fromEntries(Object.entries(pr).map(([k, v]) => [k, (v as number) * 2]));
    const personal = mean(PILLAR_KEYS.map((k) => next[k]).filter((v): v is number => typeof v === "number"));
    toConvert.push({
      id: s.id,
      old: pr,
      oldScore: s.stabilityScore,
      next,
      nextScore: personal == null ? (s.stabilityScore ?? 1) : Math.min(10, Math.max(1, Math.round(personal))),
    });
  }
  const scoreChanged = toConvert.filter((c) => c.nextScore !== c.oldScore).length;
  console.log(`\n1. Submissions: ${subs.length} total, ${before.length} before cutoff, ${toConvert.length} to convert ×2, ${skipped.length} skipped, ${subs.length - before.length} after cutoff left alone.`);
  console.log(`   stabilityScore values that change: ${scoreChanged} (expected 0).`);
  for (const s of skipped.slice(0, 20)) console.log(`   skipped ${s.id}: ${s.reason}`);

  // Converted answers, used for the recomputation below (rows after the cutoff are already 1–10).
  const converted = new Map(toConvert.map((c) => [c.id, c.next]));
  const answers = (s: (typeof subs)[number]) =>
    (converted.get(s.id) ?? (s.pillarResponses as Record<string, unknown> | null) ?? {}) as Record<string, unknown>;

  // ---------- 2. open cycle label ----------
  const cycles = await prisma.cycle.findMany({ select: { id: true, monthYear: true, status: true, createdAt: true } });
  const renames: { id: string; from: string; to: string }[] = [];
  const lagosMonth = new Intl.DateTimeFormat("en-GB", { month: "long", year: "numeric", timeZone: "Africa/Lagos" });
  for (const c of cycles.filter((x) => x.status === "OPEN")) {
    // Labelled with the month it was opened in → it is really the previous month's survey.
    const openedIn = monthNumber(lagosMonth.format(c.createdAt));
    if (openedIn !== null && monthNumber(c.monthYear) === openedIn) {
      renames.push({ id: c.id, from: c.monthYear, to: previousMonthLabel(c.createdAt) });
    }
  }
  console.log(`\n2. Cycle renames: ${renames.length ? renames.map((r) => `"${r.from}" → "${r.to}" (${r.id})`).join("; ") : "none"}`);

  // ---------- 3. published editions ----------
  const firstAnswer = new Map<string, number>();
  for (const s of subs) firstAnswer.set(s.cycleId, Math.min(firstAnswer.get(s.cycleId) ?? Infinity, +s.createdAt));
  const snapshots = await prisma.snapshot.findMany({
    where: { publishedAt: { not: null } },
    select: { id: true, period: true, cycleId: true, overallScore: true, pillarScores: true, publicSentimentSummary: true, publishedAt: true },
    orderBy: { publishedAt: "asc" },
  });
  const editionUpdates: {
    id: string;
    period: string;
    cycleId: string;
    cycleLabel: string;
    before: { cycleId: string | null; overallScore: number; pillarScores: unknown; publicSentimentSummary: unknown };
    overallScore: number;
    pillarScores: unknown;
    publicSentimentSummary: unknown;
    n: number;
  }[] = [];
  const unmatched: string[] = [];
  for (const snap of snapshots) {
    const pub = +snap.publishedAt!;
    const source =
      (snap.cycleId && cycles.find((c) => c.id === snap.cycleId)) ||
      cycles
        .filter((c) => (firstAnswer.get(c.id) ?? Infinity) < pub && pub - firstAnswer.get(c.id)! < 45 * 864e5)
        .sort((a, b) => firstAnswer.get(b.id)! - firstAnswer.get(a.id)!)[0];
    if (!source) {
      unmatched.push(`${cleanPeriod(snap.period)} (${snap.id})`);
      continue;
    }
    const rows = subs.filter((s) => s.cycleId === source.id && !s.isFlagged);
    const perPillar: Record<string, number[]> = Object.fromEntries(PILLAR_KEYS.map((k) => [k, []]));
    const personal: number[] = [];
    for (const s of rows) {
      const a = answers(s);
      const vals = PILLAR_KEYS.map((k) => a[k]).filter((v): v is number => typeof v === "number");
      for (const k of PILLAR_KEYS) if (typeof a[k] === "number") perPillar[k].push(a[k] as number);
      if (vals.length === PILLAR_KEYS.length) personal.push(vals.reduce((x, y) => x + y, 0) / vals.length);
      else if (Object.keys(a).length === 0 && s.stabilityScore != null) personal.push(s.stabilityScore);
    }
    const overall = mean(personal);
    if (overall == null) {
      unmatched.push(`${cleanPeriod(snap.period)} (${snap.id}): cycle "${source.monthYear}" has no usable answers`);
      continue;
    }
    const rawPillars = snap.pillarScores as { pillars?: PillarJson[] } | PillarJson[] | null;
    const list: PillarJson[] = Array.isArray(rawPillars) ? rawPillars : (rawPillars?.pillars ?? []);
    const pillars = list.map((p, i) => {
      const key = PILLAR_KEYS.find((k) => k.toLowerCase() === String(p.title ?? "").trim().toLowerCase()) ?? PILLAR_KEYS[i];
      const m = key ? mean(perPillar[key]) : null;
      return m == null ? p : { ...p, score: r2(m) };
    });
    const sentiment = (snap.publicSentimentSummary ?? {}) as Record<string, unknown>;
    editionUpdates.push({
      id: snap.id,
      period: cleanPeriod(snap.period),
      cycleId: source.id,
      cycleLabel: renames.find((r) => r.id === source.id)?.to ?? source.monthYear,
      before: { cycleId: snap.cycleId, overallScore: snap.overallScore, pillarScores: snap.pillarScores, publicSentimentSummary: snap.publicSentimentSummary },
      overallScore: r2(overall),
      pillarScores: Array.isArray(rawPillars) ? pillars : { ...(rawPillars ?? {}), pillars },
      publicSentimentSummary: { ...sentiment, averagePublicScore: r2(overall) },
      n: rows.length,
    });
  }
  console.log(`\n3. Published editions: ${editionUpdates.length} to link and recompute${unmatched.length ? `, ${unmatched.length} left alone: ${unmatched.join("; ")}` : ""}`);
  for (const e of editionUpdates) {
    const oldP = (Array.isArray(e.before.pillarScores) ? e.before.pillarScores : (e.before.pillarScores as { pillars?: PillarJson[] })?.pillars ?? []) as PillarJson[];
    const newP = (Array.isArray(e.pillarScores) ? e.pillarScores : (e.pillarScores as { pillars: PillarJson[] }).pillars) as PillarJson[];
    console.log(`   ${e.period.padEnd(15)} ← cycle "${e.cycleLabel}" (${e.n} answers)  overall ${e.before.overallScore.toFixed(2)} → ${e.overallScore.toFixed(2)}`);
    console.log(`   ${"".padEnd(15)}    pillars ${oldP.map((p) => Number(p.score).toFixed(2)).join(" / ")} → ${newP.map((p) => Number(p.score).toFixed(2)).join(" / ")}`);
  }

  // ---------- 4. tidy-up ----------
  // 4a. A cycle that feeds an edition is named after the month that edition covers.
  for (const e of editionUpdates) {
    const c = cycles.find((x) => x.id === e.cycleId)!;
    const current = renames.find((r) => r.id === c.id)?.to ?? c.monthYear;
    if (current !== e.period) {
      const existing = renames.find((r) => r.id === c.id);
      if (existing) existing.to = e.period;
      else renames.push({ id: c.id, from: c.monthYear, to: e.period });
      e.cycleLabel = e.period;
    }
  }
  // 4b. Empty duplicate cycles: no answers, not open, not referenced by any edition (published or draft).
  const allSnapshots = await prisma.snapshot.findMany({ select: { id: true, cycleId: true, period: true, publishedAt: true } });
  const referenced = new Set([...allSnapshots.map((s) => s.cycleId), ...editionUpdates.map((e) => e.cycleId)].filter(Boolean));
  const emptyCycles = cycles.filter((c) => c.status !== "OPEN" && !firstAnswer.has(c.id) && !referenced.has(c.id));
  // 4c. Drafts named explicitly with --delete-drafts=id,id (must be unpublished).
  const draftIds = (args.find((a) => a.startsWith("--delete-drafts="))?.slice("--delete-drafts=".length) ?? "").split(",").filter(Boolean);
  const drafts = await prisma.snapshot.findMany({ where: { id: { in: draftIds } } });
  const notDraft = draftIds.filter((id) => !drafts.some((d) => d.id === id && !d.publishedAt));
  if (notDraft.length) throw new Error(`--delete-drafts: not unpublished snapshots: ${notDraft.join(", ")}`);
  // 4d. Every published edition is locked once corrected.
  const toLock = snapshots.map((s) => s.id);

  console.log(`\n4. Tidy-up`);
  console.log(`   Cycle renames: ${renames.length ? renames.map((r) => `"${r.from}" → "${r.to}"`).join("; ") : "none"}`);
  console.log(`   Empty cycles to delete (${emptyCycles.length}): ${emptyCycles.map((c) => `"${c.monthYear}" ${c.createdAt.toISOString().slice(0, 10)}`).join(", ") || "none"}`);
  console.log(`   Drafts to delete (${drafts.length}): ${drafts.map((d) => `"${d.period}" ${d.id}`).join(", ") || "none"}`);
  console.log(`   Published editions to lock: ${toLock.length}`);

  if (!apply) {
    console.log("\nDry run only. Re-run with --apply to write these changes.");
    return;
  }

  // ---------- backup ----------
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  const dir = path.resolve("backups");
  mkdirSync(dir, { recursive: true });
  const backupFile = path.join(dir, `scale-migration-${stamp}.json`);
  writeFileSync(
    backupFile,
    JSON.stringify(
      {
        cutoff: cutoff!.toISOString(),
        submissions: toConvert.map((c) => ({ id: c.id, pillarResponses: c.old, stabilityScore: c.oldScore })),
        cycles: renames.map((r) => ({ id: r.id, monthYear: r.from })),
        snapshots: editionUpdates.map((e) => ({ id: e.id, ...e.before, isLocked: false })),
        deletedCycles: emptyCycles,
        deletedDrafts: drafts,
      },
      null,
      2
    ),
    "utf8"
  );
  console.log(`\nBackup written: ${backupFile}`);

  // ---------- write ----------
  await prisma.$transaction(
    async (tx) => {
      const ids = toConvert.map((c) => c.id);
      // Double every answer in one statement; the WHERE repeats the 1–5 guard so nothing is doubled twice.
      const updated = ids.length
        ? await tx.$executeRaw`
            UPDATE "Submission" s
            SET "pillarResponses" = (
                  SELECT jsonb_object_agg(e.key, to_jsonb((e.value #>> '{}')::int * 2))
                  FROM jsonb_each(s."pillarResponses") e
                ),
                "updatedAt" = NOW()
            WHERE s.id IN (${Prisma.join(ids)})
              AND s."createdAt" < ${cutoff}
              AND NOT EXISTS (
                SELECT 1 FROM jsonb_each(s."pillarResponses") e
                WHERE jsonb_typeof(e.value) <> 'number' OR (e.value #>> '{}')::numeric NOT IN (1, 2, 3, 4, 5)
              )`
        : 0;
      if (updated !== ids.length) throw new Error(`Expected to convert ${ids.length} submissions, converted ${updated}. Rolled back.`);
      for (const c of toConvert.filter((x) => x.nextScore !== x.oldScore)) {
        await tx.submission.update({ where: { id: c.id }, data: { stabilityScore: c.nextScore } });
      }
      for (const r of renames) await tx.cycle.update({ where: { id: r.id }, data: { monthYear: r.to } });
      for (const e of editionUpdates) {
        await tx.snapshot.update({
          where: { id: e.id },
          data: {
            cycleId: e.cycleId,
            overallScore: e.overallScore,
            pillarScores: e.pillarScores as Prisma.InputJsonValue,
            publicSentimentSummary: e.publicSentimentSummary as Prisma.InputJsonValue,
          },
        });
      }
      if (drafts.length) await tx.snapshot.deleteMany({ where: { id: { in: drafts.map((d) => d.id) }, publishedAt: null } });
      if (emptyCycles.length) {
        const ids = emptyCycles.map((c) => c.id);
        const stillEmpty = await tx.submission.count({ where: { cycleId: { in: ids } } });
        if (stillEmpty) throw new Error("An 'empty' cycle received answers. Rolled back.");
        await tx.cycle.deleteMany({ where: { id: { in: ids }, status: { not: "OPEN" } } });
      }
      if (toLock.length) await tx.snapshot.updateMany({ where: { id: { in: toLock } }, data: { isLocked: true } });
      await tx.auditLog.create({
        data: {
          action: AUDIT_ACTION,
          metadata: {
            cutoff: cutoff!.toISOString(),
            submissionsConverted: updated,
            cyclesRenamed: renames,
            cyclesDeleted: emptyCycles.map((c) => ({ id: c.id, monthYear: c.monthYear })),
            draftsDeleted: drafts.map((d) => ({ id: d.id, period: d.period })),
            editionsLocked: toLock.length,
            editionsRecomputed: editionUpdates.map((e) => ({ id: e.id, period: e.period, cycleId: e.cycleId, overall: [e.before.overallScore, e.overallScore] })),
            backupFile: path.basename(backupFile),
          },
        },
      });
    },
    { timeout: 120_000, maxWait: 30_000 }
  );
  console.log("Applied. Re-run scripts/audit-survey-history.ts to check the result.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
