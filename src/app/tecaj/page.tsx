'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import CountdownTimer from '@/components/CountdownTimer'
import { toast } from 'sonner'
import {
  CheckCircle, Star, Shield, ChevronDown, ChevronUp,
  Video, Award, Calendar, Users, Zap, Clock
} from 'lucide-react'

const PRICE_LAUNCH = 9700
const PRICE_REGULAR = 39700

const faqs = [
  {
    q: 'Za koga je ovaj teÄŤaj?',
    a: 'TeÄŤaj je namijenjen svima koji Ĺľele preuzeti kontrolu nad osobnim financijama â€” bilo da tek poÄŤinjeĹˇ ili ĹľeliĹˇ unaprijediti postojeÄ‡e navike. Nema potrebe za prethodnim financijskim znanjem.',
  },
  {
    q: 'Koliko vremena mi treba svaki dan?',
    a: 'Svaka lekcija traje izmeÄ‘u 10 i 20 minuta. Program je dizajniran da stane u tvoj svakodnevni raspored â€” bez stresa.',
  },
  {
    q: 'Ĺ to ako nisam zadovoljan/na?',
    a: 'Nudimo 30-dnevnu garanciju povrata novca bez pitanja. Ako u prvih 30 dana nisi zadovoljan/na, vraÄ‡amo ti pun iznos.',
  },
  {
    q: 'Koliko dugo imam pristup sadrĹľaju?',
    a: 'DoĹľivotni pristup. Jednom kada kupiĹˇ teÄŤaj, sav sadrĹľaj je tvoj zauvijek â€” ukljuÄŤujuÄ‡i sve buduÄ‡e nadopune.',
  },
  {
    q: 'Dobivam li certifikat?',
    a: 'Da! Po zavrĹˇetku svih 90 dana, automatski generiramo personalizirani certifikat o zavrĹˇetku koji moĹľeĹˇ podijeliti na LinkedInu ili ispisati.',
  },
]

