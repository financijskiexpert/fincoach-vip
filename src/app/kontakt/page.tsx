import type { Metadata } from 'next'
import { OrganizationSchema } from '@/components/StructuredData'
import KontaktForm from './KontaktForm'
import SiteFooter from '@/components/SiteFooter'
import Image from 'next/image'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Kontakt — Brane Recek | FinCoach VIP',
  description:
    'Zainteresiran/a za suradnju u osiguranju, mentorstvo ili FinCoach VIP program? Javi mi se — odgovaram u roku 24 sata.',
  openGraph: {
    title: 'Kontakt — Brane Recek | FinCoach VIP',
    description: 'Zainteresiran/a za suradnju u osiguranju ili mentorstvo? Razgovarajmo.',
    url: 'https://fincoach.vip/kontakt',
  },
}

const razlozi = [
  {
    icon: '🤝',
    title: 'Suradnja u osiguranju',
    desc: 'Razmišljaš o karijeri zastopnika? Tražiš mentora s iskustvom? Razgovarajmo bez obaveze.',
  },
  {
    icon: '🎓',
    title: 'Mentorstvo za zastopnike',
    desc: 'Već si u struci ali tražiš strukturu, podršku i rast? Imam program i za to.',
  },
  {
    icon: '💰',
    title: 'Financijsko savjetovanje',
    desc: 'Pitanja o proračunu, štednji, dugu ili investiranju — tu sam.',
  },
  {
    icon: '📚',
    title: 'FinCoach VIP program',
    desc: 'Pitanja o sadržaju, grupnim uvjetima ili partnerskom programu — javi se direktno.',
  },
]

export default function KontaktPage() {
  return (
    <>
      <OrganizationSchema />
      <div className="min-h-screen bg-[#0D1B2A] text-white">
        {/* Header */}
        <div className="border-b border-[#D4AF37]/20">
          <div className="max-w-2xl mx-auto px-6 py-4 flex items-center justify-between">
            <Link href="/">
              <Image src="/logo/fincoach-logo-horizontal.svg" alt="FinCoach VIP" width={160} height={50} priority />
            </Link>
            <Link href="/volim-svoj-novac" className="text-sm font-medium px-4 py-2 rounded-lg bg-[#D4AF37] text-[#0D1B2A]">
              Kupi program
            </Link>
          </div>
        </div>
        <div className="max-w-2xl mx-auto px-6 py-16">

          <div className="mb-10">
            <p className="text-[#D4AF37] text-sm font-semibold uppercase tracking-widest mb-3">Kontakt</p>
            <h1 className="text-4xl font-black mb-4">Razgovarajmo.</h1>
            <p className="text-white/60 text-lg leading-relaxed">
              S <strong className="text-white">30+ godina iskustva</strong> u financijskom savjetništvu
              i osiguranju, danas pomažem i onima koji žele izgraditi vlastitu karijeru u ovom
              području ili preuzeti kontrolu nad svojim financijama.
            </p>
          </div>

          <div className="grid gap-4 mb-10">
            {razlozi.map(item => (
              <div
                key={item.icon}
                className="flex gap-4 bg-white/5 border border-white/10 rounded-xl p-5"
              >
                <span className="text-2xl shrink-0">{item.icon}</span>
                <div>
                  <p className="font-semibold text-white mb-1">{item.title}</p>
                  <p className="text-white/50 text-sm">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white/5 border border-[#D4AF37]/30 rounded-2xl p-8">
            <h2 className="text-xl font-bold mb-6">Pošalji poruku</h2>
            <KontaktForm />
          </div>

          <div className="mt-8 text-center text-white/30 text-sm">
            <p>Odgovaram unutar 24 sata na radne dane.</p>
            <p className="mt-1">
              Email:{' '}
              <a href="mailto:brane@fincoach.vip" className="text-[#D4AF37] hover:underline">
                brane@fincoach.vip
              </a>
            </p>
          </div>
        </div>
        <SiteFooter />
      </div>
    </>
  )
}
