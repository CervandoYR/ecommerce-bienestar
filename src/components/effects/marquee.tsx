"use client";

import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface MarqueeProps {
  children: ReactNode;
  className?: string;
  speed?: number;
  pauseOnHover?: boolean;
  direction?: "left" | "right";
  vertical?: boolean;
  gap?: string;
}

export function Marquee({
  children,
  className,
  speed = 30,
  pauseOnHover = true,
  direction = "left",
  vertical = false,
  gap = "1rem",
}: MarqueeProps) {
  const animationDirection = direction === "left" ? "normal" : "reverse";
  const animationDuration = `${speed}s`;

  return (
    <div
      className={cn(
        "group relative flex overflow-hidden",
        vertical ? "flex-col" : "flex-row",
        className
      )}
      style={
        {
          "--marquee-gap": gap,
          "--marquee-duration": animationDuration,
          "--marquee-direction": animationDirection,
        } as React.CSSProperties
      }
    >
      {/* First copy */}
      <div
        className={cn(
          "flex shrink-0 items-center justify-around",
          vertical ? "flex-col" : "flex-row",
          "animate-[marquee_var(--marquee-duration)_linear_infinite_var(--marquee-direction)]",
          pauseOnHover && "group-hover:[animation-play-state:paused]"
        )}
        style={{ gap: `var(--marquee-gap)` }}
      >
        {children}
      </div>

      {/* Duplicate for seamless loop */}
      <div
        className={cn(
          "flex shrink-0 items-center justify-around",
          vertical ? "flex-col" : "flex-row",
          "animate-[marquee_var(--marquee-duration)_linear_infinite_var(--marquee-direction)]",
          pauseOnHover && "group-hover:[animation-play-state:paused]"
        )}
        style={{ gap: `var(--marquee-gap)` }}
        aria-hidden="true"
      >
        {children}
      </div>
    </div>
  );
}

export default Marquee;
