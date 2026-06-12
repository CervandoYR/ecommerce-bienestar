"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";

const testimonials = [
  {
    name: "María García",
    location: "Surco, Lima",
    rating: 5,
    text: "Las velas aromáticas son increíbles. El aroma a lavanda llena toda mi habitación y me ayuda a dormir mucho mejor. ¡Volveré a comprar!",
    product: "Kit de Velas Aromáticas",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop"
  },
  {
    name: "Carlos Mendoza",
    location: "San Juan de Miraflores",
    rating: 5,
    text: "El envío same-day fue una sorpresa. Pedí en la mañana y en la tarde ya tenía mi difusor de aceites esenciales. Excelente servicio.",
    product: "Difusor Ultrasónico Premium",
    avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=150&auto=format&fit=crop"
  },
  {
    name: "Ana Lucía Flores",
    location: "Miraflores, Lima",
    rating: 5,
    text: "Compré el set de aromaterapia para mi mamá y quedó encantada. La calidad de los aceites esenciales es superior. Muy recomendado.",
    product: "Set de Aromaterapia Completo",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=150&auto=format&fit=crop"
  },
  {
    name: "Roberto Quispe",
    location: "Villa María del Triunfo",
    rating: 4,
    text: "Muy buena relación calidad-precio. La almohada de lavanda es perfecta para relajarme después del trabajo. La atención por WhatsApp fue rápida.",
    product: "Almohada Terapéutica de Lavanda",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop"
  },
  {
    name: "Luciana Torres",
    location: "Chorrillos, Lima",
    rating: 5,
    text: "Me encanta que tengan productos naturales y a buen precio. El aceite de jojoba es divino para el cuidado de la piel. Ya hice 3 pedidos.",
    product: "Aceite de Jojoba Orgánico",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop"
  },
];

export function Testimonials({ className }: { className?: string }) {
  // Duplicate array to create a seamless infinite loop
  const duplicatedTestimonials = [...testimonials, ...testimonials];

  return (
    <section className={cn("py-24 lg:py-32 bg-warm-900 relative overflow-hidden", className)} id="testimonials">
      
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-sage-900/40 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-gold-900/20 blur-[120px]" />
      </div>

      <div className="container-narrow relative z-10 mb-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-flex items-center gap-2 text-gold-400 text-sm font-semibold uppercase tracking-widest mb-4">
            <Star className="w-4 h-4 fill-gold-400" />
            Nuestra Comunidad
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
            Historias de <span className="text-sage-400 italic font-light">bienestar</span>
          </h2>
          <p className="text-warm-300 text-lg max-w-2xl mx-auto font-light">
            Descubre cómo nuestros productos han ayudado a cientos de personas a encontrar su equilibrio y paz interior.
          </p>
        </motion.div>
      </div>

      {/* Infinite Moving Marquee */}
      <div className="relative w-full flex overflow-hidden group">
        
        {/* Left/Right fading gradients */}
        <div className="absolute top-0 left-0 w-24 md:w-64 h-full bg-gradient-to-r from-warm-900 to-transparent z-10 pointer-events-none" />
        <div className="absolute top-0 right-0 w-24 md:w-64 h-full bg-gradient-to-l from-warm-900 to-transparent z-10 pointer-events-none" />

        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{
            duration: 40,
            repeat: Infinity,
            ease: "linear",
          }}
          className="flex gap-6 md:gap-8 px-4"
        >
          {duplicatedTestimonials.map((testimonial, index) => (
            <div
              key={index}
              className="w-[300px] md:w-[400px] shrink-0 p-8 rounded-[2rem] bg-white/5 border border-white/10 backdrop-blur-md relative"
            >
              <Quote className="absolute top-6 right-8 w-12 h-12 text-white/5" />
              
              <div className="flex gap-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      "w-5 h-5",
                      i < testimonial.rating
                        ? "fill-gold-400 text-gold-400"
                        : "text-white/20"
                    )}
                  />
                ))}
              </div>

              <p className="text-white/90 text-base md:text-lg leading-relaxed mb-8 font-light relative z-10">
                "{testimonial.text}"
              </p>

              <div className="flex items-center justify-between mt-auto">
                <div className="flex items-center gap-4">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-white/10">
                    <Image
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="text-white font-semibold text-sm md:text-base">
                      {testimonial.name}
                    </h4>
                    <p className="text-warm-400 text-xs md:text-sm">
                      {testimonial.location}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-white/10">
                <span className="inline-block px-3 py-1 bg-white/5 rounded-full text-xs text-sage-300 font-medium">
                  Compró: {testimonial.product}
                </span>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

export default Testimonials;
