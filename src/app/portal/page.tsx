import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient, createServiceClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { PlayCircle, CheckCircle, Award, Calendar, Zap } from 'lucide-react'

export default async function PortalDashboard() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/prijava')

  const service = await createServiceClient()

  // Get profile
  const { data: profile } = await service
    .from('profiles')
    .select('full_name, email, role')
    .eq('id', user.id)
    .single()

  // Get course & purchase
  const { data: course } = await service
    .from('courses')
    .select('id, title, slug')
    .eq('slug', 'volim-svojnovac')
    .single()

  const hasPurchase = course ? await service
    .from('purchases')
    .select('id')
    .eq('user_id', user.id)
    .eq('course_id', course.id)
    .eq('status', 'completed')
    .single()
    .then(r => !!r.data) : false

  const isAdmin = profile?.role === 'admin'
  if (!hasPurchase && !isAdmin) {
    redirect('/tecaj')
  }

  // Get progress
  const { data: lessons } = await service
    .from('lessons')
    .select('id, day_number, title, section, duration_seconds')
    .eq('course_id', course!.id)
    .order('sort_order')

  const { data: progressData } = await service
    .from('progress')
    .select('lesson_id, completed_at')
    .eq('user_id', user.id)

  const completedIds = new Set(progressData?.map(p => p.lesson_id) ?? [])
  const totalLessons = lessons?.length ?? 90
  const completedCount = completedIds.size
  const progressPercent = Math.round((completedCount / totalLessons) * 100)

  // Find next lesson
  const nextLesson = lessons?.find(l => !completedIds.has(l.id))

  const firstName = profile?.full_name?.split(' ')[0] ?? 'Polazniče'

  // Recent completions
  const recentCompleted = progressData
    ?.sort((a, b) => new Date(b.completed_at).getTime() - new Date(a.completed_at).getTime())
    .slice(0, 3)
    .map(p => lessons?.find(l => l.id === p.lesson_id))
    .filter(Boolean)

  return (
    <div className="p-6 lg:p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-1">
          Dobrodošao/la, {firstName}! 👋
        </h1>
        <p className="text-white/50">
          {completedCount === 0
            ? 'Spreman/na za prvi dan? Krenimo!'
            : `Odlično napredovaš — već si završio/la ${completedCount} od ${totalLessons} lekcija.`}
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          {
            icon: CheckCircle,
            label: 'Završene lekcije',
            value: completedCount,
            color: 'text-green-400',
            bg: 'bg-green-500/10 border-green-500/20',
          },
          {
            icon: Calendar,
            label: 'Preostalo dana',
            value: totalLessons - completedCount,
            color: 'text-blue-400',
            bg: 'bg-blue-500/10 border-blue-500/20',
          },
          {
            icon: Zap,
            label: 'Napredak',
            value: `${progressPercent}%`,
            color: 'text-gold',
            bg: 'bg-gold/10 border-gold/20',
          },
          {
            icon: Award,
            label: 'Certifikat',
            value: completedCount >= totalLessons ? 'Spreman!' : 'U tijeku',
            color: completedCount >= totalLessons ? 'text-gold' : 'text-white/40',
            bg: completedCount >= totalLessons ? 'bg-gold/10 border-gold/20' : 'bg-white/5 border-white/10',
          },
        ].map(stat => (
          <div key={stat.label} className={`border rounded-xl p-4 ${stat.bg}`}>
            <stat.icon className={`w-5 h-5 ${stat.color} mb-2`} />
            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
            <p className="text-xs text-white/50 mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Progress bar */}
      <Card className="mb-8">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-white">Ukupni napredak</h3>
            <span className="text-gold font-bold">{completedCount}/{totalLessons}</span>
          </div>
          <Progress value={completedCount} max={totalLessons} />
          <p className="text-xs text-white/40 mt-2">{progressPercent}% završeno</p>
        </CardContent>
      </Card>

      {/* Next lesson CTA */}
      {nextLesson && (
        <Card className="mb-8 border-gold/20 bg-gold/5">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <Badge className="mb-2 bg-gold/20 text-gold border-gold/30">Sljedeća lekcija</Badge>
                <h3 className="text-lg font-bold text-white">
                  Dan {nextLesson.day_number}: {nextLesson.title}
                </h3>
                {nextLesson.duration_seconds && (
                  <p className="text-white/50 text-sm mt-1">
                    {Math.floor(nextLesson.duration_seconds / 60)} minuta
                  </p>
                )}
              </div>
              <Link href={`/portal/dan/${nextLesson.day_number}`}>
                <Button size="lg" className="shrink-0">
                  <PlayCircle className="w-5 h-5 mr-2" />
                  Pokreni lekciju
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}

      {completedCount >= totalLessons && (
        <Card className="mb-8 border-gold bg-gold/5">
          <CardContent className="pt-6 text-center">
            <Award className="w-16 h-16 text-gold mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gold mb-2">Čestitamo! 🎉</h3>
            <p className="text-white/70 mb-4">Završio/la si svih 90 dana programa. Tvoj certifikat te čeka!</p>
            <Link href="/portal/certifikat">
              <Button size="lg">Preuzmi certifikat →</Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {/* Recent activity */}
      {recentCompleted && recentCompleted.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Nedavno završeno</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentCompleted.map(lesson => lesson && (
                <Link
                  key={lesson.id}
                  href={`/portal/dan/${lesson.day_number}`}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors"
                >
                  <CheckCircle className="w-5 h-5 text-green-400 shrink-0" />
                  <div>
                    <p className="text-sm text-white">Dan {lesson.day_number}: {lesson.title}</p>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
