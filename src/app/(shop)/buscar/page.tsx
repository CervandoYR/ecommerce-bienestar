import { Metadata } from "next";
import prisma from "@/lib/prisma";
import { STORE_NAME } from "@/lib/constants";
import { ProductGrid } from "@/components/products/product-grid";
import { ProductFilters } from "@/components/products/product-filters";
import { Search, Sparkles } from "lucide-react";
import type { ProductWithCategory } from "@/types";

interface SearchPageProps {
  searchParams: Promise<{
    q?: string;
    sortBy?: string;
    categorySlug?: string;
  }>;
}

export async function generateMetadata({ searchParams }: SearchPageProps): Promise<Metadata> {
  const params = await searchParams;
  const query = params?.q || "";
  return {
    title: query ? `Resultados para "${query}" | ${STORE_NAME}` : `Búsqueda de Productos | ${STORE_NAME}`,
    description: query ? `Resultados de búsqueda para ${query} en ${STORE_NAME}` : `Explora y busca productos de bienestar en ${STORE_NAME}`,
  };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const query = (params?.q || "").trim();
  const sortBy = params?.sortBy || "newest";
  const categorySlug = params?.categorySlug || "";

  let products: any[] = [];
  let recommendedProducts: any[] = [];
  
  try {
    // Determine sort ordering
    let orderBy: any = { createdAt: "desc" };
    if (sortBy === "price-asc") orderBy = { price: "asc" };
    if (sortBy === "price-desc") orderBy = { price: "desc" };
    if (sortBy === "name") orderBy = { name: "asc" };

    const where: any = {
      isActive: true,
    };

    if (categorySlug) {
      where.category = { slug: categorySlug };
    }

    if (query) {
      where.OR = [
        { name: { contains: query, mode: "insensitive" } },
        { description: { contains: query, mode: "insensitive" } },
      ];
    }

    if (query || categorySlug) {
      products = await prisma.product.findMany({
        where,
        include: {
          category: true,
        },
        orderBy,
      });
    }

    // Si no hay resultados o no se ha buscado nada, traer productos recomendados
    if (products.length === 0) {
      recommendedProducts = await prisma.product.findMany({
        where: { isActive: true },
        include: { category: true },
        take: 4,
        orderBy: { isFeatured: "desc" },
      });
    }
  } catch (e) {
    console.warn("Using fallback data due to DB error in search:", e);
  }

  return (
    <div className="bg-[#FAF8F5] min-h-screen py-12 lg:py-20 px-4">
      <div className="container-narrow">
        
        {/* Editorial Header */}
        <div className="mb-10 text-center max-w-3xl mx-auto border-b border-[#e8e6dd]/60 pb-8">
          <span className="text-[10px] sm:text-xs font-mono uppercase tracking-[0.2em] text-[#C5A059] block mb-2 font-bold flex items-center justify-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
            BÚSQUEDA & CURADURÍA
          </span>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-light text-[#2C402E] font-serif tracking-tight mb-3">
            {query ? (
              <>Resultados para <span className="italic font-normal">&ldquo;{query}&rdquo;</span></>
            ) : (
              <>Explora nuestra <span className="italic font-normal">Colección</span></>
            )}
          </h1>
          <p className="text-xs sm:text-sm md:text-base text-[#5e574c] font-light">
            {products.length > 0
              ? `${products.length} ${products.length === 1 ? "pieza encontrada" : "piezas botánicas encontradas"}`
              : query
              ? "No encontramos resultados exactos, pero hemos curado estas recomendaciones para ti."
              : "Encuentra aceites esenciales, difusores y rituales para tu santuario."}
          </p>
        </div>

        {/* Filters and Search Bar always accessible */}
        <ProductFilters />

        {/* Main Content Area */}
        <div className="mt-6 sm:mt-8">
          {products.length > 0 ? (
            <ProductGrid products={JSON.parse(JSON.stringify(products))} />
          ) : (
            <div className="text-center">
              {/* Empty State Premium */}
              <div className="mb-14 p-8 sm:p-12 bg-white/70 backdrop-blur-md rounded-3xl border border-[#e8e6dd] max-w-2xl mx-auto shadow-sm">
                <Search className="w-8 h-8 text-[#C5A059] mx-auto mb-4 opacity-80" />
                <h2 className="text-lg sm:text-2xl font-serif text-[#2C402E] mb-2 font-light">
                  {query ? (
                    <>No encontramos coincidencias para <strong className="font-normal italic">&ldquo;{query}&rdquo;</strong></>
                  ) : (
                    "Inicia tu búsqueda botánica"
                  )}
                </h2>
                <p className="text-xs sm:text-sm font-light text-[#5e574c] max-w-md mx-auto leading-relaxed">
                  {query
                    ? "Es posible que la pieza que buscas esté temporalmente agotada o registrada con otro nombre terapéutico."
                    : "Ingresa un término o selecciona una categoría arriba para descubrir nuestras piezas de bienestar."}
                </p>
              </div>

              {/* Productos Recomendados (Para no perder la venta) */}
              {recommendedProducts.length > 0 && (
                <div className="mt-16 text-left border-t border-[#e8e6dd]/60 pt-12">
                  <div className="text-center mb-10">
                    <span className="text-[10px] sm:text-xs font-mono uppercase tracking-[0.25em] text-[#C5A059] block mb-2 font-bold">
                      SELECCIÓN EXCLUSIVA
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-serif text-[#2C402E] font-light">
                      Nuestras Piezas <span className="italic font-normal">Más Recomendadas</span>
                    </h3>
                  </div>
                  <ProductGrid products={JSON.parse(JSON.stringify(recommendedProducts))} />
                </div>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
