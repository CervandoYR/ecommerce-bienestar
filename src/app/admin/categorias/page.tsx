import { CategoryTableClient } from "@/components/admin/category-table-client";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function CategoriasPage() {
  const categories = await prisma.category.findMany({
    orderBy: { sortOrder: 'asc' },
    include: {
      _count: {
        select: { products: true }
      }
    }
  });

  return (
    <div className="animate-in fade-in duration-700">
      <CategoryTableClient initialCategories={categories} />
    </div>
  );
}
