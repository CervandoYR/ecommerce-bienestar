"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, Trash2, Heart, ShoppingBag, Sparkles, ArrowRight } from "lucide-react";
import { useWishlist } from "@/store/useWishlist";
import { useCart } from "@/store/useCart";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";

export function WishlistDrawer() {
  const { items, isOpen, setIsOpen, removeItem, clearWishlist } = useWishlist();
  const { addItem } = useCart();
  const { addToast } = useToast();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    useWishlist.persist.rehydrate();
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const handleAddToCart = (product: any) => {
    addItem({ ...product, isActive: true }, 1);
    addToast({
      type: "success",
      title: "Agregado al carrito",
      description: `${product.name} se agregó correctamente.`,
    });
    setIsOpen(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-warm-900/40 backdrop-blur-sm z-50"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 w-full max-w-md bg-[#FAF8F5] shadow-2xl z-50 flex flex-col border-l border-warm-200"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 bg-white border-b border-warm-100 shadow-sm">
              <div>
                <span className="text-[11px] font-bold text-gold-600 uppercase tracking-widest flex items-center gap-1.5 mb-0.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  Curaduría Personalizada
                </span>
                <h2 className="text-xl font-bold text-warm-900 flex items-center gap-2 font-serif">
                  Tus Favoritos de Bienestar
                </h2>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 text-warm-500 hover:text-warm-800 hover:bg-warm-100 rounded-full transition-colors cursor-pointer"
                aria-label="Cerrar favoritos"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            {items.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-gradient-to-b from-transparent to-white/50">
                <div className="max-w-xs space-y-4">
                  <div className="inline-flex items-center justify-center p-4 bg-white rounded-2xl shadow-sm border border-warm-100 mb-2">
                    <Heart className="w-8 h-8 text-gold-500 fill-gold-500/20" />
                  </div>
                  <h3 className="text-xl font-bold text-warm-900 font-serif tracking-tight">
                    Tu santuario de calma está vacío
                  </h3>
                  <p className="text-warm-600 text-sm leading-relaxed font-light">
                    Explora nuestra colección curada y guarda aquí los rituales, aromas y terapias que resuenan con tu paz interior.
                  </p>
                  <div className="pt-4">
                    <Button
                      onClick={() => setIsOpen(false)}
                      className="bg-sage-700 hover:bg-sage-800 text-white w-full h-12 font-medium shadow-md hover:shadow-lg transition-all"
                      asChild
                    >
                      <Link href="/productos" className="flex items-center justify-center gap-2">
                        <span>Descubrir Colección</span>
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  {items.map((product) => {
                    const imageUrl = product.images?.[0] || "/placeholder.png";
                    return (
                      <motion.div
                        key={product.id}
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="bg-white p-4 rounded-2xl border border-warm-100 shadow-sm hover:shadow-md transition-all flex gap-4 items-center"
                      >
                        {/* Image */}
                        <Link
                          href={`/productos/${product.slug}`}
                          onClick={() => setIsOpen(false)}
                          className="relative w-20 h-20 rounded-xl overflow-hidden bg-warm-50 shrink-0 border border-warm-100 group"
                        >
                          <Image
                            src={imageUrl}
                            alt={product.name}
                            fill
                            className="object-cover object-center group-hover:scale-105 transition-transform duration-300"
                          />
                        </Link>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <Link
                            href={`/productos/${product.slug}`}
                            onClick={() => setIsOpen(false)}
                            className="text-sm font-bold text-warm-900 hover:text-sage-700 transition-colors line-clamp-1 block font-serif"
                          >
                            {product.name}
                          </Link>
                          <div className="text-sm font-bold text-gold-600 mt-1">
                            {formatPrice(product.price)}
                          </div>

                          <div className="flex items-center gap-2 mt-3">
                            <Button
                              size="sm"
                              icon={<ShoppingBag className="w-3.5 h-3.5 shrink-0" />}
                              className="bg-sage-700 hover:bg-sage-800 text-white h-8 px-3 text-xs font-semibold shadow-sm"
                              onClick={() => handleAddToCart(product)}
                            >
                              Al carrito
                            </Button>

                            <button
                              onClick={() => removeItem(product.id)}
                              className="text-warm-400 hover:text-red-500 p-2 rounded-lg hover:bg-red-50 transition-colors cursor-pointer ml-auto"
                              title="Eliminar de favoritos"
                              aria-label="Eliminar de favoritos"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Footer */}
                <div className="p-6 bg-white border-t border-warm-100 shadow-lg">
                  <button
                    onClick={clearWishlist}
                    className="w-full text-center text-xs font-semibold text-warm-500 hover:text-red-600 transition-colors py-2 cursor-pointer"
                  >
                    Vaciar lista de favoritos
                  </button>
                </div>
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
