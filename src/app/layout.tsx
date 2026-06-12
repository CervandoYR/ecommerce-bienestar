import type { Metadata, Viewport } from "next";
import { Outfit, Inter } from "next/font/google";
import { STORE_NAME, STORE_DESCRIPTION, STORE_URL } from "@/lib/constants";
import { AuthProvider } from "@/context/AuthContext";
import { ToastProvider } from "@/components/ui/toast";
import { WhatsAppFAB } from "@/components/ui/whatsapp-fab";
import { LenisProvider } from "@/components/layout/lenis-provider";
import { CustomCursor } from "@/components/layout/custom-cursor";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#577549",
};

export const metadata: Metadata = {
  metadataBase: new URL(STORE_URL),
  title: {
    default: `${STORE_NAME} — Productos de Relajación y Bienestar en Lima`,
    template: `%s | ${STORE_NAME}`,
  },
  description: STORE_DESCRIPTION,
  keywords: [
    "productos de relajación",
    "bienestar",
    "aromaterapia",
    "velas aromáticas",
    "aceites esenciales",
    "relajación Lima",
    "bienestar Perú",
    "autocuidado",
    "mindfulness",
    "tienda de bienestar Lima",
  ],
  authors: [{ name: STORE_NAME }],
  creator: STORE_NAME,
  openGraph: {
    type: "website",
    locale: "es_PE",
    url: STORE_URL,
    siteName: STORE_NAME,
    title: `${STORE_NAME} — Productos de Relajación y Bienestar`,
    description: STORE_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: STORE_NAME,
    description: STORE_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      suppressHydrationWarning
      className={`${outfit.variable} ${inter.variable} h-full antialiased`}
    >
      <head>
        {/* JSON-LD Organization Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: STORE_NAME,
              url: STORE_URL,
              logo: `${STORE_URL}/images/brand/logo.png`,
              description: STORE_DESCRIPTION,
              address: {
                "@type": "PostalAddress",
                addressLocality: "San Juan de Miraflores",
                addressRegion: "Lima",
                addressCountry: "PE",
              },
              contactPoint: {
                "@type": "ContactPoint",
                contactType: "customer service",
                availableLanguage: "Spanish",
              },
            }),
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground transition-colors duration-300">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <CustomCursor />
          <LenisProvider>
            <ToastProvider>
              <AuthProvider>
                {children}
                <WhatsAppFAB />
              </AuthProvider>
            </ToastProvider>
          </LenisProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
