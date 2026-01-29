import type { Metadata } from "next";
import Image from "next/image";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import {
  SocialInstagramIcon,
  SocialTikTokIcon,
  SocialXIcon,
} from "@/components/public/icons";
import { Header } from "@/components/public/Header";
import { defaultMetadata } from "@/lib/metadata";
import { getOrganizationSchema, getWebSiteSchema, renderJsonLd } from "@/lib/seo";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const nsiSerif = Playfair_Display({
  variable: "--font-nsi-serif",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = defaultMetadata as Metadata;

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#1a4d3a" },
    { media: "(prefers-color-scheme: dark)", color: "#1a4d3a" },
  ],
};

const SOCIAL = [
  { href: "https://x.com/Nigeria_NSI", label: "X", Icon: SocialXIcon },
  {
    href: "https://www.instagram.com/nigeriastabilityindex",
    label: "Instagram",
    Icon: SocialInstagramIcon,
  },
  {
    href: "https://www.tiktok.com/@nigeria_nsi",
    label: "TikTok",
    Icon: SocialTikTokIcon,
  },
] as const;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const organizationSchema = getOrganizationSchema();
  const websiteSchema = getWebSiteSchema();

  return (
    <html lang="en-NG">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: renderJsonLd(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: renderJsonLd(websiteSchema) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${nsiSerif.variable} antialiased relative min-h-screen`}
      >
        <div className="relative flex min-h-screen flex-col text-[color:var(--nsi-ink)]">
          <Header />

          <div className="flex-1">
            {children}
          </div>

          <footer className="nsi-band mt-20 text-white">
            <div className="mx-auto max-w-7xl px-6 py-12">
              <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
                <div className="flex flex-col gap-6">
                  <div className="flex flex-wrap items-center gap-x-8 gap-y-3 text-[0.875rem] font-medium">
                    <Link className="opacity-80 hover:text-[color:var(--nsi-gold-light)] hover:opacity-100" href="/about">About</Link>
                    <Link className="opacity-80 hover:text-[color:var(--nsi-gold-light)] hover:opacity-100" href="/reports">Reports</Link>
                    <Link className="opacity-80 hover:text-[color:var(--nsi-gold-light)] hover:opacity-100" href="/privacy">Privacy</Link>
                    <Link className="opacity-80 hover:text-[color:var(--nsi-gold-light)] hover:opacity-100" href="/contact">Contact</Link>
                  </div>
                  
                  <div className="flex items-center gap-5">
                    {SOCIAL.map(({ href, label, Icon }) => (
                      <Link
                        key={label}
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="opacity-70 transition-all hover:opacity-100 hover:scale-110"
                        aria-label={label}
                      >
                        <Icon className="h-5 w-5" />
                      </Link>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2 text-right">
                  <div className="text-[0.8125rem] font-medium opacity-60">A project of</div>
                  <div className="flex items-center gap-2">
                    <span className="font-serif text-lg font-bold">THE 24 Angels Initiative</span>
                  </div>
                </div>
              </div>

              <div className="mt-12 flex flex-col gap-4 border-t border-white/10 pt-8 md:flex-row md:items-center md:justify-between">
                <div className="text-[0.75rem] opacity-50">
                  © {new Date().getFullYear()} Nigeria Stability Index. All rights reserved.
                </div>
                <div className="text-[0.75rem] font-medium tracking-wide opacity-50">
                  www.NigeriaStabilityIndex.org
                </div>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
