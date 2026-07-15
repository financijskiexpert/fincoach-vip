'use client'

import { useState, useMemo } from 'react'

const teme = [
  { value: 'osiguranje-karijera', label: 'Karijera u osiguranju / suradnja' },
  { value: 'mentorstvo', label: 'Mentorstvo za zastopnike' },
  { value: 'financijsko-savjetovanje', label: 'Financijsko savjetovanje' },
  { value: 'fincoach-vip', label: 'FinCoach VIP program' },
  { value: 'ostalo', label: 'Ostalo' },
]

type Status = 'idle' | 'sending' | 'ok' | 'error'

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export default function KontaktForm() {
  const [status, setStatus] = useState<Status>('idle')
  const [captchaInput, setCaptchaInput] = useState('')
  const [captchaError, setCaptchaError] = useState(false)

  const captcha = useMemo(() => {
    const a = randomInt(2, 9)
    const b = randomInt(2, 9)
    return { a, b, answer: a + b }
  }, [])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setCaptchaError(false)

    if (parseInt(captchaInput, 10) !== captcha.answer) {
      setCaptchaError(true)
      return
    }

    setStatus('sending')
    const form = e.currentTarget
    const data = new FormData(form)

    // Honeypot: ako je popunjeno, to je bot
    if (data.get('website')) {
      setStatus('ok')
      return
    }

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
      {/* Honeypot — nevidljivo za ljude, boti ga popunjavaju */}
      <input name="website" type="text" tabIndex={-1} aria-hidden="true" className="hidden" autoComplete="off" />

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

      {/* Math captcha */}
      <div>
        <label className="block text-sm text-white/60 mb-1">
          Provjera: koliko je {captcha.a} + {captcha.b}? *
        </label>
        <input
          type="number"
          required
          value={captchaInput}
          onChange={e => { setCaptchaInput(e.target.value); setCaptchaError(false) }}
          className={`${inputCls} ${captchaError ? 'border-red-400' : ''}`}
          placeholder="Upiši broj..."
          autoComplete="off"
        />
        {captchaError && (
          <p className="text-red-400 text-xs mt-1">Netočan odgovor. Pokušaj ponovo.</p>
        )}
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
