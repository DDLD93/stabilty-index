/**
 * Normalize key points for public display: use keyPointsHtml if present,
 * otherwise build from legacy bullets array.
 */
export function getKeyPointsHtml(spot: {
  keyPointsHtml?: string;
  bullets?: string[] | unknown;
}): string {
  if (typeof spot.keyPointsHtml === "string" && spot.keyPointsHtml.trim()) {
    return spot.keyPointsHtml;
  }
  if (!Array.isArray(spot.bullets)) return "";
  const items = spot.bullets.filter((b): b is string => typeof b === "string" && b.trim().length > 0);
  if (items.length === 0) return "";
  return "<ul>" + items.map((b) => "<li>" + escapeHtml(b) + "</li>").join("") + "</ul>";
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
