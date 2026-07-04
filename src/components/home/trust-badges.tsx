"use client";

import { motion, type Variants } from "framer-motion";
import { cn } from "@/lib/utils";
import { Sparkles } from "lucide-react";

interface TrustBadgesProps {
  settings?: any;
  className?: string;
}

export function TrustBadges({ settings, className }: TrustBadgesProps) {
  const promises = [
    {
      number: "01",
      title: settings?.promise1Title || "Pureza Botánica",
      description:
        settings?.promise1Desc ||
        "Curaduría estricta de productos botánicos, libres de parabenos y derivados del petróleo. Solo marcas y artesanos de absoluta confianza.",
    },
    {
      number: "02",
      title: settings?.promise2Title || "Grado Terapéutico",
      description:
        settings?.promise2Desc ||
        "Seleccionamos fórmulas e ingredientes que preservan la integridad del producto, diseñados específicamente para aliviar la tensión física y mental.",
    },
    {
      number: "03",
      title: settings?.promise3Title || "Entrega Local Exprés",
      description:
        settings?.promise3Desc ||
        "Envíos Same-Day en Lima y atención personalizada. Empaquetado consciente para que tu experiencia de paz empiece al abrir la caja.",
    },
  ];

  /* ─── Animación en Cascada (Stagger Reveal) ─── */
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 35 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: "easeOut" },
    },
  };

  return (
    <section className={cn("py-24 sm:py-36 bg-[#FAF8F5] border-y border-[#e8e6dd]/80 relative overflow-hidden", className)} id="promesa">
      
      {/* Luces ambientales cálidas difuminadas */}
      <div className="absolute top-1/2 left-1/3 -translate-y-1/2 w-[35rem] h-[35rem] bg-[#C5A059]/5 rounded-full blur-3xl opacity-60 pointer-events-none" />

      <div className="container-narrow px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="max-w-xl mb-16 sm:mb-24">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#C5A059] block mb-3 flex items-center gap-2 font-bold">
              <Sparkles className="w-4 h-4 text-[#C5A059]" />
              ESTÁNDARES DE EXCELENCIA
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light text-[#2C402E] tracking-tight leading-tight font-serif">
              Nuestra Promesa
            </h2>
          </motion.div>
        </div>

        {/* Interactive Tactile Cards Grid with Stagger Reveal */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 lg:gap-10"
        >
          {promises.map((item) => (
            <motion.div
              key={item.number}
              variants={itemVariants}
              className="group relative rounded-2xl p-6 sm:p-8 lg:p-10 bg-[#F5F2EB]/40 border border-[#e8e6dd]/60 hover:bg-white hover:border-[#C5A059]/30 transition-all duration-500 ease-out hover:-translate-y-2 hover:shadow-xl hover:shadow-[#C5A059]/10 flex flex-col justify-between cursor-pointer"
            >
              <div>
                {/* Giant Editorial Number with Hover Opacity & Scale */}
                <span className="font-serif text-6xl sm:text-7xl lg:text-8xl font-extralight text-[#C5A059] opacity-40 block mb-6 transition-all duration-500 group-hover:opacity-100 group-hover:scale-110 origin-left select-none">
                  {item.number}
                </span>

                {/* Title and Expanding Decorative Gold Line */}
                <div className="mb-6">
                  <h3 className="text-xl sm:text-2xl font-light text-[#2C402E] tracking-tight leading-snug font-serif group-hover:text-[#2C402E] transition-colors">
                    {item.title}
                  </h3>
                  <div className="h-[2px] w-0 bg-[#C5A059] mt-3 transition-all duration-500 ease-out group-hover:w-12 rounded-full" />
                </div>
              </div>

              {/* Description Copy */}
              <p className="text-sm sm:text-base text-[#2C402E]/80 font-normal leading-relaxed">
                {item.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}

export default TrustBadges;
