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

const BLOCKED_WITH_CONTENT = /<(script|style|iframe|object|embed|noscript|template|svg|math)\b[\s\S]*?<\/\1\s*>/gi;

/**
 * Server-safe allowlist sanitizer (no DOM needed). Keeps only ALLOWED_TAGS,
 * drops every attribute except a vetted http(s)/mailto href on links.
 */
export function sanitizeHtmlStrict(html: string): string {
  return html
    .replace(BLOCKED_WITH_CONTENT, "")
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<\/?([a-zA-Z][a-zA-Z0-9]*)\b([^>]*)>/g, (match, rawTag: string, attrs: string) => {
      const tag = rawTag.toLowerCase();
      if (!ALLOWED_TAGS.includes(tag)) return "";
      if (match.startsWith("</")) return `</${tag}>`;
      if (tag === "br") return "<br>";
      if (tag === "a") {
        const m = /\bhref\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/i.exec(attrs);
        const url = (m?.[1] ?? m?.[2] ?? m?.[3] ?? "").trim();
        if (/^(https?:\/\/|mailto:)/i.test(url)) {
          return `<a href="${url.replace(/"/g, "&quot;")}" rel="noopener noreferrer nofollow" target="_blank">`;
        }
        return "<a>";
      }
      return `<${tag}>`;
    });
}
