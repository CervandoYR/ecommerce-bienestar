import { Users, Plus, Search, Edit2, Trash2, Mail, Phone } from "lucide-react";

const mockProveedores = [
  { id: "1", name: "Aromas del Mundo S.A.", contact: "Roberto Gómez", email: "ventas@aromas.com", phone: "+51 987 654 321", status: "Activo", products: 15 },
  { id: "2", name: "Textiles Andinos", contact: "María Cárdenas", email: "contacto@textilesandinos.pe", phone: "+51 912 345 678", status: "Activo", products: 8 },
  { id: "3", name: "Cerámicas Paz", contact: "Julio Castro", email: "julio@ceramicaspaz.com", phone: "+51 999 888 777", status: "Inactivo", products: 0 },
];

export default function ProveedoresPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-warm-900 dark:text-white tracking-tight">Proveedores</h1>
          <p className="text-warm-500 dark:text-warm-400 mt-1">Directorio de distribuidores y artesanos asociados.</p>
        </div>
        <button className="flex items-center gap-2 bg-sage-600 hover:bg-sage-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm">
          <Plus className="w-4 h-4" />
          Nuevo Proveedor
        </button>
      </div>

      {/* Toolbar */}
      <div className="bg-white dark:bg-warm-900/30 backdrop-blur-md p-4 rounded-2xl border border-warm-200 dark:border-warm-800/50 shadow-sm flex items-center justify-between">
        <div className="relative w-full max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-warm-400" />
          <input 
            type="text" 
            placeholder="Buscar proveedores por nombre o contacto..." 
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
                <th className="px-6 py-4">Empresa</th>
                <th className="px-6 py-4">Contacto</th>
                <th className="px-6 py-4">Productos Asociados</th>
                <th className="px-6 py-4">Estado</th>
                <th className="px-6 py-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-warm-200 dark:divide-warm-800/50">
              {mockProveedores.map((prov) => (
                <tr key={prov.id} className="hover:bg-warm-50/50 dark:hover:bg-warm-800/10 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-sage-100 dark:bg-sage-500/10 flex items-center justify-center shrink-0">
                        <Users className="w-5 h-5 text-sage-600 dark:text-sage-400" />
                      </div>
                      <span className="font-medium text-warm-900 dark:text-white">{prov.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col space-y-1">
                      <span className="text-sm font-medium text-warm-900 dark:text-white">{prov.contact}</span>
                      <div className="flex items-center gap-2 text-xs text-warm-500 dark:text-warm-400">
                        <Mail className="w-3 h-3" />
                        {prov.email}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-warm-500 dark:text-warm-400">
                        <Phone className="w-3 h-3" />
                        {prov.phone}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-warm-600 dark:text-warm-400 text-sm font-medium">
                    {prov.products} items
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      prov.status === 'Activo' 
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-400' 
                        : 'bg-warm-100 text-warm-800 dark:bg-warm-500/10 dark:text-warm-400'
                    }`}>
                      {prov.status}
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
