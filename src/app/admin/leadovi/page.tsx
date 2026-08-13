import { redirect } from 'next/navigation'
import { createClient, createServiceClient } from '@/lib/supabase/server'
import { Mail, Users, CheckCircle, AlertCircle } from 'lucide-react'
import { EMAIL_SEQUENCE } from '@/lib/email-sequence'
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

  // Preračunaj vse na serverju — client ne potrebuje EMAIL_SEQUENCE
  const enrichedLeads = (leads ?? []).map(lead => {
    const items = queueByLead[lead.id] ?? []
    const sent = items.filter(i => i?.status === 'sent')
    const pending = items.filter(i => i?.status === 'pending')
    const failed = items.filter(i => i?.status === 'failed')
    const skipped = items.filter(i => i?.status === 'skipped')
    const lastSent = sent.at(-1) ?? null
    const nextPending = pending[0] ?? null
    return {
      id: lead.id,
      email: lead.email,
      full_name: lead.full_name as string | null,
      created_at: lead.created_at as string,
      source: lead.source as string | null,
      converted_to_purchase: lead.converted_to_purchase as boolean,
      sentCount: sent.length,
      pendingCount: pending.length,
      failedCount: failed.length,
      skippedCount: skipped.length,
      lastSubject: lastSent ? (EMAIL_SEQUENCE[lastSent.sequence_index]?.subject ?? null) : null,
      lastSentIndex: lastSent?.sequence_index ?? null,
      lastSentAt: lastSent?.sent_at ?? null,
      nextSubject: nextPending ? (EMAIL_SEQUENCE[nextPending.sequence_index]?.subject ?? null) : null,
      nextIndex: nextPending?.sequence_index ?? null,
      nextScheduledAt: nextPending?.scheduled_at ?? null,
      failedDetails: failed.map(f => ({ index: f.sequence_index, error: f.error_message ?? null })),
    }
  })

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
          leads={enrichedLeads}
          courses={courses ?? []}
        />
      </div>
    </div>
  )
}
