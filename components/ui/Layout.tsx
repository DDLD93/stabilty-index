import { cn } from "@/lib/utils";

/** Page-width container with the responsive side gutter. */
export function Container({
  className,
  narrow,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { narrow?: boolean }) {
  return (
    <div
      className={cn(
        // content-box: the max width applies to the content, the gutter sits outside it
        "mx-auto box-content px-gutter",
        narrow ? "max-w-reading" : "max-w-page",
        className,
      )}
      {...props}
    />
  );
}

/** A page section with the shared vertical rhythm. `tone="surface"` gives it the alternate ground. */
export function Section({
  className,
  tone = "ground",
  ...props
}: React.HTMLAttributes<HTMLElement> & { tone?: "ground" | "surface" | "ink" }) {
  return (
    <section
      className={cn(
        "py-section",
        tone === "surface" && "bg-surface",
        tone === "ink" && "bg-ink text-white",
        className,
      )}
      {...props}
    />
  );
}

/** Section heading with an optional one-line intro. */
export function SectionHeading({
  title,
  intro,
  id,
  action,
  className,
}: {
  title: React.ReactNode;
  intro?: React.ReactNode;
  id?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mb-8 flex flex-col gap-4 sm:mb-10 md:flex-row md:items-end md:justify-between", className)}>
      <div className="max-w-2xl">
        <h2 id={id} className="text-h2">
          {title}
        </h2>
        {intro ? <p className="mt-3 text-lead text-ink-2">{intro}</p> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
