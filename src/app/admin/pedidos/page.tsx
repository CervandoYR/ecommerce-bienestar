import { OrderTableClient } from "@/components/admin/order-table-client";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function PedidosPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      user: true,
      items: true
    }
  });

  return (
    <div className="animate-in fade-in duration-700">
      <OrderTableClient initialOrders={JSON.parse(JSON.stringify(orders))} />
    </div>
  );
}
