import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { generateBlogPost } from '@/lib/claude'
import { injectImagesIntoContent, getCoverImageUrl } from '@/lib/blog-images'

export const dynamic = 'force-dynamic'
export const maxDuration = 300

/**
 * Dnevna avtomatska generacija blog članka.
 * 1. Vzame najstarejšo "pending" temo iz blog_topics
 * 2. Pokliče Claude da generira članek
 * 3. Vstavi v blog_posts z is_published=false (admin pregled)
 * 4. Označi temo kot 'generated'
 *
 * Lahko kličemo ročno: GET /api/cron/generate-blog?force=1 z X-Cron-Secret header.
 */
export async function GET(request: NextRequest) {
  // Auth: Vercel cron pošlje header `x-vercel-cron`, ali ročni klic z CRON_SECRET
  const cronHeader = request.headers.get('x-vercel-cron')
  const secretHeader = request.headers.get('x-cron-secret')
  const isVercelCron = !!cronHeader
  const isManual = secretHeader === process.env.CRON_SECRET

  if (!isVercelCron && !isManual) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({
      ok: false,
      error: 'ANTHROPIC_API_KEY ni nastavljen v environment. Dodaj v Vercel env vars.',
    }, { status: 500 })
  }

  const service = await createServiceClient()

  // Vzemi najstarejšo pending temo z najvišjo prioriteto
  const { data: topic, error: topicErr } = await service
    .from('blog_topics')
    .select('id, title, angle, category, keywords')
    .eq('status', 'pending')
    .order('priority', { ascending: false })
    .order('created_at', { ascending: true })
    .limit(1)
    .maybeSingle()

  if (topicErr) return NextResponse.json({ error: topicErr.message }, { status: 500 })
  if (!topic) return NextResponse.json({ ok: true, message: 'No pending topics' })

  try {
    const generated = await generateBlogPost(topic)

    // Umetni slike u sadržaj
    generated.content = injectImagesIntoContent(generated.content, topic.category)

    // Preveri slug uniqueness
    let finalSlug = generated.slug
    let suffix = 1
    while (true) {
      const { data: existing } = await service
        .from('blog_posts').select('id').eq('slug', finalSlug).maybeSingle()
      if (!existing) break
      finalSlug = `${generated.slug}-${++suffix}`
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://fincoach.vip'
    const fbCaption = generated.fb_caption
      ? generated.fb_caption.replace('[BLOG_URL]', `${siteUrl}/blog/${finalSlug}`)
      : ''

    // Vstavi članek (NE objavljen — admin mora potrditi)
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
        cover_image_url: getCoverImageUrl(topic.category, finalSlug),
        is_published: false,
        is_auto_generated: true,
        topic_id: topic.id,
      })
      .select('id')
      .single()

    if (insertErr) throw insertErr

    // Posodobi topic
    await service
      .from('blog_topics')
      .update({
        status: 'generated',
        blog_post_id: post.id,
        generated_at: new Date().toISOString(),
      })
      .eq('id', topic.id)

    return NextResponse.json({
      ok: true,
      topic: topic.title,
      post_id: post.id,
      slug: finalSlug,
      message: 'Članak generiran. Otvori /admin/blog za pregled i objavu.',
    })
  } catch (err: any) {
    // Označi temo z greško, da je ne poskušamo znova istega dne
    await service
      .from('blog_topics')
      .update({
        error_message: err.message?.slice(0, 500) ?? 'Unknown error',
      })
      .eq('id', topic.id)
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 })
  }
}