export default function SalesPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [countdownExpires, setCountdownExpires] = useState<string | null>(null)

  useEffect(() => {
    // Check if there's a countdown in localStorage (set after lead capture)
    const stored = localStorage.getItem('countdown_expires_at')
    if (stored && new Date(stored) > new Date()) {
      setCountdownExpires(stored)
    }
  }, [])

  async function handleCheckout() {
    setLoading(true)
    try {
      const affiliateCode = new URLSearchParams(window.location.search).get('ref') ??
                            document.cookie.match(/affiliate_code=([^;]+)/)?.[1] ?? ''

      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courseSlug: 'volim-svojnovac',
          affiliateCode,
        }),
      })

      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        throw new Error(data.error ?? 'GreĹˇka pri kreiranju narudĹľbe')
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'NeĹˇto je poĹˇlo po krivu.')
    } finally {
      setLoading(false)
    }
  }

  const showLaunchPrice = !!countdownExpires

  return (
    <div className="min-h-screen bg-navy">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-navy/95 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="text-gold font-bold text-lg tracking-wide">
            FinCoach VIP
          </Link>
          <Button onClick={handleCheckout} size="sm" loading={loading}>
            Kupi teÄŤaj â€” {showLaunchPrice ? 'â‚¬97' : 'â‚¬197'}
          </Button>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-24 pb-16 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <Badge className="mb-6 bg-gold/10 text-gold border-gold/30 text-sm px-4 py-1.5">
              90-dnevni video program
            </Badge>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight mb-6">
              Preuzmi potpunu kontrolu<br />
              nad <span className="text-gold">svojim novcem</span><br />
              za 90 dana
            </h1>
            <p className="text-xl text-white/60 max-w-2xl mx-auto leading-relaxed">
              90 video lekcija, korak po korak. Bez sloĹľenih teorija â€” samo konkretni, odmah primjenjivi koraci koji funkcioniraju.
            </p>
          </div>

          {/* Video placeholder */}
          <div className="max-w-3xl mx-auto mb-10">
            <div className="aspect-video bg-navy-50 border border-white/10 rounded-2xl flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-navy-200 to-navy-100" />
              <button className="relative z-10 w-24 h-24 rounded-full bg-gold flex items-center justify-center shadow-2xl shadow-gold/30 hover:scale-105 transition-transform">
                <svg className="w-10 h-10 text-navy ml-1" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M6.3 2.841A1.5 1.5 0 004 4.11v11.78a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                </svg>
              </button>
              <div className="absolute bottom-4 left-4 right-4">
                <div className="h-1 bg-white/20 rounded-full">
                  <div className="h-1 bg-gold rounded-full w-0" />
                </div>
              </div>
            </div>
          </div>

          {/* CTA block */}
          <div className="max-w-lg mx-auto bg-navy-50 border border-white/10 rounded-2xl p-8 text-center">
            {countdownExpires && (
              <CountdownTimer expiresAt={countdownExpires} className="mb-6" />
            )}

            <div className="mb-6">
              {showLaunchPrice ? (
                <div>
                  <p className="text-white/40 line-through text-lg">â‚¬397</p>
                  <p className="text-5xl font-black text-gold mt-1">â‚¬97</p>
                  <p className="text-white/50 text-sm mt-1">Posebna cijena â€” samo za tebe</p>
                </div>
              ) : (
                <div>
                  <p className="text-white/40 line-through text-lg">â‚¬397</p>
                  <p className="text-5xl font-black text-gold mt-1">â‚¬197</p>
                  <p className="text-white/50 text-sm mt-1">Jednokratna uplata Â· DoĹľivotni pristup</p>
                </div>
              )}
            </div>

            <Button onClick={handleCheckout} size="xl" loading={loading} className="w-full mb-4">
              UpiĹˇi se sada â†’
            </Button>

            <div className="flex items-center justify-center gap-2 text-sm text-white/40">
              <Shield className="w-4 h-4 text-green-400" />
              <span>30-dnevna garancija povrata novca</span>
            </div>

            <div className="grid grid-cols-3 gap-3 mt-6 pt-6 border-t border-white/10">
              {[
                { icon: Video, label: '90 videa' },
                { icon: Award, label: 'Certifikat' },
                { icon: Calendar, label: 'DoĹľivotni pristup' },
              ].map(item => (
                <div key={item.label} className="text-center">
                  <item.icon className="w-5 h-5 text-gold mx-auto mb-1" />
                  <p className="text-xs text-white/50">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* For whom */}
      <section className="py-20 px-4 sm:px-6 bg-navy-50/30">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Za koga je ovaj teÄŤaj?</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                emoji: 'đź’Ľ',
                title: 'Zaposleni koji "preĹľivljavaju"',
                desc: 'ImaĹˇ stabilan prihod, ali do kraja mjeseca uvijek neĹˇto fali. Ĺ˝eliĹˇ prestati Ĺľivjeti od plaÄ‡e do plaÄ‡e.',
              },
              {
                emoji: 'đźš€',
                title: 'Poduzetnici i freelanceri',
                desc: 'Prihodi su nestabilni i teĹˇko planiraĹˇ. TrebaĹˇ sustav koji funkcionira bez obzira na fluktuacije.',
              },
              {
                emoji: 'đźŽŻ',
                title: 'Oni koji Ĺľele napredovati',
                desc: 'VeÄ‡ imaĹˇ osnovnu Ĺˇtednju, ali ĹľeliĹˇ iÄ‡i dalje â€” investirati, izgraditi fond i postiÄ‡i financijsku slobodu.',
              },
            ].map(p => (
              <div key={p.title} className="bg-navy border border-white/10 rounded-2xl p-6">
                <div className="text-4xl mb-4">{p.emoji}</div>
                <h3 className="text-lg font-semibold text-white mb-2">{p.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What you get */}
      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Ĺ to dobivaĹˇ?</h2>
            <p className="text-white/50 text-lg">Sve Ĺˇto trebaĹˇ za financijsku transformaciju.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {[
              { icon: Calendar, title: '90 dana strukturiranog programa', desc: 'Jasna putanja â€” od financijske snimke do automatskog investiranja. Svaki dan nova lekcija.' },
              { icon: Video, title: '90 video lekcija (10-20 min)', desc: 'Kratke, fokusirane lekcije koje moĹľeĹˇ gledati u podijeljenom zaslon i odmah primijeniti.' },
              { icon: Zap, title: 'Radni listovi i predloĹˇci', desc: 'Svaka lekcija dolazi s praktiÄŤnim alatima â€” excel tablicama, kalkulatorima, kontrolnim popisima.' },
              { icon: Users, title: 'Privatna zajednica', desc: 'PristupiĹˇ privatnoj grupi gdje moĹľeĹˇ postavljati pitanja i razmjenjivati iskustva s ostalim polaznicima.' },
              { icon: Award, title: 'Certifikat o zavrĹˇetku', desc: 'Po zavrĹˇetku programa, generirat Ä‡emo personalizirani certifikat koji moĹľeĹˇ koristiti na LinkedInu.' },
              { icon: Clock, title: 'DoĹľivotni pristup + nadopune', desc: 'Sve buduÄ‡e nadopune programa su ukljuÄŤene u cijenu. Jednom upisaĹˇ â€” zauvijek imaĹˇ.' },
            ].map(item => (
              <div key={item.title} className="flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center shrink-0">
                  <item.icon className="w-5 h-5 text-gold" />
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">{item.title}</h3>
                  <p className="text-white/50 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Programme overview */}
          <div className="bg-navy-50 border border-white/10 rounded-2xl p-8">
            <h3 className="text-xl font-bold text-white mb-6 text-center">Program u 4 faze</h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { phase: 'Priprema', days: 'Dan 0', color: 'border-gold/30 bg-gold/5', desc: 'Postavljanje temelja â€” financijska snimka i ciljevi' },
                { phase: 'Faza 1', days: 'Dani 1â€“30', color: 'border-blue-500/30 bg-blue-500/5', desc: 'BudĹľetiranje i kontrola troĹˇkova' },
                { phase: 'Faza 2', days: 'Dani 31â€“60', color: 'border-purple-500/30 bg-purple-500/5', desc: 'Gradnja hitnog fonda i Ĺˇtednja' },
                { phase: 'Faza 3', days: 'Dani 61â€“90', color: 'border-green-500/30 bg-green-500/5', desc: 'Investiranje i dugoroÄŤna financijska sloboda' },
              ].map(p => (
                <div key={p.phase} className={`border rounded-xl p-4 ${p.color}`}>
                  <p className="text-xs text-white/40 mb-1">{p.days}</p>
                  <p className="font-bold text-white mb-2">{p.phase}</p>
                  <p className="text-sm text-white/60">{p.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Guarantee */}
      <section className="py-16 px-4 sm:px-6 bg-green-500/5 border-y border-green-500/10">
        <div className="max-w-3xl mx-auto text-center">
          <Shield className="w-16 h-16 text-green-400 mx-auto mb-6" />
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            30-dnevna garancija povrata novca
          </h2>
          <p className="text-white/60 leading-relaxed text-lg">
            Ako u prvih 30 dana nisi zadovoljan/na programom â€” iz bilo kojeg razloga â€” vraÄ‡amo ti pun iznos bez pitanja. Nema rizika, nema administracije.
          </p>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-white mb-4">Rezultati polaznika</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: 'Marija K.', role: 'UÄŤiteljica, Split', stars: 5, text: 'Za 3 mjeseca uĹˇtedjela sam viĹˇe nego za cijelu prethodnu godinu. Ovo stvarno funkcionira!' },
              { name: 'Ivan P.', role: 'Poduzetnik, Zagreb', stars: 5, text: 'Mislio sam da znam sve o novcu, ali Braneov pristup mi je potpuno promijenio perspektivu i navike.' },
              { name: 'Ana M.', role: 'Marketing menadĹľerica, Rijeka', stars: 5, text: 'KonaÄŤno nemam stres na kraju mjeseca. Sustav radi automatski, bez volje.' },
            ].map(t => (
              <div key={t.name} className="bg-navy-50 border border-white/10 rounded-2xl p-6">
                <div className="flex gap-0.5 mb-4">
                  {Array(t.stars).fill(0).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-gold text-gold" />
                  ))}
                </div>
                <p className="text-white/70 text-sm leading-relaxed mb-4 italic">&ldquo;{t.text}&rdquo;</p>
                <p className="text-white font-semibold text-sm">{t.name}</p>
                <p className="text-white/40 text-xs">{t.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-4 sm:px-6 bg-navy-50/30">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-10 text-center">ÄŚesto postavljana pitanja</h2>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-navy border border-white/10 rounded-xl overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-6 py-4 text-left"
                >
                  <span className="font-semibold text-white pr-4">{faq.q}</span>
                  {openFaq === i ? (
                    <ChevronUp className="w-5 h-5 text-gold shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-white/40 shrink-0" />
                  )}
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-5 text-white/60 leading-relaxed text-sm">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Spreman/na za promjenu?
          </h2>
          <p className="text-white/50 mb-8 text-lg">
            PridruĹľi se stotinama polaznika koji su veÄ‡ preuzeli kontrolu nad financijama.
          </p>
          {countdownExpires && (
            <CountdownTimer expiresAt={countdownExpires} className="mb-8" />
          )}
          <div className="bg-navy-50 border border-white/10 rounded-2xl p-8">
            <div className="mb-6">
              {showLaunchPrice ? (
                <>
                  <p className="text-white/40 line-through">â‚¬397</p>
                  <p className="text-5xl font-black text-gold">â‚¬97</p>
                  <p className="text-white/50 text-sm">Posebna cijena samo za tebe</p>
                </>
              ) : (
                <>
                  <p className="text-white/40 line-through">â‚¬397</p>
                  <p className="text-5xl font-black text-gold">â‚¬197</p>
                  <p className="text-white/50 text-sm">Jednokratna uplata Â· DoĹľivotni pristup</p>
                </>
              )}
            </div>
            <Button onClick={handleCheckout} size="xl" loading={loading} className="w-full mb-4">
              UpiĹˇi se sada â€” bez rizika â†’
            </Button>
            <div className="flex items-center justify-center gap-2 text-sm text-white/40">
              <Shield className="w-4 h-4 text-green-400" />
              30-dnevna garancija povrata novca
            </div>
            <div className="mt-4 flex flex-wrap justify-center gap-4 text-xs text-white/30">
              <span>âś“ Sigurno plaÄ‡anje (Stripe)</span>
              <span>âś“ DoĹľivotni pristup</span>
              <span>âś“ Certifikat</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-10 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gold font-bold tracking-wide">FinCoach VIP</p>
          <div className="flex gap-6 text-sm text-white/40">
            <Link href="/" className="hover:text-white transition-colors">PoÄŤetna</Link>
            <Link href="/privatnost" className="hover:text-white transition-colors">Privatnost</Link>
            <Link href="/uvjeti" className="hover:text-white transition-colors">Uvjeti</Link>
          </div>
          <p className="text-white/30 text-sm">Â© 2024 FinCoach VIP</p>
        </div>
      </footer>
    </div>
  )
}
