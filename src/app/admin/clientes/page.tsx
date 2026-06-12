import { Users, Search, Mail, MapPin, Phone } from "lucide-react";

const mockClients = [
  { id: "1", name: "María González", email: "maria@example.com", phone: "+51 987 654 321", district: "Miraflores", orders: 3, totalSpent: 450.00 },
  { id: "2", name: "Carlos Ruiz", email: "carlos.r@example.com", phone: "+51 912 345 678", district: "San Isidro", orders: 1, totalSpent: 85.50 },
  { id: "3", name: "Ana Torres", email: "ana.t@example.com", phone: "+51 999 888 777", district: "Surco", orders: 5, totalSpent: 1250.00 },
  { id: "4", name: "Jorge Silva", email: "jsilva@example.com", phone: "+51 988 777 666", district: "Barranco", orders: 2, totalSpent: 120.00 },
];

export default function ClientesPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-warm-900 dark:text-white tracking-tight">Directorio de Clientes</h1>
          <p className="text-warm-500 dark:text-warm-400 mt-1">Conoce a tus clientes, su historial de compras y ubicación.</p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white dark:bg-warm-900/30 backdrop-blur-md p-4 rounded-2xl border border-warm-200 dark:border-warm-800/50 shadow-sm flex items-center justify-between">
        <div className="relative w-full max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-warm-400" />
          <input 
            type="text" 
            placeholder="Buscar por nombre, correo o teléfono..." 
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
                <th className="px-6 py-4">Cliente</th>
                <th className="px-6 py-4">Contacto</th>
                <th className="px-6 py-4">Ubicación</th>
                <th className="px-6 py-4 text-center">Pedidos Totales</th>
                <th className="px-6 py-4 text-right">Inversión Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-warm-200 dark:divide-warm-800/50">
              {mockClients.map((client) => (
                <tr key={client.id} className="hover:bg-warm-50/50 dark:hover:bg-warm-800/10 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sage-400 to-sage-600 text-white flex items-center justify-center shrink-0 font-bold text-sm">
                        {client.name.charAt(0)}
                      </div>
                      <span className="font-medium text-warm-900 dark:text-white">{client.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col space-y-1">
                      <div className="flex items-center gap-2 text-xs text-warm-600 dark:text-warm-400">
                        <Mail className="w-3 h-3 text-warm-400" />
                        {client.email}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-warm-600 dark:text-warm-400">
                        <Phone className="w-3 h-3 text-warm-400" />
                        {client.phone}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-warm-600 dark:text-warm-400">
                      <MapPin className="w-4 h-4 text-warm-400" />
                      {client.district}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-warm-100 dark:bg-warm-800 text-warm-700 dark:text-warm-300 font-semibold text-sm">
                      {client.orders}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right font-bold text-sage-600 dark:text-sage-400">
                    S/ {client.totalSpent.toFixed(2)}
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
