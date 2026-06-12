"use client";

import { useState, useTransition } from "react";
import { updateStoreSettings } from "@/app/actions/settings";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Save, Loader2, Image as ImageIcon } from "lucide-react";
import { useToast } from "@/components/ui/toast";

interface SettingsFormProps {
  initialData: any;
}

export function SettingsForm({ initialData }: SettingsFormProps) {
  const [isPending, startTransition] = useTransition();
  const { addToast } = useToast();
  const [formData, setFormData] = useState({
    heroTitle: initialData?.heroTitle || "",
    heroSubtitle: initialData?.heroSubtitle || "",
    heroImageUrl: initialData?.heroImageUrl || "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      const result = await updateStoreSettings(formData);
      if (result.success) {
        addToast({
          type: "success",
          title: "Configuración guardada",
          description: "Los cambios se han publicado en tu tienda.",
        });
      } else {
        addToast({
          type: "error",
          title: "Error al guardar",
          description: result.error || "Hubo un problema de conexión.",
        });
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-warm-900">Título Principal</label>
          <Input
            value={formData.heroTitle}
            onChange={(e) => setFormData({ ...formData, heroTitle: e.target.value })}
            placeholder="Ej: Bienestar en cada respiración"
            required
            className="max-w-xl"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-warm-900">Subtítulo</label>
          <textarea
            value={formData.heroSubtitle}
            onChange={(e) => setFormData({ ...formData, heroSubtitle: e.target.value })}
            placeholder="Breve descripción para tus clientes..."
            className="flex min-h-[80px] w-full max-w-xl rounded-md border border-warm-200 bg-transparent px-3 py-2 text-sm placeholder:text-warm-400 focus:outline-none focus:ring-2 focus:ring-sage-500 disabled:cursor-not-allowed disabled:opacity-50"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-warm-900">URL de la Imagen de Fondo</label>
          <div className="flex flex-col gap-3">
            <Input
              value={formData.heroImageUrl}
              onChange={(e) => setFormData({ ...formData, heroImageUrl: e.target.value })}
              placeholder="https://..."
              className="max-w-xl"
              required
            />
            <p className="text-xs text-warm-500">
              *En el futuro podrás arrastrar y soltar un archivo aquí (Integración con Supabase Storage). Por ahora, inserta una URL de imagen válida.
            </p>
          </div>
          
          {formData.heroImageUrl && (
            <div className="mt-4 border border-warm-200 rounded-xl overflow-hidden max-w-md aspect-video relative group">
              <img 
                src={formData.heroImageUrl} 
                alt="Hero Preview" 
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://via.placeholder.com/800x400?text=Imagen+Inv%C3%A1lida';
                }}
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                <ImageIcon className="text-white w-8 h-8" />
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="pt-4 flex justify-end">
        <Button 
          type="submit" 
          disabled={isPending}
          className="gap-2 cursor-pointer hover:scale-105 transition-all duration-300"
        >
          {isPending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          Guardar Cambios
        </Button>
      </div>
    </form>
  );
}
