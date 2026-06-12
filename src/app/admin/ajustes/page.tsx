import { Save, Store, Globe, MapPin, Receipt } from "lucide-react";

export default function AjustesPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-700 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-warm-900 dark:text-white tracking-tight">Ajustes de la Tienda</h1>
          <p className="text-warm-500 dark:text-warm-400 mt-1">Configura los detalles generales, SEO y opciones de envío.</p>
        </div>
        <button className="flex items-center gap-2 bg-sage-600 hover:bg-sage-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm">
          <Save className="w-4 h-4" />
          Guardar Cambios
        </button>
      </div>

      <div className="grid gap-6">
        {/* General Settings */}
        <section className="bg-white dark:bg-warm-900/30 backdrop-blur-md p-6 rounded-2xl border border-warm-200 dark:border-warm-800/50 shadow-sm">
          <div className="flex items-center gap-2 mb-6 border-b border-warm-100 dark:border-warm-800/50 pb-4">
            <Store className="w-5 h-5 text-sage-600 dark:text-sage-400" />
            <h2 className="text-lg font-semibold text-warm-900 dark:text-white">Información General</h2>
          </div>
          
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-warm-700 dark:text-warm-300">Nombre de la Tienda</label>
              <input 
                type="text" 
                defaultValue="Bienestar Store"
                className="w-full px-4 py-2.5 bg-warm-50 dark:bg-warm-900/50 border border-warm-200 dark:border-warm-800 rounded-lg text-sm text-warm-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sage-500/50"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-warm-700 dark:text-warm-300">Correo de Contacto</label>
              <input 
                type="email" 
                defaultValue="hola@bienestarstore.pe"
                className="w-full px-4 py-2.5 bg-warm-50 dark:bg-warm-900/50 border border-warm-200 dark:border-warm-800 rounded-lg text-sm text-warm-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sage-500/50"
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <label className="text-sm font-medium text-warm-700 dark:text-warm-300">Descripción Corta</label>
              <textarea 
                rows={3}
                defaultValue="Tu tienda de productos de relajación y bienestar en Lima, Perú"
                className="w-full px-4 py-2.5 bg-warm-50 dark:bg-warm-900/50 border border-warm-200 dark:border-warm-800 rounded-lg text-sm text-warm-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sage-500/50 resize-none"
              />
            </div>
          </div>
        </section>

        {/* Localización */}
        <section className="bg-white dark:bg-warm-900/30 backdrop-blur-md p-6 rounded-2xl border border-warm-200 dark:border-warm-800/50 shadow-sm">
          <div className="flex items-center gap-2 mb-6 border-b border-warm-100 dark:border-warm-800/50 pb-4">
            <MapPin className="w-5 h-5 text-sage-600 dark:text-sage-400" />
            <h2 className="text-lg font-semibold text-warm-900 dark:text-white">Ubicación y Moneda</h2>
          </div>
          
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-warm-700 dark:text-warm-300">País</label>
              <select className="w-full px-4 py-2.5 bg-warm-50 dark:bg-warm-900/50 border border-warm-200 dark:border-warm-800 rounded-lg text-sm text-warm-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sage-500/50">
                <option value="PE">Perú</option>
                <option value="CO">Colombia</option>
                <option value="MX">México</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-warm-700 dark:text-warm-300">Moneda Base</label>
              <select className="w-full px-4 py-2.5 bg-warm-50 dark:bg-warm-900/50 border border-warm-200 dark:border-warm-800 rounded-lg text-sm text-warm-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sage-500/50">
                <option value="PEN">Soles (PEN)</option>
                <option value="USD">Dólares (USD)</option>
              </select>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
