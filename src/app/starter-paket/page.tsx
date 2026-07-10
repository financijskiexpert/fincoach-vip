'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

const STORAGE_KEY = 'fc_sp_deadline'
const FIFTEEN_MIN_MS = 15 * 60 * 1000

function getDeadline(): number {
  if (typeof window === 'undefined') return Date.now() + FIFTEEN_MIN_MS
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored) {
    const ts = parseInt(stored, 10)
    if (!isNaN(ts) && ts > Date.now()) return ts
  }
  const deadline = Date.now() + FIFTEEN_MIN_MS
  localStorage.setItem(STORAGE_KEY, String(deadline))
  return deadline
}

function pad(n: number) { return String(n).padStart(2, '0') }

function StarterPaketContent() {
  const params = useSearchParams()
  const tip = params.get('tip') ?? ''

  const [deadline] = useState<number>(() =>
    typeof window !== 'undefined' ? getDeadline() : Date.now() + FIFTEEN_MIN_MS
  )
  const [remaining, setRemaining] = useState<number>(() => Math.max(0, deadline - Date.now()))
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const iv = setInterval(() => setRemaining(Math.max(0, deadline - Date.now())), 1000)
    return () => clearInterval(iv)
  }, [deadline])

  const expired = remaining === 0
  const m = Math.floor(remaining / 60_000)
  const s = Math.floor((remaining % 60_000) / 1_000)

  const price = expired ? 49 : 19
  const oldPrice = expired ? null : 49

  async function handleKupi() {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/checkout/starter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ financial_type: tip || undefined }),
      })
      const json = await res.json()
      if (json.url) { window.location.href = json.url; return }
      throw new Error(json.error ?? 'Greška')
    } catch {
      setError('Greška pri plaćanju — pokušaj ponovo.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0D1B2A', color: '#fff' }}>
      {/* Nav */}
      <nav
        className="fixed top-0 left-0 right-0 z-50"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', backgroundColor: 'rgba(13,27,42,0.97)', backdropFilter: 'blur(8px)' }}
      >
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/">
            <Image src="/logo/fincoach-logo-horizontal.svg" alt="FinCoach VIP" width={120} height={38} priority />
          </Link>
          {!expired && (
            <div className="flex items-center gap-2 text-sm">
              <span style={{ color: 'rgba(255,255,255,0.5)' }}>Posebna cijena istječe za:</span>
              <span
                className="font-black tabular-nums px-2 py-1 rounded-lg"
                style={{ backgroundColor: 'rgba(212,175,55,0.15)', color: '#D4AF37', minWidth: 56, textAlign: 'center' }}
              >
                {pad(m)}:{pad(s)}
              </span>
            </div>
          )}
        </div>
      </nav>

      <div className="px-4 pb-24" style={{ paddingTop: 72 }}>
        <div className="max-w-xl mx-auto">

          {/* HERO */}
          <div className="text-center pt-10 pb-8">
            <div
              className="inline-block text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-6"
              style={{ backgroundColor: 'rgba(212,175,55,0.12)', color: '#D4AF37', border: '1px solid rgba(212,175,55,0.3)' }}
            >
              Samo za nove pretplatnike vodiča
            </div>
            <h1 className="text-3xl sm:text-4xl font-black leading-tight mb-4">
              Znaš da nešto ne valja s tvojim novcem.<br />
              <span style={{ color: '#D4AF37' }}>Za 30 dana — imat ćeš sustav koji to mijenja.</span>
            </h1>
            <p className="text-lg" style={{ color: 'rgba(255,255,255,0.6)' }}>
              Ne još jedna teorija. Ne još jedan podcast. <strong style={{ color: '#fff' }}>Konkretan plan, prilagođen točno tebi.</strong>
            </p>
          </div>

          {/* PROBLEM */}
          <div
            className="rounded-2xl p-6 mb-6"
            style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            <p className="text-sm font-bold uppercase tracking-widest mb-4" style={{ color: 'rgba(255,255,255,0.35)' }}>
              Prepoznaješ li se?
            </p>
            {[
              'Zarađuješ pristojno — ali krajem mjeseca nema ništa.',
              'Svaki tjedan kažeš "od sljedećeg počnem štedjeti". Taj tjedan ne dolazi.',
              'Imaš dugove koji se ne miču, hitni fond koji ne postoji i investicije koje su samo plan.',
              'Znaš što trebaš raditi — samo ne znaš odakle početi.',
            ].map((t, i) => (
              <div key={i} className="flex items-start gap-3 mb-3 last:mb-0">
                <span style={{ color: '#ef4444', flexShrink: 0, marginTop: 2 }}>✗</span>
                <span style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.95rem' }}>{t}</span>
              </div>
            ))}
          </div>

          {/* SOLUTION */}
          <div className="mb-2 text-center">
            <p className="text-sm font-bold uppercase tracking-widest mb-2" style={{ color: '#D4AF37' }}>
              Evo što mijenja sve
            </p>
            <h2 className="text-2xl font-black mb-1">Financijski Starter Paket</h2>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem' }}>
              Personalizirani financijski sustav u 30 dana — korak po korak.
            </p>
          </div>

          {/* WHAT YOU GET */}
          <div
            className="rounded-2xl p-6 mb-6"
            style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            <p className="text-sm font-bold mb-4" style={{ color: '#D4AF37' }}>Što dobivaš:</p>
            {[
              {
                icon: '📊',
                title: 'Financijski Health Score (0–100)',
                desc: 'Jedna jedina ocjena koja ti pokazuje gdje točno stojite — i što odmah popraviti.',
              },
              {
                icon: '🧠',
                title: 'Personalizirani profil tvojeg financijskog tipa',
                desc: 'Zašto se ponašaš kako se ponašaš s novcem — i koji su tvoji konkretni blokatori.',
              },
              {
                icon: '📅',
                title: '30-dnevni akcijski plan prilagođen tebi',
                desc: 'Svaki dan jedna konkretna stvar. Bez teorije, bez odgađanja — samo akcija.',
              },
              {
                icon: '🎬',
                title: '4 ekskluzivna videa s Branetom',
                desc: 'Jeden video tjedno. Dubinski uvidi koje ne možeš naći nigdje drugdje.',
              },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-4 mb-5 last:mb-0">
                <div
                  className="rounded-xl flex items-center justify-center shrink-0"
                  style={{ width: 44, height: 44, backgroundColor: 'rgba(212,175,55,0.1)', fontSize: '1.3rem' }}
                >
                  {item.icon}
                </div>
                <div>
                  <p className="font-bold mb-0.5" style={{ fontSize: '0.95rem' }}>{item.title}</p>
                  <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', lineHeight: 1.5 }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* SOCIAL PROOF */}
          <div className="mb-6 space-y-3">
            {[
              { quote: '"Health Score mi je pokazao gdje točno \'curi\' novac — a da toga nisam bila svjesna. Za 3 tjedna eliminirala sam 2.400 € duga."', name: 'Petra L., Zagreb' },
              { quote: '"30-dnevni plan mi je dao strukturu kakvu nisam imala nikad. Konačno znam kamo ide svaki euro."', name: 'Ana M., Rijeka' },
            ].map((t, i) => (
              <div
                key={i}
                className="rounded-xl p-5"
                style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
              >
                <p className="italic mb-2" style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.9rem', lineHeight: 1.6 }}>{t.quote}</p>
                <p style={{ color: '#D4AF37', fontSize: '0.8rem', fontWeight: 700 }}>— {t.name} ⭐⭐⭐⭐⭐</p>
              </div>
            ))}
          </div>

          {/* OFFER BOX */}
          <div
            className="rounded-2xl overflow-hidden mb-5"
            style={{
              background: 'linear-gradient(135deg, rgba(212,175,55,0.13) 0%, rgba(212,175,55,0.04) 100%)',
              border: `1px solid ${expired ? 'rgba(255,255,255,0.1)' : 'rgba(212,175,55,0.4)'}`,
            }}
          >
            {/* Countdown / expired header */}
            {!expired ? (
              <div
                className="px-6 py-4 flex items-center justify-between flex-wrap gap-3"
                style={{ borderBottom: '1px solid rgba(212,175,55,0.2)', backgroundColor: 'rgba(212,175,55,0.07)' }}
              >
                <span className="text-xs font-bold uppercase tracking-widest" style={{ color: '#D4AF37' }}>
                  ⏱ Posebna cijena — istječe za
                </span>
                <div className="flex items-center gap-1.5">
                  <span
                    className="font-black text-xl rounded-lg px-3 py-1 tabular-nums"
                    style={{ backgroundColor: 'rgba(0,0,0,0.35)', color: '#D4AF37', minWidth: 48, textAlign: 'center' }}
                  >
                    {pad(m)}:{pad(s)}
                  </span>
                </div>
              </div>
            ) : (
              <div
                className="px-6 py-3 text-center text-sm"
                style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', backgroundColor: 'rgba(255,255,255,0.03)', color: 'rgba(255,255,255,0.45)' }}
              >
                Posebna ponuda je istekla — standardna cijena
              </div>
            )}

            <div className="p-6">
              <div className="flex items-baseline gap-3 mb-5">
                <span className="text-5xl font-black" style={{ color: '#D4AF37' }}>{price}€</span>
                {oldPrice && (
                  <span className="text-xl line-through" style={{ color: 'rgba(255,255,255,0.25)' }}>{oldPrice}€</span>
                )}
                <span className="text-sm" style={{ color: 'rgba(255,255,255,0.35)' }}>jednokratno</span>
              </div>

              <button
                onClick={handleKupi}
                disabled={loading}
                className="w-full rounded-xl py-4 font-black text-lg transition-opacity hover:opacity-90 disabled:opacity-60 mb-4"
                style={{ backgroundColor: '#D4AF37', color: '#0D1B2A' }}
              >
                {loading ? 'Preusmjeravam na plaćanje...' : `Pokreni svoju transformaciju — ${price}€ →`}
              </button>

              {error && <p className="mb-3 text-sm text-center" style={{ color: '#f87171' }}>{error}</p>}

              <div className="flex items-center justify-center gap-4 flex-wrap">
                <span className="text-xs" style={{ color: 'rgba(255,255,255,0.25)' }}>🔒 Sigurno plaćanje — Stripe</span>
                <span className="text-xs" style={{ color: 'rgba(255,255,255,0.12)' }}>·</span>
                <span className="text-xs" style={{ color: 'rgba(255,255,255,0.25)' }}>30-dnevna garancija povrata</span>
              </div>
            </div>
          </div>

          {/* WHO IS THIS FOR */}
          <div
            className="rounded-2xl p-6 mb-6"
            style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            <p className="text-sm font-bold mb-4" style={{ color: '#D4AF37' }}>Starter Paket je za tebe ako:</p>
            {[
              'Znaš da nešto ne valja — ali ne znaš točno što.',
              'Imaš prihode, ali novac uvijek nekamo "nestane".',
              'Volio/la bi početi štedjeti i investirati, ali ne znaš odakle.',
              'Trebaš ne motivaciju, nego konkretan plan prilagođen tebi.',
            ].map((t, i) => (
              <div key={i} className="flex items-start gap-3 mb-2 last:mb-0">
                <span style={{ color: '#D4AF37', flexShrink: 0 }}>✓</span>
                <span style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.9rem' }}>{t}</span>
              </div>
            ))}
          </div>

          {/* FAQ */}
          <div className="mb-8 space-y-3">
            {[
              {
                q: 'Koliko vremena trebam?',
                a: '30 minuta tjedno — to je sve. Plan je dizajniran za zaposlene ljude s punim rasporedima.',
              },
              {
                q: 'Što ako ne vidim rezultate?',
                a: '30-dnevna garancija povrata. Ako u prvih 30 dana ne vidiš vrijednost — vraćam ti novac bez pitanja.',
              },
              {
                q: 'Trebam li financijsko znanje?',
                a: 'Nula. Program počinje od dijagnoze — i gradi plan na temelju točno tvoje situacije.',
              },
            ].map((item, i) => (
              <div
                key={i}
                className="rounded-xl p-4"
                style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
              >
                <p className="font-bold mb-1" style={{ fontSize: '0.9rem' }}>❓ {item.q}</p>
                <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.85rem', lineHeight: 1.55 }}>{item.a}</p>
              </div>
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="text-center">
            <button
              onClick={handleKupi}
              disabled={loading}
              className="w-full rounded-xl py-4 font-black text-lg transition-opacity hover:opacity-90 disabled:opacity-60 mb-3"
              style={{ backgroundColor: '#D4AF37', color: '#0D1B2A' }}
            >
              {loading ? 'Preusmjeravam...' : `Da, želim Starter Paket — ${price}€ →`}
            </button>
            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.2)' }}>
              Ili{' '}
              <Link href="/dijagnoza" className="underline hover:opacity-70 transition-opacity">
                napravi besplatnu dijagnozu svog financijskog tipa
              </Link>
            </p>
          </div>

        </div>
      </div>
    </div>
  )
}

export default function StarterPaketPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#0D1B2A' }}>
          <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.9rem' }}>Učitavam...</div>
        </div>
      }
    >
      <StarterPaketContent />
    </Suspense>
  )
}
