'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import CountdownTimer from '@/components/CountdownTimer'
import {
  CheckCircle, Star, Shield, ChevronDown, ChevronUp,
  Video, Award, Calendar, Zap, Clock, Brain, TrendingUp
} from 'lucide-react'
import SiteFooter from '@/components/SiteFooter'

const faqs = [
  {
    q: 'Je li program za početnike?',
    a: 'Da, apsolutno. Program je dizajniran za sve — bez obzira na prethodno financijsko znanje. Koristimo jednostavan jezik s konkretnim primjerima iz stvarnog života.',
  },
  {
    q: 'Koliko vremena mi treba svaki dan?',
    a: 'Svaka lekcija traje između 5 i 10 minuta. Program je dizajniran da stane u tvoj svakodnevni raspored — bez stresa, bez žrtvovanja.',
  },
  {
    q: 'Na čemu je fokus programa?',
    a: '80% je psihologija i mindset, 20% matematika. Najprije uklanjamo mentalne blokade oko novca, tek onda gradimo praktični sustav.',
  },
  {
    q: 'Što ako nisam zadovoljan/na?',
    a: 'Nudimo 30-dnevnu garanciju povrata novca bez pitanja. Ako u prvih 30 dana nisi zadovoljan/na, vraćamo ti pun iznos. Nema rizika.',
  },
  {
    q: 'Koliko dugo imam pristup sadržaju?',
    a: 'Doživotni pristup. Jednom kada kupiš program, sav sadržaj je tvoj zauvijek — uključujući sve buduće nadopune bez dodatnih troškova.',
  },
  {
    q: 'Dobivam li certifikat?',
    a: 'Da! Po završetku svih 90 dana, automatski generiramo personalizirani certifikat o završetku koji možeš podijeliti na LinkedInu ili ispisati.',
  },
  {
    q: 'Mogu li koristiti kod PRILIKA?',
    a: 'Da — kod PRILIKA uvijek daje pristup po cijeni €197 umjesto €397, bez vremenskog ograničenja.',
  },
]

const testimonials = [
  { name: 'Marija K.', role: 'Učiteljica, Split', stars: 5, text: 'Za 3 mjeseca uštedjela sam više nego za cijelu prethodnu godinu. Konačno razumijem kamo odlazi svaka kuna i imam plan. Ovo stvarno funkcionira!' },
  { name: 'Ivan P.', role: 'Poduzetnik, Zagreb', stars: 5, text: 'Mislio sam da znam sve o novcu. Braneov pristup mi je potpuno promijenio perspektivu — shvatio sam da problem nije bio u prihodima, nego u navikama.' },
  { name: 'Ana M.', role: 'Marketing menadžerica, Rijeka', stars: 5, text: 'Konačno nemam stres na kraju mjeseca. Sustav radi automatski, bez volje. Preporučujem svima koji osjećaju da im novac "curi".' },
  { name: 'Tomislav R.', role: 'Freelancer, Osijek', stars: 5, text: 'Kao freelancer nikad nisam znao planirati s nepravilnim prihodima. Nakon 60 dana imam hitni fond i prvi put investiram.' },
  { name: 'Maja S.', role: 'Menadžerica, Novi Sad', stars: 5, text: 'Program mi je pomogao eliminirati dug koji sam nosila 5 godina. Braneov mentorat je ono što nedostaje u svim knjigama o financijama.' },
  { name: 'Darko V.', role: 'Inženjer, Ljubljana', stars: 5, text: 'Mislio sam da su mi financije u redu, ali program je otkrio koliko sam zapravo ostavljao na stolu. Sada štedim 20% više bez da osjećam razliku.' },
]

