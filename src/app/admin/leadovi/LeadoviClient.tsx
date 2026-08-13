'use client'

import { useState, useTransition } from 'react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Mail, CheckCircle, Clock, Trash2, Loader2 } from 'lucide-react'
import { EMAIL_SEQUENCE } from '@/lib/email-sequence'
import { DeleteLeadButton, ConvertLeadButton } from './DeleteLeadButton'
import { bulkDeleteLeads } from './actions'

type Lead = {
  id: string
  email: string
  full_name: string | null
  created_at: string
  source: string | null
  converted_to_purchase: boolean
}

type QueueItem = {
  lead_id: string
  status: string
  sequence_index: number
  scheduled_at: string
  sent_at: string | null
  error_message: string | null
}

type Course = { slug: string; title: string }

interface Props {
  leads: Lead[]
  queueByLead: Record<string, QueueItem[]>
  courses: Course[]
}

export default function LeadoviClient({ leads, queueByLead, courses }: Props) {
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [pending, startTransition] = useTransition()

  const allIds = leads.map(l => l.id)
  const allSelected = allIds.length > 0 && allIds.every(id => selected.has(id))

  function toggleAll() {
    if (allSelected) {
      setSelected(new Set())
    } else {
      setSelected(new Set(allIds))
    }
  }

  function toggleOne(id: string) {
    setSelected(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  function handleBulkDelete() {
    const ids = [...selected]
    if (!ids.length) return
    if (!confirm(`Izbriši ${ids.length} označenih leadova?\n\nOvo briše i email sekvencu i kontakte iz Breva. Ova akcija je nepovratna.`)) return
    startTransition(async () => {
      await bulkDeleteLeads(ids)
      setSelected(new Set())
    })
  }

  return (
    <div className="space-y-4">
      {/* Toolbar za bulk akcije */}
      <div className="flex items-center gap-3 flex-wrap">
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={allSelected}
            onChange={toggleAll}
            className="w-4 h-4 accent-[#D4AF37] cursor-pointer"
          />
          <span className="text-sm text-white/50 hover:text-white/70 transition-colors">
            {allSelected ? 'Odznači sve' : 'Označi sve'}
          </span>
        </label>

        {selected.size > 0 && (
          <button
            onClick={handleBulkDelete}
            disabled={pending}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-red-400 border border-red-500/40 rounded-lg hover:bg-red-500/10 transition-colors disabled:opacity-50"
          >
            {pending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Trash2 className="w-4 h-4" />
            )}
            {pending ? 'Brišem...' : `Izbriši označene (${selected.size})`}
          </button>
        )}

        {selected.size > 0 && (
          <span className="text-xs text-white/30">
            {selected.size} od {leads.length} označeno
          </span>
        )}
      </div>

      {/* Lead kartice */}
      {leads.length === 0 ? (
        <Card><CardContent className="pt-6"><p className="text-white/40 text-sm">Još nema leadova.</p></CardContent></Card>
      ) : leads.map(lead => {
        const items = queueByLead[lead.id] ?? []
        const sent = items.filter(i => i.status === 'sent')
        const pendingItems = items.filter(i => i.status === 'pending')
        const failed = items.filter(i => i.status === 'failed')
        const skipped = items.filter(i => i.status === 'skipped')
        const lastSent = sent.length > 0 ? sent[sent.length - 1] : null
        const lastSubject = lastSent ? EMAIL_SEQUENCE[lastSent.sequence_index]?.subject : null
        const nextPending = pendingItems.length > 0 ? pendingItems[0] : null
        const nextSubject = nextPending ? EMAIL_SEQUENCE[nextPending.sequence_index]?.subject : null
        const nextDate = nextPending ? new Date(nextPending.scheduled_at) : null
        const isSelected = selected.has(lead.id)

        return (
          <Card
            key={lead.id}
            className={`border transition-colors cursor-pointer ${isSelected ? 'border-red-500/50 bg-red-500/5' : 'border-white/10'}`}
            onClick={() => toggleOne(lead.id)}
          >
            <CardContent className="pt-5">
              <div className="flex flex-col lg:flex-row lg:items-start gap-4">

                {/* Checkbox */}
                <div className="flex items-start pt-0.5 shrink-0" onClick={e => e.stopPropagation()}>
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleOne(lead.id)}
                    className="w-4 h-4 accent-[#D4AF37] cursor-pointer mt-1"
                  />
                </div>

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
                    <p className="text-lg font-bold text-blue-400">{pendingItems.length}</p>
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
                <div className="flex flex-col gap-2 shrink-0" onClick={e => e.stopPropagation()}>
                  {!lead.converted_to_purchase && (
                    <ConvertLeadButton
                      leadId={lead.id}
                      leadEmail={lead.email}
                      leadName={lead.full_name || lead.email}
                      courses={courses}
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
                {sent.length === 0 && pendingItems.length === 0 && (
                  <div className="bg-white/3 border border-white/8 rounded-lg p-3 col-span-2">
                    <p className="text-white/40 text-xs">Email sekvenca još nije kreirana za ovog leada.</p>
                  </div>
                )}
              </div>

              {/* Greške */}
              {failed.length > 0 && (
                <div className="mt-3 p-3 bg-red-500/5 border border-red-500/20 rounded-lg">
                  <p className="text-xs text-red-400 font-medium mb-1">Greške slanja:</p>
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
  )
}
