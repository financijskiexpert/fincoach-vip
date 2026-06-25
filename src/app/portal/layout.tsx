import { redirect } from 'next/navigation'
import { createClient, createServiceClient } from '@/lib/supabase/server'
import PortalSidebar from '@/components/PortalSidebar'

async function getLessonsAndProgress(userId: string, userEmail: string, courseSlug = 'volim-svojnovac') {
  const service = await createServiceClient()

  const { data: course } = await service
    .from('courses')
    .select('id')
    .eq('slug', courseSlug)
    .single()

  if (!course) return { lessons: [], completedIds: [] }

  const { data: purchase } = await service
    .from('purchases')
    .select('id')
    .eq('user_id', userId)
    .eq('course_id', course.id)
    .eq('status', 'completed')
    .limit(1)
    .maybeSingle()

  if (!purchase) {
    const { data: profile } = await service
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single()

    if (profile?.role !== 'admin' && userEmail !== 'brane.recek@gmail.com') return { lessons: [], completedIds: [] }

    const { data: adminLessons } = await service
      .from('lessons')
      .select('id, day_number, title, section, duration_seconds')
      .eq('course_id', course.id)
      .order('sort_order')

    return { lessons: adminLessons ?? [], completedIds: [] }
  }

  const { data: lessons } = await service
    .from('lessons')
    .select('id, day_number, title, section, duration_seconds')
    .eq('course_id', course.id)
    .order('sort_order')

  const { data: progress } = await service
    .from('progress')
    .select('lesson_id')
    .eq('user_id', userId)

  return {
    lessons: lessons ?? [],
    completedIds: progress?.map(p => p.lesson_id) ?? [],
  }
}

export default async function PortalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/prijava?redirect=/portal')
  }

  const service = await createServiceClient()
  const { data: profile } = await service
    .from('profiles')
    .select('role, full_name, email')
    .eq('id', user.id)
    .single()

  // /portal je VEDNO student view — tudi admin tukaj vidi kako izgleda za študente
  // Admin panel je strogo na /admin
  const isAdmin = profile?.role === 'admin' || user.email === 'brane.recek@gmail.com'

  const { data: affiliateRecord } = await service
    .from('affiliates')
    .select('id, is_active')
    .eq('user_id', user.id)
    .maybeSingle()
  const hasAffiliate = !!affiliateRecord?.is_active

  const { lessons, completedIds } = await getLessonsAndProgress(user.id, user.email ?? '')

  return (
    <div className="flex h-screen bg-navy overflow-hidden">
      <PortalSidebar
        role="student"
        hasAffiliate={hasAffiliate}
        lessons={lessons}
        completedLessonIds={completedIds}
        userName={profile?.full_name ?? undefined}
        userEmail={user.email ?? undefined}
        showAdminBackLink={isAdmin}
      />
      <main className="relative flex-1 overflow-y-auto">
        {isAdmin && (
          <div className="bg-gold/10 border-b border-gold/30 px-4 py-2 text-xs text-gold flex items-center justify-between">
            <span>👁 Pregledaš portal kao student. Ovo vidi tvoj korisnik.</span>
            <a href="/admin" className="font-bold underline hover:no-underline">← Natrag na admin panel</a>
          </div>
        )}
        {children}
      </main>
    </div>
  )
}
