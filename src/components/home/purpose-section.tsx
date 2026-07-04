"use client";

import { motion, Variants } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface PurposeSectionProps {
  settings?: any;
  className?: string;
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 25 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: "easeOut" },
  },
};

export function PurposeSection({ settings, className }: PurposeSectionProps) {
  // Headless CMS fallback defaults
  const kicker = settings?.splitKicker || settings?.purposeSubtitle || "CURADURÍA EXPERTA";
  const title = settings?.splitTitle || settings?.purposeTitle || "El arte de apagar el ruido y reconectar contigo.";
  const desc = settings?.splitDescription || settings?.purposeDesc || "Vivimos a un ritmo que agota. Por eso, buscamos y seleccionamos meticulosamente las mejores herramientas para tu descanso: desde el calor profundo de nuestras compresas térmicas, hasta brumas y aceites botánicos de alta pureza.";
  const footerLeft = settings?.splitFooterLeft || "CALOR TERAPÉUTICO";
  const footerRight = settings?.splitFooterRight || "AROMATERAPIA PURA";
  const imageUrl = settings?.splitImageUrl || settings?.purposeImage || "https://images.unsplash.com/photo-1608528577891-eb055944f2e7?q=80&w=1000&auto=format&fit=crop";
  const buttonText = settings?.splitButtonText || "Explorar colección";
  const buttonLink = settings?.splitButtonLink || "/productos";

  return (
    <section className={cn("bg-[#FAF8F5] py-16 sm:py-24 lg:py-32 overflow-hidden", className)} id="purpose">
      <div className="container-narrow px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        
        {/* 50% / 50% Luxury Split Layout Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 rounded-3xl sm:rounded-[2.5rem] overflow-hidden shadow-2xl border border-warm-200/80 bg-[#2C402E]">
          
          {/* Left Panel: Deep Forest Green (#2C402E) with Staggered Cascade Animation */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="lg:col-span-6 bg-[#2C402E] p-8 sm:p-14 lg:p-16 xl:p-20 flex flex-col justify-between text-[#FAF8F5] z-10"
          >
            <div className="space-y-8">
              {/* Kicker Accent in Gold */}
              <motion.div variants={itemVariants} className="flex items-center gap-2.5">
                <Sparkles className="w-4 h-4 text-[#C5A059] shrink-0 animate-pulse" />
                <span className="text-xs sm:text-sm font-mono font-bold uppercase tracking-[0.25em] text-[#C5A059]">
                  {kicker}
                </span>
              </motion.div>

              {/* Main Title in Elegant Serif */}
              <motion.h2 variants={itemVariants} className="text-3xl sm:text-4xl lg:text-5xl xl:text-[3.25rem] font-medium leading-[1.15] tracking-tight font-serif text-[#FAF8F5]">
                {title}
              </motion.h2>

              {/* Description in Clean Sans-Serif */}
              <motion.p variants={itemVariants} className="text-base sm:text-lg font-sans font-normal leading-relaxed text-[#FAF8F5]/85 pt-2">
                {desc}
              </motion.p>

              {/* Call to Action (CTA) Ghost Button */}
              <motion.div variants={itemVariants} className="pt-4">
                <Link
                  href={buttonLink}
                  className="group inline-flex items-center gap-3.5 px-8 py-4 rounded-full bg-transparent text-[#FAF8F5] font-semibold text-sm sm:text-base border border-[#FAF8F5]/30 hover:border-[#C5A059] hover:bg-black/20 hover:text-white transition-all duration-300 shadow-sm"
                >
                  <span>{buttonText}</span>
                  <ArrowRight className="w-5 h-5 text-[#C5A059] transition-transform duration-300 group-hover:translate-x-1.5" />
                </Link>
              </motion.div>
            </div>

            {/* Accents Footer in Gold */}
            <motion.div 
              variants={itemVariants} 
              className="pt-12 mt-12 border-t border-[#FAF8F5]/15 flex items-center justify-between gap-4 text-xs sm:text-sm font-mono font-bold uppercase tracking-widest text-[#C5A059]"
            >
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#C5A059]" />
                <span>{footerLeft}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#C5A059]" />
                <span>{footerRight}</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Panel: Botanical Image (50%) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: "easeOut" }}
            className="lg:col-span-6 relative min-h-[420px] sm:min-h-[540px] lg:min-h-full bg-[#1a261b] overflow-hidden group"
          >
            <Image
              src={imageUrl}
              alt={title || "Curaduría de bienestar y descanso"}
              fill
              className="object-cover w-full h-full opacity-90 transition-transform duration-1000 ease-out group-hover:scale-105"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
            
            {/* Subtle Gradient Overlay for integration */}
            <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-[#2C402E] via-transparent to-transparent opacity-80 lg:opacity-40" />
            
            {/* Floating Luxury Stamp */}
            <div className="absolute bottom-6 right-6 sm:bottom-8 sm:right-8 bg-[#FAF8F5]/95 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/50 shadow-xl transition-transform duration-500 group-hover:-translate-y-1">
              <p className="text-[11px] font-mono uppercase tracking-widest text-[#2C402E] font-bold flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059] animate-ping" />
                <span>100% Curaduría Botánica</span>
              </p>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}

export default PurposeSection;
