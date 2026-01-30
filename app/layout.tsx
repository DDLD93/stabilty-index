import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import "./globals.css";
import { ConditionalSiteChrome } from "@/components/layout/ConditionalSiteChrome";
import { Header } from "@/components/public/Header";
import { SiteFooter } from "@/components/layout/SiteFooter";
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
          <ConditionalSiteChrome
            top={<Header />}
            bottom={<SiteFooter />}
          >
            {children}
          </ConditionalSiteChrome>
        </div>
      </body>
    </html>
  );
}
