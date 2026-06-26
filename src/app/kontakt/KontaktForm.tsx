'use client'

import { useState } from 'react'

const teme = [
  { value: 'osiguranje-karijera', label: 'Karijera u osiguranju / suradnja' },
  { value: 'mentorstvo', label: 'Mentorstvo za zastopnike' },
  { value: 'financijsko-savjetovanje', label: 'Financijsko savjetovanje' },
  { value: 'fincoach-vip', label: 'FinCoach VIP program' },
  { value: 'ostalo', label: 'Ostalo' },
]

type Status = 'idle' | 'sending' | 'ok' | 'error'

export default function KontaktForm() {
  const [status, setStatus] = useState<Status>('idle')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('sending')
    const form = e.currentTarget
    const data = new FormData(form)

    try {
      const res = await fetch('/api/kontakt', {
        method: 'POST',
        body: JSON.stringify({
          name: data.get('name'),
          email: data.get('email'),
          phone: data.get('phone'),
          topic: data.get('topic'),
          message: data.get('message'),
        }),
        headers: { 'Content-Type': 'application/json' },
      })
      if (res.ok) {
        setStatus('ok')
        form.reset()
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  if (status === 'ok') {
    return (
      <div className="text-center py-8">
        <p className="text-4xl mb-4">✅</p>
        <p className="text-white font-semibold text-lg mb-2">Poruka poslana!</p>
        <p className="text-white/50 text-sm">Javim se unutar 24 sata.</p>
      </div>
    )
  }

  const inputCls =
    'w-full bg-[#0D1B2A] border border-white/20 rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-[#D4AF37]/50'

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-white/60 mb-1">Ime i prezime *</label>
          <input name="name" required className={inputCls} placeholder="Marko Horvat" />
        </div>
        <div>
          <label className="block text-sm text-white/60 mb-1">Email *</label>
          <input type="email" name="email" required className={inputCls} placeholder="marko@email.com" />
        </div>
      </div>
      <div>
        <label className="block text-sm text-white/60 mb-1">Telefon (opcionalno)</label>
        <input name="phone" className={inputCls} placeholder="+385 91 234 5678" />
      </div>
      <div>
        <label className="block text-sm text-white/60 mb-1">Tema razgovora *</label>
        <select name="topic" required className={inputCls}>
          <option value="">— Odaberi —</option>
          {teme.map(t => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm text-white/60 mb-1">Poruka *</label>
        <textarea
          name="message"
          required
          rows={5}
          className={`${inputCls} resize-none`}
          placeholder="Ukratko opiši situaciju i što tražiš..."
        />
      </div>
      {status === 'error' && (
        <p className="text-red-400 text-sm">Greška pri slanju. Pokušaj ponovo ili piši na brane@fincoach.vip.</p>
      )}
      <button
        type="submit"
        disabled={status === 'sending'}
        className="w-full bg-[#D4AF37] text-[#0D1B2A] font-black py-4 rounded-xl hover:bg-yellow-400 transition text-lg disabled:opacity-60"
      >
        {status === 'sending' ? 'Šalje se...' : 'Pošalji poruku →'}
      </button>
    </form>
  )
}
