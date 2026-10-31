import { renderEmail, sendMail, siteOrigin } from "@/lib/mailer";

export async function sendNominationReceipt(to: string, details: { reference: string; nominee: string; category: string; editionTitle: string }) {
  const { text, html } = renderEmail({
    heading: `We received your nomination for ${details.nominee}`,
    paragraphs: [
      `Thank you for nominating ${details.nominee} for ${details.category} in ${details.editionTitle}.`,
      `Your reference is ${details.reference}. Keep it if you need to contact us about this nomination.`,
      "The team reviews every nomination and may contact you if we need more information. Finalists will be announced before the public vote opens.",
    ],
    button: { label: "See how NSI Honors works", url: `${siteOrigin()}/honors` },
  });
  await sendMail({ to, subject: `Nomination received: ${details.nominee} (${details.reference})`, text, html });
}

export async function sendVoteConfirmation(to: string, details: { token: string; editionTitle: string; choices: string[]; hours: number }) {
  const { text, html } = renderEmail({
    heading: "Confirm your NSI Honors vote",
    paragraphs: [
      `You asked to vote in ${details.editionTitle}. Your choices: ${details.choices.join("; ")}.`,
      `Your vote counts only after you confirm it. The link works once and expires in ${details.hours} hours.`,
      "If you didn’t ask to vote, ignore this email and nothing will be recorded.",
    ],
    button: { label: "Confirm my vote", url: `${siteOrigin()}/honors/vote/confirm?token=${encodeURIComponent(details.token)}` },
  });
  await sendMail({ to, subject: "Confirm your NSI Honors vote", text, html });
}

export async function sendSubscribeConfirmation(to: string, token: string) {
  const { text, html } = renderEmail({
    heading: "Confirm your email updates",
    paragraphs: [
      "You asked to get Nigeria Stability Index updates: new monthly reports and survey reminders.",
      "Confirm your address to start receiving them. If this wasn’t you, ignore this email.",
    ],
    button: { label: "Confirm my email", url: `${siteOrigin()}/subscribe/confirm?token=${encodeURIComponent(token)}` },
  });
  await sendMail({ to, subject: "Confirm your Nigeria Stability Index updates", text, html });
}
