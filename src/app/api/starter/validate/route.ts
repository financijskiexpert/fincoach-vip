import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token')

  if (!token || token.length < 10) {
    return NextResponse.json({ error: 'Token nije pronađen.' }, { status: 400 })
  }

  const supabase = await createServiceClient()

  const { data: tokenRow, error } = await supabase
    .from('starter_access_tokens')
    .select('*, starter_purchases(email, full_name, financial_type, purchased_at, amount_paid, status)')
    .eq('token', token)
    .single()

  if (error || !tokenRow) {
    return NextResponse.json({ error: 'Token nije validan ili je istekao.' }, { status: 404 })
  }

  const purchase = (tokenRow as any).starter_purchases
  if (!purchase || purchase.status !== 'active') {
    return NextResponse.json({ error: 'Starter Paket nije aktivan.' }, { status: 403 })
  }

  return NextResponse.json({
    valid: true,
    email: purchase.email,
    full_name: purchase.full_name,
    financial_type: purchase.financial_type,
    purchased_at: purchase.purchased_at,
  })
}
