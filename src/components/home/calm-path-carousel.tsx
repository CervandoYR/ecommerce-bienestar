"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Sparkles, ShoppingBag, Star, ShieldCheck, Truck } from "lucide-react";
import { cn, formatPrice, getDiscountPercentage } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/store/useCart";
import { useToast } from "@/components/ui/toast";

const products = [
  {
    id: "1",
    name: "Difusor Ultrasónico Bambú Premium",
    slug: "difusor-ultrasonico-bambu",
    price: 89.9,
    compareAtPrice: 129.9,
    images: ["https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?q=80&w=600&auto=format&fit=crop"],
    isNew: true,
    category: "Aromaterapia",
    benefit: "Dormir 8 horas sin interrupciones",
    rating: 4.9,
    reviewsCount: 128,
  },
  {
    id: "2",
    name: "Set Terapéutico de Aceites x6",
    slug: "set-aceites-esenciales-x6",
    price: 69.9,
    compareAtPrice: 89.9,
    images: ["https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?q=80&w=600&auto=format&fit=crop"],
    isNew: false,
    category: "Aromaterapia",
    benefit: "Alivio inmediato de estrés y ansiedad",
    rating: 5.0,
    reviewsCount: 94,
  },
  {
    id: "3",
    name: "Vela Terapéutica Soja & Lavanda",
    slug: "vela-soja-lavanda",
    price: 39.9,
    compareAtPrice: 54.9,
    images: ["https://images.unsplash.com/photo-1603006905003-be475563bc59?q=80&w=600&auto=format&fit=crop"],
    isNew: false,
    category: "Velas & Inciensos",
    benefit: "Relajación muscular y calma mental",
    rating: 4.8,
    reviewsCount: 76,
  },
  {
    id: "4",
    name: "Kit Completo Meditación Zen",
    slug: "kit-meditacion-zen",
    price: 149.9,
    compareAtPrice: 189.9,
    images: ["https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=600&auto=format&fit=crop"],
    isNew: true,
    category: "Meditación & Yoga",
    benefit: "Armonía en el hogar y foco pleno",
    rating: 4.9,
    reviewsCount: 42,
  },
  {
    id: "5",
    name: "Aceite de Jojoba 100% Orgánico",
    slug: "aceite-jojoba-organico",
    price: 45.9,
    compareAtPrice: 59.9,
    images: ["https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=600&auto=format&fit=crop"],
    isNew: false,
    category: "Cuidado Corporal",
    benefit: "Hidratación profunda y piel radiante",
    rating: 5.0,
    reviewsCount: 115,
  },
];

