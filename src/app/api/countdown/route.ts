import { NextRequest, NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

/**
 * Vrne countdown_expires_at za uporabnika ali za email iz query parametra.
 * Po dogovoru: 24h countdown se nastavi ob naročilu PDF-ja na landingu.
 * Vrne {expires_at: string|null}.
 */
export async function GET(request: NextRequest) {
  const url = new URL(request.url)
  const emailFromQuery = url.searchParams.get('email')?.toLowerCase().trim()

  let email: string | undefined = emailFromQuery ?? undefined

  if (!email) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    email = user?.email?.toLowerCase()
  }

  if (!email) return NextResponse.json({ expires_at: null })

  const service = await createServiceClient()
  const { data: lead } = await service
    .from('leads')
    .select('countdown_expires_at')
    .eq('email', email)
    .maybeSingle()

  const expires = lead?.countdown_expires_at ?? null
  return NextResponse.json({ expires_at: expires })
}
