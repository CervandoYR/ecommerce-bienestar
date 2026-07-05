"use client";

import { useState, useTransition, useMemo } from "react";
import { 
  UserCircle2, 
  Search, 
  ShieldAlert, 
  ShieldCheck, 
  User, 
  Truck, 
  Trash2, 
  Edit3, 
  CheckCircle2, 
  AlertTriangle, 
  Loader2, 
  ShoppingBag,
  HelpCircle,
  Filter
} from "lucide-react";
import { useToast } from "@/components/ui/toast";
import { updateUserRole, deleteUser } from "@/app/actions/admin-users";

interface ClientsTableClientProps {
  users: any[];
}

export function ClientsTableClient({ users }: ClientsTableClientProps) {
  const { addToast } = useToast();
  const [isPending, startTransition] = useTransition();

  // Search and Filter States
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("ALL");

  // Modal States
  const [roleModalUser, setRoleModalUser] = useState<any | null>(null);
  const [targetRole, setTargetRole] = useState<"ADMIN" | "DELIVERY" | "CLIENT">("CLIENT");
  const [deleteModalUser, setDeleteModalUser] = useState<any | null>(null);

  // Filtered Users
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchSearch = 
        u.name?.toLowerCase().includes(search.toLowerCase()) || 
        u.email?.toLowerCase().includes(search.toLowerCase()) ||
        u.documentId?.toLowerCase().includes(search.toLowerCase());
      
      if (!matchSearch) return false;
      if (roleFilter !== "ALL" && u.role !== roleFilter) return false;
      return true;
    });
  }, [users, search, roleFilter]);

  // Counts
  const counts = useMemo(() => {
    const map = { ALL: users.length, ADMIN: 0, CLIENT: 0, DELIVERY: 0 };
    users.forEach((u) => {
      if (u.role === "ADMIN") map.ADMIN++;
      else if (u.role === "DELIVERY") map.DELIVERY++;
      else map.CLIENT++;
    });
    return map;
  }, [users]);

  // Handle Role Change
  const handleConfirmRoleChange = () => {
    if (!roleModalUser) return;
    startTransition(async () => {
      const res = await updateUserRole(roleModalUser.id, targetRole as any);
      if (res.success) {
        addToast({ 
          type: "success", 
          title: "Rol Actualizado", 
          description: `El usuario ${roleModalUser.name} ahora tiene el rol de ${targetRole}.` 
        });
        setRoleModalUser(null);
      } else {
        addToast({ type: "error", title: "Error", description: res.error || "No se pudo cambiar el rol." });
      }
    });
  };

  // Handle Delete
  const handleConfirmDelete = () => {
    if (!deleteModalUser) return;
    startTransition(async () => {
      const res = await deleteUser(deleteModalUser.id);
      if (res.success) {
        addToast({ 
          type: "success", 
          title: "Usuario Eliminado", 
          description: `El registro de ${deleteModalUser.name} ha sido eliminado.` 
        });
        setDeleteModalUser(null);
      } else {
        addToast({ 
          type: "error", 
          title: "Acción Protegida por Seguridad", 
          description: res.error || "No se pudo eliminar el usuario." 
        });
        setDeleteModalUser(null);
      }
    });
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "ADMIN":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold font-mono bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300 border border-purple-200 dark:border-purple-800 shadow-2xs">
            <ShieldCheck className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" /> Administrador
          </span>
        );
      case "DELIVERY":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold font-mono bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300 border border-orange-200 dark:border-orange-800 shadow-2xs">
            <Truck className="w-3.5 h-3.5 text-orange-600 dark:text-orange-400" /> Reparto / Logística
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium font-mono bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 shadow-2xs">
            <User className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> Cliente CRM
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Educational CRM Guide Banner */}
      <div className="bg-sage-50 dark:bg-warm-900/90 p-5 rounded-3xl border border-sage-200 dark:border-warm-700 shadow-md">
        <div className="flex items-start gap-3.5">
          <div className="p-2.5 bg-sage-500/10 dark:bg-sage-500/20 rounded-2xl text-sage-700 dark:text-sage-400 shrink-0 mt-0.5">
            <HelpCircle className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div className="space-y-1.5 text-xs text-warm-700 dark:text-warm-300">
            <h3 className="font-bold text-sm text-warm-900 dark:text-white flex items-center gap-1.5">
              ¿Por qué los clientes se registran al comprar en el Checkout?
            </h3>
            <p className="leading-relaxed">
              En el comercio electrónico moderno (como Shopify o Amazon), al completar un pedido el sistema vincula automáticamente el correo a tu <strong>Directorio CRM</strong>. Esto te permite conocer su historial de compras, otorgarles cupones y facilitar su acceso en futuras compras sin perder sus pedidos previos.
            </p>
          </div>
        </div>
      </div>

      {/* Top Filter Bar & Search */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-warm-900/30 backdrop-blur-md p-4 rounded-3xl border border-warm-200 dark:border-warm-800/50 shadow-sm">
        
        {/* Role Tabs */}
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          <button
            onClick={() => setRoleFilter("ALL")}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              roleFilter === "ALL" 
                ? "bg-warm-900 text-white dark:bg-white dark:text-warm-900 shadow-md" 
                : "bg-warm-100/80 dark:bg-warm-800/50 text-warm-600 dark:text-warm-300 hover:bg-warm-200"
            }`}
          >
            <span>👥 Todos</span>
            <span className="px-1.5 py-0.5 rounded-full text-[10px] font-mono bg-black/10 dark:bg-black/20">{counts.ALL}</span>
          </button>

          <button
            onClick={() => setRoleFilter("ADMIN")}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              roleFilter === "ADMIN" 
                ? "bg-purple-600 text-white shadow-md shadow-purple-500/20" 
                : "bg-warm-100/80 dark:bg-warm-800/50 text-warm-600 dark:text-warm-300 hover:bg-purple-100 hover:text-purple-800"
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>🛡️ Admins</span>
            <span className="px-1.5 py-0.5 rounded-full text-[10px] font-mono bg-black/10 dark:bg-black/20">{counts.ADMIN}</span>
          </button>

          <button
            onClick={() => setRoleFilter("CLIENT")}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              roleFilter === "CLIENT" 
                ? "bg-emerald-600 text-white shadow-md shadow-emerald-500/20" 
                : "bg-warm-100/80 dark:bg-warm-800/50 text-warm-600 dark:text-warm-300 hover:bg-emerald-100 hover:text-emerald-800"
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>🛍️ Clientes</span>
            <span className="px-1.5 py-0.5 rounded-full text-[10px] font-mono bg-black/10 dark:bg-black/20">{counts.CLIENT}</span>
          </button>

          <button
            onClick={() => setRoleFilter("DELIVERY")}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              roleFilter === "DELIVERY" 
                ? "bg-orange-600 text-white shadow-md shadow-orange-500/20" 
                : "bg-warm-100/80 dark:bg-warm-800/50 text-warm-600 dark:text-warm-300 hover:bg-orange-100 hover:text-orange-800"
            }`}
          >
            <Truck className="w-3.5 h-3.5" />
            <span>🛵 Delivery</span>
            <span className="px-1.5 py-0.5 rounded-full text-[10px] font-mono bg-black/10 dark:bg-black/20">{counts.DELIVERY}</span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-warm-400" />
          <input
            type="text"
            placeholder="Buscar por nombre, email, DNI..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-warm-50 dark:bg-warm-800/60 border border-warm-200 dark:border-warm-700 rounded-2xl text-xs sm:text-sm text-warm-900 dark:text-white placeholder:text-warm-400 focus:outline-none focus:ring-2 focus:ring-sage-500 transition-all"
          />
        </div>

      </div>

      {/* Users Table */}
      <div className="bg-white dark:bg-warm-900/30 backdrop-blur-md border border-warm-200 dark:border-warm-800/50 rounded-3xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-warm-50/80 dark:bg-warm-800/30 border-b border-warm-200 dark:border-warm-800/50 text-xs uppercase tracking-wider font-semibold text-warm-500 dark:text-warm-400">
                <th className="px-6 py-4">Usuario / Contacto</th>
                <th className="px-6 py-4">Rol & Permisos</th>
                <th className="px-6 py-4 text-center">Actividad (Pedidos)</th>
                <th className="px-6 py-4">Fecha Registro</th>
                <th className="px-6 py-4 text-right">Acciones de Gestión</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-warm-100 dark:divide-warm-800/50 text-sm">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-warm-500 dark:text-warm-400">
                    No se encontraron usuarios o clientes con los filtros aplicados.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => {
                  const ordersCount = user._count?.orders || 0;
                  return (
                    <tr key={user.id} className="hover:bg-warm-50/50 dark:hover:bg-warm-800/10 transition-colors group">
                      
                      {/* Name & Email */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-sage-500/20 to-warm-500/20 dark:from-sage-800 dark:to-warm-800 flex items-center justify-center shrink-0 border border-warm-200 dark:border-warm-700 font-bold text-warm-800 dark:text-warm-200">
                            {user.avatarUrl ? (
                              <img src={user.avatarUrl} alt="" className="w-full h-full rounded-2xl object-cover" />
                            ) : (
                              <span>{user.name?.slice(0, 2).toUpperCase() || "SM"}</span>
                            )}
                          </div>
                          <div>
                            <span className="font-bold text-warm-900 dark:text-white block">{user.name}</span>
                            <span className="text-xs text-warm-500 dark:text-warm-400 block font-mono">{user.email}</span>
                            {user.phone && <span className="text-[11px] text-warm-400 font-mono block">📞 {user.phone}</span>}
                          </div>
                        </div>
                      </td>

                      {/* Role Badge */}
                      <td className="px-6 py-4">
                        {getRoleBadge(user.role)}
                      </td>

                      {/* Orders Count Activity */}
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-xl text-xs font-mono font-bold ${
                          ordersCount > 0 
                            ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800" 
                            : "bg-warm-50 dark:bg-warm-800/30 text-warm-400"
                        }`}>
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>{ordersCount} {ordersCount === 1 ? "pedido" : "pedidos"}</span>
                        </span>
                      </td>

                      {/* Registration Date */}
                      <td className="px-6 py-4 text-warm-600 dark:text-warm-400 text-xs font-mono">
                        {new Date(user.createdAt).toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </td>

                      {/* Management Actions */}
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          
                          {/* Switch Role Button */}
                          <button
                            onClick={() => {
                              setRoleModalUser(user);
                              setTargetRole(user.role === "ADMIN" ? "CLIENT" : "ADMIN");
                            }}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold bg-warm-100 hover:bg-purple-100 dark:bg-warm-800 dark:hover:bg-purple-900/50 text-warm-800 dark:text-warm-200 hover:text-purple-900 dark:hover:text-purple-300 transition-colors cursor-pointer border border-warm-200 dark:border-warm-700"
                            title="Modificar rol (Admin / Delivery / Cliente)"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>Cambiar Rol</span>
                          </button>

                          {/* Delete Button */}
                          <button
                            onClick={() => setDeleteModalUser(user)}
                            className="p-2 rounded-xl bg-red-50 hover:bg-red-500 dark:bg-red-500/10 dark:hover:bg-red-600 text-red-600 hover:text-white dark:text-red-400 dark:hover:text-white transition-colors cursor-pointer border border-red-200 dark:border-red-800/50"
                            title="Eliminar usuario del directorio"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>

                        </div>
                      </td>

                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal 1: Confirm Role Change */}
      {roleModalUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white dark:bg-warm-900 rounded-3xl max-w-md w-full p-6 sm:p-8 border border-warm-200 dark:border-warm-800 shadow-2xl space-y-6 animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 text-purple-600 dark:text-purple-400">
              <div className="p-3 bg-purple-50 dark:bg-purple-900/30 rounded-2xl">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-warm-900 dark:text-white">Modificar Permisos y Rol</h3>
                <p className="text-xs text-warm-500">Otorgar o revocar accesos en el sistema</p>
              </div>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-warm-700 dark:text-warm-300">
              <p>
                Estás configurando los permisos de <strong>{roleModalUser.name}</strong> (<span className="font-mono">{roleModalUser.email}</span>).
              </p>
              
              <div className="space-y-2 pt-2">
                <label className="text-xs font-bold uppercase tracking-wider text-warm-500 block">Selecciona el nuevo rol:</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setTargetRole("ADMIN")}
                    className={`p-3 rounded-2xl text-center text-xs font-bold border transition-all cursor-pointer ${
                      targetRole === "ADMIN" ? "bg-purple-600 text-white border-purple-600 shadow-md" : "bg-warm-50 dark:bg-warm-800 border-warm-200 text-warm-700 dark:text-warm-300"
                    }`}
                  >
                    🛡️ Admin
                  </button>
                  <button
                    type="button"
                    onClick={() => setTargetRole("DELIVERY")}
                    className={`p-3 rounded-2xl text-center text-xs font-bold border transition-all cursor-pointer ${
                      targetRole === "DELIVERY" ? "bg-orange-600 text-white border-orange-600 shadow-md" : "bg-warm-50 dark:bg-warm-800 border-warm-200 text-warm-700 dark:text-warm-300"
                    }`}
                  >
                    🛵 Delivery
                  </button>
                  <button
                    type="button"
                    onClick={() => setTargetRole("CLIENT")}
                    className={`p-3 rounded-2xl text-center text-xs font-bold border transition-all cursor-pointer ${
                      targetRole === "CLIENT" ? "bg-emerald-600 text-white border-emerald-600 shadow-md" : "bg-warm-50 dark:bg-warm-800 border-warm-200 text-warm-700 dark:text-warm-300"
                    }`}
                  >
                    🛍️ Cliente
                  </button>
                </div>
              </div>

              {targetRole === "ADMIN" && (
                <div className="p-3.5 rounded-2xl bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800 text-xs text-purple-800 dark:text-purple-300">
                  ⚠️ <strong>Atención:</strong> Un Administrador tiene control total para editar productos, ver pedidos, gestionar caja y cambiar roles en la tienda.
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-warm-200 dark:border-warm-800">
              <button
                onClick={() => setRoleModalUser(null)}
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-warm-100 dark:bg-warm-800 text-warm-700 dark:text-warm-300 hover:bg-warm-200 transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmRoleChange}
                disabled={isPending || targetRole === roleModalUser.role}
                className="px-6 py-2.5 rounded-xl text-xs font-bold bg-purple-600 hover:bg-purple-700 text-white transition-colors shadow-md active:scale-95 cursor-pointer disabled:opacity-50 flex items-center gap-2"
              >
                {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                <span>Guardar Rol</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 2: Confirm Delete User */}
      {deleteModalUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white dark:bg-warm-900 rounded-3xl max-w-md w-full p-6 sm:p-8 border border-warm-200 dark:border-warm-800 shadow-2xl space-y-6 animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 text-red-600">
              <div className="p-3 bg-red-50 dark:bg-red-900/30 rounded-2xl">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-warm-900 dark:text-white">¿Eliminar este Usuario?</h3>
                <p className="text-xs text-warm-500">Acción permanente del directorio CRM</p>
              </div>
            </div>

            <div className="space-y-3 text-xs sm:text-sm text-warm-700 dark:text-warm-300 leading-relaxed">
              <p>
                Estás a punto de eliminar el registro de <strong>{deleteModalUser.name}</strong> (<span className="font-mono">{deleteModalUser.email}</span>).
              </p>
              
              <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-xs text-amber-800 dark:text-amber-300">
                🛡️ <strong>Protección Contable:</strong> Si este cliente tiene pedidos en el historial, el sistema protegerá su registro para no afectar tus reportes de ventas ni auditoría fiscal.
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-warm-200 dark:border-warm-800">
              <button
                onClick={() => setDeleteModalUser(null)}
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-warm-100 dark:bg-warm-800 text-warm-700 dark:text-warm-300 hover:bg-warm-200 transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={isPending}
                className="px-6 py-2.5 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-700 text-white transition-colors shadow-md active:scale-95 cursor-pointer disabled:opacity-50 flex items-center gap-2"
              >
                {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                <span>🗑️ Sí, Eliminar</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
