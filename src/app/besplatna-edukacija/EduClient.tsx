'use client'

import { useState, FormEvent } from 'react'
import Link from 'next/link'
import Image from 'next/image'

const MONTHS = ['Januar', 'Februar', 'Mart', 'April', 'Maj', 'Jun', 'Jul', 'Avgust', 'Septembar', 'Oktobar', 'Novembar', 'Decembar']

const CATEGORIES = [
  { id: null, label: 'Sve kategorije' },
  { id: 'osobne-financije', label: 'Osobne financije' },
  { id: 'investiranje', label: 'Investiranje' },
  { id: 'psihologija-novca', label: 'Psihologija novca' },
  { id: 'osiguranje', label: 'Osiguranje' },
  { id: 'mentorstvo', label: 'Mentorstvo' },
  { id: 'obiteljske-financije', label: 'Obiteljske financije' },
]

const CATEGORY_LABELS: Record<string, string> = {
  'osobne-financije': 'Osobne financije',
  'investiranje': 'Investiranje',
  'psihologija-novca': 'Psihologija novca',
  'osiguranje': 'Osiguranje',
  'mentorstvo': 'Mentorstvo',
  'obiteljske-financije': 'Obiteljske financije',
}

export interface EduPost {
  id: string
  title: string
  slug: string
  excerpt: string | null
  published_at: string | null
  cover_image_url: string | null
  category: string | null
}

function formatDate(s: string | null): string {
  if (!s) return ''
  const d = new Date(s)
  return `${d.getDate()}. ${MONTHS[d.getMonth()]} ${d.getFullYear()}.`
}

function getCardImage(post: EduPost): string {
  if (post.cover_image_url) return post.cover_image_url
  const seed = post.category
    ? `${post.category}-${post.slug.slice(0, 14)}`
    : `edu-${post.slug.slice(0, 16)}`
  return `https://picsum.photos/seed/${seed}/800/450`
}

function getCategoryLabel(cat: string | null): string {
  if (!cat) return ''
  return CATEGORY_LABELS[cat] ?? cat
}

