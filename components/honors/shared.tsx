import { Check } from "lucide-react";
import type { TimelineStep } from "@/lib/honors/phase";
import { photos, type Photo } from "@/lib/photos";
import { cn } from "@/lib/utils";

/** Illustrative photo per category. These show the field, never a nominee or winner. */
const CATEGORY_PHOTOS: Record<string, Photo> = {
  "public-institution": photos.abujaCbd,
  "education-impact": photos.classroom,
  "healthcare-impact": photos.nurse,
  "infrastructure-impact": photos.roadWorks,
  "community-development": photos.foodTrader,
  "digital-innovation": photos.digitalClassroom,
  "agricultural-impact": photos.farmer,
  "security-impact": photos.policeTraffic,
};

export function categoryPhoto(slug: string): Photo {
  return CATEGORY_PHOTOS[slug] ?? photos.durbar;
}

/**
 * The four Honors stages, told once: number and name, where the stage stands,
 * its dates (or "To be announced"), and what happens in it.
 */
export function Timeline({
  steps,
  descriptions,
  className,
}: {
  steps: TimelineStep[];
  descriptions?: Record<string, string>;
  className?: string;
}) {
  return (
    <ol className={cn("grid gap-px bg-line sm:grid-cols-2 lg:grid-cols-4", className)}>
      {steps.map((step, i) => (
        <li
          key={step.key}
          aria-current={step.state === "current" ? "step" : undefined}
          className={cn("flex flex-col bg-ground px-5 py-6", step.state === "current" && "bg-gold-tint")}
        >
          <h3 className="font-serif text-h3 font-semibold">
            <span className="tabular-nums">{i + 1}.</span> {step.label}
          </h3>
          <p className={cn("mt-2 flex items-center gap-1.5 text-small font-semibold", step.state === "upcoming" ? "text-ink-3" : "text-ink")}>
            {step.state === "done" ? <Check aria-hidden className="size-4 text-brand" /> : null}
            {step.status}
          </p>
          <p className={cn("text-small", step.when === "To be announced" ? "text-ink-3" : "text-ink-2")}>{step.when}</p>
          {descriptions?.[step.key] ? <p className="mt-3 text-small text-ink-2">{descriptions[step.key]}</p> : null}
        </li>
      ))}
    </ol>
  );
}

/** Gold rule used as the Honors mark above headings. */
export function GoldRule({ className }: { className?: string }) {
  return <div aria-hidden className={cn("h-1 w-14 bg-gold", className)} />;
}
