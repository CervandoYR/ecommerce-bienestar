import { SupplierTableClient } from "@/components/admin/supplier-table-client";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function ProveedoresPage() {
  const suppliers = await prisma.supplier.findMany({
    orderBy: { name: 'asc' },
    include: {
      _count: {
        select: { products: true }
      }
    }
  });

  return (
    <div className="animate-in fade-in duration-700">
      <SupplierTableClient initialSuppliers={suppliers} />
    </div>
  );
}
