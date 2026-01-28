import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import {
  NSIShieldMark,
  SocialFacebookIcon,
  SocialLinkedInIcon,
  SocialXIcon,
  SocialYouTubeIcon,
} from "@/components/public/icons";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const nsiSerif = Playfair_Display({
  variable: "--font-nsi-serif",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Nigeria Stability Index",
  description: "A calm snapshot of how Nigeria is holding together.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${nsiSerif.variable} antialiased`}
      >
        <div className="min-h-screen text-black">
          <header className="nsi-band text-white">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
              {/* Logo */}
              <Link href="/" className="flex items-center gap-3">
                <NSIShieldMark className="h-9 w-9" />
                <div className="leading-tight">
                  <div className="font-serif text-lg font-semibold tracking-tight">
                    Nigeria Stability Index{" "}
                    <span className="font-normal opacity-80">(NSI)</span>
                  </div>
                </div>
              </Link>

              {/* Navigation */}
              <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
                <Link
                  className="opacity-90 transition-opacity hover:opacity-100"
                  href="/"
                >
                  Home
                </Link>
                <Link
                  className="opacity-90 transition-opacity hover:opacity-100"
                  href="/about"
                >
                  About NSI
                </Link>
                <Link
                  className="opacity-90 transition-opacity hover:opacity-100"
                  href="/reports"
                >
                  Reports
                </Link>
                <Link
                  className="opacity-90 transition-opacity hover:opacity-100"
                  href="/reports"
                >
                  Updates
                </Link>
                <Link
                  className="ml-2 rounded-md bg-[color:var(--nsi-gold)] px-5 py-2 text-sm font-semibold text-black shadow-sm transition-all hover:brightness-[0.97]"
                  href="/subscribe"
                >
                  Subscribe
                </Link>
              </nav>

              {/* Mobile menu button */}
              <Link
                className="rounded-md bg-white/10 px-3 py-2 text-sm font-medium hover:bg-white/15 md:hidden"
                href="/reports"
              >
                Reports
              </Link>
            </div>
          </header>

          {children}

          {/* Footer */}
          <footer className="mt-16 nsi-band text-white">
            <div className="mx-auto max-w-7xl px-6 py-8">
              {/* Top section with links and social */}
              <div className="flex flex-col gap-6 border-b border-white/15 pb-6 md:flex-row md:items-center md:justify-between">
                <div className="flex flex-wrap items-center gap-x-8 gap-y-2 text-sm">
                  <Link className="opacity-90 hover:opacity-100 hover:underline" href="/about">
                    About
                  </Link>
                  <Link className="opacity-90 hover:opacity-100 hover:underline" href="/reports">
                    Reports
                  </Link>
                  <Link className="opacity-90 hover:opacity-100 hover:underline" href="/how-it-works">
                    Privacy
                  </Link>
                  <Link className="opacity-90 hover:opacity-100 hover:underline" href="/subscribe">
                    Contact
                  </Link>
                </div>

                <div className="flex items-center gap-5">
                  <Link className="opacity-80 transition-opacity hover:opacity-100" href="#" aria-label="Twitter/X">
                    <SocialXIcon className="h-5 w-5" />
                  </Link>
                  <Link className="opacity-80 transition-opacity hover:opacity-100" href="#" aria-label="Facebook">
                    <SocialFacebookIcon className="h-5 w-5" />
                  </Link>
                  <Link className="opacity-80 transition-opacity hover:opacity-100" href="#" aria-label="LinkedIn">
                    <SocialLinkedInIcon className="h-5 w-5" />
                  </Link>
                  <Link className="opacity-80 transition-opacity hover:opacity-100" href="#" aria-label="Facebook">
                    <SocialFacebookIcon className="h-5 w-5" />
                  </Link>
                  <Link className="opacity-80 transition-opacity hover:opacity-100" href="#" aria-label="YouTube">
                    <SocialYouTubeIcon className="h-5 w-5" />
                  </Link>
                </div>
              </div>

              {/* Bottom section with copyright */}
              <div className="mt-6 flex flex-col gap-3 text-xs opacity-70 md:flex-row md:items-center md:justify-between">
                <div>© {new Date().getFullYear()} Nigeria Stability Index. All rights reserved.</div>
                <div className="font-medium tracking-wide">www.NigeriaStabilityIndex.org</div>
                <div>© {new Date().getFullYear()} Nigeria Stability Index. All rights reserved.</div>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
