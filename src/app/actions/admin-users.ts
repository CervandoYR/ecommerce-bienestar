"use server"

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { ArcoStatus, Role } from "@prisma/client"

export async function updateArcoStatus(id: string, status: ArcoStatus) {
  try {
    const arcoRequest = await prisma.arcoRequest.update({
      where: { id },
      data: { status }
    })
    
    revalidatePath("/admin/clientes")
    return { success: true, arcoRequest }
  } catch (error: any) {
    return { error: error.message }
  }
}

export async function updateUserRole(userId: string, newRole: Role) {
  try {
    const updated = await prisma.user.update({
      where: { id: userId },
      data: { role: newRole }
    });
    revalidatePath("/admin/clientes");
    revalidatePath("/admin");
    return { success: true, user: updated };
  } catch (error: any) {
    return { success: false, error: "Error cambiando rol: " + error.message };
  }
}

export async function deleteUser(userId: string) {
  try {
    // Check if user has orders
    const ordersCount = await prisma.order.count({
      where: { userId }
    });

    if (ordersCount > 0) {
      return { 
        success: false, 
        error: `No se puede eliminar porque este cliente tiene ${ordersCount} pedido(s) registrado(s) en la tienda. Para proteger la contabilidad y auditoría, mantén su registro o archiva sus pedidos.` 
      };
    }

    // Clean up dependent records first
    await prisma.$transaction([
      prisma.cartItem.deleteMany({ where: { cart: { userId } } }),
      prisma.cart.deleteMany({ where: { userId } }),
      prisma.address.deleteMany({ where: { userId } }),
      prisma.review.deleteMany({ where: { userId } }),
      prisma.arcoRequest.deleteMany({ where: { userId } }),
      prisma.user.delete({ where: { id: userId } }),
    ]);

    revalidatePath("/admin/clientes");
    revalidatePath("/admin");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: "Error eliminando usuario: " + error.message };
  }
}
