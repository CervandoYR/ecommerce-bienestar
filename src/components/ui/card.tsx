"use client";

import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

/* ─── Types ─── */

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** Optional top image element */
  image?: ReactNode;
  /** Disable hover animation */
  disableHover?: boolean;
}

export interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {}
export interface CardContentProps extends HTMLAttributes<HTMLDivElement> {}
export interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {}

/* ─── Card ─── */

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, image, disableHover = false, children, ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        whileHover={
          disableHover
            ? undefined
            : {
                y: -4,
                boxShadow:
                  "0 12px 28px -6px rgba(77,122,86,0.10), 0 4px 12px -4px rgba(0,0,0,0.06)",
              }
        }
        transition={{ type: "spring", stiffness: 300, damping: 24 }}
        className={cn(
          "overflow-hidden rounded-xl border border-border bg-card text-card-foreground",
          "shadow-sm transition-colors",
          className,
        )}
        {...(props as React.ComponentProps<typeof motion.div>)}
      >
        {image && (
          <div className="relative w-full overflow-hidden">{image}</div>
        )}
        {children}
      </motion.div>
    );
  },
);

Card.displayName = "Card";

/* ─── Card Header ─── */

const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex flex-col gap-1.5 p-5 pb-0", className)}
      {...props}
    />
  ),
);

CardHeader.displayName = "CardHeader";

/* ─── Card Content ─── */

const CardContent = forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("p-5", className)} {...props} />
  ),
);

CardContent.displayName = "CardContent";

/* ─── Card Footer ─── */

const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "flex items-center gap-3 border-t border-border px-5 py-3",
        className,
      )}
      {...props}
    />
  ),
);

CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardContent, CardFooter };
export default Card;
