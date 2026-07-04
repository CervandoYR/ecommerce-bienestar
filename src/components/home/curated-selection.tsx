"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface CuratedSelectionProps {
  settings?: any;
  className?: string;
}

export function CuratedSelection({ settings, className }: CuratedSelectionProps) {
  const categories = [
    {
      id: "termica",
      number: "01",
      name: settings?.curated1Title || "Terapia Térmica",
      tagline: "Compresas & Alivio Muscular",
      description:
        settings?.curated1Desc ||
        "Compresas calientes herbolarias y almohadillas terapéuticas seleccionadas para fundir la tensión física y relajar cuello y espalda profunda.",
      image:
        settings?.curated1Image ||
        "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=800&auto=format&fit=crop",
      link: "/productos",
    },
    {
      id: "aromaterapia",
      number: "02",
      name: settings?.curated2Title || "Aromaterapia Pura",
      tagline: "Aceites & Brumas Botánicas",
      description:
        settings?.curated2Desc ||
        "Aceites esenciales puros y brumas de almohada curadas rigurosamente por su grado terapéutico, libres de fragancias sintéticas ni rellenos.",
      image:
        settings?.curated2Image ||
        "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?q=80&w=800&auto=format&fit=crop",
      link: "/productos",
    },
    {
      id: "ambientes",
      number: "03",
      name: settings?.curated3Title || "Ambientes Serenos",
      tagline: "Difusores & Aromatizantes",
      description:
        settings?.curated3Desc ||
        "Difusores ultrasónicos de bambú y velas botánicas diseñados para purificar el aire y transformar tu hogar en un santuario de quietud.",
      image:
        settings?.curated3Image ||
        "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?q=80&w=800&auto=format&fit=crop",
      link: "/productos",
    },
  ];

  const subtitle = settings?.curatedSubtitle || "No improvisamos con tu tranquilidad. Cada producto supera un estricto filtro de pureza para entregarte únicamente herramientas que garanticen tu calma absoluta.";

  return (
    <section className={cn("py-24 sm:py-36 bg-[#FAF8F5] border-t border-warm-200/80 relative overflow-hidden", className)} id="seleccion">
      <div className="container-narrow px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        
        {/* Editorial Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16 sm:mb-24">
          <div className="max-w-xl">
            <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#C5A059] block mb-3 flex items-center gap-2 font-bold">
              <Sparkles className="w-4 h-4 text-[#C5A059]" />
              CURADURÍA RIGUROSA
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light text-[#2C402E] tracking-tight leading-tight font-serif">
              {settings?.curatedTitle || "Nuestra Selección de Bienestar"}
            </h2>
          </div>
          
          {/* Tarjeta de Manifiesto de Marca */}
          <div className="bg-[#F5F2EB]/50 p-6 rounded-xl border border-[#e8e6dd]/60 max-w-lg shadow-sm">
            <div className="border-l border-[#C5A059]/30 pl-6 space-y-2">
              <span className="text-[10px] tracking-widest text-[#C5A059] uppercase font-mono font-bold block">
                NUESTRO COMPROMISO
              </span>
              <p className="text-sm sm:text-base text-[#2C402E]/90 font-normal leading-relaxed">
                {subtitle}
              </p>
            </div>
          </div>
        </div>

        {/* 3 Large Columns separated by fine vertical lines */}
        <div className="grid grid-cols-1 md:grid-cols-3 border-t md:border-t-0 border-warm-200/80">
          {categories.map((item, index) => (
            <motion.div
              key={item.number}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className={cn(
                "py-10 md:py-8 md:px-10 lg:px-14 flex flex-col justify-between group",
                index > 0 ? "border-t md:border-t-0 md:border-l border-warm-200/80" : "md:pl-0",
                index === categories.length - 1 ? "md:pr-0" : ""
              )}
            >
              <div className="space-y-6">
                {/* Giant Editorial Number in Gold with low opacity */}
                <div className="flex items-baseline justify-between">
                  <span className="font-serif text-6xl sm:text-7xl lg:text-8xl font-extralight text-[#C5A059]/35 block transition-colors duration-500 group-hover:text-[#C5A059]">
                    {item.number}
                  </span>
                  <span className="text-xs font-mono font-semibold text-[#2C402E]/60 uppercase tracking-widest">
                    {item.tagline}
                  </span>
                </div>

                {/* Category Title */}
                <h3 className="text-2xl sm:text-3xl font-light text-[#2C402E] tracking-tight leading-snug font-serif group-hover:text-[#C5A059] transition-colors">
                  {item.name}
                </h3>

                {/* Image Preview */}
                <div className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden bg-warm-100 shadow-md border border-warm-200/60 my-6">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#2C402E]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                {/* Description */}
                <p className="text-sm sm:text-base text-[#2C402E]/80 font-normal leading-relaxed">
                  {item.description}
                </p>
              </div>

              {/* Action Link */}
              <div className="pt-8 mt-4 border-t border-warm-100/80">
                <Link
                  href={item.link}
                  className="inline-flex items-center gap-3 text-xs font-mono uppercase tracking-widest text-[#2C402E] hover:text-[#C5A059] transition-colors group/btn font-bold"
                >
                  <span>Explorar categoría</span>
                  <ArrowRight className="w-4 h-4 text-[#C5A059] transition-transform group-hover/btn:translate-x-1.5" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}

export default CuratedSelection;
