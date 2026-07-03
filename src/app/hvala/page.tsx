'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { CheckCircle, Mail, Clock, ShieldCheck, Star, ArrowRight, Sparkles, Loader2 } from 'lucide-react'
import SiteFooter from '@/components/SiteFooter'

function pad(n: number) { return String(n).padStart(2, '0') }

function getCountdownEnd(): number {
  if (typeof window === 'undefined') return Date.now() + 15 * 60 * 1000
  const stored = localStorage.getItem('starter_countdown_end')
  if (stored && parseInt(stored) > Date.now()) return parseInt(stored)
  const end = Date.now() + 15 * 60 * 1000
  localStorage.setItem('starter_countdown_end', end.toString())
  return end
}

function HvalaContent() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const isLead = searchParams.get('lead') === '1'
  const isStarterSuccess = searchParams.get('starter') === '1'

  const [timeLeft, setTimeLeft] = useState({ min: 15, sec: 0 })
  const [expired, setExpired] = useState(false)
  const [checkoutLoading, setCheckoutLoading] = useState(false)

  useEffect(() => {
    if (!isLead) return
    const end = getCountdownEnd()
    const tick = () => {
      const diff = end - Date.now()
      if (diff <= 0) { setExpired(true); setTimeLeft({ min: 0, sec: 0 }); return }
      setTimeLeft({ min: Math.floor(diff / 60000), sec: Math.floor((diff % 60000) / 1000) })
    }
    tick()
    const timer = setInterval(tick, 1000)
    return () => clearInterval(timer)
  }, [isLead])

  async function handleBuyStarter() {
    setCheckoutLoading(true)
    try {
      const res = await fetch('/api/checkout/starter', { method: 'POST' })
      const data = await res.json()
      if (data.url) { window.location.href = data.url; return }
      throw new Error(data.error ?? 'Nepoznata greška')
    } catch {
      alert('Greška pri plaćanju. Pokušaj ponovo.')
      setCheckoutLoading(false)
    }
  }

  // Course purchase success
  if (sessionId && !isLead && !isStarterSuccess) {
    return (
      <main className="flex-1 pt-24 pb-20 px-4 flex items-center justify-center">
        <div className="max-w-lg w-full text-center">
          <div className="w-20 h-20 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center mx-auto mb-8">
            <CheckCircle className="w-10 h-10 text-green-400" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white mb-4">
            Dobrodošao/la u <span className="text-gold">FinCoach VIP!</span>
          </h1>
          <p className="text-white/60 mb-2">Uplata je uspješno primljena.</p>
          <p className="text-white/40 text-sm mb-8">
            Provjeri email — šaljemo ti pristupne podatke za tečaj u roku od nekoliko minuta.
          </p>
          <div className="bg-navy border border-white/10 rounded-2xl p-6 mb-8 text-left space-y-3">
            {[
              '✅ Pristup svim video lekcijama',
              '✅ Radni listovi i predlošci',
              '✅ Privatna zajednica polaznika',
              '✅ Certifikat po završetku',
              '✅ Doživotni pristup + nadopune',
            ].map(item => (
              <p key={item} className="text-white/70 text-sm">{item}</p>
            ))}
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/portal">
              <Button className="gap-2 w-full sm:w-auto">
                Idi na portal <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/prijava">
              <Button variant="outline" className="w-full sm:w-auto">Prijavi se</Button>
            </Link>
          </div>
          <p className="text-white/30 text-xs mt-8">
            Pitanja? <a href="mailto:brane.recek@gmail.com" className="text-gold hover:underline">brane.recek@gmail.com</a>
          </p>
        </div>
      </main>
    )
  }

  // Starter paket success
  if (isStarterSuccess) {
    return (
      <main className="flex-1 pt-24 pb-20 px-4 flex items-center justify-center">
        <div className="max-w-lg w-full text-center">
          <div className="w-20 h-20 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center mx-auto mb-8">
            <Sparkles className="w-10 h-10 text-gold" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white mb-4">
            Starter Paket je <span className="text-gold">tvoj!</span>
          </h1>
          <p className="text-white/60 mb-2">Provjeri email — šaljemo sve materijale odmah.</p>
          <p className="text-white/40 text-sm mb-8">
            Excel tracker, PDF vodiče i bonus materijale dobit ćeš u narednih 5 minuta. Provjeri i spam mapu.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/vip">
              <Button className="gap-2 w-full sm:w-auto">
                VIP mentorstvo <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/volim-svojnovac">
              <Button variant="outline" className="w-full sm:w-auto">Pogledaj tečaj →</Button>
            </Link>
          </div>
        </div>
      </main>
    )
  }

  // Lead thank-you + Tripwire (default when ?lead=1 or no params)
  return (
    <main className="flex-1 pt-24 pb-20 px-4">
      <div className="max-w-2xl mx-auto">

        {/* Confirmation */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-green-400" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white mb-3">Vodič je na putu!</h1>
          <div className="flex items-center justify-center gap-2 text-white/50 text-sm">
            <Mail className="w-4 h-4 shrink-0" />
            <span>Provjeri email (i spam mapu) za besplatni PDF vodič</span>
          </div>
        </div>

        {/* Tripwire box */}
        <div className="bg-navy border border-gold/30 rounded-2xl overflow-hidden shadow-xl shadow-gold/5">
          <div className="bg-gold/10 border-b border-gold/20 px-6 py-4 flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-gold" />
              <span className="text-gold font-semibold text-sm">Posebna ponuda — samo za čitatelje vodiča</span>
            </div>
            {!expired ? (
              <div className="flex items-center gap-2 bg-navy/60 border border-gold/20 rounded-lg px-3 py-1.5">
                <Clock className="w-4 h-4 text-gold" />
                <span className="text-white font-mono text-sm font-bold">
                  {pad(timeLeft.min)}:{pad(timeLeft.sec)}
                </span>
              </div>
            ) : (
              <span className="text-white/40 text-xs">Ponuda istekla</span>
            )}
          </div>

          <div className="p-6 lg:p-8">
            <h2 className="text-2xl sm:text-3xl font-black text-white mb-2">
              Financijski Starter Paket
            </h2>
            <p className="text-white/50 mb-7 leading-relaxed">
              Dok čekaš vodič — uzmi i sve alate koji idu uz njega. Spreadsheetovi, kalkulatori i vodiči koji ti pokazuju{' '}
              <span className="text-white/70 italic">točno što napraviti</span> od prvog dana.
            </p>

            {/* What's included */}
            <div className="space-y-3.5 mb-8">
              {[
                { icon: '📊', title: '"Moj Novac" — Excel budžetski tracker', desc: 'Prihodi, troškovi i uštevina na jednom listu' },
                { icon: '📋', title: '90-dnevni plan financijske slobode', desc: 'Tjedan po tjedan — što napraviti i kada' },
                { icon: '🚨', title: 'Kalkulator hitnog fonda', desc: 'Koliko trebaš i strategija za brzu izgradnju' },
                { icon: '💳', title: 'Tracker za otplatu dugova', desc: 'Lavina ili snježna kugla metoda — s kalkulatorom' },
                { icon: '🎁', title: 'BONUS: 10 navika financijski uspješnih', desc: 'PDF vodič za promjenu mindset-a o novcu' },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="text-xl leading-none mt-0.5">{item.icon}</span>
                  <div>
                    <p className="text-white text-sm font-medium">{item.title}</p>
                    <p className="text-white/40 text-xs mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-white/30 line-through text-lg">97€</span>
              <span className="text-5xl font-black text-gold">27€</span>
              <span className="text-white/40 text-sm">jednokratno</span>
            </div>

            {!expired ? (
              <Button
                onClick={handleBuyStarter}
                disabled={checkoutLoading}
                className="w-full bg-gold hover:bg-gold/90 text-navy font-bold text-base py-6 h-auto gap-2"
                size="lg"
              >
                {checkoutLoading
                  ? <><Loader2 className="w-4 h-4 animate-spin" /> Preusmjeravam na plaćanje...</>
                  : <>Uzmi Starter Paket za 27€ <ArrowRight className="w-4 h-4" /></>
                }
              </Button>
            ) : (
              <Button className="w-full" disabled size="lg">
                Ponuda je istekla
              </Button>
            )}

            <div className="flex items-center justify-center gap-4 mt-4 text-xs text-white/25 flex-wrap">
              <div className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                Sigurno plaćanje — Stripe
              </div>
              <span>·</span>
              <span>30-dnevno jamstvo povrata novca</span>
            </div>
          </div>
        </div>

        {/* Skip */}
        <div className="text-center mt-5">
          <Link href="/" className="text-white/25 text-sm hover:text-white/50 transition-colors">
            Ne, hvala — nastavi bez paketa
          </Link>
        </div>

        {/* Social proof */}
        <div className="mt-12">
          <p className="text-white/30 text-xs uppercase tracking-wider text-center mb-5">Što kažu korisnici</p>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              {
                name: 'Ana M.',
                role: 'Marketing menadžerica, Rijeka',
                quote: 'Za 2 tjedna dobila sam potpun pregled svega. Excel tracker je toliko jednostavan da ga zaista koristim svaki dan — a nikad prije nisam pratila troškove.',
                stars: 5,
              },
              {
                name: 'Tomislav R.',
                role: 'Freelancer, Osijek',
                quote: 'Kalkulator hitnog fonda mi je otvorio oči. Nisam znao koliko mi zapravo nedostaje. Počeo sam štediti odmah, bez čekanja na "pravi trenutak".',
                stars: 5,
              },
            ].map((t, i) => (
              <div key={i} className="bg-navy border border-white/10 rounded-xl p-5">
                <div className="flex gap-0.5 mb-3">
                  {Array(t.stars).fill(0).map((_, j) => (
                    <Star key={j} className="w-3.5 h-3.5 fill-gold text-gold" />
                  ))}
                </div>
                <p className="text-white/60 text-sm italic leading-relaxed mb-3">&ldquo;{t.quote}&rdquo;</p>
                <p className="text-white font-semibold text-sm">{t.name}</p>
                <p className="text-white/40 text-xs mt-0.5">{t.role}</p>
              </div>
            ))}
          </div>
        </div>

        {/* VIP teaser */}
        <div className="mt-10 bg-white/2 border border-white/8 rounded-xl px-6 py-5 text-center">
          <p className="text-white/50 text-sm mb-2">Tražiš osobni mentorski rad?</p>
          <Link href="/vip" className="text-gold text-sm font-semibold hover:underline">
            Pogledaj VIP mentorstvo → ograničen broj mjesta
          </Link>
        </div>

      </div>
    </main>
  )
}

export default function HvalaPage() {
  return (
    <div className="min-h-screen bg-navy flex flex-col">
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-navy/95 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center">
          <Link href="/">
            <Image src="/logo/fincoach-logo-horizontal.svg" alt="FinCoach VIP" width={130} height={41} priority />
          </Link>
        </div>
      </nav>
      <Suspense fallback={
        <main className="flex-1 pt-24 flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-gold" />
        </main>
      }>
        <HvalaContent />
      </Suspense>
      <SiteFooter />
    </div>
  )
}
