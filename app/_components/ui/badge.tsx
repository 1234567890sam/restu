import { cn } from "@/lib/utils";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?:
    | "default"
    | "success"
    | "warning"
    | "error"
    | "info"
    | "veg"
    | "non-veg"
    | "brand";
  size?: "sm" | "md";
}

export function Badge({
  className,
  variant = "default",
  size = "sm",
  children,
  ...props
}: BadgeProps) {
  const variants = {
    default:
      "bg-[var(--bg-tertiary)] text-[var(--text-secondary)]",
    success:
      "bg-[var(--success-bg)] text-[var(--success)]",
    warning:
      "bg-[var(--warning-bg)] text-[var(--warning)]",
    error:
      "bg-[var(--error-bg)] text-[var(--error)]",
    info:
      "bg-[var(--info-bg)] text-[var(--info)]",
    veg: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400",
    "non-veg": "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-400",
    brand:
      "bg-orange-50 text-[var(--brand-primary)] dark:bg-orange-950",
  };

  const sizes = {
    sm: "text-[10px] px-2 py-0.5",
    md: "text-xs px-2.5 py-1",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center font-semibold rounded-[var(--radius-full)] uppercase tracking-wide whitespace-nowrap",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
