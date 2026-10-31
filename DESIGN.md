---
name: Nigeria Stability Index
description: An independent monthly reading of how Nigeria is holding together, set as a public-interest data publication.
colors:
  ground: "#ffffff"
  surface: "#f4f6f4"
  ink: "#14211b"
  ink-2: "#45534c"
  ink-3: "#5c6a63"
  line: "#dde3df"
  line-strong: "#b9c4be"
  brand: "#1d6b45"
  brand-strong: "#154f33"
  brand-tint: "#e8f2ec"
  data: "#157a4c"
  data-track: "#e3efe8"
  gold: "#d9a42b"
  gold-ink: "#835e0e"
  gold-tint: "#fbf3df"
  negative: "#a33a1f"
  negative-tint: "#fbebe6"
typography:
  display:
    fontFamily: "Source Serif 4 Variable, ui-serif, Georgia, serif"
    fontSize: "clamp(2.125rem, 1.35rem + 3.1vw, 4rem)"
    fontWeight: 600
    lineHeight: 1.06
    letterSpacing: "-0.015em"
  h2:
    fontFamily: "Source Serif 4 Variable, ui-serif, Georgia, serif"
    fontSize: "clamp(1.625rem, 1.3rem + 1.35vw, 2.5rem)"
    fontWeight: 600
    lineHeight: 1.12
  h3:
    fontFamily: "Source Serif 4 Variable, ui-serif, Georgia, serif"
    fontSize: "clamp(1.25rem, 1.12rem + 0.55vw, 1.5rem)"
    fontWeight: 600
    lineHeight: 1.25
  lead:
    fontFamily: "Source Sans 3 Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.125rem, 1.04rem + 0.35vw, 1.375rem)"
    fontWeight: 400
    lineHeight: 1.5
  body:
    fontFamily: "Source Sans 3 Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.65
  small:
    fontFamily: "Source Sans 3 Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 400
    lineHeight: 1.55
  meta:
    fontFamily: "Source Sans 3 Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.45
    fontFeature: "\"tnum\""
  score-figure:
    fontFamily: "Source Sans 3 Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "5.25rem"
    fontWeight: 600
    lineHeight: 1
    letterSpacing: "-0.03em"
    fontFeature: "\"tnum\""
rounded:
  control: "6px"
  bar-end: "4px"
spacing:
  gutter: "clamp(1rem, 0.4rem + 2.4vw, 2.5rem)"
  section: "clamp(3.5rem, 1.8rem + 6.5vw, 7.5rem)"
  container-page: "76rem"
  container-reading: "42rem"
components:
  button-primary:
    backgroundColor: "{colors.brand}"
    textColor: "{colors.ground}"
    typography: "{typography.body}"
    rounded: "{rounded.control}"
    padding: "0 20px"
    height: "48px"
  button-primary-hover:
    backgroundColor: "{colors.brand-strong}"
  button-secondary:
    backgroundColor: "{colors.ground}"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    padding: "0 20px"
    height: "48px"
  button-secondary-hover:
    backgroundColor: "{colors.surface}"
  button-quiet:
    textColor: "{colors.brand}"
    padding: "0"
    height: "48px"
  button-gold:
    backgroundColor: "{colors.gold}"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    padding: "0 20px"
    height: "48px"
  button-gold-hover:
    backgroundColor: "#c8931f"
  button-inverse:
    backgroundColor: "{colors.ground}"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    padding: "0 20px"
    height: "48px"
  button-inverse-hover:
    backgroundColor: "{colors.brand-tint}"
  button-sm:
    typography: "{typography.small}"
    padding: "0 16px"
    height: "44px"
  input-field:
    backgroundColor: "{colors.ground}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.control}"
    padding: "10px 14px"
    height: "48px"
  score-bar:
    backgroundColor: "{colors.data-track}"
    rounded: "{rounded.bar-end}"
    height: "10px"
  score-bar-fill:
    backgroundColor: "{colors.data}"
    rounded: "{rounded.bar-end}"
  site-header:
    backgroundColor: "{colors.ground}"
    height: "76px"
  nav-link:
    textColor: "{colors.ink-2}"
    typography: "{typography.small}"
    padding: "0 12px"
    height: "44px"
  form-message-error:
    backgroundColor: "{colors.negative-tint}"
    textColor: "{colors.negative}"
    padding: "12px 16px"
  honors-outcome-panel:
    backgroundColor: "{colors.gold-tint}"
    textColor: "{colors.ink}"
    padding: "32px"
