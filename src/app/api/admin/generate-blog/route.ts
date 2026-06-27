import { NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase/server'
import { generateBlogPost } from '@/lib/claude'
import { generateAndUploadArticleImages, injectGeneratedImages } from '@/lib/blog-image-generator'

export const dynamic = 'force-dynamic'
export const maxDuration = 300

async function checkAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin' && user.email !== 'brane.recek@gmail.com') return null
  return user
}

export async function POST() {
  const user = await checkAdmin()
  if (!user) return NextResponse.json({ error: 'Neovlašteni pristup.' }, { status: 403 })

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ ok: false, error: 'ANTHROPIC_API_KEY nije postavljen.' }, { status: 500 })
  }

  const service = await createServiceClient()

  const { data: topic } = await service
    .from('blog_topics')
    .select('id, title, angle, category, keywords')
    .eq('status', 'pending')
    .order('priority', { ascending: false })
    .order('created_at', { ascending: true })
    .limit(1)
    .maybeSingle()

  if (!topic) return NextResponse.json({ ok: true, message: 'Nema više tema na čekanju.' })

  try {
    const generated = await generateBlogPost(topic)

    let finalSlug = generated.slug
    let suffix = 1
    while (true) {
      const { data: existing } = await service
        .from('blog_posts').select('id').eq('slug', finalSlug).maybeSingle()
      if (!existing) break
      finalSlug = `${generated.slug}-${++suffix}`
    }

    const { coverUrl, img1Url, img2Url } = await generateAndUploadArticleImages(
      generated.title, topic.category, finalSlug, generated.excerpt
    )
    generated.content = injectGeneratedImages(generated.content, img1Url, img2Url)

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://fincoach.vip'
    const fbCaption = generated.fb_caption
      ? generated.fb_caption.replace('[BLOG_URL]', `${siteUrl}/besplatna-edukacija/${finalSlug}`)
      : ''

    const { data: post, error: insertErr } = await service
      .from('blog_posts')
      .insert({
        slug: finalSlug,
        title: generated.title,
        excerpt: generated.excerpt,
        content: generated.content,
        meta_title: generated.meta_title,
        meta_description: generated.meta_description,
        fb_caption: fbCaption || null,
        category: topic.category ?? null,
        cover_image_url: coverUrl,
        is_published: false,
        is_auto_generated: true,
        topic_id: topic.id,
      })
      .select('id')
      .single()

    if (insertErr) throw insertErr

    await service
      .from('blog_topics')
      .update({ status: 'generated', blog_post_id: post.id, generated_at: new Date().toISOString() })
      .eq('id', topic.id)

    return NextResponse.json({ ok: true, topic: topic.title, slug: finalSlug })
  } catch (err: any) {
    await service
      .from('blog_topics')
      .update({ error_message: err.message?.slice(0, 500) ?? 'Unknown error' })
      .eq('id', topic.id)
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 })
  }
}
