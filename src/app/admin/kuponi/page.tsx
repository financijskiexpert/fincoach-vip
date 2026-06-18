'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Plus, Copy, Trash2, Save, X } from 'lucide-react'
import { toast } from 'sonner'

interface Coupon {
  id: string
  code: string
  discount_type: 'percentage' | 'fixed'
  discount_value: number
  max_uses: number | null
  used_count: number
  expires_at: string | null
  is_active: boolean
  created_at: string
}

export default function AdminKuponi() {
  const [coupons, setCoupons] = useState<Coupon[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    code: '',
    discount_type: 'percentage' as 'percentage' | 'fixed',
    discount_value: '',
    max_uses: '',
    expires_at: '',
    is_active: true,
  })

  useEffect(() => { fetchCoupons() }, [])

  async function fetchCoupons() {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/kuponi')
      const data = await res.json()
      setCoupons(data.coupons ?? [])
    } catch {
      toast.error('Greška pri dohvaćanju kupona.')
    } finally {
      setLoading(false)
    }
  }

  function generateCode() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    const code = Array.from({ length: 8 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
    setForm(f => ({ ...f, code }))
  }

  async function saveCoupon() {
    if (!form.code || !form.discount_value) {
      toast.error('Kod i popust su obavezni.')
      return
    }
    try {
      const res = await fetch('/api/admin/kuponi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: form.code.toUpperCase(),
          discount_type: form.discount_type,
          discount_value: parseFloat(form.discount_value),
          max_uses: form.max_uses ? parseInt(form.max_uses) : null,
          expires_at: form.expires_at || null,
          is_active: form.is_active,
        }),
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error ?? 'Greška')
      }
      toast.success('Kupon kreiran.')
      setShowForm(false)
      setForm({ code: '', discount_type: 'percentage', discount_value: '', max_uses: '', expires_at: '', is_active: true })
      fetchCoupons()
    } catch (e: any) {
      toast.error(e.message ?? 'Greška pri snimanju.')
    }
  }

  async function toggleCoupon(id: string, is_active: boolean) {
    try {
      await fetch('/api/admin/kuponi', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, is_active: !is_active }),
      })
      fetchCoupons()
    } catch { toast.error('Greška.') }
  }

  async function deleteCoupon(id: string) {
    if (!confirm('Jesi siguran/na?')) return
    try {
      await fetch(`/api/admin/kuponi?id=${id}`, { method: 'DELETE' })
      toast.success('Kupon obrisan.')
      fetchCoupons()
    } catch { toast.error('Greška.') }
  }

  function copyCode(code: string) {
    navigator.clipboard.writeText(code)
    toast.success(`Kod ${code} kopiran!`)
  }

  return (
    <div className="max-w-7xl mx-auto p-6 lg:p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Kuponi</h1>
          <p className="text-white/50 mt-1">{coupons.length} ukupno</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="gap-2">
          <Plus className="w-4 h-4" />
          Novi kupon
        </Button>
      </div>

      {showForm && (
        <div className="bg-navy-50 border border-gold/20 rounded-2xl p-6 mb-8">
          <h2 className="text-lg font-bold text-white mb-6">Novi kupon</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-white/50 mb-1.5">Kod kupona *</label>
              <div className="flex gap-2">
                <Input
                  value={form.code}
                  onChange={e => setForm(f => ({ ...f, code: e.target.value.toUpperCase() }))}
                  placeholder="npr. PRILIKA"
                  className="font-mono"
                />
                <Button variant="outline" onClick={generateCode} className="shrink-0">Generiraj</Button>
              </div>
            </div>
            <div>
              <label className="block text-sm text-white/50 mb-1.5">Vrsta popusta</label>
              <select
                value={form.discount_type}
                onChange={e => setForm(f => ({ ...f, discount_type: e.target.value as 'percentage' | 'fixed' }))}
                className="w-full bg-navy border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-gold/40"
              >
                <option value="percentage">Postotak (%)</option>
                <option value="fixed">Fiksni iznos (€)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-white/50 mb-1.5">
                Vrijednost popusta * {form.discount_type === 'percentage' ? '(%)' : '(€)'}
              </label>
              <Input
                type="number"
                value={form.discount_value}
                onChange={e => setForm(f => ({ ...f, discount_value: e.target.value }))}
                placeholder={form.discount_type === 'percentage' ? '50' : '100'}
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm text-white/50 mb-1.5">Maks. upotreba (prazno = neograničeno)</label>
              <Input
                type="number"
                value={form.max_uses}
                onChange={e => setForm(f => ({ ...f, max_uses: e.target.value }))}
                placeholder="neograničeno"
                min="1"
              />
            </div>
            <div>
              <label className="block text-sm text-white/50 mb-1.5">Istječe (prazno = nikad)</label>
              <Input
                type="date"
                value={form.expires_at}
                onChange={e => setForm(f => ({ ...f, expires_at: e.target.value }))}
              />
            </div>
            <div className="flex items-center gap-3 self-end pb-1">
              <input
                type="checkbox"
                id="kupon_active"
                checked={form.is_active}
                onChange={e => setForm(f => ({ ...f, is_active: e.target.checked }))}
                className="w-4 h-4 accent-[#D4AF37]"
              />
              <label htmlFor="kupon_active" className="text-sm text-white/70">Aktivan</label>
            </div>
          </div>
          <div className="flex gap-3 mt-6">
            <Button onClick={saveCoupon} className="gap-2"><Save className="w-4 h-4" />Spremi</Button>
            <Button variant="ghost" onClick={() => setShowForm(false)} className="gap-2"><X className="w-4 h-4" />Odustani</Button>
          </div>
        </div>
      )}

      <div className="bg-navy-50 border border-white/10 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-white/30">Učitavam...</div>
        ) : coupons.length === 0 ? (
          <div className="p-12 text-center text-white/30">Još nema kupona.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 bg-white/2">
                  <th className="text-left px-6 py-3 text-white/40 font-medium">Kod</th>
                  <th className="text-left px-6 py-3 text-white/40 font-medium">Popust</th>
                  <th className="text-left px-6 py-3 text-white/40 font-medium">Upotreba</th>
                  <th className="text-left px-6 py-3 text-white/40 font-medium">Istječe</th>
                  <th className="text-left px-6 py-3 text-white/40 font-medium">Status</th>
                  <th className="text-right px-6 py-3 text-white/40 font-medium">Akcije</th>
                </tr>
              </thead>
              <tbody>
                {coupons.map((c) => (
                  <tr key={c.id} className="border-b border-white/5 hover:bg-white/2 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-white">{c.code}</span>
                        <button onClick={() => copyCode(c.code)} className="text-white/30 hover:text-gold transition-colors">
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gold font-semibold">
                      {c.discount_type === 'percentage' ? `${c.discount_value}%` : `€${c.discount_value}`}
                    </td>
                    <td className="px-6 py-4 text-white/60">
                      {c.used_count} / {c.max_uses ?? '∞'}
                    </td>
                    <td className="px-6 py-4 text-white/40">
                      {c.expires_at ? new Date(c.expires_at).toLocaleDateString('hr-HR') : 'Nikad'}
                    </td>
                    <td className="px-6 py-4">
                      <button onClick={() => toggleCoupon(c.id, c.is_active)}>
                        {c.is_active ? (
                          <Badge className="bg-green-500/10 text-green-400 border-green-500/20 cursor-pointer hover:bg-green-500/20">Aktivan</Badge>
                        ) : (
                          <Badge className="bg-white/5 text-white/40 border-white/10 cursor-pointer hover:bg-white/10">Neaktivan</Badge>
                        )}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end">
                        <button onClick={() => deleteCoupon(c.id)} className="p-2 text-white/30 hover:text-red-400 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
