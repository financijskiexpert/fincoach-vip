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
  video_key: string | null
  duration_seconds: number | null
  section: string | null
  sort_order: number | null
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
    video_key: '',
    duration_seconds: '',
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

  function autoVideoKey(day: string) {
    const n = parseInt(day)
    return isNaN(n) ? '' : `courses/volim-svojnovac/day-${n}.mp4`
  }

  function startEdit(lesson: Lesson) {
    setEditingId(lesson.id)
    setForm({
      title: lesson.title,
      description: lesson.description ?? '',
      day_number: lesson.day_number.toString(),
      video_key: lesson.video_key ?? autoVideoKey(lesson.day_number.toString()),
      duration_seconds: lesson.duration_seconds?.toString() ?? '',
    })
    setShowForm(true)
  }

  function startNew() {
    setEditingId(null)
    const nextDay = lessons.length > 0 ? Math.max(...lessons.map(l => l.day_number)) + 1 : 1
    const nextDayStr = nextDay.toString()
    setForm({
      title: '',
      description: '',
      day_number: nextDayStr,
      video_key: autoVideoKey(nextDayStr),
      duration_seconds: '',
    })
    setShowForm(true)
  }

  async function saveLesson() {
    if (!form.title || !form.day_number) {
      toast.error('Naslov i broj dana su obavezni.')
      return
    }

    try {
      const dayNum = parseInt(form.day_number)
      const payload = {
        id: editingId,
        title: form.title,
        description: form.description || null,
        day_number: dayNum,
        video_key: form.video_key || autoVideoKey(form.day_number) || null,
        duration_seconds: form.duration_seconds ? parseInt(form.duration_seconds) : null,
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

  const totalCount = lessons.length

  return (
    <div className="max-w-7xl mx-auto p-6 lg:p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Lekcije</h1>
          <p className="text-white/50 mt-1">
            {totalCount} lekcija ukupno
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
                onChange={e => {
                  const val = e.target.value
                  setForm(f => ({
                    ...f,
                    day_number: val,
                    video_key: f.video_key === autoVideoKey(f.day_number) || f.video_key === ''
                      ? autoVideoKey(val)
                      : f.video_key,
                  }))
                }}
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
              <label className="block text-sm text-white/50 mb-1.5">Video Key (R2 ključ za signed URL)</label>
              <Input
                value={form.video_key}
                onChange={e => setForm(f => ({ ...f, video_key: e.target.value }))}
                placeholder="courses/volim-svojnovac/day-1.mp4"
              />
              <p className="text-white/20 text-xs mt-1">Auto-generirano iz broja dana. Mijenjaj samo ako je drugačije.</p>
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
                  <th className="text-left px-4 py-3 text-white/40 font-medium">Sekcija</th>
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
                      <Badge className="bg-white/5 text-white/50 border-white/10">
                        {lesson.section ?? '—'}
                      </Badge>
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
