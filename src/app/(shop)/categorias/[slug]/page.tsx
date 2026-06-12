import { Metadata } from "next";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { STORE_NAME, STORE_URL } from "@/lib/constants";
import { ProductGrid } from "@/components/products/product-grid";
import { ProductFilters } from "@/components/products/product-filters";

export const dynamic = "force-dynamic";

export async function generateMetadata(
  props: {
    params: Promise<{ slug: string }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
  }
): Promise<Metadata> {
  const params = await props.params;
  let category;
  try {
    category = await prisma.category.findUnique({
      where: { slug: params.slug },
    });
  } catch (e) {
    console.warn("DB not ready for generateMetadata", e);
  }

  if (!category) {
    return {
      title: `Categoría no encontrada | ${STORE_NAME}`,
    };
  }

  return {
    title: `${category.name} | ${STORE_NAME}`,
    description: category.description || `Explora nuestra selección de ${category.name} en ${STORE_NAME}`,
    openGraph: {
      title: `${category.name} | ${STORE_NAME}`,
      description: category.description || `Explora nuestra selección de ${category.name} en ${STORE_NAME}`,
      url: `${STORE_URL}/categorias/${category.slug}`,
    },
  };
}

export default async function CategoryPage(
  props: {
    params: Promise<{ slug: string }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
  }
) {
  const searchParams = await props.searchParams;
  const params = await props.params;

  let category;
  let products: any[] = [];
  
  try {
    category = await prisma.category.findUnique({
      where: { slug: params.slug },
    });

    if (!category) {
      notFound();
    }

    // Determine sort ordering
    let orderBy: any = { createdAt: "desc" };
    if (searchParams.sortBy === "price-asc") orderBy = { price: "asc" };
    if (searchParams.sortBy === "price-desc") orderBy = { price: "desc" };
    if (searchParams.sortBy === "name") orderBy = { name: "asc" };

    products = await prisma.product.findMany({
      where: {
        categoryId: category.id,
        isActive: true,
      },
      include: {
        category: true,
      },
      orderBy,
    });
  } catch (e) {
    console.warn("Using mock data due to missing DB connection");
  }

  if (!category) {
    return notFound();
  }

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
          <span className="inline-flex items-center gap-2 text-gold-400 text-sm font-semibold uppercase tracking-widest mb-4">
            Categoría
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight">
            {category.name}
          </h1>
          {category.description && (
            <p className="text-lg md:text-xl text-warm-300 max-w-2xl mx-auto font-light">
              {category.description}
            </p>
          )}
        </div>
      </div>

      <div className="container-narrow mt-10">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          <aside className="w-full lg:w-72 shrink-0">
            <ProductFilters />
          </aside>

          <main className="flex-1 w-full">
            <div className="mb-6 flex items-center justify-between bg-white px-6 py-4 rounded-2xl border border-warm-200 shadow-sm">
              <span className="text-sm font-medium text-warm-600">
                Mostrando <strong className="text-warm-900">{products.length}</strong> productos
              </span>
            </div>
            <ProductGrid products={products} />
          </main>
        </div>
      </div>
    </div>
  );
}
