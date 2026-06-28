import { NextRequest, NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase/server'
import { generateBlogPost } from '@/lib/claude'
import { generateAndUploadArticleImages, injectGeneratedImages } from '@/lib/blog-image-generator'

export const dynamic = 'force-dynamic'
export const maxDuration = 300

const CATEGORY_DEFAULTS: Record<string, { title: string; angle: string; keywords: string[] }> = {
  'osobne-financije':     { title: 'Kako preuzeti kontrolu nad osobnim financijama', angle: 'Praktični sustav za početnike', keywords: ['proračun', 'štednja', 'kontrola novca'] },
  'investiranje':         { title: 'Investiranje za početnike — sve što trebaš znati', angle: 'Pristupačan vodič bez žargona', keywords: ['ETF', 'investiranje', 'složena kamata'] },
  'psihologija-novca':    { title: 'Zašto pametni ljudi donose loše financijske odluke', angle: 'Psihologija iza novčanih izbora', keywords: ['mindset', 'ponašanje', 'emocionalne odluke'] },
  'osiguranje':           { title: 'Koliko osiguranja zaista trebaš', angle: 'Praktični vodič bez pretjerivanja', keywords: ['životno osiguranje', 'zaštita', 'obitelj'] },
  'mentorstvo':           { title: 'Kako izgraditi karijeru financijskog savjetnika', angle: 'Iskustvo iz 30 godina prakse', keywords: ['karijera', 'zastopnik', 'mentorstvo'] },
  'obiteljske-financije': { title: 'Razgovor o novcu u obitelji — kako početi', angle: 'Praktični savjeti za parove i roditelje', keywords: ['obitelj', 'djeca i novac', 'partnerstvo'] },
  'osobna-rast':          { title: 'Navike koje grade financijsku slobodu', angle: 'Veza između osobnog razvoja i bogatstva', keywords: ['navike', 'disciplina', 'rast', 'ciljevi'] },
}

async function checkAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin' && user.email !== 'brane.recek@gmail.com') return null
  return user
}

export async function POST(request: NextRequest) {
  const user = await checkAdmin()
  if (!user) return NextResponse.json({ error: 'Neovlašteni pristup.' }, { status: 403 })

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ ok: false, error: 'ANTHROPIC_API_KEY nije postavljen.' }, { status: 500 })
  }

  let selectedCategory: string | null = null
  try {
    const body = await request.json()
    if (body?.category && body.category !== 'auto') selectedCategory = body.category
  } catch { /* no body or invalid JSON */ }

  const service = await createServiceClient()

  // Dohvati temu iz queue (po kategoriji ako je odabrana)
  let topicQuery = service
    .from('blog_topics')
    .select('id, title, angle, category, keywords')
    .eq('status', 'pending')
    .order('priority', { ascending: false })
    .order('created_at', { ascending: true })
    .limit(1)

  if (selectedCategory) {
    topicQuery = (topicQuery as any).eq('category', selectedCategory)
  }

  const { data: topicFromDb } = await (topicQuery as any).maybeSingle()

  // Fallback: ako nema teme u queue za odabranu kategoriju, koristi CATEGORY_DEFAULTS
  let topic: { id: string | null; title: string; angle?: string | null; category?: string | null; keywords?: string[] | null } | null = topicFromDb
  if (!topic && selectedCategory && CATEGORY_DEFAULTS[selectedCategory]) {
    const def = CATEGORY_DEFAULTS[selectedCategory]
    topic = { id: null, title: def.title, angle: def.angle, category: selectedCategory, keywords: def.keywords }
  }

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

    if (topic.id) {
      await service
        .from('blog_topics')
        .update({ status: 'generated', blog_post_id: post.id, generated_at: new Date().toISOString() })
        .eq('id', topic.id)
    }

    return NextResponse.json({ ok: true, topic: topic.title, slug: finalSlug })
  } catch (err: any) {
    if (topic.id) {
      await service
        .from('blog_topics')
        .update({ error_message: err.message?.slice(0, 500) ?? 'Unknown error' })
        .eq('id', topic.id)
    }
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 })
  }
}
