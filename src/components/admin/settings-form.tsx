"use client";

import { useState, useTransition } from "react";
import { Store, Save, Loader2, Image as ImageIcon, Sparkles, Heart, Shield, Layout, Layers, Eye, Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { CloudinaryUploader } from "@/components/ui/CloudinaryUploader";
import { updateStoreSettings } from "@/app/actions/settings";

// Public Preview Components
import { HeroSection } from "@/components/home/hero-section";
import { TransformationBento } from "@/components/home/transformation-bento";
import { CuratedSelection } from "@/components/home/curated-selection";
import { PurposeSection } from "@/components/home/purpose-section";
import { TrustBadges } from "@/components/home/trust-badges";

export function SettingsForm({ initialData }: { initialData: any }) {
  const [isPending, startTransition] = useTransition();
  const { addToast } = useToast();
  const [previewSection, setPreviewSection] = useState<"all" | "hero" | "bento" | "curated" | "purpose" | "promise">("all");
  
  const [formData, setFormData] = useState({
    // Hero
    heroTitle: initialData?.heroTitle || "",
    heroSubtitle: initialData?.heroSubtitle || "",
    heroImageUrl: initialData?.heroImageUrl || "",
    heroButtonText: initialData?.heroButtonText || "Comprar Ahora",
    heroButtonLink: initialData?.heroButtonLink || "/productos",
    heroBadgeText: initialData?.heroBadgeText || "EXCELENCIA EN BIENESTAR",
    
    // Promo Modal
    promoModalActive: initialData?.promoModalActive || false,
    promoModalImage: initialData?.promoModalImage || "",
    promoModalTitle: initialData?.promoModalTitle || "",
    promoModalText: initialData?.promoModalText || "",
    promoModalLink: initialData?.promoModalLink || "",

    // Bento Grid
    bentoTitle: initialData?.bentoTitle || "",
    bentoSubtitle: initialData?.bentoSubtitle || "",
    bentoImage: initialData?.bentoImage || "",
    bentoCard1Title: initialData?.bentoCard1Title || "",
    bentoCard1Desc: initialData?.bentoCard1Desc || "",
    bentoCard1Image: initialData?.bentoCard1Image || "",
    bentoCard2Title: initialData?.bentoCard2Title || "",
    bentoCard2Desc: initialData?.bentoCard2Desc || "",
    bentoCard2Image: initialData?.bentoCard2Image || "",
    bentoCard3Title: initialData?.bentoCard3Title || "",
    bentoCard3Desc: initialData?.bentoCard3Desc || "",
    bentoCard3Image: initialData?.bentoCard3Image || "",

    // Curated Selection
    curatedTitle: initialData?.curatedTitle || "",
    curatedSubtitle: initialData?.curatedSubtitle || "",
    curated1Title: initialData?.curated1Title || "",
    curated1Desc: initialData?.curated1Desc || "",
    curated1Image: initialData?.curated1Image || "",
    curated2Title: initialData?.curated2Title || "",
    curated2Desc: initialData?.curated2Desc || "",
    curated2Image: initialData?.curated2Image || "",
    curated3Title: initialData?.curated3Title || "",
    curated3Desc: initialData?.curated3Desc || "",
    curated3Image: initialData?.curated3Image || "",

    // Purpose Split Layout / El Arte de Reconectar
    purposeTitle: initialData?.purposeTitle || "",
    purposeSubtitle: initialData?.purposeSubtitle || "",
    purposeDesc: initialData?.purposeDesc || "",
    purposeImage: initialData?.purposeImage || "",
    splitKicker: initialData?.splitKicker || initialData?.purposeSubtitle || "CURADURÍA EXPERTA",
    splitTitle: initialData?.splitTitle || initialData?.purposeTitle || "El arte de apagar el ruido y reconectar contigo.",
    splitDescription: initialData?.splitDescription || initialData?.purposeDesc || "Vivimos a un ritmo que agota. Por eso, buscamos y seleccionamos meticulosamente las mejores herramientas para tu descanso: desde el calor profundo de nuestras compresas térmicas, hasta brumas y aceites botánicos de alta pureza.",
    splitFooterLeft: initialData?.splitFooterLeft || "CALOR TERAPÉUTICO",
    splitFooterRight: initialData?.splitFooterRight || "AROMATERAPIA PURA",
    splitImageUrl: initialData?.splitImageUrl || initialData?.purposeImage || "https://images.unsplash.com/photo-1608528577891-eb055944f2e7?q=80&w=1000&auto=format&fit=crop",
    splitButtonText: initialData?.splitButtonText || "Explorar colección",
    splitButtonLink: initialData?.splitButtonLink || "/productos",

    // Promises
    promise1Title: initialData?.promise1Title || "",
    promise1Desc: initialData?.promise1Desc || "",
    promise2Title: initialData?.promise2Title || "",
    promise2Desc: initialData?.promise2Desc || "",
    promise3Title: initialData?.promise3Title || "",
    promise3Desc: initialData?.promise3Desc || "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      const res = await updateStoreSettings(formData);
      if (res.success) {
        addToast({
          type: "success",
          title: "Ajustes Guardados",
          description: "La configuración y textos de la tienda han sido actualizados en tiempo real.",
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
    <form onSubmit={handleSubmit} className="space-y-8 pb-16">
      {/* Header Sticky */}
      <div className="sticky top-4 z-40 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white/95 dark:bg-warm-900/95 backdrop-blur-md p-5 rounded-2xl border border-warm-200 dark:border-warm-800 shadow-lg">
        <div>
          <div className="flex items-center gap-2">
            <Monitor className="w-6 h-6 text-[#C5A059]" />
            <h1 className="text-2xl font-bold text-warm-900 dark:text-white tracking-tight font-serif">CMS Headless & Live Preview</h1>
          </div>
          <p className="text-xs text-warm-500 dark:text-warm-400 mt-1">
            Edita textos, sube imágenes en la izquierda y mira los cambios reaccionar en tiempo real en la pantalla dividida a la derecha.
          </p>
        </div>
        <Button 
          type="submit" 
          disabled={isPending}
          className="bg-[#2C402E] hover:bg-[#C5A059] text-[#FAF8F5] shadow-md font-bold px-8 py-3 rounded-full transition-all w-full sm:w-auto"
          icon={isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
        >
          {isPending ? "Guardando en DB..." : "Guardar y Publicar"}
        </Button>
      </div>

      {/* Split-Screen Layout (Left: Form Inputs, Right: Live Reactive Preview) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Form Inputs (7 cols on desktop) */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* 1. HERO BANNER */}
          <section className="bg-white dark:bg-warm-900/40 backdrop-blur-md p-6 sm:p-8 rounded-3xl border border-warm-200 dark:border-warm-800/60 shadow-sm space-y-6" onClick={() => setPreviewSection("hero")}>
            <div className="flex items-center justify-between border-b border-warm-100 dark:border-warm-800/50 pb-4">
              <div className="flex items-center gap-2.5">
                <Store className="w-5 h-5 text-[#C5A059]" />
                <h2 className="text-lg font-bold text-warm-900 dark:text-white font-serif">1. Hero Section (Banner Principal)</h2>
              </div>
              <span className="text-[11px] font-mono bg-sage-50 text-sage-700 px-2.5 py-1 rounded-full font-bold">CRO Móvil</span>
            </div>
            
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-warm-700 dark:text-warm-300 uppercase tracking-wider">Titular Principal</label>
                  <input 
                    type="text" 
                    value={formData.heroTitle}
                    onChange={(e) => setFormData({ ...formData, heroTitle: e.target.value })}
                    placeholder="Ej: El Arte de Amarte Cada Día."
                    className="w-full px-4 py-2.5 bg-warm-50/80 dark:bg-warm-900/60 border border-warm-200 dark:border-warm-800 rounded-xl text-sm text-warm-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#C5A059]"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-warm-700 dark:text-warm-300 uppercase tracking-wider">Subtítulo Descriptivo</label>
                  <textarea 
                    rows={3}
                    value={formData.heroSubtitle}
                    onChange={(e) => setFormData({ ...formData, heroSubtitle: e.target.value })}
                    placeholder="Descubre nuestra selección curada..."
                    className="w-full px-4 py-2.5 bg-warm-50/80 dark:bg-warm-900/60 border border-warm-200 dark:border-warm-800 rounded-xl text-sm text-warm-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#C5A059] resize-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-warm-700 dark:text-warm-300 uppercase tracking-wider">Texto Insignia Superior</label>
                  <input 
                    type="text" 
                    value={formData.heroBadgeText}
                    onChange={(e) => setFormData({ ...formData, heroBadgeText: e.target.value })}
                    className="w-full px-4 py-2 bg-warm-50/80 dark:bg-warm-900/60 border border-warm-200 dark:border-warm-800 rounded-xl text-sm text-warm-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#C5A059]"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-warm-700 dark:text-warm-300 uppercase tracking-wider flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-warm-400" />
                    Imagen de Fondo / Ilustración
                  </label>
                  <CloudinaryUploader
                    folder="ecommerce-bienestar/settings"
                    onUploadSuccess={(url) => setFormData({ ...formData, heroImageUrl: url })}
                    defaultImage={formData.heroImageUrl}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-warm-600 dark:text-warm-400">Botón CTA Texto</label>
                    <input 
                      type="text" 
                      value={formData.heroButtonText}
                      onChange={(e) => setFormData({ ...formData, heroButtonText: e.target.value })}
                      className="w-full px-3 py-2 bg-warm-50/80 dark:bg-warm-900/60 border border-warm-200 rounded-lg text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-warm-600 dark:text-warm-400">Botón CTA Enlace</label>
                    <input 
                      type="text" 
                      value={formData.heroButtonLink}
                      onChange={(e) => setFormData({ ...formData, heroButtonLink: e.target.value })}
                      className="w-full px-3 py-2 bg-warm-50/80 dark:bg-warm-900/60 border border-warm-200 rounded-lg text-xs"
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 2. BENTO GRID (La Transformación) */}
          <section className="bg-white dark:bg-warm-900/40 backdrop-blur-md p-6 sm:p-8 rounded-3xl border border-warm-200 dark:border-warm-800/60 shadow-sm space-y-6" onClick={() => setPreviewSection("bento")}>
            <div className="flex items-center justify-between border-b border-warm-100 dark:border-warm-800/50 pb-4">
              <div className="flex items-center gap-2.5">
                <Layout className="w-5 h-5 text-[#C5A059]" />
                <h2 className="text-lg font-bold text-warm-900 dark:text-white font-serif">2. Bento Grid (La Transformación)</h2>
              </div>
              <span className="text-[11px] font-mono bg-gold-100 text-gold-800 px-2.5 py-1 rounded-full font-bold">Asimétrico 300px min</span>
            </div>
            
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-warm-700 dark:text-warm-300 uppercase tracking-wider">Título General</label>
                  <input 
                    type="text" 
                    value={formData.bentoTitle}
                    onChange={(e) => setFormData({ ...formData, bentoTitle: e.target.value })}
                    className="w-full px-4 py-2.5 bg-warm-50/80 dark:bg-warm-900/60 border border-warm-200 rounded-xl text-sm text-warm-900 dark:text-white"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-warm-700 dark:text-warm-300 uppercase tracking-wider">Subtítulo Descriptivo</label>
                  <textarea 
                    rows={3}
                    value={formData.bentoSubtitle}
                    onChange={(e) => setFormData({ ...formData, bentoSubtitle: e.target.value })}
                    className="w-full px-4 py-2.5 bg-warm-50/80 dark:bg-warm-900/60 border border-warm-200 rounded-xl text-sm text-warm-900 dark:text-white resize-none"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-warm-700 dark:text-warm-300 uppercase tracking-wider flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-warm-400" />
                  Imagen de Tarjeta 1 (Principal)
                </label>
                <CloudinaryUploader
                  folder="ecommerce-bienestar/settings/bento"
                  onUploadSuccess={(url) => setFormData({ ...formData, bentoImage: url })}
                  defaultImage={formData.bentoImage}
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-6 pt-4 border-t border-warm-100 dark:border-warm-800/40">
              <div className="space-y-3 p-4 rounded-2xl bg-warm-50/50 dark:bg-warm-800/20 border border-warm-200">
                <span className="text-xs font-bold font-mono text-[#C5A059]">02 // TARJETA SUEÑO</span>
                <input 
                  type="text"
                  value={formData.bentoCard2Title}
                  onChange={(e) => setFormData({ ...formData, bentoCard2Title: e.target.value })}
                  placeholder="Sueño Ininterrumpido"
                  className="w-full px-3 py-1.5 bg-white dark:bg-warm-900 border border-warm-200 rounded-lg text-xs font-semibold"
                />
                <textarea 
                  rows={2}
                  value={formData.bentoCard2Desc}
                  onChange={(e) => setFormData({ ...formData, bentoCard2Desc: e.target.value })}
                  placeholder="Difusor Ultrasónico + Aceite..."
                  className="w-full px-3 py-1.5 bg-white dark:bg-warm-900 border border-warm-200 rounded-lg text-xs resize-none"
                />
                <CloudinaryUploader
                  folder="ecommerce-bienestar/settings/bento"
                  onUploadSuccess={(url) => setFormData({ ...formData, bentoCard2Image: url })}
                  defaultImage={formData.bentoCard2Image}
                />
              </div>

              <div className="space-y-3 p-4 rounded-2xl bg-warm-50/50 dark:bg-warm-800/20 border border-warm-200">
                <span className="text-xs font-bold font-mono text-[#C5A059]">03 // TARJETA ALIVIO</span>
                <input 
                  type="text"
                  value={formData.bentoCard3Title}
                  onChange={(e) => setFormData({ ...formData, bentoCard3Title: e.target.value })}
                  placeholder="Alivio Inmediato"
                  className="w-full px-3 py-1.5 bg-white dark:bg-warm-900 border border-warm-200 rounded-lg text-xs font-semibold"
                />
                <textarea 
                  rows={2}
                  value={formData.bentoCard3Desc}
                  onChange={(e) => setFormData({ ...formData, bentoCard3Desc: e.target.value })}
                  placeholder="Set Terapéutico x6 Aceites..."
                  className="w-full px-3 py-1.5 bg-white dark:bg-warm-900 border border-warm-200 rounded-lg text-xs resize-none"
                />
                <CloudinaryUploader
                  folder="ecommerce-bienestar/settings/bento"
                  onUploadSuccess={(url) => setFormData({ ...formData, bentoCard3Image: url })}
                  defaultImage={formData.bentoCard3Image}
                />
              </div>
            </div>
          </section>

          {/* 3. CURATED SELECTION (3 Columnas Editoriales) */}
          <section className="bg-white dark:bg-warm-900/40 backdrop-blur-md p-6 sm:p-8 rounded-3xl border border-warm-200 dark:border-warm-800/60 shadow-sm space-y-6" onClick={() => setPreviewSection("curated")}>
            <div className="flex items-center justify-between border-b border-warm-100 dark:border-warm-800/50 pb-4">
              <div className="flex items-center gap-2.5">
                <Layers className="w-5 h-5 text-[#C5A059]" />
                <h2 className="text-lg font-bold text-warm-900 dark:text-white font-serif">3. Curaduría (Nuestra Selección de Bienestar)</h2>
              </div>
              <span className="text-[11px] font-mono bg-sage-50 text-sage-700 px-2.5 py-1 rounded-full font-bold">Editorial 3 Col</span>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-warm-700 dark:text-warm-300 uppercase tracking-wider">Título de Curaduría</label>
                <input 
                  type="text" 
                  value={formData.curatedTitle}
                  onChange={(e) => setFormData({ ...formData, curatedTitle: e.target.value })}
                  className="w-full px-4 py-2.5 bg-warm-50/80 dark:bg-warm-900/60 border border-warm-200 rounded-xl text-sm"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-warm-700 dark:text-warm-300 uppercase tracking-wider">Subtítulo Descriptivo</label>
                <input 
                  type="text" 
                  value={formData.curatedSubtitle}
                  onChange={(e) => setFormData({ ...formData, curatedSubtitle: e.target.value })}
                  className="w-full px-4 py-2.5 bg-warm-50/80 dark:bg-warm-900/60 border border-warm-200 rounded-xl text-sm"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4 pt-2">
              <div className="space-y-3 p-4 rounded-2xl bg-warm-50/50 dark:bg-warm-800/20 border border-warm-200">
                <span className="text-xs font-bold font-mono text-[#C5A059]">01 // TERAPIA TÉRMICA</span>
                <input 
                  type="text" 
                  value={formData.curated1Title}
                  onChange={(e) => setFormData({ ...formData, curated1Title: e.target.value })}
                  placeholder="Terapia Térmica"
                  className="w-full px-3 py-1.5 bg-white dark:bg-warm-900 border border-warm-200 rounded-lg text-xs font-semibold"
                />
                <textarea 
                  rows={3}
                  value={formData.curated1Desc}
                  onChange={(e) => setFormData({ ...formData, curated1Desc: e.target.value })}
                  placeholder="Compresas calientes..."
                  className="w-full px-3 py-1.5 bg-white dark:bg-warm-900 border border-warm-200 rounded-lg text-xs resize-none"
                />
                <CloudinaryUploader
                  folder="ecommerce-bienestar/curated"
                  onUploadSuccess={(url) => setFormData({ ...formData, curated1Image: url })}
                  defaultImage={formData.curated1Image}
                />
              </div>

              <div className="space-y-3 p-4 rounded-2xl bg-warm-50/50 dark:bg-warm-800/20 border border-warm-200">
                <span className="text-xs font-bold font-mono text-[#C5A059]">02 // AROMATERAPIA</span>
                <input 
                  type="text" 
                  value={formData.curated2Title}
                  onChange={(e) => setFormData({ ...formData, curated2Title: e.target.value })}
                  placeholder="Aromaterapia Pura"
                  className="w-full px-3 py-1.5 bg-white dark:bg-warm-900 border border-warm-200 rounded-lg text-xs font-semibold"
                />
                <textarea 
                  rows={3}
                  value={formData.curated2Desc}
                  onChange={(e) => setFormData({ ...formData, curated2Desc: e.target.value })}
                  placeholder="Aceites esenciales puros..."
                  className="w-full px-3 py-1.5 bg-white dark:bg-warm-900 border border-warm-200 rounded-lg text-xs resize-none"
                />
                <CloudinaryUploader
                  folder="ecommerce-bienestar/curated"
                  onUploadSuccess={(url) => setFormData({ ...formData, curated2Image: url })}
                  defaultImage={formData.curated2Image}
                />
              </div>

              <div className="space-y-3 p-4 rounded-2xl bg-warm-50/50 dark:bg-warm-800/20 border border-warm-200">
                <span className="text-xs font-bold font-mono text-[#C5A059]">03 // AMBIENTES</span>
                <input 
                  type="text" 
                  value={formData.curated3Title}
                  onChange={(e) => setFormData({ ...formData, curated3Title: e.target.value })}
                  placeholder="Ambientes Serenos"
                  className="w-full px-3 py-1.5 bg-white dark:bg-warm-900 border border-warm-200 rounded-lg text-xs font-semibold"
                />
                <textarea 
                  rows={3}
                  value={formData.curated3Desc}
                  onChange={(e) => setFormData({ ...formData, curated3Desc: e.target.value })}
                  placeholder="Difusores ultrasónicos..."
                  className="w-full px-3 py-1.5 bg-white dark:bg-warm-900 border border-warm-200 rounded-lg text-xs resize-none"
                />
                <CloudinaryUploader
                  folder="ecommerce-bienestar/curated"
                  onUploadSuccess={(url) => setFormData({ ...formData, curated3Image: url })}
                  defaultImage={formData.curated3Image}
                />
              </div>
            </div>
          </section>

          {/* 4. PURPOSE SPLIT LAYOUT (El Arte de Reconectar) */}
          <section className="bg-white dark:bg-warm-900/40 backdrop-blur-md p-6 sm:p-8 rounded-3xl border border-warm-200 dark:border-warm-800/60 shadow-sm space-y-6" onClick={() => setPreviewSection("purpose")}>
            <div className="flex items-center justify-between border-b border-warm-100 dark:border-warm-800/50 pb-4">
              <div className="flex items-center gap-2.5">
                <Heart className="w-5 h-5 text-[#C5A059]" />
                <h2 className="text-lg font-bold text-warm-900 dark:text-white font-serif">4. Split Layout (El Arte de Reconectar)</h2>
              </div>
              <span className="text-[11px] font-mono bg-gold-100 text-gold-800 px-2.5 py-1 rounded-full font-bold">50/50 Verde #2C402E</span>
            </div>
            
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-warm-700 uppercase tracking-wider">Kicker</label>
                    <input 
                      type="text" 
                      value={formData.splitKicker}
                      onChange={(e) => setFormData({ ...formData, splitKicker: e.target.value })}
                      className="w-full px-3 py-2 bg-warm-50/80 border border-warm-200 rounded-xl text-xs font-bold"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-warm-700 uppercase tracking-wider">Botón CTA</label>
                    <input 
                      type="text" 
                      value={formData.splitButtonText}
                      onChange={(e) => setFormData({ ...formData, splitButtonText: e.target.value })}
                      className="w-full px-3 py-2 bg-warm-50/80 border border-warm-200 rounded-xl text-xs font-bold"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-warm-700 uppercase tracking-wider">Título Principal Serif</label>
                  <input 
                    type="text" 
                    value={formData.splitTitle}
                    onChange={(e) => setFormData({ ...formData, splitTitle: e.target.value })}
                    className="w-full px-4 py-2 bg-warm-50/80 border border-warm-200 rounded-xl text-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-warm-700 uppercase tracking-wider">Descripción de Curaduría</label>
                  <textarea 
                    rows={4}
                    value={formData.splitDescription}
                    onChange={(e) => setFormData({ ...formData, splitDescription: e.target.value })}
                    className="w-full px-4 py-2 bg-warm-50/80 border border-warm-200 rounded-xl text-sm resize-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-warm-600">Footer Izquierdo</label>
                    <input 
                      type="text" 
                      value={formData.splitFooterLeft}
                      onChange={(e) => setFormData({ ...formData, splitFooterLeft: e.target.value })}
                      className="w-full px-3 py-1.5 bg-warm-50 border border-warm-200 rounded-lg text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-warm-600">Footer Derecho</label>
                    <input 
                      type="text" 
                      value={formData.splitFooterRight}
                      onChange={(e) => setFormData({ ...formData, splitFooterRight: e.target.value })}
                      className="w-full px-3 py-1.5 bg-warm-50 border border-warm-200 rounded-lg text-xs"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-warm-700 uppercase tracking-wider flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-warm-400" />
                  Imagen del Split Layout (50/50)
                </label>
                <CloudinaryUploader
                  folder="ecommerce-bienestar/settings/split"
                  onUploadSuccess={(url) => setFormData({ ...formData, splitImageUrl: url, purposeImage: url })}
                  defaultImage={formData.splitImageUrl}
                />
              </div>
            </div>
          </section>

          {/* 5. NUESTRA PROMESA (Estándares) */}
          <section className="bg-white dark:bg-warm-900/40 backdrop-blur-md p-6 sm:p-8 rounded-3xl border border-warm-200 dark:border-warm-800/60 shadow-sm space-y-6" onClick={() => setPreviewSection("promise")}>
            <div className="flex items-center justify-between border-b border-warm-100 dark:border-warm-800/50 pb-4">
              <div className="flex items-center gap-2.5">
                <Shield className="w-5 h-5 text-[#C5A059]" />
                <h2 className="text-lg font-bold text-warm-900 dark:text-white font-serif">5. Nuestra Promesa (Estándares de Excelencia)</h2>
              </div>
              <span className="text-[11px] font-mono bg-sage-50 text-sage-700 px-2.5 py-1 rounded-full font-bold">3 Pilares</span>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-3 p-4 rounded-2xl bg-warm-50/50 dark:bg-warm-800/20 border border-warm-200">
                <span className="text-xs font-bold font-mono text-[#C5A059]">01 // PILAR 1</span>
                <input 
                  type="text" 
                  value={formData.promise1Title}
                  onChange={(e) => setFormData({ ...formData, promise1Title: e.target.value })}
                  placeholder="Pureza Botánica"
                  className="w-full px-3 py-1.5 bg-white dark:bg-warm-900 border border-warm-200 rounded-lg text-xs font-semibold"
                />
                <textarea 
                  rows={3}
                  value={formData.promise1Desc}
                  onChange={(e) => setFormData({ ...formData, promise1Desc: e.target.value })}
                  className="w-full px-3 py-1.5 bg-white dark:bg-warm-900 border border-warm-200 rounded-lg text-xs resize-none"
                />
              </div>

              <div className="space-y-3 p-4 rounded-2xl bg-warm-50/50 dark:bg-warm-800/20 border border-warm-200">
                <span className="text-xs font-bold font-mono text-[#C5A059]">02 // PILAR 2</span>
                <input 
                  type="text" 
                  value={formData.promise2Title}
                  onChange={(e) => setFormData({ ...formData, promise2Title: e.target.value })}
                  placeholder="Grado Terapéutico"
                  className="w-full px-3 py-1.5 bg-white dark:bg-warm-900 border border-warm-200 rounded-lg text-xs font-semibold"
                />
                <textarea 
                  rows={3}
                  value={formData.promise2Desc}
                  onChange={(e) => setFormData({ ...formData, promise2Desc: e.target.value })}
                  className="w-full px-3 py-1.5 bg-white dark:bg-warm-900 border border-warm-200 rounded-lg text-xs resize-none"
                />
              </div>

              <div className="space-y-3 p-4 rounded-2xl bg-warm-50/50 dark:bg-warm-800/20 border border-warm-200">
                <span className="text-xs font-bold font-mono text-[#C5A059]">03 // PILAR 3</span>
                <input 
                  type="text" 
                  value={formData.promise3Title}
                  onChange={(e) => setFormData({ ...formData, promise3Title: e.target.value })}
                  placeholder="Entrega Local Exprés"
                  className="w-full px-3 py-1.5 bg-white dark:bg-warm-900 border border-warm-200 rounded-lg text-xs font-semibold"
                />
                <textarea 
                  rows={3}
                  value={formData.promise3Desc}
                  onChange={(e) => setFormData({ ...formData, promise3Desc: e.target.value })}
                  className="w-full px-3 py-1.5 bg-white dark:bg-warm-900 border border-warm-200 rounded-lg text-xs resize-none"
                />
              </div>
            </div>
          </section>

          {/* 6. PROMO MODAL */}
          <section className="bg-white dark:bg-warm-900/40 backdrop-blur-md p-6 sm:p-8 rounded-3xl border border-warm-200 dark:border-warm-800/60 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-warm-100 dark:border-warm-800/50 pb-4">
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-5 h-5 text-[#C5A059]" />
                <h2 className="text-lg font-bold text-warm-900 dark:text-white font-serif">6. Modal Promocional (Popup)</h2>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer"
                  checked={formData.promoModalActive}
                  onChange={(e) => setFormData({ ...formData, promoModalActive: e.target.checked })}
                />
                <div className="w-11 h-6 bg-warm-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-warm-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#2C402E]"></div>
                <span className="ml-3 text-xs font-bold text-warm-900 dark:text-warm-300">
                  {formData.promoModalActive ? "Activado" : "Desactivado"}
                </span>
              </label>
            </div>
            
            <div className={`grid sm:grid-cols-2 gap-6 transition-opacity duration-300 ${!formData.promoModalActive ? 'opacity-40 pointer-events-none' : ''}`}>
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-warm-700 uppercase tracking-wider">Título del Modal</label>
                  <input 
                    type="text" 
                    value={formData.promoModalTitle}
                    onChange={(e) => setFormData({ ...formData, promoModalTitle: e.target.value })}
                    className="w-full px-4 py-2 bg-warm-50/80 border border-warm-200 rounded-xl text-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-warm-700 uppercase tracking-wider">Texto / Descripción</label>
                  <textarea 
                    rows={3}
                    value={formData.promoModalText}
                    onChange={(e) => setFormData({ ...formData, promoModalText: e.target.value })}
                    className="w-full px-4 py-2 bg-warm-50/80 border border-warm-200 rounded-xl text-sm resize-none"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-warm-700 uppercase tracking-wider flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-warm-400" />
                  Imagen Promocional
                </label>
                <CloudinaryUploader
                  folder="ecommerce-bienestar/promos"
                  onUploadSuccess={(url) => setFormData({ ...formData, promoModalImage: url })}
                  defaultImage={formData.promoModalImage}
                />
              </div>
            </div>
          </section>

        </div>

        {/* Right Column: Reactive Live Preview (5 cols on desktop, Sticky) */}
        <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-4">
          <div className="bg-white dark:bg-warm-900/90 p-4 rounded-2xl border border-warm-200 dark:border-warm-800 shadow-md flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500 animate-pulse shrink-0" />
              <span className="font-bold text-xs sm:text-sm text-[#2C402E] dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                <Eye className="w-4 h-4 text-[#C5A059]" /> Vista Previa En Tiempo Real
              </span>
            </div>
            <div className="flex items-center gap-1 bg-warm-100 dark:bg-warm-800/80 p-1 rounded-xl text-xs font-medium">
              <button
                type="button"
                onClick={() => setPreviewSection("all")}
                className={`px-2.5 py-1 rounded-lg transition-all ${previewSection === "all" ? "bg-white dark:bg-warm-700 text-[#2C402E] dark:text-white font-bold shadow-xs" : "text-warm-600 dark:text-warm-300 hover:text-warm-900"}`}
              >
                Todo
              </button>
              <button
                type="button"
                onClick={() => setPreviewSection("hero")}
                className={`px-2.5 py-1 rounded-lg transition-all ${previewSection === "hero" ? "bg-white dark:bg-warm-700 text-[#2C402E] dark:text-white font-bold shadow-xs" : "text-warm-600 dark:text-warm-300 hover:text-warm-900"}`}
              >
                Hero
              </button>
              <button
                type="button"
                onClick={() => setPreviewSection("bento")}
                className={`px-2.5 py-1 rounded-lg transition-all ${previewSection === "bento" ? "bg-white dark:bg-warm-700 text-[#2C402E] dark:text-white font-bold shadow-xs" : "text-warm-600 dark:text-warm-300 hover:text-warm-900"}`}
              >
                Bento
              </button>
              <button
                type="button"
                onClick={() => setPreviewSection("curated")}
                className={`px-2.5 py-1 rounded-lg transition-all ${previewSection === "curated" ? "bg-white dark:bg-warm-700 text-[#2C402E] dark:text-white font-bold shadow-xs" : "text-warm-600 dark:text-warm-300 hover:text-warm-900"}`}
              >
                Curaduría
              </button>
              <button
                type="button"
                onClick={() => setPreviewSection("purpose")}
                className={`px-2.5 py-1 rounded-lg transition-all ${previewSection === "purpose" ? "bg-white dark:bg-warm-700 text-[#2C402E] dark:text-white font-bold shadow-xs" : "text-warm-600 dark:text-warm-300 hover:text-warm-900"}`}
              >
                Split
              </button>
            </div>
          </div>

          {/* Scaled Preview Container with Reactive State */}
          <div className="relative w-full h-[650px] sm:h-[760px] lg:h-[820px] rounded-3xl overflow-hidden border-2 border-[#C5A059]/40 shadow-2xl bg-[#FAF8F5]">
            <div className="w-full h-full overflow-y-auto overflow-x-hidden custom-scrollbar">
              <div className="origin-top scale-[0.62] sm:scale-[0.72] lg:scale-[0.6] xl:scale-[0.7] w-[161%] sm:w-[138%] lg:w-[166%] xl:w-[142%] transition-transform duration-300 bg-[#FAF8F5] pb-32 text-[#2C402E]">
                {(previewSection === "all" || previewSection === "hero") && (
                  <div className="border-b border-[#2C402E]/10">
                    <HeroSection settings={formData} title={formData.heroTitle} subtitle={formData.heroSubtitle} imageUrl={formData.heroImageUrl} />
                  </div>
                )}
                {(previewSection === "all" || previewSection === "bento") && (
                  <div className="border-b border-[#2C402E]/10">
                    <TransformationBento settings={formData} />
                  </div>
                )}
                {(previewSection === "all" || previewSection === "curated") && (
                  <div className="border-b border-[#2C402E]/10">
                    <CuratedSelection settings={formData} />
                  </div>
                )}
                {(previewSection === "all" || previewSection === "purpose") && (
                  <div className="border-b border-[#2C402E]/10">
                    <PurposeSection settings={formData} />
                  </div>
                )}
                {(previewSection === "all" || previewSection === "promise") && (
                  <div>
                    <TrustBadges settings={formData} />
                  </div>
                )}
              </div>
            </div>
          </div>
          <p className="text-center text-[11px] text-warm-500 italic">
            * Vista previa escalada en vivo alimentada del estado reactivo del formulario.
          </p>
        </div>

      </div>
    </form>
  );
}
