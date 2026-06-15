'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { CheckCircle, Loader2 } from 'lucide-react'

function ThanksContent() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')

  useEffect(() => {
    if (!sessionId) {
      setStatus('error')
      return
    }
    // Just show success — webhook handles the actual fulfillment
    const timer = setTimeout(() => setStatus('success'), 1000)
    return () => clearTimeout(timer)
  }, [sessionId])

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-navy flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-gold animate-spin mx-auto mb-4" />
          <p className="text-white/60">Obrađujemo tvoju narudžbu...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-navy flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center">
        <div className="w-24 h-24 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center mx-auto mb-8">
          <CheckCircle className="w-12 h-12 text-green-400" />
        </div>

        <h1 className="text-4xl font-black text-white mb-4">
          Dobrodošao/la u<br />
          <span className="text-gold">FinCoach VIP!</span>
        </h1>

        <p className="text-white/60 text-lg mb-8 leading-relaxed">
          Tvoja narudžba je uspješno obradena. Za nekoliko minuta primit ćeš email s pristupnim podacima za student portal.
        </p>

        <div className="bg-navy-50 border border-white/10 rounded-2xl p-6 mb-8 text-left space-y-3">
          {[
            '✅ Pristup svim 90 video lekcijama',
            '✅ Radni listovi i predlošci',
            '✅ Privatna zajednica polaznika',
            '✅ Certifikat po završetku',
            '✅ Doživotni pristup + nadopune',
          ].map(item => (
            <p key={item} className="text-white/70 text-sm">{item}</p>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/portal">
            <Button size="lg" className="w-full sm:w-auto">
              Idi na portal →
            </Button>
          </Link>
          <Link href="/prijava">
            <Button size="lg" variant="outline" className="w-full sm:w-auto">
              Prijavi se
            </Button>
          </Link>
        </div>

        <p className="text-white/30 text-sm mt-8">
          Pitanja? Pišite nam na{' '}
          <a href={`mailto:${process.env.NEXT_PUBLIC_ADMIN_EMAIL ?? 'financijski.expert@gmail.com'}`} className="text-gold hover:underline">
            financijski.expert@gmail.com
          </a>
        </p>
      </div>
    </div>
  )
}

export default function ThanksPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-navy" />}>
      <ThanksContent />
    </Suspense>
  )
}