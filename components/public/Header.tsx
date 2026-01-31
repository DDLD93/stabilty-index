"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/reports", label: "Reports" },
  { href: "/spotlights", label: "Spotlights" },
  { href: "/methodology", label: "Methodology" },
  { href: "/subscribe", label: "Subscribe" },
  { href: "/contact", label: "Contact" },
] as const;

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="nsi-band sticky top-0 z-50 text-white backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-4">
        <Link
          href="/"
          className="flex items-center gap-3 transition-opacity hover:opacity-95"
        >
          <Image
            src="/assetes/NSI_logo_web_800w.png"
            alt="Nigeria Stability Index"
            width={160}
            height={36}
            className="h-9 w-auto"
          />
          <div className="hidden leading-tight sm:block">
            <div className="font-serif text-[1rem] font-bold tracking-tight">
              Nigeria Stability Index{" "}
              <span className="font-medium text-[color:var(--nsi-gold-light)]">
                (NSI)
              </span>
            </div>
          </div>
          <div className="block sm:hidden font-serif text-[1.125rem] font-bold tracking-tight">
            NSI
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-6 text-[0.875rem] font-medium md:flex">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="opacity-90 transition-all hover:text-[color:var(--nsi-gold-light)] hover:opacity-100"
            >
              {label}
            </Link>
          ))}
          <Link
            className="ml-2 rounded-xl bg-[color:var(--nsi-gold)] px-6 py-2.5 text-[0.875rem] font-bold text-[color:var(--nsi-ink)] shadow-md transition-all hover:brightness-110"
            href="/subscribe"
          >
            Subscribe
          </Link>
        </nav>

        {/* Mobile: hamburger */}
        <button
          type="button"
          onClick={() => setMobileOpen((o) => !o)}
          className="flex flex-col gap-1.5 rounded-lg p-2 transition-all hover:bg-white/10 md:hidden"
          aria-expanded={mobileOpen}
          aria-label="Toggle menu"
        >
          <span
            className={`h-0.5 w-6 bg-white transition-all ${
              mobileOpen ? "translate-y-2 rotate-45" : ""
            }`}
          />
          <span
            className={`h-0.5 w-6 bg-white transition-all ${
              mobileOpen ? "opacity-0" : ""
            }`}
          />
          <span
            className={`h-0.5 w-6 bg-white transition-all ${
              mobileOpen ? "-translate-y-2 -rotate-45" : ""
            }`}
          />
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div
          className="absolute left-0 right-0 top-full z-50 border-t border-white/12 bg-[color:var(--nsi-green-deep)] shadow-xl md:hidden"
          style={{ backgroundImage: "linear-gradient(180deg, oklch(0.24 0.06 164) 0%, oklch(0.20 0.05 164) 100%)" }}
        >
          <nav className="flex flex-col gap-1 px-6 py-4">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileOpen(false)}
                className="rounded-lg px-4 py-3 text-[0.9375rem] font-medium opacity-90 transition-all hover:bg-white/10 hover:opacity-100"
              >
                {label}
              </Link>
            ))}
            <Link
              href="/subscribe"
              onClick={() => setMobileOpen(false)}
              className="mt-3 inline-flex justify-center rounded-xl bg-[color:var(--nsi-gold)] px-6 py-3 text-[0.9375rem] font-semibold text-[color:var(--nsi-ink)] shadow-md transition-all hover:brightness-110"
            >
              Subscribe
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
