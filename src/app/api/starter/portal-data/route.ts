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

  const { data: profile } = await service
    .from('profiles')
    .select('full_name, role')
    .eq('id', user.id)
    .maybeSingle()

  const isAdmin = profile?.role === 'admin' || user.email === 'brane.recek@gmail.com'

  const { data: purchase } = await service
    .from('starter_purchases')
    .select('id, email, financial_type, created_at, affiliate_ref')
    .eq('email', user.email.toLowerCase())
    .eq('status', 'active')
    .maybeSingle()

  if (!purchase && !isAdmin) {
    return NextResponse.json({ ok: false, error: 'Nemaš pristup Starter Paketu.' }, { status: 403 })
  }

  // Track last portal visit for re-engagement emails
  if (purchase?.id) {
    await service
      .from('starter_purchases')
      .update({ last_seen_starter: new Date().toISOString() })
      .eq('id', purchase.id)
  }

  return NextResponse.json({
    ok: true,
    email: purchase?.email ?? user.email,
    full_name: profile?.full_name ?? user.email.split('@')[0],
    financial_type: purchase?.financial_type ?? null,
    purchased_at: purchase?.created_at ?? new Date().toISOString(),
    via_affiliate: !!(purchase as Record<string, unknown> | null)?.affiliate_ref,
    is_admin_preview: isAdmin && !purchase,
  })
}
