import { NextRequest, NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

async function checkAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin' && user.email !== 'brane.recek@gmail.com') return null
  return user
}

export async function GET() {
  const user = await checkAdmin()
  if (!user) return NextResponse.json({ error: 'Neovlašteni pristup.' }, { status: 403 })

  const supabase = await createServiceClient()
  const { data: coupons, error } = await supabase
    .from('coupons')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ coupons })
}

export async function POST(request: NextRequest) {
  const user = await checkAdmin()
  if (!user) return NextResponse.json({ error: 'Neovlašteni pristup.' }, { status: 403 })

  const body = await request.json()
  const supabase = await createServiceClient()

  // Check if code already exists
  const { data: existing } = await supabase.from('coupons').select('id').eq('code', body.code).single()
  if (existing) return NextResponse.json({ error: 'Ovaj kod već postoji.' }, { status: 400 })

  const { data, error } = await supabase
    .from('coupons')
    .insert({
      code: body.code,
      discount_type: body.discount_type,
      discount_value: body.discount_value,
      max_uses: body.max_uses ?? null,
      expires_at: body.expires_at ?? null,
      is_active: body.is_active ?? true,
      used_count: 0,
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ coupon: data })
}

export async function PUT(request: NextRequest) {
  const user = await checkAdmin()
  if (!user) return NextResponse.json({ error: 'Neovlašteni pristup.' }, { status: 403 })

  const body = await request.json()
  if (!body.id) return NextResponse.json({ error: 'ID je obavezan.' }, { status: 400 })

  const supabase = await createServiceClient()
  const { data, error } = await supabase
    .from('coupons')
    .update({ is_active: body.is_active })
    .eq('id', body.id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ coupon: data })
}

export async function DELETE(request: NextRequest) {
  const user = await checkAdmin()
  if (!user) return NextResponse.json({ error: 'Neovlašteni pristup.' }, { status: 403 })

  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'ID je obavezan.' }, { status: 400 })

  const supabase = await createServiceClient()
  const { error } = await supabase.from('coupons').delete().eq('id', id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
