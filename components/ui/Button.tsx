import Link from "next/link";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

export const buttonVariants = cva(
  [
    "inline-flex items-center justify-center gap-2 rounded-control font-semibold whitespace-nowrap",
    "transition-[background-color,border-color,color,transform] duration-150 ease-[var(--ease-out-strong)]",
    "active:scale-[0.98] disabled:pointer-events-none disabled:opacity-55 aria-disabled:pointer-events-none aria-disabled:opacity-55",
    "focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-brand",
  ],
  {
    variants: {
      variant: {
        primary: "bg-brand text-white [@media(hover:hover)_and_(pointer:fine)]:hover:bg-brand-strong",
        secondary:
          "border border-line-strong bg-ground text-ink [@media(hover:hover)_and_(pointer:fine)]:hover:border-ink [@media(hover:hover)_and_(pointer:fine)]:hover:bg-surface",
        quiet:
          "text-brand underline decoration-1 underline-offset-[0.22em] [@media(hover:hover)_and_(pointer:fine)]:hover:decoration-2 px-0!",
        gold: "bg-gold text-ink [@media(hover:hover)_and_(pointer:fine)]:hover:bg-[#c8931f]",
        inverse:
          "bg-ground text-ink [@media(hover:hover)_and_(pointer:fine)]:hover:bg-brand-tint",
      },
      size: {
        md: "min-h-12 px-5 text-body",
        sm: "min-h-11 px-4 text-small",
        lg: "min-h-14 px-6 text-lead",
      },
      block: {
        true: "w-full",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

type ButtonVariantProps = VariantProps<typeof buttonVariants>;

export function Button({
  className,
  variant,
  size,
  block,
  type = "button",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & ButtonVariantProps) {
  return (
    <button
      type={type}
      className={cn(buttonVariants({ variant, size, block }), className)}
      {...props}
    />
  );
}

export function LinkButton({
  className,
  variant,
  size,
  block,
  href,
  ...props
}: React.ComponentProps<typeof Link> & ButtonVariantProps) {
  return (
    <Link
      href={href}
      className={cn(buttonVariants({ variant, size, block }), className)}
      {...props}
    />
  );
}
