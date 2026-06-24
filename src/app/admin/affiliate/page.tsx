import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/server'
import { Badge } from '@/components/ui/badge'
import { formatCurrency } from '@/lib/utils'

export default async function AdminAffiliate() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/prijava')

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin' && user.email !== 'brane.recek@gmail.com') redirect('/portal')

  const service = await createServiceClient()

  const { data: affiliates } = await service
    .from('affiliates')
    .select(`
      id, name, email, code, commission_percent, is_active, created_at,
      total_sales, total_commission, total_conversions,
      affiliate_conversions(id, commission_amount, status, created_at,
        purchases(amount_paid)
      )
    `)
    .order('created_at', { ascending: false })

  return (
    <div className="max-w-7xl mx-auto p-6 lg:p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Affiliate program</h1>
          <p className="text-white/50 mt-1">{affiliates?.length ?? 0} partnera</p>
        </div>
        <a
          href="/admin/affiliate/novi"
          className="inline-flex items-center gap-2 bg-gold text-navy font-bold px-4 py-2 rounded-xl text-sm hover:bg-gold/90 transition-colors"
        >
          + Novi partner
        </a>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Ukupno partnera', value: affiliates?.length ?? 0 },
          { label: 'Aktivnih', value: affiliates?.filter(a => a.is_active).length ?? 0 },
          {
            label: 'Ukupno konverzija',
            value: affiliates?.reduce((s, a) => s + (a.total_conversions ?? 0), 0) ?? 0,
          },
          {
            label: 'Ukupne provizije',
            value: formatCurrency(
              (affiliates?.reduce((s, a) => s + (a.total_commission ?? 0), 0) ?? 0)
            ),
          },
        ].map(stat => (
          <div key={stat.label} className="bg-navy-50 border border-white/10 rounded-xl p-4">
            <p className="text-2xl font-bold text-gold">{stat.value}</p>
            <p className="text-xs text-white/50 mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-navy-50 border border-white/10 rounded-2xl overflow-hidden">
        {!affiliates?.length ? (
          <div className="p-12 text-center text-white/30">Još nema affiliate partnera.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 bg-white/2">
                  <th className="text-left px-6 py-3 text-white/40 font-medium">Partner</th>
                  <th className="text-left px-6 py-3 text-white/40 font-medium">Kod</th>
                  <th className="text-right px-6 py-3 text-white/40 font-medium">Provizija</th>
                  <th className="text-right px-6 py-3 text-white/40 font-medium">Konverzije</th>
                  <th className="text-right px-6 py-3 text-white/40 font-medium">Zarada</th>
                  <th className="text-right px-6 py-3 text-white/40 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {affiliates.map((a: any) => (
                  <tr key={a.id} className="border-b border-white/5 hover:bg-white/2 transition-colors">
                    <td className="px-6 py-4">
                      <p className="text-white font-medium">{a.name}</p>
                      <p className="text-white/40 text-xs">{a.email}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-mono bg-white/5 px-2 py-1 rounded text-xs text-gold">{a.code}</span>
                    </td>
                    <td className="px-6 py-4 text-right text-white/70">{a.commission_percent}%</td>
                    <td className="px-6 py-4 text-right text-white/70">{a.total_conversions ?? 0}</td>
                    <td className="px-6 py-4 text-right text-gold font-semibold">
                      {formatCurrency(a.total_commission ?? 0)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {a.is_active ? (
                        <Badge className="bg-green-500/10 text-green-400 border-green-500/20">Aktivan</Badge>
                      ) : (
                        <Badge className="bg-white/5 text-white/40 border-white/10">Neaktivan</Badge>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pending payouts */}
      <div className="mt-8">
        <h2 className="text-xl font-bold text-white mb-4">Isplate na čekanju</h2>
        <div className="bg-navy-50 border border-white/10 rounded-2xl overflow-hidden">
          {(() => {
            const pending = affiliates?.flatMap((a: any) =>
              (a.affiliate_conversions ?? [])
                .filter((c: any) => c.status === 'pending')
                .map((c: any) => ({ ...c, affiliate_name: a.name, affiliate_email: a.email }))
            ) ?? []

            if (!pending.length) {
              return <div className="p-8 text-center text-white/30">Nema isplata na čekanju.</div>
            }

            return (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/10 bg-white/2">
                      <th className="text-left px-6 py-3 text-white/40 font-medium">Partner</th>
                      <th className="text-right px-6 py-3 text-white/40 font-medium">Provizija</th>
                      <th className="text-right px-6 py-3 text-white/40 font-medium">Datum</th>
                      <th className="text-right px-6 py-3 text-white/40 font-medium">Akcija</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pending.map((c: any) => (
                      <tr key={c.id} className="border-b border-white/5">
                        <td className="px-6 py-4">
                          <p className="text-white">{c.affiliate_name}</p>
                          <p className="text-white/40 text-xs">{c.affiliate_email}</p>
                        </td>
                        <td className="px-6 py-4 text-right text-gold font-semibold">
                          {formatCurrency(c.commission_amount)}
                        </td>
                        <td className="px-6 py-4 text-right text-white/40">
                          {new Date(c.created_at).toLocaleDateString('hr-HR')}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <form action={`/api/admin/affiliate/payout`} method="POST">
                            <input type="hidden" name="conversion_id" value={c.id} />
                            <button
                              type="submit"
                              className="text-xs bg-green-500/10 text-green-400 border border-green-500/20 px-3 py-1 rounded-lg hover:bg-green-500/20 transition-colors"
                            >
                              Označi isplaćeno
                            </button>
                          </form>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          })()}
        </div>
      </div>
    </div>
  )
}
