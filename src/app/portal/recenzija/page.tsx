'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Star, Send, CheckCircle, Loader2, Pencil } from 'lucide-react'
import { toast } from 'sonner'

interface Existing {
  id: string
  full_name: string
  role: string | null
  quote: string
  rating: number
  is_published: boolean
}

export default function RecenzijaPage() {
  const [existing, setExisting] = useState<Existing | null>(null)
  const [loadingInit, setLoadingInit] = useState(true)
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const [form, setForm] = useState({ full_name: '', role: '', quote: '', rating: 5 })

  useEffect(() => {
    fetch('/api/portal/recenzija')
      .then(r => r.json())
      .then(data => {
        if (data.testimonial) {
          setExisting(data.testimonial)
          setForm({
            full_name: data.testimonial.full_name,
            role: data.testimonial.role ?? '',
            quote: data.testimonial.quote,
            rating: data.testimonial.rating,
          })
        }
      })
      .catch(() => {})
      .finally(() => setLoadingInit(false))
  }, [])

  async function submit() {
    if (!form.full_name.trim() || !form.quote.trim()) {
      toast.error('Ime i recenzija su obavezni.')
      return
    }
    setSaving(true)
    try {
      const res = await fetch('/api/portal/recenzija', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setSubmitted(true)
      setEditing(false)
      toast.success('Hvala! Recenzija je primljena.')
    } catch (e: any) {
      toast.error(e.message ?? 'Greška pri slanju.')
    } finally {
      setSaving(false)
    }
  }

  if (loadingInit) {
    return (
      <div className="max-w-2xl mx-auto p-6 lg:p-8 flex items-center justify-center min-h-64">
        <Loader2 className="w-6 h-6 animate-spin text-gold" />
      </div>
    )
  }

  const showSuccess = (existing && !editing) || submitted

  return (
    <div className="max-w-2xl mx-auto p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Ostavi recenziju</h1>
        <p className="text-white/50">
          Tvoje iskustvo pomaže drugima da donesu pravu odluku. Recenzija će biti objavljena nakon pregleda.
        </p>
      </div>

      {showSuccess ? (
        <div className="bg-navy border border-white/10 rounded-2xl p-8">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center shrink-0">
              <CheckCircle className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <p className="text-white font-semibold mb-1">
                {existing?.is_published ? 'Recenzija je objavljena!' : 'Recenzija je primljena — hvala!'}
              </p>
              <p className="text-white/50 text-sm">
                {existing?.is_published
                  ? 'Tvoja recenzija je vidljiva na glavnoj stranici.'
                  : 'Pregledati ćemo je i objaviti u kratkom roku.'}
              </p>
            </div>
          </div>

          {/* Pregled submitted recenzije */}
          <div className="bg-navy-50 border border-white/10 rounded-xl p-5 mb-6">
            <div className="flex gap-0.5 mb-3">
              {Array(form.rating).fill(0).map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-gold text-gold" />
              ))}
            </div>
            <p className="text-white/70 text-sm italic leading-relaxed mb-3">&ldquo;{form.quote}&rdquo;</p>
            <p className="text-white font-semibold text-sm">{form.full_name}</p>
            {form.role && <p className="text-white/40 text-xs mt-0.5">{form.role}</p>}
          </div>

          <Button
            variant="ghost"
            onClick={() => { setEditing(true); setSubmitted(false) }}
            className="gap-2 text-white/50 hover:text-white"
          >
            <Pencil className="w-4 h-4" />
            Uredi recenziju
          </Button>
        </div>
      ) : (
        <div className="bg-navy border border-white/10 rounded-2xl p-6 lg:p-8">
          <div className="space-y-5">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-white/50 mb-1.5">Tvoje ime *</label>
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
              <label className="block text-sm text-white/50 mb-2">Ocjena programa</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map(n => (
                  <button
                    key={n}
                    onClick={() => setForm(f => ({ ...f, rating: n }))}
                    className="transition-transform hover:scale-110 active:scale-95"
                  >
                    <Star
                      className="w-8 h-8 transition-colors"
                      style={{
                        fill: n <= form.rating ? '#D4AF37' : 'transparent',
                        color: n <= form.rating ? '#D4AF37' : 'rgba(255,255,255,0.15)',
                      }}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm text-white/50 mb-1.5">Tvoje iskustvo s programom *</label>
              <textarea
                value={form.quote}
                onChange={e => setForm(f => ({ ...f, quote: e.target.value }))}
                placeholder="Što ti se najviše svidjelo? Koji su bili tvoji rezultati? Kome bi preporučio/la program?"
                rows={5}
                className="w-full bg-navy-50 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-gold/40 resize-none"
              />
              <p className="text-white/25 text-xs mt-1.5">{form.quote.length} znakova</p>
            </div>

            {/* Live preview */}
            {form.quote.trim() && (
              <div className="border border-gold/15 rounded-xl p-4 bg-gold/3">
                <p className="text-xs text-gold/50 uppercase tracking-wider mb-3">Pregled kako će izgledati</p>
                <div className="flex gap-0.5 mb-2">
                  {Array(form.rating).fill(0).map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-gold text-gold" />
                  ))}
                </div>
                <p className="text-white/65 text-sm italic leading-relaxed mb-2">&ldquo;{form.quote}&rdquo;</p>
                <p className="text-white text-sm font-semibold">{form.full_name || '—'}</p>
                {form.role && <p className="text-white/40 text-xs">{form.role}</p>}
              </div>
            )}
          </div>

          <div className="flex gap-3 mt-6">
            <Button onClick={submit} disabled={saving} className="gap-2">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              {existing ? 'Ažuriraj recenziju' : 'Pošalji recenziju'}
            </Button>
            {editing && (
              <Button variant="ghost" onClick={() => setEditing(false)} className="text-white/50">
                Odustani
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
