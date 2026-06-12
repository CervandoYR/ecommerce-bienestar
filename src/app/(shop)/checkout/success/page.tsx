"use client";

import Link from "next/link";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CheckoutSuccessPage() {
  return (
    <div className="bg-warm-50 min-h-screen py-16 flex items-center justify-center px-4">
      <div className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-warm-200 text-center max-w-lg w-full">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto text-green-600 mb-6">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        
        <h1 className="text-3xl font-bold text-warm-900 mb-4">
          ¡Pedido Recibido!
        </h1>
        
        <p className="text-warm-600 mb-8">
          Gracias por tu pedido. Si todo salió bien, deberías estar coordinando los detalles finales a través de WhatsApp.
        </p>

        <div className="space-y-4">
          <Button asChild size="lg" className="w-full">
            <Link href="/productos">
              Seguir explorando
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </Button>
          <Button asChild variant="ghost" size="lg" className="w-full text-warm-500">
            <Link href="/">
              Volver al inicio
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
