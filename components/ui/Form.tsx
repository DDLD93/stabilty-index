"use client";

import { useId } from "react";
import { cn } from "@/lib/utils";

export const controlClass = cn(
  "block w-full min-h-12 rounded-control border border-line-strong bg-ground px-3.5 py-2.5 text-body text-ink",
  "placeholder:text-ink-3 transition-[border-color,box-shadow] duration-150",
  "focus:border-brand focus:outline-none focus:ring-3 focus:ring-brand/20",
  "aria-[invalid=true]:border-negative aria-[invalid=true]:focus:ring-negative/20",
  "disabled:cursor-not-allowed disabled:bg-surface disabled:text-ink-3",
);

type FieldRender = (ids: { id: string; describedBy: string | undefined; invalid: boolean }) => React.ReactNode;

/**
 * Label + control + hint + error, wired with ids so screen readers hear the
 * hint and the error with the control.
 */
export function Field({
  label,
  hint,
  error,
  optional,
  children,
  className,
  counter,
}: {
  label: React.ReactNode;
  hint?: React.ReactNode;
  error?: string | null;
  optional?: boolean;
  children: FieldRender;
  className?: string;
  counter?: { value: number; max: number };
}) {
  const id = useId();
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const counterId = counter ? `${id}-count` : undefined;
  const describedBy = [hintId, errorId, counterId].filter(Boolean).join(" ") || undefined;

  return (
    <div className={cn("flex flex-col", className)}>
      <label htmlFor={id} className="text-body font-semibold text-ink">
        {label}
        {optional ? <span className="font-normal text-ink-3"> (optional)</span> : null}
      </label>
      {hint ? (
        <p id={hintId} className="mt-1 text-small text-ink-2">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={errorId} className="mt-1.5 text-small font-semibold text-negative">
          {error}
        </p>
      ) : null}
      <div className="mt-2">{children({ id, describedBy, invalid: Boolean(error) })}</div>
      {counter ? (
        <p id={counterId} className={cn("mt-1.5 text-meta tabular-nums", counter.value > counter.max ? "text-negative" : "text-ink-3")}>
          {counter.value} of {counter.max} characters
        </p>
      ) : null}
    </div>
  );
}

/** Polite status line for form outcomes (errors use role=alert). */
export function FormMessage({ tone, children, className }: { tone: "error" | "success" | "info"; children: React.ReactNode; className?: string }) {
  return (
    <div
      role={tone === "error" ? "alert" : "status"}
      className={cn(
        "px-4 py-3 text-body",
        tone === "error" && "bg-negative-tint text-negative",
        tone === "success" && "bg-brand-tint text-ink",
        tone === "info" && "bg-surface text-ink-2",
        className,
      )}
    >
      {children}
    </div>
  );
}
