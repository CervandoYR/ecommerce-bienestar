"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Leaf, Heart, ShieldCheck, Sparkles, ArrowRight } from "lucide-react";
import { STORE_NAME } from "@/lib/constants";

export default function AboutPage() {
  return (
    <div className="bg-warm-50 min-h-screen">
      
      {/* Immersive Hero Section */}
      <section className="relative h-[80vh] min-h-[600px] w-full flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 w-full h-full">
          <Image
            src="https://images.unsplash.com/photo-1545205597-3d9d02c29597?q=80&w=2000&auto=format&fit=crop"
            alt="El origen del bienestar"
            fill
            className="object-cover scale-105"
            priority
          />
          <div className="absolute inset-0 bg-black/30" />
        </div>

        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto mt-20">
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-sage-300 font-semibold tracking-[0.2em] uppercase text-sm md:text-base mb-6"
          >
            Nuestra Esencia
          </motion.p>
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-8 tracking-tighter"
          >
            Nuestra Historia
          </motion.h1>
          <motion.div 
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="w-24 h-[2px] bg-white/50 mx-auto"
          />
        </div>
      </section>

      {/* Storytelling Content - Asymmetric Layout */}
      <section className="py-24 lg:py-40 bg-white">
        <div className="container-narrow">
          
          {/* Mission Statement */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1 }}
            className="max-w-4xl mx-auto text-center mb-32 px-4"
          >
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-light text-warm-900 leading-[1.2] mb-10">
              Nacimos con una misión simple pero <span className="font-bold italic text-sage-600">poderosa</span>.
            </h2>
            <p className="text-xl md:text-2xl text-warm-600 font-light leading-relaxed">
              Acercar el bienestar, la calma y el equilibrio a la vida diaria de las personas en un mundo cada vez más acelerado.
            </p>
          </motion.div>

          {/* Block 1: El Poder de lo Natural */}
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-center mb-32 lg:mb-40 px-4">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1 }}
              className="relative aspect-square lg:aspect-[4/5] rounded-[2rem] overflow-hidden shadow-2xl order-2 lg:order-1"
            >
              <Image
                src="https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?q=80&w=1200&auto=format&fit=crop"
                alt="Ingredientes 100% Naturales"
                fill
                className="object-cover"
              />
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1, delay: 0.2 }}
              className="space-y-8 order-1 lg:order-2"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-sage-50 text-sage-600">
                <Leaf className="w-8 h-8" />
              </div>
              <h3 className="text-4xl md:text-5xl font-bold text-warm-900 tracking-tight">El poder de lo natural</h3>
              <div className="space-y-6 text-lg md:text-xl text-warm-600 font-light leading-relaxed">
                <p>
                  En {STORE_NAME}, la naturaleza no es una opción, es nuestra base absoluta. Cada textura y cada aroma son seleccionados para sumarle a tu paz interior.
                </p>
                <p>
                  Apostamos por insumos 100% naturales, libres de crueldad animal y de origen sostenible. Porque cuidar de ti, significa cuidar de nuestro entorno.
                </p>
              </div>
            </motion.div>
          </div>

          {/* Block 2: Hecho con Propósito */}
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-center px-4">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1, delay: 0.2 }}
              className="space-y-8 order-2 lg:order-1"
            >
              <h3 className="text-4xl md:text-5xl font-bold text-warm-900 tracking-tight">Hecho con propósito</h3>
              <div className="space-y-6 text-lg md:text-xl text-warm-600 font-light leading-relaxed">
                <p>
                  Nuestros productos no son creados en masa; son formulados con intención. Trabajamos de la mano con productores locales que entienden el valor de la calma.
                </p>
                <p>
                  Cada vela derramada a mano y cada gota de aceite esencial es un recordatorio de que tu bienestar es primordial.
                </p>
              </div>
              <motion.button 
                whileHover={{ gap: "1rem" }}
                className="inline-flex items-center gap-2 text-sage-700 font-semibold uppercase tracking-wider mt-4"
              >
                Conoce nuestros productos <ArrowRight className="w-5 h-5" />
              </motion.button>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1 }}
              className="relative aspect-square lg:aspect-[4/5] rounded-[2rem] overflow-hidden shadow-2xl order-1 lg:order-2"
            >
              <Image
                src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=1200&auto=format&fit=crop"
                alt="Propósito y calma"
                fill
                className="object-cover"
              />
            </motion.div>
          </div>

        </div>
      </section>

      {/* Core Values / Pillars */}
      <section className="py-24 lg:py-32 bg-warm-100 text-warm-900 relative overflow-hidden">
        {/* Decorative Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-white/50 blur-[120px] rounded-full pointer-events-none" />

        <div className="container-narrow relative z-10 px-4">
          <div className="text-center mb-24">
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-sage-600 font-semibold tracking-[0.2em] uppercase text-sm mb-4"
            >
              El Manifiesto
            </motion.p>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
            >
              Nuestros Pilares
            </motion.h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
            {[
              { icon: Leaf, title: "100% Naturales", desc: "Ingredientes puros y de origen sostenible." },
              { icon: Heart, title: "Hechos con Amor", desc: "Elaboración consciente y minimalista." },
              { icon: ShieldCheck, title: "Calidad Pura", desc: "Estándares rigurosos en todos los procesos." },
              { icon: Sparkles, title: "Bienestar Real", desc: "Enfocados en tu salud mental y emocional." },
            ].map((pillar, i) => {
              const Icon = pillar.icon;
              return (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ delay: i * 0.15, duration: 0.8 }}
                  className="flex flex-col items-start border-l border-warm-300 pl-6 group"
                >
                  <div className="mb-8 p-4 rounded-2xl bg-white text-sage-600 group-hover:bg-sage-600 group-hover:text-white transition-colors duration-500 shadow-sm">
                    <Icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 tracking-tight">{pillar.title}</h3>
                  <p className="font-light text-warm-600 leading-relaxed text-lg">{pillar.desc}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
