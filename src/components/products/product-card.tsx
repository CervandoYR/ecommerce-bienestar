"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ShoppingBag, Leaf } from "lucide-react";
import { cn, formatPrice, getDiscountPercentage } from "@/lib/utils";
import { useCart } from "@/store/useCart";
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
  const { addToast } = useToast();

  const isOutOfStock = product.stock <= 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigating to PDP
    addItem({ ...product, isActive: true }, 1);
    addToast({
      type: "success",
      title: "Agregado al carrito",
      description: `${product.name} se agregó correctamente.`,
    });
    setIsOpen(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.5 }}
      className={cn(
        "group block relative bg-white rounded-3xl p-4 transition-all duration-500 hover:shadow-2xl hover:shadow-sage-900/5 border border-transparent hover:border-warm-200",
        className
      )}
    >
      <Link href={`/productos/${product.slug}`} className="block">
        {/* Image Container */}
        <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-warm-100 mb-6">
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
                  "object-cover transition-opacity duration-300",
                  product.images[1] ? "group-hover:opacity-0" : ""
                )}
              />
              {product.images[1] && (
                <Image
                  src={product.images[1]}
                  alt={`${product.name} alternate view`}
                  fill
                  className="object-cover opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                />
              )}
            </>
          )}

          {/* Add to Cart Button (Reveals on hover) */}
          {!isOutOfStock && (
            <div className="absolute inset-x-4 bottom-4 translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 ease-out z-20">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleAddToCart}
                className="w-full py-3 bg-white/95 backdrop-blur-sm text-warm-900 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-sage-600 hover:text-white transition-colors duration-300 shadow-lg cursor-pointer border border-warm-100"
              >
                <ShoppingBag className="w-4 h-4" />
                Agregar al Carrito
              </motion.button>
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-4 left-4 flex flex-col gap-2 z-10 items-start">
            {isOutOfStock ? (
              <span className="px-3 py-1.5 text-xs font-bold bg-warm-800 text-white rounded-full shadow-sm">
                AGOTADO
              </span>
            ) : (
              <>
                {product.isFeatured && (
                  <span className="px-3 py-1.5 text-xs font-bold bg-[#ff9900] text-white rounded-md shadow-sm tracking-wide">
                    MÁS VENDIDO
                  </span>
                )}
                {isNew && !product.isFeatured && (
                  <span className="px-3 py-1.5 text-xs font-bold bg-white text-warm-900 rounded-full shadow-sm">
                    NUEVO
                  </span>
                )}
                {discount > 0 && (
                  <span className="px-3 py-1.5 text-xs font-bold bg-sage-600 text-white rounded-full shadow-sm">
                    -{discount}%
                  </span>
                )}
              </>
            )}
          </div>
        </div>

        {/* Product Info */}
        <div className="px-2">
          <span className="text-xs font-semibold text-sage-600 uppercase tracking-wider mb-2 block">
            {product.category?.name}
          </span>
          <h3 className="text-lg font-bold text-warm-900 mb-1 group-hover:text-sage-700 transition-colors line-clamp-2">
            {product.name}
          </h3>
          
          {/* Estrellas de Valoración (Estilo Amazon) */}
          <div className="flex items-center gap-1 mb-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <svg key={star} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
            <span className="text-xs text-warm-500 ml-1">(4.8)</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xl font-bold text-warm-900">
              {formatPrice(product.price)}
            </span>
            {product.compareAtPrice && product.compareAtPrice > product.price && (
              <span className="text-sm text-warm-400 line-through">
                {formatPrice(product.compareAtPrice)}
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export default ProductCard;
