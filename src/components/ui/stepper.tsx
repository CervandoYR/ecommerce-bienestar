"use client";

import { type ReactNode } from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

/* ─── Types ─── */

export type StepStatus = "completed" | "active" | "pending";

export interface Step {
  id: string;
  title: string;
  description?: string;
  timestamp?: string;
  icon?: ReactNode;
  status: StepStatus;
}

export interface StepperProps {
  steps: Step[];
  className?: string;
}

/* ─── Status styling ─── */

const dotColors: Record<StepStatus, string> = {
  completed: "bg-primary text-primary-foreground border-primary",
  active: "bg-primary/10 text-primary border-primary ring-4 ring-primary/20",
  pending: "bg-muted text-muted-foreground border-border",
};

const lineColors: Record<StepStatus, string> = {
  completed: "bg-primary",
  active: "bg-border",
  pending: "bg-border",
};

const textColors: Record<StepStatus, string> = {
  completed: "text-foreground",
  active: "text-foreground",
  pending: "text-muted-foreground",
};

/* ─── Component ─── */

function Stepper({ steps, className }: StepperProps) {
  return (
    <div className={cn("flex flex-col", className)} role="list" aria-label="Progreso del pedido">
      {steps.map((step, index) => {
        const isLast = index === steps.length - 1;

        return (
          <div key={step.id} className="relative flex gap-4" role="listitem">
            {/* Timeline column */}
            <div className="flex flex-col items-center">
              {/* Dot / Icon */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.1, type: "spring", stiffness: 400, damping: 20 }}
                className={cn(
                  "relative z-10 flex size-9 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
                  dotColors[step.status],
                )}
              >
                {step.status === "completed" ? (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500, damping: 20, delay: index * 0.1 + 0.1 }}
                  >
                    <Check className="size-4" strokeWidth={3} />
                  </motion.span>
                ) : step.icon ? (
                  <span className="size-4">{step.icon}</span>
                ) : (
                  <span className="text-xs font-bold">{index + 1}</span>
                )}
              </motion.div>

              {/* Connecting line */}
              {!isLast && (
                <div className="relative h-full w-0.5 min-h-8">
                  <div className="absolute inset-0 bg-border" />
                  {step.status === "completed" && (
                    <motion.div
                      className={cn("absolute inset-0", lineColors[step.status])}
                      initial={{ scaleY: 0 }}
                      animate={{ scaleY: 1 }}
                      transition={{ delay: index * 0.1 + 0.15, duration: 0.3 }}
                      style={{ transformOrigin: "top" }}
                    />
                  )}
                </div>
              )}
            </div>

            {/* Content */}
            <motion.div
              className={cn("pb-8", isLast && "pb-0")}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 + 0.05 }}
            >
              <p
                className={cn(
                  "text-sm font-semibold leading-tight",
                  textColors[step.status],
                )}
              >
                {step.title}
              </p>
              {step.description && (
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {step.description}
                </p>
              )}
              {step.timestamp && (
                <p className="mt-1 text-xs text-muted-foreground/70">
                  {step.timestamp}
                </p>
              )}
            </motion.div>
          </div>
        );
      })}
    </div>
  );
}

Stepper.displayName = "Stepper";

export { Stepper };
export default Stepper;
