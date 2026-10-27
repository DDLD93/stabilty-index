import * as React from "react";

type IconProps = React.SVGProps<SVGSVGElement> & {
  title?: string;
};

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
    <BasePillarIcon title="Security" {...props}>
      <rect x="6" y="6" width="52" height="52" rx="4" fill="#0b3b24" fillOpacity="0.07" />
      <path
        d="M32 11L50 17.5V31C50 42.8 42.2 50.2 32 54C21.8 50.2 14 42.8 14 31V17.5L32 11Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <path
        d="M32 18V46M21 31H43"
        stroke="#c88a2b"
        strokeWidth="2.75"
        strokeLinecap="round"
      />
      <circle cx="32" cy="31" r="4" fill="currentColor" />
    </BasePillarIcon>
  );
}

export function PillarEconomyIcon(props: IconProps) {
  return (
    <BasePillarIcon title="FX & Economy" {...props}>
      <rect x="6" y="6" width="52" height="52" rx="4" fill="#0b3b24" fillOpacity="0.07" />
      {/* Naira / Macro-economic bars */}
      <path
        d="M21 46V18L43 46V18"
        fill="none"
        stroke="currentColor"
        strokeWidth="3.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15 28H49M15 36H49"
        stroke="#c88a2b"
        strokeWidth="2.8"
        strokeLinecap="round"
      />
    </BasePillarIcon>
  );
}

export function PillarInvestorIcon(props: IconProps) {
  return (
    <BasePillarIcon title="Investor Confidence" {...props}>
      <rect x="6" y="6" width="52" height="52" rx="4" fill="#0b3b24" fillOpacity="0.07" />
      <path
        d="M14 48H50"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <rect x="17" y="34" width="6" height="14" fill="currentColor" opacity="0.35" />
      <rect x="29" y="27" width="6" height="21" fill="currentColor" opacity="0.65" />
      <rect x="41" y="19" width="6" height="29" fill="currentColor" />
      <path
        d="M16 30L28 22L36 26L48 14"
        fill="none"
        stroke="#c88a2b"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M41 14H48V21"
        fill="none"
        stroke="#c88a2b"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </BasePillarIcon>
  );
}

export function PillarGovernanceIcon(props: IconProps) {
  return (
    <BasePillarIcon title="Governance" {...props}>
      <rect x="6" y="6" width="52" height="52" rx="4" fill="#0b3b24" fillOpacity="0.07" />
      <path
        d="M12 24L32 13L52 24H12Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <line x1="18" y1="24" x2="18" y2="44" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <line x1="27" y1="24" x2="27" y2="44" stroke="#c88a2b" strokeWidth="3" strokeLinecap="round" />
      <line x1="37" y1="24" x2="37" y2="44" stroke="#c88a2b" strokeWidth="3" strokeLinecap="round" />
      <line x1="46" y1="24" x2="46" y2="44" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <path d="M12 45H52M10 50H54" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </BasePillarIcon>
  );
}

export function PillarSocialIcon(props: IconProps) {
  return (
    <BasePillarIcon title="Social Stability" {...props}>
      <rect x="6" y="6" width="52" height="52" rx="4" fill="#0b3b24" fillOpacity="0.07" />
      <circle cx="23" cy="23" r="6" fill="none" stroke="currentColor" strokeWidth="3" />
      <circle cx="41" cy="23" r="6" fill="none" stroke="#c88a2b" strokeWidth="3" />
      <path
        d="M12 46C13.8 38 19.5 34 27 34C34.5 34 40.2 38 42 46"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M33 34.5C35.2 33.8 37.5 33.5 39.8 33.5C45.8 33.5 50.5 37.5 52 46"
        fill="none"
        stroke="#c88a2b"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </BasePillarIcon>
  );
}

