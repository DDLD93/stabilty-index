import Link from "next/link";
import { ChevronRightIcon } from "./AdminIcons";

type BreadcrumbItem = {
  label: string;
  href?: string;
};

type AdminPageHeaderProps = {
  title: string;
  description?: string;
  breadcrumb?: BreadcrumbItem[];
  actions?: React.ReactNode;
};

export function AdminPageHeader({
  title,
  description,
  breadcrumb,
  actions,
}: AdminPageHeaderProps) {
  return (
    <header className="mb-8 flex flex-wrap items-start justify-between gap-4 border-b border-[color:var(--nsi-rule-strong)] pb-6">
      <div className="min-w-0 flex-1">
        {breadcrumb && breadcrumb.length > 0 ? (
          <nav
            aria-label="Breadcrumb"
            className="mb-2 flex items-center gap-1 font-mono text-xs uppercase tracking-[0.14em] text-[color:var(--nsi-ink-muted)]"
          >
            <ol className="flex items-center gap-1">
              {breadcrumb.map((item, index) => (
                <li key={index} className="flex items-center gap-1">
                  {item.href ? (
                    <Link
                      href={item.href}
                      className="rounded-[2px] px-1 py-0.5 transition-colors hover:text-[color:var(--nsi-ink)]"
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <span className="px-1 py-0.5 font-bold text-[color:var(--nsi-green)]">
                      {item.label}
                    </span>
                  )}
                  {index < breadcrumb.length - 1 && (
                    <ChevronRightIcon className="h-3.5 w-3.5 shrink-0 text-[color:var(--nsi-ink-muted)]" />
                  )}
                </li>
              ))}
            </ol>
          </nav>
        ) : (
          <p className="nsi-kicker mb-1.5">NSI Research Operations</p>
        )}
        <h1 className="font-serif text-2xl font-bold tracking-tight text-[color:var(--nsi-ink)] md:text-3xl">
          {title}
        </h1>
        {description && (
          <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-[color:var(--nsi-ink-soft)]">
            {description}
          </p>
        )}
      </div>
      {actions && (
        <div className="flex shrink-0 items-center gap-3">{actions}</div>
      )}
    </header>
  );
}
