"use client";

import Link from "next/link";
import { CheckCircle2, ArrowRight, Sparkles, MessageCircle, Clock, ShieldCheck, HeartHandshake, PackageCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { STORE_NAME, WHATSAPP_NUMBER } from "@/lib/constants";
import { buildWhatsAppUrl } from "@/lib/utils";

export default function CheckoutSuccessPage() {
  const whatsappHelpUrl = buildWhatsAppUrl(
    WHATSAPP_NUMBER,
    `Hola ${STORE_NAME}, acabo de realizar un pedido en la tienda y quisiera confirmar la coordinación del pago y entrega.`
  );

  return (
    <div className="bg-[#FAF8F5] min-h-[90vh] py-16 lg:py-24 px-4 relative overflow-hidden flex items-center justify-center">
      
      {/* Fondo decorativo difuminado */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-gradient-to-tr from-[#2C402E]/10 via-[#C5A059]/10 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="container-narrow max-w-4xl mx-auto relative z-10">
        
        {/* Tarjeta principal editorial */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="bg-white rounded-3xl p-8 sm:p-14 lg:p-16 border border-[#e8e6dd] shadow-xl text-center relative overflow-hidden"
        >
          {/* Borde superior dorado */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#2C402E] via-[#C5A059] to-[#2C402E]" />

          {/* Icono de Sello Premium */}
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-[#2C402E] text-[#FAF8F5] shadow-lg mb-8 relative group">
            <Sparkles className="w-8 h-8 text-[#C5A059] animate-pulse" />
            <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-[#C5A059] text-white flex items-center justify-center shadow-md">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          
          <span className="text-xs font-mono font-bold uppercase tracking-[0.25em] text-[#C5A059] block mb-3">
            CURADURÍA CONFIRMADA
          </span>
          
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-light text-[#2C402E] tracking-tight mb-4">
            Tu ritual está en camino
          </h1>
          
          <p className="text-base sm:text-lg text-[#5e574c] font-light max-w-2xl mx-auto leading-relaxed mb-12">
            Hemos registrado exitosamente tu solicitud de bienestar. Prepárate para transformar tu espacio y desconectar del ritmo acelerado del mundo exterior.
          </p>

          {/* 3 Pasos del Proceso */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left mb-12">
            {[
              {
                step: "01 // COORDINACIÓN",
                icon: MessageCircle,
                title: "Asesora VIP en Vivo",
                desc: "Si elegiste compra por WhatsApp, nuestra curadora te habrá enviado el detalle para confirmar método de pago (Yape/Plin/Transf.) y envío."
              },
              {
                step: "02 // PREPARACIÓN",
                icon: PackageCheck,
                title: "Empacado con Intención",
                desc: "Preparamos cada compresa térmica, aceite puro y bruma botánica protegiendo su frescura e integridad artesanal."
              },
              {
                step: "03 // ENTREGA",
                icon: HeartHandshake,
                title: "Llegada a tu Santuario",
                desc: "Llevamos tu pedido directamente a tu puerta para que inicies tu experiencia de calma y silencio mental."
              }
            ].map((item, idx) => {
              const IconComp = item.icon;
              return (
                <div key={idx} className="p-6 rounded-2xl bg-[#FAF8F5] border border-[#e8e6dd] flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-[11px] font-mono font-bold text-[#C5A059] uppercase tracking-wider">{item.step}</span>
                      <IconComp className="w-5 h-5 text-[#2C402E]" />
                    </div>
                    <h3 className="font-serif font-medium text-[#2C402E] text-lg mb-2">{item.title}</h3>
                    <p className="text-xs sm:text-sm text-[#5e574c] font-light leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Caja de Ayuda Directa por WhatsApp */}
          <div className="p-6 rounded-2xl bg-[#2C402E]/5 border border-[#2C402E]/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-left mb-12">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-[#2C402E] shadow-2xs shrink-0">
                <MessageCircle className="w-6 h-6 text-[#25D366]" />
              </div>
              <div>
                <h4 className="font-serif font-medium text-[#2C402E] text-base">¿Se cerró tu ventana de WhatsApp?</h4>
                <p className="text-xs sm:text-sm text-[#5e574c] font-light">
                  No te preocupes. Puedes retomar la conversación con nuestra asesora en un clic.
                </p>
              </div>
            </div>
            <Button asChild className="bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold px-6 py-5 rounded-xl shadow-md shrink-0 w-full sm:w-auto">
              <a href={whatsappHelpUrl} target="_blank" rel="noopener noreferrer">
                Hablar por WhatsApp
              </a>
            </Button>
          </div>

          {/* Botones de Acción */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6 border-t border-[#e8e6dd]">
            <Button 
              asChild 
              size="lg" 
              className="w-full sm:w-auto px-8 py-6 rounded-full bg-[#2C402E] text-[#FAF8F5] hover:bg-[#C5A059] transition-all duration-300 font-medium tracking-wide shadow-md hover:shadow-xl"
            >
              <Link href="/productos" className="flex items-center justify-center gap-2">
                <span>Explorar más rituales</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
            
            <Button 
              asChild 
              variant="outline" 
              size="lg" 
              className="w-full sm:w-auto px-8 py-6 rounded-full border-[#e8e6dd] text-[#2C402E] hover:bg-[#FAF8F5] hover:border-[#C5A059] transition-all duration-300 font-medium"
            >
              <Link href="/perfil">
                Ver historial de pedidos
              </Link>
            </Button>
          </div>

          <div className="mt-10 pt-6 flex items-center justify-center gap-2 text-xs font-mono uppercase tracking-[0.2em] text-[#71685a]">
            <span>GARANTÍA DE PURIDAD {STORE_NAME}</span>
          </div>

        </motion.div>

      </div>
    </div>
  );
}
