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

export async function POST(request: NextRequest) {
  const user = await checkAdmin()
  if (!user) return NextResponse.json({ error: 'Neovlašteni pristup.' }, { status: 403 })

  const body = await request.json()
  const { name, email, code, commission_percent } = body

  if (!name || !email || !code) {
    return NextResponse.json({ error: 'Ime, email i kod su obavezni.' }, { status: 400 })
  }

  const service = await createServiceClient()

  // Check if code already exists
  const { data: existing } = await service
    .from('affiliates')
    .select('id')
    .eq('code', code)
    .single()

  if (existing) {
    return NextResponse.json({ error: 'Affiliate kod već postoji. Odaberi drugi kod.' }, { status: 409 })
  }

  const { data, error } = await service
    .from('affiliates')
    .insert({
      name,
      email,
      code,
      commission_percent: commission_percent ?? 30,
      is_active: true,
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ affiliate: data }, { status: 201 })
}
