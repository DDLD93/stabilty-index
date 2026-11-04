/**
 * READ-ONLY audit of every month's survey data and published editions.
 *
 *   npx tsx scripts/audit-survey-history.ts [--out=report.md]
 *
 * Recomputes each cycle's averages from the raw submissions and compares them
 * with what each snapshot published. It only reads: no create/update/delete.
 * Note: scripts load `.env` (the remote database), not `.env.local`.
 */
import "dotenv/config";
import { writeFileSync } from "node:fs";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { PILLAR_KEYS } from "../lib/constants";
import { change, cleanPeriod } from "../lib/reportFormat";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error("DATABASE_URL is required");
const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString }) });

const MONTHS = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];

/** "October 2026" → 202609 (sortable month index), or null. */
function monthIndex(label: string | null | undefined): number | null {
  const m = label?.trim().match(/^([A-Za-z]+)\s+(\d{4})/);
  if (!m) return null;
  const i = MONTHS.findIndex((n) => n.startsWith(m[1].toLowerCase().slice(0, 3)));
  return i < 0 ? null : Number(m[2]) * 12 + i;
}

const r2 = (n: number | null | undefined) => (n == null || !Number.isFinite(n) ? "—" : n.toFixed(2));
const mean = (xs: number[]) => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : null);

type PillarRow = { title: string; score: number | null };
function snapshotPillars(raw: unknown): PillarRow[] {
  const list = (raw && typeof raw === "object" && !Array.isArray(raw) ? (raw as { pillars?: unknown }).pillars : raw) ?? [];
  if (!Array.isArray(list)) return [];
  return list
    .filter((p): p is Record<string, unknown> => !!p && typeof p === "object")
    .map((p) => {
      const n = typeof p.score === "number" ? p.score : Number(p.score);
      return { title: String(p.title ?? "").trim(), score: p.score === "" || p.score == null || !Number.isFinite(n) ? null : n };
    });
}

const out: string[] = [];
const log = (s = "") => out.push(s);
const issues: string[] = [];
const issue = (s: string) => issues.push(s);

