"use client";

import { useState, useEffect } from "react";
import { MessageCircle, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { buildWhatsAppUrl } from "@/lib/utils";

export function WhatsAppFAB() {
  const [isOpen, setIsOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Show tooltip after 5 seconds to grab attention
    const timer = setTimeout(() => setShowTooltip(true), 5000);
    // Hide tooltip after 15 seconds
    const hideTimer = setTimeout(() => setShowTooltip(false), 15000);
    
    return () => {
      clearTimeout(timer);
      clearTimeout(hideTimer);
    };
  }, []);

  const handleClick = () => {
    const phone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "51999999999";
    const message = "¡Hola! Vengo de la tienda online Bienestar Store y me gustaría hacer una consulta.";
    window.open(buildWhatsAppUrl(phone, message), "_blank");
  };

  if (!mounted) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4">
      <AnimatePresence>
        {showTooltip && !isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
            className="bg-white px-4 py-3 rounded-2xl shadow-lg border border-warm-100 max-w-[200px] relative"
          >
            <button 
              onClick={() => setShowTooltip(false)}
              className="absolute -top-2 -right-2 bg-warm-100 text-warm-500 rounded-full p-0.5 hover:bg-warm-200"
            >
              <X className="w-3 h-3" />
            </button>
            <p className="text-sm text-warm-700 font-medium leading-tight">
              ¿Necesitas ayuda con tu compra? ¡Escríbenos! ✨
            </p>
            {/* Triangle pointer */}
            <div className="absolute -bottom-2 right-6 w-4 h-4 bg-white border-b border-r border-warm-100 transform rotate-45" />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={handleClick}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="w-14 h-14 bg-[#25D366] hover:bg-[#128C7E] text-white rounded-full shadow-lg flex items-center justify-center transition-colors focus:outline-none focus:ring-4 focus:ring-[#25D366]/30 relative"
        aria-label="Contactar por WhatsApp"
      >
        <MessageCircle className="w-7 h-7" />
        
        {/* Pulsing ring effect */}
        <span className="absolute inset-0 rounded-full animate-ping bg-[#25D366] opacity-20 duration-1000" />
      </motion.button>
    </div>
  );
}
