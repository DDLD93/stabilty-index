"use client";

import { sanitizeHtml } from "@/lib/sanitize";

type SafeHtmlProps = {
  html: string;
  className?: string;
  as?: "div" | "span";
};

/**
 * Renders sanitized HTML safely. Use for spotlight key points and other rich text from the CMS.
 */
export function SafeHtml({ html, className, as: Tag = "div" }: SafeHtmlProps) {
  if (!html || !html.trim()) return null;
  const clean = sanitizeHtml(html);
  return (
    <Tag
      className={className}
      dangerouslySetInnerHTML={{ __html: clean }}
    />
  );
}
