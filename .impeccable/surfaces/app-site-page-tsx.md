---
version: 1
slug: "app-site-page-tsx"
primary_target: "app/(site)/page.tsx"
related_targets: ["app/(site)/about/page.tsx","app/(site)/honors/page.tsx","app/(site)/honors/[category]/page.tsx","app/(site)/honors/winners/page.tsx"]
---

# Surface brief: public home, about, Honors landing

## Scope and mode
- **Mode:** Persuade.
- **Surfaces:**
  - home (`app/(site)/page.tsx`);
  - about;
  - the Honors landing, category and winners pages.
- **Audience:** everyday Nigerians on phones first; journalists, policy and donor readers, and analysts second.
- **The visitor's job:** see this month's reading and trust it, then take the open check-in, read the report or take part in Honors.
- **Proof on hand:** the real published editions (9 so far) and the method. Nothing else is confirmed (see PRODUCT.md).

## Direction contract
THESIS: The number comes first, with its method right beside it. This is a public-interest data publication at the level of Stears, Our World in Data and the Mo Ibrahim Index (IIAG), where every figure is dated, sourced and readable on a phone. It refuses the dashboard of glassy tiles, the pulsing "live" intelligence hero and the gradient-and-blur civic template.

OWN-WORLD:
- **Ground:** white #FFFFFF; alternate sections on #F4F6F4.
- **Colour:** ink #14211B; NSI green #1D6B45 for actions, links and the single data series; gold #D9A42B only for Honors and highlights, never as text on white.
- **Lines and shapes:** 1px rules (#DDE3DF) only for tables, fields and chart frames; 6px radius on controls; square documentary photos with visible credits.
- **Type:** Source Serif 4 headlines, Source Sans 3 text and figures (tabular).

STORY: The visitor reads this month's score and its change from last month, then sees the trend across editions and the five pillars. They understand it comes from public check-ins plus editorial review, published on the 11th. Then they act: take the check-in while it is open, read the full report, or nominate or vote in Honors when that is live.

FIRST VIEWPORT:
- **Desktop 1440:**
  - **Nav (80px):** logo and wordmark on the left; Reports, Spotlights, Honors 2026, Methodology, About; one green action on the right that depends on the phase.
  - **Left column:** a serif h1 of about 64px, a 22px lede, then the score lockup "4.1 out of 10, September 2026", with the change and the publish date. Below it, the primary and secondary actions.
  - **Right column:** a framed line chart of all editions with labelled axes and the latest point annotated.
  - **Bottom edge:** the five pillar scores begin.
- **Mobile 390:** the h1 at about 34px, the score lockup, the actions, then the chart at full width; the pillars become a list.
- **Signature interaction:** tapping or focusing a month on the chart switches the score lockup and pillar scores to that edition and links to its report.

FORM: The category standard, chosen by the user on the decision page. Quality bar: Stears, Our World in Data, IIAG. Position: canon (the standing exit), not on the ranked list. seed: ed3344a1f89325af

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

## Notes
- **Motion:** feedback on controls takes 180ms with an ease-out; the chart line draws once when it first comes into view; sections reveal once through the view timeline. All of it is disabled under reduced motion, and content is visible by default.
- **Pillar scale:** pillar scores in the data look like they're on a 1–5 scale while the overall score is out of 10. Confirm this before labelling the axes.
- **Honors pages** use the same world. Gold appears as highlight rules and medal marks only. Nominees appear as text or monograms, never with found photos.
