"use client";

import { usePathname } from "next/navigation";

export function ConditionalSiteChrome({
  top,
  bottom,
  children,
}: {
  top: React.ReactNode;
  bottom: React.ReactNode;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin") ?? false;

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      {top}
      <div className="flex-1">{children}</div>
      {bottom}
    </>
  );
}