/**
 * Editorial Data-Infographic Emblem for Pillar Cards & Survey Wizard
 * Replaces pixelated/text-baked raster icons with crisp vector editorial artwork.
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
  const isSecurity = t.includes("security");
  const isEcon = t.includes("econom") || t.includes("fx");
  const isInvest = t.includes("invest");
  const isGov = t.includes("govern");

  return (
    <svg
      viewBox="0 0 240 120"
      className={className ?? "h-full w-full"}
      role="img"
      aria-label={title}
    >
      <defs>
        <pattern id={`grid-${t.replace(/\s+/g, "")}`} width="16" height="16" patternUnits="userSpaceOnUse">
          <path d="M 16 0 L 0 0 0 16" fill="none" stroke="#0b3b24" strokeWidth="0.5" strokeOpacity="0.08" />
        </pattern>
      </defs>
      <rect width="240" height="120" fill="#f6f4ee" />
      <rect width="240" height="120" fill={`url(#grid-${t.replace(/\s+/g, "")})`} />

      {/* Subtle architectural meridian lines */}
      <line x1="0" y1="60" x2="240" y2="60" stroke="#0b3b24" strokeWidth="0.75" strokeOpacity="0.12" strokeDasharray="3 3" />
      <line x1="120" y1="0" x2="120" y2="120" stroke="#0b3b24" strokeWidth="0.75" strokeOpacity="0.12" strokeDasharray="3 3" />

      {isSecurity && (
        <g transform="translate(120, 60)">
          <circle r="44" fill="#0b3b24" fillOpacity="0.05" stroke="#0b3b24" strokeWidth="1" strokeOpacity="0.2" />
          <circle r="32" fill="none" stroke="#c88a2b" strokeWidth="1" strokeDasharray="4 3" />
          <path
            d="M0 -28 L24 -19 V0 C24 16 14 26 0 32 C-14 26 -24 16 -24 0 V-19 Z"
            fill="#0b3b24"
            stroke="#c88a2b"
            strokeWidth="2"
          />
          <path d="M0 -18 V20 M-14 -2 H14" stroke="#c88a2b" strokeWidth="2.2" strokeLinecap="round" />
          <circle cx="0" cy="-2" r="3.5" fill="#ffffff" />
        </g>
      )}

      {isEcon && (
        <g transform="translate(120, 60)">
          <circle r="44" fill="#0b3b24" fillOpacity="0.05" stroke="#0b3b24" strokeWidth="1" strokeOpacity="0.2" />
          {/* Macro grid & Naira emblem */}
          <rect x="-28" y="-26" width="56" height="52" rx="3" fill="#0b3b24" stroke="#c88a2b" strokeWidth="1.5" />
          <path
            d="M-12 16 V-16 L12 16 V-16"
            fill="none"
            stroke="#ffffff"
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path d="M-19 -5 H19 M-19 5 H19" stroke="#c88a2b" strokeWidth="2.5" strokeLinecap="round" />
        </g>
      )}

      {isInvest && (
        <g transform="translate(120, 60)">
          <circle r="44" fill="#0b3b24" fillOpacity="0.05" stroke="#0b3b24" strokeWidth="1" strokeOpacity="0.2" />
          <rect x="-26" y="4" width="10" height="20" fill="#0b3b24" fillOpacity="0.35" />
          <rect x="-10" y="-4" width="10" height="28" fill="#0b3b24" fillOpacity="0.65" />
          <rect x="6" y="-14" width="10" height="38" fill="#0b3b24" />
          <rect x="22" y="-24" width="10" height="48" fill="#c88a2b" />
          <path d="M-32 24 H38" stroke="#0b3b24" strokeWidth="2" />
          <path
            d="M-24 -6 L-6 -16 L8 -10 L26 -28"
            fill="none"
            stroke="#0b3b24"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          <circle cx="26" cy="-28" r="3.5" fill="#c88a2b" stroke="#0b3b24" strokeWidth="1.5" />
        </g>
      )}

      {isGov && (
        <g transform="translate(120, 60)">
          <circle r="44" fill="#0b3b24" fillOpacity="0.05" stroke="#0b3b24" strokeWidth="1" strokeOpacity="0.2" />
          <path d="M-30 -10 L0 -26 L30 -10 Z" fill="#0b3b24" stroke="#c88a2b" strokeWidth="1.5" />
          <rect x="-24" y="-8" width="6" height="26" fill="#0b3b24" />
          <rect x="-10" y="-8" width="6" height="26" fill="#c88a2b" />
          <rect x="4" y="-8" width="6" height="26" fill="#c88a2b" />
          <rect x="18" y="-8" width="6" height="26" fill="#0b3b24" />
          <rect x="-30" y="18" width="60" height="5" fill="#0b3b24" />
          <rect x="-34" y="24" width="68" height="3" fill="#c88a2b" />
        </g>
      )}

      {!isSecurity && !isEcon && !isInvest && !isGov && (
        <g transform="translate(120, 60)">
          <circle r="44" fill="#0b3b24" fillOpacity="0.05" stroke="#0b3b24" strokeWidth="1" strokeOpacity="0.2" />
          <circle cx="-12" cy="-10" r="9" fill="#0b3b24" />
          <circle cx="12" cy="-10" r="9" fill="#c88a2b" />
          <path
            d="M-28 22 C-26 8 -18 2 -6 2 C6 2 14 8 16 22"
            fill="#0b3b24"
          />
          <path
            d="M-2 22 C0 10 8 4 18 4 C26 4 32 10 34 22"
            fill="#c88a2b"
            fillOpacity="0.85"
          />
        </g>
      )}

      {/* Corner index notation */}
      {typeof score === "number" && (
        <text
          x="228"
          y="20"
          textAnchor="end"
          fontSize="11"
          fontWeight="700"
          fontFamily="monospace"
          fill="#0b3b24"
          opacity="0.55"
        >
          {score.toFixed(1)}/10
        </text>
      )}
    </svg>
  );
}

function BaseSocial({ title, children, ...props }: IconProps & { children: React.ReactNode }) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" role="img" aria-label={title} {...props}>
      <title>{title}</title>
      {children}
    </svg>
  );
}

