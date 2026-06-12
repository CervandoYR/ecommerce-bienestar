"use client";

import { ShoppingCart, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/store/useCart";
import type { Product } from "@/types";

export function ProductActions({ product, isOutOfStock }: { product: Product, isOutOfStock: boolean }) {
  const { addItem } = useCart();

  if (isOutOfStock) {
    return (
      <div className="p-4 rounded-xl bg-warm-100 text-warm-800 font-medium text-center border border-warm-200">
        Producto temporalmente agotado
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <Button 
        size="lg" 
        className="flex-1 text-base h-14 bg-sage-600 hover:bg-sage-700 text-white"
        onClick={() => addItem(product)}
      >
        <ShoppingCart className="w-5 h-5 mr-2" />
        Añadir al carrito
      </Button>
      <Button variant="secondary" size="lg" className="w-14 h-14 shrink-0 px-0 flex items-center justify-center">
        <Heart className="w-5 h-5 text-warm-600" />
      </Button>
    </div>
  );
}
