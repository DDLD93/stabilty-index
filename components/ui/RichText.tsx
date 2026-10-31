import { sanitizeHtmlStrict } from "@/lib/sanitize";
import { cn } from "@/lib/utils";

/** Admin-written rich text, sanitised on the server with a strict allowlist. */
export function RichText({ html, className }: { html: string; className?: string }) {
  if (!html.trim()) return null;
  return <div className={cn("richtext", className)} dangerouslySetInnerHTML={{ __html: sanitizeHtmlStrict(html) }} />;
}
