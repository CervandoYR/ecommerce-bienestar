import { SupplierForm } from "@/components/admin/supplier-form";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default function NuevoProveedorPage() {
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
        <h1 className="text-3xl font-bold text-warm-900 dark:text-white tracking-tight">Nuevo Proveedor</h1>
        <p className="text-warm-500 dark:text-warm-400 mt-1">Registra un nuevo distribuidor o artesano.</p>
      </div>

      <SupplierForm />
    </div>
  );
}
