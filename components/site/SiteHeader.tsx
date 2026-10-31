import { BrandLockup } from "@/components/site/BrandLockup";
import { NavLinks } from "@/components/site/NavLinks";
import { MobileMenu } from "@/components/site/MobileMenu";
import { LinkButton } from "@/components/ui/Button";
import { getHeaderCycle, monthOnly } from "@/lib/sitePhase";

export async function SiteHeader() {
  const cycle = await getHeaderCycle();
  const month = monthOnly(cycle.monthYear);
  const action = cycle.open
    ? { href: "/survey", label: month ? `Take the ${month} survey` : "Take the survey" }
    : { href: "/reports", label: "Read the latest report" };

  return (
    <header className="no-print sticky top-0 z-40 border-b border-line bg-ground">
      <div className="mx-auto box-content flex h-16 max-w-page items-center justify-between gap-4 px-gutter lg:h-[4.75rem]">
        <BrandLockup />
        <nav aria-label="Main" className="hidden lg:block">
          <NavLinks />
        </nav>
        <div className="flex items-center gap-2">
          <LinkButton href={action.href} size="sm" className="hidden sm:inline-flex">
            {action.label}
          </LinkButton>
          <MobileMenu action={action} />
        </div>
      </div>
    </header>
  );
}
