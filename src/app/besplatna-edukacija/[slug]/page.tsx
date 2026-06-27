import { createServiceClient } from '@/lib/supabase/server'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import ArticleActions from './ArticleActions'
import { BlogPostingSchema, BreadcrumbSchema } from '@/components/StructuredData'
import SiteFooter from '@/components/SiteFooter'

export const dynamic = 'force-dynamic'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://fincoach.vip'

interface Article {
  id: string
  title: string
  slug: string
  excerpt: string | null
  content: string | null
  published_at: string | null
  is_published: boolean
  like_count?: number | null
  cover_image_url?: string | null
}

interface Props {
  params: Promise<{ slug: string }>
}

const MONTHS = ['Januar', 'Februar', 'Mart', 'April', 'Maj', 'Jun', 'Jul', 'Avgust', 'Septembar', 'Oktobar', 'Novembar', 'Decembar']

function formatDate(dateStr: string | null): string {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return `${d.getDate()}. ${MONTHS[d.getMonth()]} ${d.getFullYear()}.`
}

async function getArticle(slug: string): Promise<Article | null> {
  const supabase = await createServiceClient()
  const { data, error } = await supabase
    .from('blog_posts')
    .select('id, title, slug, excerpt, content, published_at, is_published, like_count, cover_image_url')
    .eq('slug', slug)
    .single()

  if (error || !data) return null
  return data as Article
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const article = await getArticle(slug)

  if (!article || !article.is_published) {
    return { title: 'Besplatna edukacija | FinCoach VIP' }
  }

  return {
    title: `${article.title} | FinCoach VIP`,
    description: article.excerpt ?? 'Članak o osobnim financijama i financijskoj slobodi.',
    alternates: { canonical: `${SITE_URL}/besplatna-edukacija/${slug}` },
    openGraph: {
      title: article.title,
      description: article.excerpt ?? undefined,
      type: 'article',
      publishedTime: article.published_at ?? undefined,
      url: `${SITE_URL}/besplatna-edukacija/${slug}`,
    },
  }
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params
  const article = await getArticle(slug)

  if (!article || !article.is_published) {
    notFound()
  }

  const articleUrl = `${SITE_URL}/besplatna-edukacija/${article.slug}`

  return (
    <main className="min-h-screen" style={{ backgroundColor: '#0f1e35', color: '#fff' }}>

      {/* Header */}
      <div className="border-b" style={{ borderColor: 'rgba(212,175,55,0.2)' }}>
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/">
            <Image src="/logo/fincoach-logo-horizontal.svg" alt="FinCoach VIP" width={160} height={50} priority />
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

      <article className="max-w-3xl mx-auto px-4 py-12">
        {/* Back link */}
        <Link
          href="/besplatna-edukacija"
          className="inline-flex items-center text-sm mb-10 transition-colors hover:opacity-80"
          style={{ color: '#D4AF37' }}
        >
          ← Natrag na edukaciju
        </Link>

        {/* Datum */}
        {article.published_at && (
          <time
            dateTime={article.published_at}
            className="block text-xs font-medium uppercase tracking-widest mb-4"
            style={{ color: '#D4AF37' }}
          >
            {formatDate(article.published_at)}
          </time>
        )}

        {/* Naslov */}
        <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-8">
          {article.title}
        </h1>

        <div className="h-px mb-10" style={{ backgroundColor: 'rgba(212,175,55,0.25)' }} />

        {/* Sadržaj */}
        {article.content ? (
          <div
            className="prose-blog"
            dangerouslySetInnerHTML={{ __html: article.content }}
            style={{ lineHeight: '1.8', fontSize: '1.05rem', color: 'rgba(255,255,255,0.85)' }}
          />
        ) : (
          <p style={{ color: 'rgba(255,255,255,0.5)' }}>Sadržaj nije dostupan.</p>
        )}

        {/* Like + Share */}
        <ArticleActions
          postId={article.id}
          postTitle={article.title}
          postUrl={articleUrl}
          initialLikes={article.like_count ?? 0}
        />
      </article>

      {/* JSON-LD */}
      <BlogPostingSchema
        title={article.title}
        excerpt={article.excerpt ?? ''}
        slug={article.slug}
        publishedAt={article.published_at}
        image={article.cover_image_url}
      />
      <BreadcrumbSchema items={[
        { name: 'Početna', url: SITE_URL },
        { name: 'Besplatna edukacija', url: `${SITE_URL}/besplatna-edukacija` },
        { name: article.title, url: articleUrl },
      ]} />

      {/* Program CTA */}
      <section className="max-w-3xl mx-auto px-4 pb-20">
        <div
          className="rounded-2xl p-8 md:p-10 text-center"
          style={{
            background: 'linear-gradient(135deg, rgba(212,175,55,0.18) 0%, rgba(212,175,55,0.08) 100%)',
            border: '1px solid rgba(212,175,55,0.35)',
          }}
        >
          <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: '#D4AF37' }}>
            FinCoach VIP Program
          </p>
          <h2 className="text-2xl md:text-3xl font-bold mb-4 leading-snug">
            Završi s financijskim brigama — pridruži se{' '}
            <span style={{ color: '#D4AF37' }}>FinCoach VIP programu</span>
          </h2>
          <p className="mb-8 max-w-xl mx-auto" style={{ color: 'rgba(255,255,255,0.7)' }}>
            90 dana strukturiranog programa koji te vodi od financijskog kaosa do sustava koji radi sam — čak i kad nisi motiviran/a.
          </p>
          <Link
            href="/volim-svoj-novac"
            className="inline-block px-8 py-4 rounded-xl font-bold text-lg transition-opacity hover:opacity-90"
            style={{ backgroundColor: '#D4AF37', color: '#0f1e35' }}
          >
            Saznaj više i prijavi se
          </Link>
        </div>
      </section>

      <SiteFooter />
    </main>
  )
}
