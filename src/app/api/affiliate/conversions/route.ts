import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

// GET — fetch all pending conversions that are payout-eligible (admin)
export async function GET() {
  const supabase = await createServiceClient()
  const now = new Date().toISOString()
  const { data, error } = await supabase
    .from('affiliate_conversions')
    .select(`
      *,
      affiliates ( name, email, code )
    `)
    .eq('status', 'pending')
    .lte('payout_eligible_at', now)
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

// POST — mark conversion as paid (admin)
export async function POST(request: NextRequest) {
  const { conversionId } = await request.json()
  if (!conversionId) return NextResponse.json({ error: 'conversionId required' }, { status: 400 })

  const supabase = await createServiceClient()
  const { error } = await supabase
    .from('affiliate_conversions')
    .update({ status: 'paid', paid_at: new Date().toISOString() })
    .eq('id', conversionId)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