---

# Design System: Nigeria Stability Index

This file governs the public site and the NSI Honors pages: `app/(site)/**`, `app/auth/**` and the components they use. The admin area has its own look. `app/admin/layout.tsx` wraps it in an `admin-scope` class, rebinds the font roles to Geist and Playfair Display, and it still reads the legacy `--nsi-*` variables and `admin-*` utility classes in `app/globals.css`. Those belong to the admin area only. Public code never uses them, and they are not part of this system.

## Overview

**Creative North Star: "The Statistics Bureau's Front Page"**

The site reads like a respected public-interest data publication, in the register of Stears, Our World in Data and the Mo Ibrahim Index (IIAG). The user chose that standard deliberately. The number is the hero. Each edition's score sits in a large sans figure with its scale ("out of 10"), its edition and its publish date right beside it. Every chart sits on a fixed, labelled axis. Pages are white with pale green-grey bands. Ink is a deep green-black, and NSI green is the colour of action, links and the single data series. Gold belongs to Honors. Pages use conventional, credible patterns (breadcrumbs, real tables, framed charts, plain forms) because that is what makes the figure citable.

Density follows the reader. Persuade pages (home, about, Honors landing) use generous section rhythm and credited documentary photographs. Read pages (reports, archive, spotlights) narrow to a reading column with a contents rail. Operate pages (survey, nomination, vote) ask one question at a time with large, honest targets. Depth comes from tone and 1px rules, not from shadows.

**Key Characteristics:**
- White ground with #f4f6f4 alternate bands; a full-bleed ink band only behind a photograph.
- Source Serif 4 for headings, Source Sans 3 for everything else, including the score figures.
- One green data series on a fixed scale: 0–10 overall, 1–5 for pillars.
- 1px rules for tables, fields, chart frames and section edges.
- A 6px radius on controls only; photographs and panels stay square.
- Every photograph carries a visible credit line.
- Motion is restrained: 150–200ms feedback, one scroll reveal, one chart draw, and none of it under reduced motion.

## Colors

The palette is mostly white and ink, with one working green and gold kept back for Honors.

### Primary
- **NSI Civic Green** (brand): primary buttons, links, quiet text buttons, the active-nav underline, the focus outline (3px, 2px offset), the selected state of choice controls (with Pale Ledger Green behind it), the survey progress fill and upward change. It also sets the body `accent-color` and `caret-color`.
- **Deep Civic Green** (brand-strong): the hover state of primary buttons only.
- **Pale Ledger Green** (brand-tint): the background for selected choices, success messages and inverse-button hover.

### Secondary
- **Chart Green** (data): the one data series. It fills the score bars and draws the trend line, its points and the area under the line (at 10% opacity). It was checked as the single-series chart colour. It is a separate token from brand so that the chart and the action colour can be tuned independently.
- **Bar Track** (data-track): the unfilled part of score bars and progress bars.

### Tertiary
- **Honors Gold** (gold): Honors only. Used for the gold rule above Honors headings, the gold button, the 4px top edge of Honors outcome panels and the borders of selected Honors choices. It may be used as text only on the dark ink photo scrim.
- **Honors Gold Ink** (gold-ink): gold set as text on light grounds, such as winner names and panel labels.
- **Honors Gold Wash** (gold-tint): the background of Honors outcome panels, the current Honors timeline step and selected Honors choices.

