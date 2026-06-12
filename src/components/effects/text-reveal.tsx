"use client";

import { useRef, type ElementType, type ComponentPropsWithoutRef } from "react";
import { motion, useInView, type Variants } from "framer-motion";
import { cn } from "@/lib/utils";

type TextRevealProps<T extends ElementType = "p"> = {
  text: string;
  className?: string;
  delay?: number;
  duration?: number;
  staggerDelay?: number;
  as?: T;
  charAnimation?: boolean;
} & Omit<ComponentPropsWithoutRef<T>, "children">;

const wordVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 12,
    filter: "blur(4px)",
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
  },
};

export function TextReveal<T extends ElementType = "p">({
  text,
  className,
  delay = 0,
  duration = 0.4,
  staggerDelay = 0.04,
  as,
  charAnimation = false,
  ...rest
}: TextRevealProps<T>) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-30px" });

  const Component = as ?? "p";
  const MotionComponent = motion.create(Component as ElementType);

  const units = charAnimation ? text.split("") : text.split(" ");

  return (
    <MotionComponent
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      transition={{
        staggerChildren: staggerDelay,
        delayChildren: delay,
      }}
      className={cn("flex flex-wrap", className)}
      aria-label={text}
      {...rest}
    >
      {units.map((unit, index) => (
        <span
          key={`${unit}-${index}`}
          className="inline-block overflow-hidden"
        >
          <motion.span
            variants={wordVariants}
            transition={{
              duration,
              ease: [0.22, 0.61, 0.36, 1],
            }}
            className="inline-block"
          >
            {unit}
            {!charAnimation && index < units.length - 1 && (
              <span className="inline-block">&nbsp;</span>
            )}
          </motion.span>
        </span>
      ))}
    </MotionComponent>
  );
}

export default TextReveal;
