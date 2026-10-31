import type { ContactSubjectKey } from "@/lib/contactSubjects";
import { CONTACT_SUBJECT_LABELS } from "@/lib/contactSubjects";
import { escapeHtml, isMailConfigured, sendMail } from "@/lib/mailer";

export type ContactEmailPayload = {
  name: string;
  email: string;
  subjectKey: ContactSubjectKey;
  subjectOther?: string;
  message: string;
};

function contactInbox(): string | null {
  return process.env.CONTACT_MAIL_TO?.trim() || null;
}

function resolvedSubjectLine(payload: ContactEmailPayload): string {
  const base = CONTACT_SUBJECT_LABELS[payload.subjectKey];
  if (payload.subjectKey === "other" && payload.subjectOther?.trim()) {
    return `${base}: ${payload.subjectOther.trim()}`;
  }
  return base;
}

export function isContactMailConfigured(): boolean {
  return isMailConfigured() && contactInbox() !== null;
}

export async function sendContactEmail(payload: ContactEmailPayload): Promise<void> {
  const to = contactInbox();
  if (!to || !isMailConfigured()) {
    throw new Error("SMTP is not configured.");
  }

  const subjectLine = resolvedSubjectLine(payload);
  const text = [
    `Name: ${payload.name}`,
    `Email: ${payload.email}`,
    `Topic: ${subjectLine}`,
    "",
    "Message:",
    payload.message,
  ].join("\n");

  const html = [
    `<p><strong>Name:</strong> ${escapeHtml(payload.name)}</p>`,
    `<p><strong>Email:</strong> ${escapeHtml(payload.email)}</p>`,
    `<p><strong>Topic:</strong> ${escapeHtml(subjectLine)}</p>`,
    "<p><strong>Message:</strong></p>",
    `<pre style="white-space:pre-wrap;font-family:inherit">${escapeHtml(payload.message)}</pre>`,
  ].join("");

  await sendMail({
    to,
    replyTo: payload.email,
    subject: `[NSI Contact] ${subjectLine}`,
    text,
    html,
  });
}
