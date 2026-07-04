import Link from "next/link";
import prisma from "@/lib/prisma";
import { ProductCarousel } from "@/components/products/product-carousel";
import { ArrowRight, Sparkles } from "lucide-react";
import type { ProductWithCategory } from "@/types";

export async function FeaturedProducts() {
  let featuredProducts: ProductWithCategory[] = [];
  try {
    const products = await prisma.product.findMany({
      where: {
        isActive: true,
        isComingSoon: false,
      },
      include: {
        category: true,
      },
      orderBy: [
        { isFeatured: "desc" },
        { createdAt: "desc" },
      ],
      take: 8,
    });

    featuredProducts = JSON.parse(JSON.stringify(products));
  } catch (err) {
    console.warn("Error fetching featured products:", err);
    return null;
  }

  if (!featuredProducts || featuredProducts.length === 0) {
    return null;
  }

  return (
    <section className="relative bg-[#FAF8F5] py-16 sm:py-24 px-4 overflow-hidden">
      {/* Decorative gradient orbs */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#C5A059]/5 rounded-full blur-3xl -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-[#2C402E]/5 rounded-full blur-3xl translate-y-1/2 pointer-events-none" />

      <div className="container-narrow relative z-10">
        {/* Editorial Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10 sm:mb-14">
          <div className="max-w-xl">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-[#C5A059]" />
              <span className="text-[10px] sm:text-xs font-mono uppercase tracking-[0.25em] text-[#C5A059] font-bold">
                SELECCIÓN CURADA
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-light text-[#2C402E] tracking-tight leading-tight">
              Rituales que <span className="italic font-normal">Transforman</span>
            </h2>
            <p className="text-sm sm:text-base text-[#5e574c] font-light mt-3 leading-relaxed max-w-md">
              Cada pieza en nuestra curaduría ha sido seleccionada para elevar tu bienestar. Descubre nuestros favoritos.
            </p>
          </div>

          <Link
            href="/productos"
            className="group inline-flex items-center gap-2.5 px-7 py-3 sm:px-8 sm:py-3.5 rounded-full bg-[#2C402E] text-[#FAF8F5] hover:bg-[#C5A059] transition-all duration-500 text-sm font-medium tracking-wide shadow-lg hover:shadow-xl self-start sm:self-auto shrink-0"
          >
            <span>Ver Colección Completa</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
        </div>

        {/* Embla Carousel con flechas y dots */}
        <ProductCarousel products={featuredProducts} />
      </div>
    </section>
  );
}

export default FeaturedProducts;
