"use client";

import { useState, useTransition } from "react";
import { useToast } from "@/components/ui/toast";
import { ArcoStatus } from "@prisma/client";
import { updateArcoStatus } from "@/app/actions/admin-users";
import { Loader2, ShieldAlert } from "lucide-react";

export function ArcoTableClient({ initialRequests }: { initialRequests: any[] }) {
  const [requests, setRequests] = useState(initialRequests);
  const [isPending, startTransition] = useTransition();
  const { addToast } = useToast();

  const handleStatusChange = (requestId: string, newStatus: ArcoStatus) => {
    startTransition(async () => {
      // Optimistic Update
      setRequests(prev => prev.map(r => r.id === requestId ? { ...r, status: newStatus } : r));
      
      const res = await updateArcoStatus(requestId, newStatus);
      if (res?.error) {
        setRequests(initialRequests);
        addToast({ type: "error", title: "Error", description: res.error });
      } else {
        addToast({ type: "success", title: "Estado Actualizado", description: "El estado de la solicitud ARCO fue actualizado." });
      }
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDIENTE': return 'bg-amber-100 text-amber-800 dark:bg-amber-500/10 dark:text-amber-400';
      case 'EN_PROCESO': return 'bg-blue-100 text-blue-800 dark:bg-blue-500/10 dark:text-blue-400';
      case 'RESUELTO': return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-400';
      case 'RECHAZADO': return 'bg-red-100 text-red-800 dark:bg-red-500/10 dark:text-red-400';
      default: return 'bg-warm-100 text-warm-800 dark:bg-warm-500/10 dark:text-warm-400';
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold text-warm-900 dark:text-white tracking-tight flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-sage-600" />
          Solicitudes ARCO
        </h2>
        <p className="text-warm-500 dark:text-warm-400 mt-1 text-sm">Gestiona las solicitudes de privacidad de datos (Ley N° 29733).</p>
      </div>

      <div className="bg-white dark:bg-warm-900/30 backdrop-blur-md border border-warm-200 dark:border-warm-800/50 rounded-2xl shadow-sm overflow-hidden relative">
        {isPending && (
          <div className="absolute inset-0 bg-white/50 dark:bg-warm-900/50 backdrop-blur-sm z-10 flex items-center justify-center">
             <Loader2 className="w-8 h-8 text-sage-600 animate-spin" />
          </div>
        )}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-warm-50/50 dark:bg-warm-800/20 border-b border-warm-200 dark:border-warm-800/50 text-xs uppercase tracking-wider font-semibold text-warm-500 dark:text-warm-400">
                <th className="px-6 py-4">Fecha</th>
                <th className="px-6 py-4">Usuario</th>
                <th className="px-6 py-4">Tipo</th>
                <th className="px-6 py-4">Detalles</th>
                <th className="px-6 py-4 text-right">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-warm-200 dark:divide-warm-800/50">
              {requests.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-warm-500 dark:text-warm-400">
                    No hay solicitudes ARCO pendientes.
                  </td>
                </tr>
              ) : (
                requests.map((req) => (
                  <tr key={req.id} className="hover:bg-warm-50/50 dark:hover:bg-warm-800/10 transition-colors">
                    <td className="px-6 py-4 text-warm-600 dark:text-warm-400 text-sm">
                      {new Date(req.createdAt).toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-medium text-warm-900 dark:text-white">{req.user?.name || "Desconocido"}</span>
                        <span className="text-xs text-warm-500">{req.user?.email || "-"}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-warm-100 text-warm-800 dark:bg-warm-800 dark:text-warm-300">
                        {req.type}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-warm-700 dark:text-warm-300 line-clamp-2 max-w-xs" title={req.details}>
                        {req.details}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <select 
                        value={req.status}
                        onChange={(e) => handleStatusChange(req.id, e.target.value as ArcoStatus)}
                        className={`text-xs font-medium rounded-full px-2.5 py-1 focus:ring-2 focus:ring-sage-500 cursor-pointer outline-none ml-auto block ${getStatusColor(req.status)}`}
                      >
                        {Object.values(ArcoStatus).map(status => (
                          <option key={status} value={status}>{status.replace('_', ' ')}</option>
                        ))}
                      </select>
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
