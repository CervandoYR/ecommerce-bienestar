"use client";

import {
  useEffect,
  useCallback,
  useRef,
  useState,
  type ReactNode,
  type KeyboardEvent,
} from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

/* ─── Types ─── */

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  footer?: ReactNode;
  /** Max width class */
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeClasses = {
  sm: "max-w-sm",
  md: "max-w-lg",
  lg: "max-w-2xl",
} as const;

/* ─── Animation variants ─── */

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 12 },
  visible: { opacity: 1, scale: 1, y: 0 },
};

/* ─── Component ─── */

function Modal({
  open,
  onClose,
  title,
  children,
  footer,
  size = "md",
  className,
}: ModalProps) {
  const [mounted, setMounted] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  /* Lock body scroll */
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  /* Escape key */
  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      if (e.key === "Escape") {
        onClose();
      }
    },
    [onClose],
  );

  /* Focus modal on open */
  useEffect(() => {
    if (open && modalRef.current) {
      modalRef.current.focus();
    }
  }, [open]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
          onKeyDown={handleKeyDown}
          role="dialog"
          aria-modal="true"
          aria-label={title ?? "Modal"}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{ duration: 0.2 }}
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Modal panel */}
          <motion.div
            ref={modalRef}
            tabIndex={-1}
            className={cn(
              "relative z-10 flex w-full flex-col overflow-hidden rounded-3xl bg-white shadow-2xl outline-none border border-warm-200",
              sizeClasses[size],
              className,
            )}
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{ type: "spring", stiffness: 400, damping: 28 }}
          >
            {/* Header */}
            {title && (
              <div className="flex items-center justify-between border-b border-warm-100 px-6 py-4 bg-warm-50/50">
                <h2 className="text-lg font-bold text-[#2C402E] font-serif">
                  {title}
                </h2>
                <button
                  onClick={onClose}
                  className={cn(
                    "flex size-8 items-center justify-center rounded-lg",
                    "text-warm-400 transition-colors hover:bg-warm-100 hover:text-[#2C402E]",
                    "focus-visible:outline-2 focus-visible:outline-ring cursor-pointer",
                  )}
                  aria-label="Cerrar modal"
                >
                  <X className="size-5" />
                </button>
              </div>
            )}

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-6 py-5">{children}</div>

            {/* Footer */}
            {footer && (
              <div className="flex items-center justify-end gap-3 border-t border-warm-100 px-6 py-4 bg-warm-50/30">
                {footer}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}

Modal.displayName = "Modal";

export { Modal };
export default Modal;
