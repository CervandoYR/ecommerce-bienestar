"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Package, Clock, CreditCard, Truck, CheckCircle2, XCircle, 
  RotateCcw, ShoppingBag, ChevronRight, Calendar, AlertCircle, Sparkles 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/store/useCart";
import { useToast } from "@/components/ui/toast";
import { formatPrice } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface OrderItem {
  id: string;
  productName: string;
  productSku: string;
  productImage?: string | null;
  quantity: number;
  unitPrice: number | string;
  totalPrice: number | string;
  productId: string;
}

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  paymentMethod: string;
  total: number | string;
  createdAt: string;
  items: OrderItem[];
}

interface OrderHistoryProps {
  orders: Order[];
}

const STEPPER_SEQUENCE = [
  { key: "PENDING", spanish: "PENDIENTE", label: "Pendiente", icon: Clock },
  { key: "PAID", spanish: "PAGADO", label: "Pagado", icon: CreditCard },
  { key: "PROCESSING", spanish: "EN_PREPARACION", label: "En Preparación", icon: Package },
  { key: "SHIPPED", spanish: "EN_CAMINO", label: "En Camino", icon: Truck },
  { key: "DELIVERED", spanish: "ENTREGADO", label: "Entregado", icon: CheckCircle2 },
];

function getStatusIndex(status: string): number {
  const upper = status.toUpperCase();
  const idx = STEPPER_SEQUENCE.findIndex(s => s.key === upper || s.spanish === upper);
  return idx === -1 ? 0 : idx;
}

function isCancelled(status: string): boolean {
  const upper = status.toUpperCase();
  return upper === "CANCELADO" || upper === "CANCELLED";
}

