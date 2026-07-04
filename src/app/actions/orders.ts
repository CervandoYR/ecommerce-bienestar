"use server"

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { OrderStatus } from "@prisma/client"

export async function updateOrderStatus(id: string, status: OrderStatus) {
  try {
    const order = await prisma.order.update({
      where: { id },
      data: { status }
    })
    
    // Log history
    await prisma.orderStatusHistory.create({
      data: {
        orderId: id,
        status,
        changedBy: "Admin" // TODO: Use actual user session when auth is complete
      }
    })

    revalidatePath("/admin/pedidos")
    return { success: true, order: JSON.parse(JSON.stringify(order)) }
  } catch (error: any) {
    return { error: error.message }
  }
}

export async function createOrder(data: {
  userId?: string;
  userEmail?: string;
  userName?: string;
  shippingName: string;
  shippingPhone: string;
  shippingDocument?: string;
  shippingAddress: string;
  shippingReference?: string;
  districtName: string;
  subtotal: number;
  shippingCost?: number;
  total: number;
  paymentMethod: "WEB" | "WHATSAPP";
  items: {
    productId: string;
    quantity: number;
    unitPrice: number;
    productName: string;
    productSku?: string;
    productImage?: string;
  }[];
}) {
  try {
    // 1. Ensure User exists
    let user = await prisma.user.findFirst({
      where: {
        OR: [
          ...(data.userId ? [{ id: data.userId }] : []),
          ...(data.userEmail ? [{ email: data.userEmail }] : []),
        ],
      },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email: data.userEmail || `guest-${Date.now()}@samaymunay.com`,
          name: data.userName || data.shippingName || "Cliente",
          phone: data.shippingPhone,
          documentId: data.shippingDocument,
          address: data.shippingAddress,
          supabaseUid: `guest_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
        },
      });
    }

    // 2. Ensure District exists
    let district = await prisma.district.findFirst({
      where: {
        name: { equals: data.districtName || "Lima", mode: "insensitive" },
      },
    });

    if (!district) {
      let zone = await prisma.shippingZone.findFirst();
      if (!zone) {
        zone = await prisma.shippingZone.create({
          data: { name: "Lima Metropolitana", cost: 10.0 },
        });
      }
      district = await prisma.district.create({
        data: {
          name: data.districtName || "Lima",
          shippingZoneId: zone.id,
        },
      });
    }

    // 3. Create Order
    const orderNumber = `ORD-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;
    const status = data.paymentMethod === "WEB" ? "PAGADO" : "PENDIENTE";

    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId: user.id,
        status: status as any,
        paymentMethod: data.paymentMethod,
        shippingName: data.shippingName,
        shippingPhone: data.shippingPhone,
        shippingDocument: data.shippingDocument || null,
        shippingAddress: data.shippingAddress,
        shippingReference: data.shippingReference || null,
        districtId: district.id,
        subtotal: data.subtotal,
        shippingCost: data.shippingCost || 0,
        total: data.total,
        items: {
          create: data.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            totalPrice: Number(item.unitPrice) * item.quantity,
            productName: item.productName,
            productSku: item.productSku || "SKU-GEN",
            productImage: item.productImage || null,
          })),
        },
        statusHistory: {
          create: {
            status: status as any,
            changedBy: data.paymentMethod === "WEB" ? "Pasarela Culqi" : "Cliente",
          },
        },
      },
    });

    revalidatePath("/(shop)/perfil");
    revalidatePath("/admin/pedidos");

    return { success: true, orderId: order.id, orderNumber: order.orderNumber };
  } catch (error: any) {
    console.error("Error creating order:", error);
    return { success: false, error: error.message };
  }
}

