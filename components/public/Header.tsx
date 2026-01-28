"use client";

import Link from "next/link";
import { useState } from "react";
import { NSIShieldMark } from "@/components/public/icons";

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
    <header className="nsi-band relative text-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
        <Link
          href="/"
          className="flex items-center gap-3 transition-opacity hover:opacity-95"
        >
          <NSIShieldMark className="h-10 w-10" />
          <div className="leading-tight">
            <div className="font-serif text-[1.125rem] font-bold tracking-tight">
              Nigeria Stability Index{" "}
              <span className="font-medium text-[color:var(--nsi-gold-light)]">
                (NSI)
              </span>
            </div>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-7 text-[0.9375rem] font-medium md:flex">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="opacity-85 transition-all hover:opacity-100"
            >
              {label}
            </Link>
          ))}
          <Link
            className="ml-3 rounded-lg bg-[color:var(--nsi-gold)] px-6 py-2.5 text-[0.9375rem] font-semibold text-[color:var(--nsi-ink)] transition-all hover:brightness-[0.96]"
            href="/subscribe"
            style={{
              boxShadow: "0 4px 12px -4px oklch(0.7 0.12 86 / 0.45)",
            }}
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
              className="mt-3 inline-flex justify-center rounded-lg bg-[color:var(--nsi-gold)] px-6 py-3 text-[0.9375rem] font-semibold text-[color:var(--nsi-ink)]"
            >
              Subscribe
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
