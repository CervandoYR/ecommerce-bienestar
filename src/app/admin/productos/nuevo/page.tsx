import prisma from "@/lib/prisma";
import { ProductForm } from "@/components/admin/product-form";

export const dynamic = "force-dynamic";

export default async function NuevoProductoPage() {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" }
  });

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-warm-900 dark:text-white">Crear Nuevo Producto</h1>
        <p className="text-warm-500 dark:text-warm-400">Ingresa los detalles del nuevo producto para tu catálogo.</p>
      </div>

      <ProductForm categories={categories} />
    </div>
  );
}
