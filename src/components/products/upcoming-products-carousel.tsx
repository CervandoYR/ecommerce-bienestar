import prisma from "@/lib/prisma";
import { ProductCard } from "@/components/products/product-card";
import { Sparkles } from "lucide-react";
import type { ProductWithCategory } from "@/types";

export async function UpcomingProductsCarousel() {
  let upcomingProducts: ProductWithCategory[] = [];
  try {
    const products = await prisma.product.findMany({
      where: {
        isActive: true,
        isComingSoon: true,
      },
      include: {
        category: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    upcomingProducts = JSON.parse(JSON.stringify(products));
  } catch (err) {
    console.warn("Error fetching upcoming products:", err);
    return null;
  }

  if (!upcomingProducts || upcomingProducts.length === 0) {
    return null;
  }

  return (
    <div className="mb-10 sm:mb-14 pt-4 border-b border-[#e8e6dd]/80 pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
        <div className="flex items-center gap-2.5">
          <Sparkles className="w-5 h-5 text-[#C5A059] animate-pulse shrink-0" />
          <h2 className="text-xl sm:text-2xl font-serif font-light text-[#2C402E] tracking-tight">
            PRÓXIMOS RITUALES: <span className="italic font-normal">Sé el primero en descubrirlos</span>
          </h2>
        </div>
        <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#C5A059] font-semibold">
          LANZAMIENTOS EXCLUSIVOS
        </span>
      </div>

      <div className="flex gap-4 sm:gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide [&::-webkit-scrollbar]:hidden -mx-4 px-4 sm:mx-0 sm:px-0">
        {upcomingProducts.map((product) => (
          <div
            key={product.id}
            className="w-[280px] sm:w-[310px] md:w-[330px] shrink-0 snap-start"
          >
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  );
}
