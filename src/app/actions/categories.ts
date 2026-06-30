"use server"

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function createCategory(data: any) {
  try {
    const category = await prisma.category.create({
      data
    })
    revalidatePath("/admin/categorias")
    return { success: true, category }
  } catch (error: any) {
    if (error.code === 'P2002') {
      return { error: "Ya existe una categoría con este nombre o slug." }
    }
    return { error: error.message }
  }
}

export async function updateCategory(id: string, data: any) {
  try {
    const category = await prisma.category.update({
      where: { id },
      data
    })
    revalidatePath("/admin/categorias")
    return { success: true, category }
  } catch (error: any) {
    if (error.code === 'P2002') {
      return { error: "Ya existe una categoría con este nombre o slug." }
    }
    return { error: error.message }
  }
}

export async function deleteCategory(id: string) {
  try {
    // Check if category has products
    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: { products: true }
        }
      }
    });

    if (category?._count.products && category._count.products > 0) {
      return { error: "No puedes eliminar una categoría que tiene productos asignados." }
    }

    await prisma.category.delete({ where: { id } })
    revalidatePath("/admin/categorias")
    return { success: true }
  } catch (error: any) {
    return { error: error.message }
  }
}
