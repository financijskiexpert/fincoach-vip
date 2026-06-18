import { NextRequest, NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

async function checkAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') return null
  return user
}

export async function POST(request: NextRequest) {
  const user = await checkAdmin()
  if (!user) return NextResponse.json({ error: 'Neovlašteni pristup.' }, { status: 403 })

  const body = await request.formData()
  const conversionId = body.get('conversion_id')?.toString()
  if (!conversionId) return NextResponse.json({ error: 'ID konverzije je obavezan.' }, { status: 400 })

  const supabase = await createServiceClient()
  const { error } = await supabase
    .from('affiliate_conversions')
    .update({ status: 'paid', paid_at: new Date().toISOString() })
    .eq('id', conversionId)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Redirect back to affiliate admin
  return NextResponse.redirect(new URL('/admin/affiliate', request.url))
}
