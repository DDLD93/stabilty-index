---
version: 1
slug: "app-site-reports-page-tsx"
primary_target: "app/(site)/reports/page.tsx"
related_targets: ["app/(site)/reports/[id]/page.tsx","app/(site)/methodology/page.tsx","app/(site)/spotlights/page.tsx","app/(site)/privacy/page.tsx","app/(site)/credits/page.tsx"]
---

# Surface brief: reports, report detail, methodology, spotlights, privacy, credits

## Scope and mode
- **Mode:** Read.
- **Surfaces:**
  - reports archive (`app/(site)/reports/page.tsx`);
  - report detail;
  - methodology;
  - spotlights;
  - privacy;
  - credits.
- **The reader's question:**
  - What did NSI find this month, and how does it compare?
  - How is the score made?
  - What is said about my state?
- **Source material:** published snapshots from the database (narrative, pillar scores, state, institution and street-pulse spotlights, sentiment, sources) and the method text.

## Direction contract
THESIS: A report reads like an Our World in Data entry or a Stears explainer: findings first, the chart beside the claim, and sources and method one tap away. It refuses the poster-in-a-card treatment and gauges that decorate rather than measure.

OWN-WORLD: The same world as the home page:
- **Ground:** white, with #F4F6F4 bands.
- **Colour:** ink #14211B; green #1D6B45 for links and the single data series; gold #D9A42B only for highlights.
- **Lines and shapes:** 1px #DDE3DF table rules; 6px control radius.
- **Type:** Source Serif 4 headings, Source Sans 3 text with tabular figures.
- **Text measure:** body text set to 65–72 characters per line.

STORY: The reader sees the edition, the date and the headline finding, then the pillar table with the change from last month, then the spotlights with their own anchors, the public sentiment, and the sources. They can move to the previous or next edition, share it or print it.

FIRST VIEWPORT:
- **Report detail, desktop:**
  - Breadcrumb, then "September 2026 · Edition 9 · Published 11 October 2026".
  - A serif h1 stating the reading, then the narrative lede.
  - On the right: the score, the change and the share/print actions.
  - Below: the pillar table begins.
- **Mobile:** a single column, with share and print in a row under the lede.
- **Archive:** a trend chart of all editions above a list of linked rows (edition, period, score, change).
- **Signature interaction:** a contents rail on the report that follows the reader's position (sticky on desktop, a jump menu on mobile).

FORM: The category standard, chosen by the user; quality bar Our World in Data, Stears, IIAG. seed: ed3344a1f89325af

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
