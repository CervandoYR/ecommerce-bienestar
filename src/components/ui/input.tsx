"use client";

import {
  forwardRef,
  useState,
  useId,
  type InputHTMLAttributes,
  type ReactNode,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

/* ─── Types ─── */

export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  label?: string;
  error?: string;
  hint?: string;
  icon?: ReactNode;
  iconRight?: ReactNode;
  /** Visual size variant */
  inputSize?: "sm" | "default" | "lg";
}

const sizeClasses = {
  sm: "h-8 text-xs px-3",
  default: "h-10 text-sm px-4",
  lg: "h-12 text-base px-5",
} as const;

/* ─── Component ─── */

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      label,
      error,
      hint,
      icon,
      iconRight,
      inputSize = "default",
      id: externalId,
      type = "text",
      placeholder,
      disabled,
      onFocus,
      onBlur,
      ...props
    },
    ref,
  ) => {
    const generatedId = useId();
    const inputId = externalId ?? generatedId;
    const errorId = `${inputId}-error`;
    const hintId = `${inputId}-hint`;

    const [isFocused, setIsFocused] = useState(false);

    return (
      <div className="flex w-full flex-col gap-1.5">
        {/* Label */}
        {label && (
          <label
            htmlFor={inputId}
            className={cn(
              "text-sm font-medium transition-colors",
              error ? "text-destructive" : "text-foreground",
              disabled && "opacity-50",
            )}
          >
            {label}
          </label>
        )}

        {/* Input wrapper */}
        <div className="relative">
          {/* Left icon */}
          {icon && (
            <span
              className={cn(
                "pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground",
                isFocused && "text-primary",
                error && "text-destructive",
              )}
              aria-hidden="true"
            >
              {icon}
            </span>
          )}

          <input
            ref={ref}
            id={inputId}
            type={type}
            disabled={disabled}
            placeholder={placeholder ?? label}
            aria-invalid={!!error}
            aria-describedby={
              [error ? errorId : null, hint ? hintId : null]
                .filter(Boolean)
                .join(" ") || undefined
            }
            className={cn(
              "w-full rounded-lg border bg-card text-foreground",
              "placeholder:text-muted-foreground/60",
              "transition-all duration-200",
              "focus:outline-none focus:ring-2 focus:ring-ring/40 focus:border-primary",
              "disabled:cursor-not-allowed disabled:opacity-50",
              error
                ? "border-destructive focus:ring-destructive/40"
                : "border-input",
              icon ? "pl-10" : "",
              iconRight ? "pr-10" : "",
              sizeClasses[inputSize],
              className,
            )}
            onFocus={(e) => {
              setIsFocused(true);
              onFocus?.(e);
            }}
            onBlur={(e) => {
              setIsFocused(false);
              onBlur?.(e);
            }}
            {...props}
          />

          {/* Right icon */}
          {iconRight && (
            <span
              className={cn(
                "pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground",
                isFocused && "text-primary",
              )}
              aria-hidden="true"
            >
              {iconRight}
            </span>
          )}

          {/* Focus underline accent */}
          <motion.span
            className="absolute bottom-0 left-0 h-0.5 rounded-full bg-primary"
            initial={{ width: "0%" }}
            animate={{ width: isFocused ? "100%" : "0%" }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          />
        </div>

        {/* Error / Hint messages */}
        <AnimatePresence mode="wait">
          {error ? (
            <motion.p
              key="error"
              id={errorId}
              role="alert"
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15 }}
              className="text-xs text-destructive"
            >
              {error}
            </motion.p>
          ) : hint ? (
            <motion.p
              key="hint"
              id={hintId}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-xs text-muted-foreground"
            >
              {hint}
            </motion.p>
          ) : null}
        </AnimatePresence>
      </div>
    );
  },
);

Input.displayName = "Input";

export { Input };
export default Input;
