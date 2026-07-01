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

  const service = await createServiceClient()
  const { data, error } = await service
    .from('testimonials')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ testimonials: data ?? [] })
}

export async function POST(request: NextRequest) {
  const user = await checkAdmin()
  if (!user) return NextResponse.json({ error: 'Neovlašteni pristup.' }, { status: 403 })

  const body = await request.json()
  const { full_name, role, quote, rating = 5, student_id } = body

  if (!full_name || !quote) {
    return NextResponse.json({ error: 'Ime i citat su obavezni.' }, { status: 400 })
  }

  const service = await createServiceClient()
  const { data, error } = await service
    .from('testimonials')
    .insert({
      full_name: full_name.trim(),
      role: role?.trim() || null,
      quote: quote.trim(),
      rating: Math.min(5, Math.max(1, Number(rating))),
      student_id: student_id || null,
      is_published: false,
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true, testimonial: data })
}

export async function PUT(request: NextRequest) {
  const user = await checkAdmin()
  if (!user) return NextResponse.json({ error: 'Neovlašteni pristup.' }, { status: 403 })

  const body = await request.json()
  const { id, full_name, role, quote, rating, is_published } = body
  if (!id) return NextResponse.json({ error: 'ID obavezan.' }, { status: 400 })

  const service = await createServiceClient()
  const updates: Record<string, unknown> = {}
  if (full_name !== undefined) updates.full_name = full_name.trim()
  if (role !== undefined) updates.role = role?.trim() || null
  if (quote !== undefined) updates.quote = quote.trim()
  if (rating !== undefined) updates.rating = Math.min(5, Math.max(1, Number(rating)))
  if (is_published !== undefined) {
    updates.is_published = is_published
    updates.published_at = is_published ? new Date().toISOString() : null
  }

  const { data, error } = await service
    .from('testimonials')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true, testimonial: data })
}

export async function DELETE(request: NextRequest) {
  const user = await checkAdmin()
  if (!user) return NextResponse.json({ error: 'Neovlašteni pristup.' }, { status: 403 })

  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'ID obavezan.' }, { status: 400 })

  const service = await createServiceClient()
  const { error } = await service.from('testimonials').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
