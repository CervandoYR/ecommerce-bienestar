"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus, Edit2, Trash2, Users, Loader2, Mail, Phone, ExternalLink } from "lucide-react";
import { deleteSupplier } from "@/app/actions/suppliers";
import { useToast } from "@/components/ui/toast";
import { Modal } from "@/components/ui/modal";

export function SupplierTableClient({ initialSuppliers }: { initialSuppliers: any[] }) {
  const [suppliers, setSuppliers] = useState(initialSuppliers);
  const [isPending, startTransition] = useTransition();
  const { addToast } = useToast();
  
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [supplierToDelete, setSupplierToDelete] = useState<any>(null);

  const handleDeleteConfirm = () => {
    if (!supplierToDelete) return;
    
    startTransition(async () => {
      const res = await deleteSupplier(supplierToDelete.id);
      if (res?.error) {
        addToast({
          type: "error",
          title: "Error al eliminar",
          description: res.error,
        });
      } else {
        setSuppliers(prev => prev.filter(s => s.id !== supplierToDelete.id));
        addToast({
          type: "success",
          title: "Proveedor eliminado",
          description: "El proveedor ha sido eliminado correctamente.",
        });
      }
      setDeleteModalOpen(false);
      setSupplierToDelete(null);
    });
  };

  const openDeleteModal = (supplier: any) => {
    setSupplierToDelete(supplier);
    setDeleteModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-warm-900 dark:text-white tracking-tight">Proveedores</h1>
          <p className="text-warm-500 dark:text-warm-400 mt-1">Directorio de distribuidores y artesanos asociados.</p>
        </div>
        <Link href="/admin/proveedores/nuevo">
          <Button className="bg-sage-600 hover:bg-sage-700 text-white" icon={<Plus className="w-5 h-5" />}>
            Nuevo Proveedor
          </Button>
        </Link>
      </div>

      <div className="bg-white dark:bg-warm-900/30 backdrop-blur-md border border-warm-200 dark:border-warm-800/50 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-warm-50/50 dark:bg-warm-800/20 border-b border-warm-200 dark:border-warm-800/50 text-xs uppercase tracking-wider font-semibold text-warm-500 dark:text-warm-400">
                <th className="px-6 py-4">Empresa</th>
                <th className="px-6 py-4">Contacto</th>
                <th className="px-6 py-4">Productos</th>
                <th className="px-6 py-4">Estado</th>
                <th className="px-6 py-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-warm-200 dark:divide-warm-800/50">
              {suppliers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-16">
                    <div className="flex flex-col items-center justify-center text-center">
                      <div className="w-24 h-24 bg-warm-100 dark:bg-warm-800 rounded-full flex items-center justify-center mb-4">
                        <Users className="w-12 h-12 text-warm-400 dark:text-warm-500" />
                      </div>
                      <h3 className="text-lg font-semibold text-warm-900 dark:text-white mb-1">Sin proveedores</h3>
                      <p className="text-warm-500 dark:text-warm-400 mb-6">Aún no has registrado a ningún distribuidor.</p>
                      <Link href="/admin/proveedores/nuevo">
                        <Button className="bg-sage-600 hover:bg-sage-700 text-white">
                          Crear el primero
                        </Button>
                      </Link>
                    </div>
                  </td>
                </tr>
              ) : (
                suppliers.map((prov) => (
                  <tr key={prov.id} className="hover:bg-warm-50/50 dark:hover:bg-warm-800/10 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-sage-100 dark:bg-sage-500/10 flex items-center justify-center shrink-0">
                          <Users className="w-5 h-5 text-sage-600 dark:text-sage-400" />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-medium text-warm-900 dark:text-white">{prov.name}</span>
                          {prov.websiteUrl && (
                            <a href={prov.websiteUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-500 hover:underline flex items-center gap-1 mt-0.5">
                              Catálogo <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col space-y-1">
                        <span className="text-sm font-medium text-warm-900 dark:text-white">{prov.contactName || "-"}</span>
                        {(prov.email || prov.phone) && (
                          <div className="flex flex-col gap-1 mt-1">
                            {prov.email && (
                              <div className="flex items-center gap-1.5 text-xs text-warm-500 dark:text-warm-400">
                                <Mail className="w-3 h-3 shrink-0" />
                                {prov.email}
                              </div>
                            )}
                            {prov.phone && (
                              <div className="flex items-center gap-1.5 text-xs text-warm-500 dark:text-warm-400">
                                <Phone className="w-3 h-3 shrink-0" />
                                {prov.phone}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-warm-600 dark:text-warm-400 text-sm font-medium">
                      {prov._count?.products || 0} items
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        prov.isActive 
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-400' 
                          : 'bg-warm-100 text-warm-800 dark:bg-warm-500/10 dark:text-warm-400'
                      }`}>
                        {prov.isActive ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* Edit */}
                        <div className="relative group/btn">
                          <Link 
                            href={`/admin/proveedores/${prov.id}`}
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
                            onClick={() => openDeleteModal(prov)}
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
                "Eliminar proveedor"
              )}
            </Button>
          </>
        }
      >
        <p className="text-warm-600 dark:text-warm-400">
          ¿Estás seguro que deseas eliminar el proveedor <strong className="text-warm-900 dark:text-white">{supplierToDelete?.name}</strong>?
          Esta acción no se puede deshacer.
        </p>
      </Modal>
    </div>
  );
}
