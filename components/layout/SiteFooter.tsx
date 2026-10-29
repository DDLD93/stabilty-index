import Link from "next/link";
import Image from "next/image";
import {
  SocialInstagramIcon,
  SocialTikTokIcon,
  SocialXIcon,
} from "@/components/public/icons";

const SOCIAL = [
  { href: "https://x.com/Nigeria_NSI", label: "X / Twitter", Icon: SocialXIcon },
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
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative mt-24 border-t border-[#00f59b]/15 bg-[#030906] text-slate-300 overflow-hidden">
      {/* Ambient background glows */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -bottom-24 left-1/4 h-80 w-80 rounded-full bg-[#00f59b]/5 blur-3xl" />
        <div className="absolute top-0 right-1/4 h-64 w-64 rounded-full bg-[#f59e0b]/5 blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#00f59b06_1px,transparent_1px),linear-gradient(to_bottom,#00f59b06_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_100%,#000_70%,transparent_100%)]" />
      </div>

      <div className="mx-auto max-w-7xl px-6 py-16">
        {/* Top Grid: Brand, Mission, Quick Links, Initiative */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          {/* Brand & Geo Column */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              <Link href="/" className="inline-flex items-center gap-3.5 group">
                <div className="relative flex h-12 w-12 items-center justify-center rounded-xl border border-[#00f59b]/30 bg-[#07170e] p-1.5 shadow-[0_0_20px_rgba(0,245,155,0.2)] transition-all duration-300 group-hover:border-[#00f59b] group-hover:shadow-[0_0_28px_rgba(0,245,155,0.4)]">
                  <Image
                    src="/nsi-emblem.webp"
                    alt="Nigeria Stability Index"
                    width={40}
                    height={40}
                    className="object-contain"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-serif text-lg font-bold tracking-tight text-white group-hover:text-[#00f59b] transition-colors">
                      NIGERIA STABILITY INDEX
                    </span>
                    <span className="rounded bg-[#00f59b]/15 px-1.5 py-0.5 text-[9px] font-mono font-bold tracking-wider text-[#00f59b] uppercase border border-[#00f59b]/30">
                      NSI-OBS
                    </span>
                  </div>
                  <p className="text-[11px] font-mono tracking-widest text-[#94a3b8] uppercase">
                    National Observability Framework
                  </p>
                </div>
              </Link>

              <p className="mt-5 max-w-md text-sm leading-relaxed text-[#94a3b8]">
                Beyond political noise and media sensationalism: an autonomous, multi-pillar empirical 
                pulse calibrating Nigeria&apos;s security matrix, foreign exchange equilibrium, governance sentiment, 
                and street-level social cohesion.
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-3 font-mono text-[11px] text-[#64748b]">
                <span className="inline-flex items-center gap-1.5 rounded-md border border-[#00f59b]/20 bg-[#07140d] px-2.5 py-1 text-[#00f59b]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#00f59b] animate-pulse" />
                  LAT 09°04′N · LONG 07°29′E
                </span>
                <span className="rounded-md border border-white/5 bg-[#08120b] px-2.5 py-1 text-slate-400">
                  ABUJA FCT HQ
                </span>
                <span className="rounded-md border border-white/5 bg-[#08120b] px-2.5 py-1 text-[#f59e0b]">
                  5-PILLAR CALIBRATION
                </span>
              </div>
            </div>

            <div className="mt-8 flex items-center gap-4">
              {SOCIAL.map(({ href, label, Icon }) => (
                <Link
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#00f59b]/20 bg-[#07170e]/80 text-[#94a3b8] transition-all duration-300 hover:border-[#00f59b] hover:text-[#00f59b] hover:shadow-[0_0_15px_rgba(0,245,155,0.3)] hover:-translate-y-0.5"
                  aria-label={label}
                >
                  <Icon className="h-4 w-4" />
                </Link>
              ))}
            </div>
          </div>

          {/* Navigation Columns */}
          <div className="lg:col-span-4 grid grid-cols-2 gap-8">
            <div>
              <h4 className="font-mono text-xs font-semibold uppercase tracking-wider text-[#00f59b]">
                Intelligence
              </h4>
              <ul className="mt-4 space-y-2.5 text-sm">
                <li>
                  <Link href="/reports" className="text-slate-400 hover:text-white transition-colors">
                    Monthly Snapshots
                  </Link>
                </li>
                <li>
                  <Link href="/methodology" className="text-slate-400 hover:text-white transition-colors">
                    Weighting Methodology
                  </Link>
                </li>
                <li>
                  <Link href="/survey" className="inline-flex items-center gap-1.5 text-slate-400 hover:text-[#00f59b] transition-colors">
                    <span>Citizen Telemetry</span>
                    <span className="rounded-full bg-[#00f59b]/20 px-1.5 py-0.2 text-[10px] font-mono text-[#00f59b]">LIVE</span>
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="text-slate-400 hover:text-white transition-colors">
                    Observatory Mission
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-mono text-xs font-semibold uppercase tracking-wider text-[#f59e0b]">
                Governance
              </h4>
              <ul className="mt-4 space-y-2.5 text-sm">
                <li>
                  <Link href="/contact" className="text-slate-400 hover:text-white transition-colors">
                    Field Bureau Contact
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="text-slate-400 hover:text-white transition-colors">
                    Data Privacy Charter
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="text-slate-400 hover:text-white transition-colors">
                    Institutional Neutrality
                  </Link>
                </li>
                <li>
                  <a
                    href="https://budgit.org"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-400 hover:text-white transition-colors inline-flex items-center gap-1"
                  >
                    <span>Civic Open Data</span>
                    <span className="text-[10px] text-slate-500">↗</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Sovereign Initiative Colophon */}
          <div className="lg:col-span-3 flex flex-col justify-between rounded-2xl border border-[#00f59b]/15 bg-[#07160e]/60 p-6 backdrop-blur-md">
            <div>
              <div className="font-mono text-[11px] font-semibold uppercase tracking-wider text-[#f59e0b]">
                Initiative Sponsorship
              </div>
              <div className="mt-3 font-serif text-xl font-bold tracking-tight text-white">
                THE 24 ANGELS INITIATIVE
              </div>
              <p className="mt-2 text-xs leading-relaxed text-[#94a3b8]">
                A civic philanthropic commitment to institutional transparency, factual governance audit, 
                and resilient democratic health across the 36 States and FCT.
              </p>
            </div>

            <div className="mt-6 pt-5 border-t border-[#00f59b]/10 flex items-center justify-between text-[11px] font-mono">
              <span className="text-slate-400">STATUS</span>
              <span className="inline-flex items-center gap-1.5 text-[#00f59b] font-medium">
                <span className="h-1.5 w-1.5 rounded-full bg-[#00f59b] animate-ping" />
                OBSERVATORY ONLINE
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Domain */}
        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-[#00f59b]/10 pt-8 sm:flex-row text-xs font-mono text-[#64748b]">
          <div>
            © {currentYear} Nigeria Stability Index (NSI). All rights reserved. Non-partisan civic public good.
          </div>
          <div className="flex items-center gap-3">
            <span className="h-1.5 w-1.5 rounded-full bg-[#00f59b]/40" />
            <span className="text-slate-400 hover:text-[#00f59b] transition-colors">
              www.NigeriaStabilityIndex.org
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
