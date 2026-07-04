"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ShoppingBag, Leaf, Heart } from "lucide-react";
import { cn, formatPrice, getDiscountPercentage } from "@/lib/utils";
import { useCart } from "@/store/useCart";
import { useWishlist } from "@/store/useWishlist";
import { useToast } from "@/components/ui/toast";
import type { ProductWithCategory } from "@/types";

interface ProductCardProps {
  product: ProductWithCategory;
  className?: string;
  isPriority?: boolean;
}

export function ProductCard({ product, className, isPriority = false }: ProductCardProps) {
  const discount = product.compareAtPrice
    ? getDiscountPercentage(product.price, product.compareAtPrice)
    : 0;

  const isNew = (() => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return new Date(product.createdAt) > thirtyDaysAgo;
  })();

  const { addItem, setIsOpen } = useCart();
  const { toggleItem, isInWishlist } = useWishlist();
  const { addToast } = useToast();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isFavorite = mounted ? isInWishlist(product.id) : false;
  const isOutOfStock = product.stock <= 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({ ...product, isActive: true }, 1);
    addToast({
      type: "success",
      title: "Agregado al carrito",
      description: `${product.name} se agregó correctamente.`,
    });
    setIsOpen(true);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const added = toggleItem(product);
    if (added) {
      addToast({
        type: "success",
        title: "Agregado a favoritos",
        description: `${product.name} se guardó en tu lista de deseos.`,
      });
    } else {
      addToast({
        type: "info",
        title: "Eliminado de favoritos",
        description: `${product.name} se eliminó de tu lista de deseos.`,
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.4 }}
      className={cn(
        "group block relative bg-white rounded-2xl sm:rounded-3xl p-3 sm:p-4 transition-all duration-300 hover:shadow-xl hover:shadow-[#2C402E]/5 border border-warm-100 hover:border-[#C5A059]/40 flex flex-col justify-between h-full",
        className
      )}
    >
      <Link href={`/productos/${product.slug}`} className="flex flex-col justify-between h-full">
        <div>
          {/* Image Container */}
          <div className="relative aspect-square rounded-xl sm:rounded-2xl overflow-hidden bg-[#FAF8F5] mb-3 sm:mb-4">
            {(!product.images || product.images.length === 0) ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <Leaf className="w-12 h-12 text-sage-200" />
              </div>
            ) : (
              <>
                <Image
                  src={product.images[0]}
                  alt={product.name}
                  fill
                  priority={isPriority}
                  className={cn(
                    "object-cover object-center transition-opacity duration-500 ease-in-out",
                    product.images[1] ? "group-hover:opacity-0" : ""
                  )}
                />
                {product.images[1] && (
                  <Image
                    src={product.images[1]}
                    alt={`${product.name} vista alterna o textura`}
                    fill
                    className="object-cover object-center opacity-0 transition-opacity duration-500 ease-in-out group-hover:opacity-100"
                  />
                )}
              </>
            )}

            {/* Badges superiores alineados horizontalmente (Oro & Verde Bosque) */}
            <div className="absolute top-2.5 sm:top-3 left-2.5 sm:left-3 flex flex-wrap gap-1.5 sm:gap-2 z-10 items-center pointer-events-none">
              {product.isComingSoon ? (
                <span className="px-2 py-0.5 sm:py-1 text-[10px] font-bold bg-[#2C402E] text-[#FAF8F5] rounded shadow-sm uppercase tracking-wider">
                  PRÓXIMAMENTE
                </span>
              ) : isOutOfStock ? (
                <span className="px-2 py-0.5 sm:py-1 text-[10px] font-bold bg-[#2C402E] text-[#FAF8F5] rounded shadow-sm uppercase tracking-wider">
                  AGOTADO
                </span>
              ) : (
                <>
                  {product.isFeatured && (
                    <span className="px-2 py-0.5 sm:py-1 text-[10px] font-bold bg-[#2C402E] text-[#FAF8F5] rounded shadow-sm uppercase tracking-wider">
                      MÁS VENDIDO
                    </span>
                  )}
                  {isNew && !product.isFeatured && (
                    <span className="px-2 py-0.5 sm:py-1 text-[10px] font-bold bg-[#FAF8F5]/95 backdrop-blur-md text-[#2C402E] rounded shadow-sm border border-[#e8e6dd] uppercase tracking-wider">
                      NUEVO
                    </span>
                  )}
                  {discount > 0 && (
                    <span className="px-2 py-0.5 sm:py-1 text-[10px] font-bold bg-[#C5A059] text-[#FAF8F5] rounded shadow-sm tracking-wider">
                      -{discount}%
                    </span>
                  )}
                </>
              )}
            </div>

            {/* Wishlist Button (Cristal / Verde Bosque) */}
            <button
              onClick={handleToggleWishlist}
              aria-label={isFavorite ? "Eliminar de favoritos" : "Agregar a favoritos"}
              className={cn(
                "absolute top-2.5 sm:top-3 right-2.5 sm:right-3 z-10 p-2 sm:p-2.5 rounded-full backdrop-blur-md transition-all duration-300 shadow-sm cursor-pointer border border-white/40",
                isFavorite
                  ? "bg-white/90 text-[#2C402E] scale-105"
                  : "bg-white/50 text-[#2C402E]/70 hover:bg-white/80 hover:text-[#2C402E] opacity-90 sm:opacity-80 group-hover:opacity-100"
              )}
            >
              <Heart className={cn("w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform duration-200", isFavorite ? "fill-[#2C402E] text-[#2C402E] scale-110" : "text-[#2C402E]/80")} />
            </button>
          </div>

          {/* Categoría y Título con line-clamp-2 */}
          <div className="px-1">
            <span className="text-[10px] sm:text-xs font-mono font-semibold text-[#C5A059] uppercase tracking-wider mb-1 block">
              {product.category?.name || "Bienestar"}
            </span>
            <h3 className="text-xs sm:text-base font-bold text-[#2C402E] group-hover:text-[#C5A059] transition-colors line-clamp-2 leading-snug">
              {product.name}
            </h3>
          </div>
        </div>

        {/* Precio y Botón Quick Add / Próximamente */}
        <div className="px-1 pt-3 mt-3 border-t border-warm-100 flex items-center justify-between gap-2">
          {product.isComingSoon ? (
            <>
              <span className="text-xs sm:text-sm font-serif italic text-[#5e574c]">
                Disponible pronto
              </span>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  addToast({
                    type: "info",
                    title: "Notificación programada",
                    description: `Te avisaremos en cuanto ${product.name} esté disponible.`,
                  });
                }}
                className="px-3 py-1 sm:py-1.5 rounded-full border border-[#C5A059] text-[#2C402E] hover:bg-[#2C402E] hover:text-[#FAF8F5] hover:border-[#2C402E] transition-all duration-300 text-xs font-medium tracking-wide shadow-sm cursor-pointer shrink-0"
              >
                Avísame
              </button>
            </>
          ) : (
            <>
              <div className="flex flex-wrap items-baseline gap-1 sm:gap-1.5">
                <span className="text-sm sm:text-lg font-bold text-[#2C402E]">
                  {formatPrice(product.price)}
                </span>
                {product.compareAtPrice && product.compareAtPrice > product.price && (
                  <span className="text-[11px] sm:text-sm text-warm-400 line-through font-normal">
                    {formatPrice(product.compareAtPrice)}
                  </span>
                )}
              </div>

              {!isOutOfStock && (
                <motion.button
                  whileTap={{ scale: 0.88 }}
                  onClick={handleAddToCart}
                  aria-label="Agregar al carrito"
                  title="Compra Rápida"
                  className="shrink-0 h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-[#2C402E] text-[#FAF8F5] hover:bg-[#C5A059] hover:text-white transition-all duration-300 flex items-center justify-center shadow-sm hover:shadow-md hover:scale-105 cursor-pointer"
                >
                  <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                </motion.button>
              )}
            </>
          )}
        </div>
      </Link>
    </motion.div>
  );
}

export default ProductCard;
