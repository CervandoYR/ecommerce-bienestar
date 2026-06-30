"use client";

import { useState, useTransition } from "react";
import { Store, Save, Loader2, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { CloudinaryUploader } from "@/components/ui/CloudinaryUploader";
import { updateStoreSettings } from "@/app/actions/settings";

export function SettingsForm({ initialData }: { initialData: any }) {
  const [isPending, startTransition] = useTransition();
  const { addToast } = useToast();
  const [formData, setFormData] = useState({
    heroTitle: initialData?.heroTitle || "",
    heroSubtitle: initialData?.heroSubtitle || "",
    heroImageUrl: initialData?.heroImageUrl || "",
    promoModalActive: initialData?.promoModalActive || false,
    promoModalImage: initialData?.promoModalImage || "",
    promoModalTitle: initialData?.promoModalTitle || "",
    promoModalText: initialData?.promoModalText || "",
    promoModalLink: initialData?.promoModalLink || "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      const res = await updateStoreSettings(formData);
      if (res.success) {
        addToast({
          type: "success",
          title: "Ajustes Guardados",
          description: "La configuración de la tienda ha sido actualizada.",
        });
      } else {
        addToast({
          type: "error",
          title: "Error al guardar",
          description: res.error || "Ocurrió un problema.",
        });
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-warm-900 dark:text-white tracking-tight">Ajustes de la Tienda</h1>
          <p className="text-warm-500 dark:text-warm-400 mt-1">Configura el banner principal (Hero) de la tienda.</p>
        </div>
        <Button 
          type="submit" 
          disabled={isPending}
          className="bg-sage-600 hover:bg-sage-700 text-white shadow-sm"
          icon={isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
        >
          {isPending ? "Guardando..." : "Guardar Cambios"}
        </Button>
      </div>

      <div className="grid gap-6">
        <section className="bg-white dark:bg-warm-900/30 backdrop-blur-md p-6 rounded-2xl border border-warm-200 dark:border-warm-800/50 shadow-sm">
          <div className="flex items-center gap-2 mb-6 border-b border-warm-100 dark:border-warm-800/50 pb-4">
            <Store className="w-5 h-5 text-sage-600 dark:text-sage-400" />
            <h2 className="text-lg font-semibold text-warm-900 dark:text-white">Página Principal (Hero Banner)</h2>
          </div>
          
          <div className="grid sm:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-warm-700 dark:text-warm-300">Título Principal (Hero Title)</label>
                <input 
                  type="text" 
                  required
                  value={formData.heroTitle}
                  onChange={(e) => setFormData({ ...formData, heroTitle: e.target.value })}
                  placeholder="Ej: Bienestar en cada respiración"
                  className="w-full px-4 py-2.5 bg-warm-50 dark:bg-warm-900/50 border border-warm-200 dark:border-warm-800 rounded-lg text-sm text-warm-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sage-500/50 transition-shadow"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-warm-700 dark:text-warm-300">Subtítulo (Hero Subtitle)</label>
                <textarea 
                  rows={4}
                  required
                  value={formData.heroSubtitle}
                  onChange={(e) => setFormData({ ...formData, heroSubtitle: e.target.value })}
                  placeholder="Ej: Descubre nuestra colección premium..."
                  className="w-full px-4 py-2.5 bg-warm-50 dark:bg-warm-900/50 border border-warm-200 dark:border-warm-800 rounded-lg text-sm text-warm-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sage-500/50 resize-none transition-shadow"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-warm-700 dark:text-warm-300 flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-warm-400" />
                Imagen de Fondo
              </label>
              <div className="pt-2">
                <CloudinaryUploader
                  folder="ecommerce-bienestar/settings"
                  onUploadSuccess={(url) => setFormData({ ...formData, heroImageUrl: url })}
                  defaultImage={formData.heroImageUrl}
                />
                <p className="text-xs text-warm-500 mt-3 flex items-center justify-between">
                  <span>Recomendado: 1920x1080px (Horizontal).</span>
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Promo Modal Section */}
        <section className="bg-white dark:bg-warm-900/30 backdrop-blur-md p-6 rounded-2xl border border-warm-200 dark:border-warm-800/50 shadow-sm">
          <div className="flex items-center justify-between mb-6 border-b border-warm-100 dark:border-warm-800/50 pb-4">
            <div className="flex items-center gap-2">
              <Store className="w-5 h-5 text-sage-600 dark:text-sage-400" />
              <h2 className="text-lg font-semibold text-warm-900 dark:text-white">Modal Promocional</h2>
            </div>
            
            {/* Toggle Switch */}
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer"
                checked={formData.promoModalActive}
                onChange={(e) => setFormData({ ...formData, promoModalActive: e.target.checked })}
              />
              <div className="w-11 h-6 bg-warm-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-sage-300 dark:peer-focus:ring-sage-800 rounded-full peer dark:bg-warm-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-warm-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-warm-600 peer-checked:bg-sage-600"></div>
              <span className="ml-3 text-sm font-medium text-warm-900 dark:text-warm-300">
                {formData.promoModalActive ? "Activado" : "Desactivado"}
              </span>
            </label>
          </div>
          
          <div className={`grid sm:grid-cols-2 gap-8 transition-opacity duration-300 ${!formData.promoModalActive ? 'opacity-50 pointer-events-none' : ''}`}>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-warm-700 dark:text-warm-300">Título del Modal</label>
                <input 
                  type="text" 
                  value={formData.promoModalTitle}
                  onChange={(e) => setFormData({ ...formData, promoModalTitle: e.target.value })}
                  placeholder="Ej: ¡15% de Descuento en tu primera compra!"
                  className="w-full px-4 py-2.5 bg-warm-50 dark:bg-warm-900/50 border border-warm-200 dark:border-warm-800 rounded-lg text-sm text-warm-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sage-500/50 transition-shadow"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-warm-700 dark:text-warm-300">Texto / Descripción</label>
                <textarea 
                  rows={3}
                  value={formData.promoModalText}
                  onChange={(e) => setFormData({ ...formData, promoModalText: e.target.value })}
                  placeholder="Ej: Suscríbete y recibe el cupón exclusivo..."
                  className="w-full px-4 py-2.5 bg-warm-50 dark:bg-warm-900/50 border border-warm-200 dark:border-warm-800 rounded-lg text-sm text-warm-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sage-500/50 resize-none transition-shadow"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-warm-700 dark:text-warm-300">URL del Botón (CTA)</label>
                <input 
                  type="text" 
                  value={formData.promoModalLink}
                  onChange={(e) => setFormData({ ...formData, promoModalLink: e.target.value })}
                  placeholder="Ej: /productos o link de WhatsApp"
                  className="w-full px-4 py-2.5 bg-warm-50 dark:bg-warm-900/50 border border-warm-200 dark:border-warm-800 rounded-lg text-sm text-warm-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sage-500/50 transition-shadow"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-warm-700 dark:text-warm-300 flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-warm-400" />
                Imagen Promocional
              </label>
              <div className="pt-2">
                <CloudinaryUploader
                  folder="ecommerce-bienestar/promos"
                  onUploadSuccess={(url) => setFormData({ ...formData, promoModalImage: url })}
                  defaultImage={formData.promoModalImage}
                />
                <p className="text-xs text-warm-500 mt-3 flex items-center justify-between">
                  <span>Recomendado: 800x800px (Cuadrada).</span>
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </form>
  );
}
