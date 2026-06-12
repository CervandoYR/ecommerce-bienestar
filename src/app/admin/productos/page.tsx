import prisma from "@/lib/prisma";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2 } from "lucide-react";

export default async function AdminProductsPage() {
  let products: any[] = [];
  try {
    products = await prisma.product.findMany({
      include: {
        category: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  } catch (error) {
    console.warn("Could not fetch products for admin:", error);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-warm-900">Productos</h1>
          <p className="text-warm-500">Gestiona el catálogo de tu tienda.</p>
        </div>
        <Button className="bg-sage-600 hover:bg-sage-700" icon={<Plus className="w-5 h-5" />}>
          Nuevo Producto
        </Button>
      </div>

      <div className="bg-white rounded-2xl border border-warm-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-warm-600">
            <thead className="bg-warm-50 text-warm-900 font-semibold border-b border-warm-200">
              <tr>
                <th className="px-6 py-4">Producto</th>
                <th className="px-6 py-4">Categoría</th>
                <th className="px-6 py-4">Precio</th>
                <th className="px-6 py-4">Stock</th>
                <th className="px-6 py-4">Estado</th>
                <th className="px-6 py-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-warm-100">
              {products.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-warm-500">
                    No hay productos registrados.
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product.id} className="hover:bg-warm-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-warm-900 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-warm-100 overflow-hidden shrink-0">
                        {product.images && product.images.length > 0 && (
                          <img src={product.images[0]} alt="" className="w-full h-full object-cover" />
                        )}
                      </div>
                      {product.name}
                    </td>
                    <td className="px-6 py-4">{product.category?.name}</td>
                    <td className="px-6 py-4 font-medium">{formatPrice(Number(product.price))}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${
                        product.stock > 10 ? "bg-green-100 text-green-700" : product.stock > 0 ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700"
                      }`}>
                        {product.stock}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {product.isActive ? (
                        <span className="text-sage-600 font-medium">Activo</span>
                      ) : (
                        <span className="text-warm-400">Inactivo</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-2 text-warm-400 hover:text-sage-600 transition-colors">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-warm-400 hover:text-red-600 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
