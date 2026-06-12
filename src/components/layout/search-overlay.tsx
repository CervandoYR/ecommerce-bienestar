"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X } from "lucide-react";

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const [query, setQuery] = useState("");
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    } else {
      setQuery("");
    }
  }, [isOpen]);

  // Lock body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/buscar?q=${encodeURIComponent(query.trim())}`);
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 bg-white/95 backdrop-blur-xl flex flex-col items-center justify-start pt-32 px-4"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-8 right-8 p-3 bg-warm-100 text-warm-900 rounded-full hover:bg-warm-200 hover:scale-110 transition-all duration-300"
          >
            <X className="w-6 h-6" />
          </button>

          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" }}
            className="w-full max-w-4xl"
          >
            <form onSubmit={handleSubmit} className="relative group">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-8 h-8 text-warm-400 group-focus-within:text-sage-600 transition-colors" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="¿Qué estás buscando hoy?"
                className="w-full h-24 pl-20 pr-8 text-3xl md:text-5xl font-light text-warm-900 bg-transparent border-b-2 border-warm-200 focus:outline-none focus:border-sage-600 placeholder:text-warm-300 transition-colors"
              />
            </form>

            <div className="mt-12 flex flex-col items-center">
              <p className="text-sm font-medium text-warm-500 uppercase tracking-widest mb-6">
                Búsquedas populares
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                {["Aceite de Lavanda", "Velas Aromáticas", "Difusor", "Yoga"].map((term) => (
                  <button
                    key={term}
                    onClick={() => {
                      setQuery(term);
                      router.push(`/buscar?q=${encodeURIComponent(term)}`);
                      onClose();
                    }}
                    className="px-6 py-2 rounded-full border border-warm-200 text-warm-700 hover:border-sage-600 hover:text-sage-600 transition-colors text-lg font-light"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
