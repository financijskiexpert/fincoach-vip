'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import VideoPlayer from '@/components/VideoPlayer'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'

interface Lesson {
  id: string
  day_number: number
  title: string
  description: string | null
  video_key: string | null
  duration_seconds: number | null
  section: string
  course_id: string
}

function LessonNotes({ lessonId }: { lessonId: string }) {
  const [content, setContent] = useState('')
  const [savedContent, setSavedContent] = useState('')
  const [saving, setSaving] = useState(false)
  const [savedAt, setSavedAt] = useState<string | null>(null)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    let cancelled = false
    fetch(`/api/notes?lesson_id=${lessonId}`)
      .then(r => r.json())
      .then(({ note }) => {
        if (cancelled) return
        const c = note?.content ?? ''
        setContent(c)
        setSavedContent(c)
        if (note?.updated_at) setSavedAt(note.updated_at)
        setLoaded(true)
      })
    return () => { cancelled = true }
  }, [lessonId])

  async function save() {
    if (saving) return
    setSaving(true)
    try {
      const res = await fetch('/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lesson_id: lessonId, content }),
      })
      const data = await res.json()
      if (data.ok) {
        setSavedAt(data.updated_at)
        setSavedContent(content)
        toast.success('Bilješka spremljena.')
      } else {
        toast.error(data.error ?? 'Greška pri spremanju.')
      }
    } catch {
      toast.error('Greška pri spremanju.')
    } finally {
      setSaving(false)
    }
  }

  if (!loaded) return null

  const isDirty = content !== savedContent

  return (
    <div className="bg-navy-50 border border-white/10 rounded-xl p-6 mb-8">
      <div className="flex items-center justify-between mb-2">
        <h2 className="font-semibold text-white text-base">Moje bilješke</h2>
        <span className="text-xs text-white/30">
          {saving ? 'Sprema se...' : isDirty ? '● Nespremljeno' : savedAt ? `✓ Spremljeno ${new Date(savedAt).toLocaleString('hr-HR', { day: 'numeric', month: 'numeric', hour: '2-digit', minute: '2-digit' })}` : ''}
        </span>
      </div>
      <p className="text-white/40 text-xs mb-3">
        Tijekom gledanja videa zapiši svoje misli, zadatke i uvide. Klikni <strong className="text-gold">Spremi</strong> kad završiš.
        Sve svoje bilješke možeš pregledati na stranici <Link href="/portal/biljeske" className="text-gold hover:underline">Moje bilješke</Link>.
      </p>
      <textarea
        value={content}
        onChange={e => setContent(e.target.value)}
        placeholder="Napiši svoje misli, zadatke ili uvide za ovaj dan..."
        rows={5}
        className="w-full bg-navy border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-gold/40 resize-y"
      />
      <div className="flex items-center justify-end gap-2 mt-3">
        {isDirty && (
          <button
            onClick={() => { setContent(savedContent) }}
            className="text-white/40 hover:text-white text-xs px-3 py-2"
          >
            Odustani
          </button>
        )}
        <Button
          onClick={save}
          disabled={saving || !isDirty}
          size="sm"
          className="gap-2"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : '💾'}
          Spremi bilješku
        </Button>
      </div>
    </div>
  )
}

