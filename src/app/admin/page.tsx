import prisma from "@/lib/prisma";
import { DashboardClient } from "@/components/admin/dashboard-client";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  let orders: any[] = [];
  let products: any[] = [];
  let usersCount = 0;
  let categoriesCount = 0;

  try {
    const [ordersRes, productsRes, usersRes, categoriesRes] = await Promise.all([
      prisma.order.findMany({
        where: { isArchived: false },
        include: {
          items: true,
          user: true,
          district: true,
        },
        orderBy: { createdAt: "asc" },
      }),
      prisma.product.findMany({
        where: { isActive: true },
        include: {
          category: true,
        },
      }),
      prisma.user.count(),
      prisma.category.count(),
    ]);

    orders = JSON.parse(JSON.stringify(ordersRes));
    products = JSON.parse(JSON.stringify(productsRes));
    usersCount = usersRes;
    categoriesCount = categoriesRes;
  } catch (error) {
    console.error("Error fetching admin BI data:", error);
  }

  return (
    <div className="animate-in fade-in duration-700">
      <DashboardClient
        initialOrders={orders}
        initialProducts={products}
        usersCount={usersCount}
        categoriesCount={categoriesCount}
      />
    </div>
  );
}
