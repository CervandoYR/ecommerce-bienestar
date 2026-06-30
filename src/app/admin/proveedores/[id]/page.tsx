import { SupplierForm } from "@/components/admin/supplier-form";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";

export default async function EditarProveedorPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const supplier = await prisma.supplier.findUnique({
    where: { id: resolvedParams.id }
  });

  if (!supplier) {
    notFound();
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <div>
        <Link 
          href="/admin/proveedores" 
          className="inline-flex items-center text-sm text-warm-500 hover:text-sage-600 transition-colors mb-4 group"
        >
          <ChevronLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />
          Volver a Proveedores
        </Link>
        <h1 className="text-3xl font-bold text-warm-900 dark:text-white tracking-tight">Editar Proveedor</h1>
        <p className="text-warm-500 dark:text-warm-400 mt-1">Modifica los datos de contacto y enlace.</p>
      </div>

      <SupplierForm initialData={supplier} />
    </div>
  );
}
