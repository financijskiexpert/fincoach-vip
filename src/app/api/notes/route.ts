import { NextRequest, NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const service = await createServiceClient()
  const lessonId = request.nextUrl.searchParams.get('lesson_id')

  // Brez lesson_id → vrne vse note tega uporabnika (za /portal/biljeske)
  if (!lessonId) {
    const { data } = await service
      .from('notes')
      .select('lesson_id, content, updated_at, lessons(day_number, title)')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false })
    return NextResponse.json({ notes: data ?? [] })
  }

  const { data } = await service
    .from('notes')
    .select('content, updated_at')
    .eq('user_id', user.id)
    .eq('lesson_id', lessonId)
    .maybeSingle()
  return NextResponse.json({ note: data ?? null })
}

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { lesson_id, content } = await request.json()
  if (!lesson_id) return NextResponse.json({ error: 'lesson_id required' }, { status: 400 })

  const service = await createServiceClient()
  const { data, error } = await service
    .from('notes')
    .upsert(
      { user_id: user.id, lesson_id, content, updated_at: new Date().toISOString() },
      { onConflict: 'user_id,lesson_id' }
    )
    .select('updated_at')
    .single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true, updated_at: data?.updated_at })
}
