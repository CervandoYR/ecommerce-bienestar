"use client";

import { motion } from "framer-motion";
import { ShoppingBag, Star, ShieldCheck, Leaf, Sparkles } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface HeroSectionProps {
  title?: string | null;
  subtitle?: string | null;
  imageUrl?: string | null;
}

export function HeroSection({ title, subtitle, imageUrl }: HeroSectionProps) {
  const displayImage = imageUrl || "/samay-munay-hero.png"; 

  return (
    <section className="relative min-h-[calc(100vh-80px)] w-full flex items-center justify-center overflow-hidden bg-[#FAF8F5]">
      
      {/* Luces ambientales cálidas de fondo */}
      <div className="absolute top-0 left-1/4 w-[40rem] h-[40rem] bg-[#e6c998]/10 rounded-full blur-3xl opacity-60 pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[30rem] h-[30rem] bg-sage-200/20 rounded-full blur-3xl opacity-50 pointer-events-none" />

      {/* Grid Contenedor Principal */}
      <div className="container-narrow relative z-20 w-full px-4 pt-12 pb-16 lg:py-0">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Columna Izquierda: Contenido de Texto */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col max-w-2xl mx-auto lg:mx-0"
          >
            {/* Trust Badge Superior */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-warm-200 text-warm-900 text-xs font-bold uppercase tracking-widest mb-6 shadow-sm w-fit">
              <span className="flex text-[#ff9900]">
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
              </span>
              <span className="text-warm-500">|</span>
              <span className="text-sage-700 font-extrabold flex items-center gap-1">
                <Sparkles className="w-4 h-4" /> La elección #1
              </span>
            </div>

            {/* Gran Titular */}
            <h1 className="text-5xl sm:text-6xl md:text-[4.5rem] font-black text-warm-900 mb-6 tracking-tighter leading-[1.05]">
              <span className="block text-sage-700 mb-2">Samay Munay</span>
              El Arte de Amarte <br/> Cada Día.
            </h1>
            
            <p className="text-lg md:text-xl text-warm-600 mb-10 font-medium leading-relaxed">
              Descubre nuestra colección premium de cuidado personal y aromaterapia. Ingredientes 100% naturales diseñados para armonizar tu cuerpo y alma.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mb-10">
              {/* Botón Principal (Solid) */}
              <Link
                href="/productos"
                className="group flex items-center justify-center gap-3 px-8 py-4 bg-warm-900 text-white rounded-2xl font-bold text-base hover:bg-sage-700 hover:scale-[1.02] transition-all duration-300 shadow-xl shadow-warm-900/20"
              >
                <ShoppingBag className="w-5 h-5" />
                Comprar Ahora
              </Link>
              {/* Botón Secundario (Outline / Ghost) */}
              <Link
                href="/nosotros"
                className="flex items-center justify-center px-8 py-4 bg-transparent text-warm-900 border-2 border-warm-200 rounded-2xl font-bold text-base hover:bg-warm-50 hover:border-sage-600 hover:text-sage-700 hover:scale-[1.02] transition-all duration-300"
              >
                Nuestro Propósito
              </Link>
            </div>

            {/* Social Proof y Garantías */}
            <div className="flex items-center gap-6 text-sm font-semibold text-warm-600">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                  <Leaf className="w-4 h-4 text-green-600" />
                </div>
                100% Natural
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4 text-blue-600" />
                </div>
                Compra Segura
              </div>
            </div>
          </motion.div>

          {/* Columna Derecha: Imagen Contenedor Premium */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
            className="w-full flex justify-center lg:justify-end"
          >
            {/* Aspect Ratio Container (Mantiene proporciones consistentes y forma de tarjeta) */}
            {/* Nota: Si en el futuro usas un logo PNG sin fondo y quieres que "flote", quita la clase "bg-white" y "border" de este contenedor */}
            <div className="relative w-full max-w-md lg:max-w-none lg:w-full aspect-square md:aspect-[4/5] lg:aspect-square bg-white rounded-3xl overflow-hidden shadow-2xl shadow-stone-900/10 border border-warm-100 p-2">
              <div className="relative w-full h-full rounded-2xl overflow-hidden bg-warm-50">
                <Image
                  src={displayImage}
                  alt="Samay Munay - El arte de amarte cada día"
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
