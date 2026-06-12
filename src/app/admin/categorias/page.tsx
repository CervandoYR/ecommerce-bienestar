import { Tags, Plus, Search, MoreVertical, Edit2, Trash2 } from "lucide-react";

const mockCategories = [
  { id: "1", name: "Relajación Profunda", slug: "relajacion-profunda", products: 12, status: "Activo" },
  { id: "2", name: "Santuarios de Bienestar", slug: "santuarios-bienestar", products: 8, status: "Activo" },
  { id: "3", name: "Velas & Inciensos", slug: "velas-inciensos", products: 24, status: "Activo" },
  { id: "4", name: "Aromaterapia", slug: "aromaterapia", products: 5, status: "Borrador" },
];

export default function CategoriasPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-warm-900 dark:text-white tracking-tight">Categorías</h1>
          <p className="text-warm-500 dark:text-warm-400 mt-1">Organiza tus productos en colecciones temáticas.</p>
        </div>
        <button className="flex items-center gap-2 bg-sage-600 hover:bg-sage-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm">
          <Plus className="w-4 h-4" />
          Nueva Categoría
        </button>
      </div>

      {/* Toolbar */}
      <div className="bg-white dark:bg-warm-900/30 backdrop-blur-md p-4 rounded-2xl border border-warm-200 dark:border-warm-800/50 shadow-sm flex items-center justify-between">
        <div className="relative w-full max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-warm-400" />
          <input 
            type="text" 
            placeholder="Buscar categorías..." 
            className="w-full pl-9 pr-4 py-2 bg-warm-50 dark:bg-warm-900/50 border border-warm-200 dark:border-warm-800 rounded-lg text-sm text-warm-900 dark:text-white placeholder:text-warm-400 focus:outline-none focus:ring-2 focus:ring-sage-500/50 transition-shadow"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-warm-900/30 backdrop-blur-md border border-warm-200 dark:border-warm-800/50 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-warm-50/50 dark:bg-warm-800/20 border-b border-warm-200 dark:border-warm-800/50 text-xs uppercase tracking-wider font-semibold text-warm-500 dark:text-warm-400">
                <th className="px-6 py-4">Nombre</th>
                <th className="px-6 py-4">Slug</th>
                <th className="px-6 py-4">Productos</th>
                <th className="px-6 py-4">Estado</th>
                <th className="px-6 py-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-warm-200 dark:divide-warm-800/50">
              {mockCategories.map((cat) => (
                <tr key={cat.id} className="hover:bg-warm-50/50 dark:hover:bg-warm-800/10 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-sage-100 dark:bg-sage-500/10 flex items-center justify-center shrink-0">
                        <Tags className="w-5 h-5 text-sage-600 dark:text-sage-400" />
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
                    {cat.products} productos
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      cat.status === 'Activo' 
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-400' 
                        : 'bg-warm-100 text-warm-800 dark:bg-warm-500/10 dark:text-warm-400'
                    }`}>
                      {cat.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 text-warm-400 hover:text-sage-600 dark:hover:text-sage-400 transition-colors rounded-lg hover:bg-warm-100 dark:hover:bg-warm-800">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-warm-400 hover:text-red-600 dark:hover:text-red-400 transition-colors rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
