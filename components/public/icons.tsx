import * as React from "react";

type IconProps = React.SVGProps<SVGSVGElement> & {
  title?: string;
};

export function NSIShieldMark({ title = "NSI", ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 64 64"
      width="28"
      height="28"
      aria-hidden={title ? undefined : true}
      role={title ? "img" : "presentation"}
      {...props}
    >
      {title ? <title>{title}</title> : null}
      <defs>
        <linearGradient id="nsiShieldG" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="var(--nsi-gold)" stopOpacity="1" />
          <stop offset="1" stopColor="var(--nsi-gold-deep)" stopOpacity="1" />
        </linearGradient>
        <linearGradient id="nsiShieldFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="oklch(0.38 0.06 164)" stopOpacity="1" />
          <stop offset="1" stopColor="oklch(0.26 0.05 164)" stopOpacity="1" />
        </linearGradient>
      </defs>
      <path
        d="M32 6c10 7 18 6 24 6 0 28-9 38-24 46C17 50 8 40 8 12c6 0 14 1 24-6Z"
        fill="url(#nsiShieldG)"
      />
      <path
        d="M32 11c8 5.6 14 5.1 19 5.2 0 23.5-7.2 31.7-19 38-11.8-6.3-19-14.5-19-38 5-.1 11 .4 19-5.2Z"
        fill="url(#nsiShieldFill)"
      />
      <path d="M32 14v36" stroke="oklch(1 0 0 / 0.6)" strokeWidth="3.2" />
      <path d="M18 30h28" stroke="oklch(1 0 0 / 0.6)" strokeWidth="3.2" />
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
      <path
        d="M32 7c10 6 18 5 22 5 0 25-8 34-22 41C18 46 10 37 10 12c4 0 12 1 22-5Z"
        fill="var(--nsi-gold)"
      />
      <path d="M32 14v31" stroke="oklch(0.25 0.05 164 / 0.55)" strokeWidth="3" />
      <path d="M20 30h24" stroke="oklch(0.25 0.05 164 / 0.55)" strokeWidth="3" />
    </BasePillarIcon>
  );
}

export function PillarEconomyIcon(props: IconProps) {
  return (
    <BasePillarIcon title="FX & Economy" {...props}>
      <circle cx="26" cy="30" r="14" fill="var(--nsi-gold)" />
      <circle cx="40" cy="34" r="14" fill="oklch(0.83 0.1 86)" opacity="0.95" />
      <path
        d="M23 22c3-2 9-2 12 0"
        fill="none"
        stroke="oklch(0.25 0.05 164 / 0.65)"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M23 30c3 2 9 2 12 0"
        fill="none"
        stroke="oklch(0.25 0.05 164 / 0.65)"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M41 26v16"
        stroke="oklch(0.25 0.05 164 / 0.65)"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M47 28c-2-2-10-2-12 1"
        fill="none"
        stroke="oklch(0.25 0.05 164 / 0.65)"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </BasePillarIcon>
  );
}

export function PillarInvestorIcon(props: IconProps) {
  return (
    <BasePillarIcon title="Investor Confidence" {...props}>
      <path d="M14 46h36" stroke="var(--nsi-gold)" strokeWidth="5" strokeLinecap="round" />
      <path d="M16 44V22" stroke="var(--nsi-gold)" strokeWidth="5" strokeLinecap="round" />
      <path
        d="M18 40l12-10 10 6 10-16"
        fill="none"
        stroke="var(--nsi-gold)"
        strokeWidth="5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <path
        d="M50 20l-2 9-9-2"
        fill="none"
        stroke="var(--nsi-gold)"
        strokeWidth="5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </BasePillarIcon>
  );
}

export function PillarGovernanceIcon(props: IconProps) {
  return (
    <BasePillarIcon title="Governance" {...props}>
      <path d="M14 24h36L32 14 14 24Z" fill="var(--nsi-gold)" />
      <path d="M18 26v22" stroke="var(--nsi-gold)" strokeWidth="5" strokeLinecap="round" />
      <path d="M28 26v22" stroke="var(--nsi-gold)" strokeWidth="5" strokeLinecap="round" />
      <path d="M38 26v22" stroke="var(--nsi-gold)" strokeWidth="5" strokeLinecap="round" />
      <path d="M46 26v22" stroke="var(--nsi-gold)" strokeWidth="5" strokeLinecap="round" />
      <path d="M16 48h32" stroke="var(--nsi-gold)" strokeWidth="6" strokeLinecap="round" />
    </BasePillarIcon>
  );
}

