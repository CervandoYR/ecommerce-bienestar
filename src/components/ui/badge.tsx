"use client";

import { type HTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/* ─── Types ─── */

const variantClasses = {
  default:
    "bg-secondary text-secondary-foreground",
  new:
    "bg-primary text-primary-foreground",
  sale:
    "bg-destructive text-destructive-foreground",
  outOfStock:
    "bg-muted text-muted-foreground",
  info:
    "bg-accent text-accent-foreground",
} as const;

export type BadgeVariant = keyof typeof variantClasses;

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  children: ReactNode;
}

/* ─── Component ─── */

function Badge({
  className,
  variant = "default",
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5",
        "text-xs font-semibold tracking-wide uppercase",
        "select-none whitespace-nowrap",
        "transition-colors",
        variantClasses[variant],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}

Badge.displayName = "Badge";

export { Badge };
export default Badge;
