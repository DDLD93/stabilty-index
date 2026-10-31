---
version: 1
slug: "app-site-survey-page-tsx"
primary_target: "app/(site)/survey/page.tsx"
related_targets: ["components/public/SurveyWizard.tsx","app/(site)/honors/nominate/page.tsx","app/(site)/honors/vote/page.tsx","app/(site)/contact/page.tsx","app/(site)/subscribe/page.tsx","app/auth/sign-in/page.tsx"]
---

# Surface brief: survey, Honors nominate and vote, contact, subscribe, sign-in

## Scope and mode
- **Mode:** Operate.
- **Surfaces:**
  - survey (`app/(site)/survey/page.tsx`, `SurveyWizard`);
  - Honors nominate;
  - Honors vote and confirm;
  - contact;
  - subscribe;
  - sign-in.
- **The task:** finish a short form correctly on a phone, often on mobile data. The survey has five 1–5 questions plus an optional state, tags and comment; nomination has five steps; voting is one choice per category plus email confirmation.
- **States that matter:**
  - loading;
  - closed or not open yet;
  - already submitted;
  - validation errors;
  - network failure;
  - success, with a reference;
  - SMTP unavailable (contact and vote).

## Direction contract
THESIS: Forms that feel like a well-run government-service form done right (GOV.UK and Stears register): one question at a time, big honest targets, plain labels, and errors that say what to do. It refuses chip clouds, glass panels and decorative pillar art.

OWN-WORLD: The same world:
- **Ground:** white.
- **Colour:** ink #14211B; green #1D6B45 for the primary action and the selected state; gold only on Honors confirmation.
- **Fields:** 1px #DDE3DF borders with 6px radius; at least 48px tall.
- **Choices:** real radio and checkbox groups at least 56px tall for the 1–5 scale.
- **Type:** Source Sans 3 throughout, Source Serif 4 for the step question.

STORY: The visitor always knows where they are ("Security, 1 of 5"), answers with large targets, reviews, submits, and gets a clear confirmation and what happens next.

FIRST VIEWPORT:
- **Mobile 390 (the primary viewport):**
  - Progress text and a bar at the top.
  - The question in serif at about 26px.
  - A one-line explanation of what the 1 and 5 ends mean.
  - A full-width 1–5 radiogroup (five 56px targets).
  - The Back and Continue actions pinned at the bottom of the form.
- **Desktop:** the same form in a 640px column, with the pillar's documentary photo beside it at 1024px and wider.
- **Signature interaction:** arrow keys move through the scale; choosing a value advances only when Continue is pressed. There is no auto-advance.

FORM: The category standard, chosen by the user; quality bar Stears, Our World in Data, IIAG. seed: ed3344a1f89325af

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

## Constraint
`SurveyWizard`'s state, effects, fetches, referral handling, device hash and submit payload stay byte-identical. Only the markup and styling change.
