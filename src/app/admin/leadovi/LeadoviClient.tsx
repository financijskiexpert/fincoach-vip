'use client'

import { useState, useTransition } from 'react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { CheckCircle, Clock, Trash2, Loader2 } from 'lucide-react'
import { DeleteLeadButton, ConvertLeadButton } from './DeleteLeadButton'
import { bulkDeleteLeads } from './actions'

type EnrichedLead = {
  id: string
  email: string
  full_name: string | null
  created_at: string
  source: string | null
  converted_to_purchase: boolean
  sentCount: number
  pendingCount: number
  failedCount: number
  skippedCount: number
  lastSubject: string | null
  lastSentIndex: number | null
  lastSentAt: string | null
  nextSubject: string | null
  nextIndex: number | null
  nextScheduledAt: string | null
  failedDetails: { index: number; error: string | null }[]
}

type Course = { slug: string; title: string }

interface Props {
  leads: EnrichedLead[]
  courses: Course[]
}

export default function LeadoviClient({ leads, courses }: Props) {
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [pending, startTransition] = useTransition()

  const allIds = leads.map(l => l.id)
  const allSelected = allIds.length > 0 && allIds.every(id => selected.has(id))

  function toggleAll() {
    setSelected(allSelected ? new Set() : new Set(allIds))
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
    if (!confirm(`Izbriši ${ids.length} označenih leadova?\n\nBriše se email sekvenca i kontakti iz Breva. Akcija je nepovratna.`)) return
    startTransition(async () => {
      await bulkDeleteLeads(ids)
      setSelected(new Set())
    })
  }

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center gap-4 flex-wrap py-2">
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
          <>
            <button
              onClick={handleBulkDelete}
              disabled={pending}
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-red-400 border border-red-500/40 rounded-lg hover:bg-red-500/10 transition-colors disabled:opacity-50"
            >
              {pending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
              {pending ? 'Brišem...' : `Izbriši označene (${selected.size})`}
            </button>
            <span className="text-xs text-white/30">{selected.size} od {leads.length} označeno</span>
          </>
        )}
      </div>

      {/* Kartice */}
      {leads.length === 0 ? (
        <Card><CardContent className="pt-6"><p className="text-white/40 text-sm">Još nema leadova.</p></CardContent></Card>
      ) : leads.map(lead => {
        const isSelected = selected.has(lead.id)
        return (
          <Card
            key={lead.id}
            onClick={() => toggleOne(lead.id)}
            className={`border transition-colors cursor-pointer ${isSelected ? 'border-red-500/50 bg-red-500/5' : 'border-white/10 hover:border-white/20'}`}
          >
            <CardContent className="pt-5">
              <div className="flex flex-col lg:flex-row lg:items-start gap-4">

                {/* Checkbox */}
                <div className="shrink-0 pt-1" onClick={e => e.stopPropagation()}>
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleOne(lead.id)}
                    className="w-4 h-4 accent-[#D4AF37] cursor-pointer"
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

                {/* Brojevci */}
                <div className="flex gap-2 shrink-0 flex-wrap">
                  <div className="text-center px-3 py-2 bg-green-500/10 border border-green-500/20 rounded-lg">
                    <p className="text-lg font-bold text-green-400">{lead.sentCount}</p>
                    <p className="text-xs text-white/40">Poslano</p>
                  </div>
                  <div className="text-center px-3 py-2 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                    <p className="text-lg font-bold text-blue-400">{lead.pendingCount}</p>
                    <p className="text-xs text-white/40">Čeka</p>
                  </div>
                  <div className="text-center px-3 py-2 bg-white/5 border border-white/10 rounded-lg">
                    <p className="text-lg font-bold text-white/40">{lead.skippedCount}</p>
                    <p className="text-xs text-white/40">Preskočeno</p>
                  </div>
                  {lead.failedCount > 0 && (
                    <div className="text-center px-3 py-2 bg-red-500/10 border border-red-500/20 rounded-lg">
                      <p className="text-lg font-bold text-red-400">{lead.failedCount}</p>
                      <p className="text-xs text-white/40">Greška</p>
                    </div>
                  )}
                </div>

                {/* Akcije */}
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
                {lead.lastSubject && (
                  <div className="bg-white/3 border border-white/8 rounded-lg p-3">
                    <div className="flex items-center gap-1.5 mb-1">
                      <CheckCircle className="w-3 h-3 text-green-400 shrink-0" />
                      <span className="text-xs text-green-400 font-medium">Zadnji poslani email</span>
                    </div>
                    <p className="text-white text-sm font-medium leading-tight">{lead.lastSubject}</p>
                    <p className="text-white/30 text-xs mt-1">
                      Email #{(lead.lastSentIndex ?? 0) + 1} · {lead.lastSentAt ? new Date(lead.lastSentAt).toLocaleDateString('hr-HR') : '—'}
                    </p>
                  </div>
                )}
                {lead.nextSubject && (
                  <div className="bg-white/3 border border-white/8 rounded-lg p-3">
                    <div className="flex items-center gap-1.5 mb-1">
                      <Clock className="w-3 h-3 text-blue-400 shrink-0" />
                      <span className="text-xs text-blue-400 font-medium">Sljedeći email</span>
                    </div>
                    <p className="text-white text-sm font-medium leading-tight">{lead.nextSubject}</p>
                    <p className="text-white/30 text-xs mt-1">
                      Email #{(lead.nextIndex ?? 0) + 1} · {lead.nextScheduledAt ? new Date(lead.nextScheduledAt).toLocaleDateString('hr-HR') : '—'}
                    </p>
                  </div>
                )}
                {lead.sentCount === 0 && lead.pendingCount === 0 && (
                  <div className="bg-white/3 border border-white/8 rounded-lg p-3 col-span-2">
                    <p className="text-white/40 text-xs">Email sekvenca još nije kreirana za ovog leada.</p>
                  </div>
                )}
              </div>

              {/* Greške */}
              {lead.failedDetails.length > 0 && (
                <div className="mt-3 p-3 bg-red-500/5 border border-red-500/20 rounded-lg">
                  <p className="text-xs text-red-400 font-medium mb-1">Greške slanja:</p>
                  {lead.failedDetails.map(f => (
                    <p key={f.index} className="text-xs text-red-300/70">
                      Email #{f.index + 1}: {f.error ?? 'Nepoznata greška'}
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
