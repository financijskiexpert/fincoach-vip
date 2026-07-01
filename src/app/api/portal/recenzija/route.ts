import { NextRequest, NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Neovlašteni pristup.' }, { status: 401 })

  const service = await createServiceClient()
  const { data } = await service
    .from('testimonials')
    .select('id, full_name, role, quote, rating, is_published, created_at')
    .eq('student_id', user.id)
    .maybeSingle()

  return NextResponse.json({ testimonial: data ?? null })
}

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Neovlašteni pristup.' }, { status: 401 })

  const body = await request.json()
  const { full_name, role, quote, rating = 5 } = body

  if (!full_name?.trim() || !quote?.trim()) {
    return NextResponse.json({ error: 'Ime i citat su obavezni.' }, { status: 400 })
  }

  const service = await createServiceClient()

  // Provjeri postoji li već recenzija ovog studenta
  const { data: existing } = await service
    .from('testimonials')
    .select('id')
    .eq('student_id', user.id)
    .maybeSingle()

  if (existing) {
    // Ažuriraj postojeću (vraća na draft ako je bio objavljen)
    const { error } = await service
      .from('testimonials')
      .update({
        full_name: full_name.trim(),
        role: role?.trim() || null,
        quote: quote.trim(),
        rating: Math.min(5, Math.max(1, Number(rating))),
        is_published: false,
        published_at: null,
      })
      .eq('id', existing.id)

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ ok: true, updated: true })
  }

  // Kreiraj novu recenziju
  const { error } = await service
    .from('testimonials')
    .insert({
      student_id: user.id,
      full_name: full_name.trim(),
      role: role?.trim() || null,
      quote: quote.trim(),
      rating: Math.min(5, Math.max(1, Number(rating))),
      is_published: false,
    })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true, updated: false })
}