### Neutral
- **Ground White** (ground): the page, headers, cards and fields.
- **Survey Paper** (surface): alternate sections, the footer, empty states, info messages and disabled fields.
- **Bureau Ink** (ink): headings, body emphasis, the previous-edition tick and the chart value tag. It also fills the full-bleed photo band behind its scrim.
- **Second Ink** (ink-2): ledes, body copy in sections and secondary navigation.
- **Third Ink** (ink-3): metadata, breadcrumbs, axis labels, captions, "(optional)" and "To be announced". On ground and surface it stays above 4.5:1.
- **Hairline** (line): 1px table rules, section and header edges, chart gridlines and chart frames.
- **Firm Line** (line-strong): field and secondary-button borders, and the chart baseline.
- **Alert Red** (negative) / **Alert Wash** (negative-tint): field errors, downward change and error messages.

### Named Rules
**The Gold Is Earned Rule.** Gold appears only on Honors surfaces and on the home page's Honors band. It never appears as an action colour elsewhere, and never as #d9a42b text on white.

**The One Series Rule.** A chart carries one data colour (data) on a fixed axis. Change is shown with an arrow and words. Colour is never the only signal.

## Typography

**Display Font:** Source Serif 4 Variable, optical-size axis (fallback ui-serif, Georgia)
**Body Font:** Source Sans 3 Variable, with italics (fallback ui-sans-serif, system-ui)

Both faces are self-hosted through `@fontsource-variable`, with no font CDN at runtime. Their Latin Extended and Vietnamese subsets render Yoruba, Igbo and Hausa letters (ẹ ọ ṣ ɓ ɗ ƙ). Any replacement face must cover those letters too.

**Character:** The pairing reads like a serious newspaper. The serif carries headings with editorial authority, and the sans carries text, figures and interface with plain clarity.

### Hierarchy
- **Display** (600, clamp 34–64px, 1.06, -0.015em): the one h1 per page, in PageHeader or the home and Honors heroes.
- **H2** (600, clamp 26–40px, 1.12): section headings.
- **H3** (600, clamp 20–24px, 1.25): sub-sections, timeline steps and empty-state titles.
- **Lead** (400, clamp 18–22px, 1.5): one-paragraph ledes under headings, "out of 10" beside the score, and pillar scores in tables.
- **Body** (400, 17px, 1.65): running text and form labels (600). Reading pages hold a 42rem column, about 65–72 characters.
- **Small** (400, 15px, 1.55): hints, notes, footer links and navigation.
- **Meta** (400, 14px, 1.45): edition lines ("September 2026 · Edition 9 · Published 11 October 2026"), axis labels, captions and credits.
- **Score Figure** (600 sans, 68px on mobile to 84px, line-height 1, -0.03em, tabular): the headline score in the edition explorer. Report pages use a 56px version.

All h1–h3 elements are serif 600 with `text-wrap: balance`. Paragraphs, list items and captions use `pretty`. Survey step questions use the serif at about 22–28px.

### Named Rules
**The Figures Are Sans Rule.** Scores, changes, axis ticks and table numbers are set in Source Sans 3 with tabular numerals, and always carry their scale (/10 overall, /5 pillars).

**The No Eyebrow Rule.** A heading is not preceded by a small uppercase kicker. The breadcrumb, the meta line or the Honors gold rule does that job. The public site sets no uppercase tracked labels.

## Layout

Content sits in a page container (76rem) or a reading container (42rem), with `box-content` so the responsive gutter (16–40px) sits outside the measure. Sections share one vertical rhythm (56–120px). Inner pages open with PageHeader: an optional breadcrumb, then one h1, a lede up to about 42rem and optional actions, with an optional right column (26rem) on large screens. A 1px bottom rule closes the header. Two-column compositions are image beside text or score beside chart. They use `lg` grids with 64px gaps and collapse to one column below 1024px.

The header is sticky: 64px tall, 76px from `lg`. It holds the logo lockup, the five primary links from `lg`, and one action that changes with the site phase ("Take the September survey" or "Read the latest report"). Tables stack into blocks below 768px. The survey and Honors forms sit in a column of about 640px (40rem), with a documentary photo beside them at 1024px and wider. `scroll-padding-top` is 5.5rem so anchors clear the header.

