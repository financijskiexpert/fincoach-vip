'use client'

import { useState } from 'react'
import { EMAIL_SEQUENCE, buildEmailContent } from '@/lib/email-sequence'

const TYPE_LABELS: Record<string, string> = {
  educational: '📚 Edukacija',
  sales: '💰 Prodaja',
  story: '📖 Priča',
  social_proof: '⭐ Social proof',
  affiliate: '🤝 Affiliate',
  newsletter: '📰 Newsletter',
}

const PHASE_COLORS: Record<number, string> = {
  1: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  2: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
  3: 'bg-green-500/20 text-green-300 border-green-500/30',
}

export default function EmailiPage() {
  const [selected, setSelected] = useState<number | null>(null)
  const [previewMode, setPreviewMode] = useState<'html' | 'text'>('html')

  const preview = selected !== null
    ? buildEmailContent(selected, 'Ime Prezime', 'primjer@email.com')
    : null

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Email sekvenca</h1>
        <p className="text-white/50 mt-1">22 emaila kroz 168 dana — klikni na email za pregled sadržaja</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Lista emailova */}
        <div className="space-y-2">
          {EMAIL_SEQUENCE.map((seq, i) => (
            <button
              key={i}
              onClick={() => setSelected(selected === i ? null : i)}
              className={`w-full text-left p-4 rounded-xl border transition-all ${
                selected === i
                  ? 'bg-gold/10 border-gold'
                  : 'bg-navy-50 border-white/10 hover:border-white/30'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="text-gold font-bold text-sm">Dan {seq.dayOffset}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${PHASE_COLORS[seq.phase]}`}>
                      Faza {seq.phase}
                    </span>
                    <span className="text-xs text-white/40">{TYPE_LABELS[seq.type]}</span>
                    {seq.skipIfPurchased && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-300 border border-orange-500/30">
                        Skip ako je kupac
                      </span>
                    )}
                  </div>
                  <p className="text-white text-sm font-medium truncate">{seq.subject}</p>
                </div>
                <span className="text-white/30 text-lg">{selected === i ? '▲' : '▼'}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Preview */}
        <div className="lg:sticky lg:top-6 lg:self-start">
          {preview ? (
            <div className="bg-navy-50 border border-white/10 rounded-2xl overflow-hidden">
              <div className="p-4 border-b border-white/10 flex items-center justify-between">
                <div>
                  <p className="text-white/40 text-xs mb-1">Email #{(selected ?? 0) + 1} · Dan {EMAIL_SEQUENCE[selected ?? 0].dayOffset}</p>
                  <p className="text-white font-semibold text-sm">{preview.subject}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPreviewMode('html')}
                    className={`text-xs px-3 py-1 rounded-lg ${previewMode === 'html' ? 'bg-gold text-navy font-bold' : 'text-white/40 hover:text-white'}`}
                  >
                    Preview
                  </button>
                  <button
                    onClick={() => setPreviewMode('text')}
                    className={`text-xs px-3 py-1 rounded-lg ${previewMode === 'text' ? 'bg-gold text-navy font-bold' : 'text-white/40 hover:text-white'}`}
                  >
                    HTML
                  </button>
                </div>
              </div>
              {previewMode === 'html' ? (
                <iframe
                  srcDoc={preview.html}
                  className="w-full h-[600px] bg-white"
                  title="Email preview"
                  sandbox="allow-same-origin"
                />
              ) : (
                <pre className="p-4 text-xs text-white/60 overflow-auto h-[600px] whitespace-pre-wrap font-mono">
                  {preview.html}
                </pre>
              )}
            </div>
          ) : (
            <div className="bg-navy-50 border border-white/10 rounded-2xl p-12 text-center">
              <p className="text-white/30 text-4xl mb-4">✉️</p>
              <p className="text-white/40">Klikni na email za pregled sadržaja</p>
            </div>
          )}
        </div>
      </div>

      {/* Statistika */}
      <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
        {[1, 2, 3].map(phase => {
          const count = EMAIL_SEQUENCE.filter(e => e.phase === phase).length
          return (
            <div key={phase} className={`p-4 rounded-xl border ${PHASE_COLORS[phase]}`}>
              <p className="text-2xl font-bold">{count}</p>
              <p className="text-sm opacity-70">Faza {phase} emaila</p>
            </div>
          )
        })}
        <div className="p-4 rounded-xl border border-white/10 bg-white/5">
          <p className="text-2xl font-bold text-white">{EMAIL_SEQUENCE.length}</p>
          <p className="text-sm text-white/40">Ukupno emaila</p>
        </div>
      </div>
    </div>
  )
}
