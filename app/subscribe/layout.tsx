import type { Metadata } from "next";
import { defaultMetadata } from "@/lib/metadata";

export const metadata: Metadata = {
  ...defaultMetadata,
  title: "Subscribe",
  description:
    "Subscribe to the Nigeria Stability Index for monthly updates and new report releases. Stay informed about Nigeria's stability across security, economy, governance, investor confidence, and social stability.",
  openGraph: {
    ...defaultMetadata.openGraph,
    title: "Subscribe to Nigeria Stability Index",
    description:
      "Subscribe for monthly updates and new report releases from the Nigeria Stability Index.",
    url: `${defaultMetadata.metadataBase}subscribe`,
  },
  alternates: {
    canonical: "/subscribe",
  },
};

export default function SubscribeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
