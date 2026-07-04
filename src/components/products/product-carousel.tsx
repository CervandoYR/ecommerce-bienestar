"use client";

import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { ProductCard } from "@/components/products/product-card";
import type { ProductWithCategory } from "@/types";

interface ProductCarouselProps {
  products: ProductWithCategory[];
}

export function ProductCarousel({ products }: ProductCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    loop: false,
    skipSnaps: false,
    slidesToScroll: 1,
    breakpoints: {
      "(min-width: 768px)": { slidesToScroll: 2 },
      "(min-width: 1024px)": { slidesToScroll: 3 },
    },
  });

  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
  const scrollTo = useCallback((index: number) => emblaApi?.scrollTo(index), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    setScrollSnaps(emblaApi.scrollSnapList());
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    onSelect();
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  return (
    <div className="relative group/carousel">
      {/* Carousel viewport */}
      <div ref={emblaRef} className="overflow-hidden -mx-2 sm:-mx-3">
        <div className="flex">
          {products.map((product, idx) => (
            <div
              key={product.id}
              className="flex-[0_0_75%] min-w-0 sm:flex-[0_0_45%] md:flex-[0_0_33.33%] lg:flex-[0_0_25%] px-2 sm:px-3"
            >
              <ProductCard product={product} isPriority={idx < 4} />
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Arrows — visibles en hover en desktop */}
      <button
        onClick={scrollPrev}
        disabled={!canScrollPrev}
        aria-label="Anterior"
        className={cn(
          "absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 z-20",
          "w-11 h-11 sm:w-12 sm:h-12 rounded-full",
          "bg-white/95 backdrop-blur-sm border border-[#e8e6dd] shadow-lg",
          "flex items-center justify-center",
          "text-[#2C402E] hover:bg-[#2C402E] hover:text-[#FAF8F5] hover:border-[#2C402E]",
          "transition-all duration-300 cursor-pointer",
          "opacity-0 group-hover/carousel:opacity-100",
          "disabled:opacity-0 disabled:pointer-events-none"
        )}
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <button
        onClick={scrollNext}
        disabled={!canScrollNext}
        aria-label="Siguiente"
        className={cn(
          "absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 z-20",
          "w-11 h-11 sm:w-12 sm:h-12 rounded-full",
          "bg-white/95 backdrop-blur-sm border border-[#e8e6dd] shadow-lg",
          "flex items-center justify-center",
          "text-[#2C402E] hover:bg-[#2C402E] hover:text-[#FAF8F5] hover:border-[#2C402E]",
          "transition-all duration-300 cursor-pointer",
          "opacity-0 group-hover/carousel:opacity-100",
          "disabled:opacity-0 disabled:pointer-events-none"
        )}
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Dot indicators */}
      {scrollSnaps.length > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8">
          {scrollSnaps.map((_, index) => (
            <button
              key={index}
              onClick={() => scrollTo(index)}
              aria-label={`Ir a grupo ${index + 1}`}
              className={cn(
                "rounded-full transition-all duration-300 cursor-pointer",
                selectedIndex === index
                  ? "w-7 h-2 bg-[#C5A059]"
                  : "w-2 h-2 bg-[#2C402E]/20 hover:bg-[#2C402E]/40"
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}
