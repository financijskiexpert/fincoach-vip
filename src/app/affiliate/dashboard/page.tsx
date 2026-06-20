'use client'

import { useEffect, useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { useRouter } from 'next/navigation'

interface AffiliateData {
  id: string
  name: string
  email: string
  code: string
  commission_percent: number
  total_sales: number
  total_commission: number
  total_conversions: number
  is_active: boolean
}

interface Conversion {
  id: string
  commission_amount: number
  status: string
  created_at: string
  purchase_id: string
}

export default function AffiliateDashboardPage() {
  const router = useRouter()
  const [affiliate, setAffiliate] = useState<AffiliateData | null>(null)
  const [conversions, setConversions] = useState<Conversion[]>([])
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://fincoach.vip'

  useEffect(() => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/prijava'); return }

      const { data: aff } = await supabase
        .from('affiliates')
        .select('*')
        .eq('email', user.email)
        .single()

      if (!aff) { router.push('/affiliate'); return }
      setAffiliate(aff)

      const { data: convs } = await supabase
        .from('affiliate_conversions')
        .select('*')
        .eq('affiliate_id', aff.id)
        .order('created_at', { ascending: false })
        .limit(50)
      setConversions(convs ?? [])
      setLoading(false)
    }
    load()
  }, [router])

  function copyLink() {
    if (!affiliate) return
    navigator.clipboard.writeText(`${siteUrl}?ref=${affiliate.code}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (loading) return (
    <div className="min-h-screen bg-[#0D1B2A] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
    </div>
  )

  if (!affiliate) return null

  const pendingCommission = conversions
    .filter(c => c.status === 'pending')
    .reduce((s, c) => s + Number(c.commission_amount), 0)

  const affiliateLink = `${siteUrl}?ref=${affiliate.code}`

  return (
    <div className="min-h-screen bg-[#0D1B2A] text-white">
      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-black">Affiliate dashboard</h1>
          <p className="text-gray-400 mt-1">Dobrodošao/la, <span className="text-white">{affiliate.name.split(' ')[0]}</span>!</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Ukupno prodaja', value: `€${Number(affiliate.total_sales).toFixed(0)}` },
            { label: 'Zarađena provizija', value: `€${Number(affiliate.total_commission).toFixed(2)}` },
            { label: 'Konverzije', value: affiliate.total_conversions },
            { label: 'Na čekanju', value: `€${pendingCommission.toFixed(2)}` },
          ].map((s) => (
            <div key={s.label} className="bg-[#091623] border border-white/10 rounded-xl p-5 text-center">
              <div className="text-2xl font-black text-[#D4AF37]">{s.value}</div>
              <div className="text-gray-500 text-xs mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Affiliate link */}
        <div className="bg-[#091623] border border-[#D4AF37]/30 rounded-xl p-6 mb-8">
          <h2 className="text-lg font-bold text-[#D4AF37] mb-4">Tvoja affiliate veza</h2>
          <div className="flex gap-3 items-center flex-wrap">
            <div className="flex-1 bg-[#0D1B2A] border border-white/20 rounded-lg px-4 py-3 font-mono text-sm text-gray-300 min-w-0 truncate">
              {affiliateLink}
            </div>
            <button
              onClick={copyLink}
              className="bg-[#D4AF37] text-[#0D1B2A] font-bold px-5 py-3 rounded-lg hover:bg-yellow-400 transition text-sm whitespace-nowrap"
            >
              {copied ? '✓ Kopirano!' : 'Kopiraj vezu'}
            </button>
          </div>
          <div className="mt-4 flex gap-4 flex-wrap">
            <div className="bg-[#0D1B2A] border border-white/10 rounded-lg px-4 py-2 text-sm">
              <span className="text-gray-500">Tvoj kod: </span>
              <span className="font-mono text-white font-bold">{affiliate.code}</span>
            </div>
            <div className="bg-[#0D1B2A] border border-white/10 rounded-lg px-4 py-2 text-sm">
              <span className="text-gray-500">Provizija: </span>
              <span className="text-[#D4AF37] font-bold">{affiliate.commission_percent}%</span>
            </div>
            <div className="bg-[#0D1B2A] border border-white/10 rounded-lg px-4 py-2 text-sm">
              <span className="text-gray-500">Popust za kupce: </span>
              <span className="text-[#D4AF37] font-bold">10%</span>
            </div>
          </div>
        </div>

        {/* Conversions */}
        <div className="bg-[#091623] border border-white/10 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-white/10">
            <h2 className="text-lg font-bold">Konverzije</h2>
          </div>
          {conversions.length === 0 ? (
            <div className="px-6 py-12 text-center text-gray-500">
              <div className="text-4xl mb-3">🎯</div>
              <p>Još nema konverzija. Podijeli svoju affiliate vezu i počni zarađivati!</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10 text-gray-500">
                    <th className="px-6 py-3 text-left font-medium">Datum</th>
                    <th className="px-6 py-3 text-right font-medium">Provizija</th>
                    <th className="px-6 py-3 text-left font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {conversions.map((c) => (
                    <tr key={c.id} className="border-b border-white/5 hover:bg-white/5">
                      <td className="px-6 py-3 text-gray-400">{new Date(c.created_at).toLocaleDateString('hr-HR')}</td>
                      <td className="px-6 py-3 text-right text-[#D4AF37] font-bold">€{Number(c.commission_amount).toFixed(2)}</td>
                      <td className="px-6 py-3">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                          c.status === 'paid' ? 'bg-green-900/50 text-green-400' :
                          c.status === 'pending' ? 'bg-yellow-900/50 text-yellow-400' :
                          'bg-red-900/50 text-red-400'
                        }`}>
                          {c.status === 'paid' ? 'Isplaćeno' : c.status === 'pending' ? 'Na čekanju' : 'Otkazano'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <p className="text-center text-gray-600 text-xs mt-8">
          Pitanja? Napiši na <a href="mailto:brane@fincoach.vip" className="text-gray-500 hover:text-white">brane@fincoach.vip</a>
        </p>
      </div>
    </div>
  )
}
