"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ChevronLeft, ChevronRight, Sparkles, ShoppingBag } from "lucide-react";
import { cn, formatPrice, getDiscountPercentage } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/store/useCart";
import { useToast } from "@/components/ui/toast";

const featuredProducts = [
  {
    id: "1",
    name: "Difusor Ultrasónico Bambú",
    slug: "difusor-ultrasonico-bambu",
    price: 89.9,
    compareAtPrice: 129.9,
    images: ["https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?q=80&w=600&auto=format&fit=crop"],
    isNew: true,
    category: "Aromaterapia",
    stock: 10,
  },
  {
    id: "2",
    name: "Set de Aceites Esenciales x6",
    slug: "set-aceites-esenciales-x6",
    price: 69.9,
    compareAtPrice: null,
    images: ["https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?q=80&w=600&auto=format&fit=crop"],
    isNew: false,
    category: "Aromaterapia",
    stock: 5,
  },
  {
    id: "3",
    name: "Vela de Soja Lavanda",
    slug: "vela-soja-lavanda",
    price: 39.9,
    compareAtPrice: 54.9,
    images: ["https://images.unsplash.com/photo-1603006905003-be475563bc59?q=80&w=600&auto=format&fit=crop"],
    isNew: false,
    category: "Velas & Inciensos",
    stock: 12,
  },
  {
    id: "4",
    name: "Kit de Meditación Zen",
    slug: "kit-meditacion-zen",
    price: 149.9,
    compareAtPrice: null,
    images: ["https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=600&auto=format&fit=crop"],
    isNew: true,
    category: "Meditación & Yoga",
    stock: 8,
  },
  {
    id: "5",
    name: "Aceite de Jojoba Orgánico",
    slug: "aceite-jojoba-organico",
    price: 45.9,
    compareAtPrice: 59.9,
    images: ["https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=600&auto=format&fit=crop"],
    isNew: false,
    category: "Cuidado Corporal",
    stock: 20,
  },
];

export function FeaturedProducts({ className }: { className?: string }) {
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
    e.preventDefault(); // Prevent navigating to product page
    addItem({ ...product, isActive: true }, 1);
    addToast({
      type: "success",
      title: "Agregado al carrito",
      description: `${product.name} se agregó correctamente.`,
    });
    setIsOpen(true);
  };

  return (
    <section className={cn("py-24 lg:py-32 bg-warm-50 relative overflow-hidden", className)} id="featured">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-sage-200/40 rounded-full blur-3xl pointer-events-none" />
      
      <div className="container-narrow relative z-10">
        <div className="flex flex-col md:flex-row items-center md:items-end justify-between gap-6 mb-12 text-center md:text-left">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center md:items-start"
          >
            <span className="inline-flex items-center gap-2 text-sage-600 text-sm font-semibold uppercase tracking-widest mb-3">
              <Sparkles className="w-4 h-4" />
              Nuestra Selección
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-warm-900 tracking-tight">
              Los Favoritos
            </h2>
          </motion.div>

          {/* Navigation Controls */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => scroll("left")}
              className="w-12 h-12 rounded-full border border-warm-200 bg-white flex items-center justify-center text-warm-600 hover:bg-sage-600 hover:text-white hover:border-sage-600 transition-all duration-300 hover:scale-105 shadow-sm"
              aria-label="Anterior"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={() => scroll("right")}
              className="w-12 h-12 rounded-full border border-warm-200 bg-white flex items-center justify-center text-warm-600 hover:bg-sage-600 hover:text-white hover:border-sage-600 transition-all duration-300 hover:scale-105 shadow-sm"
              aria-label="Siguiente"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Carousel */}
        <div
          ref={scrollRef}
          className="flex gap-6 md:gap-8 overflow-x-auto no-scrollbar pb-10 -mx-4 px-4 sm:-mx-6 sm:px-6 md:mx-0 md:px-0 snap-x snap-mandatory"
        >
          {featuredProducts.map((product, index) => {
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
                className="flex-shrink-0 w-[280px] md:w-[320px] snap-start"
              >
                <Link
                  href={`/productos/${product.slug}`}
                  className="group block relative bg-white rounded-3xl p-4 transition-all duration-500 hover:shadow-2xl hover:shadow-sage-900/5 hover:-translate-y-2 border border-transparent hover:border-warm-200"
                >
                  {/* Image Container */}
                  <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-warm-100 mb-6">
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    
                    {/* Dark overlay on hover */}
                    <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {/* Add to Cart Button (Reveals on hover) */}
                    <div className="absolute inset-x-4 bottom-4 translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 ease-out z-20">
                      <button
                        onClick={(e) => handleAddToCart(e, product)}
                        className="w-full py-3.5 bg-white/95 backdrop-blur-sm text-warm-900 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-sage-600 hover:text-white transition-colors duration-300 shadow-lg"
                      >
                        <ShoppingBag className="w-5 h-5" />
                        Agregar al Carrito
                      </button>
                    </div>

                    {/* Badges */}
                    <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
                      {product.isNew && (
                        <span className="px-3 py-1.5 text-xs font-bold bg-white text-warm-900 rounded-full shadow-sm">
                          NUEVO
                        </span>
                      )}
                      {discount > 0 && (
                        <span className="px-3 py-1.5 text-xs font-bold bg-sage-600 text-white rounded-full shadow-sm">
                          -{discount}%
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="px-2">
                    <span className="text-xs font-semibold text-sage-600 uppercase tracking-wider mb-2 block">
                      {product.category}
                    </span>
                    <h3 className="text-lg font-bold text-warm-900 mb-2 group-hover:text-sage-700 transition-colors line-clamp-2">
                      {product.name}
                    </h3>
                    <div className="flex items-center gap-3">
                      <span className="text-xl font-bold text-warm-900">
                        {formatPrice(product.price)}
                      </span>
                      {product.compareAtPrice && (
                        <span className="text-sm text-warm-400 line-through">
                          {formatPrice(product.compareAtPrice)}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default FeaturedProducts;
