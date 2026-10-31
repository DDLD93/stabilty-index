import Link from "next/link";
import { SocialInstagramIcon, SocialTikTokIcon, SocialXIcon } from "@/components/public/icons";
import { BrandLockup } from "@/components/site/BrandLockup";

const SOCIAL = [
  { href: "https://x.com/Nigeria_NSI", label: "X", handle: "@Nigeria_NSI", Icon: SocialXIcon },
  { href: "https://www.instagram.com/nigeriastabilityindex", label: "Instagram", handle: "nigeriastabilityindex", Icon: SocialInstagramIcon },
  { href: "https://www.tiktok.com/@nigeria_nsi", label: "TikTok", handle: "@nigeria_nsi", Icon: SocialTikTokIcon },
] as const;

const GROUPS = [
  {
    title: "The index",
    links: [
      { href: "/reports", label: "Monthly reports" },
      { href: "/spotlights", label: "Spotlights" },
      { href: "/methodology", label: "Methodology" },
    ],
  },
  {
    title: "Take part",
    links: [
      { href: "/survey", label: "Monthly survey" },
      { href: "/honors", label: "NSI Honors 2026" },
      { href: "/subscribe", label: "Email updates" },
    ],
  },
  {
    title: "Organisation",
    links: [
      { href: "/about", label: "About NSI" },
      { href: "/contact", label: "Contact" },
      { href: "/privacy", label: "Privacy" },
      { href: "/credits", label: "Photo credits" },
    ],
  },
] as const;

export function SiteFooter() {
  return (
    <footer className="no-print border-t border-line bg-surface">
      <div className="mx-auto box-content max-w-page px-gutter pt-14 pb-10">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,2fr)] lg:gap-16">
          <div className="max-w-sm">
            <BrandLockup />
            <p className="mt-4 text-small text-ink-2">
              An independent monthly reading of how Nigeria is holding together, published on the 11th.
              A project of the 24 Angels Initiative.
            </p>
            <p className="mt-4 text-small">
              <a href="mailto:info@nigeriastabilityindex.ng" className="text-brand underline">
                info@nigeriastabilityindex.ng
              </a>
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            {GROUPS.map((group) => (
              <div key={group.title}>
                <h2 className="font-sans text-small font-semibold text-ink">{group.title}</h2>
                <ul className="mt-3 flex flex-col">
                  {group.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="flex min-h-11 items-center text-small text-ink-2 hover:text-ink hover:underline"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-6 border-t border-line pt-6 md:flex-row md:items-center md:justify-between">
          <ul className="flex flex-wrap gap-x-2 gap-y-1">
            {SOCIAL.map(({ href, label, handle, Icon }) => (
              <li key={label}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex min-h-11 items-center gap-2 rounded-control pr-3 text-small text-ink-2 hover:text-ink"
                >
                  <Icon aria-hidden className="size-5" />
                  <span>
                    <span className="sr-only">{label}: </span>
                    {handle}
                  </span>
                </a>
              </li>
            ))}
          </ul>
          <p className="text-meta text-ink-3">
            © {new Date().getFullYear()} Nigeria Stability Index · nigeriastabilityindex.ng
          </p>
        </div>
      </div>
    </footer>
  );
}
