import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import SiteFooter from '@/components/SiteFooter'
import {
  CheckCircle,
  Star,
  Users,
  Calendar,
  MessageCircle,
  Shield,
  ArrowRight,
  Clock,
  Target,
  TrendingUp,
  Zap,
} from 'lucide-react'

export const metadata = {
  title: 'VIP Mentorstvo — FinCoach | Osobni financijski coaching',
  description: 'Ekskluzivni 1-na-1 i grupni coaching s Branetom Rečekom. Ograničen broj mjesta. Rezultati u 90 dana ili vraćamo novac.',
}

const MASTERMIND_FEATURES = [
  { icon: Users, text: 'Mala grupa max. 8 polaznika — osobna pažnja svakome' },
  { icon: Calendar, text: 'Tjedno grupno Zoom pozivanje (90 min) s Branetom' },
  { icon: Target, text: '1-na-1 kick-off poziv (45 min) za personalizirani plan' },
  { icon: MessageCircle, text: 'Privatni WhatsApp chat za pitanja između sesija' },
  { icon: CheckCircle, text: 'Sve materijale iz tečaja + ekskluzivne predloške' },
  { icon: TrendingUp, text: 'Tjedna accountability — mjerite napredak zajedno' },
  { icon: Shield, text: 'Financijsko jamstvo: ako nema napretka, vraćamo novac' },
]

const ONE_ON_ONE_FEATURES = [
  { icon: Calendar, text: '12 bi-tjedno 1-na-1 pozivanje (60 min svaki) — 6 mjeseci' },
  { icon: Target, text: 'Potpuno personalizirani financijski plan za tvoju situaciju' },
  { icon: MessageCircle, text: 'Direktan WhatsApp pristup Branetu — odgovor u 24h' },
  { icon: Zap, text: 'Hitna sesija (u roku 48h) kada zatreba — bez doplate' },
  { icon: CheckCircle, text: 'Sve materijale + prioritetno recenziranje tvojih dokumenata' },
  { icon: TrendingUp, text: 'Praćenje investicijskog portfelja — konkretne preporuke' },
  { icon: Shield, text: 'Jamstvo: ako nisi zadovoljan nakon prvih 30 dana — puni povrat' },
]

const TESTIMONIALS = [
  {
    name: 'Maja S.',
    role: 'Direktorica, Zagreb',
    quote: 'Grupni coaching je promijenio sve. Za 4 mjeseca eliminirala sam dug koji sam nosila 5 godina i počela investirati. Braneov pristup je daleko od svega što sam dosad čitala.',
    stars: 5,
    result: 'Eliminirala dug 5 godina, počela investirati',
  },
  {
    name: 'Darko V.',
    role: 'Poduzetnik, Ljubljana',
    quote: '1-na-1 coaching s Branetom je bio odluka koja mi je promijenila budućnost. Konkretno. Mjerljivo. Bez floskula. Prvih 3 tjedna sam shvatio da sam ostavljao 20.000€ godišnje "na stolu".',
    stars: 5,
    result: 'Otkrio 20.000€ godišnjih uštedina',
  },
  {
    name: 'Ana M.',
    role: 'Liječnica, Split',
    quote: 'Kao doktor imam dobar prihod ali nikad nisam znala kamo odlazi. Brane mi je u prvom pozivu pokazao greške koje sam ponavljala godinama. Potpuno drugačiji pristup od knjiga.',
    stars: 5,
    result: 'Finančni red iz kaosa za 60 dana',
  },
]

