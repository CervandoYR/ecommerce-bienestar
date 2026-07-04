"use client";

import { motion } from "framer-motion";
import { ShoppingBag, Star, ShieldCheck, Leaf, Sparkles, Heart } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface HeroSectionProps {
  settings?: any;
  title?: string | null;
  subtitle?: string | null;
  imageUrl?: string | null;
}

export function HeroSection({ settings, title, subtitle, imageUrl }: HeroSectionProps) {
  const displayTitle = title || settings?.heroTitle || "El Arte de Amarte Cada Día.";
  const displaySubtitle = subtitle || settings?.heroSubtitle || "Descubre nuestra selección curada de bienestar y aromaterapia. Ingredientes 100% naturales diseñados para armonizar tu cuerpo y alma.";
  const displayImage = imageUrl || settings?.heroImageUrl || "/samay-munay-hero.png"; 
  const buttonText = settings?.heroButtonText || "Comprar Ahora";
  const buttonLink = settings?.heroButtonLink || "/productos";
  const badgeText = settings?.heroBadgeText || "EXCELENCIA EN BIENESTAR";

  return (
    <section className="relative min-h-[calc(100vh-80px)] w-full flex items-center justify-center overflow-hidden bg-[#FAF8F5] py-12 lg:py-0">
      
      {/* Luces ambientales cálidas minimalistas de fondo */}
      <div className="absolute top-0 left-1/4 w-[40rem] h-[40rem] bg-[#e6c998]/10 rounded-full blur-3xl opacity-50 pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[30rem] h-[30rem] bg-[#2C402E]/5 rounded-full blur-3xl opacity-40 pointer-events-none" />

      {/* Grid Contenedor Principal */}
      <div className="container-narrow relative z-20 w-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-16 items-center">
          
          {/* Columna Izquierda: Contenido de Texto (Centrado en móvil, Izquierda en desktop) */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="lg:col-span-6 flex flex-col max-w-2xl mx-auto lg:mx-0 text-center lg:text-left items-center lg:items-start"
          >
            {/* Trust Badge Superior (Diminuto en móvil: text-[10px] py-1 px-3) */}
            <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1 sm:py-2 rounded-full bg-white border border-[#e8e6dd] text-[#2C402E] text-[10px] sm:text-xs font-bold uppercase tracking-widest mb-6 shadow-sm w-fit">
              <span className="flex text-[#C5A059] gap-0.5">
                <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-current" />
                <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-current" />
                <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-current" />
                <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-current" />
                <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-current" />
              </span>
              <span className="text-[#C5A059] font-light">|</span>
              <span className="text-[#2C402E] font-extrabold flex items-center gap-1">
                <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#C5A059]" /> {badgeText}
              </span>
            </div>

            {/* Gran Titular */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[4.25rem] font-black text-[#2C402E] mb-6 tracking-tight leading-[1.08]">
              <span className="block text-[#C5A059] mb-2 font-serif italic font-normal text-2xl sm:text-3xl md:text-4xl">
                Samay Munay
              </span>
              {displayTitle}
            </h1>
            
            <p className="text-base sm:text-lg md:text-xl text-[#2C402E]/80 mb-10 font-normal leading-relaxed max-w-xl">
              {displaySubtitle}
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto justify-center lg:justify-start mb-10">
              {/* Botón Principal */}
              <Link
                href={buttonLink}
                className="group flex items-center justify-center gap-3 px-8 py-4 bg-[#2C402E] text-[#FAF8F5] rounded-full font-bold text-base hover:bg-[#C5A059] hover:scale-[1.02] transition-all duration-300 shadow-xl shadow-[#2C402E]/15"
              >
                <ShoppingBag className="w-5 h-5 text-[#C5A059] group-hover:text-white transition-colors" />
                <span>{buttonText}</span>
              </Link>
              {/* Botón Secundario Ghost */}
              <Link
                href="#transformacion"
                className="flex items-center justify-center px-8 py-4 bg-transparent text-[#2C402E] border border-[#2C402E]/30 rounded-full font-semibold text-base hover:bg-[#2C402E]/5 hover:border-[#C5A059] hover:text-[#C5A059] transition-all duration-300"
              >
                La Transformación
              </Link>
            </div>

            {/* Trust Badges Estáticos (Flexbox, sin carrusel, minimalistas) */}
            <div className="flex flex-wrap justify-center lg:justify-start items-center gap-6 sm:gap-8 text-xs font-semibold text-[#2C402E]/80 pt-4 border-t border-[#2C402E]/10 w-full">
              <div className="flex items-center gap-2">
                <Leaf className="w-4 h-4 text-[#C5A059] shrink-0" />
                <span>100% Curaduría Natural</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#C5A059] shrink-0" />
                <span>Compra Segura & Protegida</span>
              </div>
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-[#C5A059] shrink-0" />
                <span>Bienestar Garantizado</span>
              </div>
            </div>
          </motion.div>

          {/* Columna Derecha: Ilustración / Imagen (Oculta en móvil above the fold: hidden lg:flex) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.2, ease: "easeOut" }}
            className="hidden lg:flex lg:col-span-6 w-full justify-end"
          >
            <div className="relative w-full max-w-lg aspect-square bg-white rounded-[2.5rem] overflow-hidden shadow-2xl shadow-stone-900/10 border border-[#e8e6dd] p-3">
              <div className="relative w-full h-full rounded-[2rem] overflow-hidden bg-warm-50">
                <Image
                  src={displayImage}
                  alt={displayTitle || "Samay Munay - Bienestar curado"}
                  fill
                  priority
                  unoptimized
                  className="object-cover transition-transform duration-700 hover:scale-105"
                />
              </div>
            </div>
          </motion.div>
          
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
