import * as React from "react";

type IconProps = React.SVGProps<SVGSVGElement> & {
  title?: string;
  className?: string;
};

/**
 * Official Nigeria Stability Index Emblem Mark
 * Displays the transparent gold relief map + NSI monogram + 5-point star + emerald wave.
 */
export function NSIShieldMark({ title = "Nigeria Stability Index", className, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 1259 818"
      width="48"
      height="32"
      className={className}
      aria-hidden={title ? undefined : true}
      role={title ? "img" : "presentation"}
      {...props}
    >
      {title ? <title>{title}</title> : null}
      <image
        href="/nsi-emblem.webp"
        width="1259"
        height="818"
        preserveAspectRatio="xMidYMid meet"
      />
    </svg>
  );
}

export function NSIBadgeLogo({ className, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 1259 818"
      className={className}
      role="img"
      aria-label="Nigeria Stability Index Official Emblem"
      {...props}
    >
      <title>Nigeria Stability Index</title>
      <image
        href="/nsi-emblem.webp"
        width="1259"
        height="818"
        preserveAspectRatio="xMidYMid meet"
      />
    </svg>
  );
}

function BasePillarIcon({ title, children, ...props }: IconProps & { children: React.ReactNode }) {
  return (
    <svg viewBox="0 0 64 64" width="40" height="40" role="img" aria-label={title} {...props}>
      <title>{title}</title>
      {children}
    </svg>
  );
}

export function PillarSecurityIcon(props: IconProps) {
  return (
    <BasePillarIcon title="Security & Public Safety" {...props}>
      <rect x="4" y="4" width="56" height="56" rx="8" fill="rgba(0, 245, 155, 0.08)" stroke="rgba(0, 245, 155, 0.25)" strokeWidth="1.5" />
      <path
        d="M32 12L50 19V32C50 43.5 42.5 50.5 32 54C21.5 50.5 14 43.5 14 32V19L32 12Z"
        fill="rgba(0, 245, 155, 0.15)"
        stroke="#00f59b"
        strokeWidth="2"
      />
      <circle cx="32" cy="31" r="5" fill="#f59e0b" />
      <path d="M32 20V24M32 38V42M21 31H25M39 31H43" stroke="#00f59b" strokeWidth="2" strokeLinecap="round" />
    </BasePillarIcon>
  );
}

export function PillarEconomyIcon(props: IconProps) {
  return (
    <BasePillarIcon title="FX, Inflation & Macro Economy" {...props}>
      <rect x="4" y="4" width="56" height="56" rx="8" fill="rgba(245, 158, 11, 0.08)" stroke="rgba(245, 158, 11, 0.25)" strokeWidth="1.5" />
      <path
        d="M14 46L24 34L34 40L50 20"
        fill="none"
        stroke="#f59e0b"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <polyline points="42 20 50 20 50 28" fill="none" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="24" cy="34" r="3" fill="#00f59b" />
      <circle cx="34" cy="40" r="3" fill="#00f59b" />
      <circle cx="50" cy="20" r="3" fill="#fbbf24" />
      <line x1="14" y1="50" x2="50" y2="50" stroke="rgba(245, 158, 11, 0.3)" strokeWidth="1.5" strokeDasharray="3 3" />
    </BasePillarIcon>
  );
}

export function PillarInvestorIcon(props: IconProps) {
  return (
    <BasePillarIcon title="Investor Confidence & Capital Flows" {...props}>
      <rect x="4" y="4" width="56" height="56" rx="8" fill="rgba(56, 189, 248, 0.08)" stroke="rgba(56, 189, 248, 0.25)" strokeWidth="1.5" />
      <circle cx="32" cy="32" r="16" fill="none" stroke="rgba(56, 189, 248, 0.3)" strokeWidth="1.5" strokeDasharray="4 3" />
      <path
        d="M20 38L28 28L36 34L44 24"
        fill="none"
        stroke="#38bdf8"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <circle cx="32" cy="32" r="6" fill="rgba(0, 245, 155, 0.2)" stroke="#00f59b" strokeWidth="2" />
      <path d="M32 10V14M32 50V54M10 32H14M50 32H54" stroke="#38bdf8" strokeWidth="1.5" />
    </BasePillarIcon>
  );
}

