import { createServiceClient } from '@/lib/supabase/server'
import Link from 'next/link'
import Image from 'next/image'
import { Metadata } from 'next'
import SiteFooter from '@/components/SiteFooter'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Blog | FinCoach VIP',
  description: 'Savjeti o osobnim financijama, štednji i financijskoj slobodi.',
}

interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string | null
  published_at: string | null
}

const MONTHS = ['Januar', 'Februar', 'Mart', 'April', 'Maj', 'Jun', 'Jul', 'Avgust', 'Septembar', 'Oktobar', 'Novembar', 'Decembar']

function formatDate(dateStr: string | null): string {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return `${d.getDate()}. ${MONTHS[d.getMonth()]} ${d.getFullYear()}.`
}

export default async function BlogPage() {
  const supabase = await createServiceClient()
  const { data: posts } = await supabase
    .from('blog_posts')
    .select('id, title, slug, excerpt, published_at')
    .eq('is_published', true)
    .order('published_at', { ascending: false })

  const publishedPosts: BlogPost[] = posts ?? []

  return (
    <main className="min-h-screen" style={{ backgroundColor: '#0f1e35', color: '#fff' }}>
      {/* Header */}
      <div className="border-b" style={{ borderColor: 'rgba(212,175,55,0.2)' }}>
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/">
            <Image src="/logo/fincoach-logo-horizontal.svg" alt="FinCoach VIP" width={160} height={50} priority />
          </Link>
          <Link
            href="/volim-svoj-novac"
            className="text-sm font-medium px-4 py-2 rounded-lg transition-colors"
            style={{ backgroundColor: '#D4AF37', color: '#0f1e35' }}
          >
            Kupi program
          </Link>
        </div>
      </div>

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-4 pt-16 pb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Blog o{' '}
          <span style={{ color: '#D4AF37' }}>financijskoj slobodi</span>
        </h1>
        <p className="text-lg max-w-2xl mx-auto" style={{ color: 'rgba(255,255,255,0.7)' }}>
          Praktični savjeti, strategije i uvidi koji ti pomažu preuzeti kontrolu nad novcem.
        </p>
      </section>

      {/* Posts grid */}
      <section className="max-w-5xl mx-auto px-4 pb-20">
        {publishedPosts.length === 0 ? (
          <div className="text-center py-20" style={{ color: 'rgba(255,255,255,0.5)' }}>
            <p className="text-xl">Uskoro novi članci.</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {publishedPosts.map((post) => (
              <article
                key={post.id}
                className="flex flex-col rounded-xl p-6 transition-transform hover:-translate-y-1"
                style={{
                  backgroundColor: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(212,175,55,0.15)',
                }}
              >
                {post.published_at && (
                  <time
                    dateTime={post.published_at}
                    className="text-xs mb-3 font-medium uppercase tracking-wider"
                    style={{ color: '#D4AF37' }}
                  >
                    {formatDate(post.published_at)}
                  </time>
                )}
                <h2 className="text-lg font-bold leading-snug mb-3 flex-1">
                  {post.title}
                </h2>
                {post.excerpt && (
                  <p
                    className="text-sm leading-relaxed mb-5 line-clamp-3"
                    style={{ color: 'rgba(255,255,255,0.65)' }}
                  >
                    {post.excerpt}
                  </p>
                )}
                <Link
                  href={`/blog/${post.slug}`}
                  className="text-sm font-semibold transition-colors"
                  style={{ color: '#D4AF37' }}
                >
                  Čitaj više →
                </Link>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* CTA */}
      <section
        className="py-16 px-4"
        style={{ backgroundColor: 'rgba(212,175,55,0.08)', borderTop: '1px solid rgba(212,175,55,0.2)' }}
      >
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Spreman/na za financijsku slobodu?
          </h2>
          <p className="mb-8" style={{ color: 'rgba(255,255,255,0.7)' }}>
            Pridruži se FinCoach VIP programu i u 90 dana izgradi sustav koji radi za tebe.
          </p>
          <Link
            href="/volim-svoj-novac"
            className="inline-block px-8 py-4 rounded-xl font-bold text-lg transition-opacity hover:opacity-90"
            style={{ backgroundColor: '#D4AF37', color: '#0f1e35' }}
          >
            Saznaj više o programu
          </Link>
        </div>
      </section>
      <SiteFooter />
    </main>
  )
}
