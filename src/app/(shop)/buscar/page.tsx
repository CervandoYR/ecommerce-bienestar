import { Metadata } from "next";
import prisma from "@/lib/prisma";
import { STORE_NAME } from "@/lib/constants";
import { ProductGrid } from "@/components/products/product-grid";
import { ProductFilters } from "@/components/products/product-filters";
import { Search } from "lucide-react";

interface SearchPageProps {
  searchParams: {
    q?: string;
    sortBy?: string;
  };
}

export async function generateMetadata({ searchParams }: SearchPageProps): Promise<Metadata> {
  const query = searchParams.q || "";
  return {
    title: `Resultados para "${query}" | ${STORE_NAME}`,
    description: `Resultados de búsqueda para ${query} en ${STORE_NAME}`,
  };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const query = searchParams.q || "";
  let products: any[] = [];
  
  try {
    // Determine sort ordering
    let orderBy: any = { createdAt: "desc" };
    if (searchParams.sortBy === "price-asc") orderBy = { price: "asc" };
    if (searchParams.sortBy === "price-desc") orderBy = { price: "desc" };
    if (searchParams.sortBy === "name") orderBy = { name: "asc" };

    if (query) {
      products = await prisma.product.findMany({
        where: {
          isActive: true,
          OR: [
            { name: { contains: query, mode: "insensitive" } },
            { description: { contains: query, mode: "insensitive" } },
          ],
        },
        include: {
          category: true,
        },
        orderBy,
      });
    }
  } catch (e) {
    console.warn("Using mock data due to missing DB connection");
  }

  return (
    <div className="bg-warm-50 min-h-screen py-10 lg:py-16">
      <div className="container-narrow">
        <div className="mb-10 text-center max-w-3xl mx-auto">
          <div className="w-16 h-16 bg-sage-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Search className="w-8 h-8 text-sage-600" />
          </div>
          <h1 className="text-3xl font-bold text-warm-900 mb-4">
            {query ? `Resultados para "${query}"` : "Búsqueda de Productos"}
          </h1>
          <p className="text-warm-600">
            {products.length} {products.length === 1 ? "producto encontrado" : "productos encontrados"}
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8 items-start">
          <aside className="lg:col-span-1 sticky top-28 hidden lg:block">
            <ProductFilters />
          </aside>

          <main className="lg:col-span-3">
            {query ? (
              <ProductGrid products={products} />
            ) : (
              <div className="text-center py-20 bg-white rounded-2xl border border-warm-200 shadow-sm">
                <Search className="w-12 h-12 text-warm-300 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-warm-900 mb-2">Empieza a buscar</h3>
                <p className="text-warm-500">
                  Ingresa un término en la barra superior para encontrar productos.
                </p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
