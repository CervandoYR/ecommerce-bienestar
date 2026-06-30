"use client";

import { useState, useTransition } from "react";
import { Filter, Eye, Loader2, PackageSearch } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { updateOrderStatus } from "@/app/actions/orders";
import { useToast } from "@/components/ui/toast";
import { OrderStatus } from "@prisma/client";

export function OrderTableClient({ initialOrders }: { initialOrders: any[] }) {
  const [orders, setOrders] = useState(initialOrders);
  const [isPending, startTransition] = useTransition();
  const { addToast } = useToast();

  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    startTransition(async () => {
      // Optimistic UI update
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
      
      const res = await updateOrderStatus(orderId, newStatus);
      if (res?.error) {
        // Revert optimistic update
        setOrders(initialOrders);
        addToast({ type: "error", title: "Error", description: res.error });
      } else {
        addToast({ type: "success", title: "Estado Actualizado", description: "El estado del pedido fue actualizado." });
      }
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDIENTE': return 'bg-amber-100 text-amber-800 dark:bg-amber-500/10 dark:text-amber-400';
      case 'PAGADO': return 'bg-blue-100 text-blue-800 dark:bg-blue-500/10 dark:text-blue-400';
      case 'EN_PREPARACION': return 'bg-purple-100 text-purple-800 dark:bg-purple-500/10 dark:text-purple-400';
      case 'EN_CAMINO': return 'bg-orange-100 text-orange-800 dark:bg-orange-500/10 dark:text-orange-400';
      case 'ENTREGADO': return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-400';
      case 'CANCELADO': return 'bg-red-100 text-red-800 dark:bg-red-500/10 dark:text-red-400';
      default: return 'bg-warm-100 text-warm-800 dark:bg-warm-500/10 dark:text-warm-400';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-warm-900 dark:text-white tracking-tight">Pedidos</h1>
          <p className="text-warm-500 dark:text-warm-400 mt-1">Gestiona los pedidos de tus clientes.</p>
        </div>
      </div>

      <div className="bg-white dark:bg-warm-900/30 backdrop-blur-md p-4 rounded-2xl border border-warm-200 dark:border-warm-800/50 shadow-sm flex flex-col sm:flex-row items-center gap-4">
        <button className="flex items-center gap-2 bg-warm-50 dark:bg-warm-900/50 border border-warm-200 dark:border-warm-800 hover:bg-warm-100 dark:hover:bg-warm-800 text-warm-700 dark:text-warm-200 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 active:scale-95 cursor-pointer shrink-0">
          <Filter className="w-4 h-4" />
          Filtrar Estados
        </button>
      </div>

      <div className="bg-white dark:bg-warm-900/30 backdrop-blur-md border border-warm-200 dark:border-warm-800/50 rounded-2xl shadow-sm overflow-hidden relative">
        {isPending && (
          <div className="absolute inset-0 bg-white/50 dark:bg-warm-900/50 backdrop-blur-sm z-10 flex items-center justify-center">
             <Loader2 className="w-8 h-8 text-sage-600 animate-spin" />
          </div>
        )}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-warm-50/50 dark:bg-warm-800/20 border-b border-warm-200 dark:border-warm-800/50 text-xs uppercase tracking-wider font-semibold text-warm-500 dark:text-warm-400">
                <th className="px-6 py-4">ID Pedido</th>
                <th className="px-6 py-4">Fecha</th>
                <th className="px-6 py-4">Cliente</th>
                <th className="px-6 py-4">Total</th>
                <th className="px-6 py-4">Estado</th>
                <th className="px-6 py-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-warm-200 dark:divide-warm-800/50">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-16">
                    <div className="flex flex-col items-center justify-center text-center">
                      <div className="w-24 h-24 bg-warm-100 dark:bg-warm-800 rounded-full flex items-center justify-center mb-4">
                        <PackageSearch className="w-12 h-12 text-warm-400 dark:text-warm-500" />
                      </div>
                      <h3 className="text-lg font-semibold text-warm-900 dark:text-white mb-1">No hay pedidos</h3>
                      <p className="text-warm-500 dark:text-warm-400 mb-6">Aún no has recibido ningún pedido en la tienda.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id} className="hover:bg-warm-50/50 dark:hover:bg-warm-800/10 transition-colors group">
                    <td className="px-6 py-4">
                      <span className="font-mono text-sm text-sage-600 dark:text-sage-400 font-medium">
                        {order.orderNumber}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-warm-600 dark:text-warm-400 text-sm">
                      {new Date(order.createdAt).toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-warm-900 dark:text-white">{order.shippingName}</span>
                        <span className="text-xs text-warm-500">{order.items.length} items</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium text-warm-900 dark:text-white">
                      {formatPrice(parseFloat(order.total))}
                    </td>
                    <td className="px-6 py-4">
                      <select 
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
                        className={`text-xs font-medium rounded-full px-2.5 py-1 focus:ring-2 focus:ring-sage-500 cursor-pointer outline-none ${getStatusColor(order.status)}`}
                      >
                        {Object.values(OrderStatus).map(status => (
                          <option key={status} value={status}>{status.replace('_', ' ')}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => alert("Módulo en construcción")} className="inline-flex items-center gap-1.5 p-2 text-sage-600 dark:text-sage-400 hover:text-sage-700 dark:hover:text-sage-300 transition-all duration-200 active:scale-95 cursor-pointer rounded-lg hover:bg-sage-50 dark:hover:bg-sage-500/10 text-sm font-medium opacity-0 group-hover:opacity-100">
                        <Eye className="w-4 h-4" />
                        Ver Detalles
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
