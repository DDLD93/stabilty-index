import { cn } from "@/lib/utils";

/**
 * A single horizontal bar on a fixed scale, with an optional tick for the
 * previous edition. The value itself is printed by the caller, so the bar is
 * decorative for assistive tech unless `label` is given.
 */
export function ScoreBar({
  value,
  previous,
  min = 0,
  max,
  label,
  className,
}: {
  value: number | null;
  previous?: number | null;
  min?: number;
  max: number;
  label?: string;
  className?: string;
}) {
  const pct = (v: number) => Math.max(0, Math.min(100, ((v - min) / (max - min)) * 100));
  return (
    <div
      className={cn("relative h-2.5 w-full rounded-r-[4px] bg-data-track", className)}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      {value !== null ? (
        <div className="absolute inset-y-0 left-0 rounded-r-[4px] bg-data" style={{ width: `${pct(value)}%` }} />
      ) : null}
      {previous !== null && previous !== undefined ? (
        <div
          className="absolute -top-1 -bottom-1 w-0.5 -translate-x-1/2 bg-ink"
          style={{ left: `${pct(previous)}%` }}
          title={`Previous edition: ${previous.toFixed(1)}`}
        />
      ) : null}
    </div>
  );
}
