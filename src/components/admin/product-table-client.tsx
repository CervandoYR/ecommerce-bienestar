"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2, Eye, PackageOpen, Loader2 } from "lucide-react";
import { deleteProduct } from "@/app/actions/products";
import { useToast } from "@/components/ui/toast";
import { Modal } from "@/components/ui/modal";
import Image from "next/image";

export function ProductTableClient({ initialProducts }: { initialProducts: any[] }) {
  const [products, setProducts] = useState(initialProducts);
  const [isPending, startTransition] = useTransition();
  const { addToast } = useToast();
  
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<any>(null);

  const handleDeleteConfirm = () => {
    if (!productToDelete) return;
    
    startTransition(async () => {
      const res = await deleteProduct(productToDelete.id);
      if (res?.error) {
        addToast({
          type: "error",
          title: "Error al eliminar",
          description: res.error,
        });
      } else {
        setProducts(prev => prev.filter(p => p.id !== productToDelete.id));
        addToast({
          type: "success",
          title: "Producto eliminado",
          description: "El producto ha sido eliminado correctamente.",
        });
      }
      setDeleteModalOpen(false);
      setProductToDelete(null);
    });
  };

  const openDeleteModal = (product: any) => {
    setProductToDelete(product);
    setDeleteModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-warm-900 dark:text-white">Productos</h1>
          <p className="text-warm-500 dark:text-warm-400">Gestiona el catálogo de tu tienda.</p>
        </div>
        <Link href="/admin/productos/nuevo">
          <Button className="bg-sage-600 hover:bg-sage-700 text-white" icon={<Plus className="w-5 h-5" />}>
            Nuevo Producto
          </Button>
        </Link>
      </div>

      <div className="bg-white dark:bg-warm-900 rounded-2xl border border-warm-200 dark:border-warm-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-warm-600 dark:text-warm-300">
            <thead className="bg-warm-50 dark:bg-warm-800/50 text-warm-900 dark:text-white font-semibold border-b border-warm-200 dark:border-warm-800">
              <tr>
                <th className="px-6 py-4">Producto</th>
                <th className="px-6 py-4">Categoría</th>
                <th className="px-6 py-4">Precio</th>
                <th className="px-6 py-4">Stock</th>
                <th className="px-6 py-4">Estado</th>
                <th className="px-6 py-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-warm-100 dark:divide-warm-800/50">
              {products.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-16">
                    <div className="flex flex-col items-center justify-center text-center">
                      <div className="w-24 h-24 bg-warm-100 dark:bg-warm-800 rounded-full flex items-center justify-center mb-4">
                        <PackageOpen className="w-12 h-12 text-warm-400 dark:text-warm-500" />
                      </div>
                      <h3 className="text-lg font-semibold text-warm-900 dark:text-white mb-1">Sin productos</h3>
                      <p className="text-warm-500 dark:text-warm-400 mb-6">Aún no tienes productos en tu catálogo.</p>
                      <Link href="/admin/productos/nuevo">
                        <Button className="bg-sage-600 hover:bg-sage-700 text-white">
                          ¡Crea el primero!
                        </Button>
                      </Link>
                    </div>
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product.id} className="hover:bg-warm-50/50 dark:hover:bg-warm-800/20 transition-colors">
                    <td className="px-6 py-4 font-medium text-warm-900 dark:text-white flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-warm-100 dark:bg-warm-800 overflow-hidden shrink-0 relative">
                        {product.images && product.images.length > 0 && (
                          <Image src={product.images[0]} alt={product.name} fill className="object-cover" />
                        )}
                      </div>
                      <span className="line-clamp-1">{product.name}</span>
                    </td>
                    <td className="px-6 py-4">{product.category?.name || "-"}</td>
                    <td className="px-6 py-4 font-medium">{formatPrice(Number(product.price))}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${
                        product.stock > 10 ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : 
                        product.stock > 0 ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" : 
                        "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                      }`}>
                        {product.stock}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {product.isActive ? (
                        <span className="text-sage-600 dark:text-sage-400 font-medium">Activo</span>
                      ) : (
                        <span className="text-warm-400 dark:text-warm-500">Inactivo</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* Preview */}
                        <div className="relative group">
                          <Link 
                            href={`/productos/${product.slug}`} 
                            target="_blank"
                            className="p-2 text-warm-400 hover:text-sage-600 transition-all duration-200 active:scale-95 cursor-pointer inline-flex"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                            Ver producto
                          </div>
                        </div>

                        {/* Edit */}
                        <div className="relative group">
                          <Link 
                            href={`/admin/productos/${product.id}`}
                            className="p-2 text-warm-400 hover:text-blue-600 transition-all duration-200 active:scale-95 cursor-pointer inline-flex"
                          >
                            <Edit className="w-4 h-4" />
                          </Link>
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                            Editar
                          </div>
                        </div>

                        {/* Delete */}
                        <div className="relative group">
                          <button 
                            onClick={() => openDeleteModal(product)}
                            className="p-2 text-warm-400 hover:text-red-600 transition-all duration-200 active:scale-95 cursor-pointer inline-flex"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                            Eliminar
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        open={deleteModalOpen}
        onClose={() => !isPending && setDeleteModalOpen(false)}
        title="Confirmar eliminación"
        footer={
          <>
            <Button
              variant="outline"
              onClick={() => setDeleteModalOpen(false)}
              disabled={isPending}
            >
              Cancelar
            </Button>
            <Button
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={handleDeleteConfirm}
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Eliminando...
                </>
              ) : (
                "Eliminar producto"
              )}
            </Button>
          </>
        }
      >
        <p className="text-warm-600 dark:text-warm-400">
          ¿Estás seguro que deseas eliminar el producto <strong className="text-warm-900 dark:text-white">{productToDelete?.name}</strong>?
          Esta acción no se puede deshacer.
        </p>
      </Modal>
    </div>
  );
}
