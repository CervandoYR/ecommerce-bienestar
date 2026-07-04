"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useDebounce } from "@/hooks/use-debounce";

// Typically passed as props or fetched
const CATEGORIES = [
  { label: "Todos", value: "" },
  { label: "Próximamente", value: "proximamente" },
  { label: "Aromaterapia", value: "aromaterapia" },
  { label: "Velas & Inciensos", value: "velas-inciensos" },
  { label: "Cuidado Corporal", value: "cuidado-corporal" },
  { label: "Meditación & Yoga", value: "meditacion-yoga" },
];

const SORT_OPTIONS = [
  { label: "Más recientes", value: "newest" },
  { label: "Precio: Menor a Mayor", value: "price-asc" },
  { label: "Precio: Mayor a Menor", value: "price-desc" },
  { label: "Nombre: A - Z", value: "name" },
];

interface ProductFiltersProps {
  className?: string;
}

export function ProductFilters({ className }: ProductFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const debouncedSearch = useDebounce(searchQuery, 350);
  const isFirstRender = useRef(true);

  const createQueryString = (name: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(name, value);
    } else {
      params.delete(name);
    }
    params.delete("page");
    return params.toString();
  };

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    const currentQ = searchParams.get("q") || "";
    if (debouncedSearch !== currentQ) {
      router.push(`${pathname}?${createQueryString("q", debouncedSearch)}`, { scroll: false });
    }
  }, [debouncedSearch]);

  const handleFilterChange = (name: string, value: string) => {
    router.push(`${pathname}?${createQueryString(name, value)}`, { scroll: false });
  };

  const currentCategory = searchParams.get("categorySlug") || "";
  const currentSort = searchParams.get("sortBy") || "newest";

  return (
    <div className={cn("w-full mb-6 sm:mb-8 flex flex-col gap-4 sm:gap-6", className)}>
      
      {/* Fila 1: Category Pills (alineadas a la izquierda sin scrollbar visible) */}
      <div className="w-full overflow-x-auto pb-1.5 scrollbar-hide flex-nowrap [&::-webkit-scrollbar]:hidden">
        <div className="flex gap-2 items-center flex-nowrap">
          {CATEGORIES.map((category) => {
            const isActive = currentCategory === category.value;
            return (
              <button
                key={category.value}
                onClick={() => handleFilterChange("categorySlug", category.value)}
                className={cn(
                  "whitespace-nowrap px-5 py-2 sm:px-6 sm:py-2.5 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 border cursor-pointer select-none shrink-0",
                  isActive
                    ? "bg-[#2C402E] text-[#FAF8F5] border-[#2C402E] shadow-md shadow-[#2C402E]/15 font-semibold"
                    : "bg-[#F5F2EB]/60 text-[#2C402E]/80 border-[#e8e6dd] hover:bg-white hover:border-[#C5A059]/60 hover:text-[#2C402E]"
                )}
              >
                {category.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Fila 2: Search Input (izquierda) and Sort Dropdown (derecha) */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 w-full">
        {/* Minimalist Search Bar */}
        <div className="relative group w-full sm:w-72 md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#C5A059] group-focus-within:text-[#2C402E] transition-colors" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filtrar por nombre o beneficio..."
            className="w-full bg-[#FAF8F5]/80 sm:bg-white/80 border border-[#e8e6dd] text-[#2C402E] placeholder:text-[#2C402E]/40 text-xs sm:text-sm rounded-full pl-9 pr-8 py-2 sm:py-2.5 focus:outline-none focus:ring-2 focus:ring-[#C5A059]/40 focus:border-[#C5A059] transition-all shadow-sm"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              aria-label="Limpiar filtro"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#2C402E]/40 hover:text-[#2C402E] transition-colors cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center justify-end gap-2 shrink-0">
          <span className="text-xs font-mono font-semibold text-[#5e574c] uppercase tracking-wider hidden sm:inline-block whitespace-nowrap">
            Ordenar:
          </span>
          <select
            value={currentSort}
            onChange={(e) => handleFilterChange("sortBy", e.target.value)}
            className="w-full sm:w-auto bg-[#F5F2EB]/40 border border-[#e8e6dd] text-[#2C402E] font-medium text-xs sm:text-sm rounded-xl px-4 py-2 sm:py-2.5 focus:outline-none focus:ring-2 focus:ring-[#C5A059]/50 focus:border-[#C5A059] cursor-pointer appearance-none shadow-sm"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

    </div>
  );
}

export default ProductFilters;
