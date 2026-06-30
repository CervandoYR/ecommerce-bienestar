import prisma from "@/lib/prisma";
import { ProductForm } from "@/components/admin/product-form";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function EditarProductoPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  
  const [product, categories] = await Promise.all([
    prisma.product.findUnique({
      where: { id: resolvedParams.id }
    }),
    prisma.category.findMany({
      orderBy: { name: "asc" }
    })
  ]);

  if (!product) {
    notFound();
  }

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-warm-900 dark:text-white">Editar Producto</h1>
        <p className="text-warm-500 dark:text-warm-400">Actualiza los detalles del producto en el catálogo.</p>
      </div>

      <ProductForm initialData={JSON.parse(JSON.stringify(product))} categories={categories} />
    </div>
  );
}
