"use client";

import { type HTMLMotionProps, motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ShimmerButtonProps extends HTMLMotionProps<"button"> {
  children: React.ReactNode;
  className?: string;
  shimmerColor?: string;
  shimmerSize?: string;
  background?: string;
  borderRadius?: string;
}

export function ShimmerButton({
  children,
  className,
  shimmerColor = "rgba(212, 190, 140, 0.4)",
  shimmerSize = "0.1em",
  background = "linear-gradient(135deg, #6b7a5e 0%, #7d8b6e 50%, #6b7a5e 100%)",
  borderRadius = "0.75rem",
  ...props
}: ShimmerButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "group relative inline-flex items-center justify-center overflow-hidden",
        "px-8 py-3.5 text-sm font-semibold tracking-wide text-white",
        "transition-shadow duration-500",
        "hover:shadow-lg hover:shadow-sage-900/20",
        "disabled:pointer-events-none disabled:opacity-50",
        className
      )}
      style={{
        background,
        borderRadius,
      }}
      {...props}
    >
      {/* Shimmer overlay */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ borderRadius }}
      >
        <div
          className={cn(
            "absolute inset-0 -translate-x-full",
            "group-hover:animate-[shimmer-sweep_1.5s_ease-in-out_forwards]"
          )}
          style={{
            background: `linear-gradient(
              105deg,
              transparent 20%,
              transparent 40%,
              ${shimmerColor} 50%,
              transparent 60%,
              transparent 80%
            )`,
          }}
        />
      </div>

      {/* Glow ring on hover */}
      <div
        className={cn(
          "absolute inset-0 opacity-0 transition-opacity duration-500",
          "group-hover:opacity-100"
        )}
        style={{
          borderRadius,
          boxShadow: `inset 0 0 0 ${shimmerSize} ${shimmerColor}`,
        }}
      />

      {/* Content */}
      <span className="relative z-10 flex items-center gap-2">
        {children}
      </span>
    </motion.button>
  );
}

export default ShimmerButton;
