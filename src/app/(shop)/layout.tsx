import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { PromoModal } from "@/components/ui/promo-modal";
import { getStoreSettings } from "@/app/actions/settings";

export default async function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: settings } = await getStoreSettings();

  return (
    <>
      <Header />
      <main className="flex-1">{children}</main>
      <CartDrawer />
      <Footer />
      {settings && (
        <PromoModal 
          active={settings.promoModalActive}
          image={settings.promoModalImage}
          title={settings.promoModalTitle}
          text={settings.promoModalText}
          link={settings.promoModalLink}
        />
      )}
    </>
  );
}
