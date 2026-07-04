import { HeroSection } from "@/components/home/hero-section";
import { TransformationBento } from "@/components/home/transformation-bento";
import { CuratedSelection } from "@/components/home/curated-selection";
import { PurposeSection } from "@/components/home/purpose-section";
import { TrustBadges } from "@/components/home/trust-badges";
import { getStoreSettings } from "@/app/actions/settings";

export default async function HomePage() {
  const { data: settings } = await getStoreSettings();

  return (
    <div className="bg-[#FAF8F5] min-h-screen text-[#2C402E]">
      <HeroSection 
        settings={settings}
        title={settings?.heroTitle} 
        subtitle={settings?.heroSubtitle} 
        imageUrl={settings?.heroImageUrl} 
      />
      <TransformationBento settings={settings} />
      <CuratedSelection settings={settings} />
      <PurposeSection settings={settings} />
      <TrustBadges settings={settings} />
    </div>
  );
}
