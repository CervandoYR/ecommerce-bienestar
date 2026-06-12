"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Truck, Leaf, CreditCard, HeadphonesIcon, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

const badges = [
  {
    icon: Truck,
    title: "Envío Same-Day",
    description: "En San Juan de Miraflores y zonas cercanas",
  },
  {
    icon: ShieldCheck,
    title: "Compra 100% Segura",
    description: "Protección total en cada transacción",
  },
  {
    icon: Leaf,
    title: "Productos Naturales",
    description: "Ingredientes de origen natural certificados",
  },
  {
    icon: CreditCard,
    title: "Múltiples Pagos",
    description: "Tarjeta, Yape, Plin o WhatsApp",
  },
  {
    icon: HeadphonesIcon,
    title: "Atención Personalizada",
    description: "Te asesoramos por WhatsApp",
  },
  {
    icon: RotateCcw,
    title: "Garantía de Calidad",
    description: "Devolución sin complicaciones",
  },
];

interface TrustBadgesProps {
  className?: string;
}

export function TrustBadges({ className }: TrustBadgesProps) {
  return (
    <section className={cn("py-16 lg:py-20 bg-warm-100", className)} id="trust-badges">
      <div className="container-narrow">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-warm-900 mb-3">
            ¿Por qué elegirnos?
          </h2>
          <p className="text-warm-500 max-w-lg mx-auto">
            Nos comprometemos con tu bienestar en cada paso del proceso
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {badges.map((badge, index) => {
            const Icon = badge.icon;
            return (
              <motion.div
                key={badge.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                className="flex flex-col items-center text-center group"
              >
                <motion.div
                  whileHover={{ scale: 1.1, y: -4 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="w-14 h-14 rounded-2xl bg-sage-100 flex items-center justify-center mb-3 group-hover:bg-sage-200 transition-colors"
                >
                  <Icon className="w-6 h-6 text-sage-600" />
                </motion.div>
                <h3 className="text-sm font-semibold text-warm-800 mb-1">
                  {badge.title}
                </h3>
                <p className="text-xs text-warm-500 leading-relaxed">
                  {badge.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default TrustBadges;
