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
  const { data: lessons, error } = await supabase
    .from('lessons')
    .select('*')
    .order('day_number', { ascending: true })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ lessons })
}

export async function POST(request: NextRequest) {
  const user = await checkAdmin()
  if (!user) return NextResponse.json({ error: 'Neovlašteni pristup.' }, { status: 403 })

  const body = await request.json()
  const supabase = await createServiceClient()

  const videoKey = body.video_key ?? `courses/volim-svojnovac/day-${body.day_number}.mp4`

  const { data, error } = await supabase
    .from('lessons')
    .insert({
      title: body.title,
      description: body.description,
      day_number: body.day_number,
      video_url: body.video_url,
      video_key: videoKey,
      duration_seconds: body.duration_seconds,
      is_published: body.is_published ?? true,
      course_id: body.course_id ?? null,
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ lesson: data })
}

export async function PUT(request: NextRequest) {
  const user = await checkAdmin()
  if (!user) return NextResponse.json({ error: 'Neovlašteni pristup.' }, { status: 403 })

  const body = await request.json()
  if (!body.id) return NextResponse.json({ error: 'ID je obavezan.' }, { status: 400 })

  const supabase = await createServiceClient()

  const videoKey = body.video_key ?? `courses/volim-svojnovac/day-${body.day_number}.mp4`

  const { data, error } = await supabase
    .from('lessons')
    .update({
      title: body.title,
      description: body.description,
      day_number: body.day_number,
      video_url: body.video_url,
      video_key: videoKey,
      duration_seconds: body.duration_seconds,
      is_published: body.is_published,
    })
    .eq('id', body.id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ lesson: data })
}

export async function DELETE(request: NextRequest) {
  const user = await checkAdmin()
  if (!user) return NextResponse.json({ error: 'Neovlašteni pristup.' }, { status: 403 })

  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'ID je obavezan.' }, { status: 400 })

  const supabase = await createServiceClient()
  const { error } = await supabase.from('lessons').delete().eq('id', id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
