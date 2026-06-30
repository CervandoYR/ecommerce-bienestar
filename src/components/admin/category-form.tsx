"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createCategory, updateCategory } from "@/app/actions/categories";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CloudinaryUploader } from "@/components/ui/CloudinaryUploader";
import { useToast } from "@/components/ui/toast";
import { Loader2, X } from "lucide-react";

interface CategoryFormProps {
  initialData?: any;
}

export function CategoryForm({ initialData }: CategoryFormProps) {
  const router = useRouter();
  const { addToast } = useToast();
  const [isPending, startTransition] = useTransition();

  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    slug: initialData?.slug || "",
    description: initialData?.description || "",
    imageUrl: initialData?.imageUrl || "",
    isActive: initialData?.isActive ?? true,
    sortOrder: initialData?.sortOrder || 0,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    let finalValue: any = value;
    
    if (type === "checkbox") {
      finalValue = (e.target as HTMLInputElement).checked;
    }
    
    if (name === "sortOrder") {
      finalValue = parseInt(value) || 0;
    }

    setFormData((prev) => {
      const updated = { ...prev, [name]: finalValue };

      // Auto-generate slug
      if (name === "name" && !initialData) {
        updated.slug = value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      }

      return updated;
    });
  };

  const handleImageUpload = (url: string) => {
    setFormData((prev) => ({ ...prev, imageUrl: url }));
  };

  const handleRemoveImage = () => {
    setFormData((prev) => ({ ...prev, imageUrl: "" }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      let res;
      if (initialData?.id) {
        res = await updateCategory(initialData.id, formData);
      } else {
        res = await createCategory(formData);
      }

      if (res.error) {
        addToast({ type: "error", title: "Error", description: res.error });
      } else {
        addToast({ type: "success", title: "Éxito", description: "Categoría guardada correctamente." });
        router.push("/admin/categorias");
      }
    });
  };

  return (
    <div className="max-w-3xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-8 bg-white dark:bg-warm-900 p-6 sm:p-8 rounded-2xl border border-warm-200 dark:border-warm-800 shadow-sm">
        
        <div className="flex items-center justify-between border-b border-warm-200 dark:border-warm-800 pb-4">
          <h2 className="text-xl font-bold text-warm-900 dark:text-white">
            {initialData ? "Editar Categoría" : "Nueva Categoría"}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4 md:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-warm-700 dark:text-warm-300">Nombre</label>
                <Input name="name" value={formData.name} onChange={handleChange} required placeholder="Ej. Relajación Profunda" />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-warm-700 dark:text-warm-300">Slug (URL)</label>
                <Input name="slug" value={formData.slug} onChange={handleChange} required placeholder="relajacion-profunda" />
                <p className="text-xs text-warm-500">Identificador único para la URL.</p>
              </div>
            </div>
            
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-warm-700 dark:text-warm-300">Descripción</label>
              <textarea 
                name="description" 
                value={formData.description} 
                onChange={handleChange} 
                className="w-full flex min-h-[100px] rounded-xl border border-warm-200 bg-white px-3 py-2 text-sm placeholder:text-warm-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-500 dark:border-warm-800 dark:bg-warm-900 dark:text-warm-100"
                placeholder="Descripción para SEO y vista en tienda..."
              />
            </div>
          </div>

          <div className="space-y-4 md:col-span-2 border-t border-warm-100 dark:border-warm-800 pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-warm-900 dark:text-white uppercase tracking-wider">Ajustes Adicionales</h3>
                
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-warm-700 dark:text-warm-300">Orden de Visualización</label>
                  <Input name="sortOrder" type="number" value={formData.sortOrder} onChange={handleChange} required />
                  <p className="text-xs text-warm-500">Menor número = Más arriba.</p>
                </div>

                <div className="flex flex-col gap-3 pt-2">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleChange} className="w-5 h-5 rounded text-sage-600 focus:ring-sage-500 border-warm-300" />
                    <div>
                      <p className="text-sm font-medium text-warm-900 dark:text-white group-hover:text-sage-600 transition-colors">Categoría Activa</p>
                    </div>
                  </label>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-warm-900 dark:text-white uppercase tracking-wider">Imagen Destacada</h3>
                {!formData.imageUrl ? (
                  <CloudinaryUploader onUploadSuccess={handleImageUpload} />
                ) : (
                  <div className="relative aspect-video rounded-lg overflow-hidden border border-warm-200 group">
                    <img src={formData.imageUrl} alt="Categoría" className="w-full h-full object-cover" />
                    <button 
                      type="button"
                      onClick={handleRemoveImage}
                      className="absolute top-2 right-2 bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-6 border-t border-warm-200 dark:border-warm-800">
          <Button type="button" variant="outline" onClick={() => router.back()} disabled={isPending}>
            Cancelar
          </Button>
          <Button type="submit" className="bg-sage-600 hover:bg-sage-700 text-white" disabled={isPending}>
            {isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {initialData ? "Guardar Cambios" : "Crear Categoría"}
          </Button>
        </div>
      </form>
    </div>
  );
}
