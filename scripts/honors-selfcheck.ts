/**
 * Quick checks for the NSI Honors rules that don't need a database.
 * Run: npx tsx scripts/honors-selfcheck.ts
 */
import assert from "node:assert/strict";

import { emailHash, hashToken, newReference, newToken, normalizeEmail } from "../lib/honors/crypto";
import { ALLOWED_TRANSITIONS, getTimeline, isNominationsOpen, isVotingOpen } from "../lib/honors/phase";
import { nominationSchema } from "../lib/honors/schemas";
import { change, cleanPeriod, formatStateName, publicationDateFor } from "../lib/reportFormat";

// The hash secret is read lazily, so setting it here (before any hashing) is enough.
process.env.HONORS_HASH_SECRET ??= "selfcheck-secret";

const base = { nominationsOpenAt: null, nominationsCloseAt: null, votingOpenAt: null, votingCloseAt: null, ceremonyAt: null };
let passed = 0;
const check = (name: string, fn: () => void) => {
  fn();
  passed++;
  console.log("ok", name);
};

check("emails normalise to one identity", () => {
  assert.equal(normalizeEmail("  Voter.One+again@GoogleMail.com "), "voterone@gmail.com");
  assert.equal(normalizeEmail("a.b+x@example.com"), "a.b@example.com");
  assert.equal(emailHash("Voter.One@gmail.com"), emailHash("voterone+tag@googlemail.com"));
  assert.notEqual(emailHash("a@example.com"), emailHash("b@example.com"));
});

check("tokens are random and hash deterministically", () => {
  const t = newToken();
  assert.ok(t.length >= 40);
  assert.notEqual(t, newToken());
  assert.equal(hashToken(t), hashToken(t));
  assert.match(newReference(2026), /^H26-[23456789A-HJKMNP-Z]{6}$/);
});

check("status alone opens and closes stages", () => {
  assert.equal(isNominationsOpen({ ...base, status: "NOMINATIONS_OPEN" }), true);
  assert.equal(isNominationsOpen({ ...base, status: "SHORTLISTING" }), false);
  assert.equal(isVotingOpen({ ...base, status: "VOTING_OPEN" }), true);
  assert.equal(isVotingOpen({ ...base, status: "VOTING_CLOSED" }), false);
});

check("dates narrow an open stage", () => {
  const now = new Date("2026-11-10T12:00:00Z");
  assert.equal(isNominationsOpen({ ...base, status: "NOMINATIONS_OPEN", nominationsOpenAt: "2026-11-11T00:00:00+01:00" }, now), false);
  assert.equal(isNominationsOpen({ ...base, status: "NOMINATIONS_OPEN", nominationsCloseAt: "2026-11-10T00:00:00+01:00" }, now), false);
  assert.equal(isVotingOpen({ ...base, status: "VOTING_OPEN", votingOpenAt: "2026-11-01T00:00:00+01:00", votingCloseAt: "2026-12-01T00:00:00+01:00" }, now), true);
});

check("transitions only move one stage at a time", () => {
  assert.deepEqual(ALLOWED_TRANSITIONS.DRAFT, ["NOMINATIONS_OPEN"]);
  assert.ok(!ALLOWED_TRANSITIONS.DRAFT.includes("VOTING_OPEN"));
  assert.deepEqual(ALLOWED_TRANSITIONS.ARCHIVED, []);
});

check("timeline says To be announced until dates are set", () => {
  const steps = getTimeline({ ...base, status: "NOMINATIONS_OPEN" });
  assert.equal(steps[0].state, "current");
  assert.equal(steps[0].when, "Closing date to be announced");
  assert.equal(steps[0].status, "Open now");
  assert.equal(steps[2].when, "To be announced");
  assert.equal(steps[3].state, "upcoming");
  const done = getTimeline({ ...base, status: "VOTING_OPEN" });
  assert.equal(done[0].when, "Completed");
});

check("nomination schema enforces the essentials", () => {
  const good = {
    categoryId: "c1",
    nomineeType: "STATE_OR_LGA",
    nomineeName: "Ìbàdàn North LGA",
    nomineeState: "Oyo",
    reason: "x".repeat(80),
    evidenceUrls: ["https://example.org/a"],
    nominatorEmail: "a@example.com",
    nominatorRelation: "INDEPENDENT",
    consent: true,
  };
  assert.equal(nominationSchema.safeParse(good).success, true);
  assert.equal(nominationSchema.safeParse({ ...good, nomineeState: null }).success, false);
  assert.equal(nominationSchema.safeParse({ ...good, reason: "too short" }).success, false);
  assert.equal(nominationSchema.safeParse({ ...good, evidenceUrls: ["javascript:alert(1)"] }).success, false);
  assert.equal(nominationSchema.safeParse({ ...good, consent: false }).success, false);
});

check("report formatting", () => {
  assert.equal(publicationDateFor("October 2026"), "11 November 2026");
  assert.equal(publicationDateFor("December 2026"), "11 January 2027");
  assert.equal(cleanPeriod("January 2026 final"), "January 2026");
  assert.equal(formatStateName("FCT"), "Federal Capital Territory");
  assert.equal(formatStateName("Kaduna"), "Kaduna State");
  assert.equal(formatStateName("Lagos State"), "Lagos State");
  assert.deepEqual(change(4.11, 4.3), { value: 0.2, direction: "down" });
});

console.log(`\n${passed} checks passed`);
