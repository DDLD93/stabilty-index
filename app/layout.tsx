import type { Metadata } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono, Newsreader } from "next/font/google";
import "./globals.css";
import { ConditionalSiteChrome } from "@/components/layout/ConditionalSiteChrome";
import { Header } from "@/components/public/Header";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { defaultMetadata } from "@/lib/metadata";
import { getOrganizationSchema, getWebSiteSchema, renderJsonLd } from "@/lib/seo";

const jakartaSans = Plus_Jakarta_Sans({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const nsiSerif = Newsreader({
  variable: "--font-nsi-serif",
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = defaultMetadata as Metadata;

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#062315" },
    { media: "(prefers-color-scheme: dark)", color: "#062315" },
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
        className={`${jakartaSans.variable} ${jetbrainsMono.variable} ${nsiSerif.variable} antialiased relative min-h-screen selection:bg-[color:var(--nsi-green)] selection:text-white`}
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
