import { redirect } from 'next/navigation'
import { createClient, createServiceClient } from '@/lib/supabase/server'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Mail, Users, CheckCircle } from 'lucide-react'

export default async function LeadoviPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/prijava')

  const service = await createServiceClient()
  const { data: profile } = await service.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin' && user.email !== 'brane.recek@gmail.com') redirect('/portal')

  const { data: leads } = await service
    .from('leads')
    .select('*')
    .order('created_at', { ascending: false })

  const total = leads?.length ?? 0
  const converted = leads?.filter(l => l.converted_to_purchase).length ?? 0

  return (
    <div className="min-h-screen bg-navy p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Leadovi</h1>
            <p className="text-white/50 mt-1">Osobe koje su preuzele besplatni vodič</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="border border-white/10 rounded-xl p-4 bg-navy-50">
            <Users className="w-5 h-5 text-cyan-400 mb-2" />
            <p className="text-2xl font-bold text-cyan-400">{total}</p>
            <p className="text-xs text-white/50 mt-0.5">Ukupno leadova</p>
          </div>
          <div className="border border-white/10 rounded-xl p-4 bg-navy-50">
            <CheckCircle className="w-5 h-5 text-green-400 mb-2" />
            <p className="text-2xl font-bold text-green-400">{converted}</p>
            <p className="text-xs text-white/50 mt-0.5">Konvertirani u kupce</p>
          </div>
          <div className="border border-white/10 rounded-xl p-4 bg-navy-50">
            <Mail className="w-5 h-5 text-gold mb-2" />
            <p className="text-2xl font-bold text-gold">
              {total > 0 ? ((converted / total) * 100).toFixed(1) : '0'}%
            </p>
            <p className="text-xs text-white/50 mt-0.5">Stopa konverzije</p>
          </div>
        </div>

        {/* Table */}
        <Card>
          <CardHeader>
            <CardTitle>Svi leadovi</CardTitle>
          </CardHeader>
          <CardContent>
            {!leads || leads.length === 0 ? (
              <p className="text-white/40 text-sm">Još nema leadova.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left pb-3 text-white/40 font-medium">Ime</th>
                      <th className="text-left pb-3 text-white/40 font-medium">Email</th>
                      <th className="text-left pb-3 text-white/40 font-medium">Izvor</th>
                      <th className="text-left pb-3 text-white/40 font-medium">Status</th>
                      <th className="text-right pb-3 text-white/40 font-medium">Datum</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leads.map(lead => (
                      <tr key={lead.id} className="border-b border-white/5 hover:bg-white/2">
                        <td className="py-3 text-white">{lead.full_name || '—'}</td>
                        <td className="py-3 text-white/70">{lead.email}</td>
                        <td className="py-3 text-white/50 text-xs">{lead.source ?? 'landing'}</td>
                        <td className="py-3">
                          {lead.converted_to_purchase ? (
                            <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">Kupio/la</Badge>
                          ) : (
                            <Badge className="bg-white/5 text-white/40 border-white/10 text-xs">Lead</Badge>
                          )}
                        </td>
                        <td className="py-3 text-white/40 text-right text-xs">
                          {new Date(lead.created_at).toLocaleDateString('hr-HR', {
                            day: '2-digit', month: '2-digit', year: 'numeric',
                            hour: '2-digit', minute: '2-digit',
                          })}
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
