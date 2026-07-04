"use client";

import { forwardRef, type ReactNode, type ButtonHTMLAttributes } from "react";
import { motion, type HTMLMotionProps } from "framer-motion";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

/* ─── Variant / Size Maps ─── */

const variantClasses = {
  default:
    "bg-primary text-primary-foreground shadow-sm hover:bg-sage-600 dark:hover:bg-sage-400",
  secondary:
    "border border-border bg-transparent text-foreground hover:bg-secondary hover:text-secondary-foreground",
  outline:
    "border border-border bg-transparent text-foreground hover:bg-secondary hover:text-secondary-foreground",
  ghost:
    "bg-transparent text-foreground hover:bg-muted",
  destructive:
    "bg-destructive text-destructive-foreground shadow-sm hover:bg-red-700 dark:hover:bg-red-500",
  whatsapp:
    "bg-whatsapp text-whatsapp-foreground shadow-sm hover:brightness-110",
} as const;

const sizeClasses = {
  sm: "h-8 px-3 text-xs gap-1.5 rounded-md",
  default: "h-10 px-5 text-sm gap-2 rounded-lg",
  lg: "h-12 px-7 text-base gap-2.5 rounded-xl",
} as const;

/* ─── Types ─── */

export type ButtonVariant = keyof typeof variantClasses;
export type ButtonSize = keyof typeof sizeClasses;

export interface ButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  icon?: ReactNode;
  iconRight?: ReactNode;
  children?: ReactNode;
  /** When true, renders only the motion wrapper so you can compose any child */
  asChild?: boolean;
}

/* ─── Component ─── */

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "default",
      size = "default",
      loading = false,
      disabled,
      icon,
      iconRight,
      children,
      asChild = false,
      type = "button",
      ...props
    },
    ref,
  ) => {
    const isDisabled = disabled || loading;

    const classes = cn(
      "relative inline-flex items-center justify-center font-medium transition-all duration-200 hover:opacity-90 active:scale-95 cursor-pointer",
      "select-none whitespace-nowrap",
      "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
      "disabled:pointer-events-none disabled:opacity-50",
      variantClasses[variant],
      sizeClasses[size],
      className,
    );

    /* Framer Motion props */
    const motionProps: HTMLMotionProps<"button"> = {
      whileHover: isDisabled ? undefined : { scale: 1.02 },
      whileTap: isDisabled ? undefined : { scale: 0.97 },
      transition: { type: "spring", stiffness: 400, damping: 20 },
    };

    if (asChild) {
      return (
        <motion.button
          ref={ref}
          className={classes}
          disabled={isDisabled}
          type={type}
          {...motionProps}
          {...(props as HTMLMotionProps<"button">)}
        >
          {children}
        </motion.button>
      );
    }

    return (
      <motion.button
        ref={ref}
        className={classes}
        disabled={isDisabled}
        type={type}
        {...motionProps}
        {...(props as HTMLMotionProps<"button">)}
      >
        {loading ? (
          <Loader2 className="size-4 animate-spin" aria-hidden="true" />
        ) : icon ? (
          <span className="shrink-0" aria-hidden="true">
            {icon}
          </span>
        ) : null}

        {children}

        {iconRight && !loading && (
          <span className="shrink-0" aria-hidden="true">
            {iconRight}
          </span>
        )}

        {loading && (
          <span className="sr-only">Cargando…</span>
        )}
      </motion.button>
    );
  },
);

Button.displayName = "Button";

export { Button };
export default Button;
