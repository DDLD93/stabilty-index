# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users
- **Everyday Nigerians on phones.** They take the monthly check-in, glance at the score and share it (WhatsApp, X). Assume mid-range Android on mobile data (inferred from the audience, not measured).
- **Journalists and media.** They quote the monthly score and pillar movements, so they need dates, edition, method and figures they can cite.
- **Policy makers, government and donors.** They read state and institution spotlights and trends, and judge whether the method is credible.
- **Investors and business analysts.** They track the FX & Economy and Investor Confidence pillars month to month.

## Product Purpose
The Nigeria Stability Index (NSI) is an independent civic measurement platform. It tracks how Nigeria is holding together through monthly snapshots across five pillars:
- Security
- FX & Economy
- Investor Confidence
- Governance
- Social Stability

Each snapshot combines anonymous public check-ins with editorial review of verified sources. It produces an overall score (out of 10), pillar scores, short narratives, a State Spotlight, an Institution Spotlight and a Street Pulse. Success means people trust the number enough to cite it, and keep coming back to contribute and read.

**NSI Honors** (new, annual; first edition 2026) recognises institutions, states/LGAs, organisations/NGOs and individuals that delivered public impact. It runs in four stages:
1. The public nominates with evidence.
2. NSI shortlists finalists.
3. Verified members of the public vote, and the vote decides the winner. Admins only void fraudulent votes or settle ties, and record the reason.
4. Winners are published.

There are eight 2026 categories:
- Public Institution of 2026
- Education Impact of 2026
- Healthcare Impact of 2026
- Infrastructure Impact of 2026
- Community Development of 2026
- Digital Innovation of 2026
- Agricultural Impact of 2026
- Security Impact of 2026

## Positioning
- **Independent and non-political:** no campaigning, no advocacy.
- **Public check-ins plus human editorial review,** not automated scoring alone.
- **A fixed monthly rhythm:** the snapshot is published on the 11th of each month, then locked so it can't change.
- **Spotlights are evidence-based and are not endorsements.** Honors is the one place NSI celebrates, and it does so through public nomination and verified public vote. It is not NSI's own endorsement.

## Operating Context
- **Monthly cycle:**
  1. An admin opens a cycle with five pillar questions on a 1–5 scale.
  2. The public answers once per device. They can optionally add their state, topic tags and a comment.
  3. Field agents share referral links (`?ref=` six-digit codes).
  4. The cycle closes.
  5. Editors build, publish and lock the snapshot.
- **Site phases:** collection open, processing (closed), publication live.
- **Live data:** the production database holds about 2,400 submissions and 9 published snapshots (January–September 2026; scores between 1.0 and 5.2).
- **Organisation:** a project of the 24 Angels Initiative. Contact: info@nigeriastabilityIndex.ng. Domain: nigeriastabilityindex.ng.

## Capabilities and Constraints
- **Stack:** Next.js 16 App Router, React 19, Tailwind CSS 4, Prisma 7 / PostgreSQL, next-auth (admin only), nodemailer (SMTP optional; the contact form returns 503 without it).
- **Must keep working:**
  - the survey wizard logic (referral lookup, one submission per device per cycle, five pillar steps plus the optional spotlight step);
  - the contact API;
  - the admin snapshot builder;
  - PDF and CSV exports.
- **Admin** keeps its current look in this round.
- **Not built yet:** the newsletter/subscribe form only pretends to work, and there is no subscriber store.
- **Undecided:** Honors dates (nominations, voting, ceremony) and venue. Show "To be announced" until an admin sets them.

## Brand Commitments
- **Name:** Nigeria Stability Index (NSI).
- **Logo:** the NSI logo (gold Nigeria map, green/gold NSI lettering, swoosh). Transparent versions are in `public/brand/`.
- **Colours:** the green and gold identity is kept.
- **Voice:** plain, serious Nigerian English, like a respected newspaper or statistics bureau. Direct and factual, no hype, warm but not chatty.
- **Organisation name:** always "24 Angels Initiative".
- **Visual standard (chosen by the user, 31 October 2026):** the category standard for a public-interest data publication, done at full craft. The quality bar is Stears, Our World in Data and the Mo Ibrahim Index of African Governance (IIAG). Conventional, credible patterns are a deliberate choice, not a fallback.

## Evidence on Hand
- **Available:**
  - real published snapshots and scores from the database;
  - the method facts above;
  - the logo files.
- **Not confirmed, so never invent or show them:**
  - social media accounts beyond those already in the live footer (X @Nigeria_NSI, Instagram nigeriastabilityindex, TikTok @nigeria_nsi, kept as they were); the URLs in `lib/metadata.ts` are placeholders;
  - named team or editorial board;
  - partners and sponsors;
  - press coverage;
  - testimonials;
  - respondent quotes;
  - honorees and finalists (none exist yet).
- **Photography:** open-licence photographs of Nigeria with visible credits. A found photo is never presented as a respondent, nominee or honoree.

## Product Principles
1. **The number is the product.** Every page helps someone read, cite or contribute to the monthly score honestly.
2. **Show the method next to the result.** Credibility comes from dates, editions, sources and limits being visible, not from adjectives.
3. **Never fabricate proof.** No invented statistics, quotes, partners, honorees or "live" signals.
4. **Phones first, on real networks.** A visitor on a mid-range Android on mobile data gets the whole experience.
5. **Neutral on politics, generous to people.** Report without taking sides; celebrate impact only through the transparent Honors process.

## Accessibility & Inclusion
- Target WCAG 2.2 AA.
- Touch targets of at least 44px.
- Every flow (survey, nomination, vote) must work with the keyboard alone and with a screen reader.
- Respect reduced motion.
- Names may include Yoruba, Igbo and Hausa characters (ẹ ọ ṣ ɓ ɗ ƙ), so fonts must render them.
