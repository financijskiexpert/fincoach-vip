import { redirect } from 'next/navigation'
import { createClient, createServiceClient } from '@/lib/supabase/server'
import PortalSidebar from '@/components/PortalSidebar'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/prijava?redirect=/admin')

  const service = await createServiceClient()
  const { data: profile } = await service
    .from('profiles')
    .select('role, full_name')
    .eq('id', user.id)
    .single()

  const isAdmin = profile?.role === 'admin' || user.email === 'brane.recek@gmail.com'
  if (!isAdmin) redirect('/portal')

  // Load lessons so admin can browse the course from sidebar
  const { data: course } = await service
    .from('courses').select('id').eq('slug', 'volim-svojnovac').single()

  const lessons = course ? (await service
    .from('lessons')
    .select('id, day_number, title, section, duration_seconds')
    .eq('course_id', course.id)
    .order('sort_order')
    .then(r => r.data ?? [])) : []

  return (
    <div className="flex h-screen bg-navy overflow-hidden">
      <PortalSidebar
        role="admin"
        hasAffiliate={true}
        lessons={lessons}
        completedLessonIds={[]}
        userName={profile?.full_name ?? undefined}
        userEmail={user.email ?? undefined}
      />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}
