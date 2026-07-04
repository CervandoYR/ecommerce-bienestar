"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { formatPrice } from "@/lib/utils";

interface TransformationBentoProps {
  settings?: any;
  className?: string;
}

export function TransformationBento({ settings }: TransformationBentoProps) {
  const title = settings?.bentoTitle || "Diseñamos tu santuario personal en casa.";
  const subtitle = settings?.bentoSubtitle || "Convierte tu hogar en el único lugar donde el estrés no tiene permiso para entrar. Nuestra selección de rituales térmicos y aromas botánicos está diseñada para apagar tu mente y recuperar tu energía.";
  const image = settings?.bentoImage || "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=1200&auto=format&fit=crop";

  const card2Title = settings?.bentoCard2Title || "Sueño Ininterrumpido";
  const card2Desc = settings?.bentoCard2Desc || "Difusor Ultrasónico + Aceite de Lavanda de curaduría seleccionada.";
  const card2Image = settings?.bentoCard2Image || "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?q=80&w=600&auto=format&fit=crop";

  const card3Title = settings?.bentoCard3Title || "Alivio Inmediato";
  const card3Desc = settings?.bentoCard3Desc || "Set Terapéutico x6 Aceites seleccionados rigurosamente sin rellenos sintéticos.";
  const card3Image = settings?.bentoCard3Image || "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?q=80&w=600&auto=format&fit=crop";

  return (
    <section className="py-24 lg:py-36 bg-[#FAF8F5] relative overflow-hidden" id="transformacion">
      <div className="container-narrow px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        
        {/* Editorial Minimalist Header */}
        <div className="max-w-3xl mb-16 lg:mb-24">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <span className="text-xs font-mono font-bold uppercase tracking-[0.25em] text-[#C5A059] flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#C5A059]" />
              Filosofía de Curaduría
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light text-[#2C402E] tracking-tight leading-[1.15] font-serif">
              {title}
            </h2>
            
            {/* Contenedor Editorial Premium para El Manifiesto */}
            <div className="mt-6 bg-white/60 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-gray-200/60 border-l-4 border-l-[#C5A059] shadow-sm">
              <p className="text-base sm:text-lg text-[#2C402E]/90 font-normal leading-relaxed">
                {subtitle}
              </p>
            </div>
          </motion.div>
        </div>

        {/* Asymmetrical Luxury Bento Grid with rounded-3xl and generous padding */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Card 1: Main Lifestyle Transformation (Spans 7 columns on desktop) */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-7 relative rounded-3xl overflow-hidden bg-[#2C402E] text-[#FAF8F5] flex flex-col justify-end min-h-[420px] sm:min-h-[540px] lg:min-h-[620px] p-8 sm:p-14 lg:p-16 group shadow-xl border border-[#2C402E]/80"
          >
            <Image
              src={image}
              alt={title || "Ritual de calma y curaduría en casa"}
              fill
              className="object-cover transition-transform duration-1000 group-hover:scale-105 opacity-60 w-full h-full"
              sizes="(max-width: 1024px) 100vw, 60vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#2C402E] via-[#2C402E]/40 to-transparent" />
            
            <div className="relative z-10 space-y-6 max-w-xl">
              <span className="text-xs font-mono font-bold uppercase tracking-[0.2em] text-[#C5A059] block">
                01 / CURADURÍA Y RITUAL
              </span>
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-light leading-tight tracking-tight text-[#FAF8F5] font-serif">
                El arte de la pausa consciente
              </h3>
              <p className="text-sm sm:text-base text-[#FAF8F5]/90 leading-relaxed font-normal">
                Olvídate del estrés visual y ambiental. Nuestra selección rigurosa de bienestar equilibra tu espacio y tu mente desde el primer instante en que abres la caja.
              </p>
              <div className="pt-2">
                <Link
                  href="/productos"
                  className="inline-flex items-center gap-3 text-xs font-mono uppercase tracking-widest text-[#FAF8F5] hover:text-[#C5A059] transition-colors group/link pb-1 border-b border-[#FAF8F5]/30 hover:border-[#C5A059]"
                >
                  <span>Explorar selección</span>
                  <ArrowRight className="w-4 h-4 text-[#C5A059] transition-transform group-hover/link:translate-x-1.5" />
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Right Column Stack (Spans 5 columns on desktop) */}
          <div className="lg:col-span-5 flex flex-col gap-8 justify-between">
            
            {/* Card 2: Star Product - Sleep (Top stack, min-h-[300px]) */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex-1 rounded-3xl overflow-hidden bg-white border border-warm-200/80 p-8 sm:p-10 flex flex-col justify-between min-h-[300px] shadow-lg hover:shadow-xl transition-all duration-300 group"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="text-[11px] font-mono font-bold uppercase tracking-[0.2em] text-[#C5A059] block mb-1">
                    DESCANSO PROFUNDO
                  </span>
                  <h4 className="text-xl sm:text-2xl font-medium text-[#2C402E] leading-snug font-serif">
                    {card2Title}
                  </h4>
                </div>
                <span className="text-xs font-mono font-medium text-[#2C402E] bg-[#FAF8F5] px-3.5 py-1.5 rounded-full border border-warm-200">
                  Top Ventas
                </span>
              </div>

              <div className="my-6 flex items-center gap-6">
                <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden bg-[#FAF8F5] shrink-0 border border-warm-200/60 shadow-inner">
                  <Image
                    src={card2Image}
                    alt={card2Title || "Difusor Ultrasónico"}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700 w-full h-full"
                    sizes="128px"
                  />
                </div>
                <p className="text-sm sm:text-base text-[#2C402E]/80 font-normal leading-relaxed">
                  {card2Desc}
                </p>
              </div>

              <div className="flex items-center justify-between pt-5 border-t border-warm-100">
                <span className="font-mono text-lg font-bold text-[#2C402E]">
                  {formatPrice(89.90)}
                </span>
                <Link
                  href="/productos"
                  className="px-6 py-3 bg-[#2C402E] hover:bg-[#C5A059] text-white text-xs font-semibold tracking-wider uppercase rounded-full transition-colors shadow-sm"
                >
                  Ver producto
                </Link>
              </div>
            </motion.div>

            {/* Card 3: Star Product - Muscle Relief (Bottom stack, min-h-[300px]) */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex-1 rounded-3xl overflow-hidden bg-white border border-warm-200/80 p-8 sm:p-10 flex flex-col justify-between min-h-[300px] shadow-lg hover:shadow-xl transition-all duration-300 group"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="text-[11px] font-mono font-bold uppercase tracking-[0.2em] text-[#C5A059] block mb-1">
                    SISTEMA NERVIOSO
                  </span>
                  <h4 className="text-xl sm:text-2xl font-medium text-[#2C402E] leading-snug font-serif">
                    {card3Title}
                  </h4>
                </div>
                <span className="text-xs font-mono font-medium text-[#C5A059] bg-[#FAF8F5] px-3.5 py-1.5 rounded-full border border-warm-200 font-bold">
                  Rápida Acción
                </span>
              </div>

              <div className="my-6 flex items-center gap-6">
                <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden bg-[#FAF8F5] shrink-0 border border-warm-200/60 shadow-inner">
                  <Image
                    src={card3Image}
                    alt={card3Title || "Set Terapéutico"}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700 w-full h-full"
                    sizes="128px"
                  />
                </div>
                <p className="text-sm sm:text-base text-[#2C402E]/80 font-normal leading-relaxed">
                  {card3Desc}
                </p>
              </div>

              <div className="flex items-center justify-between pt-5 border-t border-warm-100">
                <span className="font-mono text-lg font-bold text-[#2C402E]">
                  {formatPrice(69.90)}
                </span>
                <Link
                  href="/productos"
                  className="px-6 py-3 bg-[#2C402E] hover:bg-[#C5A059] text-white text-xs font-semibold tracking-wider uppercase rounded-full transition-colors shadow-sm"
                >
                  Ver producto
                </Link>
              </div>
            </motion.div>

          </div>

        </div>
      </div>
    </section>
  );
}

export default TransformationBento;
