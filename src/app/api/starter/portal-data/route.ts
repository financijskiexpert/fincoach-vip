import { NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user?.email) {
    return NextResponse.json({ ok: false, error: 'Nisi prijavljen/a.' }, { status: 401 })
  }

  const service = await createServiceClient()
  const { data: purchase } = await service
    .from('starter_purchases')
    .select('id, email, financial_type, created_at')
    .eq('email', user.email.toLowerCase())
    .eq('status', 'active')
    .maybeSingle()

  if (!purchase) {
    return NextResponse.json({ ok: false, error: 'Nemaš pristup Starter Paketu.' }, { status: 403 })
  }

  const { data: profile } = await service
    .from('profiles')
    .select('full_name')
    .eq('id', user.id)
    .maybeSingle()

  return NextResponse.json({
    ok: true,
    email: purchase.email,
    full_name: profile?.full_name ?? user.email.split('@')[0],
    financial_type: purchase.financial_type ?? null,
    purchased_at: purchase.created_at,
  })
}
