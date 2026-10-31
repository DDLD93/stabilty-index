import type { Metadata, Viewport } from "next";
// Self-hosted Adobe Source faces (bundled at build, no font CDN at runtime).
// Their Latin Extended and Vietnamese subsets carry Yoruba, Igbo and Hausa letters (ẹ ọ ṣ ɓ ɗ ƙ).
import "@fontsource-variable/source-sans-3";
import "@fontsource-variable/source-sans-3/wght-italic.css";
import "@fontsource-variable/source-serif-4/opsz.css";
import "./globals.css";
import { defaultMetadata } from "@/lib/metadata";
import { getOrganizationSchema, getWebSiteSchema, renderJsonLd } from "@/lib/seo";

export const metadata: Metadata = defaultMetadata as Metadata;

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ffffff",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-NG">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: renderJsonLd(getOrganizationSchema()) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: renderJsonLd(getWebSiteSchema()) }}
        />
      </head>
      <body className="min-h-dvh">{children}</body>
    </html>
  );
}
