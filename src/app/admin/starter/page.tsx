import { redirect } from 'next/navigation'
import { createClient, createServiceClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Zap } from 'lucide-react'
import AdminStarterClient from './AdminStarterClient'

async function getStarterData() {
  const supabase = await createServiceClient()

  const { data: starters } = await supabase
    .from('starter_purchases')
    .select('id, email, full_name, financial_type, status, created_at, upgrade_coupon_used, token')
    .order('created_at', { ascending: false })

  // Provjeri koji starteri imaju VSN pristup
  const emails = (starters ?? []).map((s: any) => s.email)
  const { data: vsnUsers } = await supabase
    .from('profiles')
    .select('email, id, role')
    .in('email', emails.length > 0 ? emails : ['__none__'])

  const vsnEmailSet = new Set((vsnUsers ?? []).map((u: any) => u.email?.toLowerCase()))

  const enriched = (starters ?? []).map((s: any) => ({
    ...s,
    has_vsn: vsnEmailSet.has(s.email?.toLowerCase()),
  }))

  return enriched
}

export default async function AdminStarterPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/prijava')

  const service = await createServiceClient()
  const { data: profile } = await service
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin' && user.email !== 'brane.recek@gmail.com') redirect('/portal')

  const starters = await getStarterData()

  const activeCount = starters.filter((s: any) => s.status === 'active').length
  const withType = starters.filter((s: any) => s.financial_type).length
  const withVSN = starters.filter((s: any) => s.has_vsn).length
  const couponUsed = starters.filter((s: any) => s.upgrade_coupon_used).length

  return (
    <div className="min-h-screen bg-navy p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-violet-500/20 flex items-center justify-center">
            <Zap className="w-5 h-5 text-violet-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Starter Paket</h1>
            <p className="text-white/50 text-sm">Upravljanje Starter kupaca (19 €)</p>
          </div>
          <Badge className="ml-auto bg-violet-500/20 text-violet-300 border-violet-500/30">
            {activeCount} aktivnih
          </Badge>
        </div>

        {/* Mini stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Ukupno kupaca', value: starters.length, color: 'text-violet-400' },
            { label: 'Završili kviz', value: withType, color: 'text-green-400' },
            { label: 'Imaju VSN pristup', value: withVSN, color: 'text-gold' },
            { label: 'Iskoristili upgrade kupon', value: couponUsed, color: 'text-blue-400' },
          ].map(s => (
            <div key={s.label} className="bg-white/5 border border-white/10 rounded-xl p-4">
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-white/50 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Table */}
        <Card>
          <CardHeader>
            <CardTitle>Svi Starter kupci</CardTitle>
          </CardHeader>
          <CardContent>
            <AdminStarterClient starters={starters} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
