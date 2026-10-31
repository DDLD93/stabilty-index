import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import { AdminSidenav } from "@/components/admin/AdminSidenav";

// The admin area keeps its existing faces; these rebind the shared font roles inside the admin wrapper.
const adminSans = Geist({ variable: "--font-body", subsets: ["latin"], display: "swap" });
const adminMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"], display: "swap" });
const adminSerif = Playfair_Display({ variable: "--font-display", subsets: ["latin"], display: "swap" });

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className={`${adminSans.variable} ${adminMono.variable} ${adminSerif.variable} admin-scope flex h-dvh flex-col overflow-hidden font-sans text-[color:var(--nsi-ink)] md:flex-row`}
    >
      {/* Skip link for keyboard users */}
      <a
        href="#admin-main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-[color:var(--nsi-green)] focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-white focus:shadow-lg"
      >
        Skip to main content
      </a>

      <AdminSidenav />

      <main
        id="admin-main"
        role="main"
        aria-label="Admin content"
        tabIndex={-1}
        className="flex-1 overflow-auto bg-[color:var(--nsi-paper)] focus:outline-none"
      >
        <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 md:py-10">
          {children}
        </div>
      </main>
    </div>
  );
}
