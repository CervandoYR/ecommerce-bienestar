"use client";

import { useState, useEffect } from "react";
import { ShoppingBag, Heart, Sparkles, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/store/useCart";
import { useWishlist } from "@/store/useWishlist";
import { useToast } from "@/components/ui/toast";
import { cn, buildWhatsAppUrl } from "@/lib/utils";
import { WHATSAPP_NUMBER } from "@/lib/constants";
import type { Product } from "@/types";

export function ProductActions({ product, isOutOfStock }: { product: Product, isOutOfStock: boolean }) {
  const { addItem } = useCart();
  const { toggleItem, isInWishlist } = useWishlist();
  const { addToast } = useToast();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isFavorite = mounted ? isInWishlist(product.id) : false;

  if (product.isComingSoon) {
    const notifyUrl = buildWhatsAppUrl(
      WHATSAPP_NUMBER,
      `Hola Samay Munay, me gustaría estar en la lista de espera prioritaria para cuando esté disponible: *${product.name}*`
    );
    return (
      <div className="p-6 rounded-2xl bg-[#2C402E] text-[#FAF8F5] border border-[#C5A059]/40 space-y-4 shadow-lg">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono font-bold uppercase tracking-[0.2em] text-[#C5A059] flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" /> PRÓXIMO RITUAL
          </span>
          <span className="px-3 py-1 rounded-full bg-white/10 text-[10px] font-mono text-white tracking-wide">
            En Curaduría
          </span>
        </div>
        <p className="text-sm font-light text-[#FAF8F5]/90 leading-relaxed">
          Este producto de bienestar está en fase final de preparación artesanal y muy pronto formará parte de nuestra colección oficial.
        </p>
        <div className="pt-2 flex flex-col sm:flex-row gap-3">
          <Button
            asChild
            className="w-full bg-[#C5A059] hover:bg-[#b08d4b] text-[#2C402E] font-bold py-5 rounded-xl shadow-md transition-all duration-300"
          >
            <a href={notifyUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4" />
              <span>Avísame por WhatsApp (Acceso VIP)</span>
            </a>
          </Button>
        </div>
      </div>
    );
  }

  if (isOutOfStock) {
    return (
      <div className="p-4 rounded-xl bg-warm-100 text-warm-800 font-medium text-center border border-warm-200">
        Producto temporalmente agotado
      </div>
    );
  }

  const handleAddToCart = () => {
    addItem(product);
    addToast({
      type: "success",
      title: "Agregado al carrito",
      description: `${product.name} se agregó correctamente.`,
    });
  };

  const handleToggleWishlist = () => {
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
    <div className="flex flex-row items-center gap-3 w-full">
      <Button 
        size="lg" 
        icon={<ShoppingBag className="w-5 h-5 shrink-0" />}
        className="flex-1 text-sm sm:text-base font-semibold h-14 bg-sage-600 hover:bg-sage-700 text-white shadow-md hover:shadow-lg transition-all"
        onClick={handleAddToCart}
      >
        Añadir al carrito
      </Button>

      <Button 
        variant="secondary" 
        size="lg" 
        onClick={handleToggleWishlist}
        title={isFavorite ? "Eliminar de favoritos" : "Agregar a favoritos"}
        aria-label={isFavorite ? "Eliminar de favoritos" : "Agregar a favoritos"}
        className={cn(
          "w-14 h-14 shrink-0 px-0 flex items-center justify-center rounded-xl border transition-all cursor-pointer",
          isFavorite 
            ? "border-red-200 bg-red-50/80 text-red-500 hover:bg-red-100" 
            : "border-warm-200 bg-white text-warm-600 hover:bg-warm-50 hover:text-red-500"
        )}
      >
        <Heart className={cn("w-5 h-5 transition-transform duration-200", isFavorite ? "fill-red-500 text-red-500 scale-110" : "")} />
      </Button>
    </div>
  );
}
