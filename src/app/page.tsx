'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { TrendingDown, PiggyBank, Frown, BookOpen, Video, Award, Star, ChevronRight } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import PdfBookMockup from '@/components/PdfBookMockup'
import SiteFooter from '@/components/SiteFooter'

export default function LandingPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [marketingConsent, setMarketingConsent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email || !name) {
      toast.error('Molimo unesite ime i email adresu.')
      return
    }
    if (!marketingConsent) {
      toast.error('Za primanje vodiča potrebna je suglasnost za primanje emailova.')
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, full_name: name, source: 'landing', marketing_consent: marketingConsent }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || `HTTP ${res.status}`)
      }
      setSubmitted(true)
      toast.success('Vodič je na putu! Provjeri svoju email pristiglu poštu.')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Nešto je pošlo po krivu. Pokušaj ponovo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-navy">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-navy/95 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <Image src="/logo/fincoach-logo-horizontal.svg" alt="FinCoach VIP" width={150} height={47} priority />
          </Link>
          <Link href="/tecaj">
            <Button size="sm" variant="outline">
              Pogledaj tečaj →
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-24 pb-20 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-gold/10 border border-gold/20 rounded-full px-4 py-1.5 text-gold text-sm font-medium mb-8">
            <Star className="w-3.5 h-3.5" />
            Besplatni vodič — ograničena dostupnost
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight mb-6">
            Preuzmi besplatni vodič koji je pomogao{' '}
            <span className="text-gold">stotinama ljudi</span> preuzeti kontrolu nad financijama
          </h1>

          <p className="text-xl text-white/60 mb-8 max-w-2xl mx-auto leading-relaxed">
            Konkretni savjeti i tehnike koje možeš primijeniti već danas — bez financijskog znanja, bez složenih aplikacija.
          </p>

          {/* 3D PDF book mockup */}
          <div className="mb-8">
            <PdfBookMockup />
            <p className="text-white/40 text-sm mt-3">
              <span className="text-gold font-semibold">Besplatno</span> · PDF vodič · Brane Recek
            </p>
          </div>

          {submitted ? (
            <div className="max-w-md mx-auto bg-green-500/10 border border-green-500/30 rounded-2xl p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Vodič je na putu!</h3>
              <p className="text-white/60">Provjeri svoju email pristiglu poštu (i spam folder) za nekoliko minuta.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="max-w-md mx-auto">
              <div className="bg-navy-50 border border-white/10 rounded-2xl p-6 space-y-4">
                <Input
                  placeholder="Tvoje ime"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                  className="text-base"
                />
                <Input
                  type="email"
                  placeholder="Tvoja email adresa"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  className="text-base"
                />
                <Button type="submit" size="lg" loading={loading} className="w-full text-base">
                  Pošalji mi vodič besplatno →
                </Button>

                {/* GDPR marketing consent — privzeto neoznačeno */}
                <label className="flex items-start gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={marketingConsent}
                    onChange={e => setMarketingConsent(e.target.checked)}
                    className="mt-0.5 w-4 h-4 shrink-0 accent-[#D4AF37] cursor-pointer"
                  />
                  <span className="text-xs text-white/50 group-hover:text-white/70 transition-colors leading-relaxed">
                    <span className="text-gold">*</span> Slažem se s primanjem besplatnog vodiča i edukativnih savjeta od FinCoach VIP na navedenu email adresu. Možeš se odjaviti u bilo trenutku.
                  </span>
                </label>

                <p className="text-xs text-white/25 text-center">
                  Slanjem forme prihvaćaš naše{' '}
                  <Link href="/uvjetiposlovanja" className="underline hover:text-white/50">Uvjete poslovanja</Link>
                  {' '}i{' '}
                  <Link href="/politikaprivatnosti" className="underline hover:text-white/50">Politiku privatnosti</Link>.
                  {' '}Vodič šaljemo samo na navedenu email adresu.
                </p>
              </div>
            </form>
          )}
        </div>
      </section>

      {/* Social proof strip */}
      <div className="border-y border-white/5 bg-white/2 py-8 px-4">
        <div className="max-w-4xl mx-auto flex flex-wrap justify-center items-center gap-8 text-center">
          {[
            { number: '500+', label: 'Polaznika' },
            { number: '4.9/5', label: 'Prosječna ocjena' },
            { number: '90', label: 'Dana programa' },
            { number: '100%', label: 'Garancija povrata' },
          ].map(stat => (
            <div key={stat.label}>
              <p className="text-3xl font-black text-gold">{stat.number}</p>
              <p className="text-sm text-white/50 mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Problem Section */}
      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Prepoznaješ li se u ovome?
            </h2>
            <p className="text-white/50 text-lg">Većina nas se suočava s istim problemima.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: TrendingDown,
                title: 'Novac "nestaje" do kraja mjeseca',
                desc: 'Zarađuješ pristojno, ali nikad ne znaš gdje novac odlazi. Krajem mjeseca uvijek nešto nedostaje.',
              },
              {
                icon: PiggyBank,
                title: 'Štednja koja ne funkcionira',
                desc: 'Svaki tjedan si kažeš "od sljedećeg mjeseca počnem štediti". Taj dan nikad ne dođe.',
              },
              {
                icon: Frown,
                title: 'Stres zbog financija',
                desc: 'Neočekivani troškovi te potpuno izbacuju iz takta. Financijska nesigurnost utječe na sve aspekte života.',
              },
            ].map(item => (
              <div key={item.title} className="bg-navy-50 border border-white/10 rounded-2xl p-6">
                <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-4">
                  <item.icon className="w-6 h-6 text-red-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About the guide */}
      <section className="py-20 px-4 sm:px-6 bg-navy-50/50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Što dobivaš u vodiču?
            </h2>
            <p className="text-white/50 text-lg">Praktičan, odmah primjenjiv sadržaj.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: BookOpen,
                title: 'Korak 1: Financijska snimka',
                desc: 'Jednostavna metoda za mapiranje svih prihoda i rashoda u manje od 30 minuta.',
              },
              {
                icon: Video,
                title: 'Korak 2: 50/30/20 formula',
                desc: 'Provjerenoj formuli koja automatski raspoređuje tvoj novac na potrebe, želje i štednju.',
              },
              {
                icon: Award,
                title: 'Korak 3: Automatska štednja',
                desc: 'Postavi sustav koji štedi novac umjesto tebe — bez volje, bez napora.',
              },
            ].map(item => (
              <div key={item.title} className="bg-navy border border-gold/20 rounded-2xl p-6">
                <div className="w-12 h-12 rounded-xl bg-gold/10 border border-gold/30 flex items-center justify-center mb-4">
                  <item.icon className="w-6 h-6 text-gold" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Brane */}
      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="w-full max-w-sm mx-auto rounded-2xl overflow-hidden border border-white/10">
                <Image
                  src="/images/brane-portrait.jpg"
                  alt="Brane Recek — FinCoach VIP"
                  width={480}
                  height={480}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div>
              <Badge className="mb-4 bg-gold/10 text-gold border-gold/30">Tvoj financijski coach</Badge>
              <h2 className="text-3xl font-bold text-white mb-4">Bok, ja sam Brane</h2>
              <p className="text-white/60 leading-relaxed mb-4">
                Financijama se bavim već više od 10 godina. Prošao sam kroz sve — od dugova i financijskog stresa do potpune financijske slobode.
              </p>
              <p className="text-white/60 leading-relaxed mb-6">
                Pomogao sam stotinama ljudi transformirati odnos prema novcu. Ne kroz složene teorije, već kroz konkretne, svakodnevne navike.
              </p>
              <div className="flex gap-6">
                <div>
                  <p className="text-2xl font-bold text-gold">10+</p>
                  <p className="text-sm text-white/40">Godina iskustva</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gold">500+</p>
                  <p className="text-sm text-white/40">Polaznika</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 sm:px-6 bg-navy-50/30">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-white mb-4">Što kažu polaznici?</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: 'Marija K.',
                role: 'Učiteljica, Split',
                text: 'Za 3 mjeseca sam uspjela uštedjeti više nego za cijelu prethodnu godinu. Ovo stvarno funkcionira!',
                stars: 5,
              },
              {
                name: 'Ivan P.',
                role: 'Poduzetnik, Zagreb',
                text: 'Mislio sam da znam sve o novcu, ali Braneov pristup mi je potpuno promijenio perspektivu.',
                stars: 5,
              },
              {
                name: 'Ana M.',
                role: 'Marketing menadžerica, Rijeka',
                text: 'Konačno nemam stres na kraju mjeseca. Preporučujem svima koji osjećaju da im novac "curi".',
                stars: 5,
              },
            ].map(t => (
              <div key={t.name} className="bg-navy border border-white/10 rounded-2xl p-6">
                <div className="flex gap-0.5 mb-4">
                  {Array(t.stars).fill(0).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-gold text-gold" />
                  ))}
                </div>
                <p className="text-white/70 text-sm leading-relaxed mb-4 italic">&ldquo;{t.text}&rdquo;</p>
                <div>
                  <p className="text-white font-semibold text-sm">{t.name}</p>
                  <p className="text-white/40 text-xs">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Spreman/na za promjenu?
          </h2>
          <p className="text-white/50 mb-8 text-lg">
            Preuzmi besplatni vodič i napravi prvi korak prema financijskoj slobodi.
          </p>
          {!submitted && (
            <form onSubmit={handleSubmit} className="max-w-md mx-auto">
              <div className="bg-navy-50 border border-white/10 rounded-2xl p-6 space-y-4">
                <Input
                  placeholder="Tvoje ime"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                />
                <Input
                  type="email"
                  placeholder="Tvoja email adresa"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
                <Button type="submit" size="lg" loading={loading} className="w-full">
                  Pošalji mi vodič besplatno →
                </Button>

                <label className="flex items-start gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={marketingConsent}
                    onChange={e => setMarketingConsent(e.target.checked)}
                    className="mt-0.5 w-4 h-4 shrink-0 accent-[#D4AF37] cursor-pointer"
                  />
                  <span className="text-xs text-white/50 group-hover:text-white/70 transition-colors leading-relaxed">
                    <span className="text-gold">*</span> Slažem se s primanjem besplatnog vodiča i edukativnih savjeta od FinCoach VIP na navedenu email adresu. Možeš se odjaviti u bilo trenutku.
                  </span>
                </label>

                <p className="text-xs text-white/25 text-center">
                  Slanjem forme prihvaćaš naše{' '}
                  <Link href="/uvjetiposlovanja" className="underline hover:text-white/50">Uvjete poslovanja</Link>
                  {' '}i{' '}
                  <Link href="/politikaprivatnosti" className="underline hover:text-white/50">Politiku privatnosti</Link>.
                </p>
              </div>
            </form>
          )}
          <p className="mt-6 text-white/30 text-sm">
            Ili{' '}
            <Link href="/tecaj" className="text-gold hover:underline">
              odmah pogledaj kompletan tečaj →
            </Link>
          </p>
        </div>
      </section>

      <SiteFooter />
    </div>
  )
}