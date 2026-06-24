'use client'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'

type CookiePreferences = {
  necessary: true
  analytics: boolean
  marketing: boolean
}

const STORAGE_KEY = 'fincoach_cookie_consent'

function loadPreferences(): CookiePreferences {
  if (typeof window === 'undefined') return { necessary: true, analytics: false, marketing: false }
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch {
    // ignore
  }
  return { necessary: true, analytics: false, marketing: false }
}

type Props = {
  open: boolean
  onClose: () => void
}

export default function CookieManager({ open, onClose }: Props) {
  const [analytics, setAnalytics] = useState(false)
  const [marketing, setMarketing] = useState(false)

  useEffect(() => {
    if (open) {
      const prefs = loadPreferences()
      setAnalytics(prefs.analytics)
      setMarketing(prefs.marketing)
    }
  }, [open])

  function save(prefs: CookiePreferences) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs))
    window.dispatchEvent(new CustomEvent('cookieConsentSaved', { detail: prefs }))
    onClose()
  }

  function saveCustom() {
    save({ necessary: true, analytics, marketing })
  }

  function acceptAll() {
    save({ necessary: true, analytics: true, marketing: true })
  }

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[9998] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Upravljanje kolačićima"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-md bg-[#0f1e35] border border-white/20 rounded-2xl shadow-2xl">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between gap-4 mb-4">
            <h2 className="text-white font-semibold text-lg">Upravljanje kolačićima</h2>
            <button
              onClick={onClose}
              className="text-white/40 hover:text-white transition-colors shrink-0"
              aria-label="Zatvori"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <p className="text-white/60 text-sm leading-relaxed mb-5">
            Odaberite koje kategorije kolačića dopuštate. Nužni kolačići su uvijek aktivni jer su potrebni za funkcioniranje web stranice.
          </p>

          {/* Categories */}
          <div className="space-y-4 mb-6">
            {/* Necessary — always on */}
            <div className="flex items-start justify-between gap-4 py-3 border-t border-white/10">
              <div>
                <p className="text-white text-sm font-medium">Nužni kolačići</p>
                <p className="text-white/40 text-xs mt-0.5">Prijava, sesija, sigurnost — uvijek aktivni</p>
              </div>
              <div
                className="w-10 h-5 bg-gold rounded-full relative shrink-0 cursor-not-allowed"
                title="Uvijek aktivno"
                aria-label="Nužni kolačići su uvijek aktivni"
              >
                <span className="w-4 h-4 bg-white rounded-full absolute right-0.5 top-0.5 block" />
              </div>
            </div>

            {/* Analytics */}
            <div className="flex items-start justify-between gap-4 py-3 border-t border-white/10">
              <div>
                <p className="text-white text-sm font-medium">Analitički kolačići</p>
                <p className="text-white/40 text-xs mt-0.5">Anonimna statistika posjeta (Google Analytics)</p>
              </div>
              <button
                onClick={() => setAnalytics(v => !v)}
                className={`w-10 h-5 rounded-full relative shrink-0 transition-colors ${analytics ? 'bg-gold' : 'bg-white/20'}`}
                role="switch"
                aria-checked={analytics}
                aria-label="Analitički kolačići"
              >
                <span
                  className={`w-4 h-4 bg-white rounded-full absolute top-0.5 transition-all ${analytics ? 'right-0.5' : 'left-0.5'}`}
                />
              </button>
            </div>

            {/* Marketing */}
            <div className="flex items-start justify-between gap-4 py-3 border-t border-white/10">
              <div>
                <p className="text-white text-sm font-medium">Marketinški kolačići</p>
                <p className="text-white/40 text-xs mt-0.5">Ciljano oglašavanje, praćenje afilijata</p>
              </div>
              <button
                onClick={() => setMarketing(v => !v)}
                className={`w-10 h-5 rounded-full relative shrink-0 transition-colors ${marketing ? 'bg-gold' : 'bg-white/20'}`}
                role="switch"
                aria-checked={marketing}
                aria-label="Marketinški kolačići"
              >
                <span
                  className={`w-4 h-4 bg-white rounded-full absolute top-0.5 transition-all ${marketing ? 'right-0.5' : 'left-0.5'}`}
                />
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-2">
            <Button onClick={saveCustom} className="flex-1">
              Spremi postavke
            </Button>
            <Button variant="outline" onClick={acceptAll} className="flex-1">
              Prihvati sve
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
