"use client";

import { useState, useCallback, type KeyboardEvent } from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

/* ─── Types ─── */

export interface StarRatingProps {
  /** Current rating value (0-5, supports decimals for read-only) */
  value: number;
  /** Max stars */
  max?: number;
  /** Whether the user can interact */
  interactive?: boolean;
  /** Callback when user selects a rating */
  onChange?: (rating: number) => void;
  /** Star size in Tailwind class like "size-5" */
  size?: string;
  className?: string;
}

/* ─── Component ─── */

function StarRating({
  value,
  max = 5,
  interactive = false,
  onChange,
  size = "size-5",
  className,
}: StarRatingProps) {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const displayValue = hoverIndex !== null ? hoverIndex : value;

  const handleClick = useCallback(
    (index: number) => {
      if (interactive && onChange) {
        onChange(index);
      }
    },
    [interactive, onChange],
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLButtonElement>, index: number) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handleClick(index);
      }
    },
    [handleClick],
  );

  return (
    <div
      className={cn("inline-flex items-center gap-0.5", className)}
      role={interactive ? "radiogroup" : "img"}
      aria-label={`Calificación: ${value} de ${max} estrellas`}
    >
      {Array.from({ length: max }, (_, i) => {
        const starIndex = i + 1;
        const fillPercent = Math.min(1, Math.max(0, displayValue - i)) * 100;

        return (
          <span key={i} className="relative">
            {interactive ? (
              <button
                type="button"
                role="radio"
                aria-checked={value === starIndex}
                aria-label={`${starIndex} estrella${starIndex > 1 ? "s" : ""}`}
                className={cn(
                  "relative cursor-pointer transition-transform hover:scale-110",
                  "focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-1 rounded-sm",
                )}
                onClick={() => handleClick(starIndex)}
                onKeyDown={(e) => handleKeyDown(e, starIndex)}
                onMouseEnter={() => setHoverIndex(starIndex)}
                onMouseLeave={() => setHoverIndex(null)}
              >
                {/* Background (empty) star */}
                <Star
                  className={cn(size, "text-warm-300 dark:text-warm-700")}
                  strokeWidth={1.5}
                />
                {/* Filled overlay */}
                <span
                  className="pointer-events-none absolute inset-0 overflow-hidden"
                  style={{ width: `${fillPercent}%` }}
                >
                  <Star
                    className={cn(size, "fill-gold-400 text-gold-400")}
                    strokeWidth={1.5}
                  />
                </span>
              </button>
            ) : (
              <>
                {/* Background (empty) star */}
                <Star
                  className={cn(size, "text-warm-300 dark:text-warm-700")}
                  strokeWidth={1.5}
                />
                {/* Filled overlay */}
                <span
                  className="pointer-events-none absolute inset-0 overflow-hidden"
                  style={{ width: `${fillPercent}%` }}
                >
                  <Star
                    className={cn(size, "fill-gold-400 text-gold-400")}
                    strokeWidth={1.5}
                  />
                </span>
              </>
            )}
          </span>
        );
      })}
    </div>
  );
}

StarRating.displayName = "StarRating";

export { StarRating };
export default StarRating;
