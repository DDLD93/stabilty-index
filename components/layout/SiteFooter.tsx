import Link from "next/link";
import {
  NSIShieldMark,
  SocialInstagramIcon,
  SocialTikTokIcon,
  SocialXIcon,
} from "@/components/public/icons";

const SOCIAL = [
  { href: "https://x.com/Nigeria_NSI", label: "X (Twitter)", Icon: SocialXIcon },
  {
    href: "https://www.instagram.com/nigeriastabilityindex",
    label: "Instagram",
    Icon: SocialInstagramIcon,
  },
  {
    href: "https://www.tiktok.com/@nigeria_nsi",
    label: "TikTok",
    Icon: SocialTikTokIcon,
  },
] as const;

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t-4 border-[color:var(--nsi-gold)] bg-[color:var(--nsi-green-deep)] text-white">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-12 border-b border-white/12 pb-12 md:grid-cols-2 lg:grid-cols-12">
          {/* Column 1: Institutional Identity (5 cols) */}
          <div className="lg:col-span-5">
            <div className="flex items-center gap-3.5">
              <NSIShieldMark className="h-10 w-10 shrink-0" />
              <div>
                <div className="font-serif text-xl font-bold tracking-tight text-white">
                  Nigeria Stability Index (NSI)
                </div>
                <div className="font-mono text-[0.65rem] uppercase tracking-[0.14em] text-[color:var(--nsi-gold-light)]">
                  Independent Civic Research &amp; Data Platform
                </div>
              </div>
            </div>
            <p className="mt-5 max-w-md text-sm leading-relaxed text-white/75">
              Tracking how Nigeria holds together through structured monthly
              assessments across Security, FX &amp; Economy, Investor Confidence,
              Governance, and Social Stability. Non-partisan, evidence-led, and
              citizen-informed.
            </p>
            <div className="mt-6 flex items-center gap-3">
              {SOCIAL.map(({ href, label, Icon }) => (
                <Link
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-[3px] border border-white/15 bg-white/5 text-white/80 transition-colors hover:border-[color:var(--nsi-gold)] hover:bg-[color:var(--nsi-gold)] hover:text-[color:var(--nsi-ink)]"
                  aria-label={label}
                >
                  <Icon className="h-4 w-4" />
                </Link>
              ))}
            </div>
          </div>

          {/* Column 2: Publications & Data (2 cols) */}
          <div className="lg:col-span-2">
            <h3 className="font-mono text-xs font-bold uppercase tracking-widest text-[color:var(--nsi-gold-light)]">
              Publications
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm text-white/80">
              <li>
                <Link className="transition-colors hover:text-white hover:underline" href="/reports">
                  Reports Archive
                </Link>
              </li>
              <li>
                <Link className="transition-colors hover:text-white hover:underline" href="/spotlights">
                  State &amp; Institution Spotlights
                </Link>
              </li>
              <li>
                <Link className="transition-colors hover:text-white hover:underline" href="/survey">
                  Monthly Citizen Survey
                </Link>
              </li>
              <li>
                <Link className="transition-colors hover:text-white hover:underline" href="/subscribe">
                  Executive Dispatch
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Governance & Framework (2 cols) */}
          <div className="lg:col-span-2">
            <h3 className="font-mono text-xs font-bold uppercase tracking-widest text-[color:var(--nsi-gold-light)]">
              Framework
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm text-white/80">
              <li>
                <Link className="transition-colors hover:text-white hover:underline" href="/about">
                  About the Index
                </Link>
              </li>
              <li>
                <Link className="transition-colors hover:text-white hover:underline" href="/methodology">
                  Research Methodology
                </Link>
              </li>
              <li>
                <Link className="transition-colors hover:text-white hover:underline" href="/how-it-works">
                  How NSI Works
                </Link>
              </li>
              <li>
                <Link className="transition-colors hover:text-white hover:underline" href="/privacy">
                  Privacy &amp; Anonymity
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Institutional Attribution (3 cols) */}
          <div className="lg:col-span-3">
            <h3 className="font-mono text-xs font-bold uppercase tracking-widest text-[color:var(--nsi-gold-light)]">
              Institutional Desk
            </h3>
            <div className="mt-4 rounded-[4px] border border-white/12 bg-white/[0.04] p-4">
              <div className="font-mono text-[0.65rem] uppercase tracking-widest text-white/55">
                An Initiative Of
              </div>
              <div className="mt-1 font-serif text-lg font-bold text-white">
                The 24 Angels Initiative
              </div>
              <p className="mt-2 text-xs leading-relaxed text-white/65">
                Committed to calm, empirical public-interest reporting on Nigerian
                institutional resilience and civic well-being.
              </p>
              <div className="mt-4 border-t border-white/10 pt-3">
                <Link
                  href="/contact"
                  className="font-mono text-xs font-semibold uppercase tracking-wider text-[color:var(--nsi-gold-light)] hover:underline"
                >
                  Contact Research Desk →
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Colophon */}
        <div className="mt-8 flex flex-col gap-4 text-xs text-white/55 sm:flex-row sm:items-center sm:justify-between">
          <div>
            © {new Date().getFullYear()} Nigeria Stability Index (NSI). All rights
            reserved. Non-partisan · Non-advocacy.
          </div>
          <div className="flex flex-wrap items-center gap-6 font-mono text-[0.7rem]">
            <span>WWW.NIGERIASTABILITYINDEX.ORG</span>
            <span>ISSN-PENDING · NIGERIA</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
