import type { Metadata } from "next";
import { NominationWizard } from "@/components/honors/NominationWizard";
import { LinkButton } from "@/components/ui/Button";
import { Figure } from "@/components/ui/Figure";
import { Container } from "@/components/ui/Layout";
import { Breadcrumb, EmptyState } from "@/components/ui/PageHeader";
import { isNominationsOpen } from "@/lib/honors/phase";
import { getPublicEdition } from "@/lib/honors/queries";
import { defaultMetadata } from "@/lib/metadata";
import { photos } from "@/lib/photos";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  ...defaultMetadata,
  title: "Make a nomination: NSI Honors 2026",
  description: "Nominate an institution, state or LGA, organisation or person for NSI Honors 2026.",
  alternates: { canonical: "/honors/nominate" },
};

type Props = { searchParams: Promise<{ category?: string; ref?: string }> };

export default async function NominatePage({ searchParams }: Props) {
  const { category, ref } = await searchParams;
  const edition = await getPublicEdition();
  const open = edition ? isNominationsOpen(edition) : false;

  return (
    <Container className="pt-8 pb-16 sm:pt-10 sm:pb-24">
      <Breadcrumb
        items={[{ href: "/", label: "Home" }, { href: "/honors", label: "NSI Honors" }, { label: "Nominate" }]}
        className="mb-6"
      />
      <h1 className="text-h2">Make a nomination</h1>
      <p className="mt-3 max-w-2xl text-body text-ink-2">
        It takes about five minutes. You’ll need the nominee’s name, what they did in 2026, and ideally a link or two to
        evidence.
      </p>

      <div className="mt-10 grid gap-12 lg:grid-cols-[minmax(0,40rem)_minmax(0,1fr)] lg:gap-14">
        {open && edition ? (
          <NominationWizard
            editionTitle={edition.title}
            initialCategorySlug={category ?? null}
            refParam={ref ?? null}
            categories={edition.categories.map((c) => ({
              id: c.id,
              slug: c.slug,
              name: c.name,
              shortDescription: c.shortDescription,
              allowedNomineeTypes: c.allowedNomineeTypes,
            }))}
          />
        ) : (
          <EmptyState
            className="max-w-[40rem]"
            title="Nominations aren’t open right now"
            action={
              <div className="flex flex-wrap gap-3">
                <LinkButton href="/subscribe">Get an email when they open</LinkButton>
                <LinkButton href="/honors" variant="secondary">
                  About NSI Honors
                </LinkButton>
              </div>
            }
          >
            Dates for each stage are posted on the NSI Honors page as soon as they are set.
          </EmptyState>
        )}
        <div className="hidden lg:block">
          <div className="sticky top-28">
            <Figure photo={photos.healthCentre} sizes="(min-width: 1024px) 35vw, 0px" aspect="4/5" />
          </div>
        </div>
      </div>
    </Container>
  );
}
