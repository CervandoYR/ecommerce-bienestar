"use client";

import { useState, useId, type ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

/* ─── Types ─── */

export interface Tab {
  id: string;
  label: ReactNode;
  content: ReactNode;
  disabled?: boolean;
}

export interface TabsProps {
  tabs: Tab[];
  /** Controlled active tab id */
  activeTab?: string;
  /** Callback when tab changes */
  onTabChange?: (id: string) => void;
  /** Default tab id (uncontrolled) */
  defaultTab?: string;
  className?: string;
}

/* ─── Component ─── */

function Tabs({
  tabs,
  activeTab: controlledActive,
  onTabChange,
  defaultTab,
  className,
}: TabsProps) {
  const layoutId = useId();
  const [internalActive, setInternalActive] = useState(
    defaultTab ?? tabs[0]?.id ?? "",
  );

  const activeId = controlledActive ?? internalActive;

  const handleTabChange = (id: string) => {
    if (!controlledActive) {
      setInternalActive(id);
    }
    onTabChange?.(id);
  };

  const activeContent = tabs.find((t) => t.id === activeId)?.content;

  return (
    <div className={cn("flex flex-col", className)}>
      {/* Tab list */}
      <div
        role="tablist"
        aria-orientation="horizontal"
        className="relative flex border-b border-border"
      >
        {tabs.map((tab) => {
          const isActive = tab.id === activeId;

          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              id={`${layoutId}-tab-${tab.id}`}
              aria-selected={isActive}
              aria-controls={`${layoutId}-panel-${tab.id}`}
              tabIndex={isActive ? 0 : -1}
              disabled={tab.disabled}
              onClick={() => handleTabChange(tab.id)}
              className={cn(
                "relative px-4 py-2.5 text-sm font-medium transition-colors",
                "focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-[-2px] rounded-t-md",
                "disabled:cursor-not-allowed disabled:opacity-50",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {tab.label}

              {/* Animated active indicator */}
              {isActive && (
                <motion.span
                  layoutId={`${layoutId}-indicator`}
                  className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-primary"
                  transition={{ type: "spring", stiffness: 400, damping: 28 }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Tab panel */}
      <div
        role="tabpanel"
        id={`${layoutId}-panel-${activeId}`}
        aria-labelledby={`${layoutId}-tab-${activeId}`}
        tabIndex={0}
        className="pt-4"
      >
        {activeContent}
      </div>
    </div>
  );
}

Tabs.displayName = "Tabs";

export { Tabs };
export default Tabs;