export function PillarSocialIcon(props: IconProps) {
  return (
    <BasePillarIcon title="Social Stability" {...props}>
      <circle cx="22" cy="26" r="7" fill="var(--nsi-gold)" />
      <circle cx="40" cy="26" r="7" fill="var(--nsi-gold)" />
      <path
        d="M10 50c2-10 10-16 20-16s18 6 20 16"
        fill="none"
        stroke="var(--nsi-gold)"
        strokeWidth="6"
        strokeLinecap="round"
      />
      <path
        d="M48 22c4-4 10-1 10 4 0 7-10 12-10 12S38 33 38 26c0-5 6-8 10-4Z"
        fill="oklch(0.84 0.1 86)"
      />
    </BasePillarIcon>
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
      viewBox="0 0 200 200"
      className={className}
      role="img"
      aria-label="Nigeria Map"
      {...props}
    >
      <title>Nigeria</title>
      <defs>
        <linearGradient id="nigeriaMapGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="oklch(0.35 0.05 164)" />
          <stop offset="100%" stopColor="oklch(0.28 0.04 164)" />
        </linearGradient>
      </defs>
      {/* Simplified Nigeria map outline */}
      <path
        d="M60 30 L80 25 L100 28 L120 22 L140 30 L155 35 L165 50 L170 70 L175 90 L170 110 L165 130 L155 145 L145 155 L130 165 L115 170 L100 175 L85 172 L70 165 L55 155 L45 140 L40 120 L38 100 L40 80 L45 60 L50 45 L60 30 Z"
        fill="url(#nigeriaMapGrad)"
        stroke="var(--nsi-green)"
        strokeWidth="2"
        opacity="0.9"
      />
      {/* Lagos marker */}
      <circle cx="65" cy="145" r="6" fill="var(--nsi-gold)" />
      <text x="75" y="148" fontSize="12" fill="var(--nsi-green-ink)" fontWeight="600">Lagos</text>
      {/* Nigeria green stripe indicator */}
      <rect x="85" y="85" width="8" height="30" fill="oklch(0.45 0.12 145)" rx="2" />
      <rect x="95" y="85" width="8" height="30" fill="white" rx="2" />
      <rect x="105" y="85" width="8" height="30" fill="oklch(0.45 0.12 145)" rx="2" />
    </svg>
  );
}

export function NSIBadgeLogo({ className, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 80 100"
      className={className}
      role="img"
      aria-label="NSI Badge"
      {...props}
    >
      <title>NSI</title>
      <defs>
        <linearGradient id="nsiBadgeGold" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--nsi-gold)" />
          <stop offset="100%" stopColor="var(--nsi-gold-deep)" />
        </linearGradient>
        <linearGradient id="nsiBadgeGreen" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="oklch(0.38 0.06 164)" />
          <stop offset="100%" stopColor="oklch(0.26 0.05 164)" />
        </linearGradient>
      </defs>
      {/* Outer shield */}
      <path
        d="M40 5 C55 15 70 12 75 12 C75 55 60 75 40 90 C20 75 5 55 5 12 C10 12 25 15 40 5 Z"
        fill="url(#nsiBadgeGold)"
        stroke="var(--nsi-gold-deep)"
        strokeWidth="1"
      />
      {/* Inner shield */}
      <path
        d="M40 12 C52 20 63 18 67 18 C67 52 55 68 40 80 C25 68 13 52 13 18 C17 18 28 20 40 12 Z"
        fill="url(#nsiBadgeGreen)"
      />
      {/* NSI text */}
      <text
        x="40"
        y="38"
        textAnchor="middle"
        fontSize="18"
        fontWeight="700"
        fontFamily="var(--font-serif)"
        fill="var(--nsi-gold)"
        letterSpacing="1"
      >
        N
      </text>
      <text
        x="40"
        y="54"
        textAnchor="middle"
        fontSize="18"
        fontWeight="700"
        fontFamily="var(--font-serif)"
        fill="var(--nsi-gold)"
        letterSpacing="1"
      >
        S
      </text>
      <text
        x="40"
        y="70"
        textAnchor="middle"
        fontSize="18"
        fontWeight="700"
        fontFamily="var(--font-serif)"
        fill="var(--nsi-gold)"
        letterSpacing="1"
      >
        I
      </text>
    </svg>
  );
}
