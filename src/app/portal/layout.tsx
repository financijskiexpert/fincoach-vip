import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Sidebar from '@/components/Sidebar'

async function getLessonsAndProgress(userId: string, courseSlug = 'volim-svojnovac') {
  const supabase = await createClient()

  // Get course
  const { data: course } = await supabase
    .from('courses')
    .select('id')
    .eq('slug', courseSlug)
    .single()

  if (!course) return { lessons: [], completedIds: [] }

  // Get lessons (only if user has purchased)
  const { data: purchase } = await supabase
    .from('purchases')
    .select('id')
    .eq('user_id', userId)
    .eq('course_id', course.id)
    .eq('status', 'completed')
    .single()

  if (!purchase) return { lessons: [], completedIds: [] }

  const { data: lessons } = await supabase
    .from('lessons')
    .select('id, day_number, title, section, duration_seconds')
    .eq('course_id', course.id)
    .order('sort_order')

  const { data: progress } = await supabase
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

  const { lessons, completedIds } = await getLessonsAndProgress(user.id)

  return (
    <div className="flex h-screen bg-navy overflow-hidden">
      <Sidebar
        lessons={lessons}
        completedLessonIds={completedIds}
        totalDays={90}
      />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}