export default function VipPage() {
  return (
    <div className="min-h-screen bg-navy">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-navy/95 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/">
            <Image src="/logo/fincoach-logo-horizontal.svg" alt="FinCoach VIP" width={130} height={41} priority />
          </Link>
          <Link href="/volim-svojnovac">
            <Button size="sm" variant="outline">Pogledaj tečaj →</Button>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-gold/10 border border-gold/20 rounded-full px-4 py-1.5 text-gold text-sm font-medium mb-8">
            <Shield className="w-3.5 h-3.5" />
            Ograničen broj mjesta — max. 3 slobodna mjesta u ovoj rundi
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight mb-6">
            Prestani čitati knjige.<br />
            <span className="text-gold">Počni živjeti rezultate.</span>
          </h1>

          <p className="text-xl text-white/60 max-w-2xl mx-auto mb-10 leading-relaxed">
            Grupni coaching ili ekskluzivni 1-na-1 mentorstvo s Branetom Rečekom — personalizirani plan,
            konkretna akcija i financijska sloboda za 90 dana.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#mastermind">
              <Button size="lg" className="gap-2 w-full sm:w-auto">
                VIP Mastermind (997€) <ArrowRight className="w-4 h-4" />
              </Button>
            </a>
            <a href="#jedan-na-jedan">
              <Button size="lg" variant="outline" className="gap-2 w-full sm:w-auto">
                1-na-1 Coaching (1997€) <ArrowRight className="w-4 h-4" />
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Problem section */}
      <section className="py-16 px-4 sm:px-6 bg-navy-50/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-white text-center mb-12">
            Prepoznaješ li se u ovome?
          </h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {[
              { emoji: '📚', text: 'Pročitao/la si 5+ knjiga o financijama — i dalje ništa ne mijenjaš' },
              { emoji: '🔄', text: 'Svaki januar kažeš "ove godine ću početi štediti" — i opet zaboraviš do februara' },
              { emoji: '💸', text: 'Imaš OK prihod ali nikad nema ničega na kraju mjeseca — a ne znaš kamo ide' },
              { emoji: '😰', text: 'Osjećaš anksioznost kad pomisliš na mirovinu ili hitne situacije' },
              { emoji: '📉', text: 'Čuješ o investiranju ali ne znaš odakle početi — i plašiš se napraviti grešku' },
              { emoji: '🤦', text: 'Pokušao/la si sam/sama — i opustio/la se nakon tjedan dana' },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-4 bg-navy border border-white/10 rounded-xl p-5">
                <span className="text-2xl leading-none">{item.emoji}</span>
                <p className="text-white/60 text-sm leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
          <p className="text-center text-white/40 text-sm mt-8">
            Problem nije znanje — knjiga ima dovoljno. Problem je implementacija i accountability.
            <span className="text-white/60"> To je točno ono što coaching rješava.</span>
          </p>
        </div>
      </section>

      {/* About Brane */}
      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-navy border border-white/10 rounded-2xl p-8 lg:p-12">
            <div className="grid md:grid-cols-2 gap-10 items-center">
              <div>
                <p className="text-gold text-sm font-semibold uppercase tracking-wider mb-4">Tvoj mentor</p>
                <h2 className="text-2xl sm:text-3xl font-black text-white mb-4">Brane Reček</h2>
                <p className="text-white/60 leading-relaxed mb-4">
                  Financijski coach i osnivač FinCoach VIP platforma. U zadnjih 5 godina pomagao je stotinama
                  ljudi iz regije da preuzmu kontrolu nad financijama — bez compliciranih teorija,
                  samo konkretni sustavi koji rade.
                </p>
                <p className="text-white/60 leading-relaxed mb-6">
                  Pristup: kombinacija psihologije novca (Goldsmith, Housel), sustava ponašanja (Clear)
                  i praktičnih financijskih strategija za naše tržište.
                </p>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { number: '500+', label: 'Polaznika' },
                    { number: '5 god.', label: 'Iskustva' },
                    { number: '4.9★', label: 'Ocjena' },
                  ].map((s, i) => (
                    <div key={i} className="text-center">
                      <p className="text-2xl font-black text-gold">{s.number}</p>
                      <p className="text-white/40 text-xs">{s.label}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                <p className="text-white/40 text-xs uppercase tracking-wider mb-4">Metodologija</p>
                {[
                  { author: 'James Clear', book: 'Atomic Habits', topic: 'Sustavi ponašanja i financijske navike' },
                  { author: 'Morgan Housel', book: 'Psychology of Money', topic: 'Mindset i dugoročno razmišljanje' },
                  { author: 'Ramit Sethi', book: 'I Will Teach You To Be Rich', topic: 'Automatizacija i svjesna potrošnja' },
                  { author: 'Marshall Goldsmith', book: 'Triggers', topic: 'Promjena ponašanja i accountability' },
                ].map((m, i) => (
                  <div key={i} className={`pb-4 mb-4 ${i < 3 ? 'border-b border-white/5' : ''}`}>
                    <p className="text-white text-sm font-medium">{m.author} — <span className="text-gold/70">{m.book}</span></p>
                    <p className="text-white/40 text-xs mt-0.5">{m.topic}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* VIP Mastermind */}
      <section id="mastermind" className="py-20 px-4 sm:px-6 bg-navy-50/30 scroll-mt-20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-gold/10 border border-gold/20 rounded-full px-4 py-1.5 text-gold text-sm font-medium mb-4">
              <Users className="w-3.5 h-3.5" />
              Grupni coaching — max. 8 mjesta
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">VIP Mastermind</h2>
            <p className="text-white/50 max-w-xl mx-auto">
              90 dana intenzivnog grupnog rada. Tjedne sesije, accountability, zajednica —
              i osobni plan koji se mijenja s tvojim napretkom.
            </p>
          </div>

          <div className="bg-navy border border-gold/20 rounded-2xl overflow-hidden">
            <div className="p-8 lg:p-10">
              <div className="grid sm:grid-cols-2 gap-5 mb-10">
                {MASTERMIND_FEATURES.map((f, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gold/10 flex items-center justify-center shrink-0">
                      <f.icon className="w-4 h-4 text-gold" />
                    </div>
                    <p className="text-white/70 text-sm leading-relaxed pt-1">{f.text}</p>
                  </div>
                ))}
              </div>

              {/* Pricing */}
              <div className="border-t border-white/10 pt-8">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                  <div>
                    <div className="flex items-baseline gap-3 mb-1">
                      <span className="text-white/30 line-through text-lg">1.497€</span>
                      <span className="text-4xl font-black text-gold">997€</span>
                    </div>
                    <p className="text-white/40 text-sm">ili 3 × 349€ (bez kamata)</p>
                    <div className="flex items-center gap-2 mt-3">
                      <Clock className="w-4 h-4 text-white/30" />
                      <p className="text-white/40 text-xs">Sljedeća runda počinje u rujnu 2025.</p>
                    </div>
                  </div>
                  <a
                    href="mailto:brane.recek@gmail.com?subject=VIP%20Mastermind%20-%20prijava&body=Pozdrav%20Brane%2C%20zainteresiran%2Fa%20sam%20za%20VIP%20Mastermind%20program."
                    className="shrink-0"
                  >
                    <Button size="lg" className="gap-2 w-full sm:w-auto">
                      Zatraži slobodno mjesto <ArrowRight className="w-4 h-4" />
                    </Button>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 1-na-1 Coaching */}
      <section id="jedan-na-jedan" className="py-20 px-4 sm:px-6 scroll-mt-20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 text-white/60 text-sm font-medium mb-4">
              <Star className="w-3.5 h-3.5 text-gold" />
              Premium — maksimalno 3 mjesta istovremeno
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">Ekskluzivni 1-na-1 Coaching</h2>
            <p className="text-white/50 max-w-xl mx-auto">
              6 mjeseci direktnog rada s Branetom. Potpuno personalizirano — tvoja situacija,
              tvoji ciljevi, tvoje rješenje.
            </p>
          </div>

          <div className="bg-navy border border-white/15 rounded-2xl overflow-hidden">
            <div className="p-8 lg:p-10">
              <div className="grid sm:grid-cols-2 gap-5 mb-10">
                {ONE_ON_ONE_FEATURES.map((f, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                      <f.icon className="w-4 h-4 text-gold" />
                    </div>
                    <p className="text-white/70 text-sm leading-relaxed pt-1">{f.text}</p>
                  </div>
                ))}
              </div>

              {/* Pricing */}
              <div className="border-t border-white/10 pt-8">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                  <div>
                    <div className="flex items-baseline gap-3 mb-1">
                      <span className="text-4xl font-black text-white">1.997€</span>
                    </div>
                    <p className="text-white/40 text-sm">ili 4 × 524€ — 6 mjeseci intenzivnog rada</p>
                    <div className="flex items-center gap-2 mt-3">
                      <Shield className="w-4 h-4 text-white/30" />
                      <p className="text-white/40 text-xs">30-dnevno jamstvo — nije za tebe? Vraćamo puni iznos.</p>
                    </div>
                  </div>
                  <a
                    href="mailto:brane.recek@gmail.com?subject=1-na-1%20Coaching%20-%20prijava&body=Pozdrav%20Brane%2C%20zainteresiran%2Fa%20sam%20za%201-na-1%20coaching%20program."
                    className="shrink-0"
                  >
                    <Button size="lg" variant="outline" className="gap-2 w-full sm:w-auto border-gold/30 text-gold hover:bg-gold/10">
                      Zatraži razgovor <ArrowRight className="w-4 h-4" />
                    </Button>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 sm:px-6 bg-navy-50/30">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-white text-center mb-12">
            Rezultati polaznika
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="bg-navy border border-white/10 rounded-2xl p-6 flex flex-col">
                <div className="flex gap-0.5 mb-4">
                  {Array(t.stars).fill(0).map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-gold text-gold" />
                  ))}
                </div>
                <p className="text-white/60 text-sm leading-relaxed italic flex-1 mb-4">&ldquo;{t.quote}&rdquo;</p>
                <div className="border-t border-white/5 pt-4">
                  <p className="text-white font-semibold text-sm">{t.name}</p>
                  <p className="text-white/40 text-xs mt-0.5">{t.role}</p>
                  <div className="mt-2 inline-flex items-center gap-1.5 bg-gold/10 rounded-full px-2.5 py-1">
                    <TrendingUp className="w-3 h-3 text-gold" />
                    <span className="text-gold text-xs font-medium">{t.result}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-white text-center mb-12">Česta pitanja</h2>
          <div className="space-y-4">
            {[
              {
                q: 'Nisam siguran/na jesam li "dovoljno spreman/na" za VIP coaching.',
                a: 'Savršen trenutak ne postoji. Coaching je upravo za one koji ne znaju odakle početi — zajedno definiramo polaznu točku i korak po korak idemo naprijed. Tvoja situacija je tvoja prednost, ne prepreka.',
              },
              {
                q: 'Koliko vremena trebam izdvojiti tjedno?',
                a: 'Mastermind: ~2-3 sata tjedno (sesija + implementacija). 1-na-1: ~1 sat tjedno (poziv + zadaci). Radi se o investiciji koja štedi desetke sati godišnje koje trenutno trošiš na financijski stres.',
              },
              {
                q: 'Što ako ne vidim rezultate?',
                a: 'Za Mastermind: ako nakon 90 dana nisi napravio/la mjerljiv napredak (definiran na prvom pozivu), vraćamo 50% iznosa. Za 1-na-1: puni povrat ako nisi zadovoljan/na u prvih 30 dana — bez pitanja.',
              },
              {
                q: 'Je li dostupno na rate?',
                a: 'Da. Mastermind: 3 × 349€ (mesečno). 1-na-1: 4 × 524€ (kvartalno). Plaćanje karticom putem Stripe platforme — sigurno i jednostavno.',
              },
              {
                q: 'Kako izgleda prvi korak?',
                a: 'Pošalji email na brane.recek@gmail.com s kratkim opisom tvoje situacije. Odgovoriti ćemo u roku 24h i dogovoriti besplatni 20-minutni upoznavajući poziv da vidimo je li coaching pravi fit za tebe.',
              },
            ].map((faq, i) => (
              <div key={i} className="bg-navy border border-white/10 rounded-xl p-6">
                <p className="text-white font-semibold mb-2">{faq.q}</p>
                <p className="text-white/50 text-sm leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4 sm:px-6 bg-navy-50/30">
        <div className="max-w-2xl mx-auto text-center">
          <div className="w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-6">
            <Star className="w-8 h-8 text-gold" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
            Samo 3 slobodna mjesta
          </h2>
          <p className="text-white/50 text-lg mb-8 leading-relaxed">
            Coaching je osoban posao. Ne prihvaćam više od 3 nova klijenta istovremeno.
            Ako tražiš slobodno mjesto — javi se danas.
          </p>
          <a href="mailto:brane.recek@gmail.com?subject=VIP%20Coaching%20-%20upit&body=Pozdrav%20Brane%2C%20zainteresiran%2Fa%20sam%20za%20VIP%20coaching.%20Moja%20situacija%3A%20">
            <Button size="lg" className="gap-2 bg-gold hover:bg-gold/90 text-navy font-bold text-base px-8">
              Zatraži slobodno mjesto <ArrowRight className="w-5 h-5" />
            </Button>
          </a>
          <p className="text-white/30 text-sm mt-4">
            Odgovaramo u roku 24h · Besplatni uvodni poziv · Bez obaveza
          </p>
        </div>
      </section>

      <SiteFooter />
    </div>
  )
}
