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
  const { data: posts, error } = await supabase
    .from('blog_posts')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ posts })
}

export async function POST(request: NextRequest) {
  const user = await checkAdmin()
  if (!user) return NextResponse.json({ error: 'Neovlašteni pristup.' }, { status: 403 })

  const body = await request.json()
  const supabase = await createServiceClient()

  const { data: existing } = await supabase.from('blog_posts').select('id').eq('slug', body.slug).single()
  if (existing) return NextResponse.json({ error: 'Slug već postoji.' }, { status: 400 })

  const { data, error } = await supabase
    .from('blog_posts')
    .insert({
      title: body.title,
      slug: body.slug,
      excerpt: body.excerpt || null,
      content: body.content || null,
      is_published: body.is_published ?? false,
      published_at: body.is_published ? new Date().toISOString() : null,
      author_id: user.id,
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ post: data })
}

export async function PUT(request: NextRequest) {
  const user = await checkAdmin()
  if (!user) return NextResponse.json({ error: 'Neovlašteni pristup.' }, { status: 403 })

  const body = await request.json()
  if (!body.id) return NextResponse.json({ error: 'ID je obavezan.' }, { status: 400 })

  const supabase = await createServiceClient()
  const { data, error } = await supabase
    .from('blog_posts')
    .update({
      title: body.title,
      slug: body.slug,
      excerpt: body.excerpt || null,
      content: body.content || null,
      is_published: body.is_published,
      published_at: body.is_published ? new Date().toISOString() : null,
    })
    .eq('id', body.id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ post: data })
}

export async function DELETE(request: NextRequest) {
  const user = await checkAdmin()
  if (!user) return NextResponse.json({ error: 'Neovlašteni pristup.' }, { status: 403 })

  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'ID je obavezan.' }, { status: 400 })

  const supabase = await createServiceClient()
  const { error } = await supabase.from('blog_posts').delete().eq('id', id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
