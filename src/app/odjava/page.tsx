'use client'

import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { CheckCircle, XCircle } from 'lucide-react'

function OdjavaContent() {
  const searchParams = useSearchParams()
  const email = searchParams.get('email') ?? ''

  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (email) {
      handleUnsubscribe(email)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [email])

  async function handleUnsubscribe(emailToUnsub: string) {
    setStatus('loading')
    try {
      const res = await fetch('/api/unsubscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailToUnsub }),
      })
      if (res.ok) {
        setStatus('success')
        setMessage(emailToUnsub)
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  if (status === 'loading') {
    return (
      <div className="text-center">
        <div className="w-12 h-12 border-2 border-gold/30 border-t-gold rounded-full animate-spin mx-auto mb-4" />
        <p className="text-white/60">Odjavljujem te...</p>
      </div>
    )
  }

  if (status === 'success') {
    return (
      <div className="text-center">
        <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-6" />
        <h1 className="text-2xl font-bold text-white mb-3">Uspješno si odjavljen/a</h1>
        <p className="text-white/60 mb-2">
          Email adresa <span className="text-white font-medium">{message}</span> uklonjena je s naše marketing liste.
        </p>
        <p className="text-white/40 text-sm mb-8">
          Više nećeš primati marketinške emailove od FinCoach VIP. Transakcijski emailovi (računi, potvrde) i dalje će se slati ako imaš aktivan pretplatu.
        </p>
        <Link href="/">
          <Button variant="outline">Idi na početnu →</Button>
        </Link>
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className="text-center">
        <XCircle className="w-16 h-16 text-red-400 mx-auto mb-6" />
        <h1 className="text-2xl font-bold text-white mb-3">Nešto je pošlo po krivu</h1>
        <p className="text-white/60 mb-8">
          Nije se uspjelo obraditi tvoj zahtjev. Molimo kontaktiraj nas direktno na{' '}
          <a href="mailto:brane.recek@gmail.com" className="text-gold hover:underline">brane.recek@gmail.com</a>.
        </p>
        <Link href="/">
          <Button variant="outline">Idi na početnu →</Button>
        </Link>
      </div>
    )
  }

  // No email param — show manual form
  return (
    <div className="text-center">
      <h1 className="text-2xl font-bold text-white mb-3">Odjava od emailova</h1>
      <p className="text-white/60 mb-8">
        Za odjavu od marketing emailova, pošalji zahtjev na{' '}
        <a href="mailto:brane.recek@gmail.com" className="text-gold hover:underline">brane.recek@gmail.com</a>{' '}
        s naslovom &quot;Odjava&quot;.
      </p>
      <Link href="/">
        <Button variant="outline">Idi na početnu →</Button>
      </Link>
    </div>
  )
}

export default function OdjavaPage() {
  return (
    <div className="min-h-screen bg-navy flex flex-col">
      <nav className="border-b border-white/10 bg-navy/95 backdrop-blur-sm px-4 sm:px-6 h-16 flex items-center">
        <div className="max-w-4xl mx-auto w-full flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <Image src="/logo/fincoach-logo-horizontal.svg" alt="FinCoach VIP" width={150} height={47} priority />
          </Link>
        </div>
      </nav>

      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="max-w-md w-full bg-navy-50 border border-white/10 rounded-2xl p-8">
          <Suspense fallback={
            <div className="text-center">
              <div className="w-12 h-12 border-2 border-gold/30 border-t-gold rounded-full animate-spin mx-auto mb-4" />
              <p className="text-white/60">Učitavam...</p>
            </div>
          }>
            <OdjavaContent />
          </Suspense>
        </div>
      </main>

      <footer className="border-t border-white/10 py-6 px-4 text-center">
        <p className="text-white/30 text-sm">© 2026 FinCoach VIP</p>
      </footer>
    </div>
  )
}
