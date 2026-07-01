'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Plus, Pencil, Trash2, Save, X, Star, Eye, EyeOff, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

interface Testimonial {
  id: string
  full_name: string
  role: string | null
  quote: string
  rating: number
  is_published: boolean
  created_at: string
}

const EMPTY = { full_name: '', role: '', quote: '', rating: 5 }

export default function AdminTestimonials() {
  const [items, setItems] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState(EMPTY)
  const [saving, setSaving] = useState(false)

  useEffect(() => { fetchAll() }, [])

  async function fetchAll() {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/testimonials')
      const data = await res.json()
      setItems(data.testimonials ?? [])
    } catch {
      toast.error('Greška pri dohvaćanju.')
    } finally {
      setLoading(false)
    }
  }

  function startNew() {
    setEditingId(null)
    setForm(EMPTY)
    setShowForm(true)
  }

  function startEdit(t: Testimonial) {
    setEditingId(t.id)
    setForm({ full_name: t.full_name, role: t.role ?? '', quote: t.quote, rating: t.rating })
    setShowForm(true)
  }

  async function save() {
    if (!form.full_name.trim() || !form.quote.trim()) {
      toast.error('Ime i citat su obavezni.')
      return
    }
    setSaving(true)
    try {
      const res = await fetch('/api/admin/testimonials', {
        method: editingId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingId ? { id: editingId, ...form } : form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      toast.success(editingId ? 'Recenzija ažurirano.' : 'Recenzija dodano.')
      setShowForm(false)
      setEditingId(null)
      fetchAll()
    } catch (e: any) {
      toast.error(e.message ?? 'Greška.')
    } finally {
      setSaving(false)
    }
  }

  async function togglePublish(t: Testimonial) {
    try {
      const res = await fetch('/api/admin/testimonials', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: t.id, is_published: !t.is_published }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      toast.success(t.is_published ? 'Skriveno.' : 'Objavljeno na stranici!')
      fetchAll()
    } catch (e: any) {
      toast.error(e.message ?? 'Greška.')
    }
  }

  async function del(id: string) {
    if (!confirm('Obriši recenziju?')) return
    try {
      await fetch(`/api/admin/testimonials?id=${id}`, { method: 'DELETE' })
      toast.success('Recenzija obrisano.')
      fetchAll()
    } catch { toast.error('Greška.') }
  }

  const published = items.filter(i => i.is_published).length

  return (
    <div className="max-w-4xl mx-auto p-6 lg:p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Recenzije</h1>
          <p className="text-white/50 mt-1">{published} objavljenih · {items.length} ukupno</p>
        </div>
        <Button onClick={startNew} className="gap-2">
          <Plus className="w-4 h-4" />
          Dodaj recenziju
        </Button>
      </div>

      {/* Preview note */}
      <div className="bg-gold/5 border border-gold/20 rounded-xl px-4 py-3 mb-6 text-sm text-white/60">
        💡 Objavljene recenzije se prikazuju u karuselu na glavnoj stranici (2 istovremeno, mijenjaju se svakih 10 sekundi).
      </div>

      {showForm && (
        <div className="bg-navy-50 border border-gold/20 rounded-2xl p-6 mb-8">
          <h2 className="text-lg font-bold text-white mb-6">
            {editingId ? 'Uredi recenziju' : 'Novo recenziju'}
          </h2>
          <div className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-white/50 mb-1.5">Ime i prezime *</label>
                <Input
                  value={form.full_name}
                  onChange={e => setForm(f => ({ ...f, full_name: e.target.value }))}
                  placeholder="npr. Marija K."
                />
              </div>
              <div>
                <label className="block text-sm text-white/50 mb-1.5">Zanimanje, grad</label>
                <Input
                  value={form.role}
                  onChange={e => setForm(f => ({ ...f, role: e.target.value }))}
                  placeholder="npr. Učiteljica, Split"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-white/50 mb-1.5">Ocjena</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map(n => (
                  <button
                    key={n}
                    onClick={() => setForm(f => ({ ...f, rating: n }))}
                    className="transition-transform hover:scale-110"
                  >
                    <Star
                      className="w-7 h-7 transition-colors"
                      style={{
                        fill: n <= form.rating ? '#D4AF37' : 'transparent',
                        color: n <= form.rating ? '#D4AF37' : 'rgba(255,255,255,0.2)',
                      }}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm text-white/50 mb-1.5">Citat / recenziju *</label>
              <textarea
                value={form.quote}
                onChange={e => setForm(f => ({ ...f, quote: e.target.value }))}
                placeholder="Što je student rekao o programu..."
                rows={4}
                className="w-full bg-navy border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-gold/40 resize-none"
              />
            </div>

            {/* Preview */}
            {form.quote && (
              <div className="border border-white/10 rounded-xl p-4 bg-navy">
                <p className="text-xs text-white/30 mb-3 uppercase tracking-wider">Pregled</p>
                <div className="flex gap-0.5 mb-3">
                  {Array(form.rating).fill(0).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-gold text-gold" />
                  ))}
                </div>
                <p className="text-white/70 text-sm italic leading-relaxed mb-3">&ldquo;{form.quote}&rdquo;</p>
                <p className="text-white font-semibold text-sm">{form.full_name || '—'}</p>
                {form.role && <p className="text-white/40 text-xs mt-0.5">{form.role}</p>}
              </div>
            )}
          </div>

          <div className="flex gap-3 mt-6">
            <Button onClick={save} disabled={saving} className="gap-2">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Spremi
            </Button>
            <Button variant="ghost" onClick={() => { setShowForm(false); setEditingId(null) }} className="gap-2">
              <X className="w-4 h-4" />Odustani
            </Button>
          </div>
        </div>
      )}

      <div className="bg-navy-50 border border-white/10 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-white/30">Učitavam...</div>
        ) : items.length === 0 ? (
          <div className="p-12 text-center text-white/30">
            Još nema recenzija. Dodaj prvu recenziju klikom na gumb gore.
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {items.map(t => (
              <div key={t.id} className="px-6 py-4 flex items-start gap-4 hover:bg-white/2 transition-colors">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <p className="text-white font-medium text-sm">{t.full_name}</p>
                    {t.role && <span className="text-white/40 text-xs">· {t.role}</span>}
                    {t.is_published ? (
                      <Badge className="bg-green-500/10 text-green-400 border-green-500/20 text-xs">Objavljeno</Badge>
                    ) : (
                      <Badge className="bg-white/5 text-white/40 border-white/10 text-xs">Draft</Badge>
                    )}
                  </div>
                  <div className="flex gap-0.5 mb-1.5">
                    {Array(t.rating).fill(0).map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-gold text-gold" />
                    ))}
                  </div>
                  <p className="text-white/50 text-xs leading-relaxed italic line-clamp-2">&ldquo;{t.quote}&rdquo;</p>
                </div>
                <div className="flex items-center gap-1 shrink-0 mt-1">
                  <button
                    onClick={() => togglePublish(t)}
                    title={t.is_published ? 'Sakrij' : 'Objavi'}
                    className={`p-2 transition-colors ${t.is_published ? 'text-green-400 hover:text-white/40' : 'text-white/30 hover:text-green-400'}`}
                  >
                    {t.is_published ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                  <button onClick={() => startEdit(t)} className="p-2 text-white/30 hover:text-gold transition-colors">
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button onClick={() => del(t.id)} className="p-2 text-white/30 hover:text-red-400 transition-colors">
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
