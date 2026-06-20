'use client'

import { useState } from 'react'
import Link from 'next/link'
import SiteFooter from '@/components/SiteFooter'

export default function AffiliatePage() {
  const [isLoading, setIsLoading] = useState(false)
  const [applied, setApplied] = useState(false)
  const [error, setError] = useState('')

  async function handleApply() {
    setIsLoading(true)
    setError('')
    try {
      const res = await fetch('/api/affiliate/apply', { method: 'POST' })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Greška.')
      setApplied(true)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Greška.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-[#0D1B2A] text-white">
      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 py-20 text-center">
        <div className="inline-block bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] text-sm font-semibold px-4 py-1.5 rounded-full mb-6">
          FinCoach VIP Partnerski program
        </div>
        <h1 className="text-4xl md:text-5xl font-black leading-tight mb-6">
          Zaradi preporučujući<br />
          <span className="text-[#D4AF37]">ono što ti je pomoglo</span>
        </h1>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-10">
          Svaki put kad netko upiše tečaj preko tvoje poveznice — dobiš{' '}
          <strong className="text-white">30% provizije</strong>. A tvoji prijatelji kupuju s{' '}
          <strong className="text-white">10% popustom</strong>. Win-win-win.
        </p>

        {applied ? (
          <div className="bg-[#D4AF37]/10 border border-[#D4AF37] rounded-xl p-8 max-w-md mx-auto">
            <div className="text-4xl mb-4">🎉</div>
            <h2 className="text-xl font-bold text-[#D4AF37] mb-2">Prijava primljena!</h2>
            <p className="text-gray-300 mb-4">
              Poslali smo ti email s tvojom unikatnom affiliate vezom i kodom. Provjeri pretinac.
            </p>
            <Link href="/affiliate/dashboard" className="inline-block bg-[#D4AF37] text-[#0D1B2A] font-bold py-3 px-8 rounded-lg hover:bg-yellow-400 transition">
              Idi na dashboard →
            </Link>
          </div>
        ) : (
          <div>
            {error && (
              <div className="bg-red-900/40 border border-red-500 text-red-300 px-4 py-3 rounded-lg mb-6 max-w-md mx-auto text-sm">
                {error}
              </div>
            )}
            <button
              onClick={handleApply}
              disabled={isLoading}
              className="inline-block bg-[#D4AF37] text-[#0D1B2A] font-black text-lg py-4 px-10 rounded-xl hover:bg-yellow-400 transition disabled:opacity-60"
            >
              {isLoading ? 'Prijavljujem...' : 'Postani FinCoach partner →'}
            </button>
            <p className="text-gray-500 text-sm mt-3">Samo za kupce tečaja · Besplatno · Bez obveza</p>
          </div>
        )}
      </section>

      {/* Kako funkcionira */}
      <section className="bg-[#091623] py-16">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-black text-center mb-12">Kako to funkcionira?</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                step: '1',
                icon: '🔗',
                title: 'Dobiš unikatnu vezu',
                desc: 'Tvoja osobna affiliate veza i kod. Dijeli na društvenim mrežama, u emailu, gdje god hoćeš.',
              },
              {
                step: '2',
                icon: '💰',
                title: 'Tvoji prijatelji štede',
                desc: 'Svaki tko kupi putem tvoje veze automatski dobiva 10% popusta — bez da mora raditi ništa posebno.',
              },
              {
                step: '3',
                icon: '🎯',
                title: 'Ti zarađuješ',
                desc: '30% od svake prodaje stižu na tvoj račun. Isplata jednom mjesečno, direktno na bankovni račun.',
              },
            ].map((item) => (
              <div key={item.step} className="bg-[#0D1B2A] border border-white/10 rounded-xl p-6 text-center">
                <div className="text-4xl mb-3">{item.icon}</div>
                <h3 className="text-lg font-bold text-[#D4AF37] mb-2">{item.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Zarada kalkulator */}
      <section className="max-w-4xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-black text-center mb-3">Koliko možeš zaraditi?</h2>
        <p className="text-gray-400 text-center mb-10">Tečaj košta €197. Ti zarađuješ €59,10 po prodaji.</p>
        <div className="grid md:grid-cols-3 gap-4">
          {[
            { sales: 5, earning: '€295,50', label: '5 prodaja/mj.' },
            { sales: 15, earning: '€886,50', label: '15 prodaja/mj.' },
            { sales: 30, earning: '€1.773', label: '30 prodaja/mj.' },
          ].map((row) => (
            <div key={row.sales} className="bg-[#091623] border border-[#D4AF37]/30 rounded-xl p-6 text-center">
              <div className="text-gray-400 text-sm mb-1">{row.label}</div>
              <div className="text-3xl font-black text-[#D4AF37]">{row.earning}</div>
              <div className="text-gray-500 text-xs mt-1">neto zarada</div>
            </div>
          ))}
        </div>
        <p className="text-center text-gray-500 text-sm mt-6">
          * 30% od €197. Isplata jednom mjesečno za sve akumulirane konverzije.
        </p>
      </section>

      {/* FAQ */}
      <section className="bg-[#091623] py-16">
        <div className="max-w-2xl mx-auto px-6">
          <h2 className="text-3xl font-black text-center mb-10">Česta pitanja</h2>
          <div className="space-y-4">
            {[
              { q: 'Tko može biti FinCoach partner?', a: 'Samo kupci tečaja "Volim Svoj Novac". Vjerujemo da je najautentičniji ambasador netko tko je osobno prošao program i vidio rezultate.' },
              { q: 'Kada i kako se isplaćuje provizija?', a: 'Jednom mjesečno, za sve konverzije iz prethodnog mjeseca. Isplata na bankovni račun ili PayPal. Minimalni iznos za isplatu je €50.' },
              { q: 'Koliko dugo traje affiliate cookie?', a: 'Ako netko klikne tvoju vezu, pratimo ga 30 dana. Ako kupi unutar 30 dana — provizija je tvoja.' },
              { q: 'Što ako kupac traži povrat?', a: 'Ako kupac iskoristi 30-dnevnu garanciju i traži povrat, ta konverzija se poništava i provizija se ne isplaćuje.' },
              { q: 'Kako pratim svoje rezultate?', a: 'Imaš vlastiti dashboard na /affiliate/dashboard — vidiš klikove, konverzije, zarade i status isplata u realnom vremenu.' },
            ].map((item) => (
              <details key={item.q} className="bg-[#0D1B2A] border border-white/10 rounded-xl p-5 group">
                <summary className="font-semibold text-white cursor-pointer list-none flex justify-between items-center">
                  {item.q}
                  <span className="text-[#D4AF37] group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <p className="text-gray-400 text-sm mt-3 leading-relaxed">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-2xl mx-auto px-6 py-16 text-center">
        <h2 className="text-3xl font-black mb-4">Spreman/na početi?</h2>
        <p className="text-gray-400 mb-8">Prijavljivanje traje manje od minute. Tvoja affiliate veza čeka.</p>
        {!applied && (
          <button
            onClick={handleApply}
            disabled={isLoading}
            className="inline-block bg-[#D4AF37] text-[#0D1B2A] font-black text-lg py-4 px-10 rounded-xl hover:bg-yellow-400 transition disabled:opacity-60"
          >
            {isLoading ? 'Prijavljujem...' : 'Postani partner →'}
          </button>
        )}
      </section>

      <SiteFooter />
    </main>
  )
}
