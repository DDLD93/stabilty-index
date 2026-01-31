import { Metadata } from "next";

/**
 * Centralized metadata configuration for Nigeria Stability Index
 */

export const siteConfig = {
  name: "Nigeria Stability Index",
  shortName: "NSI",
  description: "A calm snapshot of how Nigeria is holding together. Tracking stability through security, economy, governance, investor confidence, and social stability.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://www.nigeriastabilityIndex.ng",
  ogImage: "/assetes/NSI_logo_web_1200w.png",
  favicon: "/assetes/nsi-favicon.ico",
  author: {
    name: "Nigeria Stability Index",
    organization: "'24 Angels Initiative",
  },
  keywords: [
    "Nigeria",
    "stability index",
    "Nigeria stability",
    "economic stability",
    "security",
    "governance",
    "investor confidence",
    "social stability",
    "Nigeria news",
    "Nigeria analysis",
  ],
  social: {
    twitter: {
      handle: "@NigeriaStabilityIndex", // Update with actual handle
      site: "@NigeriaStabilityIndex",
    },
    facebook: "https://www.facebook.com/NigeriaStabilityIndex", // Update with actual URL
    linkedin: "https://www.linkedin.com/company/nigeria-stability-index", // Update with actual URL
    youtube: "https://www.youtube.com/@NigeriaStabilityIndex", // Update with actual URL
  },
} as const;

export const defaultMetadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [...siteConfig.keywords],
  authors: [{ name: siteConfig.author.name }],
  creator: siteConfig.author.name,
  publisher: siteConfig.author.organization,
  metadataBase: new URL(siteConfig.url),
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: [
      { url: "/assetes/nsi-favicon.ico", type: "image/x-icon" },
      { url: "/assetes/nsi-favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/assetes/nsi-favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/assetes/nsi-favicon-48x48.png", sizes: "48x48", type: "image/png" },
      { url: "/assetes/nsi-favicon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: "/assetes/nsi-favicon-180x180.png",
  },
  openGraph: {
    type: "website",
    locale: "en_NG",
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: siteConfig.name,
    description: siteConfig.description,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
    creator: siteConfig.social.twitter.handle,
    site: siteConfig.social.twitter.site,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    // Add verification codes when available
    // google: "your-google-verification-code",
    // yandex: "your-yandex-verification-code",
    // bing: "your-bing-verification-code",
  },
};
