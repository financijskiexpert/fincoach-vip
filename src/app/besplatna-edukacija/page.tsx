import { createServiceClient } from '@/lib/supabase/server'
import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import SiteFooter from '@/components/SiteFooter'
import EduClient, { type EduPost } from './EduClient'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Besplatna edukacija | FinCoach VIP',
  description: 'Praktični članci o osobnim financijama, investiranju, psihologiji novca i financijskoj slobodi. Besplatno. Odmah.',
  openGraph: {
    title: 'Besplatna edukacija | FinCoach VIP',
    description: 'Praktični članci i vodiči koji ti pomažu preuzeti kontrolu nad novcem — besplatno.',
    url: 'https://fincoach.vip/besplatna-edukacija',
  },
  alternates: {
    canonical: 'https://fincoach.vip/besplatna-edukacija',
  },
}

export default async function BesplatnaEdukacijaPage() {
  const supabase = await createServiceClient()

  const { data: rawPosts } = await supabase
    .from('blog_posts')
    .select('id, title, slug, excerpt, published_at, cover_image_url, category')
    .eq('is_published', true)
    .order('published_at', { ascending: false })

  const posts: EduPost[] = (rawPosts ?? []).map((p: any) => ({
    id: p.id as string,
    title: p.title as string,
    slug: p.slug as string,
    excerpt: p.excerpt as string | null,
    published_at: p.published_at as string | null,
    cover_image_url: p.cover_image_url as string | null,
    category: p.category as string | null,
  }))

  return (
    <main className="min-h-screen" style={{ backgroundColor: '#0f1e35', color: '#fff' }}>

      {/* Header — isti kao /blog i /kontakt */}
      <div className="border-b" style={{ borderColor: 'rgba(212,175,55,0.2)' }}>
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/">
            <Image
              src="/logo/fincoach-logo-horizontal.svg"
              alt="FinCoach VIP"
              width={160}
              height={50}
              priority
            />
          </Link>
          <Link
            href="/volim-svoj-novac"
            className="text-sm font-medium px-4 py-2 rounded-lg transition-opacity hover:opacity-90"
            style={{ backgroundColor: '#D4AF37', color: '#0f1e35' }}
          >
            Kupi program
          </Link>
        </div>
      </div>

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-4 pt-16 pb-10 text-center">
        <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: '#D4AF37' }}>
          Besplatno za tebe
        </p>
        <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
          Besplatna{' '}
          <span style={{ color: '#D4AF37' }}>edukacija</span>
        </h1>
        <p className="text-lg max-w-2xl mx-auto" style={{ color: 'rgba(255,255,255,0.65)' }}>
          Praktični članci, vodiči i uvidi koji ti pomažu preuzeti kontrolu nad novcem —
          korak po korak, besplatno.
        </p>
      </section>

      {/* Client dio: filteri + featured + strip + grid + CTA */}
      <EduClient posts={posts} />

      <SiteFooter />
    </main>
  )
}
