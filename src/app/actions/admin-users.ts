"use server"

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { ArcoStatus } from "@prisma/client"

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
