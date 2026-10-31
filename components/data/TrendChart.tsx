"use client";

import { useRef, useState } from "react";
import { cn } from "@/lib/utils";

export type TrendPoint = { id: string; label: string; shortLabel: string; value: number };

const TICKS = [0, 2, 4, 6, 8, 10];

/**
 * The overall index across editions on a fixed 0–10 axis. Each month is a
 * full-height column that can be hovered (preview) or chosen (select); the
 * columns form a radio group, so arrow keys move between months.
 */
export function TrendChart({
  points,
  selectedId,
  onSelect,
  max = 10,
  className,
  title,
  fill = false,
}: {
  points: TrendPoint[];
  selectedId: string;
  onSelect: (id: string) => void;
  max?: number;
  className?: string;
  title: string;
  /** Grow to fill the parent's height on wide screens. */
  fill?: boolean;
}) {
  const [hoverId, setHoverId] = useState<string | null>(null);
  const groupRef = useRef<HTMLDivElement>(null);
  const n = points.length;
  const x = (i: number) => ((i + 0.5) / n) * 100;
  const y = (v: number) => 100 - (Math.max(0, Math.min(max, v)) / max) * 100;
  const line = points.map((p, i) => `${x(i)},${y(p.value)}`).join(" ");
  const area = n > 0 ? `${x(0)},100 ${line} ${x(n - 1)},100` : "";
  const focusId = hoverId ?? selectedId;
  const focusIndex = Math.max(0, points.findIndex((p) => p.id === focusId));
  const focus = points[focusIndex];
  const showEvery = n > 12 ? 2 : 1;

  function onKeyDown(e: React.KeyboardEvent) {
    const current = points.findIndex((p) => p.id === selectedId);
    let next = current;
    if (e.key === "ArrowRight" || e.key === "ArrowUp") next = Math.min(n - 1, current + 1);
    else if (e.key === "ArrowLeft" || e.key === "ArrowDown") next = Math.max(0, current - 1);
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = n - 1;
    else return;
    e.preventDefault();
    onSelect(points[next].id);
    const buttons = groupRef.current?.querySelectorAll<HTMLButtonElement>("[role=radio]");
    buttons?.[next]?.focus();
  }

  if (n === 0) return null;

  return (
    <figure className={cn("select-none", fill && "lg:flex lg:flex-1 lg:flex-col", className)}>
      <figcaption className="sr-only">{title}</figcaption>
      <div className={cn("relative h-56 sm:h-64 lg:h-72", fill && "lg:h-auto lg:min-h-72 lg:flex-1")}>
        {/* y axis labels and gridlines */}
        <div className="absolute inset-y-0 left-0 w-7 sm:w-8" aria-hidden>
          {TICKS.map((t) => (
            <span
              key={t}
              className="absolute right-2 -translate-y-1/2 text-meta text-ink-3 tabular-nums"
              style={{ top: `calc(1rem + (100% - 2.75rem) * ${(max - t) / max})` }}
            >
              {t}
            </span>
          ))}
        </div>

        <div className="absolute top-4 right-1 bottom-7 left-7 sm:left-8">
          {TICKS.map((t) => (
            <div
              key={t}
              aria-hidden
              className={cn("absolute inset-x-0 border-t", t === 0 ? "border-line-strong" : "border-line")}
              style={{ top: `${y(t)}%` }}
            />
          ))}

          {/* crosshair on the focused month */}
          <div
            aria-hidden
            className="absolute inset-y-0 w-px bg-ink-3/60 transition-[left] duration-150 ease-[var(--ease-out-strong)]"
            style={{ left: `${x(focusIndex)}%` }}
          />

          <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="chart-reveal absolute inset-0 size-full overflow-visible" aria-hidden>
            <polygon points={area} className="fill-data/10" />
            <polyline
              points={line}
              fill="none"
              vectorEffect="non-scaling-stroke"
              className="stroke-data"
              strokeWidth={2}
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          </svg>

          {points.map((p, i) => {
            const isFocus = i === focusIndex;
            return (
              <span
                key={p.id}
                aria-hidden
                className={cn(
                  "pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 rounded-full bg-data ring-2 ring-white transition-[width,height] duration-150",
                  isFocus ? "size-3.5" : "size-2.5",
                )}
                style={{ left: `${x(i)}%`, top: `${y(p.value)}%` }}
              />
            );
          })}

          {/* value label for the focused point only */}
          {focus ? (
            <span
              aria-hidden
              className="pointer-events-none absolute -translate-x-1/2 -translate-y-[calc(100%+0.65rem)] rounded-control bg-ink px-2 py-0.5 text-meta font-semibold whitespace-nowrap text-white tabular-nums"
              style={{
                left: `clamp(1.75rem, ${x(focusIndex)}%, calc(100% - 1.75rem))`,
                top: `${y(focus.value)}%`,
              }}
            >
              {focus.value.toFixed(1)}
            </span>
          ) : null}

          {/* month columns: the hit targets */}
          <div
            ref={groupRef}
            role="radiogroup"
            aria-label={title}
            className="absolute inset-0 flex"
            onKeyDown={onKeyDown}
            onPointerLeave={() => setHoverId(null)}
          >
            {points.map((p) => {
              const selected = p.id === selectedId;
              return (
                <button
                  key={p.id}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  tabIndex={selected ? 0 : -1}
                  aria-label={`${p.label}: ${p.value.toFixed(1)} out of 10`}
                  onClick={() => onSelect(p.id)}
                  onPointerEnter={(e) => e.pointerType === "mouse" && setHoverId(p.id)}
                  onFocus={() => setHoverId(null)}
                  className="h-full flex-1 cursor-pointer outline-offset-[-3px]"
                />
              );
            })}
          </div>
        </div>

        {/* x axis labels */}
        <div className="absolute right-1 bottom-0 left-7 flex h-6 sm:left-8" aria-hidden>
          {points.map((p, i) => (
            <span
              key={p.id}
              className={cn(
                "flex-1 text-center text-meta tabular-nums",
                i === focusIndex ? "font-semibold text-ink" : "text-ink-3",
                i % showEvery !== (n - 1) % showEvery && i !== focusIndex && "invisible",
              )}
            >
              {p.shortLabel}
            </span>
          ))}
        </div>
      </div>
    </figure>
  );
}
