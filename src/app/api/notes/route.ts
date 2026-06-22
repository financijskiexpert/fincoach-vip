import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const lessonId = request.nextUrl.searchParams.get('lesson_id')
  if (!lessonId) return NextResponse.json({ note: null })
  const { data } = await supabase
    .from('notes')
    .select('content, updated_at')
    .eq('user_id', user.id)
    .eq('lesson_id', lessonId)
    .single()
  return NextResponse.json({ note: data ?? null })
}

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { lesson_id, content } = await request.json()
  if (!lesson_id) return NextResponse.json({ error: 'lesson_id required' }, { status: 400 })
  const { data, error } = await supabase
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
