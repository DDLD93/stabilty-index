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

export function Timeline({ steps, className }: { steps: TimelineStep[]; className?: string }) {
  return (
    <ol className={cn("grid gap-px bg-line sm:grid-cols-2 lg:grid-cols-4", className)}>
      {steps.map((step, i) => (
        <li
          key={step.key}
          aria-current={step.state === "current" ? "step" : undefined}
          className={cn("flex flex-col bg-ground px-5 py-6", step.state === "current" && "bg-gold-tint")}
        >
          <span className="flex items-center gap-2 text-meta text-ink-3">
            {step.state === "done" ? (
              <Check aria-hidden className="size-4 text-brand" />
            ) : (
              <span aria-hidden className="tabular-nums">
                {i + 1}
              </span>
            )}
            {step.state === "done" ? "Done" : step.state === "current" ? "Now" : "Coming up"}
          </span>
          <span className="mt-2 font-serif text-h3 font-semibold">{step.label}</span>
          <span className={cn("mt-1 text-small", step.when === "To be announced" ? "text-ink-3" : "text-ink-2")}>{step.when}</span>
        </li>
      ))}
    </ol>
  );
}

/** Gold rule used as the Honors mark above headings. */
export function GoldRule({ className }: { className?: string }) {
  return <div aria-hidden className={cn("h-1 w-14 bg-gold", className)} />;
}
