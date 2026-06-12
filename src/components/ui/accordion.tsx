"use client";

import { useState, useCallback, useId, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

/* ─── Types ─── */

export interface AccordionItem {
  id: string;
  trigger: ReactNode;
  content: ReactNode;
  disabled?: boolean;
}

export interface AccordionProps {
  items: AccordionItem[];
  /** Allow multiple items open at once */
  multiple?: boolean;
  /** IDs of initially open items */
  defaultOpen?: string[];
  className?: string;
}

/* ─── Component ─── */

function Accordion({
  items,
  multiple = false,
  defaultOpen = [],
  className,
}: AccordionProps) {
  const [openIds, setOpenIds] = useState<Set<string>>(new Set(defaultOpen));
  const baseId = useId();

  const toggle = useCallback(
    (id: string) => {
      setOpenIds((prev) => {
        const next = new Set(prev);
        if (next.has(id)) {
          next.delete(id);
        } else {
          if (!multiple) next.clear();
          next.add(id);
        }
        return next;
      });
    },
    [multiple],
  );

  return (
    <div className={cn("divide-y divide-border rounded-xl border border-border", className)}>
      {items.map((item, index) => {
        const isOpen = openIds.has(item.id);
        const triggerId = `${baseId}-trigger-${index}`;
        const panelId = `${baseId}-panel-${index}`;

        return (
          <div key={item.id}>
            {/* Trigger */}
            <button
              id={triggerId}
              type="button"
              role="button"
              aria-expanded={isOpen}
              aria-controls={panelId}
              disabled={item.disabled}
              onClick={() => toggle(item.id)}
              className={cn(
                "flex w-full items-center justify-between gap-4 px-5 py-4 text-left",
                "text-sm font-medium text-foreground transition-colors",
                "hover:bg-muted/50",
                "focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-[-2px]",
                "disabled:cursor-not-allowed disabled:opacity-50",
                index === 0 && "rounded-t-xl",
                index === items.length - 1 && !isOpen && "rounded-b-xl",
              )}
            >
              <span>{item.trigger}</span>
              <motion.span
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
                className="shrink-0 text-muted-foreground"
              >
                <ChevronDown className="size-4" />
              </motion.span>
            </button>

            {/* Panel */}
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={panelId}
                  role="region"
                  aria-labelledby={triggerId}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <div className="px-5 pb-4 pt-0 text-sm text-muted-foreground">
                    {item.content}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}

Accordion.displayName = "Accordion";

export { Accordion };
export default Accordion;
