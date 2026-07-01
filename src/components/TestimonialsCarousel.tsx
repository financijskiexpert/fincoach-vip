'use client'

import { useState, useEffect, useCallback } from 'react'
import { Star, ChevronLeft, ChevronRight } from 'lucide-react'

interface Testimonial {
  id: string
  full_name: string
  role: string | null
  quote: string
  rating: number
}

const FALLBACK: Testimonial[] = [
  { id: 'f1', full_name: 'Marija K.', role: 'Učiteljica, Split', quote: 'Za 3 mjeseca sam uspjela uštedjeti više nego za cijelu prethodnu godinu. Konačno razumijem kamo odlazi svaka kuna i imam plan. Ovo stvarno funkcionira!', rating: 5 },
  { id: 'f2', full_name: 'Ivan P.', role: 'Poduzetnik, Zagreb', quote: 'Mislio sam da znam sve o novcu. Braneov pristup mi je potpuno promijenio perspektivu — shvatio sam da problem nije bio u prihodima, nego u navikama.', rating: 5 },
  { id: 'f3', full_name: 'Ana M.', role: 'Marketing menadžerica, Rijeka', quote: 'Konačno nemam stres na kraju mjeseca. Sustav radi automatski, bez volje. Preporučujem svima koji osjećaju da im novac "curi".', rating: 5 },
  { id: 'f4', full_name: 'Tomislav R.', role: 'Freelancer, Osijek', quote: 'Kao freelancer nikad nisam znao planirati s nepravilnim prihodima. Nakon 60 dana imam hitni fond i prvi put investiram.', rating: 5 },
  { id: 'f5', full_name: 'Maja S.', role: 'Menadžerica, Novi Sad', quote: 'Program mi je pomogao eliminirati dug koji sam nosila 5 godina. Braneov mentorat je ono što nedostaje u svim knjigama o financijama.', rating: 5 },
  { id: 'f6', full_name: 'Darko V.', role: 'Inženjer, Ljubljana', quote: 'Mislio sam da su mi financije u redu, ali program je otkrio koliko sam zapravo ostavljao na stolu. Sada štedim 20% više bez da osjećam razliku.', rating: 5 },
]

function TestimonialCard({ t }: { t: Testimonial }) {
  return (
    <div className="bg-navy border border-white/10 rounded-2xl p-6 flex flex-col">
      <div className="flex gap-0.5 mb-4">
        {Array(t.rating).fill(0).map((_, i) => (
          <Star key={i} className="w-4 h-4 fill-gold text-gold" />
        ))}
      </div>
      <p className="text-white/70 text-sm leading-relaxed mb-4 italic flex-1">&ldquo;{t.quote}&rdquo;</p>
      <div>
        <p className="text-white font-semibold text-sm">{t.full_name}</p>
        {t.role && <p className="text-white/40 text-xs mt-0.5">{t.role}</p>}
      </div>
    </div>
  )
}

export default function TestimonialsCarousel() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>(FALLBACK)
  const [idx, setIdx] = useState(0)
  const [fade, setFade] = useState(true)

  useEffect(() => {
    fetch('/api/testimonials')
      .then(r => r.json())
      .then(data => {
        if (data.testimonials?.length >= 1) setTestimonials(data.testimonials)
      })
      .catch(() => {})
  }, [])

  const n = testimonials.length

  const go = useCallback((next: number) => {
    setFade(false)
    setTimeout(() => {
      setIdx(((next % n) + n) % n)
      setFade(true)
    }, 250)
  }, [n])

  useEffect(() => {
    if (n <= 2) return
    const timer = setInterval(() => go((idx + 1) % n), 10000)
    return () => clearInterval(timer)
  }, [idx, n, go])

  const pair = n === 1
    ? [testimonials[0]]
    : [testimonials[idx], testimonials[(idx + 1) % n]]

  return (
    <div>
      <div
        className="grid md:grid-cols-2 gap-6 transition-opacity duration-300"
        style={{ opacity: fade ? 1 : 0 }}
      >
        {pair.map(t => <TestimonialCard key={t.id} t={t} />)}
      </div>

      {n > 2 && (
        <div className="flex items-center justify-center gap-4 mt-8">
          <button
            onClick={() => go(idx - 1)}
            aria-label="Prethodno"
            className="p-2 rounded-full border border-white/10 text-white/40 hover:text-gold hover:border-gold/40 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex gap-2">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => go(i)}
                aria-label={`Pričevanje ${i + 1}`}
                className="w-2 h-2 rounded-full transition-all duration-300"
                style={{
                  backgroundColor: i === idx || i === (idx + 1) % n
                    ? '#D4AF37'
                    : 'rgba(255,255,255,0.2)',
                  transform: i === idx ? 'scale(1.3)' : 'scale(1)',
                }}
              />
            ))}
          </div>
          <button
            onClick={() => go(idx + 1)}
            aria-label="Sljedeće"
            className="p-2 rounded-full border border-white/10 text-white/40 hover:text-gold hover:border-gold/40 transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  )
}
