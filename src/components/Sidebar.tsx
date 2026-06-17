'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, Lock, PlayCircle, ChevronDown, ChevronRight } from 'lucide-react'
import { useState } from 'react'

interface Lesson {
  id: string
  day_number: number
  title: string
  section: string
  duration_seconds?: number
}

interface SidebarProps {
  lessons: Lesson[]
  completedLessonIds: string[]
  currentLessonId?: string
  totalDays?: number
}

const SECTIONS = [
  { key: 'priprema', label: 'Priprema', days: '0' },
  { key: '1-30', label: 'Tjedan 1–4', days: '1–30' },
  { key: '31-60', label: 'Tjedan 5–8', days: '31–60' },
  { key: '61-90', label: 'Tjedan 9–13', days: '61–90' },
]

function formatDuration(seconds?: number): string {
  if (!seconds) return ''
  const m = Math.floor(seconds / 60)
  return `${m} min`
}

export default function Sidebar({ lessons, completedLessonIds, currentLessonId, totalDays = 90 }: SidebarProps) {
  const pathname = usePathname()
  const completedSet = new Set(completedLessonIds)
  const completedCount = completedLessonIds.length
  const [openSections, setOpenSections] = useState<Set<string>>(new Set(['1-30', 'priprema']))

  const toggleSection = (key: string) => {
    setOpenSections(prev => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  return (
    <aside className="flex flex-col h-full bg-navy-100 border-r border-white/10 w-72 shrink-0">
      {/* Header */}
      <div className="p-5 border-b border-white/10">
        <Link href="/portal" className="block mb-3">
          <Image src="/logo/fincoach-logo-vertical.svg" alt="FinCoach VIP" width={36} height={50} />
        </Link>
        <div className="space-y-1.5">
          <div className="flex justify-between text-sm">
            <span className="text-white/60">Napredak</span>
            <span className="text-gold font-semibold">{completedCount}/{totalDays} dana</span>
          </div>
          <Progress value={completedCount} max={totalDays} />
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-2">
        {/* Dashboard link */}
        <Link
          href="/portal"
          className={cn(
            'flex items-center gap-3 px-4 py-3 text-sm transition-colors hover:bg-white/5',
            pathname === '/portal' ? 'text-gold bg-gold/10' : 'text-white/70'
          )}
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
          </svg>
          Dashboard
        </Link>

        {SECTIONS.map(section => {
          const sectionLessons = lessons.filter(l => l.section === section.key)
          if (sectionLessons.length === 0) return null

          const sectionCompleted = sectionLessons.filter(l => completedSet.has(l.id)).length
          const isOpen = openSections.has(section.key)

          return (
            <div key={section.key}>
              <button
                onClick={() => toggleSection(section.key)}
                className="w-full flex items-center justify-between px-4 py-3 text-xs font-semibold uppercase tracking-widest text-white/40 hover:text-white/70 transition-colors"
              >
                <span>{section.label} {section.days !== '0' && `(Dani ${section.days})`}</span>
                <div className="flex items-center gap-2">
                  <span className="text-white/30">{sectionCompleted}/{sectionLessons.length}</span>
                  {isOpen ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                </div>
              </button>

              {isOpen && (
                <div>
                  {sectionLessons
                    .sort((a, b) => a.day_number - b.day_number)
                    .map(lesson => {
                      const isCompleted = completedSet.has(lesson.id)
                      const isCurrent = lesson.id === currentLessonId || pathname === `/portal/dan/${lesson.day_number}`
                      const isLocked = !isCompleted && lesson.day_number > completedCount + 2

                      return (
                        <div key={lesson.id}>
                          {isLocked ? (
                            <div className="flex items-center gap-3 px-4 py-2.5 opacity-40 cursor-not-allowed">
                              <Lock className="w-4 h-4 shrink-0 text-white/30" />
                              <div className="min-w-0">
                                <p className="text-xs text-white/40 truncate">
                                  Dan {lesson.day_number} — {lesson.title}
                                </p>
                              </div>
                            </div>
                          ) : (
                            <Link
                              href={`/portal/dan/${lesson.day_number}`}
                              className={cn(
                                'flex items-center gap-3 px-4 py-2.5 text-sm transition-colors hover:bg-white/5',
                                isCurrent ? 'bg-gold/10 border-r-2 border-gold' : '',
                                isCompleted ? 'text-white/50' : 'text-white/80'
                              )}
                            >
                              {isCompleted ? (
                                <CheckCircle className="w-4 h-4 shrink-0 text-green-400" />
                              ) : isCurrent ? (
                                <PlayCircle className="w-4 h-4 shrink-0 text-gold" />
                              ) : (
                                <div className="w-4 h-4 shrink-0 rounded-full border border-white/20" />
                              )}
                              <div className="min-w-0 flex-1">
                                <p className="text-xs truncate">
                                  <span className="text-white/40">Dan {lesson.day_number} </span>
                                  {lesson.title}
                                </p>
                                {lesson.duration_seconds && (
                                  <p className="text-xs text-white/30">{formatDuration(lesson.duration_seconds)}</p>
                                )}
                              </div>
                            </Link>
                          )}
                        </div>
                      )
                    })}
                </div>
              )}
            </div>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-white/10">
        <Link
          href="/portal/certifikat"
          className={cn(
            'flex items-center gap-2 text-sm transition-colors',
            completedCount >= totalDays ? 'text-gold hover:text-gold-300' : 'text-white/30 cursor-not-allowed'
          )}
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          {completedCount >= totalDays ? 'Preuzmi certifikat' : 'Certifikat (završi tečaj)'}
        </Link>
      </div>
    </aside>
  )
}