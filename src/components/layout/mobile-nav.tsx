"use client";

import { useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X, Leaf, Phone, Mail } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  NAV_LINKS,
  STORE_NAME,
  WHATSAPP_NUMBER,
  STORE_EMAIL,
} from "@/lib/constants";

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
} as const;

const panelVariants = {
  hidden: { x: "-100%" },
  visible: {
    x: 0,
    transition: {
      type: "spring",
      damping: 30,
      stiffness: 300,
      when: "beforeChildren",
      staggerChildren: 0.08,
    },
  },
  exit: {
    x: "-100%",
    transition: { type: "spring", damping: 30, stiffness: 300 },
  },
} as const;

const linkVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 },
} as const;

export function MobileNav({ isOpen, onClose }: MobileNavProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Panel */}
          <motion.nav
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={cn(
              "fixed inset-y-0 left-0 z-50 w-4/5 max-w-sm",
              "bg-background shadow-2xl",
              "flex flex-col"
            )}
            aria-label="Menú de navegación móvil"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-border">
              <Link
                href="/"
                onClick={onClose}
                className="flex items-center gap-2"
              >
                <div className="flex items-center justify-center size-9 rounded-lg bg-sage-100">
                  <Leaf className="size-5 text-sage-600" />
                </div>
                <span className="text-xl font-semibold text-foreground tracking-tight">
                  {STORE_NAME.split(" ")[0]}
                </span>
              </Link>
              <button
                onClick={onClose}
                className={cn(
                  "p-2 rounded-lg text-muted-foreground",
                  "hover:bg-muted hover:text-foreground",
                  "transition-colors duration-200"
                )}
                aria-label="Cerrar menú"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Navigation Links */}
            <div className="flex-1 px-6 py-8">
              <ul className="space-y-2">
                {NAV_LINKS.map((link) => (
                  <motion.li key={link.href} variants={linkVariants}>
                    <Link
                      href={link.href}
                      onClick={onClose}
                      className={cn(
                        "flex items-center px-4 py-3.5 rounded-xl",
                        "text-lg font-medium text-foreground",
                        "hover:bg-sage-50 hover:text-sage-700",
                        "transition-colors duration-200"
                      )}
                    >
                      {link.label}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <motion.div
              variants={linkVariants}
              className="px-6 py-6 border-t border-border"
            >
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-4">
                Contacto
              </p>
              <div className="space-y-3">
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "flex items-center gap-3 text-sm text-foreground",
                    "hover:text-sage-600 transition-colors duration-200"
                  )}
                >
                  <Phone className="size-4 text-sage-500" />
                  <span>+{WHATSAPP_NUMBER.slice(0, 2)} {WHATSAPP_NUMBER.slice(2, 5)} {WHATSAPP_NUMBER.slice(5)}</span>
                </a>
                <a
                  href={`mailto:${STORE_EMAIL}`}
                  className={cn(
                    "flex items-center gap-3 text-sm text-foreground",
                    "hover:text-sage-600 transition-colors duration-200"
                  )}
                >
                  <Mail className="size-4 text-sage-500" />
                  <span>{STORE_EMAIL}</span>
                </a>
              </div>
            </motion.div>
          </motion.nav>
        </>
      )}
    </AnimatePresence>
  );
}

export default MobileNav;
