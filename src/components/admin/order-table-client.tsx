"use client";

import { useState, useTransition } from "react";
import { Filter, Eye, Loader2, PackageSearch, Trash2, X, MapPin, Phone, User, Calendar, DollarSign, ExternalLink, Package, Download, RotateCcw, AlertTriangle, Archive, CheckCircle2 } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { updateOrderStatus, archiveOrder, deleteOrderPermanently } from "@/app/actions/orders";
import { useToast } from "@/components/ui/toast";
import { OrderStatus } from "@prisma/client";

const VALID_STATUSES: OrderStatus[] = [
  "PENDIENTE" as OrderStatus,
  "PAGADO" as OrderStatus,
  "EN_PREPARACION" as OrderStatus,
  "EN_CAMINO" as OrderStatus,
  "ENTREGADO" as OrderStatus,
  "CANCELADO" as OrderStatus,
];

const STATUS_LABELS: Record<string, string> = {
  PENDIENTE: "Pendiente",
  PAGADO: "Pagado",
  EN_PREPARACION: "En Preparación",
  EN_CAMINO: "En Camino",
  ENTREGADO: "Entregado",
  CANCELADO: "Cancelado",
  // Fallback para pedidos en inglés
  PENDING: "Pendiente",
  PAID: "Pagado",
  PROCESSING: "En Preparación",
  SHIPPED: "En Camino",
  DELIVERED: "Entregado",
  CANCELLED: "Cancelado",
};

