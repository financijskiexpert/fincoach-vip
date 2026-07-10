import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

const VALID_TYPES = ['hedonist', 'branic', 'vrtlog', 'teoreticar']

export async function POST(request: NextRequest) {
  try {
    const { token, financial_type } = await request.json()

    if (!token || typeof token !== 'string' || token.length < 10) {
      return NextResponse.json({ error: 'Token nije validan.' }, { status: 400 })
    }
    if (!financial_type || !VALID_TYPES.includes(financial_type)) {
      return NextResponse.json({ error: 'Nevažeći financijski tip.' }, { status: 400 })
    }

    const supabase = await createServiceClient()

    const { data: tokenRow, error: tokenErr } = await supabase
      .from('starter_access_tokens')
      .select('starter_purchase_id')
      .eq('token', token)
      .single()

    if (tokenErr || !tokenRow) {
      return NextResponse.json({ error: 'Token nije pronađen.' }, { status: 404 })
    }

    const { error: updateErr } = await supabase
      .from('starter_purchases')
      .update({ financial_type })
      .eq('id', tokenRow.starter_purchase_id)

    if (updateErr) {
      console.error('set-type update error:', updateErr)
      return NextResponse.json({ error: 'Greška pri ažuriranju.' }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('set-type error:', err)
    return NextResponse.json({ error: 'Interna greška.' }, { status: 500 })
  }
}
