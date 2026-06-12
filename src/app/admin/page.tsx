import prisma from "@/lib/prisma";
import { Card } from "@/components/ui/card";
import { Package, ShoppingCart, Users, TrendingUp, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { RevenueChart, OrdersChart } from "@/components/admin/dashboard-charts";

export default async function AdminDashboardPage() {
  // Try to fetch stats, but fallback gracefully if DB is not connected
  let stats = {
    productsCount: 0,
    ordersCount: 0,
    revenue: 0,
    usersCount: 0,
  };

  try {
    const productsCount = await prisma.product.count();
    const ordersCount = await prisma.order.count();
    const usersCount = await prisma.user.count();
    
    // Sum all orders that are paid or delivered
    const revenueResult = await prisma.order.aggregate({
      where: {
        status: {
          in: ['PAGADO', 'EN_PREPARACION', 'EN_CAMINO', 'ENTREGADO'],
        },
      },
      _sum: {
        total: true,
      },
    });
    
    stats = {
      productsCount,
      ordersCount,
      usersCount,
      revenue: Number(revenueResult._sum.total || 0),
    };
  } catch (error) {
    console.warn("Could not fetch admin stats (mock DB):", error);
  }

  const statCards = [
    {
      title: "Ingresos Totales",
      value: formatPrice(stats.revenue),
      icon: TrendingUp,
      color: "text-emerald-400",
      bgColor: "bg-emerald-500/10",
      trend: "+12.5%",
      trendUp: true,
    },
    {
      title: "Pedidos Activos",
      value: stats.ordersCount.toString(),
      icon: ShoppingCart,
      color: "text-blue-400",
      bgColor: "bg-blue-500/10",
      trend: "+4.1%",
      trendUp: true,
    },
    {
      title: "Productos",
      value: stats.productsCount.toString(),
      icon: Package,
      color: "text-amber-400",
      bgColor: "bg-amber-500/10",
      trend: "-1.2%",
      trendUp: false,
    },
    {
      title: "Nuevos Clientes",
      value: stats.usersCount.toString(),
      icon: Users,
      color: "text-violet-400",
      bgColor: "bg-violet-500/10",
      trend: "+8.4%",
      trendUp: true,
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-warm-900 dark:text-white tracking-tight">Dashboard</h1>
          <p className="text-warm-500 dark:text-warm-400 mt-1">Métricas y rendimiento de tu tienda en tiempo real.</p>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, i) => (
          <div key={i} className="bg-white dark:bg-warm-900/30 backdrop-blur-md p-6 rounded-2xl border border-warm-200 dark:border-warm-800/50 shadow-sm dark:shadow-xl flex flex-col gap-4 hover:border-warm-300 dark:hover:border-warm-700 transition-colors">
            <div className="flex justify-between items-start">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${stat.bgColor}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div className={`flex items-center gap-1 text-sm font-medium ${stat.trendUp ? 'text-emerald-500 dark:text-emerald-400' : 'text-red-500 dark:text-red-400'}`}>
                {stat.trend}
                {stat.trendUp ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-warm-500 dark:text-warm-400">{stat.title}</p>
              <h3 className="text-3xl font-bold text-warm-900 dark:text-white mt-1">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-warm-900/30 backdrop-blur-md p-6 rounded-2xl border border-warm-200 dark:border-warm-800/50 shadow-sm dark:shadow-xl">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-warm-900 dark:text-white">Ingresos (Últimos 7 días)</h3>
            <p className="text-sm text-warm-500 dark:text-warm-400">Volumen de ventas brutas</p>
          </div>
          <RevenueChart />
        </div>

        <div className="bg-white dark:bg-warm-900/30 backdrop-blur-md p-6 rounded-2xl border border-warm-200 dark:border-warm-800/50 shadow-sm dark:shadow-xl">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-warm-900 dark:text-white">Tráfico de Pedidos</h3>
            <p className="text-sm text-warm-500 dark:text-warm-400">Cantidad por día</p>
          </div>
          <OrdersChart />
        </div>
      </div>
    </div>
  );
}
