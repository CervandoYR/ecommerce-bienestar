import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import prisma from '@/lib/prisma'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/perfil'

  if (code) {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error && data.user) {
      // Sincronizar con Prisma
      const userExists = await prisma.user.findUnique({
        where: { supabaseUid: data.user.id }
      })
      
      if (!userExists) {
        await prisma.user.create({
          data: {
            supabaseUid: data.user.id,
            email: data.user.email!,
            name: data.user.user_metadata?.name || data.user.user_metadata?.full_name || 'Usuario',
            acceptsPrivacyPolicy: true,
            acceptsDataUsage: true,
          }
        })
      }
      
      const forwardedHost = request.headers.get('x-forwarded-host')
      const isLocalEnv = process.env.NODE_ENV === 'development'
      if (isLocalEnv) {
        return NextResponse.redirect(`${origin}${next}`)
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`)
      } else {
        return NextResponse.redirect(`${origin}${next}`)
      }
    }
  }

  return NextResponse.redirect(`${origin}/login?error=Error+en+el+inicio+de+sesion`)
}
