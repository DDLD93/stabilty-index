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
    <header className="mb-8 flex flex-wrap items-start justify-between gap-4">
      <div className="min-w-0 flex-1">
        {breadcrumb && breadcrumb.length > 0 && (
          <nav
            aria-label="Breadcrumb"
            className="mb-3 flex items-center gap-1 text-sm text-[color:var(--nsi-ink-soft)]"
          >
            <ol className="flex items-center gap-1">
              {breadcrumb.map((item, index) => (
                <li key={index} className="flex items-center gap-1">
                  {item.href ? (
                    <Link
                      href={item.href}
                      className="rounded-md px-1 py-0.5 transition-colors hover:text-[color:var(--nsi-ink)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--nsi-gold)] focus-visible:ring-offset-1"
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <span className="px-1 py-0.5 text-[color:var(--nsi-ink)]">
                      {item.label}
                    </span>
                  )}
                  {index < breadcrumb.length - 1 && (
                    <ChevronRightIcon className="h-4 w-4 shrink-0 text-[color:var(--nsi-ink-soft)]" />
                  )}
                </li>
              ))}
            </ol>
          </nav>
        )}
        <h1 className="font-serif text-2xl font-semibold tracking-tight text-[color:var(--nsi-ink)] md:text-3xl">
          {title}
        </h1>
        {description && (
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[color:var(--nsi-ink-soft)] md:text-base">
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
