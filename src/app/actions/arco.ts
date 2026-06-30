"use server"

import prisma from "@/lib/prisma"
import { createClient } from "@/lib/supabase/server"
import { ArcoType } from "@prisma/client"
import { revalidatePath } from "next/cache"

export async function submitArcoRequest(formData: FormData) {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return { error: "No autorizado." }
  }

  const type = formData.get("type") as ArcoType
  const details = formData.get("details") as string

  if (!type || !details) {
    return { error: "Todos los campos son requeridos." }
  }

  try {
    await prisma.arcoRequest.create({
      data: {
        userId: user.id, // Using Supabase UID which maps to userId in our db if they are in sync, or we query Prisma by supabaseUid
        type,
        details,
      }
    })
    
    revalidatePath("/profile/arco")
    return { success: true }
  } catch (error: any) {
    // Si supabaseUid y el id de usuario difieren, busquemos el id de Prisma primero
    try {
        const dbUser = await prisma.user.findUnique({ where: { supabaseUid: user.id } });
        if(dbUser){
            await prisma.arcoRequest.create({
              data: {
                userId: dbUser.id,
                type,
                details,
              }
            })
            revalidatePath("/profile/arco")
            return { success: true }
        } else {
             return { error: "Usuario no encontrado en la base de datos." }
        }
    } catch(e: any){
        return { error: e.message }
    }
  }
}
