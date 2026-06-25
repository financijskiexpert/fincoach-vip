'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  Users,
  BookOpen,
  Tag,
  UserCheck,
  Link2,
  FileText,
  Mail,
  PlayCircle,
  Home,
  TrendingUp,
  Award,
  CheckCircle,
  Lock,
  ChevronDown,
  ChevronRight,
  LogOut,
  Menu,
  X,
} from 'lucide-react'

interface Lesson {
  id: string
  day_number: number
  title: string
  section: string
  duration_seconds?: number
}

interface PortalSidebarProps {
  role: 'admin' | 'student'
  hasAffiliate: boolean
  lessons: Lesson[]
  completedLessonIds: string[]
  userName?: string
  userEmail?: string
}

const SECTIONS = [
  { key: 'priprema', label: 'Priprema', days: '0' },
  { key: '1-30', label: 'Tjedan 1–4', days: '1–30' },
  { key: '31-60', label: 'Tjedan 5–8', days: '31–60' },
  { key: '61-90', label: 'Tjedan 9–13', days: '61–90' },
]

const ADMIN_NAV = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/studenti', label: 'Studenti', icon: Users },
  { href: '/admin/lekcije', label: 'Lekcije', icon: BookOpen },
  { href: '/admin/kuponi', label: 'Kuponi', icon: Tag },
  { href: '/admin/leadovi', label: 'Leadovi', icon: UserCheck },
  { href: '/admin/affiliate', label: 'Affiliate', icon: Link2 },
  { href: '/admin/blog', label: 'Blog', icon: FileText },
  { href: '/admin/emaili', label: 'Emaili', icon: Mail },
]

function formatDuration(seconds?: number): string {
  if (!seconds) return ''
  const m = Math.floor(seconds / 60)
  return `${m} min`
}

