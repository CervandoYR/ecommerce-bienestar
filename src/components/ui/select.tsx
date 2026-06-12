"use client";

import {
  forwardRef,
  useId,
  type SelectHTMLAttributes,
  type ReactNode,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

/* ─── Types ─── */

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps
  extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "size"> {
  label?: string;
  error?: string;
  hint?: string;
  options: SelectOption[];
  placeholder?: string;
  /** Visual size */
  selectSize?: "sm" | "default" | "lg";
  icon?: ReactNode;
}

const sizeClasses = {
  sm: "h-8 text-xs pl-3 pr-8",
  default: "h-10 text-sm pl-4 pr-10",
  lg: "h-12 text-base pl-5 pr-12",
} as const;

/* ─── Component ─── */

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      className,
      label,
      error,
      hint,
      options,
      placeholder,
      selectSize = "default",
      icon,
      id: externalId,
      disabled,
      ...props
    },
    ref,
  ) => {
    const generatedId = useId();
    const selectId = externalId ?? generatedId;
    const errorId = `${selectId}-error`;
    const hintId = `${selectId}-hint`;

    return (
      <div className="flex w-full flex-col gap-1.5">
        {/* Label */}
        {label && (
          <label
            htmlFor={selectId}
            className={cn(
              "text-sm font-medium transition-colors",
              error ? "text-destructive" : "text-foreground",
              disabled && "opacity-50",
            )}
          >
            {label}
          </label>
        )}

        {/* Select wrapper */}
        <div className="relative">
          {icon && (
            <span
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            >
              {icon}
            </span>
          )}

          <select
            ref={ref}
            id={selectId}
            disabled={disabled}
            aria-invalid={!!error}
            aria-describedby={
              [error ? errorId : null, hint ? hintId : null]
                .filter(Boolean)
                .join(" ") || undefined
            }
            className={cn(
              "w-full appearance-none rounded-lg border bg-card text-foreground",
              "transition-all duration-200 cursor-pointer",
              "focus:outline-none focus:ring-2 focus:ring-ring/40 focus:border-primary",
              "disabled:cursor-not-allowed disabled:opacity-50",
              error
                ? "border-destructive focus:ring-destructive/40"
                : "border-input",
              icon ? "pl-10" : "",
              sizeClasses[selectSize],
              className,
            )}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option
                key={option.value}
                value={option.value}
                disabled={option.disabled}
              >
                {option.label}
              </option>
            ))}
          </select>

          {/* Chevron icon */}
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            <ChevronDown className="size-4" />
          </span>
        </div>

        {/* Error / Hint */}
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

Select.displayName = "Select";

export { Select };
export default Select;
