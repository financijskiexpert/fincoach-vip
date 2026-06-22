'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function OdjavaPage() {
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.signOut().then(() => {
      router.push('/prijava')
    })
  }, [])

  return (
    <div className="min-h-screen bg-navy flex items-center justify-center">
      <p className="text-white/50">Odjavljivanje...</p>
    </div>
  )
}