export default function PortalSidebar({
  role,
  hasAffiliate,
  lessons,
  completedLessonIds,
  userName,
  userEmail,
}: PortalSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const completedSet = new Set(completedLessonIds)
  const completedCount = completedLessonIds.length
  const totalDays = 90

  // Desktop collapse state
  const [isExpanded, setIsExpanded] = useState(true)
  // Mobile open state
  const [mobileOpen, setMobileOpen] = useState(false)
  // Section open state for lessons
  const [openSections, setOpenSections] = useState<Set<string>>(new Set(['priprema', '1-30']))
  // Hover expand (when collapsed, hovering expands)
  const hoverTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)

  const toggleSection = (key: string) => {
    setOpenSections(prev => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  const handleMouseEnter = () => {
    if (!isExpanded) {
      if (hoverTimeout.current) clearTimeout(hoverTimeout.current)
      setIsExpanded(true)
    }
  }

  const handleMouseLeave = () => {
    // Collapse after short delay on mouse leave
    hoverTimeout.current = setTimeout(() => {
      setIsExpanded(false)
    }, 200)
  }

  const handleSignOut = async () => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    await supabase.auth.signOut()
    router.push('/prijava')
  }

  const progressPercent = Math.round((completedCount / totalDays) * 100)

  const studentNavItems = [
    { href: '/portal', label: 'Pregled', icon: Home },
    {
      href: '/portal',
      label: `Napredak (${progressPercent}%)`,
      icon: TrendingUp,
    },
    { href: '/portal/certifikat', label: 'Certifikat', icon: Award },
    ...(hasAffiliate
      ? [{ href: '/portal/affiliate', label: 'Affiliate', icon: Link2 }]
      : []),
  ]

  // Shared sidebar content (used for both desktop and mobile)
  function SidebarContent({ collapsed }: { collapsed: boolean }) {
    return (
      <div className="flex flex-col h-full">
        {/* Header / Logo */}
        <div
          className={cn(
            'flex items-center border-b border-white/10 shrink-0',
            collapsed ? 'justify-center px-2 py-4' : 'px-5 py-4 gap-3'
          )}
        >
          <Link href={role === 'admin' ? '/admin' : '/portal'} className="shrink-0">
            {/* Logo mark — always visible */}
            <div className="w-8 h-8 rounded-full bg-[#D4AF37] flex items-center justify-center text-[#0f1e35] font-bold text-sm shrink-0">
              FC
            </div>
          </Link>
          {!collapsed && (
            <span className="text-white font-semibold text-sm truncate">FinCoach VIP</span>
          )}
          {!collapsed && (
            <button
              onClick={() => setIsExpanded(false)}
              className="ml-auto text-white/30 hover:text-white/70 transition-colors"
              aria-label="Collapse sidebar"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-2 scrollbar-thin">
          {role === 'admin' ? (
            <>
              {ADMIN_NAV.map(({ href, label, icon: Icon }) => {
                const isActive = pathname === href
                return (
                  <Link
                    key={href}
                    href={href}
                    title={collapsed ? label : undefined}
                    className={cn(
                      'flex items-center gap-3 py-2.5 text-sm transition-colors',
                      collapsed ? 'justify-center px-2' : 'px-4',
                      isActive
                        ? 'bg-white/10 text-white'
                        : 'text-white/50 hover:text-white hover:bg-white/5'
                    )}
                  >
                    <Icon className="w-5 h-5 shrink-0" />
                    {!collapsed && <span>{label}</span>}
                  </Link>
                )
              })}

              {/* Divider */}
              <div className="my-2 border-t border-white/10" />

              {/* Affiliate kreative */}
              <Link
                href="/portal/affiliate"
                title={collapsed ? 'Affiliate materijali' : undefined}
                className={cn(
                  'flex items-center gap-3 py-2.5 text-sm transition-colors',
                  collapsed ? 'justify-center px-2' : 'px-4',
                  pathname === '/portal/affiliate'
                    ? 'bg-white/10 text-white'
                    : 'text-white/50 hover:text-white hover:bg-white/5'
                )}
              >
                <Link2 className="w-5 h-5 shrink-0" />
                {!collapsed && <span>Affiliate materijali</span>}
              </Link>

              {/* Divider */}
              <div className="my-2 border-t border-white/10" />

              {/* Lesson list for admin */}
              {!collapsed && lessons.length > 0 && (
                <div className="px-4 py-1">
                  <p className="text-xs font-semibold uppercase tracking-widest text-white/30 mb-1">Tečaj</p>
                </div>
              )}
              {!collapsed && lessons.length > 0 && SECTIONS.map(section => {
                const sectionLessons = lessons.filter(l => l.section === section.key)
                if (sectionLessons.length === 0) return null
                const isOpen = openSections.has(section.key)
                return (
                  <div key={section.key}>
                    <button
                      onClick={() => toggleSection(section.key)}
                      className="w-full flex items-center justify-between px-4 py-2 text-xs font-semibold uppercase tracking-widest text-white/30 hover:text-white/60 transition-colors"
                    >
                      <span>{section.label}</span>
                      {isOpen ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                    </button>
                    {isOpen && sectionLessons.sort((a, b) => a.day_number - b.day_number).map(lesson => (
                      <Link
                        key={lesson.id}
                        href={`/portal/dan/${lesson.day_number}`}
                        className={cn(
                          'flex items-center gap-3 px-4 py-1.5 text-xs transition-colors hover:bg-white/5',
                          pathname === `/portal/dan/${lesson.day_number}` ? 'text-[#D4AF37]' : 'text-white/40 hover:text-white/70'
                        )}
                      >
                        <PlayCircle className="w-3 h-3 shrink-0" />
                        <span className="truncate">Dan {lesson.day_number} — {lesson.title}</span>
                      </Link>
                    ))}
                  </div>
                )
              })}
              {collapsed && (
                <Link
                  href="/portal"
                  title="Gledaj kao student"
                  className={cn(
                    'flex items-center justify-center px-2 py-2.5 text-sm transition-colors',
                    'text-white/50 hover:text-white hover:bg-white/5'
                  )}
                >
                  <PlayCircle className="w-5 h-5 shrink-0" />
                </Link>
              )}
            </>
          ) : (
            <>
              {/* Student main nav */}
              {studentNavItems.map(({ href, label, icon: Icon }) => {
                const isActive = pathname === href && label === 'Pregled'
                  ? pathname === '/portal'
                  : pathname === href
                return (
                  <Link
                    key={label}
                    href={href}
                    title={collapsed ? label : undefined}
                    className={cn(
                      'flex items-center gap-3 py-2.5 text-sm transition-colors',
                      collapsed ? 'justify-center px-2' : 'px-4',
                      isActive
                        ? 'bg-white/10 text-white'
                        : 'text-white/50 hover:text-white hover:bg-white/5'
                    )}
                  >
                    <Icon className="w-5 h-5 shrink-0" />
                    {!collapsed && <span>{label}</span>}
                  </Link>
                )
              })}

              {/* Lesson list — only when expanded */}
              {!collapsed && (
                <div className="mt-2">
                  {SECTIONS.map(section => {
                    const sectionLessons = lessons.filter(l => l.section === section.key)
                    if (sectionLessons.length === 0) return null

                    const sectionCompleted = sectionLessons.filter(l =>
                      completedSet.has(l.id)
                    ).length
                    const isOpen = openSections.has(section.key)

                    return (
                      <div key={section.key}>
                        <button
                          onClick={() => toggleSection(section.key)}
                          className="w-full flex items-center justify-between px-4 py-2.5 text-xs font-semibold uppercase tracking-widest text-white/40 hover:text-white/70 transition-colors"
                        >
                          <span>
                            {section.label}
                            {section.days !== '0' && (
                              <span className="ml-1 text-white/25 normal-case tracking-normal font-normal">
                                (Dani {section.days})
                              </span>
                            )}
                          </span>
                          <div className="flex items-center gap-2">
                            <span className="text-white/30">
                              {sectionCompleted}/{sectionLessons.length}
                            </span>
                            {isOpen ? (
                              <ChevronDown className="w-3 h-3" />
                            ) : (
                              <ChevronRight className="w-3 h-3" />
                            )}
                          </div>
                        </button>

                        {isOpen && (
                          <div>
                            {sectionLessons
                              .sort((a, b) => a.day_number - b.day_number)
                              .map(lesson => {
                                const isCompleted = completedSet.has(lesson.id)
                                const isCurrent =
                                  pathname === `/portal/dan/${lesson.day_number}`
                                const isLocked =
                                  !isCompleted &&
                                  lesson.day_number > completedCount + 2

                                if (isLocked) {
                                  return (
                                    <div
                                      key={lesson.id}
                                      className="flex items-center gap-3 px-4 py-2 opacity-40 cursor-not-allowed"
                                    >
                                      <Lock className="w-4 h-4 shrink-0 text-white/30" />
                                      <p className="text-xs text-white/40 truncate">
                                        Dan {lesson.day_number} — {lesson.title}
                                      </p>
                                    </div>
                                  )
                                }

                                return (
                                  <Link
                                    key={lesson.id}
                                    href={`/portal/dan/${lesson.day_number}`}
                                    className={cn(
                                      'flex items-center gap-3 px-4 py-2 text-sm transition-colors hover:bg-white/5',
                                      isCurrent
                                        ? 'bg-[#D4AF37]/10 border-r-2 border-[#D4AF37]'
                                        : '',
                                      isCompleted
                                        ? 'text-white/50'
                                        : 'text-white/80'
                                    )}
                                  >
                                    {isCompleted ? (
                                      <CheckCircle className="w-4 h-4 shrink-0 text-green-400" />
                                    ) : isCurrent ? (
                                      <PlayCircle className="w-4 h-4 shrink-0 text-[#D4AF37]" />
                                    ) : (
                                      <div className="w-4 h-4 shrink-0 rounded-full border border-white/20" />
                                    )}
                                    <div className="min-w-0 flex-1">
                                      <p className="text-xs truncate">
                                        <span className="text-white/40">
                                          Dan {lesson.day_number}{' '}
                                        </span>
                                        {lesson.title}
                                      </p>
                                      {lesson.duration_seconds && (
                                        <p className="text-xs text-white/30">
                                          {formatDuration(lesson.duration_seconds)}
                                        </p>
                                      )}
                                    </div>
                                  </Link>
                                )
                              })}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </>
          )}
        </nav>

        {/* Bottom: progress + user + logout */}
        <div className={cn('border-t border-white/10 shrink-0', collapsed ? 'px-2 py-3' : 'px-4 py-4')}>
          {/* Progress bar */}
          {!collapsed ? (
            <div className="mb-3 space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-white/50">Napredak</span>
                <span className="text-[#D4AF37] font-semibold">
                  {completedCount}/{totalDays}
                </span>
              </div>
              <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                <div
                  className="h-full rounded-full bg-[#D4AF37] transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          ) : (
            <div className="mb-3 flex justify-center">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold text-[#D4AF37] border border-[#D4AF37]/40"
                title={`${progressPercent}% dovršeno`}
              >
                {progressPercent}%
              </div>
            </div>
          )}

          {/* User info */}
          {!collapsed && (userName || userEmail) && (
            <div className="mb-3 min-w-0">
              {userName && (
                <p className="text-xs font-semibold text-white/80 truncate">{userName}</p>
              )}
              {userEmail && (
                <p className="text-xs text-white/40 truncate">{userEmail}</p>
              )}
            </div>
          )}

          {/* Sign out */}
          <button
            onClick={handleSignOut}
            title={collapsed ? 'Odjava' : undefined}
            className={cn(
              'flex items-center gap-2 text-xs text-white/40 hover:text-white transition-colors w-full',
              collapsed ? 'justify-center' : ''
            )}
          >
            <LogOut className="w-4 h-4 shrink-0" />
            {!collapsed && <span>Odjava</span>}
          </button>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Mobile hamburger button — rendered in top bar slot */}
      <button
        onClick={() => setMobileOpen(true)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-[#0f1e35] border border-white/10 text-white"
        aria-label="Otvori izbornik"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <aside
        className={cn(
          'md:hidden fixed inset-y-0 left-0 z-50 w-72 bg-[#0f1e35] border-r border-white/10 transition-transform duration-300',
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <button
          onClick={() => setMobileOpen(false)}
          className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors"
          aria-label="Zatvori izbornik"
        >
          <X className="w-5 h-5" />
        </button>
        <SidebarContent collapsed={false} />
      </aside>

      {/* Desktop sidebar */}
      <aside
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={cn(
          'hidden md:flex flex-col h-full bg-[#0f1e35] border-r border-white/10 shrink-0 transition-all duration-300 overflow-hidden',
          isExpanded ? 'w-64' : 'w-16'
        )}
      >
        {/* Expand toggle when collapsed */}
        {!isExpanded && (
          <button
            onClick={() => setIsExpanded(true)}
            className="absolute left-3 top-4 z-10 text-white/30 hover:text-white/70 transition-colors"
            aria-label="Expand sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}
        <SidebarContent collapsed={!isExpanded} />
      </aside>
    </>
  )
}
