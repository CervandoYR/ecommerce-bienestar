"use client";

import { type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

/* ─── Types ─── */

export interface SeparatorProps extends HTMLAttributes<HTMLDivElement> {
  orientation?: "horizontal" | "vertical";
  /** Use a softer/lighter color */
  soft?: boolean;
}

/* ─── Component ─── */

function Separator({
  className,
  orientation = "horizontal",
  soft = false,
  ...props
}: SeparatorProps) {
  return (
    <div
      role="separator"
      aria-orientation={orientation}
      className={cn(
        "shrink-0",
        soft ? "bg-border/50" : "bg-border",
        orientation === "horizontal" ? "h-px w-full" : "h-full w-px",
        className,
      )}
      {...props}
    />
  );
}

Separator.displayName = "Separator";

export { Separator };
export default Separator;
