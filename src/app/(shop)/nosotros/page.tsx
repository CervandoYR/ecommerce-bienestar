"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import { Sparkles, ArrowRight, Compass, ShieldCheck, HeartHandshake, Brain, Flame, Home } from "lucide-react";
import { STORE_NAME } from "@/lib/constants";

const fadeUpVariant: Variants = {
  hidden: { opacity: 0, y: 35 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } 
  },
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2, delayChildren: 0.1 },
  },
};

export default function AboutPage() {
  return (
    <div className="bg-[#FAF8F5] min-h-screen text-[#2C402E] overflow-x-hidden selection:bg-[#C5A059]/20">
      
      {/* ── 1 & 2. EDITORIAL SPLIT SCREEN: EL MANIFIESTO ── */}
      <section className="pt-24 pb-20 lg:pt-36 lg:pb-32 px-4 sm:px-6 lg:px-8 relative">
        {/* Iluminación ambiental difuminada */}
        <div className="absolute top-1/3 left-10 w-[500px] h-[500px] bg-[#C5A059]/5 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-[#2C402E]/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="container-narrow max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
            
            {/* Lado Izquierdo: Imagen Gran Formato Minimalista (Calma) */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={fadeUpVariant}
              className="lg:col-span-6 relative aspect-[3/4] sm:aspect-[4/5] rounded-[2.5rem] overflow-hidden shadow-2xl border border-[#e8e6dd] group bg-warm-100"
            >
              <Image
                src="https://images.unsplash.com/photo-1545205597-3d9d02c29597?q=80&w=1400&auto=format&fit=crop"
                alt="Silencio mental y calma botánica en Samay Munay"
                fill
                className="object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#2C402E]/40 via-transparent to-transparent opacity-60 transition-opacity duration-500 group-hover:opacity-40" />
              
              {/* Sello editorial flotante */}
              <div className="absolute bottom-8 left-8 right-8 text-white/95">
                <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-[#C5A059] font-bold block mb-1">
                  FILOSOFÍA BOTÁNICA
                </span>
                <p className="text-base sm:text-lg font-serif italic font-light">
                  &ldquo;El verdadero lujo moderno es recuperar tu propia calma.&rdquo;
                </p>
              </div>
            </motion.div>

            {/* Lado Derecho: Copywriting Estratégico con Mucho Aire */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={staggerContainer}
              className="lg:col-span-6 space-y-8 lg:space-y-12 lg:pl-4"
            >
              <motion.div variants={fadeUpVariant} className="space-y-4">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#e8e6dd] shadow-sm">
                  <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
                  <span className="text-[11px] font-mono font-bold uppercase tracking-[0.25em] text-[#C5A059]">
                    MANIFIESTO DE CURADURÍA
                  </span>
                </div>
                
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-light text-[#2C402E] tracking-tight leading-[1.12]">
                  El silencio mental <br />
                  <span className="italic font-normal">no debería ser un lujo.</span>
                </h1>
              </motion.div>

              <motion.div variants={fadeUpVariant} className="space-y-6 text-lg sm:text-xl text-[#5e574c] font-light leading-relaxed">
                <p>
                  {STORE_NAME} nace de una observación simple: vivimos en un mundo diseñado para mantenernos en alerta constante. Como curadores de bienestar, nuestra labor no es venderte un aroma; es filtrar el exceso para entregarte solo lo que tu sistema nervioso reconoce como paz.
                </p>
                <p>
                  No fabricamos, seleccionamos. Y solo lo hacemos cuando la calidad es tan alta que nosotros mismos la usamos en nuestros espacios.
                </p>
              </motion.div>

              <motion.div variants={fadeUpVariant} className="pt-2">
                <Link
                  href="/productos"
                  className="group inline-flex items-center gap-3 px-8 py-4 rounded-full bg-[#2C402E] text-[#FAF8F5] hover:bg-[#C5A059] transition-all duration-500 text-sm sm:text-base font-medium tracking-wide shadow-md hover:shadow-xl"
                >
                  <span>Explorar Colección Curada</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
              </motion.div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ── NUEVA SECCIÓN UX/UI: ANATOMÍA DEL ALIVIO (PARA QUIÉN CURAMOS) ── */}
      <section className="py-24 lg:py-36 px-4 bg-white border-t border-[#e8e6dd] relative">
        <div className="container-narrow max-w-6xl mx-auto">
          
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUpVariant}
            className="text-center max-w-3xl mx-auto mb-16 lg:mb-24"
          >
            <span className="text-xs font-mono font-bold uppercase tracking-[0.25em] text-[#C5A059] block mb-3">
              ANATOMÍA DEL ALIVIO
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-light text-[#2C402E] tracking-tight">
              Rituales curados para los desafíos de la vida real
            </h2>
            <p className="text-base sm:text-lg text-[#5e574c] font-light mt-4">
              Detrás de cada tensión física o fatiga mental hay una solución botánica específica. Así actuamos como filtro para los dolores más comunes de la vida moderna y la prisa urbana:
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10"
          >
            {[
              {
                icon: Brain,
                tag: "Aceites & Difusores",
                title: "Mente Hiperactiva & Sobrecarga Digital",
                problem: "Jornadas infinitas frente a pantallas, notificaciones constantes y una mente que no logra apagar revoluciones al llegar la noche.",
                solution: "Aceites esenciales puros (Lavanda & Bergamota) que actúan en el sistema límbico para inducir sueño profundo y desconexión real.",
                href: "/productos?categoria=aromaterapia",
                cta: "Ver Difusores & Aceites Relajantes",
              },
              {
                icon: Flame,
                tag: "Compresas & Sales",
                title: "Cuerpo en Tensión & Contracturas Urbanas",
                problem: "Cuello rígido, espalda cargada por el tráfico de la ciudad y el estrés físico acumulado por la postura sedentaria en el escritorio.",
                solution: "Calor terapéutico con hierbas desinflamatorias y sales de baño Epsom que dilatan vasos sanguíneos y liberan nudos sin analgésicos químicos.",
                href: "/productos?categoria=cuidado-corporal",
                cta: "Ver Compresas & Sales Térmicas",
              },
              {
                icon: Home,
                tag: "Brumas & Velas",
                title: "El Refugio contra el Caos de la Ciudad",
                problem: "Sentir que el ruido, la contaminación, la prisa y la energía pesada de la calle te persiguen hasta el interior de tu propia casa.",
                solution: "Anclaje olfativo con brumas de almohada y velas de soja limpia que transforman tu habitación en un santuario sagrado de calma.",
                href: "/productos?categoria=velas-inciensos",
                cta: "Ver Velas & Brumas Botánicas",
              },
            ].map((card, idx) => {
              const IconComp = card.icon;
              return (
                <motion.div
                  key={idx}
                  variants={fadeUpVariant}
                  className="bg-[#FAF8F5] rounded-3xl p-8 sm:p-10 border border-[#e8e6dd] hover:border-[#C5A059] transition-all duration-500 hover:-translate-y-2 hover:shadow-xl flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-8">
                      <div className="w-12 h-12 rounded-2xl bg-white border border-[#e8e6dd] flex items-center justify-center text-[#2C402E] group-hover:bg-[#2C402E] group-hover:text-[#FAF8F5] transition-colors duration-500">
                        <IconComp className="w-5 h-5 text-[#C5A059]" />
                      </div>
                      <span className="text-[11px] font-mono px-3 py-1 rounded-full bg-white border border-[#e8e6dd] text-[#C5A059] font-bold uppercase tracking-wider shadow-2xs">
                        {card.tag}
                      </span>
                    </div>

                    <h3 className="text-xl font-serif font-medium text-[#2C402E] mb-4 group-hover:text-[#C5A059] transition-colors">
                      {card.title}
                    </h3>

                    <div className="space-y-4 text-sm sm:text-base font-light leading-relaxed">
                      <div className="p-4 rounded-2xl bg-white/60 border border-[#e8e6dd]/60">
                        <span className="text-[10px] font-mono uppercase font-bold text-[#71685a] block mb-1">El Desafío Cotidiano</span>
                        <p className="text-[#5e574c]">{card.problem}</p>
                      </div>

                      <div className="p-4 rounded-2xl bg-[#2C402E]/5 border border-[#2C402E]/10">
                        <span className="text-[10px] font-mono uppercase font-bold text-[#2C402E] block mb-1">El Alivio Curado</span>
                        <p className="text-[#2C402E] font-normal">{card.solution}</p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 mt-6 border-t border-[#e8e6dd] flex items-center justify-between">
                    <Link
                      href={card.href}
                      className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#2C402E] group-hover:text-[#C5A059] transition-colors duration-300 w-full justify-between"
                    >
                      <span>{card.cta}</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-300 text-[#C5A059]" />
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

        </div>
      </section>

      {/* ── PULL-QUOTE / CITA DESTACADA PREMIUM ── */}
      <section className="py-20 lg:py-28 px-4 bg-white border-t border-b border-[#e8e6dd] relative overflow-hidden">
        <div className="container-narrow max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUpVariant}
            className="space-y-6 px-4 sm:px-12"
          >
            {/* Comillas doradas grandes */}
            <span className="text-6xl sm:text-8xl font-serif text-[#C5A059] block leading-none select-none -mb-6 sm:-mb-10">
              &ldquo;
            </span>

            <blockquote className="text-2xl sm:text-3xl lg:text-4xl font-serif italic text-[#2C402E] font-normal leading-relaxed tracking-tight">
              La curaduría es el acto de decir no a lo mediocre para decir sí a lo extraordinario.
            </blockquote>

            <div className="pt-4 flex items-center justify-center gap-3">
              <span className="h-px w-12 bg-[#C5A059]/60 block" />
              <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#71685a] font-semibold">
                CURADURÍA {STORE_NAME}
              </span>
              <span className="h-px w-12 bg-[#C5A059]/60 block" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── 3. NUESTRO COMPROMISO (LA PRUEBA SOCIAL / 3 COLUMNAS) ── */}
      <section className="py-24 lg:py-36 px-4 bg-[#FAF8F5] relative">
        <div className="container-narrow max-w-6xl mx-auto">
          
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUpVariant}
            className="text-center max-w-2xl mx-auto mb-16 lg:mb-24"
          >
            <span className="text-xs font-mono font-bold uppercase tracking-[0.25em] text-[#C5A059] block mb-3">
              NUESTRO COMPROMISO
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-light text-[#2C402E] tracking-tight">
              El estándar que nos define
            </h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-14"
          >
            {[
              {
                icon: Compass,
                title: "Selección Manual",
                desc: "Probamos y verificamos rigurosamente cada pieza en entornos reales antes de autorizar su reventa.",
              },
              {
                icon: ShieldCheck,
                title: "Pureza Garantizada",
                desc: "Aromas y texturas de grado terapéutico real, libres de fragancias sintéticas, parafinas o rellenos.",
              },
              {
                icon: HeartHandshake,
                title: "Logística Consciente",
                desc: "Envases fotoprotectores y embalaje ético que cuidan intacta la energía y calidad del producto hasta tu puerta.",
              },
            ].map((item, idx) => {
              const IconComp = item.icon;
              return (
                <motion.div
                  key={idx}
                  variants={fadeUpVariant}
                  className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 sm:p-10 border border-[#e8e6dd] hover:border-[#C5A059]/60 transition-all duration-500 hover:-translate-y-1.5 hover:shadow-xl flex flex-col items-center text-center group"
                >
                  <div className="w-14 h-14 rounded-2xl bg-[#FAF8F5] border border-[#e8e6dd] flex items-center justify-center text-[#2C402E] group-hover:bg-[#2C402E] group-hover:text-[#FAF8F5] transition-colors duration-500 mb-6 shrink-0">
                    <IconComp className="w-6 h-6 text-[#C5A059] stroke-[1.5]" />
                  </div>
                  
                  <h3 className="text-xl font-serif font-medium text-[#2C402E] mb-3">
                    {item.title}
                  </h3>
                  
                  <p className="text-base text-[#5e574c] font-light leading-relaxed">
                    {item.desc}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Botón final de invitación al catálogo */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={fadeUpVariant}
            className="mt-16 sm:mt-20 text-center"
          >
            <Link
              href="/productos"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#2C402E] hover:text-[#C5A059] transition-colors border-b border-[#C5A059]/40 pb-0.5"
            >
              Conocer los rituales disponibles en catálogo
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </motion.div>

        </div>
      </section>

    </div>
  );
}
