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
  const { financial_type } = body

  const validTypes = ['hedonist', 'branic', 'vrtlog', 'teoreticar']
  if (!validTypes.includes(financial_type)) {
    return NextResponse.json({ ok: false, error: 'Nevažeći tip.' }, { status: 400 })
  }

  const service = await createServiceClient()

  const { error } = await service
    .from('starter_purchases')
    .update({ financial_type })
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
