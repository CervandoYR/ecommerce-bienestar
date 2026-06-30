import { CategoryForm } from "@/components/admin/category-form";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default function NuevaCategoriaPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <div>
        <Link 
          href="/admin/categorias" 
          className="inline-flex items-center text-sm text-warm-500 hover:text-sage-600 transition-colors mb-4 group"
        >
          <ChevronLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />
          Volver a Categorías
        </Link>
        <h1 className="text-3xl font-bold text-warm-900 dark:text-white tracking-tight">Nueva Categoría</h1>
        <p className="text-warm-500 dark:text-warm-400 mt-1">Crea una nueva colección de productos.</p>
      </div>

      <CategoryForm />
    </div>
  );
}
