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
    if (!isNaN(ts)) return ts  // expired stays expired — never reset
  }
  const deadline = Date.now() + FIFTEEN_MIN_MS
  localStorage.setItem(STORAGE_KEY, String(deadline))
  return deadline
}

function pad(n: number) { return String(n).padStart(2, '0') }

// SVG portal mockup — health score gauge
function PortalMockup() {
  return (
    <div className="flex justify-center my-2">
      <div
        className="relative rounded-3xl overflow-hidden shadow-2xl"
        style={{
          width: 280,
          background: 'linear-gradient(145deg, #0a1929 0%, #0d1b2a 100%)',
          border: '1px solid rgba(212,175,55,0.25)',
          padding: '20px 18px 18px',
        }}
      >
        {/* Status bar mockup */}
        <div className="flex justify-between items-center mb-4 px-1">
          <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 10 }}>9:41</span>
          <div className="flex gap-1">
            {[...Array(4)].map((_, i) => (
              <div key={i} style={{ width: 4, height: 6 + i * 2, backgroundColor: 'rgba(255,255,255,0.3)', borderRadius: 1 }} />
            ))}
          </div>
        </div>

        {/* App header */}
        <div className="flex items-center gap-2 mb-5">
          <div style={{ width: 28, height: 28, borderRadius: '50%', backgroundColor: 'rgba(212,175,55,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: 14 }}>⚡</span>
          </div>
          <div>
            <p style={{ color: '#fff', fontSize: 11, fontWeight: 700, lineHeight: 1 }}>Starter Paket</p>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 9 }}>Tvoja financijska dijagnoza</p>
          </div>
        </div>

        {/* Health Score gauge */}
        <div className="text-center mb-4">
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 9, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Financijski Health Score</p>
          <svg width="140" height="80" viewBox="0 0 140 80" style={{ margin: '0 auto', display: 'block' }}>
            {/* Background arc */}
            <path d="M 14 74 A 56 56 0 0 1 126 74" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="10" strokeLinecap="round" />
            {/* Score arc — 68/100 = 68% */}
            <path d="M 14 74 A 56 56 0 0 1 126 74" fill="none" stroke="url(#scoreGrad)" strokeWidth="10" strokeLinecap="round"
              strokeDasharray="176" strokeDashoffset="56" />
            <defs>
              <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#ef4444" />
                <stop offset="50%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#22c55e" />
              </linearGradient>
            </defs>
            <text x="70" y="66" textAnchor="middle" fill="#D4AF37" fontSize="26" fontWeight="900">68</text>
            <text x="70" y="78" textAnchor="middle" fill="rgba(255,255,255,0.35)" fontSize="8">/100</text>
          </svg>
        </div>

        {/* Type badge */}
        <div
          className="text-center rounded-xl py-2 mb-3"
          style={{ backgroundColor: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.2)' }}
        >
          <p style={{ color: '#D4AF37', fontSize: 10, fontWeight: 700 }}>🧠 Tvoj tip: Branič</p>
          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 9, marginTop: 2 }}>Skloniš novac, ali se bojiš investirati</p>
        </div>

        {/* Progress bar */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 9 }}>30-dnevni plan</span>
            <span style={{ color: '#D4AF37', fontSize: 9, fontWeight: 700 }}>Dan 7/30</span>
          </div>
          <div style={{ height: 4, backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 2 }}>
            <div style={{ height: '100%', width: '23%', backgroundColor: '#D4AF37', borderRadius: 2 }} />
          </div>
        </div>
      </div>
    </div>
  )
}

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

  const price = expired ? 79 : 19
  const oldPrice = expired ? null : 79

  async function handleKupi() {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/checkout/starter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ financial_type: tip || undefined, expired }),
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
              ⏱ Početna cijena — 19€ umjesto 79€
            </div>
            <h1 className="text-3xl sm:text-4xl font-black leading-tight mb-4">
              Znaš da nešto ne valja s tvojim novcem.<br />
              <span style={{ color: '#D4AF37' }}>Za 30 dana — imat ćeš sustav koji to mijenja.</span>
            </h1>
            <p className="text-lg" style={{ color: 'rgba(255,255,255,0.6)' }}>
              Ne još jedna teorija. Ne još jedan podcast. <strong style={{ color: '#fff' }}>Konkretan plan, prilagođen točno tebi.</strong>
            </p>
          </div>

          {/* LANDING VIDEO */}
          <div className="rounded-2xl overflow-hidden mb-8" style={{ border: '1px solid rgba(212,175,55,0.2)' }}>
            <video
              controls
              playsInline
              preload="metadata"
              className="w-full block"
              src="/videos/starter_landing.mp4"
            />
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
                desc: 'Jedan video tjedno. Dubinski uvidi koje ne možeš naći nigdje drugdje.',
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

          {/* PORTAL MOCKUP */}
          <div className="mb-2 text-center">
            <p className="text-sm font-bold uppercase tracking-widest mb-1" style={{ color: 'rgba(255,255,255,0.3)' }}>
              Kako izgleda tvoj portal
            </p>
          </div>
          <PortalMockup />
          <p className="text-center text-xs mb-8 mt-3" style={{ color: 'rgba(255,255,255,0.25)' }}>
            Tvoja osobna nadzorna ploča — dostupna odmah nakon kupnje
          </p>

          {/* BRANE CREDENTIALS */}
          <div
            className="rounded-2xl p-5 mb-6 flex items-center gap-4"
            style={{ backgroundColor: 'rgba(212,175,55,0.04)', border: '1px solid rgba(212,175,55,0.15)' }}
          >
            <Image
              src="/images/brane-portrait.jpg"
              alt="Brane Recek"
              width={64}
              height={64}
              className="rounded-full object-cover shrink-0"
              style={{ border: '2px solid rgba(212,175,55,0.35)' }}
            />
            <div>
              <p className="font-black mb-0.5" style={{ fontSize: '0.95rem', color: '#D4AF37' }}>Brane Recek</p>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem', marginBottom: 6 }}>Financijski coach · FinCoach VIP</p>
              <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.82rem', lineHeight: 1.55 }}>
                Pomogao sam stotinama ljudi iz Hrvatske i Slovenije da prestanu "živjeti od plaće do plaće" — bez smanjivanja životnog standarda.
              </p>
            </div>
          </div>

          {/* ZA KOGA JE / ZA KOGA NIJE */}
          <div className="mb-6">
            <p className="text-center text-sm font-bold uppercase tracking-widest mb-4" style={{ color: 'rgba(255,255,255,0.35)' }}>
              Je li Starter Paket za tebe?
            </p>
            <div className="grid grid-cols-2 gap-3">
              {/* JE */}
              <div
                className="rounded-2xl p-4"
                style={{ backgroundColor: 'rgba(34,197,94,0.05)', border: '1px solid rgba(34,197,94,0.2)' }}
              >
                <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#22c55e' }}>✓ Za tebe je</p>
                {[
                  'Ne znaš kamo ti odlazi novac',
                  'Zarađuješ, ali ne štediš',
                  'Trebaš plan, ne motivaciju',
                  'Spreman/a 15 min dnevno',
                  'Počinješ od nule',
                ].map((t, i) => (
                  <div key={i} className="flex items-start gap-2 mb-2 last:mb-0">
                    <span style={{ color: '#22c55e', fontSize: 12, flexShrink: 0, marginTop: 1 }}>✓</span>
                    <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem', lineHeight: 1.45 }}>{t}</span>
                  </div>
                ))}
              </div>
              {/* NIJE */}
              <div
                className="rounded-2xl p-4"
                style={{ backgroundColor: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.2)' }}
              >
                <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#ef4444' }}>✗ Nije za tebe</p>
                {[
                  'Tražiš brzo bogaćenje',
                  'Nisi spreman/a na promjenu',
                  'Već imaš fin. sustav',
                  'Tražiš investicijski savjet',
                  'Ne možeš odvojiti 15 min/dan',
                ].map((t, i) => (
                  <div key={i} className="flex items-start gap-2 mb-2 last:mb-0">
                    <span style={{ color: '#ef4444', fontSize: 12, flexShrink: 0, marginTop: 1 }}>✗</span>
                    <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem', lineHeight: 1.45 }}>{t}</span>
                  </div>
                ))}
              </div>
            </div>
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
                <span className="text-xs" style={{ color: 'rgba(255,255,255,0.25)' }}>7-dnevna garancija povrata</span>
              </div>
            </div>
          </div>

          {/* FAQ */}
          <div className="mb-8 space-y-3">
            {[
              {
                q: 'Koliko vremena trebam?',
                a: '15 minuta dnevno — to je sve. Plan je dizajniran za zaposlene ljude s punim rasporedima.',
              },
              {
                q: 'Što ako ne vidim rezultate?',
                a: '7-dnevna garancija povrata. Ako u prvih 7 dana ne vidiš vrijednost — vraćam ti 19€ bez pitanja. Bez formulara, bez čekanja.',
              },
              {
                q: 'Trebam li financijsko znanje?',
                a: 'Nula. Program počinje od dijagnoze — i gradi plan na temelju točno tvoje situacije.',
              },
              {
                q: 'Kad dobijem pristup?',
                a: 'Odmah. Nakon plaćanja dobivaš email s pristupnim podacima i možeš početi za 5 minuta.',
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
