"use server"

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function createSupplier(data: any) {
  try {
    const supplier = await prisma.supplier.create({
      data
    })
    revalidatePath("/admin/proveedores")
    return { success: true, supplier }
  } catch (error: any) {
    if (error.code === 'P2002') {
      return { error: "Ya existe un proveedor con este nombre." }
    }
    return { error: error.message }
  }
}

export async function updateSupplier(id: string, data: any) {
  try {
    const supplier = await prisma.supplier.update({
      where: { id },
      data
    })
    revalidatePath("/admin/proveedores")
    return { success: true, supplier }
  } catch (error: any) {
    if (error.code === 'P2002') {
      return { error: "Ya existe un proveedor con este nombre." }
    }
    return { error: error.message }
  }
}

export async function deleteSupplier(id: string) {
  try {
    const supplier = await prisma.supplier.findUnique({
      where: { id },
      include: {
        _count: {
          select: { products: true }
        }
      }
    });

    if (supplier?._count.products && supplier._count.products > 0) {
      return { error: "No puedes eliminar un proveedor que tiene productos asignados." }
    }

    await prisma.supplier.delete({ where: { id } })
    revalidatePath("/admin/proveedores")
    return { success: true }
  } catch (error: any) {
    return { error: error.message }
  }
}
