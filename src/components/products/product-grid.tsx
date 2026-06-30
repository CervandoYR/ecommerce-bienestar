"use client";

import { ProductCard } from "./product-card";
import { Skeleton } from "@/components/ui/skeleton";
import { motion, AnimatePresence } from "framer-motion";
import type { ProductWithCategory } from "@/types";

interface ProductGridProps {
  products: ProductWithCategory[];
  isLoading?: boolean;
  emptyMessage?: string;
}

export function ProductGrid({
  products,
  isLoading = false,
  emptyMessage = "No se encontraron productos.",
}: ProductGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex flex-col gap-3">
            <Skeleton className="w-full aspect-[4/5] rounded-2xl" />
            <Skeleton className="w-24 h-4" />
            <Skeleton className="w-full h-5" />
            <Skeleton className="w-2/3 h-5" />
            <Skeleton className="w-16 h-6 mt-2" />
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="py-20 text-center flex flex-col items-center justify-center bg-warm-50 rounded-2xl border border-warm-200 border-dashed">
        <p className="text-warm-500 text-lg mb-4">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
      <AnimatePresence mode="popLayout">
        {products.map((product, index) => {
          return (
            <motion.div
              key={product.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.4 }}
            >
              <ProductCard
                product={product}
                isPriority={index < 4}
              />
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}

export default ProductGrid;
