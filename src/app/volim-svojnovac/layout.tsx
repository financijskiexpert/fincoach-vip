import type { Metadata } from 'next'
import { CourseSchema, FAQSchema, BreadcrumbSchema } from '@/components/StructuredData'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://fincoach.vip'

export const metadata: Metadata = {
  title: 'Volim Svoj Novac — 90-dnevni financijski program | FinCoach VIP',
  description: 'Preuzmi kontrolu nad svojim novcem za 90 dana. 90 video lekcija, korak po korak. Bez složenih teorija — samo konkretni, odmah primjenjivi koraci. 500+ polaznika, 4.9/5 ocjena.',
  keywords: ['financijska sloboda', 'osobne financije', 'volim svoj novac', 'štednja', 'investiranje', 'mindset o novcu', 'fincoach', 'brane recek', '90 dana program'],
  alternates: { canonical: `${SITE_URL}/volim-svojnovac` },
  openGraph: {
    title: 'Volim Svoj Novac — 90-dnevni financijski program',
    description: '90 video lekcija koje mijenjaju vaš odnos prema novcu. Doživotni pristup, 30-dnevna garancija povrata.',
    url: `${SITE_URL}/volim-svojnovac`,
    type: 'website',
    locale: 'hr_HR',
    images: [{ url: `${SITE_URL}/og-image.jpg`, width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Volim Svoj Novac — 90-dnevni financijski program',
    description: '90 video lekcija. 500+ polaznika. 4.9/5 ocjena.',
    images: [`${SITE_URL}/og-image.jpg`],
  },
}

const FAQS = [
  { q: 'Je li program za početnike?', a: 'Da, apsolutno. Dizajniran je za sve bez prethodnog financijskog znanja — jednostavan jezik, konkretni primjeri.' },
  { q: 'Koliko vremena mi treba svaki dan?', a: 'Između 5 i 10 minuta po lekciji. Program staje u svakodnevni raspored.' },
  { q: 'Na čemu je fokus programa?', a: '80% psihologija i mindset o novcu, 20% matematika i praktične tehnike.' },
  { q: 'Što ako nisam zadovoljan?', a: '30-dnevna garancija povrata novca bez pitanja. Vraćamo pun iznos.' },
  { q: 'Koliko dugo imam pristup?', a: 'Doživotni pristup uključujući sve buduće nadopune programa.' },
  { q: 'Dobivam li certifikat?', a: 'Da — personaliziran certifikat o završetku po dovršetku svih 90 dana.' },
  { q: 'Mogu li koristiti kod PRILIKA?', a: 'Da — kod daje cijenu €197 umjesto €397, bez vremenskog ograničenja. Ne kombinira se s affiliate popustom.' },
]

export default function CourseLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <CourseSchema />
      <FAQSchema faqs={FAQS} />
      <BreadcrumbSchema items={[
        { name: 'Početna', url: SITE_URL },
        { name: 'Volim Svoj Novac', url: `${SITE_URL}/volim-svojnovac` },
      ]} />
      {children}
    </>
  )
}
