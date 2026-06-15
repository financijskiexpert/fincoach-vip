import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Users, ShoppingCart, TrendingUp, Mail, DollarSign, CheckCircle } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

async function getAdminStats() {
  const supabase = await createClient()

  const [
    { count: totalStudents },
    { count: totalPurchases },
    { data: revenue },
    { count: totalLeads },
    { count: completedLessons },
    { data: recentPurchases },
  ] = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'student'),
    supabase.from('purchases').select('*', { count: 'exact', head: true }).eq('status', 'completed'),
    supabase.from('purchases').select('amount_paid').eq('status', 'completed'),
    supabase.from('leads').select('*', { count: 'exact', head: true }),
    supabase.from('progress').select('*', { count: 'exact', head: true }),
    supabase.from('purchases')
      .select('id, amount_paid, purchased_at, profiles(full_name, email), courses(title)')
      .eq('status', 'completed')
      .order('purchased_at', { ascending: false })
      .limit(10),
  ])

  const totalRevenue = revenue?.reduce((sum, p) => sum + (p.amount_paid ?? 0), 0) ?? 0

  return {
    totalStudents: totalStudents ?? 0,
    totalPurchases: totalPurchases ?? 0,
    totalRevenue,
    totalLeads: totalLeads ?? 0,
    completedLessons: completedLessons ?? 0,
    recentPurchases: recentPurchases ?? [],
  }
}

export default async function AdminDashboard() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/prijava')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') redirect('/portal')

  const stats = await getAdminStats()

  const conversionRate = stats.totalLeads > 0
    ? ((stats.totalPurchases / stats.totalLeads) * 100).toFixed(1)
    : '0'

  return (
    <div className="min-h-screen bg-navy p-6 lg:p-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
            <p className="text-white/50 mt-1">FinCoach VIP — Pregled poslovanja</p>
          </div>
          <Badge className="bg-gold/10 text-gold border-gold/30">Admin</Badge>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
          {[
            {
              icon: DollarSign,
              label: 'Ukupni prihod',
              value: formatCurrency(stats.totalRevenue),
              color: 'text-gold',
              bg: 'bg-gold/10 border-gold/20',
            },
            {
              icon: ShoppingCart,
              label: 'Prodaje',
              value: stats.totalPurchases,
              color: 'text-blue-400',
              bg: 'bg-blue-500/10 border-blue-500/20',
            },
            {
              icon: Users,
              label: 'Studenti',
              value: stats.totalStudents,
              color: 'text-purple-400',
              bg: 'bg-purple-500/10 border-purple-500/20',
            },
            {
              icon: Mail,
              label: 'Leadovi',
              value: stats.totalLeads,
              color: 'text-cyan-400',
              bg: 'bg-cyan-500/10 border-cyan-500/20',
            },
            {
              icon: TrendingUp,
              label: 'Konverzija',
              value: `${conversionRate}%`,
              color: 'text-green-400',
              bg: 'bg-green-500/10 border-green-500/20',
            },
            {
              icon: CheckCircle,
              label: 'Lekcije završene',
              value: stats.completedLessons,
              color: 'text-orange-400',
              bg: 'bg-orange-500/10 border-orange-500/20',
            },
          ].map(stat => (
            <div key={stat.label} className={`border rounded-xl p-4 ${stat.bg}`}>
              <stat.icon className={`w-5 h-5 ${stat.color} mb-2`} />
              <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
              <p className="text-xs text-white/50 mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Quick links */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Upravljaj lekcijama', href: '/admin/lekcije', icon: '📹' },
            { label: 'Studenti', href: '/admin/studenti', icon: '👥' },
            { label: 'Kuponi', href: '/admin/kuponi', icon: '🏷️' },
            { label: 'Blog', href: '/admin/blog', icon: '📝' },
          ].map(link => (
            <a
              key={link.label}
              href={link.href}
              className="flex items-center gap-3 bg-navy-50 border border-white/10 rounded-xl p-4 hover:border-gold/30 transition-colors"
            >
              <span className="text-2xl">{link.icon}</span>
              <span className="text-sm font-medium text-white">{link.label}</span>
            </a>
          ))}
        </div>

        {/* Recent purchases */}
        <Card>
          <CardHeader>
            <CardTitle>Nedavne prodaje</CardTitle>
          </CardHeader>
          <CardContent>
            {stats.recentPurchases.length === 0 ? (
              <p className="text-white/40 text-sm">Još nema prodaja.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left pb-3 text-white/40 font-medium">Polaznik</th>
                      <th className="text-left pb-3 text-white/40 font-medium">Email</th>
                      <th className="text-right pb-3 text-white/40 font-medium">Iznos</th>
                      <th className="text-right pb-3 text-white/40 font-medium">Datum</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.recentPurchases.map((p: any) => (
                      <tr key={p.id} className="border-b border-white/5 hover:bg-white/2">
                        <td className="py-3 text-white">
                          {p.profiles?.full_name ?? '—'}
                        </td>
                        <td className="py-3 text-white/60">
                          {p.profiles?.email ?? '—'}
                        </td>
                        <td className="py-3 text-gold font-semibold text-right">
                          {formatCurrency(p.amount_paid ?? 0)}
                        </td>
                        <td className="py-3 text-white/40 text-right">
                          {new Date(p.purchased_at).toLocaleDateString('hr-HR')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}