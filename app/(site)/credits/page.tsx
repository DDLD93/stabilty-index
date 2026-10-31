import type { Metadata } from "next";
import Image from "next/image";
import { Container } from "@/components/ui/Layout";
import { PageHeader } from "@/components/ui/PageHeader";
import { defaultMetadata } from "@/lib/metadata";
import { photos } from "@/lib/photos";

export const metadata: Metadata = {
  ...defaultMetadata,
  title: "Photo credits",
  description: "Credits and licences for the photographs used on the Nigeria Stability Index website.",
  alternates: { canonical: "/credits" },
};

export default function CreditsPage() {
  const list = Object.values(photos);
  return (
    <>
      <PageHeader
        crumbs={[{ href: "/", label: "Home" }, { label: "Photo credits" }]}
        title="Photo credits"
        lede="The photographs on this site were taken by photographers across Nigeria and shared under open licences on Wikimedia Commons. They show everyday places and people; none of them shows a survey respondent, a nominee or an honoree."
      />
      <Container className="py-10 sm:py-14">
        <ul className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((p) => (
            <li key={p.src}>
              <div className="relative aspect-[3/2] overflow-hidden bg-surface">
                <Image src={p.src} alt={p.alt} fill sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw" className="object-cover" />
              </div>
              <p className="mt-3 font-semibold text-ink">{p.caption}</p>
              <p className="mt-1 text-small text-ink-2">
                <a href={p.credit.page} target="_blank" rel="noopener" className="text-brand underline underline-offset-[0.22em]">
                  “{p.credit.title}”
                </a>{" "}
                by {p.credit.creator},{" "}
                <a href={p.credit.licenseUrl} target="_blank" rel="noopener license" className="underline underline-offset-[0.22em]">
                  {p.credit.license}
                </a>
                , via Wikimedia Commons. Resized for the web.
              </p>
            </li>
          ))}
        </ul>
      </Container>
    </>
  );
}
