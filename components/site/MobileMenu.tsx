"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef } from "react";
import { Menu, X } from "lucide-react";
import { primaryNav, secondaryNav, isActive } from "@/components/site/nav";
import { cn } from "@/lib/utils";

/**
 * Full-height menu for small screens, built on <dialog> so Escape, focus
 * containment and the inert background come from the browser.
 */
export function MobileMenu({ action }: { action: { href: string; label: string } }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();
  const id = useId();

  const open = () => dialogRef.current?.showModal();
  const close = () => dialogRef.current?.close();

  // Close when the route changes (a link inside was followed).
  useEffect(() => {
    close();
  }, [pathname]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const onClose = () => {
      document.documentElement.style.overflow = "";
      toggleRef.current?.focus();
    };
    const onToggle = () => {
      if (dialog.open) document.documentElement.style.overflow = "hidden";
    };
    dialog.addEventListener("close", onClose);
    dialog.addEventListener("toggle", onToggle);
    return () => {
      dialog.removeEventListener("close", onClose);
      dialog.removeEventListener("toggle", onToggle);
    };
  }, []);

  return (
    <>
      <button
        ref={toggleRef}
        type="button"
        onClick={open}
        aria-haspopup="dialog"
        aria-controls={id}
        className="-mr-2 inline-flex size-12 items-center justify-center rounded-control text-ink lg:hidden"
      >
        <Menu aria-hidden className="size-6" strokeWidth={1.75} />
        <span className="sr-only">Open menu</span>
      </button>

      <dialog
        ref={dialogRef}
        id={id}
        aria-label="Site menu"
        onClick={(event) => {
          // A click on the backdrop lands on the dialog element itself.
          if (event.target === event.currentTarget) close();
        }}
        className={cn(
          "fixed inset-0 m-0 ml-auto h-dvh max-h-none w-full max-w-sm bg-ground p-0 text-ink shadow-overlay",
          "backdrop:bg-ink/40",
          "opacity-0 translate-x-6 transition-[opacity,translate,display,overlay] duration-200 ease-[var(--ease-out-strong)] transition-discrete",
          "open:opacity-100 open:translate-x-0 starting:open:opacity-0 starting:open:translate-x-6",
          "motion-reduce:transition-none",
        )}
      >
        <div className="flex h-full flex-col">
          <div className="flex h-16 items-center justify-between border-b border-line px-gutter">
            <span className="font-serif text-[1.0625rem] font-semibold">Menu</span>
            <button
              type="button"
              onClick={close}
              className="-mr-2 inline-flex size-12 items-center justify-center rounded-control"
            >
              <X aria-hidden className="size-6" strokeWidth={1.75} />
              <span className="sr-only">Close menu</span>
            </button>
          </div>

          <nav aria-label="Main" className="flex-1 overflow-y-auto px-gutter py-4">
            <ul className="divide-y divide-line">
              {primaryNav.map(({ href, label }) => {
                const active = isActive(pathname, href);
                return (
                  <li key={href}>
                    <Link
                      href={href}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "flex min-h-14 items-center font-serif text-[1.375rem] font-semibold",
                        active ? "text-brand" : "text-ink",
                      )}
                    >
                      {label}
                    </Link>
                  </li>
                );
              })}
            </ul>
            <ul className="mt-6 flex flex-col">
              {secondaryNav.map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="flex min-h-12 items-center text-body text-ink-2 underline decoration-line-strong">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="border-t border-line px-gutter py-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
            <Link
              href={action.href}
              className="flex min-h-12 w-full items-center justify-center rounded-control bg-brand px-5 font-semibold text-white"
            >
              {action.label}
            </Link>
          </div>
        </div>
      </dialog>
    </>
  );
}
