import { redirect } from 'next/navigation'
import { createClient, createServiceClient } from '@/lib/supabase/server'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Mail, Users, CheckCircle, Clock, AlertCircle } from 'lucide-react'
import { EMAIL_SEQUENCE } from '@/lib/email-sequence'
import { DeleteLeadButton, ConvertLeadButton } from './DeleteLeadButton'

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

        {/* Lead kartice */}
        <div className="space-y-4">
          {!leads || leads.length === 0 ? (
            <Card><CardContent className="pt-6"><p className="text-white/40 text-sm">Još nema leadova.</p></CardContent></Card>
          ) : leads.map(lead => {
            const items = queueByLead[lead.id] ?? []
            const sent = items.filter(i => i.status === 'sent')
            const pending = items.filter(i => i.status === 'pending')
            const failed = items.filter(i => i.status === 'failed')
            const skipped = items.filter(i => i.status === 'skipped')
            const lastSent = sent.length > 0 ? sent[sent.length - 1] : null
            const lastSubject = lastSent ? EMAIL_SEQUENCE[lastSent.sequence_index]?.subject : null
            const nextPending = pending.length > 0 ? pending[0] : null
            const nextSubject = nextPending ? EMAIL_SEQUENCE[nextPending.sequence_index]?.subject : null
            const nextDate = nextPending ? new Date(nextPending.scheduled_at) : null

            return (
              <Card key={lead.id} className="border-white/10">
                <CardContent className="pt-5">
                  <div className="flex flex-col lg:flex-row lg:items-start gap-4">

                    {/* Podaci */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1 flex-wrap">
                        <h3 className="text-white font-semibold text-base">{lead.full_name || '(bez imena)'}</h3>
                        {lead.converted_to_purchase && (
                          <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">Kupio/la</Badge>
                        )}
                      </div>
                      <p className="text-white/60 text-sm">{lead.email}</p>
                      <p className="text-white/30 text-xs mt-1">
                        Prijavljen/a: {new Date(lead.created_at).toLocaleDateString('hr-HR', {
                          day: '2-digit', month: '2-digit', year: 'numeric',
                          hour: '2-digit', minute: '2-digit',
                        })} · {lead.source ?? 'landing'}
                      </p>
                    </div>

                    {/* Email brojevci */}
                    <div className="flex gap-2 shrink-0 flex-wrap">
                      <div className="text-center px-3 py-2 bg-green-500/10 border border-green-500/20 rounded-lg">
                        <p className="text-lg font-bold text-green-400">{sent.length}</p>
                        <p className="text-xs text-white/40">Poslano</p>
                      </div>
                      <div className="text-center px-3 py-2 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                        <p className="text-lg font-bold text-blue-400">{pending.length}</p>
                        <p className="text-xs text-white/40">Čeka</p>
                      </div>
                      <div className="text-center px-3 py-2 bg-white/5 border border-white/10 rounded-lg">
                        <p className="text-lg font-bold text-white/40">{skipped.length}</p>
                        <p className="text-xs text-white/40">Preskočeno</p>
                      </div>
                      {failed.length > 0 && (
                        <div className="text-center px-3 py-2 bg-red-500/10 border border-red-500/20 rounded-lg">
                          <p className="text-lg font-bold text-red-400">{failed.length}</p>
                          <p className="text-xs text-white/40">Greška</p>
                        </div>
                      )}
                    </div>

                    {/* Admin akcije */}
                    <div className="flex flex-col gap-2 shrink-0">
                      {!lead.converted_to_purchase && (
                        <ConvertLeadButton
                          leadId={lead.id}
                          leadEmail={lead.email}
                          leadName={lead.full_name || lead.email}
                          courses={courses ?? []}
                        />
                      )}
                      <DeleteLeadButton leadId={lead.id} email={lead.email} />
                    </div>
                  </div>

                  {/* Zadnji + sljedeći email */}
                  <div className="mt-4 grid sm:grid-cols-2 gap-3">
                    {lastSent && lastSubject && (
                      <div className="bg-white/3 border border-white/8 rounded-lg p-3">
                        <div className="flex items-center gap-1.5 mb-1">
                          <CheckCircle className="w-3 h-3 text-green-400 shrink-0" />
                          <span className="text-xs text-green-400 font-medium">Zadnji poslani email</span>
                        </div>
                        <p className="text-white text-sm font-medium leading-tight">{lastSubject}</p>
                        <p className="text-white/30 text-xs mt-1">
                          Email #{lastSent.sequence_index + 1} · {lastSent.sent_at ? new Date(lastSent.sent_at).toLocaleDateString('hr-HR') : '—'}
                        </p>
                      </div>
                    )}
                    {nextPending && nextSubject && (
                      <div className="bg-white/3 border border-white/8 rounded-lg p-3">
                        <div className="flex items-center gap-1.5 mb-1">
                          <Clock className="w-3 h-3 text-blue-400 shrink-0" />
                          <span className="text-xs text-blue-400 font-medium">Sljedeći email</span>
                        </div>
                        <p className="text-white text-sm font-medium leading-tight">{nextSubject}</p>
                        <p className="text-white/30 text-xs mt-1">
                          Email #{nextPending.sequence_index + 1} · {nextDate ? nextDate.toLocaleDateString('hr-HR') : '—'}
                        </p>
                      </div>
                    )}
                    {sent.length === 0 && pending.length === 0 && (
                      <div className="bg-white/3 border border-white/8 rounded-lg p-3 col-span-2">
                        <p className="text-white/40 text-xs">Email sekvenca još nije kreirana za ovog leada.</p>
                      </div>
                    )}
                  </div>

                  {/* Greške */}
                  {failed.length > 0 && (
                    <div className="mt-3 p-3 bg-red-500/5 border border-red-500/20 rounded-lg">
                      <p className="text-xs text-red-400 font-medium mb-1">⚠️ Greške slanja:</p>
                      {failed.map(f => (
                        <p key={f.sequence_index} className="text-xs text-red-300/70">
                          Email #{f.sequence_index + 1}: {f.error_message ?? 'Nepoznata greška'}
                        </p>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}
