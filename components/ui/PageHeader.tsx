import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Container } from "@/components/ui/Layout";
import { cn } from "@/lib/utils";

export type Crumb = { href?: string; label: string };

export function Breadcrumb({ items, className }: { items: Crumb[]; className?: string }) {
  return (
    <nav aria-label="Breadcrumb" className={cn("text-meta text-ink-3", className)}>
      <ol className="flex flex-wrap items-center gap-x-1.5 gap-y-1">
        {items.map((item, i) => {
          const last = i === items.length - 1;
          return (
            <li key={`${item.label}-${i}`} className="flex items-center gap-1.5">
              {item.href && !last ? (
                <Link href={item.href} className="underline decoration-line-strong hover:text-ink hover:decoration-ink">
                  {item.label}
                </Link>
              ) : (
                <span aria-current={last ? "page" : undefined} className={last ? "text-ink-2" : undefined}>
                  {item.label}
                </span>
              )}
              {!last ? <ChevronRight aria-hidden className="size-3.5 text-ink-3" /> : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

/**
 * The top of an inner page: breadcrumb, one h1, a one-paragraph lede and
 * optional actions. Replaces the copied glass hero cards.
 */
export function PageHeader({
  title,
  lede,
  crumbs,
  actions,
  aside,
  className,
}: {
  title: React.ReactNode;
  lede?: React.ReactNode;
  crumbs?: Crumb[];
  actions?: React.ReactNode;
  aside?: React.ReactNode;
  className?: string;
}) {
  return (
    <header className={cn("border-b border-line bg-ground pt-8 pb-10 sm:pt-10 sm:pb-14", className)}>
      <Container>
        {crumbs ? <Breadcrumb items={crumbs} className="mb-6" /> : null}
        <div className={cn("grid gap-8", aside && "lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] lg:items-end lg:gap-16")}>
          <div className="max-w-3xl">
            <h1 className="text-display">{title}</h1>
            {lede ? <div className="mt-5 max-w-2xl text-lead text-ink-2">{lede}</div> : null}
            {actions ? <div className="mt-8 flex flex-wrap gap-3">{actions}</div> : null}
          </div>
          {aside ? <div>{aside}</div> : null}
        </div>
      </Container>
    </header>
  );
}

export function EmptyState({
  title,
  children,
  action,
  className,
}: {
  title: string;
  children?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("border border-line bg-surface px-6 py-10 sm:px-10", className)}>
      <h2 className="text-h3">{title}</h2>
      {children ? <div className="mt-3 max-w-prose text-body text-ink-2">{children}</div> : null}
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  );
}
