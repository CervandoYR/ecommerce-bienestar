import prisma from "@/lib/prisma";
import { ProductCarousel } from "@/components/products/product-carousel";
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
    <div className="mt-16 sm:mt-20 pt-10 sm:pt-14 pb-4 border-t border-[#e8e6dd] bg-gradient-to-b from-white/40 to-transparent rounded-t-3xl">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-[#C5A059] animate-pulse shrink-0" />
            <span className="text-[10px] sm:text-xs font-mono uppercase tracking-[0.2em] text-[#C5A059] font-bold">
              LANZAMIENTOS EXCLUSIVOS
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-light text-[#2C402E] tracking-tight">
            Próximos Rituales: <span className="italic font-normal">Sé el primero en descubrirlos</span>
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-[#5e574c] font-light max-w-sm">
          Piezas botánicas que están por llegar a nuestra curaduría. Regístrate para ser notificado.
        </p>
      </div>

      <ProductCarousel products={upcomingProducts} />
    </div>
  );
}
