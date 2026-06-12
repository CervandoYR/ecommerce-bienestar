import { ShoppingCart, Search, Filter, Eye } from "lucide-react";
import { formatPrice } from "@/lib/utils";

const mockOrders = [
  { id: "ORD-20260612-A1B2", date: "12 Jun, 10:30 AM", customer: "María González", total: 150.00, status: "PAGADO", items: 3 },
  { id: "ORD-20260612-X9Y8", date: "12 Jun, 09:15 AM", customer: "Carlos Ruiz", total: 85.50, status: "EN_PREPARACION", items: 1 },
  { id: "ORD-20260611-L4K3", date: "11 Jun, 04:20 PM", customer: "Ana Torres", total: 320.00, status: "EN_CAMINO", items: 5 },
  { id: "ORD-20260610-P7Q6", date: "10 Jun, 11:05 AM", customer: "Jorge Silva", total: 45.00, status: "ENTREGADO", items: 1 },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'PAGADO': return 'bg-blue-100 text-blue-800 dark:bg-blue-500/10 dark:text-blue-400 border-blue-200 dark:border-blue-500/20';
    case 'EN_PREPARACION': return 'bg-amber-100 text-amber-800 dark:bg-amber-500/10 dark:text-amber-400 border-amber-200 dark:border-amber-500/20';
    case 'EN_CAMINO': return 'bg-violet-100 text-violet-800 dark:bg-violet-500/10 dark:text-violet-400 border-violet-200 dark:border-violet-500/20';
    case 'ENTREGADO': return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20';
    default: return 'bg-warm-100 text-warm-800 dark:bg-warm-500/10 dark:text-warm-400 border-warm-200 dark:border-warm-500/20';
  }
};

export default function PedidosPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-warm-900 dark:text-white tracking-tight">Pedidos</h1>
          <p className="text-warm-500 dark:text-warm-400 mt-1">Gestiona los pedidos de tus clientes y su estado de envío.</p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white dark:bg-warm-900/30 backdrop-blur-md p-4 rounded-2xl border border-warm-200 dark:border-warm-800/50 shadow-sm flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative w-full max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-warm-400" />
          <input 
            type="text" 
            placeholder="Buscar por ID, cliente o correo..." 
            className="w-full pl-9 pr-4 py-2 bg-warm-50 dark:bg-warm-900/50 border border-warm-200 dark:border-warm-800 rounded-lg text-sm text-warm-900 dark:text-white placeholder:text-warm-400 focus:outline-none focus:ring-2 focus:ring-sage-500/50 transition-shadow"
          />
        </div>
        <button className="flex items-center gap-2 bg-warm-50 dark:bg-warm-900/50 border border-warm-200 dark:border-warm-800 hover:bg-warm-100 dark:hover:bg-warm-800 text-warm-700 dark:text-warm-200 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors shrink-0">
          <Filter className="w-4 h-4" />
          Filtrar Estados
        </button>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-warm-900/30 backdrop-blur-md border border-warm-200 dark:border-warm-800/50 rounded-2xl shadow-sm overflow-hidden">
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
              {mockOrders.map((order) => (
                <tr key={order.id} className="hover:bg-warm-50/50 dark:hover:bg-warm-800/10 transition-colors group">
                  <td className="px-6 py-4">
                    <span className="font-mono text-sm font-medium text-warm-900 dark:text-white">
                      {order.id}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-warm-600 dark:text-warm-400 text-sm">
                    {order.date}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-medium text-warm-900 dark:text-white text-sm">{order.customer}</span>
                      <span className="text-xs text-warm-500 dark:text-warm-400">{order.items} artículos</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-semibold text-warm-900 dark:text-white text-sm">
                    {formatPrice(order.total)}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                      {order.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="inline-flex items-center gap-1.5 p-2 text-sage-600 dark:text-sage-400 hover:text-sage-700 dark:hover:text-sage-300 transition-colors rounded-lg hover:bg-sage-50 dark:hover:bg-sage-500/10 text-sm font-medium opacity-0 group-hover:opacity-100">
                      <Eye className="w-4 h-4" />
                      Ver Detalles
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
