import { ClientsTableClient } from "@/components/admin/clients-table-client";
import { ArcoTableClient } from "@/components/admin/arco-table-client";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function ClientesPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
  });

  const arcoRequests = await prisma.arcoRequest.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      user: true,
    }
  });

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      <div>
        <h1 className="text-3xl font-bold text-warm-900 dark:text-white tracking-tight">Clientes y Privacidad</h1>
        <p className="text-warm-500 dark:text-warm-400 mt-1">Directorio de usuarios y gestión de solicitudes ARCO.</p>
      </div>

      <ClientsTableClient users={users} />
      
      <hr className="border-warm-200 dark:border-warm-800" />
      
      <ArcoTableClient initialRequests={arcoRequests} />
    </div>
  );
}
