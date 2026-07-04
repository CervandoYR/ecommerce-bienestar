"use server"

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function createProduct(data: any) {
  try {
    const product = await prisma.product.create({
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        shortDescription: data.shortDescription,
        sku: data.sku,
        price: parseFloat(data.price),
        compareAtPrice: data.compareAtPrice ? parseFloat(data.compareAtPrice) : null,
        stock: parseInt(data.stock),
        categoryId: data.categoryId,
        supplierId: data.supplierId || null,
        images: data.images || [], // Recibe las URLs generadas por Cloudinary client-side
        isFeatured: data.isFeatured === true,
        isComingSoon: data.isComingSoon === true,
        isActive: data.isActive !== false,
      }
    })
    revalidatePath("/admin/productos")
    revalidatePath("/productos")
    return { success: true, product: JSON.parse(JSON.stringify(product)) }
  } catch (error: any) {
    return { error: error.message }
  }
}

export async function updateProduct(id: string, data: any) {
  try {
    const product = await prisma.product.update({
      where: { id },
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        shortDescription: data.shortDescription,
        sku: data.sku,
        price: parseFloat(data.price),
        compareAtPrice: data.compareAtPrice ? parseFloat(data.compareAtPrice) : null,
        stock: parseInt(data.stock),
        categoryId: data.categoryId,
        supplierId: data.supplierId || null,
        images: data.images || [],
        isFeatured: data.isFeatured === true,
        isComingSoon: data.isComingSoon === true,
        isActive: data.isActive !== false,
      }
    })
    revalidatePath("/admin/productos")
    revalidatePath(`/productos/${product.slug}`)
    return { success: true, product: JSON.parse(JSON.stringify(product)) }
  } catch (error: any) {
    return { error: error.message }
  }
}

export async function deleteProduct(id: string) {
  try {
    await prisma.product.delete({ where: { id } })
    revalidatePath("/admin/productos")
    revalidatePath("/productos")
    return { success: true }
  } catch (error: any) {
    return { error: error.message }
  }
}
