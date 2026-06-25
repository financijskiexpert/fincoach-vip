import { redirect } from 'next/navigation'
import { createClient, createServiceClient } from '@/lib/supabase/server'
import PortalSidebar from '@/components/PortalSidebar'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/prijava?redirect=/admin')

  const service = await createServiceClient()
  const { data: profile, error: profileError } = await service
    .from('profiles')
    .select('role, full_name')
    .eq('id', user.id)
    .single()

  console.log('[admin-layout] user:', user.email, 'role:', profile?.role, 'err:', profileError?.message)

  // Fallback: allow known admin email directly
  const isAdmin = profile?.role === 'admin' || user.email === 'brane.recek@gmail.com'
  if (!isAdmin) redirect('/portal')

  return (
    <div className="flex h-screen bg-navy overflow-hidden">
      <PortalSidebar
        role="admin"
        hasAffiliate={false}
        lessons={[]}
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
