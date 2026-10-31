import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { NotFoundContent } from "./(site)/not-found";

// Unmatched URLs render outside the (site) layout, so this adds the site chrome itself.
export default function RootNotFound() {
  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />
      <main id="main" className="flex-1">
        <NotFoundContent />
      </main>
      <SiteFooter />
    </div>
  );
}