function PostCard({ post }: { post: EduPost }) {
  return (
    <Link href={`/besplatna-edukacija/${post.slug}`} className="group flex flex-col rounded-xl overflow-hidden transition-transform hover:-translate-y-1" style={{ backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(212,175,55,0.15)' }}>
      <div className="relative w-full overflow-hidden" style={{ aspectRatio: '16/9' }}>
        <Image
          src={getCardImage(post)}
          alt={post.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        {post.category && (
          <span className="absolute top-3 left-3 text-xs font-semibold px-2.5 py-1 rounded-full" style={{ backgroundColor: 'rgba(212,175,55,0.9)', color: '#0D1B2A' }}>
            {getCategoryLabel(post.category)}
          </span>
        )}
      </div>
      <div className="flex flex-col flex-1 p-5">
        {post.published_at && (
          <time className="text-xs mb-2 font-medium uppercase tracking-wider" style={{ color: 'rgba(212,175,55,0.7)' }}>
            {formatDate(post.published_at)}
          </time>
        )}
        <h3 className="font-bold leading-snug mb-3 flex-1" style={{ fontSize: '1rem', color: '#fff' }}>
          {post.title}
        </h3>
        {post.excerpt && (
          <p className="text-sm leading-relaxed mb-4 line-clamp-2" style={{ color: 'rgba(255,255,255,0.55)' }}>
            {post.excerpt}
          </p>
        )}
        <span className="text-sm font-semibold" style={{ color: '#D4AF37' }}>
          Čitaj više →
        </span>
      </div>
    </Link>
  )
}

function FeaturedBig({ post }: { post: EduPost }) {
  return (
    <Link href={`/besplatna-edukacija/${post.slug}`} className="group rounded-2xl overflow-hidden flex flex-col md:flex-row transition-transform hover:-translate-y-0.5" style={{ backgroundColor: 'rgba(212,175,55,0.07)', border: '1px solid rgba(212,175,55,0.25)' }}>
      <div className="relative md:w-1/2 flex-shrink-0 overflow-hidden" style={{ minHeight: 220 }}>
        <Image
          src={getCardImage(post)}
          alt={post.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
        />
        {post.category && (
          <span className="absolute top-4 left-4 text-xs font-semibold px-3 py-1.5 rounded-full" style={{ backgroundColor: '#D4AF37', color: '#0D1B2A' }}>
            {getCategoryLabel(post.category)}
          </span>
        )}
      </div>
      <div className="flex flex-col justify-center p-7 md:p-9">
        <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'rgba(212,175,55,0.7)' }}>
          Najnoviji članak
        </p>
        {post.published_at && (
          <time className="text-xs mb-3" style={{ color: 'rgba(255,255,255,0.35)' }}>
            {formatDate(post.published_at)}
          </time>
        )}
        <h2 className="text-2xl md:text-3xl font-bold leading-snug mb-4" style={{ color: '#fff' }}>
          {post.title}
        </h2>
        {post.excerpt && (
          <p className="text-base leading-relaxed mb-5 line-clamp-3" style={{ color: 'rgba(255,255,255,0.6)' }}>
            {post.excerpt}
          </p>
        )}
        <span className="font-semibold" style={{ color: '#D4AF37' }}>
          Čitaj cijeli članak →
        </span>
      </div>
    </Link>
  )
}

function FeaturedMini({ post }: { post: EduPost }) {
  return (
    <Link href={`/besplatna-edukacija/${post.slug}`} className="group flex gap-4 rounded-xl p-4 transition-colors" style={{ backgroundColor: 'rgba(255,255,255,0.04)', border: '0.5px solid rgba(255,255,255,0.1)' }}>
      <div className="relative flex-shrink-0 rounded-lg overflow-hidden" style={{ width: 72, height: 72 }}>
        <Image
          src={getCardImage(post)}
          alt={post.title}
          fill
          className="object-cover"
          sizes="72px"
        />
      </div>
      <div className="flex-1 min-w-0">
        {post.category && (
          <p className="text-xs mb-1" style={{ color: '#D4AF37' }}>{getCategoryLabel(post.category)}</p>
        )}
        <h3 className="text-sm font-semibold leading-snug line-clamp-2 mb-1" style={{ color: '#fff' }}>
          {post.title}
        </h3>
        {post.published_at && (
          <time className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>
            {formatDate(post.published_at)}
          </time>
        )}
      </div>
    </Link>
  )
}

function PdfStrip() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setStatus('loading')
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, full_name: name, source: 'edukacija', marketing_consent: true }),
      })
      setStatus(res.ok ? 'success' : 'error')
    } catch {
      setStatus('error')
    }
  }

  return (
    <div className="mx-4 md:mx-0 my-14 rounded-2xl p-8 md:p-12" style={{ background: 'linear-gradient(135deg, rgba(212,175,55,0.15) 0%, rgba(212,175,55,0.06) 100%)', border: '1px solid rgba(212,175,55,0.3)' }}>
      <div className="max-w-2xl mx-auto text-center">
        <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: '#D4AF37' }}>Besplatno · odmah na email</p>
        <h2 className="text-2xl md:text-3xl font-bold mb-3" style={{ color: '#fff' }}>
          Preuzmi besplatni PDF vodič <span style={{ color: '#D4AF37' }}>"Savjeti i tehnike za financijsku stabilnost"</span>
        </h2>
        <p className="mb-8" style={{ color: 'rgba(255,255,255,0.6)' }}>
          Praktični vodič koji su preuzele stotine čitatelja. Korak po korak do financijske slobode — besplatno na tvoj email.
        </p>

        {status === 'success' ? (
          <div className="rounded-xl px-6 py-5" style={{ backgroundColor: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)' }}>
            <p className="font-semibold" style={{ color: 'rgb(134,239,172)' }}>Vodič je na putu! Provjeri inbox (i spam) za nekoliko minuta.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto">
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Tvoje ime"
              className="flex-1 rounded-xl px-4 py-3 text-sm outline-none"
              style={{ backgroundColor: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff' }}
            />
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Email adresa"
              required
              className="flex-1 rounded-xl px-4 py-3 text-sm outline-none"
              style={{ backgroundColor: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff' }}
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              className="rounded-xl px-6 py-3 text-sm font-bold whitespace-nowrap transition-opacity hover:opacity-90 disabled:opacity-60"
              style={{ backgroundColor: '#D4AF37', color: '#0D1B2A' }}
            >
              {status === 'loading' ? 'Šaljem...' : 'Preuzmi besplatno'}
            </button>
          </form>
        )}

        {status === 'error' && (
          <p className="mt-3 text-sm" style={{ color: 'rgb(252,165,165)' }}>Greška — pokušaj ponovo ili javi se na brane@fincoach.vip</p>
        )}

        <p className="mt-4 text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>
          Bez spama. Možeš se odjaviti u bilo kojem trenutku.
        </p>
      </div>
    </div>
  )
}

function ProgramCta() {
  return (
    <section className="py-16 px-4" style={{ backgroundColor: 'rgba(212,175,55,0.07)', borderTop: '1px solid rgba(212,175,55,0.2)' }}>
      <div className="max-w-2xl mx-auto text-center">
        <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: '#D4AF37' }}>FinCoach VIP Program</p>
        <h2 className="text-2xl md:text-3xl font-bold mb-4" style={{ color: '#fff' }}>
          Spreman/na za ozbiljnu promjenu?
        </h2>
        <p className="text-base mb-8" style={{ color: 'rgba(255,255,255,0.65)' }}>
          90 dana strukturiranog programa — od financijskog kaosa do sustava koji radi sam. S 1 satom osobnog coachinga s Branetom.
        </p>
        <Link
          href="/volim-svoj-novac"
          className="inline-block px-8 py-4 rounded-xl font-bold text-lg transition-opacity hover:opacity-90"
          style={{ backgroundColor: '#D4AF37', color: '#0D1B2A' }}
        >
          Saznaj više o programu →
        </Link>
      </div>
    </section>
  )
}

export default function EduClient({ posts }: { posts: EduPost[] }) {
  const [selectedCat, setSelectedCat] = useState<string | null>(null)

  const filtered = selectedCat
    ? posts.filter(p => p.category === selectedCat)
    : posts

  const featured = selectedCat === null && filtered.length > 0 ? filtered[0] : null
  const minis = selectedCat === null ? filtered.slice(1, 4) : []
  const gridPosts = selectedCat === null ? filtered.slice(4) : filtered

  return (
    <>
      {/* Category filters */}
      <div className="max-w-5xl mx-auto px-4 pb-8">
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id ?? 'all'}
              onClick={() => setSelectedCat(cat.id)}
              className="rounded-full px-4 py-2 text-sm font-medium transition-colors"
              style={{
                backgroundColor: selectedCat === cat.id
                  ? 'rgba(212,175,55,0.2)'
                  : 'rgba(255,255,255,0.06)',
                border: selectedCat === cat.id
                  ? '1px solid rgba(212,175,55,0.5)'
                  : '0.5px solid rgba(255,255,255,0.12)',
                color: selectedCat === cat.id ? '#D4AF37' : 'rgba(255,255,255,0.6)',
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4">
        {/* Featured — samo kad je "Sve" */}
        {featured && (
          <div className="mb-8">
            <FeaturedBig post={featured} />
          </div>
        )}

        {minis.length > 0 && (
          <div className="grid gap-3 mb-4" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}>
            {minis.map(post => (
              <FeaturedMini key={post.id} post={post} />
            ))}
          </div>
        )}

        {/* PDF CTA strip */}
        <PdfStrip />

        {/* Grid svih/filtriranih članaka */}
        {gridPosts.length === 0 ? (
          <div className="text-center py-16" style={{ color: 'rgba(255,255,255,0.4)' }}>
            <p className="text-lg">Uskoro novi članci u ovoj kategoriji.</p>
          </div>
        ) : (
          <>
            {selectedCat && (
              <p className="text-sm mb-5" style={{ color: 'rgba(255,255,255,0.35)' }}>
                {filtered.length} {filtered.length === 1 ? 'članak' : 'članaka'} u kategoriji <span style={{ color: '#D4AF37' }}>{getCategoryLabel(selectedCat)}</span>
              </p>
            )}
            <div className="grid gap-6" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
              {gridPosts.map(post => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          </>
        )}
      </div>

      <ProgramCta />
    </>
  )
}
