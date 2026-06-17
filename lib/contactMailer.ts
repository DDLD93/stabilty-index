import nodemailer from "nodemailer";
import type { ContactSubjectKey } from "@/lib/contactSubjects";
import { CONTACT_SUBJECT_LABELS } from "@/lib/contactSubjects";

export type ContactEmailPayload = {
  name: string;
  email: string;
  subjectKey: ContactSubjectKey;
  subjectOther?: string;
  message: string;
};

function escapeHtml(text: string) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function getSmtpConfig():
  | {
      host: string;
      port: number;
      secure: boolean;
      auth: { user: string; pass: string };
      from: string;
      to: string;
    }
  | { error: "missing_env" } {
  const host = process.env.SMTP_HOST?.trim();
  const user = process.env.SMTP_USER?.trim();
  const pass = process.env.SMTP_PASSWORD?.trim();
  const from = process.env.CONTACT_MAIL_FROM?.trim();
  const to = process.env.CONTACT_MAIL_TO?.trim();

  if (!host || !user || !pass || !from || !to) {
    return { error: "missing_env" };
  }

  const portRaw = process.env.SMTP_PORT?.trim();
  const port = portRaw ? Number.parseInt(portRaw, 10) : 587;
  if (!Number.isFinite(port) || port < 1 || port > 65535) {
    return { error: "missing_env" };
  }

  const secureEnv = process.env.SMTP_SECURE?.trim().toLowerCase();
  const secure = secureEnv === "true" || secureEnv === "1" || port === 465;

  return { host, port, secure, auth: { user, pass }, from, to };
}

function resolvedSubjectLine(payload: ContactEmailPayload): string {
  const base = CONTACT_SUBJECT_LABELS[payload.subjectKey];
  if (payload.subjectKey === "other" && payload.subjectOther?.trim()) {
    return `${base}: ${payload.subjectOther.trim()}`;
  }
  return base;
}

export function isContactMailConfigured(): boolean {
  return !("error" in getSmtpConfig());
}

export async function sendContactEmail(payload: ContactEmailPayload): Promise<void> {
  const cfg = getSmtpConfig();
  if ("error" in cfg) {
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

  const transporter = nodemailer.createTransport({
    host: cfg.host,
    port: cfg.port,
    secure: cfg.secure,
    auth: cfg.auth,
  });

  await transporter.sendMail({
    from: cfg.from,
    to: cfg.to,
    replyTo: payload.email,
    subject: `[NSI Contact] ${subjectLine}`,
    text,
    html,
  });
}