export function OrderTableClient({ initialOrders }: { initialOrders: any[] }) {
  const [orders, setOrders] = useState(initialOrders);
  const [viewMode, setViewMode] = useState<"ACTIVE" | "ARCHIVED">("ACTIVE");
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [actionId, setActionId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const { addToast } = useToast();

  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    startTransition(async () => {
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder((prev: any) => ({ ...prev, status: newStatus }));
      }
      
      const res = await updateOrderStatus(orderId, newStatus);
      if (res?.error) {
        setOrders(initialOrders);
        addToast({ type: "error", title: "Error", description: res.error });
      } else {
        addToast({ type: "success", title: "Estado Actualizado", description: "El estado del pedido fue actualizado." });
      }
    });
  };

  const handleArchiveOrder = (orderId: string, orderNum: string, toArchive: boolean) => {
    const actionText = toArchive ? "enviar a la papelera" : "restaurar";
    if (!window.confirm(`¿Estás seguro de que deseas ${actionText} el pedido #${orderNum}?`)) {
      return;
    }

    setActionId(orderId);
    startTransition(async () => {
      const res = await archiveOrder(orderId, toArchive);
      setActionId(null);
      if (res?.error) {
        addToast({ type: "error", title: "Error", description: res.error });
      } else {
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, isArchived: toArchive } : o));
        if (selectedOrder?.id === orderId) setSelectedOrder(null);
        if (toArchive) {
          addToast({ type: "info", title: "Enviado a Papelera", description: `El pedido #${orderNum} se movió a la papelera (puedes restaurarlo después).` });
        } else {
          addToast({ type: "success", title: "Pedido Restaurado", description: `El pedido #${orderNum} volvió a tu lista principal.` });
        }
      }
    });
  };

  const handleDeletePermanently = (orderId: string, orderNum: string) => {
    if (!window.confirm(`⚠️ ADVERTENCIA CRÍTICA: ¿Estás 100% seguro de que deseas ELIMINAR DEFINITIVAMENTE el pedido #${orderNum}? Esta acción borrará la orden de la base de datos para siempre y no se puede deshacer.`)) {
      return;
    }

    setActionId(orderId);
    startTransition(async () => {
      const res = await deleteOrderPermanently(orderId);
      setActionId(null);
      if (res?.error) {
        addToast({ type: "error", title: "Error", description: res.error });
      } else {
        setOrders(prev => prev.filter(o => o.id !== orderId));
        if (selectedOrder?.id === orderId) setSelectedOrder(null);
        addToast({ type: "success", title: "Borrado Definitivo", description: `El pedido #${orderNum} ha sido destruido permanentemente de la base de datos.` });
      }
    });
  };

  const handleExportCSV = () => {
    try {
      const ordersToExport = viewMode === "ACTIVE" 
        ? orders.filter(o => !o.isArchived)
        : orders.filter(o => o.isArchived);

      if (ordersToExport.length === 0) {
        addToast({ type: "info", title: "Sin datos", description: "No hay pedidos en esta vista para exportar." });
        return;
      }

      // Headers con acentos y formato español
      const headers = [
        "ID Pedido",
        "Fecha",
        "Cliente",
        "Teléfono",
        "DNI/RUC",
        "Dirección",
        "Distrito",
        "Productos Compresas/Brumas",
        "Total (S/)",
        "Estado",
        "Método Pago",
        "Archivado en Papelera"
      ];

      const rows = ordersToExport.map(o => [
        `"${o.orderNumber}"`,
        `"${new Date(o.createdAt).toLocaleDateString('es-PE', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}"`,
        `"${(o.shippingName || "").replace(/"/g, '""')}"`,
        `"${o.shippingPhone || ""}"`,
        `"${o.shippingDocument || "-"}"`,
        `"${(o.shippingAddress || "").replace(/"/g, '""')} ${(o.shippingReference ? `(Ref: ${o.shippingReference})` : "").replace(/"/g, '""')}"`,
        `"${o.district?.name || "-"}"`,
        `"${o.items?.map((i: any) => `${i.quantity}x ${i.productName}`).join(" | ").replace(/"/g, '""') || "-"}"`,
        `"${parseFloat(o.total).toFixed(2)}"`,
        `"${STATUS_LABELS[o.status] || o.status}"`,
        `"${o.paymentMethod}"`,
        `"${o.isArchived ? "SÍ (PAPELERA)" : "NO"}"`
      ]);

      // Agregar BOM (\uFEFF) al inicio para que Excel en Windows lea perfectamente tildes, ñ y símbolos
      const csvContent = "\uFEFF" + [headers.join(";"), ...rows.map(e => e.join(";"))].join("\n");
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      const dateStr = new Date().toISOString().slice(0, 10);
      
      link.setAttribute("href", url);
      link.setAttribute("download", `Respaldo_Pedidos_SamayMunay_${dateStr}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      addToast({ type: "success", title: "Respaldo Exportado", description: "Se ha descargado el archivo Excel/CSV compatible con tu computadora." });
    } catch (err: any) {
      addToast({ type: "error", title: "Error de Exportación", description: "No se pudo generar el archivo: " + err.message });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDIENTE':
      case 'PENDING': return 'bg-amber-100 text-amber-800 dark:bg-amber-500/10 dark:text-amber-400 border border-amber-300/50';
      case 'PAGADO':
      case 'PAID': return 'bg-blue-100 text-blue-800 dark:bg-blue-500/10 dark:text-blue-400 border border-blue-300/50';
      case 'EN_PREPARACION':
      case 'PROCESSING': return 'bg-purple-100 text-purple-800 dark:bg-purple-500/10 dark:text-purple-400 border border-purple-300/50';
      case 'EN_CAMINO':
      case 'SHIPPED': return 'bg-orange-100 text-orange-800 dark:bg-orange-500/10 dark:text-orange-400 border border-orange-300/50';
      case 'ENTREGADO':
      case 'DELIVERED': return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-300/50';
      case 'CANCELADO':
      case 'CANCELLED': return 'bg-red-100 text-red-800 dark:bg-red-500/10 dark:text-red-400 border border-red-300/50';
      default: return 'bg-warm-100 text-warm-800 dark:bg-warm-500/10 dark:text-warm-400 border border-warm-300/50';
    }
  };

  const activeOrders = orders.filter(o => !o.isArchived);
  const archivedOrders = orders.filter(o => o.isArchived);
  const currentTabOrders = viewMode === "ACTIVE" ? activeOrders : archivedOrders;

  const filteredOrders = selectedStatus === "ALL" 
    ? currentTabOrders 
    : currentTabOrders.filter(o => o.status === selectedStatus || STATUS_LABELS[o.status] === STATUS_LABELS[selectedStatus]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-warm-900 dark:text-white tracking-tight">Pedidos & Curaduría</h1>
          <p className="text-warm-500 dark:text-warm-400 mt-1 text-sm">Gestiona entregas, filtra estados y realiza copias de seguridad en un solo clic.</p>
        </div>

        <button
          onClick={handleExportCSV}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-[#C5A059] to-[#b08d4b] hover:from-[#b08d4b] hover:to-[#9a7b40] text-[#2C402E] font-bold px-5 py-3 rounded-xl text-xs sm:text-sm shadow-md hover:shadow-lg transition-all duration-300 active:scale-95 cursor-pointer shrink-0"
        >
          <Download className="w-4 h-4 stroke-[2.5]" />
          <span>📥 Exportar Respaldo (Excel / CSV)</span>
        </button>
      </div>

      {/* Main Tabs: Active vs Archived (Papelera) */}
      <div className="flex items-center gap-3 border-b border-warm-200 dark:border-warm-800 pb-3">
        <button
          onClick={() => { setViewMode("ACTIVE"); setSelectedStatus("ALL"); }}
          className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
            viewMode === "ACTIVE"
              ? "bg-sage-600 text-white shadow-md scale-105"
              : "bg-white dark:bg-warm-900/40 text-warm-600 dark:text-warm-400 hover:bg-warm-100 dark:hover:bg-warm-800 border border-warm-200 dark:border-warm-800"
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Pedidos Activos</span>
          <span className={`px-2 py-0.5 rounded-full text-xs font-mono ${viewMode === "ACTIVE" ? "bg-white/20 text-white" : "bg-warm-200 dark:bg-warm-700 text-warm-800 dark:text-warm-200"}`}>
            {activeOrders.length}
          </span>
        </button>

        <button
          onClick={() => { setViewMode("ARCHIVED"); setSelectedStatus("ALL"); }}
          className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
            viewMode === "ARCHIVED"
              ? "bg-red-600 text-white shadow-md scale-105"
              : "bg-white dark:bg-warm-900/40 text-warm-600 dark:text-warm-400 hover:bg-red-50 dark:hover:bg-red-950/20 hover:text-red-600 border border-warm-200 dark:border-warm-800"
          }`}
        >
          <Archive className="w-4 h-4" />
          <span>🗑️ Papelera (Archivados)</span>
          <span className={`px-2 py-0.5 rounded-full text-xs font-mono ${viewMode === "ARCHIVED" ? "bg-white/20 text-white" : "bg-warm-200 dark:bg-warm-700 text-warm-800 dark:text-warm-200"}`}>
            {archivedOrders.length}
          </span>
        </button>
      </div>

      {/* Filter Tabs Bar */}
      <div className="bg-white dark:bg-warm-900/30 backdrop-blur-md p-3 rounded-2xl border border-warm-200 dark:border-warm-800/50 shadow-sm flex flex-wrap items-center gap-2">
        <span className="text-xs font-bold uppercase tracking-wider text-warm-400 mr-2 flex items-center gap-1.5 pl-2">
          <Filter className="w-3.5 h-3.5 text-sage-600" /> Filtrar Estado:
        </span>
        <button
          onClick={() => setSelectedStatus("ALL")}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
            selectedStatus === "ALL"
              ? "bg-sage-600 text-white shadow-xs"
              : "bg-warm-50 dark:bg-warm-800/50 text-warm-600 dark:text-warm-400 hover:bg-warm-100 dark:hover:bg-warm-800"
          }`}
        >
          <span>Todos</span>
          <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${selectedStatus === "ALL" ? "bg-white/20 text-white" : "bg-warm-200 dark:bg-warm-700 text-warm-700 dark:text-warm-300"}`}>
            {currentTabOrders.length}
          </span>
        </button>
        {VALID_STATUSES.map(st => {
          const count = currentTabOrders.filter(o => o.status === st || STATUS_LABELS[o.status] === STATUS_LABELS[st]).length;
          return (
            <button
              key={st}
              onClick={() => setSelectedStatus(st)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                selectedStatus === st
                  ? "bg-sage-600 text-white shadow-xs"
                  : "bg-warm-50 dark:bg-warm-800/50 text-warm-600 dark:text-warm-400 hover:bg-warm-100 dark:hover:bg-warm-800"
              }`}
            >
              <span>{STATUS_LABELS[st]}</span>
              <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${selectedStatus === st ? "bg-white/20 text-white" : "bg-warm-200 dark:bg-warm-700 text-warm-700 dark:text-warm-300"}`}>
                {count}
              </span>
            </button>
          );
        })}
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
              <tr className="bg-warm-50/80 dark:bg-warm-800/30 border-b border-warm-200 dark:border-warm-800/50 text-xs uppercase tracking-wider font-semibold text-warm-500 dark:text-warm-400">
                <th className="px-6 py-4">ID Pedido</th>
                <th className="px-6 py-4">Fecha</th>
                <th className="px-6 py-4">Cliente</th>
                <th className="px-6 py-4">Total</th>
                <th className="px-6 py-4">Estado</th>
                <th className="px-6 py-4 text-right">Acciones de Control</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-warm-200 dark:divide-warm-800/50">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-16">
                    <div className="flex flex-col items-center justify-center text-center">
                      <div className="w-20 h-20 bg-warm-100 dark:bg-warm-800 rounded-full flex items-center justify-center mb-4">
                        {viewMode === "ACTIVE" ? (
                          <PackageSearch className="w-10 h-10 text-warm-400 dark:text-warm-500" />
                        ) : (
                          <Archive className="w-10 h-10 text-warm-400 dark:text-warm-500" />
                        )}
                      </div>
                      <h3 className="text-lg font-semibold text-warm-900 dark:text-white mb-1">
                        {viewMode === "ACTIVE" ? "No hay pedidos activos" : "Tu papelera está limpia"}
                      </h3>
                      <p className="text-warm-500 dark:text-warm-400 mb-2 text-sm">
                        {viewMode === "ACTIVE" 
                          ? "No se encontraron pedidos con el estado seleccionado." 
                          : "No tienes pedidos archivados ni eliminados en la papelera."}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className={`hover:bg-warm-50/50 dark:hover:bg-warm-800/10 transition-colors group ${order.isArchived ? "bg-red-50/30 dark:bg-red-950/10" : ""}`}>
                    <td className="px-6 py-4 font-medium">
                      <span className="font-mono text-xs sm:text-sm text-sage-700 dark:text-sage-400 bg-sage-50 dark:bg-sage-500/10 px-2.5 py-1 rounded-lg border border-sage-200/60 dark:border-sage-800 font-semibold">
                        {order.orderNumber}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-warm-600 dark:text-warm-400 text-xs sm:text-sm whitespace-nowrap">
                      {new Date(order.createdAt).toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-warm-900 dark:text-white">{order.shippingName}</span>
                        <span className="text-xs text-warm-500 font-light">{order.items?.length || 0} {(order.items?.length === 1) ? 'artículo' : 'artículos'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-bold text-warm-900 dark:text-white text-sm">
                      {formatPrice(parseFloat(order.total))}
                    </td>
                    <td className="px-6 py-4">
                      <select 
                        value={VALID_STATUSES.includes(order.status as OrderStatus) ? order.status : "PENDIENTE"}
                        onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
                        className={`text-xs font-semibold rounded-full px-3 py-1.5 focus:ring-2 focus:ring-sage-500 cursor-pointer outline-none shadow-2xs ${getStatusColor(order.status)}`}
                      >
                        {VALID_STATUSES.map(status => (
                          <option key={status} value={status}>{STATUS_LABELS[status]}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => setSelectedOrder(order)} 
                          className="inline-flex items-center gap-1 px-3 py-1.5 text-sage-700 dark:text-sage-300 bg-sage-50 dark:bg-sage-500/10 hover:bg-sage-100 dark:hover:bg-sage-500/20 transition-all duration-200 active:scale-95 cursor-pointer rounded-xl text-xs font-semibold border border-sage-200/50 dark:border-sage-800"
                          title="Ver detalles del pedido"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Detalles</span>
                        </button>

                        {viewMode === "ACTIVE" ? (
                          <button 
                            onClick={() => handleArchiveOrder(order.id, order.orderNumber, true)} 
                            disabled={actionId === order.id}
                            className="inline-flex items-center gap-1 px-3 py-1.5 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 transition-all duration-200 active:scale-95 cursor-pointer rounded-xl text-xs font-semibold border border-red-200/50 dark:border-red-800 disabled:opacity-50"
                            title="Mover pedido a la papelera (Archivar)"
                          >
                            {actionId === order.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                            <span>Papelera</span>
                          </button>
                        ) : (
                          <>
                            <button 
                              onClick={() => handleArchiveOrder(order.id, order.orderNumber, false)} 
                              disabled={actionId === order.id}
                              className="inline-flex items-center gap-1 px-3 py-1.5 text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 hover:bg-emerald-100 dark:hover:bg-emerald-500/20 transition-all duration-200 active:scale-95 cursor-pointer rounded-xl text-xs font-semibold border border-emerald-200/50 dark:border-emerald-800 disabled:opacity-50"
                              title="Restaurar pedido a la lista principal"
                            >
                              {actionId === order.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RotateCcw className="w-3.5 h-3.5" />}
                              <span>Restaurar</span>
                            </button>
                            
                            <button 
                              onClick={() => handleDeletePermanently(order.id, order.orderNumber)} 
                              disabled={actionId === order.id}
                              className="inline-flex items-center justify-center p-2 text-white bg-red-600 hover:bg-red-700 transition-all duration-200 active:scale-95 cursor-pointer rounded-xl text-xs font-bold shadow-xs disabled:opacity-50"
                              title="⚠️ Destruir permanentemente de la base de datos"
                            >
                              {actionId === order.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white dark:bg-warm-900 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-warm-200 dark:border-warm-800 p-6 sm:p-8 relative animate-in zoom-in-95 duration-200">
            
            <div className="flex items-center justify-between pb-4 border-b border-warm-200 dark:border-warm-800 mb-6">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-mono font-bold text-sage-600 dark:text-sage-400 uppercase tracking-widest block">
                    DETALLES DEL PEDIDO
                  </span>
                  {selectedOrder.isArchived && (
                    <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-[10px] font-mono font-bold uppercase">
                      🗑️ EN PAPELERA
                    </span>
                  )}
                </div>
                <h2 className="text-2xl font-bold text-warm-900 dark:text-white font-mono">
                  #{selectedOrder.orderNumber}
                </h2>
              </div>
              <button 
                onClick={() => setSelectedOrder(null)}
                className="p-2 rounded-full hover:bg-warm-100 dark:hover:bg-warm-800 text-warm-500 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
              <div className="bg-warm-50 dark:bg-warm-800/40 p-4 rounded-2xl border border-warm-100 dark:border-warm-800 space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-warm-400 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5" /> Datos del Cliente
                </h3>
                <div className="text-sm space-y-1">
                  <p className="font-semibold text-warm-900 dark:text-white">{selectedOrder.shippingName}</p>
                  <p className="text-warm-600 dark:text-warm-300 flex items-center gap-1.5 text-xs">
                    <Phone className="w-3.5 h-3.5 text-sage-600" /> {selectedOrder.shippingPhone}
                  </p>
                  {selectedOrder.shippingDocument && (
                    <p className="text-xs text-warm-500 font-mono">DNI/RUC: {selectedOrder.shippingDocument}</p>
                  )}
                </div>
              </div>

              <div className="bg-warm-50 dark:bg-warm-800/40 p-4 rounded-2xl border border-warm-100 dark:border-warm-800 space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-warm-400 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" /> Dirección de Entrega
                </h3>
                <div className="text-xs space-y-1 text-warm-600 dark:text-warm-300 leading-relaxed">
                  <p className="font-medium text-warm-900 dark:text-white">{selectedOrder.shippingAddress}</p>
                  <p>{selectedOrder.district?.name || 'San Juan de Miraflores, Lima'}</p>
                  {selectedOrder.shippingReference && (
                    <p className="text-warm-500 italic">Ref: {selectedOrder.shippingReference}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Artículos */}
            <div className="mb-6">
              <h3 className="text-xs font-bold uppercase tracking-wider text-warm-400 mb-3 flex items-center gap-1.5">
                <Package className="w-3.5 h-3.5" /> Artículos Curados ({selectedOrder.items?.length || 0})
              </h3>
              <div className="divide-y divide-warm-100 dark:divide-warm-800 bg-warm-50/50 dark:bg-warm-800/20 rounded-2xl border border-warm-200/80 dark:border-warm-800 px-4">
                {selectedOrder.items?.map((item: any) => (
                  <div key={item.id} className="py-3 flex items-center justify-between text-sm">
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-lg bg-sage-100 dark:bg-sage-900 text-sage-800 dark:text-sage-200 font-bold font-mono text-xs flex items-center justify-center shrink-0">
                        {item.quantity}x
                      </span>
                      <span className="font-medium text-warm-900 dark:text-white">{item.productName}</span>
                    </div>
                    <span className="font-semibold text-warm-900 dark:text-white font-mono">
                      {formatPrice(parseFloat(item.totalPrice))}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Resumen económico */}
            <div className="bg-warm-100/60 dark:bg-warm-800/50 p-4 rounded-2xl border border-warm-200 dark:border-warm-800 mb-6 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold uppercase text-warm-500 block">Total del Pedido</span>
                <span className="text-xs text-warm-400">Método: {selectedOrder.paymentMethod}</span>
              </div>
              <span className="text-2xl font-bold font-mono text-warm-900 dark:text-white">
                {formatPrice(parseFloat(selectedOrder.total))}
              </span>
            </div>

            {/* Botones de acción dentro del modal */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-warm-200 dark:border-warm-800">
              <div>
                {!selectedOrder.isArchived ? (
                  <button
                    onClick={() => handleArchiveOrder(selectedOrder.id, selectedOrder.orderNumber, true)}
                    disabled={actionId === selectedOrder.id}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 text-red-600 bg-red-50 hover:bg-red-100 dark:bg-red-500/10 dark:hover:bg-red-500/20 rounded-xl text-xs font-bold transition-all cursor-pointer disabled:opacity-50"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Mover a la Papelera</span>
                  </button>
                ) : (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleArchiveOrder(selectedOrder.id, selectedOrder.orderNumber, false)}
                      disabled={actionId === selectedOrder.id}
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-500/10 dark:hover:bg-emerald-500/20 rounded-xl text-xs font-bold transition-all cursor-pointer disabled:opacity-50"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>Restaurar Pedido</span>
                    </button>
                    <button
                      onClick={() => handleDeletePermanently(selectedOrder.id, selectedOrder.orderNumber)}
                      disabled={actionId === selectedOrder.id}
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 text-white bg-red-600 hover:bg-red-700 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs disabled:opacity-50"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Borrar Definitivamente</span>
                    </button>
                  </div>
                )}
              </div>
              
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-6 py-2.5 bg-warm-900 hover:bg-warm-800 text-white dark:bg-white dark:text-warm-900 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm"
              >
                Cerrar
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
