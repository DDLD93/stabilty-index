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
  { href: "/admin", label: "Dashboard", icon: DashboardIcon },
  { href: "/admin/submissions", label: "Submissions", icon: InboxIcon },
  { href: "/admin/snapshot", label: "Build snapshot", icon: CameraIcon },
  { href: "/admin/spotlight", label: "Spotlight", icon: SparklesIcon },
] as const;

export function AdminSidenav() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile menu button */}
      <div className="sticky top-0 z-40 flex items-center justify-between border-b border-white/10 bg-[color:var(--nsi-green-deep)] px-4 py-3 md:hidden">
        <button
          type="button"
          onClick={() => setMobileOpen((o) => !o)}
          className="flex items-center justify-center rounded-lg p-2 text-white transition-all hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--nsi-gold)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--nsi-green-deep)]"
          aria-expanded={mobileOpen}
          aria-controls="admin-drawer"
          aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
        >
          {mobileOpen ? <XIcon /> : <MenuIcon />}
        </button>
        <span className="font-serif text-sm font-semibold text-white">Admin</span>
        {/* Empty div for flex spacing */}
        <div className="w-9" />
      </div>

      {/* Sidebar: desktop sticky, mobile as overlay drawer */}
      <aside
        id="admin-drawer"
        aria-label="Admin navigation"
        aria-hidden={!mobileOpen ? undefined : undefined}
        className={`
          fixed left-0 top-0 z-50 flex h-screen w-72 shrink-0 flex-col border-r border-white/10 bg-[color:var(--nsi-green-deep)]
          transition-transform duration-200 ease-out
          md:sticky md:z-0 md:translate-x-0
          ${mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
        style={{ backgroundImage: "linear-gradient(180deg, oklch(0.24 0.06 164) 0%, oklch(0.20 0.05 164) 100%)" }}
      >
        <div className="flex flex-1 flex-col gap-6 p-5 pt-6">
          {/* Logo and branding */}
          <div className="flex items-center gap-3 px-2">
            <NSIShieldMark className="h-9 w-9 shrink-0" />
            <div className="hidden flex-col md:flex">
              <span className="font-serif text-lg font-semibold leading-tight text-white">
                Admin
              </span>
              <span className="text-xs text-white/60">Nigeria Stability Index</span>
            </div>
            {/* Mobile close button inside drawer */}
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="ml-auto rounded-lg p-1.5 text-white/70 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--nsi-gold)] md:hidden"
              aria-label="Close navigation"
            >
              <XIcon className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation section */}
          <nav aria-label="Main admin navigation" className="flex flex-col gap-1">
            <span className="mb-2 px-3 text-[0.6875rem] font-semibold uppercase tracking-wider text-white/50">
              Navigation
            </span>
            {navItems.map(({ href, label, icon: Icon }) => {
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
                    flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors
                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--nsi-gold)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--nsi-green-deep)]
                    ${isActive
                      ? "bg-white/15 text-[color:var(--nsi-gold-light)]"
                      : "text-white/85 hover:bg-white/10 hover:text-white"}
                  `}
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  {label}
                </Link>
              );
            })}
          </nav>

          {/* Bottom section */}
          <div className="mt-auto flex flex-col gap-1 border-t border-white/10 pt-4">
            <span className="mb-2 px-3 text-[0.6875rem] font-semibold uppercase tracking-wider text-white/50">
              Account
            </span>
            <Link
              href="/"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-white/80 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--nsi-gold)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--nsi-green-deep)]"
            >
              <ArrowLeftIcon className="h-5 w-5 shrink-0" />
              Back to site
            </Link>
            <button
              type="button"
              onClick={() => signOut({ callbackUrl: "/" })}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-white/80 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--nsi-gold)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--nsi-green-deep)]"
            >
              <LogOutIcon className="h-5 w-5 shrink-0" />
              Sign out
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile overlay to close drawer */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity md:hidden"
          onClick={() => setMobileOpen(false)}
          onKeyDown={(e) => e.key === "Escape" && setMobileOpen(false)}
          aria-hidden="true"
        />
      )}
    </>
  );
}
