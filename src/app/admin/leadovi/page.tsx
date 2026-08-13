import { redirect } from 'next/navigation'
import { createClient, createServiceClient } from '@/lib/supabase/server'
import { Mail, Users, CheckCircle, AlertCircle } from 'lucide-react'
import LeadoviClient from './LeadoviClient'

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

  const { data: courses } = await service
    .from('courses')
    .select('slug, title')
    .eq('is_active', true)
    .order('created_at')

  const { data: queue } = await service
    .from('email_sequence_queue')
    .select('lead_id, status, sequence_index, scheduled_at, sent_at, error_message')
    .order('sequence_index', { ascending: true })

  const queueByLead: Record<string, typeof queue> = {}
  for (const item of queue ?? []) {
    if (!queueByLead[item.lead_id]) queueByLead[item.lead_id] = []
    queueByLead[item.lead_id]!.push(item)
  }

  const total = leads?.length ?? 0
  const converted = leads?.filter(l => l.converted_to_purchase).length ?? 0
  const totalSent = Object.values(queueByLead).flat().filter(i => i?.status === 'sent').length
  const totalFailed = Object.values(queueByLead).flat().filter(i => i?.status === 'failed').length

  return (
    <div className="min-h-screen bg-navy p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Leadovi</h1>
          <p className="text-white/50 mt-1">Osobe koje su preuzele besplatni vodič + status email sekvence</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { icon: Users, label: 'Ukupno leadova', value: total, color: 'text-cyan-400', bg: 'bg-cyan-500/10 border-cyan-500/20' },
            { icon: CheckCircle, label: 'Konvertirani', value: converted, color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/20' },
            { icon: Mail, label: 'Emailova poslano', value: totalSent, color: 'text-gold', bg: 'bg-gold/10 border-gold/20' },
            { icon: AlertCircle, label: 'Greške slanja', value: totalFailed, color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20' },
          ].map(s => (
            <div key={s.label} className={`border rounded-xl p-4 ${s.bg}`}>
              <s.icon className={`w-5 h-5 ${s.color} mb-2`} />
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-white/50 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Lead kartice s bulk-select */}
        <LeadoviClient
          leads={leads ?? []}
          queueByLead={queueByLead}
          courses={courses ?? []}
        />
      </div>
    </div>
  )
}
