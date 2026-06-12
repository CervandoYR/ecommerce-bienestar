import type { MetadataRoute } from "next";
import { STORE_URL } from "@/lib/constants";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/api/", "/checkout/", "/carrito/", "/pedidos/"],
      },
    ],
    sitemap: `${STORE_URL}/sitemap.xml`,
  };
}