async function main() {
  const cycles = await prisma.cycle.findMany({ select: { id: true, monthYear: true, status: true, createdAt: true } });
  const submissions = await prisma.submission.findMany({
    select: { id: true, cycleId: true, stabilityScore: true, pillarResponses: true, isFlagged: true, createdAt: true },
  });
  const snapshots = await prisma.snapshot.findMany({
    select: {
      id: true, cycleId: true, period: true, overallScore: true, pillarScores: true,
      publicSentimentSummary: true, publishedAt: true, isLocked: true, createdAt: true,
    },
  });

  cycles.sort((a, b) => (monthIndex(a.monthYear) ?? 0) - (monthIndex(b.monthYear) ?? 0) || +a.createdAt - +b.createdAt);

  log(`# NSI survey history audit`);
  log(`Generated ${new Date().toISOString()} — read-only.`);
  log(`Cycles: ${cycles.length} · Submissions: ${submissions.length} · Snapshots: ${snapshots.length} (published ${snapshots.filter((s) => s.publishedAt).length})`);
  log();

  // ---------- duplicate cycle months ----------
  const byMonth = new Map<string, number>();
  for (const c of cycles) byMonth.set(cleanPeriod(c.monthYear), (byMonth.get(cleanPeriod(c.monthYear)) ?? 0) + 1);
  for (const [m, n] of byMonth) if (n > 1) issue(`Cycle month "${m}" exists ${n} times.`);
  for (const c of cycles) if (monthIndex(c.monthYear) === null) issue(`Cycle ${c.id} has an unparseable monthYear "${c.monthYear}".`);

  // ---------- per cycle ----------
  type CycleStats = { overall: number | null; overallFromPillars: number | null; pillars: Record<string, number | null>; n: number };
  const stats = new Map<string, CycleStats>();

  log(`## Cycles (survey months)`);
  log();
  log(`| Month | Status | Created | Submissions from → to | Total | Flagged | Counted | Pillar-based | Legacy | Avg stabilityScore | Avg of personal means | ${PILLAR_KEYS.join(" | ")} |`);
  log(`|---|---|---|---|---|---|---|---|---|---|---|${PILLAR_KEYS.map(() => "---").join("|")}|`);

  for (const c of cycles) {
    const all = submissions.filter((s) => s.cycleId === c.id);
    const counted = all.filter((s) => !s.isFlagged);
    let pillarBased = 0, legacy = 0;
    const perPillar: Record<string, number[]> = Object.fromEntries(PILLAR_KEYS.map((k) => [k, []]));
    const personalMeans: number[] = [];
    let outOfRange = 0, missingKeys = 0, scoreMismatch = 0, unknownKeys = 0;

    for (const s of all) {
      const pr = s.pillarResponses as Record<string, unknown> | null;
      if (!pr || typeof pr !== "object" || Object.keys(pr).length === 0) {
        legacy++;
        if (s.stabilityScore != null && (s.stabilityScore < 1 || s.stabilityScore > 10)) outOfRange++;
        continue;
      }
      pillarBased++;
      const vals: number[] = [];
      for (const k of PILLAR_KEYS) {
        const v = pr[k];
        if (typeof v !== "number") { missingKeys++; continue; }
        if (!Number.isInteger(v) || v < 1 || v > 10) outOfRange++;
        vals.push(v);
        if (!s.isFlagged) perPillar[k].push(v);
      }
      for (const k of Object.keys(pr)) if (!(PILLAR_KEYS as readonly string[]).includes(k)) unknownKeys++;
      if (vals.length === PILLAR_KEYS.length) {
        const avg = vals.reduce((a, b) => a + b, 0) / vals.length;
        const expected = Math.min(10, Math.max(1, Math.round(avg)));
        if (s.stabilityScore !== expected) scoreMismatch++;
        if (!s.isFlagged) personalMeans.push(avg);
      }
    }

    const label = cleanPeriod(c.monthYear);
    if (outOfRange) issue(`${label}: ${outOfRange} answer(s) outside the 1–10 range.`);
    if (missingKeys) issue(`${label}: ${missingKeys} missing pillar answer(s) in pillar-based submissions.`);
    if (unknownKeys) issue(`${label}: ${unknownKeys} answer(s) under pillar keys that are not in PILLARS.`);
    if (scoreMismatch) issue(`${label}: ${scoreMismatch} submission(s) whose stabilityScore ≠ round(avg).`);
    if (legacy && pillarBased) issue(`${label}: mixes ${legacy} legacy (direct 1–10 score) and ${pillarBased} pillar-based submissions in one average.`);

    const pillars = Object.fromEntries(PILLAR_KEYS.map((k) => [k, mean(perPillar[k])]));
    const overall = mean(counted.map((s) => s.stabilityScore).filter((n): n is number => n != null));
    const overallFromPillars = mean(personalMeans);
    stats.set(c.id, { overall, overallFromPillars, pillars, n: counted.length });

    const times = all.map((x) => +x.createdAt).sort((a, b) => a - b);
    const day = (t?: number) => (t ? new Date(t).toISOString().slice(0, 10) : "—");
    log(`| ${label} | ${c.status} | ${day(+c.createdAt)} | ${day(times[0])} → ${day(times.at(-1))} | ${all.length} | ${all.length - counted.length} | ${counted.length} | ${pillarBased} | ${legacy} | ${r2(overall)} | ${r2(overallFromPillars)} | ${PILLAR_KEYS.map((k) => r2(pillars[k])).join(" | ")} |`);
  }
  log();
  log(`"Avg stabilityScore" is what admin analytics shows (mean of rounded integers). "Avg of personal means" is the unrounded overall the editions publish. All values are on the 1–10 scale.`);
  log();

  /** Unflagged pillar stats over a set of cycles, optionally only rows created before `before`. */
  function pooled(cycleIds: string[], before?: Date) {
    const rows = submissions.filter((x) => cycleIds.includes(x.cycleId) && !x.isFlagged && (!before || x.createdAt < before));
    const per: Record<string, number[]> = Object.fromEntries(PILLAR_KEYS.map((k) => [k, []]));
    const personal: number[] = [];
    for (const x of rows) {
      const pr = (x.pillarResponses ?? {}) as Record<string, unknown>;
      const vals = PILLAR_KEYS.map((k) => pr[k]).filter((v): v is number => typeof v === "number");
      for (const k of PILLAR_KEYS) if (typeof pr[k] === "number") per[k].push(pr[k] as number);
      if (vals.length === PILLAR_KEYS.length) personal.push(vals.reduce((a, b) => a + b, 0) / vals.length);
    }
    return {
      n: rows.length,
      overall: mean(rows.map((x) => x.stabilityScore).filter((v): v is number => v != null)),
      overallFromPillars: mean(personal),
      pillars: Object.fromEntries(PILLAR_KEYS.map((k) => [k, mean(per[k])])) as Record<string, number | null>,
    };
  }

  // ---------- snapshots ----------
  const cycleById = new Map(cycles.map((c) => [c.id, c]));

  const published = snapshots.filter((s) => s.publishedAt).sort((a, b) => +a.publishedAt! - +b.publishedAt!);
  const periodCount = new Map<string, number>();
  for (const s of published) periodCount.set(cleanPeriod(s.period), (periodCount.get(cleanPeriod(s.period)) ?? 0) + 1);
  for (const [p, n] of periodCount) if (n > 1) issue(`Published period "${p}" appears ${n} times.`);

  log(`## Published editions (by publication date)`);
  log();
  const classifications: { id: string; period: string; scale: string }[] = [];

  published.forEach((s, i) => {
    const period = cleanPeriod(s.period);
    const linked = s.cycleId ? cycleById.get(s.cycleId) : undefined;
    // Surveys run in the first days of the month AFTER the month they describe, and the
    // edition is published around the 10th. So the source is the cycle with answers whose
    // collection started most recently before publication (within 45 days).
    const pub = +s.publishedAt!;
    const timed = cycles
      .filter((c) => (stats.get(c.id)?.n ?? 0) > 0)
      .map((c) => ({ c, first: Math.min(...submissions.filter((x) => x.cycleId === c.id).map((x) => +x.createdAt)) }))
      .filter((x) => x.first < pub && pub - x.first < 45 * 864e5)
      .sort((a, b) => b.first - a.first)[0]?.c;
    const sourceIds = linked ? [linked.id] : timed ? [timed.id] : [];
    const matched = linked ?? timed;
    if (matched && monthIndex(matched.monthYear) !== monthIndex(period)) {
      issue(`${period}: its survey answers are in the cycle labelled "${matched.monthYear}" (label differs from the edition month).`);
    }
    const st = sourceIds.length ? pooled(sourceIds) : undefined;
    const atPublish = sourceIds.length ? pooled(sourceIds, s.publishedAt!) : undefined;
    const pillars = snapshotPillars(s.pillarScores);

    log(`### Edition ${i + 1}: ${period}  (\`${s.id}\`)`);
    log(`- Published ${s.publishedAt!.toISOString().slice(0, 10)} · locked: ${s.isLocked ? "yes" : "**no**"} · cycle link: ${linked ? cleanPeriod(linked.monthYear) : s.cycleId ? "**dangling id**" : "**none**"}${!linked && matched ? ` (matched by timing to cycle "${matched.monthYear}", answers ${new Date(Math.min(...submissions.filter((x) => x.cycleId === matched.id).map((x) => +x.createdAt))).toISOString().slice(0, 10)} → ${new Date(Math.max(...submissions.filter((x) => x.cycleId === matched.id).map((x) => +x.createdAt))).toISOString().slice(0, 10)})` : ""}`);
    if (atPublish && st && atPublish.n !== st.n) log(`- Note: ${st.n - atPublish.n} of ${st.n} counted submissions arrived **after** this edition was published.`);
    if (!s.isLocked) issue(`${period}: published but not locked (numbers can still be edited).`);
    if (!s.cycleId) issue(`${period}: snapshot has no cycleId link.`);
    if (!st || st.n === 0) issue(`${period}: no survey cycle found for this edition — published scores cannot be checked against survey data.`);
    if (period !== s.period.trim()) log(`- Stored period text: "${s.period}"`);

    log(`- Overall published: **${r2(s.overallScore)}** · survey (avg stabilityScore): ${r2(st?.overall)} · survey (unrounded): ${r2(st?.overallFromPillars)} · counted submissions: ${st?.n ?? "—"}${atPublish && st && atPublish.n !== st.n ? ` (at publish time: ${atPublish.n}, overall ${r2(atPublish.overallFromPillars)})` : ""}`);
    if (st?.overallFromPillars != null && Math.abs(s.overallScore - st.overallFromPillars) > 0.05) {
      issue(`${period}: overall published ${r2(s.overallScore)} vs survey ${r2(st.overallFromPillars)} (diff ${r2(s.overallScore - st.overallFromPillars)}).`);
    }

    const sentiment = s.publicSentimentSummary as { averagePublicScore?: unknown } | null;
    if (sentiment && sentiment.averagePublicScore != null && sentiment.averagePublicScore !== "") {
      log(`- Sentiment "average public score" (typed in): ${sentiment.averagePublicScore}`);
    }

    // Pillars
    const scores = pillars.map((p) => p.score).filter((n): n is number => n != null);
    let pillarMatches = 0, compared = 0;
    log(`- Pillars:`);
    for (const p of pillars) {
      const key = PILLAR_KEYS.find((k) => k.toLowerCase() === p.title.toLowerCase());
      if (!key) issue(`${period}: pillar title "${p.title}" is not one of PILLARS (breaks deltas/CSV).`);
      const survey = key && st ? st.pillars[key] : null;
      if (p.score != null && survey != null) {
        compared++;
        if (Math.abs(p.score - survey) <= 0.05) pillarMatches++;
      }
      const surveyAtPub = key && atPublish ? atPublish.pillars[key] : null;
      log(`  - ${p.title || "(untitled)"}: published ${r2(p.score)} · survey mean ${r2(survey)}${surveyAtPub != null && atPublish!.n !== st!.n ? ` (at publish: ${r2(surveyAtPub)})` : ""}`);
    }
    if (pillars.length !== PILLAR_KEYS.length) issue(`${period}: has ${pillars.length} pillar rows (expected ${PILLAR_KEYS.length}).`);
    if (scores.some((n) => n < 0 || n > 10)) issue(`${period}: a pillar score is outside 0–10.`);

    let scale: string;
    if (compared && pillarMatches === compared) scale = "matches survey";
    else if (compared) scale = "does NOT match survey";
    else scale = scores.length ? "unverified: no survey data" : "no pillar scores";
    if (scale.includes("does NOT match")) issue(`${period}: published pillar scores don't match the recomputed survey means.`);
    log(`- Pillar check: **${scale}**`);
    classifications.push({ id: s.id, period, scale });
    log();
  });

  // Order + delta check
  const byMonthOrder = [...published].sort((a, b) => (monthIndex(a.period) ?? 0) - (monthIndex(b.period) ?? 0));
  const orderMismatch = published.some((s, i) => s.id !== byMonthOrder[i].id);
  if (orderMismatch) {
    issue(`Publication order differs from survey-month order → edition numbers, "previous" and deltas on the site are wrong for some editions.`);
    log(`## Order mismatch`);
    log(`- By publishedAt: ${published.map((s) => cleanPeriod(s.period)).join(" → ")}`);
    log(`- By survey month: ${byMonthOrder.map((s) => cleanPeriod(s.period)).join(" → ")}`);
    log();
  }
  for (let i = 1; i < published.length; i++) {
    const cur = published[i], prev = published[i - 1];
    // The site's change label (lib/reportFormat change()) must equal the difference of the two displayed scores.
    const c = change(cur.overallScore, prev.overallScore)!;
    const label = c.direction === "down" ? -c.value : c.value;
    const shown = (Math.round(cur.overallScore * 10) - Math.round(prev.overallScore * 10)) / 10;
    if (Math.abs(label - shown) > 1e-9) {
      issue(`${cleanPeriod(cur.period)}: change label (${label.toFixed(1)}) doesn't equal the difference of the displayed scores (${shown.toFixed(1)}).`);
    }
  }

  // Drafts
  const drafts = snapshots.filter((s) => !s.publishedAt);
  if (drafts.length) {
    log(`## Unpublished drafts`);
    for (const d of drafts) log(`- ${d.period} (\`${d.id}\`), overall ${r2(d.overallScore)}, cycle link: ${d.cycleId ? "yes" : "none"}`);
    log();
  }

  log(`## Pillar check per edition`);
  for (const c of classifications) log(`- \`${c.id}\` ${c.period}: ${c.scale}`);
  log();

  const report = [`## Findings (${issues.length})`, ...(issues.length ? issues.map((x) => `- ${x}`) : ["- None."]), "", ...out].join("\n");
  const outArg = process.argv.find((a) => a.startsWith("--out="));
  if (outArg) writeFileSync(outArg.slice(6), report, "utf8");
  console.log(report);
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
