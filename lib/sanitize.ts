import DOMPurify from "dompurify";

const ALLOWED_TAGS = [
  "p", "br", "ul", "ol", "li", "strong", "em", "b", "i", "u", "a", "span",
];
const ALLOWED_ATTR = ["href", "target", "rel"];

/**
 * Sanitize HTML for safe display (e.g. spotlight key points).
 * Allows a minimal set of tags and attributes.
 */
export function sanitizeHtml(html: string): string {
  if (typeof window === "undefined") {
    return html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "");
  }
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    ADD_ATTR: ["target", "rel"],
  });
}
