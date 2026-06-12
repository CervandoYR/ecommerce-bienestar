"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Heart, Leaf, Sparkles, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";

const values = [
  {
    icon: Heart,
    title: "Bienestar Integral",
    description: "Creemos que el bienestar va más allá de lo físico. Cada producto está pensado para nutrir cuerpo, mente y espíritu.",
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=800&auto=format&fit=crop" // yoga/stones
  },
  {
    icon: Leaf,
    title: "Compromiso Natural",
    description: "Seleccionamos cuidadosamente ingredientes de origen natural, priorizando lo orgánico y lo sostenible.",
    image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=800&auto=format&fit=crop" // natural skincare
  },
  {
    icon: Users,
    title: "Comunidad Consciente",
    description: "Más que una tienda, somos una comunidad de personas que buscan vivir con más calma y consciencia.",
    image: "https://images.unsplash.com/photo-1512438248247-f0f2a5a8b7f0?q=80&w=800&auto=format&fit=crop" // calm tea/community
  },
  {
    icon: Sparkles,
    title: "Lujo Accesible",
    description: "El lujo del autocuidado debería estar al alcance de todos. Ofrecemos calidad premium a precios justos.",
    image: "https://images.unsplash.com/photo-1608528577891-eb055944f2e7?q=80&w=800&auto=format&fit=crop" // luxury oils
  },
];

export function PurposeSection({ className }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <section 
      ref={containerRef}
      className={cn("py-24 lg:py-32 bg-white relative", className)} 
      id="purpose"
    >
      <div className="container-narrow">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 relative">
          
          {/* Left Side: Sticky Text Content */}
          <div className="lg:w-1/2 lg:sticky lg:top-32 h-fit">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-sage-100 text-sage-600 mb-8">
                <Leaf className="w-8 h-8" />
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-warm-900 leading-[1.1] mb-6 tracking-tight">
                El arte de la <span className="text-sage-600 italic font-light">calma</span>
              </h2>
              <p className="text-lg md:text-xl text-warm-600 leading-relaxed mb-6 font-light">
                Nacimos con una misión clara: acercar productos de relajación y bienestar de alta calidad a cada hogar. 
              </p>
              <p className="text-base text-warm-500 leading-relaxed">
                Creemos fielmente que todos merecen un momento de desconexión en su día a día. Cada producto en nuestra tienda ha sido cuidadosamente 
                seleccionado y probado por nuestro equipo para asegurar que realmente marque una diferencia en tu rutina de autocuidado.
              </p>
            </motion.div>
          </div>

          {/* Right Side: Scrollable Cards (Parallax-like) */}
          <div className="lg:w-1/2 flex flex-col gap-8 md:gap-16">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="bg-warm-50 rounded-[2rem] p-8 md:p-10 border border-warm-100 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 group"
                >
                  <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden mb-8">
                    <Image
                      src={value.image}
                      alt={value.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  </div>
                  
                  <div className="flex items-start gap-5">
                    <div className="w-12 h-12 shrink-0 rounded-full bg-white flex items-center justify-center text-sage-600 shadow-sm">
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-warm-900 mb-3 group-hover:text-sage-700 transition-colors">
                        {value.title}
                      </h3>
                      <p className="text-warm-600 leading-relaxed font-light">
                        {value.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
          
        </div>
      </div>
    </section>
  );
}

export default PurposeSection;
