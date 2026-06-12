"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

// Typically passed as props or fetched
const CATEGORIES = [
  { label: "Todos", value: "" },
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

  const handleFilterChange = (name: string, value: string) => {
    router.push(`${pathname}?${createQueryString(name, value)}`, { scroll: false });
  };

  const currentCategory = searchParams.get("categorySlug") || "";
  const currentSort = searchParams.get("sortBy") || "newest";

  return (
    <div className={cn("w-full mb-10 flex flex-col md:flex-row gap-6 items-start md:items-center justify-between", className)}>
      
      {/* Category Pills */}
      <div className="flex-1 w-full overflow-x-auto pb-2 scrollbar-hide">
        <div className="flex gap-2">
          {CATEGORIES.map((category) => {
            const isActive = currentCategory === category.value;
            return (
              <button
                key={category.value}
                onClick={() => handleFilterChange("categorySlug", category.value)}
                className={cn(
                  "whitespace-nowrap px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300",
                  isActive
                    ? "bg-warm-900 text-white shadow-md"
                    : "bg-white text-warm-600 border border-warm-200 hover:border-warm-300 hover:bg-warm-50"
                )}
              >
                {category.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Sort Dropdown */}
      <div className="shrink-0 flex items-center gap-3 w-full md:w-auto">
        <span className="text-sm font-medium text-warm-500 uppercase tracking-wider hidden md:inline-block">
          Ordenar:
        </span>
        <select
          value={currentSort}
          onChange={(e) => handleFilterChange("sortBy", e.target.value)}
          className="w-full md:w-auto bg-white border border-warm-200 text-warm-900 text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-sage-500 cursor-pointer appearance-none"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

    </div>
  );
}

export default ProductFilters;
