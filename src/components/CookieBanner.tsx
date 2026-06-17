'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'

type CookieConsent = {
  necessary: true
  analytics: boolean
  marketing: boolean
}

const STORAGE_KEY = 'fincoach_cookie_consent'

export function useCookieConsent(): CookieConsent | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export default function CookieBanner() {
  const [visible, setVisible] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const [analytics, setAnalytics] = useState(false)
  const [marketing, setMarketing] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (!saved) setVisible(true)
  }, [])

  function save(consent: CookieConsent) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(consent))
    setVisible(false)
    // Dispatch event so other parts of app can react
    window.dispatchEvent(new CustomEvent('cookieConsentSaved', { detail: consent }))
  }

  function acceptAll() {
    save({ necessary: true, analytics: true, marketing: true })
  }

  function rejectAll() {
    save({ necessary: true, analytics: false, marketing: false })
  }

  function saveCustom() {
    save({ necessary: true, analytics, marketing })
  }

  if (!visible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[9999] p-4 sm:p-6">
      <div className="max-w-4xl mx-auto bg-[#0f1e35] border border-white/20 rounded-2xl shadow-2xl">
        <div className="p-5 sm:p-6">
          <div className="flex items-start justify-between gap-4 mb-3">
            <h3 className="text-white font-semibold text-base">Koristimo kolačiće 🍪</h3>
            <button
              onClick={rejectAll}
              className="text-white/40 hover:text-white transition-colors shrink-0"
              aria-label="Odbij sve"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <p className="text-white/60 text-sm leading-relaxed mb-4">
            Nužni kolačići su uvijek aktivni. Analitičke i marketinške koristimo samo uz vašu suglasnost, u skladu s{' '}
            <Link href="/politikaprivatnosti" className="text-gold hover:underline">Politikom privatnosti</Link>.
          </p>

          {showDetails && (
            <div className="mb-4 space-y-3 border-t border-white/10 pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white text-sm font-medium">Nužni kolačići</p>
                  <p className="text-white/40 text-xs">Prijava, sesija — uvijek aktivni</p>
                </div>
                <div className="w-10 h-5 bg-gold rounded-full relative shrink-0">
                  <div className="w-4 h-4 bg-white rounded-full absolute right-0.5 top-0.5" />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white text-sm font-medium">Analitički kolačići</p>
                  <p className="text-white/40 text-xs">Anonimna statistika posjeta</p>
                </div>
                <button
                  onClick={() => setAnalytics(v => !v)}
                  className={`w-10 h-5 rounded-full relative shrink-0 transition-colors ${analytics ? 'bg-gold' : 'bg-white/20'}`}
                  role="switch"
                  aria-checked={analytics}
                >
                  <span className={`w-4 h-4 bg-white rounded-full absolute top-0.5 transition-all ${analytics ? 'right-0.5' : 'left-0.5'}`} />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white text-sm font-medium">Marketinški kolačići</p>
                  <p className="text-white/40 text-xs">Affiliate praćenje, personalizacija</p>
                </div>
                <button
                  onClick={() => setMarketing(v => !v)}
                  className={`w-10 h-5 rounded-full relative shrink-0 transition-colors ${marketing ? 'bg-gold' : 'bg-white/20'}`}
                  role="switch"
                  aria-checked={marketing}
                >
                  <span className={`w-4 h-4 bg-white rounded-full absolute top-0.5 transition-all ${marketing ? 'right-0.5' : 'left-0.5'}`} />
                </button>
              </div>
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            <Button size="sm" onClick={acceptAll} className="flex-1 sm:flex-none">
              Prihvati sve
            </Button>
            <Button size="sm" variant="outline" onClick={rejectAll} className="flex-1 sm:flex-none">
              Samo nužni
            </Button>
            {showDetails ? (
              <Button size="sm" variant="outline" onClick={saveCustom} className="flex-1 sm:flex-none">
                Spremi odabir
              </Button>
            ) : (
              <button
                onClick={() => setShowDetails(true)}
                className="flex-1 sm:flex-none text-sm text-white/40 hover:text-white transition-colors px-3"
              >
                Postavke
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
