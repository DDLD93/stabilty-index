import { sanitizeHtmlStrict } from "@/lib/sanitize";
import { cn } from "@/lib/utils";

/** A list holding a single item reads better as a paragraph. */
function unwrapSingleItemLists(html: string): string {
  return html.replace(/<(ul|ol)>\s*<li>([\s\S]*?)<\/li>\s*<\/\1>/g, (match, _tag: string, inner: string) => {
    if (/<li>/.test(inner)) return match;
    const text = inner.replace(/<\/?p>/g, " ").replace(/\s+/g, " ").trim();
    return text ? `<p>${text}</p>` : "";
  });
}

/** Admin-written rich text, sanitised on the server with a strict allowlist. */
export function RichText({ html, className }: { html: string; className?: string }) {
  if (!html.trim()) return null;
  return (
    <div
      className={cn("richtext min-w-0 break-words", className)}
      dangerouslySetInnerHTML={{ __html: unwrapSingleItemLists(sanitizeHtmlStrict(html)) }}
    />
  );
}
