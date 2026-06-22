import { redirect } from 'next/navigation'
import { createClient, createServiceClient } from '@/lib/supabase/server'
import Link from 'next/link'

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
    <div className="min-h-screen bg-navy">
      {/* Admin nav */}
      <nav className="border-b border-white/10 bg-navy-50 px-6 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/admin" className="text-gold font-bold tracking-wide text-sm">
              ADMIN
            </Link>
            <div className="flex gap-4 text-sm">
              {[
                { href: '/admin', label: 'Dashboard' },
                { href: '/admin/studenti', label: 'Studenti' },
                { href: '/admin/lekcije', label: 'Lekcije' },
                { href: '/admin/kuponi', label: 'Kuponi' },
                { href: '/admin/leadovi', label: 'Leadovi' },
                { href: '/admin/preview-portal', label: '👁 Preview' },
                { href: '/admin/affiliate', label: 'Affiliate' },
                { href: '/admin/blog', label: 'Blog' },
                { href: '/admin/emaili', label: 'Emaili' },
              ].map(link => (
                <Link key={link.href} href={link.href} className="text-white/50 hover:text-white transition-colors">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-white/40 text-sm">{profile?.full_name ?? user.email}</span>
            <Link href="/portal" className="text-white/40 text-sm hover:text-white transition-colors">
              Portal →
            </Link>
          </div>
        </div>
      </nav>
      {children}
    </div>
  )
}
