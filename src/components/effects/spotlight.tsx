"use client";

import { useRef, useState, useCallback, type ReactNode } from "react";
import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import { cn } from "@/lib/utils";

interface SpotlightProps {
  children: ReactNode;
  className?: string;
  spotlightColor?: string;
  spotlightSize?: number;
  borderColor?: string;
  as?: "div" | "article" | "section";
}

export function Spotlight({
  children,
  className,
  spotlightColor = "rgba(139, 164, 120, 0.15)",
  spotlightSize = 350,
  borderColor = "rgba(139, 164, 120, 0.2)",
  as = "div",
}: SpotlightProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      mouseX.set(e.clientX - rect.left);
      mouseY.set(e.clientY - rect.top);
    },
    [mouseX, mouseY]
  );

  const spotlightBackground = useMotionTemplate`
    radial-gradient(
      ${spotlightSize}px circle at ${mouseX}px ${mouseY}px,
      ${spotlightColor},
      transparent 80%
    )
  `;

  const borderGradient = useMotionTemplate`
    radial-gradient(
      ${spotlightSize * 0.8}px circle at ${mouseX}px ${mouseY}px,
      ${borderColor},
      transparent 80%
    )
  `;

  const MotionTag = motion.create(as);

  return (
    <MotionTag
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "group relative overflow-hidden rounded-2xl",
        "bg-white/60 dark:bg-stone-900/60",
        "backdrop-blur-sm",
        className
      )}
    >
      {/* Spotlight gradient overlay */}
      <motion.div
        className="pointer-events-none absolute inset-0 z-10 rounded-2xl transition-opacity duration-500"
        style={{
          background: spotlightBackground,
          opacity: isHovered ? 1 : 0,
        }}
      />

      {/* Animated border glow */}
      <motion.div
        className="pointer-events-none absolute inset-0 z-10 rounded-2xl transition-opacity duration-500"
        style={{
          background: borderGradient,
          opacity: isHovered ? 1 : 0,
          mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          maskComposite: "exclude",
          padding: "1px",
          WebkitMask:
            "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "xor",
        }}
      />

      {/* Content */}
      <div className="relative z-20">{children}</div>
    </MotionTag>
  );
}

export default Spotlight;
