'use client'

import { useState, useEffect, useCallback } from 'react'
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

export default function DailyLessonPage() {
  const { id } = useParams()
  const router = useRouter()
  const dayNumber = parseInt(id as string, 10)

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

      // Fetch lesson
      const { data: lessonData, error } = await supabase
        .from('lessons')
        .select('*')
        .eq('day_number', dayNumber)
        .single()

      if (error || !lessonData) {
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
        .single()

      setIsCompleted(!!progress)

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

  async function markComplete() {
    if (isCompleted || markingComplete || !lesson) return
    setMarkingComplete(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { error } = await supabase
        .from('progress')
        .upsert({ user_id: user.id, lesson_id: lesson.id }, { onConflict: 'user_id,lesson_id' })

      if (error) throw error

      setIsCompleted(true)
      toast.success('Lekcija označena kao završena! 🎉')

      // Auto-navigate to next day after a moment
      if (nextDay) {
        setTimeout(() => router.push(`/portal/dan/${nextDay}`), 1500)
      }
    } catch (err) {
      console.error(err)
      toast.error('Greška pri bilježenju napretka.')
    } finally {
      setMarkingComplete(false)
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

      {/* Video */}
      {videoUrl ? (
        <VideoPlayer
          src={videoUrl}
          title={lesson.title}
          className="mb-8"
          onEnded={markComplete}
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
            onClick={markComplete}
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
