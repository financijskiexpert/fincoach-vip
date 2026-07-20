import { NextRequest, NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user?.email) {
    return NextResponse.json({ ok: false, error: 'Nisi prijavljen/a.' }, { status: 401 })
  }

  const body = await request.json()
  const { financial_type, initial_score } = body

  const validTypes = ['hedonist', 'branic', 'vrtlog', 'teoreticar']
  if (!validTypes.includes(financial_type)) {
    return NextResponse.json({ ok: false, error: 'Nevažeći tip.' }, { status: 400 })
  }

  const service = await createServiceClient()

  // Provjeri je li initial_score već postavljen — ne prepiši ga pri resetiranju
  const { data: existing } = await service
    .from('starter_purchases')
    .select('initial_score')
    .eq('email', user.email.toLowerCase())
    .eq('status', 'active')
    .maybeSingle()

  const updateData: Record<string, unknown> = { financial_type }
  if (typeof initial_score === 'number' && !(existing as Record<string, unknown> | null)?.initial_score) {
    updateData.initial_score = initial_score
  }

  const { error } = await service
    .from('starter_purchases')
    .update(updateData)
    .eq('email', user.email.toLowerCase())
    .eq('status', 'active')

  if (error) {
    console.error('set-type-portal error:', error)
    return NextResponse.json({ ok: false, error: 'Greška pri spremanju.' }, { status: 500 })
  }

  // Sync na leads tabelu
  await service
    .from('leads')
    .update({ financial_type })
    .eq('email', user.email.toLowerCase())

  return NextResponse.json({ ok: true })
}
