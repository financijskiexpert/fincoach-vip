import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function BiljeznicePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/prijava')

  // Fetch all notes for the user, joined with lesson info
  const { data: notes } = await supabase
    .from('notes')
    .select('content, updated_at, lesson_id, lessons(day_number, title)')
    .eq('user_id', user.id)
    .not('content', 'is', null)
    .neq('content', '')
    .order('updated_at', { ascending: false })

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-white/40 mb-6">
        <Link href="/portal" className="hover:text-white transition-colors">Dashboard</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-white/70">Moje bilješke</span>
      </div>

      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Moje bilješke</h1>
        <p className="text-white/50">Sve bilješke koje si zapisao/la uz lekcije.</p>
      </div>

      {!notes || notes.length === 0 ? (
        <div className="bg-navy-50 border border-white/10 rounded-2xl p-12 text-center">
          <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white/20" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
            </svg>
          </div>
          <h3 className="text-white/60 font-semibold mb-2">Nemaš još bilješki</h3>
          <p className="text-white/30 text-sm mb-6">
            Dok gledaš lekcije, zapisuj misli, uvide i zadatke. Naći ćeš ih sve ovdje.
          </p>
          <Link
            href="/portal"
            className="inline-flex items-center gap-2 bg-gold/10 border border-gold/30 rounded-xl px-5 py-2.5 text-gold text-sm hover:bg-gold/20 transition-colors"
          >
            Idi na Dashboard
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {notes.map(note => {
            const lesson = Array.isArray(note.lessons) ? note.lessons[0] : note.lessons
            const dayNum = lesson?.day_number
            const title = lesson?.title ?? 'Lekcija'
            const preview = note.content.length > 200 ? note.content.slice(0, 200) + '…' : note.content
            const updatedAt = new Date(note.updated_at).toLocaleDateString('hr-HR', {
              day: 'numeric', month: 'long', year: 'numeric',
            })

            return (
              <Link
                key={note.lesson_id}
                href={dayNum ? `/portal/dan/${dayNum}` : '/portal'}
                className="block bg-navy-50 border border-white/10 rounded-2xl p-6 hover:border-gold/30 transition-colors group"
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    {dayNum && (
                      <span className="text-xs text-gold/60 font-medium">Dan {dayNum}</span>
                    )}
                    <h3 className="text-white font-semibold group-hover:text-gold transition-colors">{title}</h3>
                  </div>
                  <span className="text-xs text-white/30 shrink-0 mt-1">{updatedAt}</span>
                </div>
                <p className="text-white/50 text-sm leading-relaxed whitespace-pre-line">{preview}</p>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
