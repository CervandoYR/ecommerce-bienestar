"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/store/useCart";
import { formatPrice, buildWhatsAppUrl } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ShoppingBag, ArrowRight, ShieldCheck, Truck, MessageCircle, MapPin as MapPinIcon } from "lucide-react";
import dynamic from "next/dynamic";

const DeliveryMap = dynamic(() => import("@/components/checkout/delivery-map"), { 
  ssr: false,
  loading: () => <div className="w-full h-64 bg-warm-100 rounded-xl animate-pulse" />
});

export default function CheckoutPage() {
  const router = useRouter();
  const { items, cartTotal, clearCart } = useCart();
  const [mounted, setMounted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    documentId: "",
    address: "",
    reference: "",
    district: "",
    location: null as { lat: number, lng: number } | null,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Create a nice message for WhatsApp
      let message = `*¡Hola! Quiero realizar un pedido en Bienestar Store*\n\n`;
      message += `*Mis datos:*\n`;
      message += `Nombre: ${formData.name}\n`;
      message += `DNI/RUC: ${formData.documentId}\n`;
      message += `Teléfono: ${formData.phone}\n`;
      message += `Dirección: ${formData.address}, ${formData.district}\n`;
      if (formData.location) {
        message += `Ubicación GPS: https://www.google.com/maps?q=${formData.location.lat},${formData.location.lng}\n`;
      }
      message += `Referencia: ${formData.reference}\n\n`;
      message += `*Mi pedido:*\n`;
      
      items.forEach((item) => {
        message += `- ${item.quantity}x ${item.product.name} (${formatPrice(item.product.price)})\n`;
      });
      
      message += `\n*Total a pagar:* ${formatPrice(cartTotal)}\n\n`;
      message += `¿Cuáles son los pasos para realizar el pago?`;

      // Get WhatsApp number from env or fallback
      const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "51999999999";
      const url = buildWhatsAppUrl(whatsappNumber, message);

      // Open WhatsApp
      window.open(url, "_blank");

      // Clear cart and redirect
      clearCart();
      router.push("/checkout/success");
    } catch (error) {
      console.error("Checkout error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!mounted) return null;

  if (items.length === 0) {
    return (
      <div className="bg-warm-50 min-h-screen py-16 flex items-center justify-center">
        <div className="text-center space-y-6">
          <div className="w-24 h-24 bg-sage-100 rounded-full flex items-center justify-center mx-auto text-sage-600">
            <ShoppingBag className="w-12 h-12" />
          </div>
          <h1 className="text-3xl font-bold text-warm-900">Tu carrito está vacío</h1>
          <p className="text-warm-500 max-w-sm mx-auto">
            Aún no has agregado ningún producto para realizar tu compra.
          </p>
          <Button onClick={() => router.push("/productos")} size="lg">
            Volver a la tienda
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-warm-50 min-h-screen py-10 lg:py-16">
      <div className="container-narrow">
        <h1 className="text-3xl font-bold text-warm-900 mb-8">Finalizar Compra</h1>

        <div className="grid lg:grid-cols-12 gap-10">
          {/* Left Column: Form */}
          <div className="lg:col-span-7 space-y-8">
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-warm-200">
              <h2 className="text-xl font-semibold text-warm-900 mb-6">Datos de envío</h2>
              
              <form id="checkout-form" onSubmit={handleCheckout} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-warm-700">Nombre completo</label>
                    <Input 
                      required 
                      name="name" 
                      value={formData.name} 
                      onChange={handleInputChange} 
                      placeholder="Ej. María García" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-warm-700">Teléfono (WhatsApp)</label>
                    <Input 
                      required 
                      name="phone" 
                      type="tel" 
                      value={formData.phone} 
                      onChange={handleInputChange} 
                      placeholder="Ej. 999 888 777" 
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-warm-700">Correo electrónico</label>
                    <Input 
                      required 
                      name="email" 
                      type="email" 
                      value={formData.email} 
                      onChange={handleInputChange} 
                      placeholder="tucorreo@ejemplo.com" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-warm-700">DNI / RUC (Para Boleta/Factura)</label>
                    <Input 
                      required 
                      name="documentId" 
                      value={formData.documentId} 
                      onChange={handleInputChange} 
                      placeholder="Ej. 76543210" 
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-warm-700">Distrito</label>
                    <Input 
                      required 
                      name="district" 
                      value={formData.district} 
                      onChange={handleInputChange} 
                      placeholder="Ej. Miraflores" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-warm-700">Dirección</label>
                    <Input 
                      required 
                      name="address" 
                      value={formData.address} 
                      onChange={handleInputChange} 
                      placeholder="Calle, Número, Dpto" 
                    />
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <label className="text-sm font-medium text-warm-700 flex items-center gap-2">
                    <MapPinIcon className="w-4 h-4" />
                    Ubica tu dirección en el mapa
                  </label>
                  <DeliveryMap 
                    onLocationSelect={(lat, lng) => setFormData(prev => ({ ...prev, location: { lat, lng } }))} 
                  />
                  {formData.location && (
                    <p className="text-xs text-sage-600 font-medium">✓ Ubicación GPS registrada</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-warm-700">Referencia (Opcional)</label>
                  <Input 
                    name="reference" 
                    value={formData.reference} 
                    onChange={handleInputChange} 
                    placeholder="Frente a un parque, casa verde, etc." 
                  />
                </div>
              </form>
            </div>
          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:col-span-5">
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-warm-200 sticky top-28">
              <h2 className="text-xl font-semibold text-warm-900 mb-6">Resumen del pedido</h2>
              
              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={item.product.id} className="flex gap-4">
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-sage-50 shrink-0 border border-warm-100">
                      {item.product.images && item.product.images.length > 0 && (
                        <img 
                          src={item.product.images[0]} 
                          alt={item.product.name} 
                          className="w-full h-full object-cover" 
                        />
                      )}
                      <span className="absolute -top-2 -right-2 w-5 h-5 bg-sage-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full z-10">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1 flex flex-col justify-center">
                      <span className="text-sm font-medium text-warm-800 line-clamp-1">{item.product.name}</span>
                      <span className="text-sm text-sage-600 font-semibold">{formatPrice(item.product.price)}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-warm-100 pt-4 mb-6 space-y-3">
                <div className="flex justify-between text-warm-600">
                  <span>Subtotal</span>
                  <span>{formatPrice(cartTotal)}</span>
                </div>
                <div className="flex justify-between text-warm-600">
                  <span>Envío</span>
                  <span className="text-sm text-sage-600">Calculado por WhatsApp</span>
                </div>
                <div className="flex justify-between text-warm-900 font-bold text-xl pt-2 border-t border-warm-100">
                  <span>Total</span>
                  <span>{formatPrice(cartTotal)}</span>
                </div>
              </div>

              <Button 
                type="submit" 
                form="checkout-form"
                disabled={isSubmitting}
                className="w-full text-base h-14 bg-[#25D366] hover:bg-[#128C7E] text-white flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-5 h-5" />
                Pedir por WhatsApp
              </Button>

              <div className="mt-6 space-y-3">
                <div className="flex items-center gap-3 text-sm text-warm-500">
                  <ShieldCheck className="w-5 h-5 text-sage-400 shrink-0" />
                  <span>Compra 100% segura. Tus datos están protegidos.</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-warm-500">
                  <Truck className="w-5 h-5 text-sage-400 shrink-0" />
                  <span>Envíos a todo el Perú (coordinado con asesor).</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
