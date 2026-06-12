import { Suspense } from "react";
import { Metadata } from "next";
import { ProductGrid } from "@/components/products/product-grid";
import { ProductFilters } from "@/components/products/product-filters";
import prisma from "@/lib/prisma";
import type { ProductWithCategory } from "@/types";

export const metadata: Metadata = {
  title: "Catálogo de Productos | Bienestar Store",
  description: "Explora nuestra selección premium de productos de bienestar y relajación.",
};

async function getProducts(searchParams: { [key: string]: string | string[] | undefined }) {
  const categorySlug = searchParams.categorySlug as string;
  const sortBy = searchParams.sortBy as string;
  const q = searchParams.q as string;

  const where: any = {
    isActive: true,
  };

  if (categorySlug) {
    where.category = { slug: categorySlug };
  }

  if (q) {
    where.OR = [
      { name: { contains: q, mode: "insensitive" } },
      { description: { contains: q, mode: "insensitive" } },
    ];
  }

  let orderBy: any = { createdAt: "desc" };
  if (sortBy === "price-asc") orderBy = { price: "asc" };
  if (sortBy === "price-desc") orderBy = { price: "desc" };
  if (sortBy === "name") orderBy = { name: "asc" };

  try {
    const products = await prisma.product.findMany({
      where,
      orderBy,
      include: {
        category: true,
      },
    });
    return products as ProductWithCategory[];
  } catch (error) {
    console.warn("Failed to fetch products:", error);
    return [];
  }
}

export default async function CatalogPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const products = await getProducts(params);

  return (
    <div className="bg-warm-50 min-h-screen pb-16">
      
      {/* Premium Header */}
      <div className="relative bg-warm-900 pt-32 pb-20 px-4 overflow-hidden">
        {/* Background Decorations */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-[-50%] left-[-10%] w-[60%] h-[100%] rounded-full bg-sage-900/30 blur-[100px]" />
          <div className="absolute bottom-[-50%] right-[-10%] w-[60%] h-[100%] rounded-full bg-gold-900/20 blur-[100px]" />
        </div>
        
        <div className="container-narrow relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight">
            Colección <span className="text-sage-400 italic font-light">Completa</span>
          </h1>
          <p className="text-lg md:text-xl text-warm-300 max-w-2xl mx-auto font-light">
            Encuentra todo lo que necesitas para tu rutina de bienestar. Desde aceites esenciales hasta accesorios de meditación, cuidadosamente seleccionados para ti.
          </p>
        </div>
      </div>

      <div className="container-narrow mt-12">
        {/* Horizontal Filters */}
        <ProductFilters />

        {/* Product Grid */}
        <div className="w-full">
          <div className="mb-8 flex items-center justify-between border-b border-warm-200 pb-4">
            <span className="text-sm font-medium text-warm-500 uppercase tracking-wider">
              Mostrando <strong className="text-warm-900">{products.length}</strong> productos
            </span>
          </div>

          <Suspense fallback={<ProductGrid isLoading products={[]} />}>
            <ProductGrid products={products} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
