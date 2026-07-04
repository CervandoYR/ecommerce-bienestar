import { Suspense } from "react";
import { Metadata } from "next";
import { ProductGrid } from "@/components/products/product-grid";
import { ProductFilters } from "@/components/products/product-filters";
import { UpcomingProductsCarousel } from "@/components/products/upcoming-products-carousel";
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

  if (categorySlug === "proximamente") {
    where.isComingSoon = true;
  } else if (categorySlug) {
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
    return JSON.parse(JSON.stringify(products)) as ProductWithCategory[];
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
    <div className="bg-[#FAF8F5] min-h-screen pb-16">
      
      {/* Editorial Header (Margen optimizado y Copy Emocional) */}
      <div className="relative bg-[#FAF8F5] pt-14 sm:pt-20 pb-6 sm:pb-8 px-4 border-b border-[#e8e6dd]/60">
        <div className="container-narrow relative z-10 text-center">
          <span className="text-[10px] sm:text-xs font-mono uppercase tracking-[0.2em] text-[#C5A059] block mb-1.5 font-bold">
            CURADURÍA BOTÁNICA & TERAPÉUTICA
          </span>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-light text-[#2C402E] font-serif tracking-tight mb-2 sm:mb-3 leading-tight">
            Nuestra Colección de <span className="italic font-normal">Calma y Relajación</span>
          </h1>
          <p className="text-xs sm:text-sm md:text-base text-[#5e574c] max-w-xl mx-auto font-light leading-relaxed">
            Herramientas esenciales diseñadas para apagar el ruido diario, restaurar tu energía y elevar el santuario de tu hogar.
          </p>
        </div>
      </div>

      <div className="container-narrow mt-6 sm:mt-8 px-4 sm:px-6">
        {/* Dynamic Coming Soon Carousel */}
        <Suspense fallback={null}>
          <UpcomingProductsCarousel />
        </Suspense>

        {/* Horizontal Filters */}
        <ProductFilters />

        {/* Product Grid */}
        <div className="w-full">
          <div className="mb-6 flex items-center justify-between border-b border-[#e8e6dd]/80 pb-3">
            <span className="text-xs font-mono font-medium text-[#5e574c] uppercase tracking-wider">
              Mostrando <strong className="text-[#2C402E] font-bold">{products.length}</strong> rituales
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
