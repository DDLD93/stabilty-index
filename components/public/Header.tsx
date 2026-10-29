"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { NSIShieldMark } from "@/components/public/icons";
import { LiveTelemetryTicker } from "@/components/public/LiveTelemetryTicker";

const navLinks = [
  { href: "/", label: "Observatory" },
  { href: "/reports", label: "Dossiers" },
  { href: "/spotlights", label: "Regional Radar" },
  { href: "/methodology", label: "Framework" },
  { href: "/about", label: "Mandate" },
  { href: "/subscribe", label: "Dispatches" },
  { href: "/contact", label: "Secretariat" },
];

export function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <LiveTelemetryTicker />

      <header className="sticky top-0 z-40 w-full border-b border-[rgba(0,245,155,0.12)] bg-[#040e08]/90 backdrop-blur-xl transition-all">
        <div className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between px-6">
          {/* Logo Brand Lockup */}
          <Link
            href="/"
            className="group flex items-center gap-3.5 focus:outline-none"
            aria-label="Nigeria Stability Index Home"
          >
            <div className="relative flex items-center justify-center">
              <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-[#00f59b]/20 to-[#f59e0b]/20 blur-md opacity-70 group-hover:opacity-100 transition duration-300" />
              <NSIShieldMark className="relative h-11 w-16 shrink-0 transition-transform duration-300 group-hover:scale-105" />
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-serif text-lg font-bold tracking-tight text-white group-hover:text-[#00f59b] transition-colors sm:text-xl">
                  Nigeria Stability Index
                </span>
                <span className="rounded-[4px] border border-[rgba(0,245,155,0.3)] bg-[rgba(0,245,155,0.08)] px-1.5 py-0.5 font-mono text-[9px] font-bold tracking-widest text-[#00f59b]">
                  NSI · OBS
                </span>
              </div>
              <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#94a3b8]">
                Geopolitical &amp; Civic Telemetry Platform
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav
            aria-label="Primary Navigation"
            className="hidden items-center gap-1.5 lg:flex"
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
                  className={`relative px-3.5 py-2 font-mono text-xs font-semibold tracking-wider transition-all rounded-md ${
                    isActive
                      ? "text-[#00f59b] bg-[rgba(0,245,155,0.08)] shadow-[inset_0_0_12px_rgba(0,245,155,0.15)]"
                      : "text-[#cbd5e1] hover:text-white hover:bg-white/[0.04]"
                  }`}
                >
                  {label}
                  {isActive && (
                    <span className="absolute bottom-0 left-3 right-3 h-[2px] bg-gradient-to-r from-transparent via-[#00f59b] to-transparent" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Action CTAs */}
          <div className="hidden items-center gap-3 sm:flex">
            <Link
              href="/survey"
              className="btn-observatory-primary px-4 py-2 text-xs"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#030805] opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#030805]" />
              </span>
              <span>Field Check-In</span>
            </Link>

            <Link
              href="/reports"
              className="btn-observatory-outline px-4 py-2 text-xs"
            >
              Dossiers
            </Link>
          </div>

          {/* Mobile Menu Trigger */}
          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-[rgba(0,245,155,0.2)] bg-[rgba(0,245,155,0.05)] text-white hover:bg-[rgba(0,245,155,0.1)] lg:hidden"
            aria-expanded={mobileOpen}
            aria-label="Toggle navigation menu"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {mobileOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileOpen && (
          <div className="border-t border-[rgba(0,245,155,0.15)] bg-[#040e08]/98 p-6 backdrop-blur-2xl lg:hidden">
            <nav className="flex flex-col gap-2">
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
                    className={`rounded-lg px-4 py-3 font-mono text-sm font-semibold tracking-wider transition-all ${
                      isActive
                        ? "bg-[rgba(0,245,155,0.12)] text-[#00f59b] border border-[rgba(0,245,155,0.2)]"
                        : "text-[#cbd5e1] hover:bg-white/[0.05] hover:text-white"
                    }`}
                  >
                    {label}
                  </Link>
                );
              })}
            </nav>

            <div className="mt-6 flex flex-col gap-3 pt-6 border-t border-[rgba(0,245,155,0.15)]">
              <Link
                href="/survey"
                onClick={() => setMobileOpen(false)}
                className="btn-observatory-primary w-full justify-center py-3 text-center"
              >
                Transmit Field Check-In
              </Link>
              <Link
                href="/reports"
                onClick={() => setMobileOpen(false)}
                className="btn-observatory-outline w-full justify-center py-3 text-center"
              >
                Browse Published Dossiers
              </Link>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
