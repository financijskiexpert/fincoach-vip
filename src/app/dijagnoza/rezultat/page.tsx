'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

type Tip = 'hedonist' | 'branic' | 'vrtlog' | 'teoreticar'

const TIPOVI: Record<Tip, {
  emoji: string
  naziv: string
  podnaslov: string
  opis: string
  navike: string[]
  program_poruka: string
}> = {
  hedonist: {
    emoji: '🔥',
    naziv: 'Hedonist',
    podnaslov: 'Živiš za danas — i u tome je problem',
    opis: 'Tvoj odnos s novcem je emocionalan. Novac ti donosi zadovoljstvo odmah — i to je razumljivo. Problem je što taj trenutni osjećaj "zasluženosti" uvijek pobijedi dugoročni plan. Nisi lijen/na niti neodgovoran/na. Samo nisi naučio/la sustav koji radi BEZ volje.',
    navike: [
      'Impulsivne kupnje koje se čine male, ali se gomilaju',
      'Osjećaj da zaslužuješ nagradu nakon naporno radnog tjedna',
      'Krajem mjeseca pitaš se gdje je nestalo sve',
    ],
    program_poruka: 'Program za tvoj tip automatizira štednju — bez odricanja i bez krivnje. Sustav radi umjesto tebe.',
  },
  branic: {
    emoji: '🛡️',
    naziv: 'Branič',
    podnaslov: 'Čuvaš novac — ali i sebe od života',
    opis: 'Ti imaš novac. Problem je što te on drži u konstantnoj anksioznosti. Bojiš se potrošiti čak i kad si možeš priuštiti. Novac je za tebe sigurnost — ali ta sigurnost je postala kavez. Trebaš naučiti da novac ima smisao samo kad ga koristiš strateški.',
    navike: [
      'Račun raste, ali se ne osjećaš financijski sigurno',
      'Odgađaš kupnje čak i kad su neophodne',
      'Strah od gubitka jači je od radosti dobitka',
    ],
    program_poruka: 'Program za tvoj tip definira KADA je pametno potrošiti i KOLIKO — tako da više ne moraš pogađati.',
  },
  vrtlog: {
    emoji: '🌀',
    naziv: 'Vrtlog',
    podnaslov: 'Imaš sve planove — samo nikad ne počneš',
    opis: 'Tvoj problem nije motivacija niti znanje — to imaš u izobilju. Tvoj problem je momentum. Počinješ, staješ, počinješ, staješ. Svaki novi plan se čini kao "pravi ovaj put" — ali uvijek nešto ubaci. Trebaš ne novi plan, nego sustav koji se odvija sam.',
    navike: [
      '"Od prvog u mjesecu" je tvoja mantra — koja nikad ne dođe',
      'Imaš spreadsheetove koje nisi otvorio/la tjednima',
      'Samo vanjski okidači (kriza, bonus) te pokrenu',
    ],
    program_poruka: 'Program za tvoj tip daje 30 dana korak-po-korak — toliko malih koraka da ih je nemoguće ne napraviti.',
  },
  teoreticar: {
    emoji: '📚',
    naziv: 'Teoretičar',
    podnaslov: 'Znaš sve — samo ne radiš ništa',
    opis: 'Pročitao/la si knjige. Pratio/la si podcaste. Znaš što je indeksni fond, emergency fund i compound interest. Ali tvoj financijski račun izgleda isto kao prije 2 godine. Znanje bez akcije nije znanje — to je samo informacija. Trebaš nekoga tko te prisili da POČNEŠ.',
    navike: [
      'Još jedna knjiga, još jedan podcast — uvijek ima više za naučiti',
      'Analiziraš opcije dok prozor prilike ne prođe',
      'Savjetima pomažeš drugima, a sam/a ne primjenjuješ',
    ],
    program_poruka: 'Program za tvoj tip je 30 dana akcije — ne teorije. Svaki dan jedna konkretna stvar. Bez čitanja, bez odgađanja.',
  },
}

const STORAGE_KEY = 'fc_quiz_deadline'
const TWO_HOURS_MS = 2 * 60 * 60 * 1000

function getDeadline(): number {
  if (typeof window === 'undefined') return Date.now() + TWO_HOURS_MS
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored) {
    const ts = parseInt(stored, 10)
    if (!isNaN(ts) && ts > Date.now()) return ts
  }
  const deadline = Date.now() + TWO_HOURS_MS
  localStorage.setItem(STORAGE_KEY, String(deadline))
  return deadline
}

