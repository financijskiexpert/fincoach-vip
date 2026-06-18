'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Plus, Pencil, Trash2, ChevronUp, ChevronDown, Save, X } from 'lucide-react'
import { toast } from 'sonner'

interface Lesson {
  id: string
  title: string
  description: string | null
  day_number: number
  video_url: string | null
  duration_seconds: number | null
  is_published: boolean
}

export default function AdminLekcije() {
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    title: '',
    description: '',
    day_number: '',
    video_url: '',
    duration_seconds: '',
    is_published: true,
  })

  useEffect(() => {
    fetchLessons()
  }, [])

  async function fetchLessons() {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/lekcije')
      const data = await res.json()
      setLessons(data.lessons ?? [])
    } catch {
      toast.error('Greška pri dohvaćanju lekcija.')
    } finally {
      setLoading(false)
    }
  }

  function startEdit(lesson: Lesson) {
    setEditingId(lesson.id)
    setForm({
      title: lesson.title,
      description: lesson.description ?? '',
      day_number: lesson.day_number.toString(),
      video_url: lesson.video_url ?? '',
      duration_seconds: lesson.duration_seconds?.toString() ?? '',
      is_published: lesson.is_published,
    })
    setShowForm(true)
  }

  function startNew() {
    setEditingId(null)
    const nextDay = lessons.length > 0 ? Math.max(...lessons.map(l => l.day_number)) + 1 : 1
    setForm({
      title: '',
      description: '',
      day_number: nextDay.toString(),
      video_url: '',
      duration_seconds: '',
      is_published: true,
    })
    setShowForm(true)
  }

  async function saveLesson() {
    if (!form.title || !form.day_number) {
      toast.error('Naslov i broj dana su obavezni.')
      return
    }

    try {
      const payload = {
        id: editingId,
        title: form.title,
        description: form.description || null,
        day_number: parseInt(form.day_number),
        video_url: form.video_url || null,
        duration_seconds: form.duration_seconds ? parseInt(form.duration_seconds) : null,
        is_published: form.is_published,
      }

      const res = await fetch('/api/admin/lekcije', {
        method: editingId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!res.ok) throw new Error()
      toast.success(editingId ? 'Lekcija ažurirana.' : 'Lekcija dodana.')
      setShowForm(false)
      setEditingId(null)
      fetchLessons()
    } catch {
      toast.error('Greška pri snimanju.')
    }
  }

  async function deleteLesson(id: string) {
    if (!confirm('Jesi siguran/na da želiš obrisati ovu lekciju?')) return
    try {
      const res = await fetch(`/api/admin/lekcije?id=${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error()
      toast.success('Lekcija obrisana.')
      fetchLessons()
    } catch {
      toast.error('Greška pri brisanju.')
    }
  }

  async function togglePublish(lesson: Lesson) {
    try {
      const res = await fetch('/api/admin/lekcije', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...lesson, is_published: !lesson.is_published }),
      })
      if (!res.ok) throw new Error()
      fetchLessons()
    } catch {
      toast.error('Greška.')
    }
  }

  const published = lessons.filter(l => l.is_published).length
  const unpublished = lessons.filter(l => !l.is_published).length

  return (
    <div className="max-w-7xl mx-auto p-6 lg:p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Lekcije</h1>
          <p className="text-white/50 mt-1">
            {published} objavljenih · {unpublished} neobjavljenih · {lessons.length} ukupno
          </p>
        </div>
        <Button onClick={startNew} className="gap-2">
          <Plus className="w-4 h-4" />
          Nova lekcija
        </Button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-navy-50 border border-gold/20 rounded-2xl p-6 mb-8">
          <h2 className="text-lg font-bold text-white mb-6">
            {editingId ? 'Uredi lekciju' : 'Nova lekcija'}
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm text-white/50 mb-1.5">Naslov *</label>
              <Input
                value={form.title}
                onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                placeholder="npr. Uvod u financijsku slobodu"
              />
            </div>
            <div>
              <label className="block text-sm text-white/50 mb-1.5">Broj dana *</label>
              <Input
                type="number"
                value={form.day_number}
                onChange={e => setForm(f => ({ ...f, day_number: e.target.value }))}
                placeholder="1"
                min="0"
                max="90"
              />
            </div>
            <div>
              <label className="block text-sm text-white/50 mb-1.5">Trajanje (sekunde)</label>
              <Input
                type="number"
                value={form.duration_seconds}
                onChange={e => setForm(f => ({ ...f, duration_seconds: e.target.value }))}
                placeholder="600"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm text-white/50 mb-1.5">Video URL (Cloudflare R2)</label>
              <Input
                value={form.video_url}
                onChange={e => setForm(f => ({ ...f, video_url: e.target.value }))}
                placeholder="https://..."
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm text-white/50 mb-1.5">Opis</label>
              <textarea
                value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                placeholder="Kratki opis lekcije..."
                rows={3}
                className="w-full bg-navy border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-gold/40 resize-none"
              />
            </div>
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="is_published"
                checked={form.is_published}
                onChange={e => setForm(f => ({ ...f, is_published: e.target.checked }))}
                className="w-4 h-4 accent-[#D4AF37]"
              />
              <label htmlFor="is_published" className="text-sm text-white/70">Objavljeno (vidljivo studentima)</label>
            </div>
          </div>
          <div className="flex gap-3 mt-6">
            <Button onClick={saveLesson} className="gap-2">
              <Save className="w-4 h-4" />
              Spremi
            </Button>
            <Button variant="ghost" onClick={() => { setShowForm(false); setEditingId(null) }} className="gap-2">
              <X className="w-4 h-4" />
              Odustani
            </Button>
          </div>
        </div>
      )}

      {/* Lessons table */}
      <div className="bg-navy-50 border border-white/10 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-white/30">Učitavam...</div>
        ) : lessons.length === 0 ? (
          <div className="p-12 text-center text-white/30">
            Još nema lekcija. Dodaj prvu!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 bg-white/2">
                  <th className="text-left px-4 py-3 text-white/40 font-medium w-12">Dan</th>
                  <th className="text-left px-4 py-3 text-white/40 font-medium">Naslov</th>
                  <th className="text-left px-4 py-3 text-white/40 font-medium hidden md:table-cell">Trajanje</th>
                  <th className="text-left px-4 py-3 text-white/40 font-medium">Status</th>
                  <th className="text-right px-4 py-3 text-white/40 font-medium">Akcije</th>
                </tr>
              </thead>
              <tbody>
                {lessons.map((lesson) => (
                  <tr key={lesson.id} className="border-b border-white/5 hover:bg-white/2 transition-colors">
                    <td className="px-4 py-3">
                      <span className="text-gold font-bold text-base">{lesson.day_number}</span>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-white font-medium">{lesson.title}</p>
                      {lesson.description && (
                        <p className="text-white/30 text-xs mt-0.5 truncate max-w-xs">{lesson.description}</p>
                      )}
                    </td>
                    <td className="px-4 py-3 text-white/40 hidden md:table-cell">
                      {lesson.duration_seconds
                        ? `${Math.floor(lesson.duration_seconds / 60)} min`
                        : '—'}
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => togglePublish(lesson)}>
                        {lesson.is_published ? (
                          <Badge className="bg-green-500/10 text-green-400 border-green-500/20 cursor-pointer hover:bg-green-500/20 transition-colors">
                            Objavljeno
                          </Badge>
                        ) : (
                          <Badge className="bg-white/5 text-white/40 border-white/10 cursor-pointer hover:bg-white/10 transition-colors">
                            Skriveno
                          </Badge>
                        )}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => startEdit(lesson)}
                          className="p-2 text-white/40 hover:text-gold transition-colors"
                          title="Uredi"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteLesson(lesson.id)}
                          className="p-2 text-white/40 hover:text-red-400 transition-colors"
                          title="Obriši"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
