"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { primaryNav, isActive } from "@/components/site/nav";
import { cn } from "@/lib/utils";

export function NavLinks() {
  const pathname = usePathname();
  return (
    <ul className="flex items-center gap-1">
      {primaryNav.map(({ href, label }) => {
        const active = isActive(pathname, href);
        return (
          <li key={href}>
            <Link
              href={href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "relative flex min-h-11 items-center px-3 text-small font-semibold text-ink-2 transition-colors duration-150",
                "after:absolute after:inset-x-3 after:bottom-1.5 after:h-0.5 after:origin-left after:scale-x-0 after:bg-brand after:transition-transform after:duration-200 after:ease-[var(--ease-out-strong)]",
                "[@media(hover:hover)_and_(pointer:fine)]:hover:text-ink [@media(hover:hover)_and_(pointer:fine)]:hover:after:scale-x-100",
                active && "text-ink after:scale-x-100",
              )}
            >
              {label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
