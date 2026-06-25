import { redirect } from 'next/navigation'
import { createClient, createServiceClient } from '@/lib/supabase/server'
import { Badge } from '@/components/ui/badge'
import { formatCurrency } from '@/lib/utils'
import { AddStudentForm, DeleteStudentButton, GrantAccessButton, RevokeAccessButton, RevokeAffiliateButton, GrantAffiliateButton } from './StudentiClient'

export default async function AdminStudenti() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/prijava')

  const service = await createServiceClient()
  const { data: profile } = await service.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin' && user.email !== 'brane.recek@gmail.com') redirect('/portal')

  // Svi studenti + admin (za testiranje)
  const { data: students } = await service
    .from('profiles')
    .select(`id, full_name, email, role, created_at`)
    .in('role', ['student', 'admin'])
    .order('created_at', { ascending: false })

  // Dohvati purchases
  const { data: purchases } = await service
    .from('purchases')
    .select('user_id, status, amount_paid, purchased_at')
    .eq('status', 'completed')

  // Dohvati affiliates
  const { data: affiliates } = await service
    .from('affiliates')
    .select('email, code, total_sales, total_commission, is_active')

  const affiliateEmailSet = new Set(affiliates?.filter(a => a.is_active).map(a => a.email) ?? [])

  // Dohvati progress count
  const { data: progressData } = await service
    .from('progress')
    .select('user_id')

  const purchaseByUser = new Map(purchases?.map(p => [p.user_id, p]) ?? [])
  const affiliateByEmail = new Map(affiliates?.map(a => [a.email, a]) ?? [])
  const progressByUser = new Map<string, number>()
  for (const p of progressData ?? []) {
    progressByUser.set(p.user_id, (progressByUser.get(p.user_id) ?? 0) + 1)
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://fincoach.vip'

  const totalStudents = students?.filter(s => s.role === 'student').length ?? 0
  const totalActive = purchases?.length ?? 0

  return (
    <div className="max-w-7xl mx-auto p-6 lg:p-8">
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Studenti</h1>
          <p className="text-white/50 mt-1">{totalStudents} studenata · {totalActive} s aktivnim pristupom</p>
        </div>
        <AddStudentForm />
      </div>

      <div className="bg-navy-50 border border-white/10 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 bg-white/2">
                <th className="text-left px-5 py-4 text-white/40 font-medium">Ime / Email</th>
                <th className="text-left px-5 py-4 text-white/40 font-medium">Pristup tečaju</th>
                <th className="text-left px-5 py-4 text-white/40 font-medium">Affiliate</th>
                <th className="text-center px-5 py-4 text-white/40 font-medium">Napredak</th>
                <th className="text-right px-5 py-4 text-white/40 font-medium">Datum</th>
                <th className="px-5 py-4" />
              </tr>
            </thead>
            <tbody>
              {!students || students.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-white/30">Još nema studenata. Dodaj prvog!</td>
                </tr>
              ) : students.map((s: any) => {
                const purchase = purchaseByUser.get(s.id)
                const aff = affiliateByEmail.get(s.email)
                const progressCount = progressByUser.get(s.id) ?? 0
                const progressPct = Math.round((progressCount / 90) * 100)
                const hasAccess = !!purchase
                const hasAffiliate = affiliateEmailSet.has(s.email)
                const isAdmin = s.role === 'admin'

                return (
                  <tr key={s.id} className="border-b border-white/5 hover:bg-white/2 transition-colors">

                    {/* Ime + email */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <div>
                          <p className="text-white font-medium">{s.full_name ?? '—'}</p>
                          <p className="text-white/40 text-xs mt-0.5">{s.email}</p>
                        </div>
                        {isAdmin && (
                          <Badge className="bg-gold/20 text-gold border-gold/30 text-xs">Admin</Badge>
                        )}
                      </div>
                    </td>

                    {/* Pristup */}
                    <td className="px-5 py-4">
                      {isAdmin ? (
                        <Badge className="bg-gold/20 text-gold border-gold/30 text-xs">Super admin</Badge>
                      ) : hasAccess ? (
                        <div className="space-y-1">
                          <Badge className="bg-green-500/10 text-green-400 border-green-500/20 text-xs">Aktivan</Badge>
                          {purchase.amount_paid > 0 && (
                            <p className="text-white/30 text-xs">{formatCurrency(purchase.amount_paid)}</p>
                          )}
                          <RevokeAccessButton userId={s.id} name={s.full_name ?? s.email} />
                        </div>
                      ) : (
                        <GrantAccessButton userId={s.id} name={s.full_name ?? s.email} />
                      )}
                    </td>

                    {/* Affiliate */}
                    <td className="px-5 py-4">
                      {aff ? (
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5">
                            <div className={`w-1.5 h-1.5 rounded-full ${aff.is_active ? 'bg-green-400' : 'bg-white/20'}`} />
                            <span className="font-mono text-xs text-gold">{aff.code}</span>
                          </div>
                          <p className="text-white/30 text-xs">
                            {aff.total_commission > 0 ? `€${Number(aff.total_commission).toFixed(0)} zarade` : 'Bez konverzija'}
                          </p>
                          <a
                            href={`${siteUrl}?ref=${aff.code}`}
                            target="_blank"
                            className="text-xs text-white/20 hover:text-white/50 transition"
                          >
                            ↗ link
                          </a>
                          {!isAdmin && (
                            hasAffiliate
                              ? <RevokeAffiliateButton userId={s.id} name={s.full_name ?? s.email} />
                              : <GrantAffiliateButton userId={s.id} name={s.full_name ?? s.email} />
                          )}
                        </div>
                      ) : (
                        <div>
                          <span className="text-white/20 text-xs">—</span>
                          {!isAdmin && (
                            <div className="mt-1">
                              <GrantAffiliateButton userId={s.id} name={s.full_name ?? s.email} />
                            </div>
                          )}
                        </div>
                      )}
                    </td>

                    {/* Napredak */}
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-20 bg-white/10 rounded-full h-1.5">
                          <div className="bg-gold h-1.5 rounded-full" style={{ width: `${progressPct}%` }} />
                        </div>
                        <span className="text-white/40 text-xs w-8">{progressPct}%</span>
                      </div>
                    </td>

                    {/* Datum */}
                    <td className="px-5 py-4 text-right text-white/30 text-xs">
                      {new Date(s.created_at).toLocaleDateString('hr-HR')}
                    </td>

                    {/* Akcije */}
                    <td className="px-5 py-4">
                      {!isAdmin && (
                        <DeleteStudentButton userId={s.id} name={s.full_name ?? s.email} />
                      )}
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
