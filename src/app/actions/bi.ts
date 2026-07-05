"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function importProductsBI(items: Array<{
  sku: string;
  name?: string;
  price?: number;
  stock?: number;
}>) {
  try {
    let updated = 0;
    let notFound = 0;
    const errors: string[] = [];

    for (const item of items) {
      if (!item.sku) {
        errors.push("Fila ignorada: falta SKU");
        continue;
      }

      const existing = await prisma.product.findUnique({
        where: { sku: item.sku.trim() }
      });

      if (existing) {
        const updateData: any = {};
        if (typeof item.price === "number" && !isNaN(item.price)) updateData.price = item.price;
        if (typeof item.stock === "number" && !isNaN(item.stock)) updateData.stock = item.stock;
        if (item.name) updateData.name = item.name;

        await prisma.product.update({
          where: { id: existing.id },
          data: updateData
        });
        updated++;
      } else {
        notFound++;
        errors.push(`SKU no encontrado en base de datos: ${item.sku}`);
      }
    }

    revalidatePath("/admin");
    revalidatePath("/admin/productos");
    revalidatePath("/(shop)");

    return {
      success: true,
      updated,
      notFound,
      errors
    };
  } catch (error: any) {
    return { success: false, error: "Error en sincronización BI: " + error.message };
  }
}

export async function importOrdersBI(items: Array<{
  orderNumber: string;
  status?: string;
}>) {
  try {
    let updated = 0;
    let notFound = 0;
    const errors: string[] = [];

    const validStatuses = ["PENDIENTE", "PAGADO", "EN_PREPARACION", "EN_CAMINO", "ENTREGADO", "CANCELADO"];

    for (const item of items) {
      if (!item.orderNumber) continue;

      const cleanNum = item.orderNumber.trim().replace(/^"/, "").replace(/"$/, "");
      const existing = await prisma.order.findUnique({
        where: { orderNumber: cleanNum }
      });

      if (existing && item.status) {
        const cleanStatus = item.status.trim().toUpperCase();
        if (validStatuses.includes(cleanStatus)) {
          await prisma.order.update({
            where: { id: existing.id },
            data: { status: cleanStatus as any }
          });
          updated++;
        } else {
          errors.push(`Estado inválido (${cleanStatus}) para pedido ${cleanNum}`);
        }
      } else if (!existing) {
        notFound++;
        errors.push(`Pedido no encontrado: ${cleanNum}`);
      }
    }

    revalidatePath("/admin");
    revalidatePath("/admin/pedidos");

    return {
      success: true,
      updated,
      notFound,
      errors
    };
  } catch (error: any) {
    return { success: false, error: "Error importando pedidos: " + error.message };
  }
}