## Elevation & Depth

The system is flat. Depth comes from tone (ground, surface, ink) and from 1px rules. The single shadow belongs to the mobile menu dialog, which overlays the page. Photographs get depth from an ink scrim when text sits on them.

### Shadow Vocabulary
- **Overlay** (`box-shadow: 0 18px 40px -16px rgb(20 33 27 / 0.32), 0 2px 6px rgb(20 33 27 / 0.08)`): the `<dialog>` mobile menu only, over a 40% ink backdrop.

### Named Rules
**The Ruled, Not Lifted Rule.** Cards, panels, tables and charts are separated with 1px hairlines or a surface band. They never get a shadow. A 1px rule is this world's own device; the house-style ban on borders does not apply here.

## Shapes

Corners are mostly square. Only interactive controls (buttons, fields, the menu toggle, the chart value tag) get a gentle 6px radius. Score bars round only their right end (4px), so they read as measured from a baseline. Chart points are the only circles. Photographs are square-cornered at fixed aspect ratios (3/2, 4/3, 16/9, 4/5, 1/1, 21/9) and crop with `object-cover`. Panels, empty states, chart frames and timeline cells are square, with a 1px border or a surface fill. Outcome panels (survey thank-you, Honors confirmation, the winner block) carry a 4px top edge: brand on surface for the survey, gold on gold-tint for Honors.

## Components

