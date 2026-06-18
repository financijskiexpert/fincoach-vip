import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Badge } from '@/components/ui/badge'
import { formatCurrency } from '@/lib/utils'

export default async function AdminStudenti() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/prijava')

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') redirect('/portal')

  const { data: students } = await supabase
    .from('profiles')
    .select(`
      id, full_name, email, role, created_at,
      purchases(status, amount_paid, purchased_at),
      progress(count)
    `)
    .eq('role', 'student')
    .order('created_at', { ascending: false })

  return (
    <div className="max-w-7xl mx-auto p-6 lg:p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Studenti</h1>
          <p className="text-white/50 mt-1">{students?.length ?? 0} ukupno</p>
        </div>
      </div>

      <div className="bg-navy-50 border border-white/10 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 bg-white/2">
                <th className="text-left px-6 py-4 text-white/40 font-medium">Ime</th>
                <th className="text-left px-6 py-4 text-white/40 font-medium">Email</th>
                <th className="text-left px-6 py-4 text-white/40 font-medium">Status</th>
                <th className="text-right px-6 py-4 text-white/40 font-medium">Plaćeno</th>
                <th className="text-right px-6 py-4 text-white/40 font-medium">Napredak</th>
                <th className="text-right px-6 py-4 text-white/40 font-medium">Datum</th>
              </tr>
            </thead>
            <tbody>
              {students?.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-white/30">Još nema studenata.</td>
                </tr>
              )}
              {students?.map((s: any) => {
                const purchase = s.purchases?.[0]
                const progressCount = s.progress?.[0]?.count ?? 0
                const progressPct = Math.round((progressCount / 90) * 100)
                return (
                  <tr key={s.id} className="border-b border-white/5 hover:bg-white/2 transition-colors">
                    <td className="px-6 py-4 text-white font-medium">{s.full_name ?? '—'}</td>
                    <td className="px-6 py-4 text-white/60">{s.email}</td>
                    <td className="px-6 py-4">
                      {purchase?.status === 'completed' ? (
                        <Badge className="bg-green-500/10 text-green-400 border-green-500/20">Aktivan</Badge>
                      ) : (
                        <Badge className="bg-white/5 text-white/40 border-white/10">Neaktivan</Badge>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right text-gold font-semibold">
                      {purchase?.amount_paid ? formatCurrency(purchase.amount_paid) : '—'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <div className="w-16 bg-white/10 rounded-full h-1.5">
                          <div
                            className="bg-gold h-1.5 rounded-full transition-all"
                            style={{ width: `${progressPct}%` }}
                          />
                        </div>
                        <span className="text-white/40 text-xs w-8">{progressPct}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right text-white/40">
                      {new Date(s.created_at).toLocaleDateString('hr-HR')}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
