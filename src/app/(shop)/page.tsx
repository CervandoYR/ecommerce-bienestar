import { HeroSection } from "@/components/home/hero-section";
import { FeaturedProducts } from "@/components/home/featured-products";
import { getStoreSettings } from "@/app/actions/settings";
import { CategoriesShowcase } from "@/components/home/categories-showcase";
import { PurposeSection } from "@/components/home/purpose-section";
import { TrustBadges } from "@/components/home/trust-badges";
import { Testimonials } from "@/components/home/testimonials";

export default async function HomePage() {
  const { data: settings } = await getStoreSettings();

  return (
    <>
      <HeroSection 
        title={settings?.heroTitle} 
        subtitle={settings?.heroSubtitle} 
        imageUrl={settings?.heroImageUrl} 
      />
      <FeaturedProducts />
      <CategoriesShowcase />
      <PurposeSection />
      <TrustBadges />
      <Testimonials />
    </>
  );
}