function pad(n: number) { return String(n).padStart(2, '0') }

function isValidTip(s: string | null): s is Tip {
  return s === 'hedonist' || s === 'branic' || s === 'vrtlog' || s === 'teoreticar'
}

function RezultatContent() {
  const params = useSearchParams()
  const tipParam = params.get('tip')
  const tip: Tip = isValidTip(tipParam) ? tipParam : 'vrtlog'
  const data = TIPOVI[tip]

  const [deadline] = useState<number>(() => (typeof window !== 'undefined' ? getDeadline() : Date.now() + TWO_HOURS_MS))
  const [remaining, setRemaining] = useState<number>(() => Math.max(0, deadline - Date.now()))
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const interval = setInterval(() => {
      setRemaining(Math.max(0, deadline - Date.now()))
    }, 1000)
    return () => clearInterval(interval)
  }, [deadline])

  const expired = remaining === 0
  const h = Math.floor(remaining / 3_600_000)
  const m = Math.floor((remaining % 3_600_000) / 60_000)
  const s = Math.floor((remaining % 60_000) / 1_000)

  async function handleKupi() {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/checkout/starter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ financial_type: tip }),
      })
      const json = await res.json()
      if (json.url) {
        window.location.href = json.url
        return
      }
      throw new Error(json.error ?? 'Greška')
    } catch {
      setError('Greška pri plaćanju — pokušaj ponovo.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0D1B2A' }}>
      <nav
        className="fixed top-0 left-0 right-0 z-50"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', backgroundColor: 'rgba(13,27,42,0.95)', backdropFilter: 'blur(8px)' }}
      >
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center">
          <Link href="/">
            <Image src="/logo/fincoach-logo-horizontal.svg" alt="FinCoach VIP" width={120} height={38} priority />
          </Link>
        </div>
      </nav>

      <div className="px-4 pb-24" style={{ paddingTop: 80 }}>
        <div className="max-w-xl mx-auto">

          {/* Result hero */}
          <div className="text-center mb-8">
            <div style={{ fontSize: '3.5rem', marginBottom: 12 }}>{data.emoji}</div>
            <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: 'rgba(212,175,55,0.65)' }}>
              Tvoj financijski tip je
            </p>
            <h1 className="text-4xl font-black mb-3" style={{ color: '#D4AF37' }}>
              {data.naziv}
            </h1>
            <p className="text-lg" style={{ color: 'rgba(255,255,255,0.65)' }}>
              {data.podnaslov}
            </p>
          </div>

          {/* Type description */}
          <div
            className="rounded-2xl p-6 mb-6"
            style={{ backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}
          >
            <p className="leading-relaxed mb-5" style={{ color: 'rgba(255,255,255,0.72)', fontSize: '0.95rem' }}>
              {data.opis}
            </p>
            <p className="text-sm font-semibold mb-3" style={{ color: '#D4AF37' }}>
              Prepoznaješ li se u ovome?
            </p>
            <ul className="space-y-2">
              {data.navike.map((n, i) => (
                <li key={i} className="flex items-start gap-3 text-sm" style={{ color: 'rgba(255,255,255,0.58)' }}>
                  <span style={{ color: '#D4AF37', flexShrink: 0, marginTop: 2 }}>✓</span>
                  {n}
                </li>
              ))}
            </ul>
          </div>

          {/* Offer box */}
          {!expired ? (
            <div
              className="rounded-2xl overflow-hidden mb-5"
              style={{
                background: 'linear-gradient(135deg, rgba(212,175,55,0.14) 0%, rgba(212,175,55,0.05) 100%)',
                border: '1px solid rgba(212,175,55,0.4)',
              }}
            >
              {/* Countdown header */}
              <div
                className="px-6 py-4 flex items-center justify-between flex-wrap gap-3"
                style={{ borderBottom: '1px solid rgba(212,175,55,0.2)', backgroundColor: 'rgba(212,175,55,0.07)' }}
              >
                <span className="text-xs font-bold uppercase tracking-widest" style={{ color: '#D4AF37' }}>
                  ⏱ Posebna ponuda — vrijedi još
                </span>
                <div className="flex items-center gap-1.5">
                  {[
                    { v: pad(h), l: 'h' },
                    { v: pad(m), l: 'min' },
                    { v: pad(s), l: 'sek' },
                  ].map(({ v, l }, i) => (
                    <span key={i} className="flex items-center gap-1">
                      <span
                        className="font-black text-lg rounded-lg px-2 py-1"
                        style={{ backgroundColor: 'rgba(0,0,0,0.35)', color: '#D4AF37', fontVariantNumeric: 'tabular-nums', minWidth: 38, textAlign: 'center' }}
                      >
                        {v}
                      </span>
                      <span className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>{l}</span>
                      {i < 2 && <span style={{ color: 'rgba(212,175,55,0.4)' }}>:</span>}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-6">
                <h2 className="text-2xl font-black mb-2" style={{ color: '#fff' }}>
                  Financijski Starter Paket
                </h2>
                <p className="text-sm leading-relaxed mb-5" style={{ color: 'rgba(255,255,255,0.6)' }}>
                  {data.program_poruka}
                </p>

                <ul className="space-y-2.5 mb-6">
                  {[
                    { icon: '📊', text: 'Financijski Health Score (0-100) — vidiš točno gdje stojite' },
                    { icon: '🧠', text: 'Personalizirani profil tvog tipa + konkretni nasvjeti' },
                    { icon: '📅', text: '30-dnevni plan prilagođen točno tvom tipu' },
                    { icon: '🎬', text: '4 ekskluzivna videa s Branetom (1 svaki tjedan)' },
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm" style={{ color: 'rgba(255,255,255,0.78)' }}>
                      <span style={{ fontSize: '1.1rem', lineHeight: 1, marginTop: 1 }}>{item.icon}</span>
                      {item.text}
                    </li>
                  ))}
                </ul>

                <div className="flex items-baseline gap-3 mb-5">
                  <span className="text-4xl font-black" style={{ color: '#D4AF37' }}>19€</span>
                  <span className="text-base line-through" style={{ color: 'rgba(255,255,255,0.3)' }}>47€</span>
                  <span className="text-sm" style={{ color: 'rgba(255,255,255,0.35)' }}>jednokratno</span>
                </div>

                <button
                  onClick={handleKupi}
                  disabled={loading}
                  className="w-full rounded-xl py-4 font-black text-lg transition-opacity hover:opacity-90 disabled:opacity-60"
                  style={{ backgroundColor: '#D4AF37', color: '#0D1B2A', fontSize: '1rem' }}
                >
                  {loading ? 'Preusmjeravam na plaćanje...' : 'Pokreni svoju transformaciju — 19€ →'}
                </button>

                {error && (
                  <p className="mt-3 text-sm text-center" style={{ color: '#f87171' }}>{error}</p>
                )}

                <div className="flex items-center justify-center gap-4 mt-4 flex-wrap">
                  <span className="text-xs" style={{ color: 'rgba(255,255,255,0.25)' }}>🔒 Sigurno plaćanje — Stripe</span>
                  <span className="text-xs" style={{ color: 'rgba(255,255,255,0.15)' }}>·</span>
                  <span className="text-xs" style={{ color: 'rgba(255,255,255,0.25)' }}>30-dnevno jamstvo povrata</span>
                </div>
              </div>
            </div>
          ) : (
            <div
              className="rounded-2xl p-6 mb-5 text-center"
              style={{ backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
            >
              <p className="mb-3" style={{ color: 'rgba(255,255,255,0.5)' }}>Posebna ponuda je istekla.</p>
              <Link href="/volim-svojnovac" className="text-sm font-semibold" style={{ color: '#D4AF37' }}>
                Pogledaj dostupne programe →
              </Link>
            </div>
          )}

          {/* Skip */}
          <p className="text-center text-sm" style={{ color: 'rgba(255,255,255,0.22)' }}>
            Nisam spreman/na sada —{' '}
            <Link href="/besplatna-edukacija" className="underline hover:opacity-70 transition-opacity">
              nastavi s besplatnom edukacijom
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default function RezultatPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#0D1B2A' }}>
          <div className="text-center">
            <div style={{ fontSize: '3rem', marginBottom: 16 }}>🔄</div>
            <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.9rem' }}>Analiziramo tvoje odgovore...</p>
          </div>
        </div>
      }
    >
      <RezultatContent />
    </Suspense>
  )
}
