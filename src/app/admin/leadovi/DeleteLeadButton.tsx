'use client'

import { Trash2, UserCheck, Loader2 } from 'lucide-react'
import { deleteLead, convertLeadToStudent } from './actions'
import { useTransition, useState } from 'react'

export function DeleteLeadButton({ leadId, email }: { leadId: string; email: string }) {
  const [pending, startTransition] = useTransition()

  function handleDelete() {
    if (!confirm(`Obriši lead ${email}?\n\nOvo briše i cijelu email sekvencu za ovog leada.`)) return
    startTransition(() => deleteLead(leadId))
  }

  return (
    <button
      onClick={handleDelete}
      disabled={pending}
      className="flex items-center gap-1.5 px-3 py-2 text-xs text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500/10 transition-colors disabled:opacity-50"
    >
      <Trash2 className="w-3.5 h-3.5" />
      {pending ? 'Brišem...' : 'Obriši'}
    </button>
  )
}

interface CourseOpt { slug: string; title: string }

export function ConvertLeadButton({
  leadId,
  leadEmail,
  leadName,
  courses,
}: {
  leadId: string
  leadEmail: string
  leadName: string
  courses: CourseOpt[]
}) {
  const [open, setOpen] = useState(false)
  const [pending, startTransition] = useTransition()
  const [courseSlug, setCourseSlug] = useState(courses[0]?.slug ?? 'volim-svojnovac')
  const [withAffiliate, setWithAffiliate] = useState(true)

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData()
    fd.set('lead_id', leadId)
    fd.set('course_slug', courseSlug)
    fd.set('with_affiliate', String(withAffiliate))
    startTransition(async () => {
      await convertLeadToStudent(fd)
      setOpen(false)
    })
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 px-3 py-2 text-xs text-green-400 border border-green-500/30 rounded-lg hover:bg-green-500/10 transition-colors disabled:opacity-50"
      >
        <UserCheck className="w-3.5 h-3.5" />
        Pretvori u studenta
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-navy border border-white/20 rounded-2xl p-6 w-full max-w-md shadow-2xl my-8">
            <h2 className="text-xl font-bold text-white mb-2">Pretvori lead u studenta</h2>
            <p className="text-white/50 text-sm mb-6">{leadName} · {leadEmail}</p>

            <form onSubmit={submit} className="space-y-4">
              <div>
                <label className="block text-sm text-white/60 mb-1.5">Tečaj *</label>
                <select
                  value={courseSlug}
                  onChange={e => setCourseSlug(e.target.value)}
                  className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-gold text-sm"
                >
                  {courses.map(c => (
                    <option key={c.slug} value={c.slug} className="bg-navy">{c.title}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm text-white/60 mb-2">Partnerski program</label>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setWithAffiliate(true)}
                    className={`flex-1 py-2.5 rounded-lg text-sm font-semibold border transition ${withAffiliate ? 'bg-gold/20 border-gold/50 text-gold' : 'bg-white/5 border-white/10 text-white/40'}`}
                  >
                    ✓ Dodijeli affiliate
                  </button>
                  <button
                    type="button"
                    onClick={() => setWithAffiliate(false)}
                    className={`flex-1 py-2.5 rounded-lg text-sm font-semibold border transition ${!withAffiliate ? 'bg-white/10 border-white/30 text-white' : 'bg-white/5 border-white/10 text-white/40'}`}
                  >
                    Bez affiliate
                  </button>
                </div>
              </div>

              <div className="bg-gold/10 border border-gold/20 rounded-lg p-3 text-xs text-gold/80">
                Lead će biti označen kao konvertiran, prodajni emaili se zaustavljaju, i poslat ćemo magic link za pristup portalu.
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="flex-1 py-2.5 border border-white/20 rounded-lg text-white/60 text-sm hover:bg-white/5 transition"
                >
                  Odustani
                </button>
                <button
                  type="submit"
                  disabled={pending}
                  className="flex-1 py-2.5 bg-gold text-navy font-bold rounded-lg hover:bg-yellow-400 transition text-sm flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {pending ? <><Loader2 className="w-4 h-4 animate-spin" /> Pretvaram...</> : 'Pretvori →'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
