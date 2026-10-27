"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { useState } from "react";
import { NSIShieldMark } from "@/components/public/icons";
import {
  DashboardIcon,
  InboxIcon,
  CameraIcon,
  SparklesIcon,
  ArrowLeftIcon,
  LogOutIcon,
  MenuIcon,
  XIcon,
} from "./AdminIcons";

const navItems = [
  { href: "/admin", label: "Dashboard Overview", code: "01", icon: DashboardIcon },
  { href: "/admin/cycle", label: "Cycle Survey Setup", code: "02", icon: DashboardIcon },
  { href: "/admin/agents", label: "Field Agents", code: "03", icon: DashboardIcon },
  { href: "/admin/submissions", label: "Submissions Ledger", code: "04", icon: InboxIcon },
  { href: "/admin/snapshot", label: "Build Snapshot", code: "05", icon: CameraIcon },
  { href: "/admin/spotlight", label: "Spotlight Curation", code: "06", icon: SparklesIcon },
] as const;

export function AdminSidenav() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile menu button */}
      <div className="sticky top-0 z-40 flex items-center justify-between border-b border-white/15 bg-[color:var(--nsi-green-deep)] px-4 py-3 md:hidden">
        <button
          type="button"
          onClick={() => setMobileOpen((o) => !o)}
          className="flex items-center justify-center rounded-[2px] p-2 text-white transition-all hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--nsi-gold)]"
          aria-expanded={mobileOpen}
          aria-controls="admin-drawer"
          aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
        >
          {mobileOpen ? <XIcon /> : <MenuIcon />}
        </button>
        <div className="flex items-center gap-2">
          <NSIShieldMark className="h-7 w-11" />
          <span className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-white">
            NSI Research Console
          </span>
        </div>
        <div className="w-9" />
      </div>

      {/* Sidebar: desktop sticky, mobile as overlay drawer */}
      <aside
        id="admin-drawer"
        aria-label="Admin navigation"
        aria-hidden={!mobileOpen ? undefined : undefined}
        className={`
          fixed left-0 top-0 z-50 flex h-screen w-72 shrink-0 flex-col border-r border-white/15 bg-[color:var(--nsi-green-deep)]
          transition-transform duration-200 ease-out
          md:sticky md:z-0 md:translate-x-0
          ${mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        <div className="flex flex-1 flex-col gap-6 p-5 pt-6">
          {/* Logo and branding */}
          <div className="flex items-center gap-3 border-b border-white/15 pb-5 px-2">
            <NSIShieldMark className="h-11 w-16 shrink-0" />
            <div className="flex flex-col">
              <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[color:var(--nsi-gold-light)]">
                Research Operations
              </span>
              <span className="font-serif text-lg font-bold leading-tight text-white">
                NSI Editorial Desk
              </span>
            </div>
            {/* Mobile close button inside drawer */}
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="ml-auto rounded-[2px] p-1.5 text-white/70 transition-colors hover:bg-white/10 hover:text-white md:hidden"
              aria-label="Close navigation"
            >
              <XIcon className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation section */}
          <nav aria-label="Main admin navigation" className="flex flex-col gap-1">
            <span className="mb-2 px-3 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-white/45">
              Editorial Modules
            </span>
            {navItems.map(({ href, label, code, icon: Icon }) => {
              const isActive =
                href === "/admin"
                  ? pathname === "/admin"
                  : pathname?.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMobileOpen(false)}
                  aria-current={isActive ? "page" : undefined}
                  className={`
                    flex items-center gap-3 rounded-[2px] border-l-2 px-3 py-2.5 text-sm font-medium transition-colors
                    ${
                      isActive
                        ? "border-l-[color:var(--nsi-gold)] bg-white/10 font-semibold text-white"
                        : "border-l-transparent text-white/75 hover:bg-white/5 hover:text-white"
                    }
                  `}
                >
                  <Icon className="h-4 w-4 shrink-0 text-[color:var(--nsi-gold-light)]" />
                  <span className="flex-1">{label}</span>
                  <span className="font-mono text-[10px] text-white/40">{code}</span>
                </Link>
              );
            })}
          </nav>

          {/* Bottom section */}
          <div className="mt-auto flex flex-col gap-1 border-t border-white/15 pt-4">
            <span className="mb-2 px-3 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-white/45">
              Session & Portal
            </span>
            <Link
              href="/"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-3 rounded-[2px] px-3 py-2.5 text-sm font-medium text-white/75 transition-colors hover:bg-white/10 hover:text-white"
            >
              <ArrowLeftIcon className="h-4 w-4 shrink-0" />
              Public Index Portal
            </Link>
            <button
              type="button"
              onClick={() => signOut({ callbackUrl: "/" })}
              className="flex items-center gap-3 rounded-[2px] px-3 py-2.5 text-left text-sm font-medium text-white/75 transition-colors hover:bg-white/10 hover:text-white"
            >
              <LogOutIcon className="h-4 w-4 shrink-0" />
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile overlay to close drawer */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs transition-opacity md:hidden"
          onClick={() => setMobileOpen(false)}
          onKeyDown={(e) => e.key === "Escape" && setMobileOpen(false)}
          aria-hidden="true"
        />
      )}
    </>
  );
}
