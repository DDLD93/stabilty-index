import { AdminSidenav } from "@/components/admin/AdminSidenav";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen flex-col overflow-hidden md:flex-row">
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
        <div className="mx-auto w-full max-w-7xl px-6 py-8 md:py-10">
          {children}
        </div>
      </main>
    </div>
  );
}
