'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') ?? '/portal'
  const supabase = createClient()

  const [mode, setMode] = useState<'login' | 'forgot'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    try {
      if (mode === 'login') {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
        toast.success('Dobrodošao/la!')
        router.push(redirect)
        router.refresh()
      } else {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/auth/reset-password`,
        })
        if (error) throw error
        toast.success('Email za reset lozinke je poslan!')
        setEmailSent(true)
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Greška. Pokušaj ponovo.'
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-navy flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <Image src="/logo/fincoach-logo-horizontal.svg" alt="FinCoach VIP" width={150} height={47} />
          </Link>
          <h1 className="text-2xl font-bold text-white mt-6 mb-2">
            {mode === 'login' ? 'Prijava' : 'Zaboravljena lozinka'}
          </h1>
          <p className="text-white/50 text-sm">
            {mode === 'login' ? 'Upiši se u svoj student portal' : 'Pošaljemo ti link za reset'}
          </p>
        </div>

        {emailSent ? (
          <div className="bg-green-500/10 border border-green-500/30 rounded-2xl p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Email poslan!</h3>
            <p className="text-white/60 text-sm">Provjeri svoju pristiglu poštu i klikni na link za reset lozinke.</p>
            <button onClick={() => { setEmailSent(false); setMode('login') }} className="mt-4 text-gold text-sm hover:underline">
              Natrag na prijavu
            </button>
          </div>
        ) : (
          <div className="bg-navy-50 border border-white/10 rounded-2xl p-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Email adresa"
                type="email"
                placeholder="tvoj@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
              {mode === 'login' && (
                <Input
                  label="Lozinka"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
              )}
              <Button type="submit" size="lg" loading={loading} className="w-full mt-2">
                {mode === 'login' ? 'Prijavi se' : 'Pošalji link za reset'}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm">
              {mode === 'login' ? (
                <button onClick={() => setMode('forgot')} className="text-white/40 hover:text-white transition-colors">
                  Zaboravili ste lozinku?
                </button>
              ) : (
                <button onClick={() => setMode('login')} className="text-gold hover:underline">
                  Natrag na prijavu
                </button>
              )}
            </div>
          </div>
        )}

        {mode === 'login' && (
          <div className="mt-6 bg-white/3 border border-white/5 rounded-xl p-4 text-center">
            <p className="text-white/40 text-xs leading-relaxed">
              Pristup portalu dobivaju isključivo kupci tečaja.<br />
              Prijavne podatke smo ti poslali emailom nakon kupnje.
            </p>
            <Link href="/tecaj" className="text-gold text-xs hover:underline mt-2 inline-block">
              Kupi tečaj →
            </Link>
          </div>
        )}

        <p className="text-center text-white/30 text-sm mt-6">
          <Link href="/" className="hover:text-white transition-colors">← Natrag na početnu</Link>
        </p>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-navy" />}>
      <LoginForm />
    </Suspense>
  )
}
