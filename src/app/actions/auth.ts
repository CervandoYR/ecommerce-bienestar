"use server"

import { createClient } from "@/lib/supabase/server"
import prisma from "@/lib/prisma"
import { redirect } from "next/navigation"

export async function registerUser(formData: FormData) {
  const name = formData.get("name") as string
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const birthDateStr = formData.get("birthDate") as string
  const acceptsPrivacyPolicy = formData.get("acceptsPrivacyPolicy") === "on"
  const acceptsDataUsage = formData.get("acceptsDataUsage") === "on"

  if (!acceptsPrivacyPolicy || !acceptsDataUsage) {
    return { error: "Debes aceptar las políticas y uso de datos (Ley N° 29733)." }
  }

  const supabase = await createClient()

  const { data, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
      }
    }
  })

  if (authError) {
    return { error: authError.message }
  }

  if (!data.user) {
    return { error: "Error desconocido al crear usuario en Supabase." }
  }

  try {
    await prisma.user.create({
      data: {
        supabaseUid: data.user.id,
        email: email,
        name: name,
        birthDate: birthDateStr ? new Date(birthDateStr) : null,
        acceptsPrivacyPolicy,
        acceptsDataUsage,
      }
    })
  } catch (error: any) {
    return { error: "Error al guardar perfil: " + error.message }
  }

  redirect("/perfil")
}

export async function loginWithGoogle() {
   const supabase = await createClient()
   const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
   const { data, error } = await supabase.auth.signInWithOAuth({
     provider: 'google',
     options: {
       redirectTo: `${siteUrl}/api/auth/callback`,
     },
   })
   
   if (error) {
     return { error: error.message }
   }
   
   if (data?.url) {
     redirect(data.url)
   }
}
