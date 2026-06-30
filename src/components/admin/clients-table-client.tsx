"use client";

import { UserCircle2 } from "lucide-react";

export function ClientsTableClient({ users }: { users: any[] }) {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold text-warm-900 dark:text-white tracking-tight">Usuarios Registrados</h2>
        <p className="text-warm-500 dark:text-warm-400 mt-1 text-sm">Directorio de clientes de la tienda.</p>
      </div>

      <div className="bg-white dark:bg-warm-900/30 backdrop-blur-md border border-warm-200 dark:border-warm-800/50 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-warm-50/50 dark:bg-warm-800/20 border-b border-warm-200 dark:border-warm-800/50 text-xs uppercase tracking-wider font-semibold text-warm-500 dark:text-warm-400">
                <th className="px-6 py-4">Usuario</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Rol</th>
                <th className="px-6 py-4 text-right">Fecha Registro</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-warm-200 dark:divide-warm-800/50">
              {users.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-warm-500 dark:text-warm-400">
                    No hay usuarios registrados.
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="hover:bg-warm-50/50 dark:hover:bg-warm-800/10 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-warm-100 dark:bg-warm-800 flex items-center justify-center shrink-0">
                          {user.avatarUrl ? (
                            <img src={user.avatarUrl} alt="" className="w-full h-full rounded-full object-cover" />
                          ) : (
                            <UserCircle2 className="w-6 h-6 text-warm-400" />
                          )}
                        </div>
                        <span className="font-medium text-warm-900 dark:text-white">{user.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-warm-600 dark:text-warm-400 text-sm">
                      {user.email}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' : 'bg-sage-100 text-sage-800'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right text-warm-600 dark:text-warm-400 text-sm">
                      {new Date(user.createdAt).toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
