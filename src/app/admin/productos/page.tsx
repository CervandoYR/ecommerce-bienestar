import prisma from "@/lib/prisma";
import { ProductTableClient } from "@/components/admin/product-table-client";

export default async function AdminProductsPage() {
  let products: any[] = [];
  try {
    products = await prisma.product.findMany({
      include: {
        category: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  } catch (error) {
    console.warn("Could not fetch products for admin:", error);
  }

  return (
    <ProductTableClient initialProducts={JSON.parse(JSON.stringify(products))} />
  );
}
