export const primaryNav = [
  { href: "/reports", label: "Reports" },
  { href: "/spotlights", label: "Spotlights" },
  { href: "/honors", label: "Honors 2026" },
  { href: "/methodology", label: "Methodology" },
  { href: "/about", label: "About" },
] as const;

export const secondaryNav = [
  { href: "/survey", label: "Take the survey" },
  { href: "/subscribe", label: "Email updates" },
  { href: "/contact", label: "Contact" },
] as const;

export function isActive(pathname: string | null, href: string) {
  if (!pathname) return false;
  return pathname === href || pathname.startsWith(`${href}/`);
}
