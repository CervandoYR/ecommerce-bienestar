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
    return { success: true, order }
  } catch (error: any) {
    return { error: error.message }
  }
}
