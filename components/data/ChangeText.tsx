import { ArrowDownRight, ArrowRight, ArrowUpRight } from "lucide-react";
import type { Change } from "@/lib/reportFormat";
import { cn } from "@/lib/utils";

/** A change versus the previous edition: arrow icon plus words, never colour alone. */
export function ChangeText({ change, since, compact, className }: { change: Change | null; since?: string; compact?: boolean; className?: string }) {
  if (!change) return <span className={cn("text-ink-3", className)}>—</span>;
  const Icon = change.direction === "up" ? ArrowUpRight : change.direction === "down" ? ArrowDownRight : ArrowRight;
  const words =
    change.direction === "same"
      ? "no change"
      : `${change.direction} ${change.value.toFixed(1)}`;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 tabular-nums",
        change.direction === "down" ? "text-negative" : change.direction === "up" ? "text-brand" : "text-ink-2",
        className,
      )}
    >
      <Icon aria-hidden className="size-4 shrink-0" strokeWidth={2} />
      <span>
        {words}
        {since && !compact ? <span className="text-ink-2"> from {since}</span> : null}
      </span>
    </span>
  );
}
