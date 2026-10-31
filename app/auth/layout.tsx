import Link from "next/link";
import { BrandLockup } from "@/components/site/BrandLockup";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col bg-surface">
      <header className="border-b border-line bg-ground">
        <div className="mx-auto flex h-16 max-w-page items-center justify-between px-gutter">
          <BrandLockup />
          <Link href="/" className="text-small text-ink-2 underline decoration-line-strong hover:text-ink">
            Back to the site
          </Link>
        </div>
      </header>
      <main id="main" className="flex flex-1 items-start justify-center px-gutter py-12 sm:items-center">
        {children}
      </main>
    </div>
  );
}
