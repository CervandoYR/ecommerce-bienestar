"use client";

import { type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

/* ─── Types ─── */

export type SkeletonVariant = "line" | "circle" | "card" | "image";

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  variant?: SkeletonVariant;
  /** Width (for line variant) — accepts Tailwind class like "w-48" */
  width?: string;
  /** Height (for line variant) — accepts Tailwind class like "h-4" */
  height?: string;
  /** Size for circle variant */
  circleSize?: string;
}

/* ─── Variant-specific classes ─── */

const variantClasses: Record<SkeletonVariant, string> = {
  line: "h-4 w-full rounded-md",
  circle: "size-12 rounded-full",
  card: "h-48 w-full rounded-xl",
  image: "aspect-square w-full rounded-xl",
};

/* ─── Component ─── */

function Skeleton({
  className,
  variant = "line",
  width,
  height,
  circleSize,
  ...props
}: SkeletonProps) {
  return (
    <div
      role="status"
      aria-label="Cargando…"
      className={cn(
        "animate-shimmer bg-gradient-to-r from-muted via-muted/50 to-muted bg-[length:200%_100%]",
        variantClasses[variant],
        variant === "line" && width,
        variant === "line" && height,
        variant === "circle" && circleSize,
        className,
      )}
      {...props}
    >
      <span className="sr-only">Cargando…</span>
    </div>
  );
}

Skeleton.displayName = "Skeleton";

export { Skeleton };
export default Skeleton;
