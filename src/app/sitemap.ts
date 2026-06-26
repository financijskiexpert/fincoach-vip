import type { MetadataRoute } from 'next'
import { createServiceClient } from '@/lib/supabase/server'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://fincoach.vip'
  const now = new Date()

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${siteUrl}/`, lastModified: now, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${siteUrl}/volim-svojnovac`, lastModified: now, changeFrequency: 'weekly', priority: 0.95 },
    { url: `${siteUrl}/blog`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${siteUrl}/affiliate`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${siteUrl}/affiliate/uvjeti`, lastModified: now, changeFrequency: 'yearly', priority: 0.4 },
    { url: `${siteUrl}/uvjetiposlovanja`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${siteUrl}/politikaprivatnosti`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${siteUrl}/prijava`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
  ]

  try {
    const service = await createServiceClient()
    const { data: posts } = await service
      .from('blog_posts')
      .select('slug, published_at')
      .eq('is_published', true)
      .order('published_at', { ascending: false })

    const blogPages: MetadataRoute.Sitemap = (posts ?? []).map(p => ({
      url: `${siteUrl}/blog/${p.slug}`,
      lastModified: p.published_at ? new Date(p.published_at) : now,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }))

    return [...staticPages, ...blogPages]
  } catch {
    return staticPages
  }
}