export function OrderHistory({ orders }: OrderHistoryProps) {
  const { addItem, setIsOpen } = useCart();
  const { addToast } = useToast();
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  const handleBuyAgain = (order: Order) => {
    let count = 0;
    order.items.forEach((item) => {
      // Reconstruct temporary product object to add to cart
      const mockProduct: any = {
        id: item.productId || item.id,
        name: item.productName,
        slug: item.productName.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        price: Number(item.unitPrice || 0),
        images: item.productImage ? [item.productImage] : [],
        stock: 99,
        isActive: true,
      };
      addItem(mockProduct, item.quantity);
      count += item.quantity;
    });

    addToast({
      type: "success",
      title: "Productos agregados al carrito",
      description: `Se agregaron ${count} ítem(s) de tu pedido ${order.orderNumber}.`,
    });
    setIsOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-4 border-b border-warm-200/60">
        <h3 className="text-xl font-bold text-warm-900 font-serif">Historial de Pedidos</h3>
        <p className="text-sm text-warm-500">Consulta el estado de tus compras y su seguimiento en tiempo real.</p>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-12 text-center border border-warm-200/80 shadow-sm">
          <div className="w-20 h-20 bg-warm-100/80 rounded-full flex items-center justify-center mx-auto text-warm-400 mb-4">
            <Package className="w-10 h-10" />
          </div>
          <h4 className="text-xl font-bold text-warm-900 font-serif mb-2">Aún no tienes pedidos registrados</h4>
          <p className="text-warm-500 text-sm max-w-md mx-auto mb-8">
            Descubre nuestras formulaciones terapéuticas y accesorios de meditación, creados para restaurar tu bienestar y serenidad.
          </p>
          <Button asChild size="lg" className="bg-sage-700 hover:bg-sage-800 text-white font-medium px-8 shadow-md">
            <Link href="/productos">Explorar Catálogo</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => {
            const currentStepIdx = getStatusIndex(order.status);
            const cancelled = isCancelled(order.status);
            const isCompleted = order.status.toUpperCase() === "ENTREGADO" || order.status.toUpperCase() === "DELIVERED";
            const isExpanded = expandedOrderId === order.id;

            return (
              <div
                key={order.id}
                className="bg-white rounded-3xl border border-warm-200/80 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
              >
                {/* Card Top / Header */}
                <div className="p-6 md:p-8 bg-gradient-to-r from-warm-50/50 to-white border-b border-warm-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-sage-100 text-sage-800 border border-sage-200/60 font-mono">
                        {order.orderNumber}
                      </span>
                      <span className="text-xs text-warm-500 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(order.createdAt).toLocaleDateString("es-PE", {
                          day: "numeric",
                          month: "short",
                          year: "numeric"
                        })}
                      </span>
                    </div>
                    <h4 className="font-bold text-warm-900 text-base md:text-lg font-serif">
                      Pedido de {order.items.length} {order.items.length === 1 ? "producto" : "productos"}
                    </h4>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-6 border-t sm:border-t-0 pt-3 sm:pt-0 border-warm-100">
                    <div className="text-left sm:text-right">
                      <span className="text-xs text-warm-400 block uppercase">Total del pedido</span>
                      <span className="text-xl font-bold text-gold-600 font-serif">
                        {formatPrice(Number(order.total))}
                      </span>
                    </div>

                    {isCompleted && (
                      <Button
                        onClick={() => handleBuyAgain(order)}
                        variant="secondary"
                        size="sm"
                        className="bg-gold-50 hover:bg-gold-100 text-gold-800 border border-gold-200/80 font-semibold px-4 h-10 flex items-center gap-2 shadow-xs shrink-0 cursor-pointer"
                      >
                        <RotateCcw className="w-4 h-4 text-gold-600 shrink-0" />
                        <span>Volver a comprar</span>
                      </Button>
                    )}
                  </div>
                </div>

                {/* Stepper Tracker Visual */}
                <div className="p-6 md:px-8 bg-warm-50/30 border-b border-warm-100">
                  {cancelled ? (
                    <div className="flex items-center gap-3 bg-red-50 text-red-700 p-4 rounded-2xl border border-red-200/80">
                      <XCircle className="w-6 h-6 text-red-500 shrink-0" />
                      <div>
                        <h5 className="font-bold text-sm">Pedido Cancelado</h5>
                        <p className="text-xs text-red-600">Este pedido fue cancelado. Si tienes consultas, por favor contáctanos por WhatsApp.</p>
                      </div>
                    </div>
                  ) : (
                    <div className="py-2">
                      <div className="flex items-center justify-between relative">
                        {/* Connecting Line background */}
                        <div className="absolute top-5 left-4 right-4 h-1 bg-warm-200 -z-0 rounded-full" />
                        
                        {/* Connecting Line active fill */}
                        <div 
                          className="absolute top-5 left-4 h-1 bg-gradient-to-r from-sage-700 to-gold-500 -z-0 rounded-full transition-all duration-700" 
                          style={{ width: `${(currentStepIdx / (STEPPER_SEQUENCE.length - 1)) * 95}%` }}
                        />

                        {STEPPER_SEQUENCE.map((step, idx) => {
                          const Icon = step.icon;
                          const isDone = idx < currentStepIdx;
                          const isCurrent = idx === currentStepIdx;
                          const isPending = idx > currentStepIdx;

                          return (
                            <div key={step.key} className="flex flex-col items-center relative z-10 w-1/5">
                              <div
                                className={cn(
                                  "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 shadow-sm border-2",
                                  isDone && "bg-sage-700 text-white border-sage-700 scale-100",
                                  isCurrent && "bg-gold-500 text-white border-gold-400 ring-4 ring-gold-500/20 scale-110",
                                  isPending && "bg-white text-warm-300 border-warm-200 scale-95"
                                )}
                              >
                                <Icon className={cn("w-4 h-4", isCurrent && "animate-pulse")} />
                              </div>
                              <span
                                className={cn(
                                  "text-[11px] md:text-xs font-semibold mt-2.5 text-center leading-tight transition-colors",
                                  isDone && "text-sage-800",
                                  isCurrent && "text-gold-700 font-bold",
                                  isPending && "text-warm-400 font-normal"
                                )}
                              >
                                {step.label}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {/* Items preview */}
                <div className="p-6 md:p-8">
                  <div className="space-y-4">
                    {order.items.slice(0, isExpanded ? order.items.length : 2).map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between gap-4 p-3 rounded-2xl hover:bg-warm-50/60 transition-colors border border-transparent hover:border-warm-100"
                      >
                        <div className="flex items-center gap-4 min-w-0">
                          <div className="relative w-14 h-14 rounded-xl bg-warm-100 overflow-hidden shrink-0 border border-warm-200/60">
                            {item.productImage ? (
                              <Image
                                src={item.productImage}
                                alt={item.productName}
                                fill
                                className="object-cover object-center"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-warm-300">
                                <Package className="w-6 h-6" />
                              </div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <h5 className="font-bold text-warm-900 text-sm md:text-base truncate font-serif">
                              {item.productName}
                            </h5>
                            <p className="text-xs text-warm-500">
                              Cantidad: <span className="font-semibold text-warm-700">{item.quantity}</span> × {formatPrice(Number(item.unitPrice))}
                            </p>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <span className="font-bold text-sm md:text-base text-warm-900 font-serif">
                            {formatPrice(Number(item.totalPrice))}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {order.items.length > 2 && (
                    <div className="mt-4 pt-3 border-t border-warm-100 text-center">
                      <button
                        onClick={() => setExpandedOrderId(isExpanded ? null : order.id)}
                        className="text-xs font-bold text-sage-700 hover:text-gold-600 transition-colors cursor-pointer inline-flex items-center gap-1"
                      >
                        <span>{isExpanded ? "Ocultar ítems adicionales" : `Ver los ${order.items.length - 2} ítem(s) restante(s)`}</span>
                        <ChevronRight className={cn("w-3.5 h-3.5 transition-transform", isExpanded && "rotate-90")} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
