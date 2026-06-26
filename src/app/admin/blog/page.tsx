'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Plus, Pencil, Trash2, Save, X, Eye, Sparkles, Loader2, Copy, Check } from 'lucide-react'
import { toast } from 'sonner'

interface Post {
  id: string
  title: string
  slug: string
  excerpt: string | null
  content: string | null
  fb_caption: string | null
  is_published: boolean
  published_at: string | null
  created_at: string
  is_auto_generated: boolean | null
}

export default function AdminBlog() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    is_published: false,
  })

  useEffect(() => { fetchPosts() }, [])

  async function fetchPosts() {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/blog')
      const data = await res.json()
      setPosts(data.posts ?? [])
    } catch {
      toast.error('Greška pri dohvaćanju objava.')
    } finally {
      setLoading(false)
    }
  }

  function titleToSlug(title: string) {
    return title
      .toLowerCase()
      .replace(/[čć]/g, 'c').replace(/[šđ]/g, 's').replace(/ž/g, 'z')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
  }

  function startNew() {
    setEditingId(null)
    setForm({ title: '', slug: '', excerpt: '', content: '', is_published: false })
    setShowForm(true)
  }

  function startEdit(post: Post) {
    setEditingId(post.id)
    setForm({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt ?? '',
      content: post.content ?? '',
      is_published: post.is_published,
    })
    setShowForm(true)
  }

  async function savePost() {
    if (!form.title || !form.slug) {
      toast.error('Naslov i slug su obavezni.')
      return
    }
    try {
      const res = await fetch('/api/admin/blog', {
        method: editingId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: editingId, ...form }),
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error)
      }
      toast.success(editingId ? 'Objava ažurirana.' : 'Objava kreirana.')
      setShowForm(false)
      fetchPosts()
    } catch (e: any) {
      toast.error(e.message ?? 'Greška.')
    }
  }

  async function deletePost(id: string) {
    if (!confirm('Jesi siguran/na?')) return
    try {
      await fetch(`/api/admin/blog?id=${id}`, { method: 'DELETE' })
      toast.success('Objava obrisana.')
      fetchPosts()
    } catch { toast.error('Greška.') }
  }

  return (
    <div className="max-w-7xl mx-auto p-6 lg:p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Blog</h1>
          <p className="text-white/50 mt-1">{posts.filter(p => p.is_published).length} objavljenih · {posts.length} ukupno</p>
        </div>
        <div className="flex gap-2">
          <GenerateNowButton onDone={fetchPosts} />
          <Button onClick={startNew} className="gap-2">
            <Plus className="w-4 h-4" />
            Nova objava
          </Button>
        </div>
      </div>

      {showForm && (
        <div className="bg-navy-50 border border-gold/20 rounded-2xl p-6 mb-8">
          <h2 className="text-lg font-bold text-white mb-6">{editingId ? 'Uredi objavu' : 'Nova objava'}</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-white/50 mb-1.5">Naslov *</label>
              <Input
                value={form.title}
                onChange={e => {
                  const t = e.target.value
                  setForm(f => ({ ...f, title: t, slug: editingId ? f.slug : titleToSlug(t) }))
                }}
                placeholder="npr. 5 grešaka koje ljude drže siromašnima"
              />
            </div>
            <div>
              <label className="block text-sm text-white/50 mb-1.5">Slug (URL) *</label>
              <Input
                value={form.slug}
                onChange={e => setForm(f => ({ ...f, slug: e.target.value }))}
                placeholder="5-gresaka-koje-ljude-drze-siromašnima"
                className="font-mono text-xs"
              />
            </div>
            <div>
              <label className="block text-sm text-white/50 mb-1.5">Kratki opis (excerpt)</label>
              <textarea
                value={form.excerpt}
                onChange={e => setForm(f => ({ ...f, excerpt: e.target.value }))}
                placeholder="Kratki opis koji se prikazuje u listingu..."
                rows={2}
                className="w-full bg-navy border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-gold/40 resize-none"
              />
            </div>
            <div>
              <label className="block text-sm text-white/50 mb-1.5">Sadržaj (Markdown podržan)</label>
              <textarea
                value={form.content}
                onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
                placeholder="Piši sadržaj ovdje..."
                rows={12}
                className="w-full bg-navy border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-gold/40 resize-y font-mono"
              />
            </div>
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="post_published"
                checked={form.is_published}
                onChange={e => setForm(f => ({ ...f, is_published: e.target.checked }))}
                className="w-4 h-4 accent-[#D4AF37]"
              />
              <label htmlFor="post_published" className="text-sm text-white/70">Objavi odmah (vidljivo na blogu)</label>
            </div>
          </div>
          <div className="flex gap-3 mt-6">
            <Button onClick={savePost} className="gap-2"><Save className="w-4 h-4" />Spremi</Button>
            <Button variant="ghost" onClick={() => { setShowForm(false); setEditingId(null) }} className="gap-2">
              <X className="w-4 h-4" />Odustani
            </Button>
          </div>
        </div>
      )}

      <div className="bg-navy-50 border border-white/10 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-white/30">Učitavam...</div>
        ) : posts.length === 0 ? (
          <div className="p-12 text-center text-white/30">Još nema blog objava.</div>
        ) : (
          <div className="divide-y divide-white/5">
            {posts.map((post) => (
              <div key={post.id} className="px-6 py-4 flex items-center gap-4 hover:bg-white/2 transition-colors">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-white font-medium truncate">{post.title}</p>
                    {post.is_published ? (
                      <Badge className="bg-green-500/10 text-green-400 border-green-500/20 shrink-0">Objavljeno</Badge>
                    ) : (
                      <Badge className="bg-white/5 text-white/40 border-white/10 shrink-0">Draft</Badge>
                    )}
                  </div>
                  <p className="text-white/30 text-xs font-mono">/blog/{post.slug}</p>
                  {post.excerpt && (
                    <p className="text-white/40 text-xs mt-1 truncate">{post.excerpt}</p>
                  )}
                  {post.fb_caption && (
                    <FbCaptionCopy caption={post.fb_caption} />
                  )}
                </div>
                <p className="text-white/30 text-xs shrink-0">
                  {new Date(post.created_at).toLocaleDateString('hr-HR')}
                </p>
                <div className="flex items-center gap-1 shrink-0">
                  {post.is_published && (
                    <a href={`/blog/${post.slug}`} target="_blank" rel="noopener noreferrer"
                      className="p-2 text-white/30 hover:text-gold transition-colors">
                      <Eye className="w-4 h-4" />
                    </a>
                  )}
                  <button onClick={() => startEdit(post)} className="p-2 text-white/30 hover:text-gold transition-colors">
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button onClick={() => deletePost(post.id)} className="p-2 text-white/30 hover:text-red-400 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function FbCaptionCopy({ caption }: { caption: string }) {
  const [copied, setCopied] = useState(false)
  async function copy() {
    await navigator.clipboard.writeText(caption)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <button
      onClick={copy}
      title={caption}
      className="flex items-center gap-1.5 mt-1 text-[10px] text-blue-400/70 hover:text-blue-300 transition-colors"
    >
      {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
      {copied ? 'Kopirano!' : 'Kopiraj FB caption'}
    </button>
  )
}

function GenerateNowButton({ onDone }: { onDone: () => void }) {
  const [pending, setPending] = useState(false)
  async function generate() {
    if (!confirm('Generiraj novi članak iz queue tema?\n\nClaude AI će napisati osnutek za pregled (NE objavljuje automatski).')) return
    setPending(true)
    try {
      const res = await fetch('/api/admin/generate-blog', { method: 'POST' })
      const data = await res.json()
      if (data.ok) {
        toast.success(`✓ Generiran: ${data.topic}. Otvori za pregled i objavu.`)
        onDone()
      } else {
        toast.error(data.error ?? data.message ?? 'Greška.')
      }
    } catch (e: any) {
      toast.error(e.message ?? 'Greška.')
    } finally {
      setPending(false)
    }
  }
  return (
    <Button onClick={generate} disabled={pending} variant="outline" className="gap-2">
      {pending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
      Generiraj sad (AI)
    </Button>
  )
}
