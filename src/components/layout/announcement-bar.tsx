"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

const ANNOUNCEMENT_MESSAGES = [
  "🎉 Envío gratis en pedidos mayores a S/99",
  "✨ 15% de descuento con el código BIENESTAR15",
  "🚚 Same-day delivery en SJM y alrededores",
] as const;

const CYCLE_INTERVAL_MS = 5000;

export function AnnouncementBar() {
  const [isVisible, setIsVisible] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  const advanceMessage = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % ANNOUNCEMENT_MESSAGES.length);
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    const timer = setInterval(advanceMessage, CYCLE_INTERVAL_MS);
    return () => clearInterval(timer);
  }, [isVisible, advanceMessage]);

  if (!isVisible) return null;

  return (
    <div
      className={cn(
        "relative w-full bg-gradient-to-r from-sage-600 via-sage-500 to-gold-600",
        "py-2 px-4 text-center overflow-hidden"
      )}
    >
      <div className="mx-auto max-w-7xl relative flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.p
            key={currentIndex}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="text-xs sm:text-sm font-medium text-white tracking-wide"
          >
            {ANNOUNCEMENT_MESSAGES[currentIndex]}
          </motion.p>
        </AnimatePresence>

        <button
          onClick={() => setIsVisible(false)}
          className={cn(
            "absolute right-0 top-1/2 -translate-y-1/2",
            "p-1 rounded-full text-white/70 hover:text-white",
            "hover:bg-white/10 transition-colors duration-200",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
          )}
          aria-label="Cerrar anuncios"
        >
          <X className="size-3.5" />
        </button>
      </div>
    </div>
  );
}

export default AnnouncementBar;