export function PillarGovernanceIcon(props: IconProps) {
  return (
    <BasePillarIcon title="Governance, Rule of Law & Transparency" {...props}>
      <rect x="4" y="4" width="56" height="56" rx="8" fill="rgba(168, 85, 247, 0.08)" stroke="rgba(168, 85, 247, 0.25)" strokeWidth="1.5" />
      <path d="M14 26L32 16L50 26V28H14V26Z" fill="#a855f7" />
      <line x1="20" y1="30" x2="20" y2="46" stroke="#a855f7" strokeWidth="2.5" />
      <line x1="28" y1="30" x2="28" y2="46" stroke="#00f59b" strokeWidth="2.5" />
      <line x1="36" y1="30" x2="36" y2="46" stroke="#00f59b" strokeWidth="2.5" />
      <line x1="44" y1="30" x2="44" y2="46" stroke="#a855f7" strokeWidth="2.5" />
      <rect x="12" y="46" width="40" height="4" fill="#a855f7" rx="1" />
    </BasePillarIcon>
  );
}

export function PillarSocialIcon(props: IconProps) {
  return (
    <BasePillarIcon title="Social Cohesion & Public Sentiment" {...props}>
      <rect x="4" y="4" width="56" height="56" rx="8" fill="rgba(0, 245, 155, 0.08)" stroke="rgba(0, 245, 155, 0.25)" strokeWidth="1.5" />
      <circle cx="24" cy="26" r="6" fill="#00f59b" />
      <circle cx="40" cy="26" r="6" fill="#f59e0b" />
      <path d="M14 46C14 39 19 36 26 36C30 36 33 37.5 35 40" fill="none" stroke="#00f59b" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M29 46C31 42 35 39 42 39C48 39 52 42 52 46" fill="none" stroke="#f59e0b" strokeWidth="2.2" strokeLinecap="round" />
      <circle cx="32" cy="46" r="2.5" fill="#38bdf8" />
    </BasePillarIcon>
  );
}

/**
 * High-tech Observatory Pillar Radar / Visual Hologram
 */
