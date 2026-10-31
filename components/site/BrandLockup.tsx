import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

/** NSI emblem with the name set in type, so the wordmark stays legible at header size. */
export function BrandLockup({ className, inverse }: { className?: string; inverse?: boolean }) {
  return (
    <Link
      href="/"
      className={cn("group flex min-h-11 items-center gap-2.5 sm:gap-3", className)}
      aria-label="Nigeria Stability Index, home"
    >
      <Image
        src="/brand/nsi-emblem-240.webp"
        alt=""
        width={240}
        height={155}
        priority
        className="h-8 w-auto sm:h-9"
      />
      <span
        className={cn(
          "font-serif text-[1.0625rem] leading-tight font-semibold tracking-[-0.005em] sm:text-[1.1875rem]",
          inverse ? "text-white" : "text-ink",
        )}
      >
        Nigeria Stability Index
      </span>
    </Link>
  );
}
