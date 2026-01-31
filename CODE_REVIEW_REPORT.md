# Code Review Report: Landing Data Connection & Survey Wizard

**Scope:** `lib/systemState.ts`, `app/page.tsx`, `components/public/SurveyWizard.tsx`, `app/survey/page.tsx`  
**Date:** 2026-01-31

---

## Executive Summary

The implementation correctly wires admin snapshot data to the public landing page, adds cycle status and survey CTA, uses placeholders for missing data, and introduces a wizard-style public survey. One bug was found and fixed (undefined `cycleClosed` on the landing page). The rest of the code is consistent, defensive, and aligned with the existing codebase.

---

## 1. Correctness & Logic

### Fixed bug: undefined `cycleClosed` (app/page.tsx)

- **Issue:** The hero badge used `cycleClosed` to show "Collection closed for {monthYear}…" but the variable had been removed; `cycleClosed` was undefined, so that branch never ran.
- **Fix:** Replaced `cycleClosed` with `cycle?.status === "CLOSED"` so the CLOSED state displays correctly.

### lib/systemState.ts

- **Good:** `sourcesReferences` is added to the snapshot select and to all three return branches (OPEN, CLOSED, PUBLICATION_LIVE). No logic change; existing phase/cycle behavior is unchanged.
- **Good:** Public type and internal variable types stay in sync for the new field.

### app/page.tsx

- **Good:** Helpers (`hasStateSpotlight`, `hasInstitutionSpotlight`, `hasSentiment`, `hasSources`) and safe accessors (`safeArray`, `safeString`, `safeNumber`) prevent bad JSON from breaking the page.
- **Good:** Pillar list fallback when `pillarScores` is missing or malformed (PILLAR_NAMES with score 0) is correct.
- **Good:** External links for sources use `target="_blank"` and `rel="noopener noreferrer"`.

### SurveyWizard.tsx

- **Good:** Validation matches the API: `hasAllPillarAnswers` uses `PILLAR_KEYS` and 1–5 range; submit payload shape matches `POST /api/public/submit` (pillarResponses + optional spotlight fields).
- **Good:** Survey is only shown when `cycle.surveyQuestions` exists and has length 5; otherwise "Survey is not available" is shown.
- **Good:** Optional step 6 sends `spotlightComment` trimmed and limited to 600 chars on the client; API also enforces this.
- **Minor:** Step label shows "Step X of 6" for pillar steps; step 6 is labeled "Optional". Consider "Step X of 5" for pillars and "Step 6 (optional)" if you want to emphasize that the last step is optional—current behavior is still correct.

---

## 2. Security

- **Good:** No sensitive data is exposed on the public state or landing; snapshot content is intended for public display.
- **Good:** Survey submit uses `POST /api/public/submit`; validation (pillar keys, 1–5, enum for state/tags) is done on the server; client only shapes the request.
- **Good:** Source URLs are rendered as links; if you later allow user-supplied URLs in admin, ensure snapshot/API only stores allowlisted or sanitized URLs to avoid XSS. Current flow (admin-only snapshot content) is fine.
- **Good:** Comment is length-capped (600) on client and server; submit API already has PII heuristics for legacy payload—pillar payload does not include free-form PII beyond optional comment, which is acceptable.

---

## 3. Performance

- **Good:** Landing is server-rendered; a single `getPublicSystemState()` call loads cycle + latest snapshot (two DB reads). No N+1.
- **Good:** Survey wizard fetches `/api/public/cycle` once on mount; no polling or extra requests until submit.
- **Good:** Landing uses Next.js `Image` for hero and pillar images; `priority` on hero is appropriate.
- **Minor:** Survey wizard could cache the cycle in sessionStorage so a refresh doesn’t re-fetch if the cycle is unchanged—optional improvement only.

---

## 4. Accessibility

- **Good:** Section headings use semantic levels (h1 hero, h2 section titles, h3 for spotlight/sentiment/sources).
- **Good:** Links and buttons use clear, descriptive text ("Take the survey", "Full spotlight", "Back to home").
- **Improvement:** Survey scale (1–5) is implemented as divs/buttons. For screen readers, either use a `<fieldset>`/`<legend>` with radio inputs, or add `role="group"`, `aria-label` for the scale and `aria-pressed` (or similar) on the selected value so state is announced.
- **Improvement:** Loading and error states in the wizard are text-only. Consider `aria-live="polite"` (or `status`) so updates are announced.
- **Good:** External links use `rel="noopener noreferrer"`. Adding `rel="noopener noreferrer"` to links that already have it is redundant but harmless.

