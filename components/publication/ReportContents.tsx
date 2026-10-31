"use client";

import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export type ContentsItem = { id: string; label: string };

/**
 * "On this page" for a report: a sticky list on wide screens that follows the
 * reader's position, and a disclosure jump menu on small screens.
 */
export function ReportContents({ items }: { items: ContentsItem[] }) {
  const [active, setActive] = useState(items[0]?.id ?? "");

  useEffect(() => {
    const sections = items
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => Boolean(el));
    if (sections.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-20% 0px -65% 0px" },
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [items]);

  return (
    <>
      <details className="no-print group border-y border-line lg:hidden">
        <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between font-semibold">
          On this page
          <ChevronDown aria-hidden className="size-5 text-ink-3 transition-transform duration-200 group-open:rotate-180" />
        </summary>
        <ul className="pb-3">
          {items.map((item) => (
            <li key={item.id}>
              <a href={`#${item.id}`} className="flex min-h-11 items-center text-body text-brand underline underline-offset-[0.22em]">
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </details>

      <nav aria-label="On this page" className="no-print sticky top-28 hidden lg:block">
        <p className="text-meta font-semibold text-ink-3">On this page</p>
        <ul className="mt-3 border-l border-line">
          {items.map((item) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                aria-current={active === item.id ? "location" : undefined}
                className={cn(
                  "-ml-px flex min-h-10 items-center border-l pl-4 text-small transition-colors duration-150",
                  active === item.id ? "border-brand font-semibold text-ink" : "border-transparent text-ink-2 hover:text-ink",
                )}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}