export function PillarEditorialGraphic({
  title,
  score,
  className,
}: {
  title: string;
  score?: number;
  className?: string;
}) {
  const t = title.toLowerCase();
  const isSecurity = t.includes("sec");
  const isEcon = t.includes("econ") || t.includes("fx");
  const isInvest = t.includes("invest");
  const isGov = t.includes("gov");

  const primaryColor = isSecurity ? "#00f59b" : isEcon ? "#f59e0b" : isInvest ? "#38bdf8" : isGov ? "#a855f7" : "#00f59b";

  return (
    <svg
      viewBox="0 0 240 120"
      className={className ?? "w-full h-full"}
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <radialGradient id={`glow-${title}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={primaryColor} stopOpacity="0.25" />
          <stop offset="100%" stopColor={primaryColor} stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect width="240" height="120" fill="transparent" />
      <circle cx="120" cy="60" r="50" fill={`url(#glow-${title})`} />
      <circle cx="120" cy="60" r="42" fill="none" stroke={primaryColor} strokeWidth="1" strokeOpacity="0.25" strokeDasharray="3 3" />
      <circle cx="120" cy="60" r="26" fill="none" stroke={primaryColor} strokeWidth="1.2" strokeOpacity="0.4" />
      <line x1="60" y1="60" x2="180" y2="60" stroke={primaryColor} strokeWidth="0.8" strokeOpacity="0.2" />
      <line x1="120" y1="15" x2="120" y2="105" stroke={primaryColor} strokeWidth="0.8" strokeOpacity="0.2" />

      {/* Dynamic Data Glyph */}
      {isSecurity && (
        <g transform="translate(120, 60)">
          <path d="M0 -22 L18 -13 V4 C18 16 9 23 0 26 C-9 23 -18 16 -18 4 V-13 Z" fill="rgba(0, 245, 155, 0.15)" stroke="#00f59b" strokeWidth="2" />
          <circle r="4" fill="#f59e0b" />
        </g>
      )}

      {isEcon && (
        <g transform="translate(120, 60)">
          <path d="M-22 14 L-8 0 L6 8 L22 -14" fill="none" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" />
          <polyline points="14 -14 22 -14 22 -6" fill="none" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="6" cy="8" r="3" fill="#00f59b" />
        </g>
      )}

      {isInvest && (
        <g transform="translate(120, 60)">
          <circle r="18" fill="none" stroke="#38bdf8" strokeWidth="2" strokeDasharray="4 2" />
          <polygon points="0,-12 10,8 -10,8" fill="rgba(56, 189, 248, 0.25)" stroke="#38bdf8" strokeWidth="1.5" />
        </g>
      )}

      {isGov && (
        <g transform="translate(120, 60)">
          <path d="M-20 -8 L0 -18 L20 -8 Z" fill="#a855f7" />
          <rect x="-16" y="-6" width="5" height="18" fill="#a855f7" />
          <rect x="-4" y="-6" width="8" height="18" fill="#00f59b" />
          <rect x="11" y="-6" width="5" height="18" fill="#a855f7" />
          <rect x="-22" y="12" width="44" height="4" fill="#a855f7" rx="1" />
        </g>
      )}

      {!isSecurity && !isEcon && !isInvest && !isGov && (
        <g transform="translate(120, 60)">
          <circle cx="-10" cy="-6" r="7" fill="#00f59b" />
          <circle cx="10" cy="-6" r="7" fill="#f59e0b" />
          <path d="M-18 16 C-18 8 -8 6 0 6 C8 6 18 8 18 16" fill="none" stroke="#00f59b" strokeWidth="2" strokeLinecap="round" />
        </g>
      )}

      {typeof score === "number" && (
        <text
          x="230"
          y="22"
          textAnchor="end"
          fontSize="11"
          fontWeight="700"
          fontFamily="monospace"
          fill={primaryColor}
        >
          {score.toFixed(1)}/10
        </text>
      )}
    </svg>
  );
}

/**
 * Interactive Holographic Nigeria Geopolitical Map
 */
export function NigeriaMapSilhouette(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 240 200"
      fill="currentColor"
      role="img"
      aria-label="Nigeria Geopolitical Map Observatory"
      {...props}
    >
      <path
        d="M32 64 C28 48 38 34 52 28 C68 22 84 32 98 24 C112 16 126 12 142 16 C162 20 178 36 196 46 C210 54 228 66 226 84 C224 102 208 114 196 128 C184 140 180 158 164 166 C148 174 136 168 124 178 C112 188 96 194 82 186 C68 178 64 160 52 152 C40 144 26 142 22 128 C18 114 26 102 28 88 C30 76 34 68 32 64 Z"
        fill="currentColor"
        fillOpacity="0.08"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeOpacity="0.3"
      />
      {/* Geopolitical Grid Lat/Long */}
      <line x1="20" y1="100" x2="220" y2="100" stroke="currentColor" strokeWidth="0.8" strokeOpacity="0.15" strokeDasharray="3 3" />
      <line x1="120" y1="20" x2="120" y2="180" stroke="currentColor" strokeWidth="0.8" strokeOpacity="0.15" strokeDasharray="3 3" />

      {/* Geopolitical Nodes */}
      {/* FCT ABUJA */}
      <circle cx="120" cy="100" r="5" fill="#f59e0b" />
      <circle cx="120" cy="100" r="10" fill="none" stroke="#f59e0b" strokeWidth="1" strokeOpacity="0.5">
        <animate attributeName="r" values="6;14;6" dur="3s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.8;0.1;0.8" dur="3s" repeatCount="indefinite" />
      </circle>
      <text x="130" y="104" fontSize="8" fontFamily="monospace" fontWeight="700" fill="#fbbf24">FCT ABUJA</text>

      {/* LAGOS */}
      <circle cx="48" cy="148" r="4.5" fill="#00f59b" />
      <text x="56" y="152" fontSize="7.5" fontFamily="monospace" fontWeight="700" fill="#00f59b">LAGOS</text>

      {/* KANO */}
      <circle cx="128" cy="46" r="4" fill="#38bdf8" />
      <text x="136" y="49" fontSize="7.5" fontFamily="monospace" fontWeight="700" fill="#38bdf8">KANO</text>

      {/* PORT HARCOURT */}
      <circle cx="114" cy="164" r="4" fill="#a855f7" />
      <text x="122" y="167" fontSize="7.5" fontFamily="monospace" fontWeight="700" fill="#a855f7">PORT HARCOURT</text>
      
      {/* MAIDUGURI */}
      <circle cx="204" cy="56" r="3.5" fill="#f43f5e" />
      <text x="160" y="52" fontSize="7.5" fontFamily="monospace" fontWeight="700" fill="#f43f5e">MAIDUGURI</text>
    </svg>
  );
}

export function SocialXIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

export function SocialInstagramIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  );
}

export function SocialTikTokIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
    </svg>
  );
}
