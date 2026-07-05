"use client";

import { useState, useTransition, useMemo } from "react";
import { 
  TrendingUp, 
  ShoppingCart, 
  Package, 
  Users, 
  Download, 
  Upload, 
  DollarSign, 
  Truck, 
  Tag, 
  Calendar, 
  ArrowUpRight, 
  ArrowDownRight, 
  Loader2, 
  CheckCircle2, 
  AlertCircle, 
  HelpCircle,
  BarChart3,
  PieChart,
  Sparkles,
  RefreshCw,
  FileSpreadsheet
} from "lucide-react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  Cell,
  PieChart as RechartsPieChart,
  Pie
} from "recharts";
import { useTheme } from "next-themes";
import { formatPrice } from "@/lib/utils";
import { useToast } from "@/components/ui/toast";
import { importProductsBI, importOrdersBI } from "@/app/actions/bi";

interface DashboardClientProps {
  initialOrders: any[];
  initialProducts: any[];
  usersCount: number;
  categoriesCount: number;
}

const STATUS_COLORS: Record<string, string> = {
  PENDIENTE: "#f59e0b",
  PAGADO: "#3b82f6",
  EN_PREPARACION: "#8b5cf6",
  EN_CAMINO: "#f97316",
  ENTREGADO: "#10b981",
  CANCELADO: "#ef4444",
};

const STATUS_LABELS: Record<string, string> = {
  PENDIENTE: "Pendiente",
  PAGADO: "Pagado",
  EN_PREPARACION: "En Preparación",
  EN_CAMINO: "En Camino",
  ENTREGADO: "Entregado",
  CANCELADO: "Cancelado",
  PENDING: "Pendiente",
  PAID: "Pagado",
  PROCESSING: "En Preparación",
  SHIPPED: "En Camino",
  DELIVERED: "Entregado",
  CANCELLED: "Cancelado",
};

