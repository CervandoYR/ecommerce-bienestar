"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

const categories = [
  {
    name: "Aromaterapia Clásica",
    slug: "aromaterapia",
    description: "Aceites esenciales puros y difusores de alta tecnología",
    productCount: 24,
    image: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?q=80&w=1200&auto=format&fit=crop", // Safe oil image
    className: "md:col-span-2 md:row-span-2", // Large prominent block
  },
  {
    name: "Velas & Inciensos",
    slug: "velas-inciensos",
    description: "Aromas cálidos para transformar tu espacio",
    productCount: 18,
    image: "https://images.unsplash.com/photo-1602928321679-560bb453f190?q=80&w=800&auto=format&fit=crop", // Safe candles
    className: "md:col-span-1 md:row-span-1",
  },
  {
    name: "Cuidado Corporal",
    slug: "cuidado-corporal",
    description: "Piel suave y radiante naturalmente",
    productCount: 15,
    image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=800&auto=format&fit=crop", // Safe skincare
    className: "md:col-span-1 md:row-span-2", // Tall block
  },
  {
    name: "Meditación & Yoga",
    slug: "meditacion-yoga",
    description: "Accesorios para tu paz mental",
    productCount: 12,
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=800&auto=format&fit=crop", // Safe Yoga/Lotus
    className: "md:col-span-1 md:row-span-1",
  },
];

export function CategoriesShowcase({ className }: { className?: string }) {
  return (
    <section className={cn("py-24 lg:py-32 bg-white", className)} id="categories">
      <div className="container-narrow">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex flex-col items-center text-center justify-center mb-16"
        >
          <div className="max-w-3xl">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-warm-900 mb-6 tracking-tight">
              Santuarios de <span className="text-sage-600 italic font-light">Bienestar</span>
            </h2>
            <p className="text-lg md:text-xl text-warm-600 font-light mb-8 max-w-2xl mx-auto">
              Explora nuestras colecciones curadas y encuentra los elementos perfectos para tu ritual de autocuidado diario.
            </p>
            <Link
              href="/productos"
              className="group inline-flex items-center justify-center gap-2 px-6 py-3 border-2 border-warm-200 rounded-full text-warm-900 font-medium hover:border-sage-600 hover:text-sage-600 transition-colors"
            >
              Explorar Catálogo
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </Link>
          </div>
        </motion.div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 auto-rows-[250px]">
          {categories.map((category, index) => (
            <motion.div
              key={category.slug}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={cn(
                "group relative overflow-hidden rounded-3xl bg-warm-100",
                category.className
              )}
            >
              <Link href={`/categorias/${category.slug}`} className="absolute inset-0 w-full h-full block">
                {/* Background Image with Zoom on Hover */}
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                />
                
                {/* Dark Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />

                {/* Content Overlay */}
                <div className="absolute inset-0 p-6 flex flex-col justify-end text-white">
                  <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 ease-out">
                    <h3 className="text-2xl md:text-3xl font-bold mb-2">
                      {category.name}
                    </h3>
                    <p className="text-white/80 text-sm md:text-base mb-4 line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                      {category.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-medium">
                        {category.productCount} productos
                      </span>
                      <div className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center opacity-0 group-hover:opacity-100 scale-50 group-hover:scale-100 transition-all duration-500 ease-out">
                        <ArrowUpRight className="w-5 h-5" />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default CategoriesShowcase;
