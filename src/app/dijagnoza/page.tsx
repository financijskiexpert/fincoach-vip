'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

type Tip = 'hedonist' | 'branic' | 'vrtlog' | 'teoreticar'

const QUESTIONS: { question: string; options: { label: string; tip: Tip }[] }[] = [
  {
    question: 'Kad pomisliš na svoje financije, kako se osjećaš?',
    options: [
      { label: 'Frustrirano — uvijek nedostaje novca', tip: 'hedonist' },
      { label: 'Tjeskobno — bojim se da ću ostati bez svega', tip: 'branic' },
      { label: 'Preplavljeno — imam planove, ali ne znam odakle početi', tip: 'vrtlog' },
      { label: 'Zbunjeno — znam teoriju, ali u praksi ne funkcionira', tip: 'teoreticar' },
    ],
  },
  {
    question: 'Tvoja štednja trenutno izgleda ovako...',
    options: [
      { label: 'Kakva štednja? Potrošim sve što zaradim', tip: 'hedonist' },
      { label: 'Imam je, ali je rijetko diram — previše me je strah', tip: 'branic' },
      { label: 'Uvijek planiram početi, ali "od sljedećeg mjeseca"', tip: 'vrtlog' },
      { label: 'Znam kako bi trebalo izgledati — samo to ne radim', tip: 'teoreticar' },
    ],
  },
  {
    question: 'Što te najviše blokira na putu do financijske slobode?',
    options: [
      { label: 'Ne mogu prestati trošiti na stvari koje me vesele', tip: 'hedonist' },
      { label: 'Strah od gubitka — radije ne diram novac', tip: 'branic' },
      { label: 'Uvijek nešto ometa, nikad pravo vrijeme', tip: 'vrtlog' },
      { label: 'Previše informacija — ne znam što točno primijeniti', tip: 'teoreticar' },
    ],
  },
  {
    question: 'Kad dobiješ neočekivan novac, što se dogodi?',
    options: [
      { label: 'Potrošim — zaslužio/la sam se nagraditi!', tip: 'hedonist' },
      { label: 'Stavim na račun i ne diram ga godinama', tip: 'branic' },
      { label: 'Imam "veliki plan", ali na kraju nekako nestane', tip: 'vrtlog' },
      { label: 'Tjednima istražujem opcije i na kraju ne učinim ništa', tip: 'teoreticar' },
    ],
  },
  {
    question: 'Kad bi sutra imao/la 500€ više, što bi se točno dogodilo s tim novcem?',
    options: [
      { label: 'Iskreno? Nestalo bi do kraja mjeseca', tip: 'hedonist' },
      { label: 'Završilo bi na računu — ne bih ni znao/la za što ga potrošiti', tip: 'branic' },
      { label: 'Konačno bih počeo/la s planom koji imam u glavi', tip: 'vrtlog' },
      { label: 'Kupio/la bih još jednu financijsku knjigu 😄', tip: 'teoreticar' },
    ],
  },
]

function calculateTip(answers: Tip[]): Tip {
  const counts: Record<Tip, number> = { hedonist: 0, branic: 0, vrtlog: 0, teoreticar: 0 }
  for (const a of answers) counts[a]++
  const max = Math.max(...Object.values(counts))
  const tied = (Object.keys(counts) as Tip[]).filter(k => counts[k] === max)
  if (tied.length === 1) return tied[0]
  // tiebreaker: first answer wins
  return answers[0]
}

export default function DijagnozaPage() {
  const router = useRouter()
  const [current, setCurrent] = useState(0)
  const [answers, setAnswers] = useState<Tip[]>([])
  const [selected, setSelected] = useState<Tip | null>(null)
  const [animating, setAnimating] = useState(false)

  const q = QUESTIONS[current]
  const progressPct = (current / QUESTIONS.length) * 100

  function handleSelect(tip: Tip) {
    if (animating) return
    setSelected(tip)
    setAnimating(true)

    setTimeout(() => {
      const newAnswers = [...answers, tip]
      if (current < QUESTIONS.length - 1) {
        setAnswers(newAnswers)
        setCurrent(c => c + 1)
        setSelected(null)
        setAnimating(false)
      } else {
        const result = calculateTip(newAnswers)
        router.push(`/dijagnoza/rezultat?tip=${result}`)
      }
    }, 450)
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0D1B2A' }}>
      <nav
        className="fixed top-0 left-0 right-0 z-50"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', backgroundColor: 'rgba(13,27,42,0.95)', backdropFilter: 'blur(8px)' }}
      >
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/">
            <Image src="/logo/fincoach-logo-horizontal.svg" alt="FinCoach VIP" width={120} height={38} priority />
          </Link>
          <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'rgba(212,175,55,0.6)' }}>
            Financijska dijagnoza
          </span>
        </div>
      </nav>

      {/* Progress bar */}
      <div className="fixed top-14 left-0 right-0 z-40" style={{ height: 3, backgroundColor: 'rgba(255,255,255,0.06)' }}>
        <div
          style={{
            height: '100%',
            width: `${progressPct}%`,
            backgroundColor: '#D4AF37',
            transition: 'width 0.4s ease',
          }}
        />
      </div>

      <div className="min-h-screen flex flex-col items-center justify-center px-4" style={{ paddingTop: 72, paddingBottom: 48 }}>
        <div className="w-full max-w-lg">
          <p className="text-center text-sm font-semibold mb-8" style={{ color: 'rgba(212,175,55,0.7)' }}>
            {current + 1} / {QUESTIONS.length}
          </p>

          <h2
            className="text-2xl md:text-3xl font-bold text-center leading-snug mb-10"
            style={{ color: '#fff' }}
          >
            {q.question}
          </h2>

          <div className="flex flex-col gap-3">
            {q.options.map((opt) => (
              <button
                key={opt.tip}
                onClick={() => handleSelect(opt.tip)}
                disabled={animating}
                className="w-full text-left rounded-xl px-5 py-4 font-medium transition-all duration-200"
                style={{
                  backgroundColor: selected === opt.tip ? 'rgba(212,175,55,0.18)' : 'rgba(255,255,255,0.05)',
                  border: selected === opt.tip ? '1px solid rgba(212,175,55,0.65)' : '1px solid rgba(255,255,255,0.1)',
                  color: selected === opt.tip ? '#D4AF37' : 'rgba(255,255,255,0.82)',
                  transform: selected === opt.tip ? 'scale(1.015)' : 'scale(1)',
                  cursor: animating ? 'default' : 'pointer',
                  fontSize: '0.95rem',
                }}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <p className="text-center text-xs mt-10" style={{ color: 'rgba(255,255,255,0.2)' }}>
            Nema točnih ni pogrešnih odgovora — budi iskren/a sa sobom
          </p>
        </div>
      </div>
    </div>
  )
}