export function DashboardClient({
  initialOrders,
  initialProducts,
  usersCount,
  categoriesCount
}: DashboardClientProps) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const { addToast } = useToast();
  const [isPending, startTransition] = useTransition();

  // Period filter state
  const [period, setPeriod] = useState<"7D" | "30D" | "ALL">("ALL");

  // Import BI Modal State
  const [showImportModal, setShowImportModal] = useState(false);
  const [importType, setImportType] = useState<"PRODUCTS" | "ORDERS">("PRODUCTS");
  const [csvText, setCsvText] = useState("");
  const [parsedPreview, setParsedPreview] = useState<any[]>([]);

  // Filter orders based on period
  const filteredOrders = useMemo(() => {
    const now = new Date();
    return initialOrders.filter(o => {
      if (o.isArchived) return false;
      const orderDate = new Date(o.createdAt);
      if (period === "7D") {
        const diffDays = (now.getTime() - orderDate.getTime()) / (1000 * 3600 * 24);
        return diffDays <= 7;
      }
      if (period === "30D") {
        const diffDays = (now.getTime() - orderDate.getTime()) / (1000 * 3600 * 24);
        return diffDays <= 30;
      }
      return true;
    });
  }, [initialOrders, period]);

  // Compute detailed financial & BI metrics
  const metrics = useMemo(() => {
    let grossRevenue = 0;
    let paidRevenue = 0;
    let shippingCollected = 0;
    let totalDiscounts = 0;
    let validOrdersCount = 0;

    const statusCounts: Record<string, number> = {
      PENDIENTE: 0,
      PAGADO: 0,
      EN_PREPARACION: 0,
      EN_CAMINO: 0,
      ENTREGADO: 0,
      CANCELADO: 0,
    };

    const productSalesMap: Record<string, { name: string; sku: string; qty: number; revenue: number }> = {};

    filteredOrders.forEach(o => {
      const st = (o.status || "PENDIENTE").toUpperCase();
      const normStatus = STATUS_LABELS[st] ? st : "PENDIENTE";
      statusCounts[normStatus] = (statusCounts[normStatus] || 0) + 1;

      const orderTotal = parseFloat(o.total || 0);
      const orderShipping = parseFloat(o.shippingCost || 0);
      const orderDiscount = parseFloat(o.discount || 0);

      if (normStatus !== "CANCELADO") {
        grossRevenue += orderTotal;
        shippingCollected += orderShipping;
        totalDiscounts += orderDiscount;
        validOrdersCount++;

        if (["PAGADO", "EN_PREPARACION", "EN_CAMINO", "ENTREGADO"].includes(normStatus)) {
          paidRevenue += orderTotal;
        }

        // Aggregate top selling items
        if (Array.isArray(o.items)) {
          o.items.forEach((item: any) => {
            const key = item.productName || item.productSku || "Artículo";
            if (!productSalesMap[key]) {
              productSalesMap[key] = {
                name: item.productName || "Artículo",
                sku: item.productSku || "SKU-GEN",
                qty: 0,
                revenue: 0,
              };
            }
            productSalesMap[key].qty += item.quantity || 1;
            productSalesMap[key].revenue += parseFloat(item.totalPrice || item.unitPrice || 0);
          });
        }
      }
    });

    const averageTicket = validOrdersCount > 0 ? grossRevenue / validOrdersCount : 0;
    const topProducts = Object.values(productSalesMap).sort((a, b) => b.revenue - a.revenue).slice(0, 5);

    return {
      grossRevenue,
      paidRevenue,
      shippingCollected,
      totalDiscounts,
      validOrdersCount,
      averageTicket,
      statusCounts,
      topProducts,
    };
  }, [filteredOrders]);

  // Daily revenue chart data generator
  const dailyChartData = useMemo(() => {
    const map: Record<string, { date: string; ingresos: number; pedidos: number }> = {};

    // Group filtered orders by date string
    filteredOrders.forEach(o => {
      if (o.status === "CANCELADO") return;
      const d = new Date(o.createdAt);
      const dateStr = d.toLocaleDateString("es-PE", { day: "2-digit", month: "short" });
      if (!map[dateStr]) {
        map[dateStr] = { date: dateStr, ingresos: 0, pedidos: 0 };
      }
      map[dateStr].ingresos += parseFloat(o.total || 0);
      map[dateStr].pedidos += 1;
    });

    const arr = Object.values(map);
    if (arr.length === 0) {
      return [
        { date: "Lun", ingresos: 0, pedidos: 0 },
        { date: "Mar", ingresos: 0, pedidos: 0 },
        { date: "Mié", ingresos: 0, pedidos: 0 },
        { date: "Jue", ingresos: 0, pedidos: 0 },
        { date: "Vie", ingresos: 0, pedidos: 0 },
        { date: "Sáb", ingresos: 0, pedidos: 0 },
        { date: "Dom", ingresos: 0, pedidos: 0 },
      ];
    }
    return arr;
  }, [filteredOrders]);

  // Status pie/bar chart data
  const statusChartData = useMemo(() => {
    return Object.entries(metrics.statusCounts)
      .filter(([_, count]) => count > 0)
      .map(([status, count]) => ({
        name: STATUS_LABELS[status] || status,
        rawStatus: status,
        count,
        color: STATUS_COLORS[status] || "#84a98c",
      }));
  }, [metrics.statusCounts]);

  // Export BI CSV
  const handleExportBI = () => {
    try {
      const headers = [
        "Métrica BI",
        "Valor",
        "Período Analizado",
        "Fecha de Exportación"
      ];

      const summaryRows = [
        ["Ventas Brutas Totales (S/)", parseFloat(metrics.grossRevenue.toString()).toFixed(2), period, new Date().toLocaleDateString("es-PE")],
        ["Ingresos Pagados / Cobrados (S/)", parseFloat(metrics.paidRevenue.toString()).toFixed(2), period, new Date().toLocaleDateString("es-PE")],
        ["Ticket Promedio por Pedido (S/)", parseFloat(metrics.averageTicket.toString()).toFixed(2), period, new Date().toLocaleDateString("es-PE")],
        ["Recaudación Logística Envíos (S/)", parseFloat(metrics.shippingCollected.toString()).toFixed(2), period, new Date().toLocaleDateString("es-PE")],
        ["Descuentos & Promociones (S/)", parseFloat(metrics.totalDiscounts.toString()).toFixed(2), period, new Date().toLocaleDateString("es-PE")],
        ["Total Pedidos Procesados", metrics.validOrdersCount.toString(), period, new Date().toLocaleDateString("es-PE")],
        ["Clientes Registrados", usersCount.toString(), "-", new Date().toLocaleDateString("es-PE")],
        ["Catálogo Activo", initialProducts.length.toString(), "-", new Date().toLocaleDateString("es-PE")],
      ];

      const prodHeaders = ["\n--- TOP PRODUCTOS MÁS VENDIDOS ---", "SKU", "Unidades Vendidas", "Ingresos Generados (S/)"];
      const prodRows = metrics.topProducts.map(p => [
        `"${p.name.replace(/"/g, '""')}"`,
        `"${p.sku}"`,
        p.qty.toString(),
        parseFloat(p.revenue.toString()).toFixed(2)
      ]);

      const csvContent = "\uFEFF" + [
        headers.join(";"),
        ...summaryRows.map(r => r.join(";")),
        prodHeaders.join(";"),
        ...prodRows.map(r => r.join(";"))
      ].join("\n");

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `Reporte_BI_SamayMunay_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      addToast({ type: "success", title: "Reporte BI Exportado", description: "El archivo de análisis financiero se descargó correctamente." });
    } catch (err: any) {
      addToast({ type: "error", title: "Error", description: err.message });
    }
  };

  // Handle CSV parsing for import preview
  const handleParseCSV = (text: string) => {
    setCsvText(text);
    if (!text.trim()) {
      setParsedPreview([]);
      return;
    }

    try {
      const lines = text.split(/\r?\n/).filter(l => l.trim().length > 0);
      if (lines.length < 2) return;

      const sep = lines[0].includes(";") ? ";" : ",";
      const headers = lines[0].split(sep).map(h => h.trim().replace(/^"/, "").replace(/"$/, "").toLowerCase());

      const items: any[] = [];
      for (let i = 1; i < lines.length; i++) {
        const cols = lines[i].split(sep).map(c => c.trim().replace(/^"/, "").replace(/"$/, ""));
        const obj: any = {};
        headers.forEach((h, idx) => {
          obj[h] = cols[idx];
        });

        if (importType === "PRODUCTS") {
          const sku = obj["sku"] || obj["código"] || obj["codigo"];
          const name = obj["nombre"] || obj["producto"] || obj["name"];
          const price = parseFloat(obj["precio"] || obj["price"] || "0");
          const stock = parseInt(obj["stock"] || obj["inventario"] || "0", 10);
          if (sku) items.push({ sku, name, price: isNaN(price) ? undefined : price, stock: isNaN(stock) ? undefined : stock });
        } else {
          const orderNumber = obj["id pedido"] || obj["ordernumber"] || obj["pedido"] || obj["order_number"];
          const status = obj["estado"] || obj["status"];
          if (orderNumber) items.push({ orderNumber, status });
        }
      }
      setParsedPreview(items);
    } catch (err) {
      console.error("Error parsing CSV:", err);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text) handleParseCSV(text);
    };
    reader.readAsText(file);
  };

  const handleExecuteImport = () => {
    if (parsedPreview.length === 0) {
      addToast({ type: "error", title: "Sin datos", description: "Carga o pega un archivo CSV válido con datos para importar." });
      return;
    }

    startTransition(async () => {
      let res: any;
      if (importType === "PRODUCTS") {
        res = await importProductsBI(parsedPreview);
      } else {
        res = await importOrdersBI(parsedPreview);
      }

      if (res?.success) {
        addToast({ 
          type: "success", 
          title: "Sincronización Exitosa", 
          description: `Se actualizaron ${res.updated} registros. ${res.notFound ? `(${res.notFound} no encontrados en BD).` : ""}` 
        });
        setShowImportModal(false);
        setCsvText("");
        setParsedPreview([]);
      } else {
        addToast({ type: "error", title: "Error en Sincronización", description: res?.error || "Ocurrió un error desconocido." });
      }
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      
      {/* Top Header & Interactive Action Bar */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 bg-white dark:bg-warm-900/30 backdrop-blur-md p-6 rounded-3xl border border-warm-200 dark:border-warm-800/50 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-bold text-sage-600 dark:text-sage-400 uppercase tracking-widest block">
              PANEL DE CONTROL & ANALÍTICA
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-500/10 text-emerald-800 dark:text-emerald-400 text-[10px] font-mono font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Sincronizado en tiempo real
            </span>
          </div>
          <h1 className="text-3xl font-bold text-warm-900 dark:text-white tracking-tight">
            Inteligencia de Negocios (BI)
          </h1>
          <p className="text-warm-500 dark:text-warm-400 mt-1 text-sm">
            Supervisa ingresos, costos operativos y curadurías para la toma de decisiones estratégicas.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto justify-end">
          {/* Period Selector Pills */}
          <div className="bg-warm-100/80 dark:bg-warm-800/60 p-1 rounded-2xl flex items-center border border-warm-200 dark:border-warm-700">
            <button
              onClick={() => setPeriod("7D")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                period === "7D" ? "bg-sage-600 text-white shadow-xs" : "text-warm-600 dark:text-warm-300 hover:text-warm-900"
              }`}
            >
              7 Días
            </button>
            <button
              onClick={() => setPeriod("30D")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                period === "30D" ? "bg-sage-600 text-white shadow-xs" : "text-warm-600 dark:text-warm-300 hover:text-warm-900"
              }`}
            >
              30 Días
            </button>
            <button
              onClick={() => setPeriod("ALL")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                period === "ALL" ? "bg-sage-600 text-white shadow-xs" : "text-warm-600 dark:text-warm-300 hover:text-warm-900"
              }`}
            >
              Historial Completo
            </button>
          </div>

          <button
            onClick={handleExportBI}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-[#C5A059] to-[#b08d4b] hover:from-[#b08d4b] hover:to-[#9a7b40] text-[#2C402E] font-bold px-4 py-2.5 rounded-2xl text-xs sm:text-sm shadow-md transition-all active:scale-95 cursor-pointer"
            title="Exportar reporte de análisis de datos a Excel"
          >
            <Download className="w-4 h-4 stroke-[2.5]" />
            <span>📥 Exportar BI (Excel/CSV)</span>
          </button>

          <button
            onClick={() => setShowImportModal(true)}
            className="inline-flex items-center gap-2 bg-warm-900 hover:bg-warm-800 text-white dark:bg-white dark:text-warm-900 font-bold px-4 py-2.5 rounded-2xl text-xs sm:text-sm shadow-md transition-all active:scale-95 cursor-pointer"
            title="Sincronizar y actualizar precios o stocks desde archivo"
          >
            <RefreshCw className="w-4 h-4" />
            <span>📤 Sincronizar Datos</span>
          </button>
        </div>
      </div>

      {/* 6 Financial & Operational Metric Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* 1. Gross Revenue */}
        <div className="bg-white dark:bg-warm-900/30 backdrop-blur-md p-6 rounded-3xl border border-warm-200 dark:border-warm-800/50 shadow-sm flex flex-col justify-between hover:border-emerald-500/50 transition-all group relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-bold">
              <DollarSign className="w-6 h-6" />
            </div>
            <span className="px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-xs font-mono font-bold flex items-center gap-1">
              <ArrowUpRight className="w-3.5 h-3.5" /> Ventas Brutas
            </span>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-warm-400">Ingresos Totales (Volumen)</p>
            <h3 className="text-3xl font-bold font-mono text-warm-900 dark:text-white mt-1">
              {formatPrice(metrics.grossRevenue)}
            </h3>
            <p className="text-xs text-warm-500 dark:text-warm-400 mt-2 font-light">
              Generado por <span className="font-bold text-warm-800 dark:text-warm-200">{metrics.validOrdersCount} pedidos</span> en el período.
            </p>
          </div>
        </div>

        {/* 2. Paid / Collected Revenue */}
        <div className="bg-white dark:bg-warm-900/30 backdrop-blur-md p-6 rounded-3xl border border-warm-200 dark:border-warm-800/50 shadow-sm flex flex-col justify-between hover:border-blue-500/50 transition-all group relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <span className="px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 text-xs font-mono font-bold">
              Cobrado / Seguro
            </span>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-warm-400">Ingresos Recaudados (Pagados)</p>
            <h3 className="text-3xl font-bold font-mono text-warm-900 dark:text-white mt-1">
              {formatPrice(metrics.paidRevenue)}
            </h3>
            <p className="text-xs text-warm-500 dark:text-warm-400 mt-2 font-light">
              Dinero confirmado en pasarela o transferencias.
            </p>
          </div>
        </div>

        {/* 3. Average Ticket */}
        <div className="bg-white dark:bg-warm-900/30 backdrop-blur-md p-6 rounded-3xl border border-warm-200 dark:border-warm-800/50 shadow-sm flex flex-col justify-between hover:border-amber-500/50 transition-all group relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-600 dark:text-amber-400 font-bold">
              <TrendingUp className="w-6 h-6" />
            </div>
            <span className="px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 text-xs font-mono font-bold">
              KPI Estratégico
            </span>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-warm-400">Ticket Promedio por Pedido</p>
            <h3 className="text-3xl font-bold font-mono text-warm-900 dark:text-white mt-1">
              {formatPrice(metrics.averageTicket)}
            </h3>
            <p className="text-xs text-warm-500 dark:text-warm-400 mt-2 font-light">
              Monto promedio invertido por curaduría de cliente.
            </p>
          </div>
        </div>

        {/* 4. Logistics & Shipping collected */}
        <div className="bg-white dark:bg-warm-900/30 backdrop-blur-md p-6 rounded-3xl border border-warm-200 dark:border-warm-800/50 shadow-sm flex flex-col justify-between hover:border-purple-500/50 transition-all group relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-600 dark:text-purple-400 font-bold">
              <Truck className="w-6 h-6" />
            </div>
            <span className="px-2.5 py-1 rounded-full bg-purple-50 dark:bg-purple-500/10 text-purple-700 dark:text-purple-400 text-xs font-mono font-bold">
              Logística
            </span>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-warm-400">Recaudación de Envíos</p>
            <h3 className="text-3xl font-bold font-mono text-warm-900 dark:text-white mt-1">
              {formatPrice(metrics.shippingCollected)}
            </h3>
            <p className="text-xs text-warm-500 dark:text-warm-400 mt-2 font-light">
              Fondos destinados a fletes y reparto motorizado.
            </p>
          </div>
        </div>

        {/* 5. Discounts & Promos */}
        <div className="bg-white dark:bg-warm-900/30 backdrop-blur-md p-6 rounded-3xl border border-warm-200 dark:border-warm-800/50 shadow-sm flex flex-col justify-between hover:border-red-500/50 transition-all group relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-600 dark:text-red-400 font-bold">
              <Tag className="w-6 h-6" />
            </div>
            <span className="px-2.5 py-1 rounded-full bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400 text-xs font-mono font-bold">
              Fidelización
            </span>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-warm-400">Descuentos & Beneficios Otorgados</p>
            <h3 className="text-3xl font-bold font-mono text-warm-900 dark:text-white mt-1">
              {formatPrice(metrics.totalDiscounts)}
            </h3>
            <p className="text-xs text-warm-500 dark:text-warm-400 mt-2 font-light">
              Ahorro brindado a clientes mediante cupones o promociones.
            </p>
          </div>
        </div>

        {/* 6. Community & Catalog */}
        <div className="bg-white dark:bg-warm-900/30 backdrop-blur-md p-6 rounded-3xl border border-warm-200 dark:border-warm-800/50 shadow-sm flex flex-col justify-between hover:border-violet-500/50 transition-all group relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-violet-500/5 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 rounded-2xl bg-violet-500/10 flex items-center justify-center text-violet-600 dark:text-violet-400 font-bold">
              <Users className="w-6 h-6" />
            </div>
            <span className="px-2.5 py-1 rounded-full bg-violet-50 dark:bg-violet-500/10 text-violet-700 dark:text-violet-400 text-xs font-mono font-bold">
              Ecosistema
            </span>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-warm-400">Comunidad & Catálogo</p>
            <div className="flex items-baseline gap-4 mt-1">
              <div>
                <span className="text-3xl font-bold font-mono text-warm-900 dark:text-white">{usersCount}</span>
                <span className="text-xs text-warm-500 ml-1">clientes</span>
              </div>
              <div className="h-6 w-px bg-warm-200 dark:bg-warm-700"></div>
              <div>
                <span className="text-3xl font-bold font-mono text-warm-900 dark:text-white">{initialProducts.length}</span>
                <span className="text-xs text-warm-500 ml-1">productos</span>
              </div>
            </div>
            <p className="text-xs text-warm-500 dark:text-warm-400 mt-2 font-light">
              Catálogo activo distribuido en {categoriesCount} categorías.
            </p>
          </div>
        </div>

      </div>

      {/* Dynamic Charts Section */}
      <div className="grid lg:grid-cols-3 gap-6">
        
        {/* Chart 1: Revenue & Orders Evolution */}
        <div className="lg:col-span-2 bg-white dark:bg-warm-900/30 backdrop-blur-md p-6 sm:p-8 rounded-3xl border border-warm-200 dark:border-warm-800/50 shadow-sm flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-6">
            <div>
              <h3 className="text-lg font-bold text-warm-900 dark:text-white flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-sage-600" /> Evolución de Ingresos y Pedidos
              </h3>
              <p className="text-xs text-warm-500 dark:text-warm-400">Curva de ventas brutas por día con volumen en tiempo real</p>
            </div>
            <span className="text-xs font-mono text-sage-700 dark:text-sage-300 bg-sage-50 dark:bg-sage-500/10 px-3 py-1 rounded-full font-bold">
              {period === "7D" ? "Últimos 7 días" : period === "30D" ? "Últimos 30 días" : "Todo el registro"}
            </span>
          </div>

          <div className="h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dailyChartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorIngresos" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#84a98c" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#84a98c" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#2a2a2a" : "#e5e5e5"} vertical={false} />
                <XAxis dataKey="date" stroke={isDark ? "#888" : "#666"} fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke={isDark ? "#888" : "#666"} fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `S/${val}`} />
                <RechartsTooltip
                  contentStyle={{ 
                    backgroundColor: isDark ? "#1a1a1a" : "#ffffff", 
                    borderColor: isDark ? "#333" : "#e5e5e5", 
                    borderRadius: "16px",
                    boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1)",
                    color: isDark ? "#fff" : "#1a1a1a" 
                  }}
                  formatter={(value: any, name: any) => [name === "ingresos" ? `S/ ${parseFloat(value).toFixed(2)}` : `${value} u.`, name === "ingresos" ? "Ingresos Brutos" : "Nº Pedidos"]}
                />
                <Area type="monotone" dataKey="ingresos" stroke="#84a98c" strokeWidth={3} fillOpacity={1} fill="url(#colorIngresos)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Order Status Distribution */}
        <div className="bg-white dark:bg-warm-900/30 backdrop-blur-md p-6 sm:p-8 rounded-3xl border border-warm-200 dark:border-warm-800/50 shadow-sm flex flex-col justify-between">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-warm-900 dark:text-white flex items-center gap-2">
              <PieChart className="w-5 h-5 text-[#C5A059]" /> Desglose por Curaduría
            </h3>
            <p className="text-xs text-warm-500 dark:text-warm-400">Distribución de pedidos según etapa</p>
          </div>

          <div className="h-[220px] w-full flex items-center justify-center">
            {statusChartData.length === 0 ? (
              <p className="text-xs text-warm-400 italic">No hay pedidos registrados para mostrar gráfico.</p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={statusChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="count"
                  >
                    {statusChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip
                    contentStyle={{ 
                      backgroundColor: isDark ? "#1a1a1a" : "#ffffff", 
                      borderColor: isDark ? "#333" : "#e5e5e5", 
                      borderRadius: "12px", 
                      color: isDark ? "#fff" : "#1a1a1a" 
                    }}
                    formatter={(val: any, name: any) => [`${val} pedidos`, name]}
                  />
                </RechartsPieChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Legend */}
          <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-warm-100 dark:border-warm-800 text-xs font-medium">
            {statusChartData.map((st, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: st.color }}></span>
                <span className="text-warm-700 dark:text-warm-300 truncate">{st.name} ({st.count})</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Top Products Section */}
      <div className="bg-white dark:bg-warm-900/30 backdrop-blur-md p-6 sm:p-8 rounded-3xl border border-warm-200 dark:border-warm-800/50 shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h3 className="text-lg font-bold text-warm-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#C5A059]" /> Top 5 Productos Más Vendidos
            </h3>
            <p className="text-xs text-warm-500 dark:text-warm-400">Los artículos de bienestar preferidos por tus clientes en este período</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-warm-50/80 dark:bg-warm-800/30 border-b border-warm-200 dark:border-warm-800 text-xs uppercase font-semibold text-warm-500">
                <th className="px-4 py-3">Ranking</th>
                <th className="px-4 py-3">Producto / Curaduría</th>
                <th className="px-4 py-3">SKU</th>
                <th className="px-4 py-3 text-center">Unidades Vendidas</th>
                <th className="px-4 py-3 text-right">Ingresos Generados</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-warm-100 dark:divide-warm-800/50 text-sm">
              {metrics.topProducts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-xs text-warm-400 italic">
                    Aún no hay ventas suficientes en este período para generar ranking.
                  </td>
                </tr>
              ) : (
                metrics.topProducts.map((p, idx) => (
                  <tr key={idx} className="hover:bg-warm-50/50 dark:hover:bg-warm-800/10 transition-colors">
                    <td className="px-4 py-3.5 font-mono font-bold text-sage-600 dark:text-sage-400">
                      #{idx + 1}
                    </td>
                    <td className="px-4 py-3.5 font-bold text-warm-900 dark:text-white">
                      {p.name}
                    </td>
                    <td className="px-4 py-3.5 font-mono text-xs text-warm-500">
                      {p.sku}
                    </td>
                    <td className="px-4 py-3.5 text-center font-bold font-mono bg-warm-50/50 dark:bg-warm-800/20 rounded-lg">
                      {p.qty} u.
                    </td>
                    <td className="px-4 py-3.5 text-right font-mono font-bold text-emerald-600 dark:text-emerald-400">
                      {formatPrice(p.revenue)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* BI Sincronización e Importación Modal */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white dark:bg-warm-900 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-warm-200 dark:border-warm-800 p-6 sm:p-8 relative animate-in zoom-in-95 duration-200 space-y-6">
            
            <div className="flex items-center justify-between pb-4 border-b border-warm-200 dark:border-warm-800">
              <div>
                <span className="text-xs font-mono font-bold text-sage-600 dark:text-sage-400 uppercase tracking-widest block mb-1">
                  HERRAMIENTA BI & UPSERT
                </span>
                <h2 className="text-xl font-bold text-warm-900 dark:text-white flex items-center gap-2">
                  <FileSpreadsheet className="w-5 h-5 text-[#C5A059]" /> Sincronización Inteligente de Datos
                </h2>
              </div>
              <button 
                onClick={() => setShowImportModal(false)}
                className="p-2 rounded-full hover:bg-warm-100 dark:hover:bg-warm-800 text-warm-500 transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Guía didáctica para el usuario/personal */}
            <div className="bg-sage-50 dark:bg-sage-950/20 p-4 rounded-2xl border border-sage-200 dark:border-sage-800 text-xs text-sage-800 dark:text-sage-300 leading-relaxed space-y-2">
              <p className="font-bold flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 shrink-0" /> ¿Cómo funciona la sincronización (Sin sobreescribir ni perder datos)?
              </p>
              <p>
                Al importar un archivo CSV, el sistema ejecuta una estrategia <strong>Upsert No Destructiva</strong>:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Si el SKU o Pedido ya existe:</strong> Solo actualiza sus valores (por ejemplo, el nuevo precio o stock).</li>
                <li><strong>Si no existe:</strong> Te informará para que lo revises.</li>
                <li><strong>Seguridad:</strong> Nunca se borrará ninguna orden ni producto antiguo de tu base de datos al importar.</li>
              </ul>
            </div>

            {/* Selector de Tipo de Importación */}
            <div className="flex gap-2 p-1 bg-warm-100 dark:bg-warm-800 rounded-2xl">
              <button
                onClick={() => { setImportType("PRODUCTS"); setParsedPreview([]); setCsvText(""); }}
                className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  importType === "PRODUCTS" ? "bg-white dark:bg-warm-900 shadow-sm text-warm-900 dark:text-white" : "text-warm-600 dark:text-warm-400"
                }`}
              >
                📦 Sincronizar Precios / Stock por SKU
              </button>
              <button
                onClick={() => { setImportType("ORDERS"); setParsedPreview([]); setCsvText(""); }}
                className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  importType === "ORDERS" ? "bg-white dark:bg-warm-900 shadow-sm text-warm-900 dark:text-white" : "text-warm-600 dark:text-warm-400"
                }`}
              >
                🚚 Sincronizar Estados de Pedidos
              </button>
            </div>

            {/* Zona de Carga de Archivo */}
            <div className="border-2 border-dashed border-warm-300 dark:border-warm-700 hover:border-sage-500 rounded-2xl p-6 text-center space-y-3 transition-colors bg-warm-50/50 dark:bg-warm-800/20">
              <Upload className="w-8 h-8 text-sage-600 mx-auto" />
              <div>
                <label className="text-xs sm:text-sm font-bold text-warm-900 dark:text-white cursor-pointer hover:underline block">
                  Seleccionar archivo CSV desde tu computadora
                  <input 
                    type="file" 
                    accept=".csv,.txt" 
                    onChange={handleFileUpload}
                    className="hidden" 
                  />
                </label>
                <span className="text-[11px] text-warm-400 block mt-1">
                  {importType === "PRODUCTS" ? "Columnas esperadas: sku; precio; stock; nombre" : "Columnas esperadas: pedido; estado"}
                </span>
              </div>
            </div>

            {/* Previsualización de filas analizadas */}
            {parsedPreview.length > 0 && (
              <div className="space-y-2">
                <span className="text-xs font-bold text-sage-700 dark:text-sage-400 flex items-center justify-between">
                  <span>✅ Filas detectadas listas para sincronizar: {parsedPreview.length}</span>
                  <span className="text-[10px] font-mono bg-sage-100 dark:bg-sage-900 px-2 py-0.5 rounded">Previsualización</span>
                </span>
                <div className="max-h-40 overflow-y-auto bg-warm-50 dark:bg-warm-800/40 rounded-xl p-3 border border-warm-200 dark:border-warm-800 text-xs font-mono">
                  {parsedPreview.slice(0, 5).map((row, idx) => (
                    <div key={idx} className="py-1 border-b border-warm-200/50 dark:border-warm-700 last:border-0 truncate">
                      {JSON.stringify(row)}
                    </div>
                  ))}
                  {parsedPreview.length > 5 && (
                    <div className="text-center text-warm-400 py-1 italic">
                      ...y {parsedPreview.length - 5} registros más...
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Botones del modal */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-warm-200 dark:border-warm-800">
              <button
                onClick={() => setShowImportModal(false)}
                className="px-5 py-2.5 bg-warm-100 hover:bg-warm-200 dark:bg-warm-800 text-warm-700 dark:text-warm-300 rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={handleExecuteImport}
                disabled={isPending || parsedPreview.length === 0}
                className="px-6 py-2.5 bg-gradient-to-r from-sage-600 to-sage-700 hover:from-sage-700 hover:to-sage-800 text-white rounded-xl text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer disabled:opacity-50 flex items-center gap-2"
              >
                {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                <span>🚀 Confirmar e Importar ({parsedPreview.length})</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
