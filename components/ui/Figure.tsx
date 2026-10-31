import Image from "next/image";
import type { Photo } from "@/lib/photos";
import { cn } from "@/lib/utils";

/**
 * A credited documentary photograph. Credits are required by the licences
 * (CC BY / BY-SA), so the caption line always carries them.
 */
export function Figure({
  photo,
  sizes,
  priority,
  className,
  imageClassName,
  aspect = "3/2",
  caption = true,
}: {
  photo: Photo;
  sizes: string;
  priority?: boolean;
  className?: string;
  imageClassName?: string;
  aspect?: "3/2" | "4/3" | "16/9" | "4/5" | "1/1" | "21/9" | "free";
  caption?: boolean;
}) {
  return (
    <figure className={cn("flex flex-col", className)}>
      <div
        className={cn("relative overflow-hidden bg-surface", aspect !== "free" && "w-full")}
        style={aspect !== "free" ? { aspectRatio: aspect } : undefined}
      >
        <Image
          src={photo.src}
          alt={photo.alt}
          {...(aspect === "free"
            ? { width: photo.width, height: photo.height }
            : { fill: true })}
          sizes={sizes}
          priority={priority}
          className={cn("object-cover", aspect === "free" && "h-auto w-full", imageClassName)}
        />
      </div>
      {caption ? <PhotoCredit photo={photo} className="mt-2" /> : null}
    </figure>
  );
}

export function PhotoCredit({ photo, className, inverse }: { photo: Photo; className?: string; inverse?: boolean }) {
  const { credit } = photo;
  return (
    <figcaption className={cn("text-meta", inverse ? "text-white/80" : "text-ink-3", className)}>
      {photo.caption}{" "}
      <span>
        Photo:{" "}
        <a href={credit.page} className="underline decoration-1 hover:decoration-2" rel="noopener" target="_blank">
          {credit.creator}
        </a>
        ,{" "}
        <a href={credit.licenseUrl} className="underline decoration-1 hover:decoration-2" rel="noopener license" target="_blank">
          {credit.license}
        </a>
      </span>
    </figcaption>
  );
}