export default function SalesPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [countdownExpires, setCountdownExpires] = useState<string | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem('countdown_expires_at')
    if (stored && new Date(stored) > new Date()) {
      setCountdownExpires(stored)
    } else {
      // Set 24h countdown on first visit to /tecaj
      const existing = localStorage.getItem('tecaj_first_visit')
      if (!existing) {
        const expires = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
        localStorage.setItem('tecaj_first_visit', expires)
        localStorage.setItem('countdown_expires_at', expires)
        setCountdownExpires(expires)
      } else if (new Date(existing) > new Date()) {
        setCountdownExpires(existing)
      }
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
        body: JSON.stringify({ courseSlug: 'volim-svojnovac', affiliateCode }),
      })

      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        throw new Error(data.error ?? 'Greška pri kreiranju narudžbe')
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Nešto je pošlo po krivu.')
    } finally {
      setLoading(false)
    }
  }

  const showLaunchPrice = !!countdownExpires && new Date(countdownExpires) > new Date()
  const currentPrice = showLaunchPrice ? '€97' : '€197'
  const strikePrice = '€397'

  return (
    <div className="min-h-screen bg-navy">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-navy/95 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <Image src="/logo/fincoach-logo-horizontal.svg" alt="FinCoach VIP" width={150} height={47} priority />
          </Link>
          <Button onClick={handleCheckout} size="sm" disabled={loading}>
            {loading ? 'Učitavam...' : `Kupi program — ${currentPrice}`}
          </Button>
        </div>
      </nav>

      {/* Urgency bar */}
      {showLaunchPrice && (
        <div className="fixed top-16 left-0 right-0 z-40 bg-gold/10 border-b border-gold/20 py-2 px-4 text-center">
          <p className="text-gold text-sm font-medium">
            ⚡ Tvoja osobna cijena od €97 ističe za: <span className="font-bold"><CountdownTimer expiresAt={countdownExpires!} inline /></span>
          </p>
        </div>
      )}

      {/* Hero */}
      <section className={`px-4 sm:px-6 ${showLaunchPrice ? 'pt-32' : 'pt-24'} pb-16`}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <Badge className="mb-6 bg-gold/10 text-gold border-gold/30 text-sm px-4 py-1.5">
              90-dnevni video program · 500+ polaznika
            </Badge>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight mb-6">
              Preuzmi potpunu kontrolu<br />
              nad <span className="text-gold">svojim novcem</span><br />
              za 90 dana
            </h1>
            <p className="text-xl text-white/60 max-w-3xl mx-auto leading-relaxed mb-4">
              90 video lekcija, korak po korak. Bez složenih teorija — samo konkretni, odmah primjenjivi koraci koji funkcioniraju.
            </p>
            <p className="text-white/40 text-base italic">
              "Ne čekaj. Savršen trenutak nikad neće doći. Trenutak je sada." — Napoleon Hill
            </p>
          </div>

          {/* Promo video */}
          <div className="max-w-3xl mx-auto mb-10">
            <div className="aspect-video bg-navy-50 border border-white/10 rounded-2xl overflow-hidden">
              <video
                src="/videos/fincoach_promo.mp4"
                controls
                poster="/images/brane-predava.jpg"
                className="w-full h-full object-cover"
                preload="metadata"
              />
            </div>
          </div>

          {/* CTA block */}
          <div className="max-w-lg mx-auto bg-navy-50 border border-white/10 rounded-2xl p-8 text-center">
            {showLaunchPrice && (
              <div className="mb-6">
                <CountdownTimer expiresAt={countdownExpires!} className="mb-2" />
                <p className="text-gold/70 text-xs">Nakon isteka, cijena raste na €197</p>
              </div>
            )}

            <div className="mb-6">
              <p className="text-white/40 line-through text-lg">{strikePrice}</p>
              <p className="text-5xl font-black text-gold mt-1">{currentPrice}</p>
              <p className="text-white/50 text-sm mt-1">
                {showLaunchPrice ? '⚡ Tvoja osobna 24h cijena' : 'Jednokratna uplata · Doživotni pristup'}
              </p>
            </div>

            <Button onClick={handleCheckout} disabled={loading} className="w-full mb-4 text-lg py-4">
              {loading ? 'Učitavam...' : 'Upiši se sada →'}
            </Button>

            <div className="flex items-center justify-center gap-2 text-sm text-white/40 mb-4">
              <Shield className="w-4 h-4 text-green-400" />
              <span>30-dnevna garancija povrata novca</span>
            </div>

            {!showLaunchPrice && (
              <p className="text-white/30 text-xs">
                Imaš kod? Unesi <span className="text-gold font-mono">PRILIKA</span> na blagajni za cijenu €197
              </p>
            )}

            <div className="grid grid-cols-3 gap-3 mt-6 pt-6 border-t border-white/10">
              {[
                { icon: Video, label: '90 lekcija' },
                { icon: Award, label: 'Certifikat' },
                { icon: Calendar, label: 'Doživotni pristup' },
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

      {/* Social proof bar */}
      <section className="py-10 px-4 bg-navy-50/50 border-y border-white/5">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { num: '500+', label: 'Polaznika' },
            { num: '4.9/5', label: 'Prosječna ocjena' },
            { num: '90', label: 'Dana programa' },
            { num: '30', label: 'Dana garancija' },
          ].map(s => (
            <div key={s.label}>
              <p className="text-3xl font-black text-gold">{s.num}</p>
              <p className="text-white/50 text-sm mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pain points */}
      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Prepoznaješ li se u ovome?</h2>
            <p className="text-white/50">Većina nas prolazi kroz iste probleme.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { emoji: '😰', title: 'Novac "nestaje" do kraja mjeseca', desc: 'Zarađuješ pristojno, ali nikad ne znaš gdje odlazi. Krajem mjeseca uvijek nešto nedostaje.' },
              { emoji: '🐷', title: 'Štednja koja ne funkcionira', desc: 'Svaki tjedan si kažeš "od sljedećeg mjeseca počnem štedjeti". Taj dan nikad ne dođe.' },
              { emoji: '😔', title: 'Stres zbog financija', desc: 'Neočekivani troškovi te potpuno izbacuju iz takta. Financijska nesigurnost utječe na sve aspekte života.' },
            ].map(p => (
              <div key={p.title} className="bg-navy-50 border border-white/10 rounded-2xl p-6">
                <div className="text-4xl mb-4">{p.emoji}</div>
                <h3 className="text-lg font-semibold text-white mb-2">{p.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* For whom */}
      <section className="py-20 px-4 sm:px-6 bg-navy-50/30">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Za koga je ovaj program?</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { emoji: '💼', title: 'Zaposleni koji "preživljavaju"', desc: 'Imaš stabilan prihod, ali do kraja mjeseca uvijek nešto fali. Želiš prestati živjeti od plaće do plaće.' },
              { emoji: '🚀', title: 'Poduzetnici i freelanceri', desc: 'Prihodi su nestabilni i teško planiraš. Trebaš sustav koji funkcionira bez obzira na fluktuacije.' },
              { emoji: '🎯', title: 'Oni koji žele napredovati', desc: 'Već imaš osnovnu štednju, ali želiš ići dalje — investirati, izgraditi fond i postići financijsku slobodu.' },
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
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Što dobivaš?</h2>
            <p className="text-white/50 text-lg">Sve što trebaš za financijsku transformaciju.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {[
              { icon: Brain, title: '80% psihologija, 20% matematika', desc: 'Najprije uklanjamo mentalne blokade i negativna uvjerenja o novcu. Bez toga, tehnike ne funkcioniraju.' },
              { icon: Video, title: '90 video lekcija (5-10 min)', desc: 'Kratke, fokusirane lekcije koje možeš gledati bilo kada i odmah primijeniti u svakodnevnom životu.' },
              { icon: Zap, title: '4 financijska kalkulatora', desc: 'Kalkulator proračuna, hitnog fonda, otplate duga i složene kamate — interaktivni alati dostupni u portalu.' },
              { icon: TrendingUp, title: 'Strategije pasivnog prihoda', desc: 'Naučit ćeš kako natjerati novac da radi za tebe — osnove investiranja prilagođene našem tržištu.' },
              { icon: Award, title: 'Certifikat + doživotni pristup', desc: 'Po završetku programa dobivaš personalizirani certifikat. Sve buduće nadopune su uključene u cijenu.' },
              { icon: Clock, title: 'Uči vlastitim tempom', desc: 'Nema rokova ni rasporeda. Pristupaš sadržaju 24/7 i napreduješ onoliko brzo koliko ti odgovara.' },
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

          {/* 10 benefits */}
          <div className="bg-navy-50 border border-gold/20 rounded-2xl p-8">
            <h3 className="text-xl font-bold text-white mb-6 text-center">10 stvari koje ćeš postići</h3>
            <div className="grid sm:grid-cols-2 gap-3">
              {[
                'Preuzeti kontrolu nad novcem — prestati da novac kontrolira tebe',
                'Natjerati novac da radi za tebe kroz pasivne prihode',
                'Eliminirati dugove i početi štedjeti sustavno',
                'Transformirati limitirajuća uvjerenja o bogatstvu',
                'Podići kvalitetu života kroz financijsku slobodu',
                'Naučiti tajne financijskog uspjeha uspješnih ljudi',
                'Osigurati svoju budućnost bez brige za mirovinu',
                'Štedjeti 10-20% prihoda bez osjećaja odricanja',
                'Izaći iz zone komfora i otključati puni potencijal',
                'Postići mir i život bez financijskog stresa',
              ].map((b, i) => (
                <div key={i} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-gold shrink-0 mt-0.5" />
                  <p className="text-white/70 text-sm">{b}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Programme overview */}
          <div className="bg-navy-50 border border-white/10 rounded-2xl p-8 mt-8">
            <h3 className="text-xl font-bold text-white mb-6 text-center">Program u 4 faze</h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { phase: 'Priprema', days: 'Dan 0', color: 'border-gold/30 bg-gold/5', desc: 'Postavljanje temelja — financijska snimka i ciljevi' },
                { phase: 'Faza 1', days: 'Dani 1–30', color: 'border-blue-500/30 bg-blue-500/5', desc: 'Budžetiranje, kontrola troškova i prve uštedine' },
                { phase: 'Faza 2', days: 'Dani 31–60', color: 'border-purple-500/30 bg-purple-500/5', desc: 'Gradnja hitnog fonda i eliminacija dugova' },
                { phase: 'Faza 3', days: 'Dani 61–90', color: 'border-green-500/30 bg-green-500/5', desc: 'Investiranje i dugoročna financijska sloboda' },
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

      {/* About Brane */}
      <section className="py-20 px-4 sm:px-6 bg-navy-50/30">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <div className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden border border-white/10">
                <Image
                  src="/images/brane-portrait.jpg"
                  alt="Brane Recek"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="absolute -bottom-4 -right-4 bg-gold rounded-xl p-4 shadow-xl">
                <p className="text-navy font-black text-2xl">30+</p>
                <p className="text-navy/70 text-xs font-semibold">godina iskustva</p>
              </div>
            </div>
            <div>
              <Badge className="mb-4 bg-gold/10 text-gold border-gold/30">Tvoj financijski mentor</Badge>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
                Bok, ja sam <span className="text-gold">Brane Recek</span>
              </h2>
              <div className="space-y-4 text-white/60 leading-relaxed">
                <p>
                  Više od 30 godina radim u financijama i osiguranju. Ali to nije ono što me je naučilo o novcu — naučio me mentor.
                </p>
                <p>
                  Zvao se Smiljan. Kada sam ga upoznao, bio sam kao većina ljudi — radio sam, zarađivao, ali novac je nekako uvijek nestajao. Imao sam dugove, stres, i osjećaj da financijska sloboda nije za mene.
                </p>
                <p>
                  Smiljan mi je pokazao nešto što me potpuno promijenilo: <strong className="text-white">financijski uspjeh nije stvar koliko zarađuješ — već što radiš s tim novcem.</strong> I da je 80% toga psihologija, ne matematika.
                </p>
                <p>
                  Primjenio sam što me naučio. Eliminirao dugove. Počeo štedjeti. Izgradio pasivne prihode. I danas živim financijsku slobodu o kojoj sam nekad samo sanjao.
                </p>
                <p>
                  Sve što sam naučio — od mentalnih blokada do konkretnih strategija — sada prenosim tebi u ovom 90-dnevnom programu.
                </p>
                <p className="text-gold/80 italic font-medium">
                  "Ne čekaj savršen trenutak. Savršen trenutak je sada." — Napoleon Hill
                </p>
              </div>
              <div className="mt-8 flex items-center gap-4">
                <Image
                  src="/images/podpis.png"
                  alt="Potpis Brane Recek"
                  width={160}
                  height={60}
                  className="opacity-80"
                />
              </div>
              {/* Social proof photos */}
              <div className="mt-6 grid grid-cols-2 gap-3">
                <div className="relative aspect-video rounded-xl overflow-hidden border border-white/10">
                  <Image src="/images/brane-smiljan.jpg" alt="Brane i Smiljan Mori" fill className="object-cover" />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-navy/90 p-2">
                    <p className="text-white text-xs">Sa Smiljanom Morijem</p>
                  </div>
                </div>
                <div className="relative aspect-video rounded-xl overflow-hidden border border-white/10">
                  <Image src="/images/brane-robin-sharma.jpg" alt="Brane i Robin Sharma" fill className="object-cover" />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-navy/90 p-2">
                    <p className="text-white text-xs">Sa Robin Sharmom</p>
                  </div>
                </div>
              </div>
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
            Ako u prvih 30 dana nisi zadovoljan/na programom — iz bilo kojeg razloga — vraćamo ti pun iznos bez pitanja. Nema rizika, nema administracije. Jednostavno nam pišeš i novac je tvoj nazad.
          </p>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-white mb-4">Što kažu polaznici?</h2>
            <p className="text-white/50">Stvarni rezultati stvarnih ljudi.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map(t => (
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
          <h2 className="text-3xl font-bold text-white mb-10 text-center">Često postavljana pitanja</h2>
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
            Pridruži se 500+ polaznika koji su već preuzeli kontrolu nad financijama.
          </p>
          {showLaunchPrice && (
            <div className="mb-6">
              <CountdownTimer expiresAt={countdownExpires!} className="mb-2" />
              <p className="text-gold/60 text-xs">Nakon isteka, cijena raste na €197</p>
            </div>
          )}
          <div className="bg-navy-50 border border-white/10 rounded-2xl p-8">
            <div className="mb-6">
              <p className="text-white/40 line-through">{strikePrice}</p>
              <p className="text-5xl font-black text-gold">{currentPrice}</p>
              <p className="text-white/50 text-sm">
                {showLaunchPrice ? '⚡ Tvoja osobna 24h cijena' : 'Jednokratna uplata · Doživotni pristup'}
              </p>
            </div>
            <Button onClick={handleCheckout} disabled={loading} className="w-full mb-4 text-lg py-4">
              {loading ? 'Učitavam...' : 'Upiši se sada — bez rizika →'}
            </Button>
            <div className="flex items-center justify-center gap-2 text-sm text-white/40 mb-3">
              <Shield className="w-4 h-4 text-green-400" />
              30-dnevna garancija povrata novca
            </div>
            {!showLaunchPrice && (
              <p className="text-white/30 text-xs">
                Kod <span className="text-gold font-mono">PRILIKA</span> = cijena €197 uvijek
              </p>
            )}
            <div className="mt-4 flex flex-wrap justify-center gap-4 text-xs text-white/30">
              <span>✓ Sigurno plaćanje (Stripe)</span>
              <span>✓ Doživotni pristup</span>
              <span>✓ Certifikat</span>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  )
}
