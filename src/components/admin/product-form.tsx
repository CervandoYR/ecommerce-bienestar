"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createProduct, updateProduct } from "@/app/actions/products";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CloudinaryUploader } from "@/components/ui/CloudinaryUploader";
import { useToast } from "@/components/ui/toast";
import { Loader2, X, Eye } from "lucide-react";
import { ProductCard } from "@/components/products/product-card";
import { Modal } from "@/components/ui/modal";
import { calculateBasePrice, calculateFinalPrice } from "@/lib/utils";

interface ProductFormProps {
  initialData?: any;
  categories: any[];
}

export function ProductForm({ initialData, categories }: ProductFormProps) {
  const router = useRouter();
  const { addToast } = useToast();
  const [isPending, startTransition] = useTransition();

  const initialFinalPrice = initialData?.price || "";
  const initialBasePrice = initialData?.price ? calculateBasePrice(initialData.price) : "";

  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    slug: initialData?.slug || "",
    description: initialData?.description || "",
    basePrice: initialBasePrice,
    finalPrice: initialFinalPrice,
    compareAtPrice: initialData?.compareAtPrice || "",
    stock: initialData?.stock || "",
    categoryId: initialData?.categoryId || "",
    images: initialData?.images || [],
    isActive: initialData?.isActive ?? true,
    isFeatured: initialData?.isFeatured ?? false,
  });

  const [showPreview, setShowPreview] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    let finalValue: any = value;
    
    if (type === "checkbox") {
      finalValue = (e.target as HTMLInputElement).checked;
    }

    setFormData((prev) => {
      const updated = { ...prev, [name]: finalValue };

      // Auto-generate slug
      if (name === "name" && !initialData) {
        updated.slug = value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      }

      // Two-way binding for prices
      if (name === "basePrice") {
        if (value === "") {
           updated.finalPrice = "";
        } else {
           updated.finalPrice = calculateFinalPrice(value).toString();
        }
      }
      
      if (name === "finalPrice") {
        if (value === "") {
           updated.basePrice = "";
        } else {
           updated.basePrice = calculateBasePrice(value).toString();
        }
      }

      return updated;
    });
  };

  const handleImageUpload = (url: string) => {
    setFormData((prev) => ({ ...prev, images: [...prev.images, url] }));
  };

  const handleRemoveImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      const finalPrice = parseFloat(formData.finalPrice as string) || 0;
      const dataToSubmit = {
        ...formData,
        price: finalPrice,
        compareAtPrice: formData.compareAtPrice ? parseFloat(formData.compareAtPrice as string) : null,
        stock: parseInt(formData.stock as string) || 0,
      };
      // Clean up custom properties
      delete (dataToSubmit as any).basePrice;
      delete (dataToSubmit as any).finalPrice;

      let res;
      if (initialData?.id) {
        res = await updateProduct(initialData.id, dataToSubmit);
      } else {
        res = await createProduct(dataToSubmit);
      }

      if (res.error) {
        addToast({ type: "error", title: "Error", description: res.error });
      } else {
        addToast({ type: "success", title: "Éxito", description: "Producto guardado correctamente." });
        router.push("/admin/productos");
      }
    });
  };

  // Create a mock product object for the preview card
  const previewProduct = {
    ...formData,
    id: "preview-id",
    price: parseFloat(formData.finalPrice as string) || 0,
    compareAtPrice: formData.compareAtPrice ? parseFloat(formData.compareAtPrice as string) : null,
    stock: parseInt(formData.stock as string) || 0,
    category: categories.find(c => c.id === formData.categoryId) || { name: "Sin Categoría" }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Form Container */}
      <div className="flex-1">
        <form onSubmit={handleSubmit} className="space-y-8 bg-white dark:bg-warm-900 p-6 sm:p-8 rounded-2xl border border-warm-200 dark:border-warm-800 shadow-sm">
          
          <div className="flex items-center justify-between border-b border-warm-200 dark:border-warm-800 pb-4">
            <h2 className="text-xl font-bold text-warm-900 dark:text-white">
              {initialData ? "Editar Producto" : "Nuevo Producto"}
            </h2>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setShowPreview(true)}
              className="lg:hidden"
            >
              <Eye className="w-4 h-4 mr-2" />
              Ver Previa
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Info Básica */}
            <div className="space-y-4 md:col-span-2">
              <h3 className="text-sm font-semibold text-warm-900 dark:text-white uppercase tracking-wider">Información Básica</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-warm-700 dark:text-warm-300">Nombre</label>
                  <Input name="name" value={formData.name} onChange={handleChange} required placeholder="Ej. Vela de Soja Lavanda" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-warm-700 dark:text-warm-300">Slug (URL)</label>
                  <Input name="slug" value={formData.slug} onChange={handleChange} required placeholder="vela-de-soja-lavanda" />
                  <p className="text-xs text-warm-500">Identificador único para la URL. Usa solo minúsculas y guiones.</p>
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-warm-700 dark:text-warm-300">Descripción Corta</label>
                <textarea 
                  name="description" 
                  value={formData.description} 
                  onChange={handleChange} 
                  required 
                  className="w-full flex min-h-[100px] rounded-xl border border-warm-200 bg-white px-3 py-2 text-sm placeholder:text-warm-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-500 disabled:cursor-not-allowed disabled:opacity-50 dark:border-warm-800 dark:bg-warm-900 dark:text-warm-100"
                  placeholder="Describe los beneficios y detalles clave del producto."
                />
              </div>
            </div>

            {/* Precio y Stock */}
            <div className="space-y-4 md:col-span-2 border-t border-warm-100 dark:border-warm-800 pt-6">
              <h3 className="text-sm font-semibold text-warm-900 dark:text-white uppercase tracking-wider">Inventario y Precio</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-warm-700 dark:text-warm-300">Ingreso Neto (Base) S/</label>
                  <Input name="basePrice" type="number" step="0.01" value={formData.basePrice} onChange={handleChange} required placeholder="0.00" />
                  <p className="text-xs text-warm-500">Lo que quieres recibir líquido.</p>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-warm-700 dark:text-warm-300">Precio Final al Público S/</label>
                  <Input 
                    name="finalPrice"
                    type="number"
                    step="0.01" 
                    value={formData.finalPrice} 
                    onChange={handleChange}
                    required
                    placeholder="0.00" 
                  />
                  <p className="text-xs text-warm-500">Incluye comisión Culqi e IGV. Puedes editar para redondear (Ej. .90).</p>
                </div>
                <div className="space-y-1.5 mt-2">
                  <label className="text-sm font-medium text-warm-700 dark:text-warm-300">Precio Comparación</label>
                  <Input name="compareAtPrice" type="number" step="0.01" value={formData.compareAtPrice} onChange={handleChange} placeholder="0.00" />
                  <p className="text-xs text-warm-500">Opcional. Para mostrar un precio tachado (descuento).</p>
                </div>
                <div className="space-y-1.5 mt-2">
                  <label className="text-sm font-medium text-warm-700 dark:text-warm-300">Stock Disponible</label>
                  <Input name="stock" type="number" value={formData.stock} onChange={handleChange} required placeholder="0" />
                </div>
              </div>
            </div>

            {/* Categoría e Imágenes */}
            <div className="space-y-4 md:col-span-2 border-t border-warm-100 dark:border-warm-800 pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-warm-900 dark:text-white uppercase tracking-wider">Organización</h3>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-warm-700 dark:text-warm-300">Categoría</label>
                    <select 
                      name="categoryId" 
                      value={formData.categoryId} 
                      onChange={handleChange} 
                      required
                      className="w-full flex h-11 items-center justify-between rounded-xl border border-warm-200 bg-white px-3 py-2 text-sm placeholder:text-warm-400 focus:outline-none focus:ring-2 focus:ring-sage-500 dark:border-warm-800 dark:bg-warm-900 dark:text-warm-100"
                    >
                      <option value="">Selecciona una categoría...</option>
                      {categories.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="flex flex-col gap-3 pt-4">
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleChange} className="w-5 h-5 rounded text-sage-600 focus:ring-sage-500 border-warm-300" />
                      <div>
                        <p className="text-sm font-medium text-warm-900 dark:text-white group-hover:text-sage-600 transition-colors">Producto Activo</p>
                        <p className="text-xs text-warm-500">Si está inactivo, no será visible en la tienda.</p>
                      </div>
                    </label>

                    <label className="flex items-center gap-3 cursor-pointer group">
                      <input type="checkbox" name="isFeatured" checked={formData.isFeatured} onChange={handleChange} className="w-5 h-5 rounded text-amber-500 focus:ring-amber-500 border-warm-300" />
                      <div>
                        <p className="text-sm font-medium text-warm-900 dark:text-white group-hover:text-amber-600 transition-colors">Destacar Producto</p>
                        <p className="text-xs text-warm-500">Aparecerá con un badge especial de "MÁS VENDIDO".</p>
                      </div>
                    </label>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-warm-900 dark:text-white uppercase tracking-wider">Imágenes</h3>
                  <CloudinaryUploader onUploadSuccess={handleImageUpload} multiple />
                  
                  {formData.images.length > 0 && (
                    <div className="grid grid-cols-3 gap-2 mt-4">
                      {formData.images.map((url, idx) => (
                        <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-warm-200 group">
                          <img src={url} alt="" className="w-full h-full object-cover" />
                          <button 
                            type="button"
                            onClick={() => handleRemoveImage(idx)}
                            className="absolute top-1 right-1 bg-black/50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500"
                          >
                            <X className="w-3 h-3" />
                          </button>
                          {idx === 0 && (
                            <span className="absolute bottom-0 left-0 right-0 bg-sage-600 text-white text-[10px] text-center py-0.5 font-medium">
                              Principal
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                  {formData.images.length === 0 && (
                    <p className="text-xs text-warm-500">Añade al menos una imagen. La primera será la portada.</p>
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
              {initialData ? "Guardar Cambios" : "Crear Producto"}
            </Button>
          </div>
        </form>
      </div>

      {/* Live Preview Sidebar (Desktop) */}
      <div className="hidden lg:block w-[350px] shrink-0">
        <div className="sticky top-24 space-y-4">
          <h3 className="text-sm font-semibold text-warm-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
            <Eye className="w-4 h-4" /> Live Preview
          </h3>
          <p className="text-xs text-warm-500 mb-4">Así es como verán tus clientes esta tarjeta en el catálogo.</p>
          <div className="pointer-events-none">
            <ProductCard product={previewProduct as any} />
          </div>
        </div>
      </div>

      {/* Live Preview Modal (Mobile) */}
      <Modal
        open={showPreview}
        onClose={() => setShowPreview(false)}
        title="Vista Previa del Producto"
      >
        <div className="max-w-[300px] mx-auto pointer-events-none py-4">
          <ProductCard product={previewProduct as any} />
        </div>
      </Modal>
    </div>
  );
}
