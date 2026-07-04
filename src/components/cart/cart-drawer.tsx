"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X, Trash2, ShoppingBag, Plus, Minus, ArrowRight, Truck, Sparkles } from "lucide-react";
import { useCart, getCartTotal } from "@/store/useCart";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";


export function CartDrawer() {
  const { items, isOpen, setIsOpen, removeItem, updateQuantity } = useCart();
  const [mounted, setMounted] = useState(false);

  const cartTotal = getCartTotal(items);
  const FREE_SHIPPING_THRESHOLD = 150;
  const progress = Math.min((cartTotal / FREE_SHIPPING_THRESHOLD) * 100, 100);
  const remaining = FREE_SHIPPING_THRESHOLD - cartTotal;

  // Hydrate cart manually to avoid mismatch
  useEffect(() => {
    useCart.persist.rehydrate();
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-warm-900/40 backdrop-blur-sm z-50"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-warm-100">
              <h2 className="text-xl font-bold text-warm-900 flex items-center gap-2">
                <ShoppingBag className="w-6 h-6 text-sage-600" />
                Tu Carrito
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 text-warm-500 hover:text-warm-800 hover:bg-warm-100 rounded-full transition-colors"
                aria-label="Cerrar carrito"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Free Shipping Progress Bar */}
            {items.length > 0 && (
              <div className="px-6 py-4 bg-warm-50 border-b border-warm-100">
                <div className="flex items-center gap-2 mb-2">
                  <Truck className="w-4 h-4 text-sage-600" />
                  <span className="text-sm font-medium text-warm-800">
                    {remaining > 0 ? (
                      <>
                        Te faltan <strong className="text-sage-700">{formatPrice(remaining)}</strong> para envío gratis
                      </>
                    ) : (
                      <span className="text-sage-600 font-bold">¡Tienes envío gratis!</span>
                    )}
                  </span>
                </div>
                <div className="h-2 w-full bg-warm-200 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    className={cn(
                      "h-full rounded-full transition-all duration-500",
                      progress === 100 ? "bg-sage-500" : "bg-warm-800"
                    )}
                  />
                </div>
              </div>
            )}

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-20 h-20 bg-sage-50 rounded-full flex items-center justify-center text-sage-300">
                    <ShoppingBag className="w-10 h-10" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-warm-900 mb-1">
                      Tu carrito está vacío
                    </h3>
                    <p className="text-warm-500 text-sm max-w-xs">
                      ¿Aún no te decides? Tenemos los mejores productos naturales esperándote.
                    </p>
                  </div>
                  <Button
                    onClick={() => setIsOpen(false)}
                    className="mt-4"
                  >
                    Explorar productos
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  {items.map((item) => (
                    <div key={item.product.id} className="flex gap-4">
                      {/* Image */}
                      <div className="w-20 h-20 shrink-0 bg-sage-50 rounded-xl overflow-hidden border border-warm-100">
                        {item.product.images && item.product.images.length > 0 ? (
                          <img
                            src={item.product.images[0]}
                            alt={item.product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-sage-200">
                            <ShoppingBag className="w-6 h-6" />
                          </div>
                        )}
                      </div>

                      {/* Details */}
                      <div className="flex flex-1 flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start gap-2">
                            <h4 className="text-sm font-semibold text-warm-800 line-clamp-2">
                              {item.product.name}
                            </h4>
                            <button
                              onClick={() => removeItem(item.product.id)}
                              className="text-warm-400 hover:text-red-500 transition-all duration-300 cursor-pointer hover:scale-110 p-1"
                              aria-label="Eliminar producto"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          <span className="text-sm font-bold text-sage-700 block mt-1">
                            {formatPrice(item.product.price)}
                          </span>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-3 mt-2">
                          <div className="flex items-center border border-warm-200 rounded-lg">
                            <button
                              onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                              className="w-8 h-8 flex items-center justify-center text-warm-600 hover:bg-warm-100 disabled:opacity-50 transition-all duration-300 cursor-pointer rounded-l-lg hover:text-sage-600"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-8 text-center text-sm font-medium text-warm-900">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                              disabled={item.quantity >= item.product.stock}
                              className="w-8 h-8 flex items-center justify-center text-warm-600 hover:bg-warm-100 disabled:opacity-50 transition-all duration-300 cursor-pointer rounded-r-lg hover:text-sage-600"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                          {item.quantity >= item.product.stock && (
                            <span className="text-xs text-red-500 font-medium">
                              Stock máximo
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {/* UPSELL SECTION */}
              {items.length > 0 && (
                <div className="mt-8 pt-8 border-t border-warm-100">
                  <div className="flex items-center gap-2 mb-4">
                    <Sparkles className="w-4 h-4 text-gold-500" />
                    <h3 className="text-sm font-bold text-warm-900 uppercase tracking-wider">
                      Completa tu ritual
                    </h3>
                  </div>
                  <div className="bg-sage-50 rounded-2xl p-4 flex gap-4 items-center border border-sage-100">
                    <div className="w-16 h-16 rounded-xl bg-white overflow-hidden shrink-0">
                      <img src="https://images.unsplash.com/photo-1602928321679-560bb453f190?q=80&w=200&auto=format&fit=crop" alt="Vela Mini" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-bold text-warm-900">Vela de Viaje Lavanda</h4>
                      <p className="text-xs text-warm-600 mb-2">S/ 35.00</p>
                      <Button variant="secondary" size="sm" className="w-full h-8 text-xs">
                        Agregar
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-warm-100 p-6 bg-warm-50/50">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-warm-600 font-medium">Subtotal</span>
                  <span className="text-2xl font-bold text-warm-900">
                    {formatPrice(cartTotal)}
                  </span>
                </div>
                <p className="text-xs text-warm-500 mb-6 text-center">
                  Los costos de envío y descuentos se calculan en el checkout.
                </p>
                <div className="space-y-3">
                  <Button asChild size="lg" className="w-full text-base font-bold h-14 bg-sage-600 hover:bg-sage-700 text-white shadow-lg transition-all" onClick={() => setIsOpen(false)}>
                    <Link href="/checkout" className="flex items-center justify-center gap-2.5 w-full h-full">
                      <span>Ir al Checkout</span>
                      <ArrowRight className="w-5 h-5 shrink-0" />
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => setIsOpen(false)}
                    className="w-full"
                  >
                    Seguir comprando
                  </Button>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default CartDrawer;
