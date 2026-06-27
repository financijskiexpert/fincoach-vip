import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { generateBlogPost } from '@/lib/claude'
import { generateAndUploadArticleImages, injectGeneratedImages } from '@/lib/blog-image-generator'
import { revalidatePath } from 'next/cache'

export const dynamic = 'force-dynamic'
export const maxDuration = 300

const VALID_CATEGORIES = [
  'osobne-financije',
  'investiranje',
  'psihologija-novca',
  'osiguranje',
  'mentorstvo',
  'obiteljske-financije',
]

export async function GET(request: NextRequest) {
  const cronSecret = process.env.CRON_SECRET
  const isVercelCron = !!request.headers.get('x-vercel-cron')
  const headerToken = request.headers.get('x-cron-secret')
  const queryToken = request.nextUrl.searchParams.get('token')
  const isManual = cronSecret && (headerToken === cronSecret || queryToken === cronSecret)

  if (!isVercelCron && !isManual) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ ok: false, error: 'ANTHROPIC_API_KEY nije postavljen.' }, { status: 500 })
  }

  const service = await createServiceClient()

  const { data: topic, error: topicErr } = await service
    .from('blog_topics')
    .select('id, title, angle, category, keywords')
    .eq('status', 'pending')
    .order('priority', { ascending: false })
    .order('created_at', { ascending: true })
    .limit(1)
    .maybeSingle()

  if (topicErr) return NextResponse.json({ error: topicErr.message }, { status: 500 })
  if (!topic) return NextResponse.json({ ok: true, message: 'Nema više tema na čekanju.' })

  try {
    // 1. Generiraj tekst članka
    const generated = await generateBlogPost(topic)

    // 2. Validacija prije objave
    const errors: string[] = []
    if (!generated.title || generated.title.length < 10) errors.push('naslov prekratak')
    if (!generated.slug) errors.push('slug nedostaje')
    if (!generated.content || generated.content.length < 800) errors.push('sadržaj prekratak (<800 znakova)')
    if (!generated.excerpt || generated.excerpt.length < 50) errors.push('excerpt nedostaje ili prekratak')
    if (topic.category && !VALID_CATEGORIES.includes(topic.category)) errors.push(`neispravna kategorija: ${topic.category}`)

    if (errors.length > 0) {
      await service
        .from('blog_topics')
        .update({ error_message: `Validacija neuspjela: ${errors.join(', ')}` })
        .eq('id', topic.id)
      return NextResponse.json({ ok: false, error: `Validacija neuspjela: ${errors.join(', ')}` }, { status: 422 })
    }

    // 3. Odredi finalni slug (jedinstvenost)
    let finalSlug = generated.slug
    let suffix = 1
    while (true) {
      const { data: existing } = await service
        .from('blog_posts').select('id').eq('slug', finalSlug).maybeSingle()
      if (!existing) break
      finalSlug = `${generated.slug}-${++suffix}`
    }

    // 4. Generiraj i uploadaj unikatne slike (3 PNG per članak)
    const { coverUrl, img1Url, img2Url } = await generateAndUploadArticleImages(
      generated.title, topic.category, finalSlug
    )
    generated.content = injectGeneratedImages(generated.content, img1Url, img2Url)

    // 5. Spremi u bazu i objavi
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://fincoach.vip'
    const articleUrl = `${siteUrl}/besplatna-edukacija/${finalSlug}`
    const fbCaption = generated.fb_caption
      ? generated.fb_caption.replace('[BLOG_URL]', articleUrl)
      : ''
    const publishedAt = new Date().toISOString()

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
        is_published: true,
        published_at: publishedAt,
        is_auto_generated: true,
        topic_id: topic.id,
      })
      .select('id')
      .single()

    if (insertErr) throw insertErr

    await service
      .from('blog_topics')
      .update({ status: 'generated', blog_post_id: post.id, generated_at: publishedAt })
      .eq('id', topic.id)

    revalidatePath('/besplatna-edukacija')

    return NextResponse.json({
      ok: true,
      topic: topic.title,
      post_id: post.id,
      slug: finalSlug,
      url: articleUrl,
      category: topic.category,
      message: 'Članak generiran i objavljen.',
    })
  } catch (err: any) {
    await service
      .from('blog_topics')
      .update({ error_message: err.message?.slice(0, 500) ?? 'Unknown error' })
      .eq('id', topic.id)
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 })
  }
}
