'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'

function generateCodeFromEmail(email: string): string {
  const local = email.split('@')[0] ?? ''
  return local
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
    .slice(0, 20)
}

export default function NoviAffiliatePage() {
  const router = useRouter()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [commissionPercent, setCommissionPercent] = useState(30)
  const [codeManuallyEdited, setCodeManuallyEdited] = useState(false)
  const [saving, setSaving] = useState(false)

  function handleEmailChange(val: string) {
    setEmail(val)
    if (!codeManuallyEdited) {
      setCode(generateCodeFromEmail(val))
    }
  }

  function handleCodeChange(val: string) {
    setCodeManuallyEdited(true)
    setCode(val.toLowerCase().replace(/[^a-z0-9_-]/g, ''))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim() || !email.trim() || !code.trim()) {
      toast.error('Popuni sva obavezna polja.')
      return
    }

    setSaving(true)
    try {
      const res = await fetch('/api/admin/affiliates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          code: code.trim(),
          commission_percent: commissionPercent,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        toast.error(data.error ?? 'Greška pri dodavanju partnera.')
        return
      }

      toast.success('Affiliate partner uspješno dodan!')
      router.push('/admin/affiliate')
    } catch {
      toast.error('Greška pri spajanju na server.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6 lg:p-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <Link
          href="/admin/affiliate"
          className="flex items-center gap-1 text-white/40 hover:text-white transition-colors text-sm"
        >
          <ChevronLeft className="w-4 h-4" />
          Nazad
        </Link>
        <span className="text-white/20">/</span>
        <h1 className="text-2xl font-bold text-white">Novi affiliate partner</h1>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-navy-50 border border-white/10 rounded-2xl p-6 space-y-5">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-white/70 mb-1.5">
              Ime i prezime <span className="text-gold">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="npr. Ana Horvat"
              required
              className="w-full bg-navy border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/25 focus:outline-none focus:border-gold/40 transition-colors"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-white/70 mb-1.5">
              Email adresa <span className="text-gold">*</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={e => handleEmailChange(e.target.value)}
              placeholder="partner@example.com"
              required
              className="w-full bg-navy border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/25 focus:outline-none focus:border-gold/40 transition-colors"
            />
          </div>

          {/* Affiliate code */}
          <div>
            <label className="block text-sm font-medium text-white/70 mb-1.5">
              Affiliate kod <span className="text-gold">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={code}
                onChange={e => handleCodeChange(e.target.value)}
                placeholder="anahorvat"
                required
                className="w-full bg-navy border border-white/10 rounded-xl px-4 py-3 text-white text-sm font-mono placeholder:text-white/25 focus:outline-none focus:border-gold/40 transition-colors"
              />
            </div>
            <p className="text-xs text-white/30 mt-1.5">
              Auto-generiran iz emaila. Može sadržavati slova, brojeve, - i _
            </p>
          </div>

          {/* Commission */}
          <div>
            <label className="block text-sm font-medium text-white/70 mb-1.5">
              Komisija %
            </label>
            <div className="flex items-center gap-3">
              <input
                type="number"
                value={commissionPercent}
                onChange={e => setCommissionPercent(Math.min(100, Math.max(0, parseInt(e.target.value) || 0)))}
                min={0}
                max={100}
                className="w-28 bg-navy border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-gold/40 transition-colors"
              />
              <span className="text-white/40 text-sm">% od svake prodaje</span>
            </div>
            <p className="text-xs text-white/30 mt-1.5">Zadana vrijednost: 30%</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <Button
            type="submit"
            loading={saving}
            className="bg-gold text-navy font-bold hover:bg-gold/90"
          >
            Spremi partnera
          </Button>
          <Link href="/admin/affiliate">
            <Button type="button" variant="outline">
              Odustani
            </Button>
          </Link>
        </div>
      </form>
    </div>
  )
}
