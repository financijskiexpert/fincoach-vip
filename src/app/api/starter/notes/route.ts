import { NextRequest, NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const weekParam = request.nextUrl.searchParams.get('week')
  const service = await createServiceClient()

  if (weekParam) {
    const week = parseInt(weekParam, 10)
    const { data } = await service
      .from('starter_notes')
      .select('content, updated_at')
      .eq('user_id', user.id)
      .eq('week_num', week)
      .maybeSingle()
    return NextResponse.json({ note: data ?? null })
  }

  // Brez week → vse beležke (za /portal/biljeske)
  const { data } = await service
    .from('starter_notes')
    .select('week_num, content, updated_at')
    .eq('user_id', user.id)
    .order('week_num', { ascending: true })
  return NextResponse.json({ notes: data ?? [] })
}

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { week_num, content } = await request.json()
  if (!week_num) return NextResponse.json({ error: 'week_num required' }, { status: 400 })

  const service = await createServiceClient()
  const { data, error } = await service
    .from('starter_notes')
    .upsert(
      { user_id: user.id, week_num, content, updated_at: new Date().toISOString() },
      { onConflict: 'user_id,week_num' }
    )
    .select('updated_at')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true, updated_at: data?.updated_at })
}
