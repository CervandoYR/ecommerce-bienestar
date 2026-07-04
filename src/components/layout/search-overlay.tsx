"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, Sparkles, ArrowRight } from "lucide-react";
import { useDebounce } from "@/hooks/use-debounce";
import { formatPrice } from "@/lib/utils";
import type { ProductWithCategory } from "@/types";

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ProductWithCategory[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    } else {
      setQuery("");
      setResults([]);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!debouncedQuery || debouncedQuery.trim().length < 2) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    const fetchResults = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(debouncedQuery.trim())}`);
        const data = await res.json();
        setResults(data.products || []);
      } catch (err) {
        console.error("Error fetching live search:", err);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();
  }, [debouncedQuery]);

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
          className="fixed inset-0 z-50 bg-[#FAF8F5]/98 backdrop-blur-2xl flex flex-col items-center justify-start pt-24 sm:pt-32 px-4 overflow-y-auto"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            aria-label="Cerrar búsqueda"
            className="absolute top-6 right-6 sm:top-8 sm:right-8 p-3 bg-white border border-[#e8e6dd] text-[#2C402E] rounded-full hover:bg-[#2C402E] hover:text-white hover:scale-105 transition-all duration-300 shadow-sm cursor-pointer"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          <motion.div
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -30, opacity: 0 }}
            transition={{ duration: 0.4, delay: 0.05, ease: "easeOut" }}
            className="w-full max-w-4xl pb-16"
          >
            <form onSubmit={handleSubmit} className="relative group">
              <Search className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 w-6 h-6 sm:w-8 sm:h-8 text-[#C5A059] group-focus-within:text-[#2C402E] transition-colors" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="¿Qué santuario buscas hoy?"
                className="w-full h-20 sm:h-24 pl-14 sm:pl-20 pr-8 text-2xl sm:text-4xl md:text-5xl font-light text-[#2C402E] bg-transparent border-b-2 border-[#e8e6dd] focus:outline-none focus:border-[#C5A059] placeholder:text-[#2C402E]/30 transition-colors font-serif"
              />
            </form>

            {/* Live Search Results / Skeletons / Búsquedas Populares */}
            <div className="mt-10 sm:mt-14 w-full">
              {isLoading ? (
                /* Skeleton Sutil */
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-6">
                    <Sparkles className="w-4 h-4 text-[#C5A059] animate-spin" />
                    <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#C5A059] font-bold">
                      Buscando en nuestra curaduría...
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-center gap-4 p-3 rounded-2xl bg-white/60 border border-[#e8e6dd]/60 animate-pulse">
                        <div className="w-16 h-16 rounded-xl bg-[#e8e6dd]/80 shrink-0" />
                        <div className="flex-1 space-y-2">
                          <div className="w-20 h-3 bg-[#e8e6dd] rounded" />
                          <div className="w-32 h-4 bg-[#e8e6dd] rounded" />
                          <div className="w-16 h-4 bg-[#e8e6dd] rounded" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : debouncedQuery.trim().length >= 2 ? (
                /* Resultados Predictivos */
                <div>
                  <div className="flex items-center justify-between mb-6 border-b border-[#e8e6dd]/60 pb-3">
                    <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#C5A059] font-bold flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-[#C5A059]" />
                      Resultados para &ldquo;{debouncedQuery}&rdquo;
                    </span>
                    <button
                      onClick={handleSubmit}
                      className="text-xs font-semibold text-[#2C402E] hover:text-[#C5A059] transition-colors flex items-center gap-1"
                    >
                      Ver todo ({results.length}) <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {results.length === 0 ? (
                    <div className="text-center py-12 bg-white/40 rounded-3xl border border-[#e8e6dd]/60">
                      <p className="text-base font-light text-[#5e574c] mb-2">
                        No encontramos piezas botánicas que coincidan con tu búsqueda.
                      </p>
                      <p className="text-xs font-mono text-[#C5A059]">
                        Intenta con términos como &ldquo;aromaterapia&rdquo; o &ldquo;relajación&rdquo;
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {results.map((product) => (
                        <Link
                          key={product.id}
                          href={`/productos/${product.slug}`}
                          onClick={onClose}
                          className="group flex items-center gap-4 p-3 rounded-2xl bg-white/70 hover:bg-white border border-[#e8e6dd]/80 hover:border-[#C5A059]/40 transition-all duration-300 shadow-sm hover:shadow-md"
                        >
                          <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-[#FAF8F5] shrink-0 border border-[#e8e6dd]/40">
                            {product.images?.[0] && (
                              <Image
                                src={product.images[0]}
                                alt={product.name}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <span className="text-[10px] font-mono font-semibold text-[#C5A059] uppercase tracking-wider block truncate">
                              {product.category?.name || "Bienestar"}
                            </span>
                            <h4 className="text-sm font-bold text-[#2C402E] truncate group-hover:text-[#C5A059] transition-colors">
                              {product.name}
                            </h4>
                            <span className="text-xs font-semibold text-[#2C402E] mt-0.5 block">
                              {formatPrice(product.price)}
                            </span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                /* Búsquedas Populares por Defecto */
                <div className="flex flex-col items-center pt-4">
                  <p className="text-xs font-mono text-[#5e574c] uppercase tracking-[0.25em] mb-6 font-bold">
                    Búsquedas populares en nuestra tienda
                  </p>
                  <div className="flex flex-wrap justify-center gap-3">
                    {["Aromaterapia", "Velas Aromáticas", "Difusor Botánico", "Relajación", "Cuidado Corporal"].map((term) => (
                      <button
                        key={term}
                        onClick={() => {
                          setQuery(term);
                          router.push(`/buscar?q=${encodeURIComponent(term)}`);
                          onClose();
                        }}
                        className="px-6 py-2.5 rounded-full border border-[#e8e6dd] bg-white/60 text-[#2C402E] hover:border-[#C5A059] hover:bg-[#2C402E] hover:text-[#FAF8F5] transition-all duration-300 text-sm font-medium shadow-sm cursor-pointer select-none"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default SearchOverlay;