### Buttons
Plain, sure and large enough to hit.
- **Shape:** gently rounded (6px), semibold, minimum 48px tall (md, 20px side padding). Sizes run 44px (sm, small text) to 56px (lg, lead text). No size goes under 44px.
- **Primary:** brand fill with white text. Hover (fine pointers only) moves to brand-strong.
- **Secondary:** ground fill, 1px line-strong border, ink text. Hover darkens the border to ink and moves the fill to surface.
- **Quiet:** brand text with a 1px underline at 0.22em offset and no side padding. Hover thickens the underline to 2px. Inline "Read the report →" links follow the same pattern.
- **Gold:** gold fill with ink text, used for Honors actions. Hover goes to the gold-strong token (#c8931f).
- **Inverse:** ground fill with ink text, on the ink photo band. Hover moves to brand-tint.
- **States:** colour transitions run 150ms on ease-out-strong, and pressing scales to 0.98. Focus shows a 3px brand outline at 2px offset. Disabled buttons drop to 55% opacity. `LinkButton` shares the variants for navigation.

### Inputs / Fields
- **Style:** ground fill, 1px line-strong border, 6px radius, at least 48px tall, 17px text, ink-3 placeholder.
- **Focus:** the border turns brand, with a 3px brand ring at 20%.
- **Error / Disabled:** `aria-invalid` turns the border negative with a matching ring. Disabled fields use a surface fill and ink-3 text.
- **Field pattern:** a semibold label ("(optional)" in ink-3), then the hint in small ink-2, then the error in small semibold negative, then the control, then an optional tabular character counter. Hint, error and counter ids are wired into `aria-describedby`. FormMessage gives outcome lines: error on negative-tint (`role=alert`), success on brand-tint and info on surface (`role=status`).
- **Choices:** real radio and checkbox inputs inside bordered tiles (line-strong border, ink on hover). A selected tile gets a brand border on brand-tint, or a gold border on gold-tint in Honors. The 1–5 survey scale uses targets at least 56px tall.

### Navigation
- **Header:** sticky, ground fill, 1px bottom rule. Links are small semibold ink-2 at least 44px tall. Hover and the current page get ink text and a 2px brand underline that scales in from the left over 200ms.
- **Breadcrumb:** meta ink-3, underlined links and chevron separators. The last crumb is ink-2 with `aria-current="page"`. This replaces any eyebrow.
- **Mobile menu:** a native `<dialog>` that slides 24px in from the right over 200ms. Primary links are serif 22px rows at least 56px tall with dividers. Secondary links follow, and the phase action is pinned at the bottom with a safe-area inset. The browser supplies Escape, focus containment and the inert background.
- **Footer:** surface band with the lockup, one line about the organisation, the contact email, three link groups (sans small semibold headings, links at least 44px tall) and social links.
- **Report contents rail:** an "On this page" list that is sticky on desktop and marks `aria-current="location"`. On mobile it becomes a jump menu.

### Figure / PhotoCredit
Documentary photographs only. Every one carries a caption and a "Photo: creator, licence" line in meta ink-3, with links (white/80 on dark bands). Photos on the ink band sit under an ink scrim: 60% on mobile, a left-to-right gradient on large screens.

### Data: ScoreBar, PillarTable, TrendChart, EditionExplorer, ChangeText
- **ScoreBar:** a 10px data-track bar filled with data on a fixed scale. A 2px ink tick, taller than the bar, marks the previous edition.
- **PillarTable:** a real `<table>` with 1px row rules. Columns are the pillar (with an "Editors' note" in small ink-2), a 1–5 axis header over the bar, the score "of 5" in lead semibold tabular, and the change. Rows stack into a grid on mobile.
- **TrendChart:** an SVG line on a fixed 0–10 axis with ticks every 2, line gridlines and a line-strong baseline. A 2px data line sits over a 10% area. Points have a 2px white ring and the focused point grows. An ink crosshair and an ink value tag mark the focused month. Each month is a full-height radio button in a `radiogroup`, controlled with the arrow keys and Home/End.
- **EditionExplorer:** the score lockup (meta line, then the score figure with "out of 10", the change, and a method line linking to Methodology) beside a framed chart (1px line border, 16–24px padding). Choosing a month updates the lockup and the pillars, and announces the change politely.
- **ChangeText:** an arrow icon plus words ("up 0.4 from August", "no change"), tabular. Brand for up, negative for down, ink-2 for no change. An em dash when there is no comparison.

### Honors marks
- **GoldRule:** a 4px × 56–64px gold bar above Honors headings.
- **Timeline:** four cells separated by 1px gaps on a line background. The current step is gold-tint, a done step shows a brand check, and an unset date reads "To be announced" in ink-3.
- **Nominees and winners** are shown as text, never with found photographs.

## Do's and Don'ts

### Do:
- **Do** label every score with its scale: "4.1 out of 10" overall, "of 5" for pillars. Keep axes fixed at 0–10 and 1–5.
- **Do** put the edition, period and publish date in a meta line next to any figure, with the method one link away.
- **Do** credit every photograph with creator and licence through Figure or PhotoCredit.
- **Do** keep touch targets at 44px or more, fields at 48px or more and survey scale options at 56px or more.
- **Do** show change with an arrow and words together.
- **Do** use 1px hairlines for tables, fields, chart frames and section edges. They are this world's native rule.
- **Do** keep feedback motion at 150–200ms on ease-out-strong (cubic-bezier(0.23, 1, 0.32, 1)), and gate hover styles to fine pointers.
- **Do** write in plain, serious Nigerian English, and show "To be announced" for any Honors date not yet set.

### Don't:
- **Don't** use gold outside Honors, or set #d9a42b as text on white.
- **Don't** add shadows to cards, panels or charts. The overlay shadow is only for the dialog.
- **Don't** put an uppercase kicker or eyebrow above a heading.
- **Don't** present a found photograph as a respondent, nominee or honoree, or invent quotes, partners, statistics or "live" signals.
- **Don't** use video, glass or blur panels, gradient-and-glow heroes, or gauges that decorate rather than measure.
- **Don't** add motion beyond the one view-timeline section reveal and the one chart clip reveal on Read and Operate pages. Never animate content into visibility: it must be visible by default, and all motion stops under `prefers-reduced-motion`.
- **Don't** round photographs or panels. The 6px radius is for controls.
- **Don't** use the admin `--nsi-*` variables or `admin-*` classes on public pages.
