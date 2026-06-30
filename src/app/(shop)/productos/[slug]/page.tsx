import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, ShieldCheck, Truck, RefreshCw, Star } from "lucide-react";
import prisma from "@/lib/prisma";
import { ProductGallery } from "@/components/products/product-gallery";
import { ProductActions } from "@/components/products/product-actions";
import { formatPrice, getDiscountPercentage } from "@/lib/utils";
import { Accordion } from "@/components/ui/accordion";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const params = await props.params;
  const product = await prisma.product.findUnique({
    where: { slug: params.slug, isActive: true },
    select: { name: true, description: true, images: true },
  });

  if (!product) return {};

  return {
    title: `${product.name} | Bienestar Store`,
    description: product.description,
    openGraph: {
      title: `${product.name} | Bienestar Store`,
      description: product.description,
      images: product.images && product.images.length > 0 ? [{ url: product.images[0] }] : [],
    }
  };
}

export async function generateStaticParams() {
  try {
    const products = await prisma.product.findMany({
      where: { isActive: true },
      select: { slug: true },
    });

    return products.map((p) => ({ slug: p.slug }));
  } catch (error) {
    console.warn("Failed to generate static params:", error);
    return [];
  }
}

export default async function ProductDetailPage(props: PageProps) {
  const params = await props.params;

  const product = await prisma.product.findUnique({
    where: { slug: params.slug, isActive: true },
    include: {
      category: true,
    },
  });

  if (!product) {
    notFound();
  }

  const discount = product.compareAtPrice
    ? getDiscountPercentage(product.price, product.compareAtPrice)
    : 0;
  
  const isOutOfStock = product.stock <= 0;

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://bienestarstore.pe';
  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: product.name,
      image: product.images || [],
      description: product.description,
      sku: product.sku,
      offers: {
        '@type': 'Offer',
        url: `${siteUrl}/productos/${product.slug}`,
        priceCurrency: 'PEN',
        price: product.price.toString(),
        availability: product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      }
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Inicio', item: siteUrl },
        { '@type': 'ListItem', position: 2, name: 'Productos', item: `${siteUrl}/productos` },
        { '@type': 'ListItem', position: 3, name: product.category.name, item: `${siteUrl}/categorias/${product.category.slug}` },
        { '@type': 'ListItem', position: 4, name: product.name, item: `${siteUrl}/productos/${product.slug}` }
      ]
    }
  ];

  return (
    <div className="bg-white min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="container-narrow pt-6 pb-20">
        
        {/* Breadcrumbs */}
        <nav className="flex items-center text-xs md:text-sm text-warm-500 mb-8 font-medium">
          <Link href="/" className="hover:text-sage-600 transition-colors">Inicio</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-warm-300" />
          <Link href="/productos" className="hover:text-sage-600 transition-colors">Productos</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-warm-300" />
          <Link href={`/categorias/${product.category.slug}`} className="hover:text-sage-600 transition-colors">
            {product.category.name}
          </Link>
        </nav>

        <div className="flex flex-col lg:flex-row gap-12 xl:gap-20">
          
          {/* Left Column: Gallery (Sticky on Desktop) */}
          <div className="w-full lg:w-3/5 xl:w-1/2">
            <div className="lg:sticky lg:top-28">
              <ProductGallery images={product.images || []} productName={product.name} />
            </div>
          </div>

          {/* Right Column: Product Info */}
          <div className="w-full lg:w-2/5 xl:w-1/2 flex flex-col pt-4 lg:pt-10">
            <Link 
              href={`/categorias/${product.category.slug}`}
              className="text-xs md:text-sm font-bold tracking-widest uppercase text-sage-600 mb-4 block w-fit hover:text-sage-700"
            >
              {product.category.name}
            </Link>
            
            <h1 className="text-4xl md:text-5xl font-bold text-warm-900 mb-6 leading-[1.1] tracking-tight">
              {product.name}
            </h1>

            {/* Reviews summary mockup */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="w-4 h-4 fill-gold-400 text-gold-400" />
                ))}
              </div>
              <span className="text-sm text-warm-500 font-medium">4.9 (128 reseñas)</span>
            </div>

            {/* Price Area */}
            <div className="flex items-center gap-4 mb-8">
              <span className="text-3xl md:text-4xl font-bold text-warm-900">
                {formatPrice(product.price)}
              </span>
              {product.compareAtPrice && product.compareAtPrice > product.price && (
                <>
                  <span className="text-lg md:text-xl text-warm-400 line-through">
                    {formatPrice(product.compareAtPrice)}
                  </span>
                  <span className="px-3 py-1 text-xs font-bold bg-sage-600 text-white rounded-full">
                    Ahorras {discount}%
                  </span>
                </>
              )}
            </div>

            {/* Description */}
            <div className="prose prose-sage prose-p:text-warm-600 mb-10 max-w-none font-light leading-relaxed">
              <p>{product.description}</p>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-6 mb-12 bg-warm-50 p-6 md:p-8 rounded-[2rem] border border-warm-100">
              <ProductActions product={product} isOutOfStock={isOutOfStock} />
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-warm-500 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                  Stock: <strong className="text-warm-900 font-semibold">{product.stock}</strong> u.
                </span>
                <span className="text-sage-700 font-semibold flex items-center gap-1">
                  <Truck className="w-4 h-4" /> Envío a nivel nacional
                </span>
              </div>
            </div>

            {/* Accordions */}
            <div className="border-t border-warm-200 pt-6">
              <Accordion 
                multiple={false}
                items={[
                  {
                    id: "details",
                    trigger: <span className="text-base font-bold text-warm-900 py-2">Detalles del Producto</span>,
                    content: "Todos nuestros productos son elaborados con ingredientes de la más alta calidad, libres de crueldad animal y parabenos. Priorizamos el comercio justo y el embalaje sostenible.",
                  },
                  {
                    id: "usage",
                    trigger: <span className="text-base font-bold text-warm-900 py-2">Modo de Uso</span>,
                    content: "Aplica la cantidad deseada y masajea suavemente. Para mejores resultados en aromaterapia, úsalo en momentos de tranquilidad y acompáñalo con ejercicios de respiración profunda.",
                  },
                  {
                    id: "shipping",
                    trigger: <span className="text-base font-bold text-warm-900 py-2">Envíos y Devoluciones</span>,
                    content: (
                      <div className="space-y-4">
                        <div className="flex items-start gap-3">
                          <Truck className="w-5 h-5 text-sage-500 shrink-0 mt-0.5" />
                          <p>Entregas en 24-48h para Lima. Envíos a provincias de 3 a 5 días hábiles vía Olva Courier.</p>
                        </div>
                        <div className="flex items-start gap-3">
                          <RefreshCw className="w-5 h-5 text-sage-500 shrink-0 mt-0.5" />
                          <p>Aceptamos devoluciones dentro de los 7 días de recibido el producto si se encuentra en su empaque original sellado.</p>
                        </div>
                      </div>
                    ),
                  }
                ]} 
              />
            </div>
            
            {/* Safe Checkout Badges */}
            <div className="mt-12 p-6 bg-warm-50 rounded-2xl border border-warm-100">
              <div className="flex items-center gap-3 mb-4">
                <ShieldCheck className="w-6 h-6 text-sage-600" />
                <h4 className="text-sm font-bold text-warm-900 uppercase tracking-wider">Checkout Seguro</h4>
              </div>
              <p className="text-xs text-warm-500 mb-4">Tus datos están protegidos con encriptación de 256 bits. Aceptamos pagos con tarjeta y Yape.</p>
              <div className="flex gap-2">
                <div className="w-12 h-8 bg-white rounded border border-warm-200 flex items-center justify-center text-[10px] font-bold text-warm-400">VISA</div>
                <div className="w-12 h-8 bg-white rounded border border-warm-200 flex items-center justify-center text-[10px] font-bold text-warm-400">MC</div>
                <div className="w-12 h-8 bg-white rounded border border-warm-200 flex items-center justify-center text-[10px] font-bold text-warm-400">YAPE</div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
