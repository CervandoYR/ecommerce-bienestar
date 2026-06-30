"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createSupplier, updateSupplier } from "@/app/actions/suppliers";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";
import { Loader2 } from "lucide-react";

interface SupplierFormProps {
  initialData?: any;
}

export function SupplierForm({ initialData }: SupplierFormProps) {
  const router = useRouter();
  const { addToast } = useToast();
  const [isPending, startTransition] = useTransition();

  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    contactName: initialData?.contactName || "",
    email: initialData?.email || "",
    phone: initialData?.phone || "",
    websiteUrl: initialData?.websiteUrl || "",
    isActive: initialData?.isActive ?? true,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    let finalValue: any = value;
    
    if (type === "checkbox") {
      finalValue = (e.target as HTMLInputElement).checked;
    }

    setFormData((prev) => ({ ...prev, [name]: finalValue }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      let res;
      if (initialData?.id) {
        res = await updateSupplier(initialData.id, formData);
      } else {
        res = await createSupplier(formData);
      }

      if (res.error) {
        addToast({ type: "error", title: "Error", description: res.error });
      } else {
        addToast({ type: "success", title: "Éxito", description: "Proveedor guardado correctamente." });
        router.push("/admin/proveedores");
      }
    });
  };

  return (
    <div className="max-w-3xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-8 bg-white dark:bg-warm-900 p-6 sm:p-8 rounded-2xl border border-warm-200 dark:border-warm-800 shadow-sm">
        
        <div className="flex items-center justify-between border-b border-warm-200 dark:border-warm-800 pb-4">
          <h2 className="text-xl font-bold text-warm-900 dark:text-white">
            {initialData ? "Editar Proveedor" : "Nuevo Proveedor"}
          </h2>
        </div>

        <div className="space-y-6">
          <h3 className="text-sm font-semibold text-warm-900 dark:text-white uppercase tracking-wider">Detalles de Empresa</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-sm font-medium text-warm-700 dark:text-warm-300">Razón Social / Nombre de la Empresa</label>
              <Input name="name" value={formData.name} onChange={handleChange} required placeholder="Ej. Aromas del Mundo S.A." />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-warm-700 dark:text-warm-300">Enlace de Catálogo (Website)</label>
              <Input name="websiteUrl" value={formData.websiteUrl} onChange={handleChange} placeholder="https://..." type="url" />
            </div>
            <div className="space-y-1.5 pt-7">
              <label className="flex items-center gap-3 cursor-pointer group">
                <input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleChange} className="w-5 h-5 rounded text-sage-600 focus:ring-sage-500 border-warm-300" />
                <div>
                  <p className="text-sm font-medium text-warm-900 dark:text-white group-hover:text-sage-600 transition-colors">Proveedor Activo</p>
                </div>
              </label>
            </div>
          </div>
        </div>

        <div className="space-y-6 border-t border-warm-100 dark:border-warm-800 pt-6">
          <h3 className="text-sm font-semibold text-warm-900 dark:text-white uppercase tracking-wider">Datos de Contacto</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-sm font-medium text-warm-700 dark:text-warm-300">Nombre del Contacto</label>
              <Input name="contactName" value={formData.contactName} onChange={handleChange} placeholder="Ej. Roberto Gómez" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-warm-700 dark:text-warm-300">Correo Electrónico</label>
              <Input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="ventas@aromas.com" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-warm-700 dark:text-warm-300">Teléfono / WhatsApp</label>
              <Input name="phone" value={formData.phone} onChange={handleChange} placeholder="+51 987 654 321" />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-6 border-t border-warm-200 dark:border-warm-800">
          <Button type="button" variant="outline" onClick={() => router.back()} disabled={isPending}>
            Cancelar
          </Button>
          <Button type="submit" className="bg-sage-600 hover:bg-sage-700 text-white" disabled={isPending}>
            {isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {initialData ? "Guardar Cambios" : "Crear Proveedor"}
          </Button>
        </div>
      </form>
    </div>
  );
}
