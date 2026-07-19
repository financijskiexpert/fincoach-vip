'use client'

import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CheckCircle, XCircle, Zap, Clock } from 'lucide-react'

const FINANCIAL_TYPE_LABELS: Record<string, { label: string; color: string }> = {
  hedonist: { label: 'Hedonist', color: 'bg-red-500/20 text-red-300' },
  branic: { label: 'Branič', color: 'bg-blue-500/20 text-blue-300' },
  vrtlog: { label: 'Vrtlog', color: 'bg-orange-500/20 text-orange-300' },
  teoreticar: { label: 'Teoretičar', color: 'bg-purple-500/20 text-purple-300' },
}

interface StarterEntry {
  id: string
  email: string
  full_name: string | null
  financial_type: string | null
  status: string
  created_at: string
  upgrade_coupon_used: boolean | null
  token: string | null
  has_vsn: boolean
}

interface Props {
  starters: StarterEntry[]
}

export default function AdminStarterClient({ starters }: Props) {
  const [entries, setEntries] = useState(starters)
  const [loading, setLoading] = useState<string | null>(null)
  const [msg, setMsg] = useState<{ id: string; text: string; ok: boolean } | null>(null)

  async function grantVSN(entry: StarterEntry) {
    setLoading(entry.id)
    setMsg(null)
    try {
      const res = await fetch('/api/admin/grant-vsn', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: entry.email, full_name: entry.full_name }),
      })
      const data = await res.json()
      if (data.ok) {
        setEntries(prev => prev.map(e => e.id === entry.id ? { ...e, has_vsn: true } : e))
        setMsg({ id: entry.id, text: 'VSN pristup dodijeljen!', ok: true })
      } else {
        setMsg({ id: entry.id, text: data.error ?? 'Greška.', ok: false })
      }
    } catch {
      setMsg({ id: entry.id, text: 'Mrežna greška.', ok: false })
    } finally {
      setLoading(null)
    }
  }

  if (entries.length === 0) {
    return (
      <div className="text-center py-12">
        <Zap className="w-10 h-10 text-white/20 mx-auto mb-3" />
        <p className="text-white/40 text-sm">Još nema Starter kupaca.</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-white/10">
            <th className="text-left pb-3 text-white/40 font-medium">Ime / Email</th>
            <th className="text-left pb-3 text-white/40 font-medium">Finančni tip</th>
            <th className="text-left pb-3 text-white/40 font-medium">Status</th>
            <th className="text-center pb-3 text-white/40 font-medium">Portal login</th>
            <th className="text-center pb-3 text-white/40 font-medium">VSN pristup</th>
            <th className="text-center pb-3 text-white/40 font-medium">Upgrade kupon</th>
            <th className="text-right pb-3 text-white/40 font-medium">Kupljeno</th>
            <th className="text-right pb-3 text-white/40 font-medium">Garancija</th>
            <th className="text-right pb-3 text-white/40 font-medium">Akcija</th>
          </tr>
        </thead>
        <tbody>
          {entries.map(entry => {
            const typeInfo = entry.financial_type ? FINANCIAL_TYPE_LABELS[entry.financial_type] : null
            return (
              <tr key={entry.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                <td className="py-3 pr-4">
                  <p className="text-white font-medium">{entry.full_name ?? '—'}</p>
                  <p className="text-white/40 text-xs">{entry.email}</p>
                </td>
                <td className="py-3 pr-4">
                  {typeInfo ? (
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${typeInfo.color}`}>
                      {typeInfo.label}
                    </span>
                  ) : (
                    <span className="text-white/30 text-xs">Nije završio kviz</span>
                  )}
                </td>
                <td className="py-3 pr-4">
                  <Badge className={entry.status === 'active'
                    ? 'bg-green-500/20 text-green-300 border-green-500/30'
                    : 'bg-red-500/20 text-red-300 border-red-500/30'
                  }>
                    {entry.status}
                  </Badge>
                </td>
                <td className="py-3 pr-4 text-center">
                  {entry.token ? (
                    <CheckCircle className="w-4 h-4 text-green-400 mx-auto" />
                  ) : (
                    <XCircle className="w-4 h-4 text-white/20 mx-auto" />
                  )}
                </td>
                <td className="py-3 pr-4 text-center">
                  {entry.has_vsn ? (
                    <CheckCircle className="w-4 h-4 text-gold mx-auto" />
                  ) : (
                    <XCircle className="w-4 h-4 text-white/20 mx-auto" />
                  )}
                </td>
                <td className="py-3 pr-4 text-center">
                  {entry.upgrade_coupon_used ? (
                    <CheckCircle className="w-4 h-4 text-blue-400 mx-auto" />
                  ) : (
                    <XCircle className="w-4 h-4 text-white/20 mx-auto" />
                  )}
                </td>
                <td className="py-3 pr-4 text-right text-white/40 text-xs">
                  {new Date(entry.created_at).toLocaleDateString('hr-HR')}
                </td>
                <td className="py-3 pr-4 text-right text-xs">
                  {(() => {
                    const expiry = new Date(new Date(entry.created_at).getTime() + 7 * 24 * 60 * 60 * 1000)
                    const now = new Date()
                    const active = expiry > now
                    const daysLeft = Math.max(0, Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)))
                    return active ? (
                      <span className="inline-flex items-center gap-1 text-yellow-400">
                        <Clock className="w-3 h-3" />
                        {daysLeft}d
                      </span>
                    ) : (
                      <span className="text-white/20">Istekla</span>
                    )
                  })()}
                </td>
                <td className="py-3 text-right">
                  {msg?.id === entry.id && (
                    <span className={`text-xs mr-2 ${msg.ok ? 'text-green-400' : 'text-red-400'}`}>
                      {msg.text}
                    </span>
                  )}
                  {!entry.has_vsn ? (
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-gold/40 text-gold hover:bg-gold/10 text-xs"
                      disabled={loading === entry.id}
                      onClick={() => grantVSN(entry)}
                    >
                      {loading === entry.id ? 'Dodajem...' : 'Daj VSN'}
                    </Button>
                  ) : (
                    <span className="text-xs text-white/30">VSN aktivan</span>
                  )}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