export function SocialXIcon(props: IconProps) {
  return (
    <BaseSocial title="X" {...props}>
      <path
        d="M18.8 3H21l-6.7 7.7L22 21h-6.1l-4.8-6.2L5.6 21H3.4l7.2-8.2L2 3h6.2l4.4 5.7L18.8 3Zm-2.1 16h1.3L7.2 4.9H5.8L16.7 19Z"
        fill="currentColor"
      />
    </BaseSocial>
  );
}

export function SocialFacebookIcon(props: IconProps) {
  return (
    <BaseSocial title="Facebook" {...props}>
      <path
        d="M14 9h2V6h-2c-2 0-3 1.3-3 3v2H9v3h2v7h3v-7h2.3l.7-3H14V9Z"
        fill="currentColor"
      />
    </BaseSocial>
  );
}

export function SocialInstagramIcon(props: IconProps) {
  return (
    <BaseSocial title="Instagram" {...props}>
      <path
        d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Zm5 6.3A3.7 3.7 0 1 0 15.7 12 3.7 3.7 0 0 0 12 8.3Zm6.2-.9a.9.9 0 1 0-.9.9.9.9 0 0 0 .9-.9Z"
        fill="currentColor"
        fillRule="evenodd"
      />
      <circle cx="12" cy="12" r="2.1" fill="var(--nsi-paper)" opacity="0.2" />
    </BaseSocial>
  );
}

export function SocialLinkedInIcon(props: IconProps) {
  return (
    <BaseSocial title="LinkedIn" {...props}>
      <path
        d="M4.5 3.8a1.9 1.9 0 1 0 0 3.8 1.9 1.9 0 0 0 0-3.8ZM3 21h3V9H3v12Zm6 0h3v-6.3c0-1.7.3-3.3 2.4-3.3 2.1 0 2.1 2 2.1 3.4V21h3v-6.8c0-3.3-.7-5.9-4.6-5.9-1.9 0-3.1 1-3.6 2h-.1V9H9v12Z"
        fill="currentColor"
      />
    </BaseSocial>
  );
}

export function SocialYouTubeIcon(props: IconProps) {
  return (
    <BaseSocial title="YouTube" {...props}>
      <path
        d="M21.8 8.1s-.2-1.4-.8-2c-.8-.8-1.6-.8-2-.9C16.2 5 12 5 12 5s-4.2 0-7 .2c-.4.1-1.2.1-2 .9-.6.6-.8 2-.8 2S2 9.7 2 11.3v1.4c0 1.6.2 3.2.2 3.2s.2 1.4.8 2c.8.8 1.8.8 2.2.9 1.6.1 6.8.2 6.8.2s4.2 0 7-.2c.4-.1 1.2-.1 2-.9.6-.6.8-2 .8-2s.2-1.6.2-3.2v-1.4c0-1.6-.2-3.2-.2-3.2ZM10 15V9l5.2 3-5.2 3Z"
        fill="currentColor"
      />
    </BaseSocial>
  );
}

export function SocialTikTokIcon(props: IconProps) {
  return (
    <BaseSocial title="TikTok" {...props}>
      <path
        d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"
        fill="currentColor"
      />
    </BaseSocial>
  );
}

export function NigeriaMapSilhouette({ className, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 240 200"
      className={className}
      role="img"
      aria-label="Map of Nigeria across 6 Geopolitical Zones"
      {...props}
    >
      <title>Federal Republic of Nigeria — 36 States &amp; FCT</title>
      {/* Accurate stylized cartographic silhouette of Nigeria with Niger & Benue rivers */}
      <path
        d="M36 58 L54 38 L78 32 L104 36 L134 28 L164 34 L196 26 L212 44 L208 72 L192 98 L184 126 L168 152 L144 162 L116 178 L92 176 L74 158 L46 152 L28 144 L24 112 L28 82 Z"
        fill="#0b3b24"
        fillOpacity="0.1"
        stroke="#0b3b24"
        strokeWidth="2"
      />
      {/* River Niger & River Benue Y-Confluence at Lokoja */}
      <path
        d="M38 78 C68 88 92 104 114 118 C138 112 166 102 194 92 M114 118 L112 174"
        fill="none"
        stroke="#c88a2b"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeDasharray="3 2"
      />
      {/* FCT Abuja & Lagos & Kano Geopolitical Nodes */}
      <circle cx="116" cy="102" r="4.5" fill="#c88a2b" stroke="#0b3b24" strokeWidth="1.5" />
      <text x="124" y="105" fontSize="9" fontFamily="monospace" fontWeight="700" fill="#0b3b24">FCT ABUJA</text>
      <circle cx="42" cy="146" r="4" fill="#0b3b24" />
      <text x="50" y="149" fontSize="8.5" fontFamily="monospace" fontWeight="600" fill="#0b3b24">LAGOS</text>
      <circle cx="122" cy="54" r="3.5" fill="#0b3b24" />
      <text x="130" y="57" fontSize="8.5" fontFamily="monospace" fontWeight="600" fill="#0b3b24">KANO</text>
      <circle cx="106" cy="166" r="3.5" fill="#0b3b24" />
      <text x="114" y="169" fontSize="8.5" fontFamily="monospace" fontWeight="600" fill="#0b3b24">PORT HARCOURT</text>
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
