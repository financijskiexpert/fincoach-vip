import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  const { post_id, action } = await request.json()
  if (!post_id || !['like', 'unlike'].includes(action)) {
    return NextResponse.json({ error: 'Invalid' }, { status: 400 })
  }

  const service = await createServiceClient()
  const { data: post } = await service
    .from('blog_posts')
    .select('like_count')
    .eq('id', post_id)
    .maybeSingle()

  if (!post) return NextResponse.json({ error: 'Post not found' }, { status: 404 })

  const current = post.like_count ?? 0
  const newCount = action === 'like' ? current + 1 : Math.max(0, current - 1)

  const { error } = await service
    .from('blog_posts')
    .update({ like_count: newCount })
    .eq('id', post_id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true, like_count: newCount })
}