---

## 5. Maintainability & Code Quality

### Duplication

- **Minor:** Landing defines local types (`StateSpotlight`, `InstitutionSpotlight`, `PublicSentiment`, `SourceRef`) and helpers that overlap with admin snapshot types in `components/admin/snapshot/types.ts`. Consider moving shared types and safe-access helpers to e.g. `lib/snapshot.ts` or `lib/publicSnapshot.ts` so landing and admin stay in sync and the source of truth is single.

### Consistency

- **Good:** Styling uses existing design tokens (`nsi-*` CSS variables, `nsi-band`, rounded corners, borders). Survey wizard and survey page match the rest of the app.
- **Good:** Constants (`PILLAR_KEYS`, `NIGERIAN_STATES`, `SPOTLIGHT_TAGS`) are imported from `lib/constants.ts` in the wizard; no magic strings.

### Survey wizard structure

- **Good:** Linear step flow (0 → 1…5 → 6) is easy to follow. State is flat and sufficient for the flow.
- **Minor:** Step content is in one large component. Extracting steps into small components (e.g. `IntroStep`, `PillarStep`, `OptionalStep`) would improve readability and make it easier to add or reorder steps later.

---

## 6. Edge Cases & Robustness

### app/page.tsx

- **Good:** When `latest` is null (no published snapshot), period/score/narrative and links fall back to defaults or "/reports"; no crash.
- **Good:** Empty or malformed JSON for spotlights/sentiment/sources results in placeholders instead of errors.
- **Good:** `sources` is filtered to entries with both `label` and `url` (via `safeString`), so bad rows don’t render.

### SurveyWizard.tsx

- **Good:** Effect cleanup sets `cancelled = true` so state is not updated after unmount.
- **Good:** Submit error is shown inline and submit button is re-enabled so the user can retry.
- **Minor:** If the cycle is closed between load and submit, the API returns 409; the wizard shows "Submission failed." (or the API error message). Consider detecting 409 and showing a specific message like "Survey has closed. Your responses were not recorded." for a better UX.

### API contract

- **Good:** Wizard sends `pillarResponses` keyed by pillar key (e.g. "Security", "FX & Economy"); these match `PILLAR_KEYS`. The submit API’s `pillarResponsesSchema` requires exactly those keys with 1–5 values, so the contract is consistent.

---

## 7. Testing Suggestions

- **Landing:** With no snapshot, with snapshot but empty spotlights/sentiment/sources, and with full snapshot; cycle OPEN / CLOSED / ARCHIVED / null; assert placeholders and CTAs.
- **Survey:** GET `/api/public/cycle` returns null or invalid questions → "Survey is not available"; valid cycle → all steps and submit; submit with invalid payload → server error surfaced; submit after cycle closed → 409 and clear message if implemented.
- **E2E:** From landing, "Take the survey" when OPEN → survey page; complete wizard and submit → thank-you and links.

---

## 8. Summary of Recommendations

| Priority | Item | Action |
|----------|------|--------|
| **Done** | `cycleClosed` undefined on landing | Fixed: use `cycle?.status === "CLOSED"`. |
| **Low** | Shared snapshot types/helpers | Extract to `lib/snapshot.ts` (or similar) and reuse on landing and admin. |
| **Low** | Survey scale a11y | Add fieldset/radios or ARIA group + pressed/selected state. |
| **Low** | Survey 409 handling | Show dedicated "Survey has closed" message on 409. |
| **Optional** | Survey step components | Split wizard steps into small components for clarity. |
| **Optional** | Step label copy | Use "Step X of 5" + "Optional" for step 6 if desired. |

---

**Conclusion:** The feature set is implemented correctly and fits the existing architecture. The only defect found was the use of the removed `cycleClosed` variable; replacing it with `cycle?.status === "CLOSED"` resolves it. The rest of the review notes are minor improvements and optional refinements.
