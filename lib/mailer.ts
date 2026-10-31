import nodemailer from "nodemailer";

type SmtpConfig = {
  host: string;
  port: number;
  secure: boolean;
  auth?: { user: string; pass: string };
  from: string;
};

/**
 * SMTP settings from the environment. SMTP_HOST and a sender (MAIL_FROM, or the
 * older CONTACT_MAIL_FROM) are required; SMTP_USER/SMTP_PASSWORD are optional so a
 * local catcher such as Mailpit works without credentials.
 */
export function getSmtpConfig(): SmtpConfig | null {
  const host = process.env.SMTP_HOST?.trim();
  const from = (process.env.MAIL_FROM ?? process.env.CONTACT_MAIL_FROM)?.trim();
  if (!host || !from) return null;

  const portRaw = process.env.SMTP_PORT?.trim();
  const port = portRaw ? Number.parseInt(portRaw, 10) : 587;
  if (!Number.isFinite(port) || port < 1 || port > 65535) return null;

  const secureEnv = process.env.SMTP_SECURE?.trim().toLowerCase();
  const secure = secureEnv === "true" || secureEnv === "1" || port === 465;

  const user = process.env.SMTP_USER?.trim();
  const pass = process.env.SMTP_PASSWORD?.trim();
  return { host, port, secure, auth: user && pass ? { user, pass } : undefined, from };
}

/** Development only: MAIL_TRANSPORT=log prints emails to the server log instead of sending them. */
function logTransport(): boolean {
  return process.env.MAIL_TRANSPORT === "log" && process.env.NODE_ENV !== "production";
}

export function isMailConfigured(): boolean {
  return logTransport() || getSmtpConfig() !== null;
}

export async function sendMail(message: {
  to: string;
  subject: string;
  text: string;
  html?: string;
  replyTo?: string;
}): Promise<void> {
  if (logTransport()) {
    console.info("[mail:log]", JSON.stringify({ to: message.to, subject: message.subject, text: message.text }));
    return;
  }
  const cfg = getSmtpConfig();
  if (!cfg) throw new Error("SMTP is not configured.");
  const transporter = nodemailer.createTransport({
    host: cfg.host,
    port: cfg.port,
    secure: cfg.secure,
    ...(cfg.auth ? { auth: cfg.auth } : {}),
  });
  await transporter.sendMail({ from: cfg.from, ...message });
}

export function escapeHtml(text: string) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * A plain, readable transactional email: heading, paragraphs and an optional
 * button link, with a text version alongside.
 */
export function renderEmail({
  heading,
  paragraphs,
  button,
  footer,
}: {
  heading: string;
  paragraphs: string[];
  button?: { label: string; url: string };
  footer?: string;
}): { text: string; html: string } {
  const footerText = footer ?? "Nigeria Stability Index · nigeriastabilityindex.ng";
  const text = [heading, "", ...paragraphs.flatMap((p) => [p, ""]), ...(button ? [`${button.label}: ${button.url}`, ""] : []), footerText].join("\n");
  const html = `<!doctype html><html><body style="margin:0;background:#f4f6f4;padding:24px 12px;font-family:Arial,Helvetica,sans-serif;color:#14211b">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-top:4px solid #1d6b45">
<tr><td style="padding:28px 28px 8px"><p style="margin:0 0 16px;font-size:14px;color:#5c6a63">Nigeria Stability Index</p>
<h1 style="margin:0 0 16px;font-size:22px;line-height:1.3;font-family:Georgia,serif">${escapeHtml(heading)}</h1>
${paragraphs.map((p) => `<p style="margin:0 0 14px;font-size:16px;line-height:1.55">${escapeHtml(p)}</p>`).join("")}
${button ? `<p style="margin:22px 0"><a href="${escapeHtml(button.url)}" style="display:inline-block;background:#1d6b45;color:#ffffff;text-decoration:none;font-weight:bold;padding:13px 20px;border-radius:6px">${escapeHtml(button.label)}</a></p><p style="margin:0 0 14px;font-size:13px;color:#5c6a63;word-break:break-all">Or paste this link into your browser: ${escapeHtml(button.url)}</p>` : ""}
</td></tr><tr><td style="padding:16px 28px 24px;font-size:13px;color:#5c6a63;border-top:1px solid #dde3df">${escapeHtml(footerText)}</td></tr>
</table></td></tr></table></body></html>`;
  return { text, html };
}

export function siteOrigin(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXTAUTH_URL || "https://www.nigeriastabilityindex.ng").replace(/\/$/, "");
}
