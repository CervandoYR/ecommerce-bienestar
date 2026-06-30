"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

interface PromoModalProps {
  active: boolean;
  image?: string | null;
  title?: string | null;
  text?: string | null;
  link?: string | null;
}

export function PromoModal({ active, image, title, text, link }: PromoModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!active) return;

    // Check frequency capping (24 hours)
    const lastSeen = localStorage.getItem("samay_promo_seen_date");
    if (lastSeen) {
      const now = new Date().getTime();
      const lastSeenTime = parseInt(lastSeen, 10);
      const hoursPassed = (now - lastSeenTime) / (1000 * 60 * 60);
      
      if (hoursPassed < 24) {
        return; // Has seen it in the last 24h
      }
    }

    // Show after 6 seconds
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 6000);

    return () => clearTimeout(timer);
  }, [active]);

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem("samay_promo_seen_date", new Date().getTime().toString());
  };

  if (!active) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[9999]"
          />

          {/* Modal Container */}
          <div className="fixed inset-0 z-[10000] flex items-end sm:items-center justify-center p-4 sm:p-6 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, y: 100, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.95 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-3xl bg-white rounded-3xl sm:rounded-[2rem] shadow-2xl overflow-hidden pointer-events-auto flex flex-col sm:flex-row max-h-[85vh] sm:max-h-[600px]"
            >
              {/* Close Button */}
              <button
                onClick={handleClose}
                className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 w-10 h-10 flex items-center justify-center bg-white/80 hover:bg-white backdrop-blur-md rounded-full shadow-sm text-warm-500 hover:text-warm-900 transition-colors"
                aria-label="Cerrar modal promocional"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Image Section */}
              {image && (
                <div className="relative w-full sm:w-2/5 h-48 sm:h-auto shrink-0 bg-warm-100">
                  <Image
                    src={image}
                    alt={title || "Promoción Especial"}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, 40vw"
                  />
                </div>
              )}

              {/* Content Section */}
              <div className="flex-1 p-6 sm:p-10 flex flex-col justify-center bg-[#FAF8F5]">
                <h3 className="text-2xl sm:text-3xl font-black text-warm-900 mb-4 leading-tight">
                  {title || "¡Oferta Especial!"}
                </h3>
                
                {text && (
                  <p className="text-warm-600 mb-8 text-sm sm:text-base leading-relaxed whitespace-pre-wrap">
                    {text}
                  </p>
                )}

                <div className="mt-auto sm:mt-0">
                  <Link
                    href={link || "/productos"}
                    onClick={handleClose}
                    className="inline-flex w-full sm:w-auto items-center justify-center px-8 py-4 bg-sage-600 hover:bg-sage-700 text-white font-bold rounded-xl transition-all hover:scale-105 active:scale-95 shadow-lg shadow-sage-600/20"
                  >
                    Ver Promoción
                  </Link>
                  <button 
                    onClick={handleClose}
                    className="w-full text-center mt-4 text-xs font-semibold text-warm-400 hover:text-warm-600 transition-colors uppercase tracking-wider"
                  >
                    No, gracias
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
