"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { NSIShieldMark } from "@/components/public/icons";

const navLinks = [
  { href: "/", label: "Index" },
  { href: "/reports", label: "Reports" },
  { href: "/spotlights", label: "Spotlights" },
  { href: "/methodology", label: "Methodology" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full bg-[color:var(--nsi-green-deep)] text-white shadow-md">
      {/* Top Institutional Utility Bar (Chatham House / Afrobarometer style) */}
      <div className="border-b border-white/10 bg-[color:var(--nsi-green-ink)]">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-2 text-[0.6875rem] font-mono tracking-wider text-white/70">
          <div className="flex items-center gap-3">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-[color:var(--nsi-gold)]" />
            <span className="uppercase">
              Independent Civic Measurement · 36 States &amp; FCT Abuja
            </span>
          </div>
          <div className="hidden items-center gap-6 md:flex">
            <span className="text-white/50">CADENCE: 11TH OF EVERY MONTH</span>
            <Link
              href="/how-it-works"
              className="uppercase text-white/75 transition-colors hover:text-[color:var(--nsi-gold-light)]"
            >
              How It Works
            </Link>
            <Link
              href="/privacy"
              className="uppercase text-white/75 transition-colors hover:text-[color:var(--nsi-gold-light)]"
            >
              Data Ethics
            </Link>
          </div>
        </div>
      </div>

      {/* Main Editorial Masthead */}
      <div className="border-b-2 border-[color:var(--nsi-gold)]">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-4">
          <Link
            href="/"
            className="group flex items-center gap-3.5 focus:outline-none"
          >
            <NSIShieldMark className="h-11 w-[4.2rem] shrink-0 drop-shadow-sm transition-transform duration-200 group-hover:scale-[1.03] sm:h-12 sm:w-[4.6rem]" />
            <div className="flex flex-col">
              <div className="flex items-baseline gap-2">
                <span className="font-serif text-xl font-bold tracking-tight text-white sm:text-[1.35rem]">
                  Nigeria Stability Index
                </span>
                <span className="hidden rounded-[2px] border border-[color:var(--nsi-gold)]/50 bg-[color:var(--nsi-gold)]/15 px-1.5 py-0.5 font-mono text-[0.65rem] font-bold tracking-widest text-[color:var(--nsi-gold-light)] sm:inline-block">
                  NSI
                </span>
              </div>
              <span className="font-mono text-[0.65rem] uppercase tracking-[0.14em] text-white/60">
                Public Sentiment &amp; Governance Monitor
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav
            aria-label="Primary Navigation"
            className="hidden items-center gap-1 lg:flex"
          >
            {navLinks.map(({ href, label }) => {
              const isActive =
                href === "/"
                  ? pathname === "/"
                  : pathname?.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  className={`relative px-3.5 py-2 text-[0.84rem] font-medium tracking-wide transition-colors ${
                    isActive
                      ? "text-[color:var(--nsi-gold-light)]"
                      : "text-white/85 hover:text-white"
                  }`}
                >
                  {label}
                  {isActive && (
                    <span className="absolute bottom-0 left-3.5 right-3.5 h-0.5 bg-[color:var(--nsi-gold)]" />
                  )}
                </Link>
              );
            })}

            <div className="ml-4 flex items-center gap-2.5 border-l border-white/15 pl-5">
              <Link
                href="/survey"
                className="rounded-[3px] border border-white/25 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white transition-colors hover:border-white/50 hover:bg-white/10"
              >
                Take Survey
              </Link>
              <Link
                href="/subscribe"
                className="rounded-[3px] bg-[color:var(--nsi-gold)] px-4 py-2 text-xs font-bold uppercase tracking-wider text-[color:var(--nsi-ink)] transition-colors hover:bg-[color:var(--nsi-gold-light)]"
              >
                Subscribe
              </Link>
            </div>
          </nav>

          {/* Mobile Hamburger Button */}
          <button
            type="button"
            onClick={() => setMobileOpen((o) => !o)}
            className="flex flex-col gap-1.5 rounded-[3px] border border-white/15 p-2.5 transition-colors hover:bg-white/10 lg:hidden"
            aria-expanded={mobileOpen}
            aria-label="Toggle navigation menu"
          >
            <span
              className={`h-0.5 w-5 bg-white transition-all ${
                mobileOpen ? "translate-y-2 rotate-45" : ""
              }`}
            />
            <span
              className={`h-0.5 w-5 bg-white transition-all ${
                mobileOpen ? "opacity-0" : ""
              }`}
            />
            <span
              className={`h-0.5 w-5 bg-white transition-all ${
                mobileOpen ? "-translate-y-2 -rotate-45" : ""
              }`}
            />
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileOpen && (
        <div className="border-b-2 border-[color:var(--nsi-gold)] bg-[color:var(--nsi-green-deep)] shadow-2xl lg:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col divide-y divide-white/10 px-6 py-4">
            {navLinks.map(({ href, label }) => {
              const isActive =
                href === "/"
                  ? pathname === "/"
                  : pathname?.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center justify-between py-3 text-sm font-medium ${
                    isActive
                      ? "font-semibold text-[color:var(--nsi-gold-light)]"
                      : "text-white/90 hover:text-white"
                  }`}
                >
                  <span>{label}</span>
                  <span className="font-mono text-xs text-white/40">→</span>
                </Link>
              );
            })}
            <Link
              href="/how-it-works"
              onClick={() => setMobileOpen(false)}
              className="flex items-center justify-between py-3 text-sm font-medium text-white/80 hover:text-white"
            >
              <span>How It Works</span>
              <span className="font-mono text-xs text-white/40">→</span>
            </Link>
            <div className="grid grid-cols-2 gap-3 pt-4">
              <Link
                href="/survey"
                onClick={() => setMobileOpen(false)}
                className="inline-flex justify-center rounded-[3px] border border-white/25 bg-white/10 px-4 py-3 text-xs font-semibold uppercase tracking-wider text-white"
              >
                Take Survey
              </Link>
              <Link
                href="/subscribe"
                onClick={() => setMobileOpen(false)}
                className="inline-flex justify-center rounded-[3px] bg-[color:var(--nsi-gold)] px-4 py-3 text-xs font-bold uppercase tracking-wider text-[color:var(--nsi-ink)]"
              >
                Subscribe
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
