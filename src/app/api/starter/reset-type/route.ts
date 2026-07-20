import { NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export async function POST() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user?.email) {
    return NextResponse.json({ ok: false, error: 'Nisi prijavljen/a.' }, { status: 401 })
  }

  const service = await createServiceClient()

  // Samo briše financial_type — initial_score ostaje za usporedbu
  const { error } = await service
    .from('starter_purchases')
    .update({ financial_type: null })
    .eq('email', user.email.toLowerCase())
    .eq('status', 'active')

  if (error) {
    return NextResponse.json({ ok: false, error: 'Greška pri resetiranju.' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
