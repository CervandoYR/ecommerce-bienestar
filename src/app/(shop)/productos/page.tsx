import { Suspense } from "react";
import { Metadata } from "next";
import { ProductGrid } from "@/components/products/product-grid";
import { ProductFilters } from "@/components/products/product-filters";
import prisma from "@/lib/prisma";
import type { ProductWithCategory } from "@/types";

export const dynamic = "force-dynamic";

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
      
      {/* Minimal Header */}
      <div className="relative bg-stone-50 pt-24 pb-12 px-4 border-b border-warm-100">
        <div className="container-narrow relative z-10 text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-warm-900 font-serif tracking-wide mb-4">
            Catálogo de <span className="italic font-light">Productos</span>
          </h1>
          <p className="text-base md:text-lg text-warm-500 max-w-2xl mx-auto font-light">
            Descubre nuestra colección premium de bienestar. Encuentra el balance perfecto para tu día a día.
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
