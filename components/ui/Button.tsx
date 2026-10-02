import { cn } from "@/lib/cn";

const variants = {
  primary: "bg-accent text-accent-ink hover:brightness-110",
  secondary: "border border-line bg-card text-ink hover:border-ink/20",
  ghost: "text-muted hover:text-ink",
} as const;

type Variant = keyof typeof variants;

export function buttonClass(variant: Variant = "primary", className?: string): string {
  return cn(
    "inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-4 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50",
    variants[variant],
    className,
  );
}

export function Button({
  variant = "primary",
  className,
  type = "button",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return <button type={type} className={buttonClass(variant, className)} {...props} />;
}
