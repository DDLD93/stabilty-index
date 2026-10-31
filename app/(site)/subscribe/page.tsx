import type { Metadata } from "next";
import { SubscribeForm } from "@/components/public/SubscribeForm";
import { Figure } from "@/components/ui/Figure";
import { Container } from "@/components/ui/Layout";
import { PageHeader } from "@/components/ui/PageHeader";
import { defaultMetadata } from "@/lib/metadata";
import { photos } from "@/lib/photos";

export const metadata: Metadata = {
  ...defaultMetadata,
  title: "Email updates",
  description: "Get each monthly Nigeria Stability Index report and a reminder when the survey opens.",
  alternates: { canonical: "/subscribe" },
};

export default function SubscribePage() {
  return (
    <>
      <PageHeader
        crumbs={[{ href: "/", label: "Home" }, { label: "Email updates" }]}
        title="Get the index by email"
        lede="A short email when each monthly report is published on the 11th, and a reminder when the survey opens. NSI Honors news too, while nominations and voting are open."
      />
      <Container className="py-10 sm:py-14">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-start lg:gap-16">
          <div className="max-w-xl">
            <SubscribeForm />
            <ul className="mt-10 flex list-disc flex-col gap-2 pl-5 text-body text-ink-2">
              <li>We send a confirmation link first, so no one can sign you up without your say.</li>
              <li>We store your email address and when you confirmed it. Nothing else.</li>
            </ul>
          </div>
          <Figure photo={photos.newspaperVendor} sizes="(min-width: 1024px) 45vw, 100vw" aspect="4/3" />
        </div>
      </Container>
    </>
  );
}