export default function DailyLessonPage() {
  const { id } = useParams()
  const router = useRouter()
  const dayNumber = parseInt(id as string, 10)

  const autoMarkedRef = useRef(false)
  const [lesson, setLesson] = useState<Lesson | null>(null)
  const [videoUrl, setVideoUrl] = useState<string | null>(null)
  const [isCompleted, setIsCompleted] = useState(false)
  const [markingComplete, setMarkingComplete] = useState(false)
  const [loading, setLoading] = useState(true)
  const [prevDay, setPrevDay] = useState<number | null>(null)
  const [nextDay, setNextDay] = useState<number | null>(null)

  const supabase = createClient()

  const fetchLesson = useCallback(async () => {
    setLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/prijava')
        return
      }

      // Fetch lesson via API (bypasses RLS for admin users)
      const lessonRes = await fetch(`/api/lesson?day=${dayNumber}`)
      if (!lessonRes.ok) {
        toast.error('Lekcija nije pronađena.')
        router.push('/portal')
        return
      }
      const { lesson: lessonData } = await lessonRes.json()
      if (!lessonData) {
        toast.error('Lekcija nije pronađena.')
        router.push('/portal')
        return
      }

      setLesson(lessonData)

      // Check if completed
      const { data: progress } = await supabase
        .from('progress')
        .select('id')
        .eq('user_id', user.id)
        .eq('lesson_id', lessonData.id)
        .maybeSingle()

      setIsCompleted(!!progress)
      autoMarkedRef.current = !!progress

      // Get prev/next days
      const { data: neighbors } = await supabase
        .from('lessons')
        .select('day_number')
        .eq('course_id', lessonData.course_id)
        .order('day_number')

      if (neighbors) {
        const idx = neighbors.findIndex(n => n.day_number === dayNumber)
        setPrevDay(idx > 0 ? neighbors[idx - 1].day_number : null)
        setNextDay(idx < neighbors.length - 1 ? neighbors[idx + 1].day_number : null)
      }

      // Fetch signed video URL if lesson has a video
      if (lessonData.video_key) {
        const res = await fetch(`/api/video-url?key=${encodeURIComponent(lessonData.video_key)}`)
        if (res.ok) {
          const { url } = await res.json()
          setVideoUrl(url)
        }
      }
    } catch (err) {
      console.error(err)
      toast.error('Greška pri učitavanju lekcije.')
    } finally {
      setLoading(false)
    }
  }, [dayNumber, router, supabase])

  useEffect(() => {
    fetchLesson()
  }, [fetchLesson])

  async function markComplete(silent = false) {
    if (isCompleted || markingComplete || !lesson) return
    setMarkingComplete(true)
    try {
      const res = await fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lesson_id: lesson.id }),
      })
      if (!res.ok) throw new Error('save failed')

      setIsCompleted(true)
      if (!silent) {
        toast.success('Lekcija označena kao završena! 🎉')
        if (nextDay) {
          setTimeout(() => router.push(`/portal/dan/${nextDay}`), 1500)
        }
      } else {
        toast.success('Napredak zabilježen automatski (gledao si > 80%).')
      }
    } catch (err) {
      console.error(err)
      if (!silent) toast.error('Greška pri bilježenju napretka.')
    } finally {
      setMarkingComplete(false)
    }
  }

  // Auto-mark ko user pogleda >= 80% videa
  function handleVideoProgress(percent: number) {
    if (percent >= 80 && !autoMarkedRef.current && !isCompleted) {
      autoMarkedRef.current = true
      markComplete(true)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 text-gold animate-spin" />
      </div>
    )
  }

  if (!lesson) return null

  const sectionLabels: Record<string, string> = {
    priprema: 'Priprema',
    '1-30': 'Faza 1: Budžetiranje',
    '31-60': 'Faza 2: Štednja',
    '61-90': 'Faza 3: Investiranje',
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-white/40 mb-6">
        <Link href="/portal" className="hover:text-white transition-colors">Dashboard</Link>
        <ChevronRight className="w-3 h-3" />
        <span>{sectionLabels[lesson.section] ?? lesson.section}</span>
        <ChevronRight className="w-3 h-3" />
        <span className="text-white/70">Dan {lesson.day_number}</span>
      </div>

      {/* Title */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <Badge className="bg-navy-50 text-white/60 border-white/10">Dan {lesson.day_number}</Badge>
          <Badge className="bg-gold/10 text-gold border-gold/30">{sectionLabels[lesson.section]}</Badge>
          {isCompleted && <Badge className="bg-green-500/10 text-green-400 border-green-500/20">Završeno ✓</Badge>}
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white">{lesson.title}</h1>
        {lesson.duration_seconds && (
          <p className="text-white/40 text-sm mt-1">{Math.floor(lesson.duration_seconds / 60)} minuta</p>
        )}
      </div>

      {/* Calculator banner */}
      {(() => {
        const calcMap: Record<number, { label: string; tab: number }> = {
          36: { label: 'Kalkulator proračuna', tab: 0 },
          37: { label: 'Kalkulator proračuna', tab: 0 },
          38: { label: 'Kalkulator proračuna', tab: 0 },
          39: { label: 'Kalkulator hitnog fonda', tab: 1 },
          52: { label: 'Kalkulator hitnog fonda', tab: 1 },
          54: { label: 'Kalkulator hitnog fonda', tab: 1 },
          29: { label: 'Kalkulator otplate duga', tab: 2 },
          42: { label: 'Kalkulator otplate duga', tab: 2 },
          43: { label: 'Kalkulator otplate duga', tab: 2 },
          74: { label: 'Kalkulator složene kamate', tab: 3 },
          80: { label: 'Kalkulator složene kamate', tab: 3 },
          85: { label: 'Kalkulator složene kamate', tab: 3 },
        }
        const calc = calcMap[dayNumber]
        if (!calc) return null
        return (
          <Link
            href={`/portal/kalkulatori?tab=${calc.tab}`}
            className="flex items-center justify-between bg-gold/10 border border-gold/30 rounded-xl px-4 py-3 mb-6 hover:bg-gold/20 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gold/20 flex items-center justify-center">
                <svg className="w-4 h-4 text-gold" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 15.75V18m-7.5-6.75h.008v.008H8.25v-.008Zm0 2.25h.008v.008H8.25V13.5Zm0 2.25h.008v.008H8.25v-.008Zm0 2.25h.008v.008H8.25V18Zm2.498-6.75h.007v.008h-.007v-.008Zm0 2.25h.007v.008h-.007V13.5Zm0 2.25h.007v.008h-.007v-.008Zm0 2.25h.007v.008h-.007V18Zm2.504-6.75h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V13.5Zm0 2.25h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V18Zm2.498-6.75h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V13.5ZM8.25 6h7.5v2.25h-7.5V6ZM12 2.25c-1.892 0-3.758.11-5.593.322C5.307 2.7 4.5 3.638 4.5 4.716V19.5a2.25 2.25 0 0 0 2.25 2.25h10.5a2.25 2.25 0 0 0 2.25-2.25V4.716c0-1.078-.806-2.014-1.857-2.144A48.5 48.5 0 0 0 12 2.25Z" />
                </svg>
              </div>
              <div>
                <p className="text-gold font-semibold text-sm">{calc.label}</p>
                <p className="text-white/50 text-xs">Isprobaj uz ovu lekciju</p>
              </div>
            </div>
            <svg className="w-4 h-4 text-gold/50" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        )
      })()}

      {/* Video */}
      {videoUrl ? (
        <VideoPlayer
          src={videoUrl}
          title={lesson.title}
          className="mb-8"
          onProgress={handleVideoProgress}
          onEnded={() => markComplete(false)}
        />
      ) : (
        <div className="aspect-video bg-navy-50 border border-white/10 rounded-2xl flex items-center justify-center mb-8">
          <div className="text-center text-white/30">
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-3">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                <path d="M6.3 2.841A1.5 1.5 0 004 4.11v11.78a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
              </svg>
            </div>
            <p className="text-sm">Video uskoro dostupan</p>
          </div>
        </div>
      )}

      {/* Description */}
      {lesson.description && (
        <div className="bg-navy-50 border border-white/10 rounded-xl p-6 mb-8">
          <h2 className="font-semibold text-white mb-3">O ovoj lekciji</h2>
          <p className="text-white/60 leading-relaxed whitespace-pre-line">{lesson.description}</p>
        </div>
      )}

      {/* Complete button */}
      <div className="flex items-center justify-between mb-8">
        {!isCompleted ? (
          <Button
            onClick={() => markComplete(false)}
            loading={markingComplete}
            size="lg"
            className="flex items-center gap-2"
          >
            <CheckCircle className="w-5 h-5" />
            Označi kao završeno
          </Button>
        ) : (
          <div className="flex items-center gap-2 text-green-400 font-semibold">
            <CheckCircle className="w-5 h-5" />
            Lekcija završena!
          </div>
        )}
      </div>

      {/* Notes */}
      <LessonNotes lessonId={lesson.id} />

      {/* Navigation */}
      <div className="flex items-center justify-between border-t border-white/10 pt-6">
        {prevDay ? (
          <Link href={`/portal/dan/${prevDay}`}>
            <Button variant="outline" className="flex items-center gap-2">
              <ChevronLeft className="w-4 h-4" />
              Dan {prevDay}
            </Button>
          </Link>
        ) : (
          <div />
        )}

        <Link href="/portal">
          <Button variant="ghost">Dashboard</Button>
        </Link>

        {nextDay ? (
          <Link href={`/portal/dan/${nextDay}`}>
            <Button variant="outline" className="flex items-center gap-2">
              Dan {nextDay}
              <ChevronRight className="w-4 h-4" />
            </Button>
          </Link>
        ) : (
          <div />
        )}
      </div>
    </div>
  )
}