export function CalmPathCarousel({ className }: { className?: string }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { addItem, setIsOpen } = useCart();
  const { addToast } = useToast();

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const scrollAmount = 350;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  const handleAddToCart = (e: React.MouseEvent, product: any) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({ ...product, isActive: true }, 1);
    addToast({
      type: "success",
      title: "¡Listo para tu ritual!",
      description: `${product.name} se agregó al carrito con éxito.`,
    });
    setIsOpen(true);
  };

  return (
    <section className={cn("py-24 lg:py-32 bg-[#FAF8F5] relative overflow-hidden border-t border-[#e8e6dd]", className)} id="calm-path">
      <div className="container-narrow relative z-10">
        
        {/* Header CRO-oriented */}
        <div className="flex flex-col md:flex-row items-center md:items-end justify-between gap-6 mb-16 text-center md:text-left">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl"
          >
            <span className="inline-flex items-center gap-2 text-[#C5A059] text-xs font-bold uppercase tracking-widest px-3 py-1 bg-white rounded-full border border-[#e8e6dd] shadow-sm mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              Catálogo de Alivio
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#2C402E] tracking-tight leading-tight">
              El Camino a tu <span className="text-[#C5A059] italic font-serif">Calma</span>
            </h2>
            <p className="text-[#5e574c] mt-3 text-base sm:text-lg">
              Elige tu ritual diario para desconectar, liberar tensiones corporales y revitalizar tu mente. Envío exprés disponible.
            </p>
          </motion.div>

          {/* Controls & Trust indicators */}
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="flex items-center gap-2 text-xs text-[#2C402E] font-semibold bg-white px-3 py-2 rounded-xl border border-[#e8e6dd] shadow-xs">
              <Truck className="w-4 h-4 text-[#C5A059]" />
              <span>Envío Same-Day en Lima</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => scroll("left")}
                className="w-12 h-12 rounded-full border border-[#e8e6dd] bg-white flex items-center justify-center text-[#2C402E] hover:bg-[#2C402E] hover:text-white hover:border-[#2C402E] transition-all duration-300 hover:scale-105 shadow-sm active:scale-95"
                aria-label="Anterior"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={() => scroll("right")}
                className="w-12 h-12 rounded-full border border-[#e8e6dd] bg-white flex items-center justify-center text-[#2C402E] hover:bg-[#2C402E] hover:text-white hover:border-[#2C402E] transition-all duration-300 hover:scale-105 shadow-sm active:scale-95"
                aria-label="Siguiente"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Carousel Grid */}
        <div
          ref={scrollRef}
          className="flex gap-6 md:gap-8 overflow-x-auto no-scrollbar pb-10 -mx-4 px-4 sm:-mx-6 sm:px-6 md:mx-0 md:px-0 snap-x snap-mandatory"
        >
          {products.map((product, index) => {
            const discount = product.compareAtPrice
              ? getDiscountPercentage(product.price, product.compareAtPrice)
              : 0;

            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex-shrink-0 w-[290px] md:w-[340px] snap-start"
              >
                <div className="group h-full bg-white rounded-3xl p-5 border border-[#e8e6dd] shadow-md hover:shadow-2xl hover:border-[#C5A059]/50 transition-all duration-500 flex flex-col justify-between hover:-translate-y-1.5">
                  
                  {/* Top: Image & Badges */}
                  <div>
                    <Link href={`/productos/${product.slug}`} className="block relative aspect-[4/4] rounded-2xl overflow-hidden bg-[#FAF8F5] mb-5">
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      
                      {/* Badges */}
                      <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
                        {discount > 0 && (
                          <span className="px-3 py-1 text-xs font-extrabold bg-[#2C402E] text-white rounded-full shadow-md">
                            -{discount}%
                          </span>
                        )}
                        {product.isNew && (
                          <span className="px-3 py-1 text-xs font-bold bg-[#C5A059] text-white rounded-full shadow-md">
                            NUEVO
                          </span>
                        )}
                      </div>

                      {/* Quick Benefit Badge at bottom of image */}
                      <div className="absolute inset-x-2 bottom-2 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl text-center shadow-sm border border-[#e8e6dd]/60">
                        <span className="text-[11px] font-bold text-[#2C402E] block truncate">
                          ✨ {product.benefit}
                        </span>
                      </div>
                    </Link>

                    {/* Middle: Rating, Title & Price */}
                    <div className="px-1 mb-4">
                      {/* Rating Gold Stars */}
                      <div className="flex items-center gap-1.5 mb-2">
                        <div className="flex text-[#C5A059]">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-current" />
                          ))}
                        </div>
                        <span className="text-xs font-bold text-[#2C402E]">{product.rating}</span>
                        <span className="text-xs text-[#71685a]">({product.reviewsCount})</span>
                      </div>

                      <Link href={`/productos/${product.slug}`}>
                        <h3 className="text-lg font-bold text-[#2C402E] group-hover:text-[#C5A059] transition-colors line-clamp-2 leading-snug min-h-[48px]">
                          {product.name}
                        </h3>
                      </Link>
                    </div>
                  </div>

                  {/* Bottom: Price and High-Conversion Button */}
                  <div className="pt-4 border-t border-[#f5f4ef] space-y-4">
                    <div className="flex items-baseline justify-between">
                      <div>
                        <span className="text-xs text-[#71685a] block">Precio especial</span>
                        <span className="text-2xl font-black text-[#2C402E] tracking-tight">
                          {formatPrice(product.price)}
                        </span>
                      </div>
                      {product.compareAtPrice && (
                        <div className="text-right">
                          <span className="text-xs text-[#71685a] block">Antes</span>
                          <span className="text-sm font-semibold text-[#887e6d] line-through">
                            {formatPrice(product.compareAtPrice)}
                          </span>
                        </div>
                      )}
                    </div>

                    <button
                      onClick={(e) => handleAddToCart(e, product)}
                      className="w-full py-3.5 bg-[#2C402E] hover:bg-[#C5A059] text-white rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all duration-300 shadow-lg shadow-[#2C402E]/20 hover:shadow-[#C5A059]/30 hover:scale-[1.02] active:scale-95 group/btn"
                    >
                      <ShoppingBag className="w-4 h-4 transition-transform group-hover/btn:-translate-y-0.5" />
                      <span>Añadir al carrito</span>
                    </button>
                  </div>

                </div>
              </motion.div>
            );
          })}
        </div>

        {/* CRO Bottom CTA */}
        <div className="mt-8 text-center">
          <Link
            href="/productos"
            className="inline-flex items-center gap-2 text-sm font-extrabold text-[#2C402E] hover:text-[#C5A059] transition-colors px-6 py-3 rounded-full bg-white border border-[#e8e6dd] shadow-sm hover:shadow"
          >
            <span>Ver el Catálogo Completo de Bienestar</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </section>
  );
}
