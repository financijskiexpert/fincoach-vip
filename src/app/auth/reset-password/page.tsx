'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'

function ResetPasswordForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()

  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    // Supabase sends tokens in the URL hash — listen for the session
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        setReady(true)
      }
    })
    return () => subscription.unsubscribe()
  }, [supabase])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (password.length < 8) {
      toast.error('Lozinka mora imati najmanje 8 znakova.')
      return
    }
    if (password !== confirm) {
      toast.error('Lozinke se ne podudaraju.')
      return
    }
    setLoading(true)
    try {
      const { error } = await supabase.auth.updateUser({ password })
      if (error) throw error
      toast.success('Lozinka uspješno promijenjena!')
      router.push('/portal')
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Greška.'
      toast.error(msg)
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
          <h1 className="text-2xl font-bold text-white mt-6 mb-2">Nova lozinka</h1>
          <p className="text-white/50 text-sm">Unesi svoju novu lozinku</p>
        </div>

        {!ready ? (
          <div className="bg-navy-50 border border-white/10 rounded-2xl p-8 text-center">
            <div className="w-8 h-8 border-2 border-gold/30 border-t-gold rounded-full animate-spin mx-auto mb-4" />
            <p className="text-white/50 text-sm">Provjera linka za reset...</p>
            <p className="text-white/30 text-xs mt-3">
              Ako ovo traje predugo,{' '}
              <Link href="/prijava" className="text-gold hover:underline">
                zatraži novi link
              </Link>.
            </p>
          </div>
        ) : (
          <div className="bg-navy-50 border border-white/10 rounded-2xl p-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Nova lozinka"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                hint="Minimalno 8 znakova"
              />
              <Input
                label="Potvrdi lozinku"
                type="password"
                placeholder="••••••••"
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
                required
              />
              <Button type="submit" size="lg" loading={loading} className="w-full mt-2">
                Spremi novu lozinku
              </Button>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-navy" />}>
      <ResetPasswordForm />
    </Suspense>
  )
}
