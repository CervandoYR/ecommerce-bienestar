"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus, Edit2, Trash2, Tags, Loader2, PackageOpen } from "lucide-react";
import { deleteCategory } from "@/app/actions/categories";
import { useToast } from "@/components/ui/toast";
import { Modal } from "@/components/ui/modal";
import Image from "next/image";

export function CategoryTableClient({ initialCategories }: { initialCategories: any[] }) {
  const [categories, setCategories] = useState(initialCategories);
  const [isPending, startTransition] = useTransition();
  const { addToast } = useToast();
  
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<any>(null);

  const handleDeleteConfirm = () => {
    if (!categoryToDelete) return;
    
    startTransition(async () => {
      const res = await deleteCategory(categoryToDelete.id);
      if (res?.error) {
        addToast({
          type: "error",
          title: "Error al eliminar",
          description: res.error,
        });
      } else {
        setCategories(prev => prev.filter(c => c.id !== categoryToDelete.id));
        addToast({
          type: "success",
          title: "Categoría eliminada",
          description: "La categoría ha sido eliminada correctamente.",
        });
      }
      setDeleteModalOpen(false);
      setCategoryToDelete(null);
    });
  };

  const openDeleteModal = (category: any) => {
    setCategoryToDelete(category);
    setDeleteModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-warm-900 dark:text-white tracking-tight">Categorías</h1>
          <p className="text-warm-500 dark:text-warm-400 mt-1">Organiza tus productos en colecciones temáticas.</p>
        </div>
        <Link href="/admin/categorias/nuevo">
          <Button className="bg-sage-600 hover:bg-sage-700 text-white" icon={<Plus className="w-5 h-5" />}>
            Nueva Categoría
          </Button>
        </Link>
      </div>

      <div className="bg-white dark:bg-warm-900/30 backdrop-blur-md border border-warm-200 dark:border-warm-800/50 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-warm-50/50 dark:bg-warm-800/20 border-b border-warm-200 dark:border-warm-800/50 text-xs uppercase tracking-wider font-semibold text-warm-500 dark:text-warm-400">
                <th className="px-6 py-4">Categoría</th>
                <th className="px-6 py-4">Slug</th>
                <th className="px-6 py-4">Orden</th>
                <th className="px-6 py-4">Productos</th>
                <th className="px-6 py-4">Estado</th>
                <th className="px-6 py-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-warm-200 dark:divide-warm-800/50">
              {categories.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-16">
                    <div className="flex flex-col items-center justify-center text-center">
                      <div className="w-24 h-24 bg-warm-100 dark:bg-warm-800 rounded-full flex items-center justify-center mb-4">
                        <PackageOpen className="w-12 h-12 text-warm-400 dark:text-warm-500" />
                      </div>
                      <h3 className="text-lg font-semibold text-warm-900 dark:text-white mb-1">Sin categorías</h3>
                      <p className="text-warm-500 dark:text-warm-400 mb-6">Aún no has creado ninguna categoría.</p>
                      <Link href="/admin/categorias/nuevo">
                        <Button className="bg-sage-600 hover:bg-sage-700 text-white">
                          Crear la primera
                        </Button>
                      </Link>
                    </div>
                  </td>
                </tr>
              ) : (
                categories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-warm-50/50 dark:hover:bg-warm-800/10 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-sage-100 dark:bg-sage-500/10 flex items-center justify-center shrink-0 overflow-hidden relative border border-warm-200 dark:border-warm-800">
                          {cat.imageUrl ? (
                            <Image src={cat.imageUrl} alt={cat.name} fill className="object-cover" />
                          ) : (
                            <Tags className="w-5 h-5 text-sage-600 dark:text-sage-400" />
                          )}
                        </div>
                        <span className="font-medium text-warm-900 dark:text-white">{cat.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 rounded-md bg-warm-100 dark:bg-warm-800 text-xs text-warm-600 dark:text-warm-400 font-mono">
                        /{cat.slug}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-warm-600 dark:text-warm-400 text-sm">
                      {cat.sortOrder}
                    </td>
                    <td className="px-6 py-4 text-warm-600 dark:text-warm-400 text-sm">
                      {cat._count?.products || 0}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        cat.isActive 
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-400' 
                          : 'bg-warm-100 text-warm-800 dark:bg-warm-500/10 dark:text-warm-400'
                      }`}>
                        {cat.isActive ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* Edit */}
                        <div className="relative group/btn">
                          <Link 
                            href={`/admin/categorias/${cat.id}`}
                            className="p-2 text-warm-400 hover:text-sage-600 dark:hover:text-sage-400 transition-all duration-200 active:scale-95 cursor-pointer rounded-lg hover:bg-warm-100 dark:hover:bg-warm-800 inline-flex"
                          >
                            <Edit2 className="w-4 h-4" />
                          </Link>
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover/btn:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                            Editar
                          </div>
                        </div>

                        {/* Delete */}
                        <div className="relative group/btn">
                          <button 
                            onClick={() => openDeleteModal(cat)}
                            className="p-2 text-warm-400 hover:text-red-600 dark:hover:text-red-400 transition-all duration-200 active:scale-95 cursor-pointer rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 inline-flex"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover/btn:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
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
                "Eliminar categoría"
              )}
            </Button>
          </>
        }
      >
        <p className="text-warm-600 dark:text-warm-400">
          ¿Estás seguro que deseas eliminar la categoría <strong className="text-warm-900 dark:text-white">{categoryToDelete?.name}</strong>?
          Esta acción no se puede deshacer.
        </p>
      </Modal>
    </div>
  );
}
