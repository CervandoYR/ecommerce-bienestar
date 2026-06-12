"use client";

import { motion } from "framer-motion";
import { ArrowRight, Leaf } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { WebGLSmokeBackground } from "@/components/home/webgl-smoke-background";

interface HeroSectionProps {
  title?: string | null;
  subtitle?: string | null;
  imageUrl?: string | null;
}

export function HeroSection({ title, subtitle, imageUrl }: HeroSectionProps) {
  // Use highly reliable Unsplash images or high-res fallbacks for world-class design
  const defaultImage = "https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=2000&auto=format&fit=crop"; // Premium spa/wellness image
  const displayTitle = title || "El Arte del Bienestar";
  const displaySubtitle = subtitle || "Transforma tu rutina diaria en un ritual sagrado. Aromaterapia, cuidado personal y paz interior en un solo lugar.";
  const displayImage = imageUrl || defaultImage;

  return (
    <section className="relative min-h-[85vh] lg:h-screen w-full flex items-center justify-center overflow-hidden bg-black">
      
      {/* Background Image */}
      <div className="absolute inset-0 w-full h-full z-0">
        <Image
          src={displayImage}
          alt="Bienestar Store Hero"
          fill
          priority
          className="object-cover opacity-60"
        />
      </div>

      {/* WebGL Shader Background (Blended as overlay) */}
      <div className="absolute inset-0 w-full h-full z-10 mix-blend-screen opacity-70">
        <WebGLSmokeBackground />
      </div>

      {/* Main Content */}
      <div className="container-narrow relative z-20 flex flex-col items-center justify-center text-center px-4 pt-20">
        
        {/* Animated Leaf / Icon Area */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-16 h-16 rounded-full bg-white/40 backdrop-blur-md border border-white/60 flex items-center justify-center mb-8 shadow-sm"
        >
          <Leaf className="w-8 h-8 text-sage-600" />
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white mb-8 tracking-tighter max-w-5xl leading-[1.1] mx-auto"
        >
          {displayTitle}
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          className="text-lg md:text-2xl text-white/90 mb-10 max-w-2xl font-light"
        >
          {displaySubtitle}
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
          className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
        >
          <Link
            href="/productos"
            className="group flex items-center justify-center gap-2 px-8 py-4 bg-sage-600 text-white rounded-xl font-semibold text-base hover:scale-105 hover:bg-sage-700 transition-all duration-300 shadow-xl"
          >
            Explorar Catálogo
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/nosotros"
            className="flex items-center justify-center px-8 py-4 bg-white/60 text-warm-900 backdrop-blur-md border border-warm-200 rounded-xl font-semibold text-base hover:scale-105 hover:bg-white transition-all duration-300"
          >
            Nuestro Propósito
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

export default HeroSection;
