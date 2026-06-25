'use client'

import { useTransition, useState } from 'react'
import { addStudent, deleteStudent, grantAccess, revokeAccess, revokeAffiliate, grantAffiliate } from './actions'
import { UserPlus, Trash2, Unlock, Loader2, Lock, UserMinus } from 'lucide-react'

interface CourseOption {
  id: string
  slug: string
  title: string
}

export function AddStudentForm({ courses }: { courses: CourseOption[] }) {
  const [pending, startTransition] = useTransition()
  const [open, setOpen] = useState(false)
  const [paid, setPaid] = useState(true)
  const [withAffiliate, setWithAffiliate] = useState(true)
  const [courseSlug, setCourseSlug] = useState(courses[0]?.slug ?? 'volim-svojnovac')

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    fd.set('paid', String(paid))
    fd.set('with_affiliate', String(withAffiliate))
    fd.set('course_slug', courseSlug)
    startTransition(async () => {
      await addStudent(fd)
      setOpen(false)
    })
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-4 py-2 bg-gold text-navy font-bold rounded-lg hover:bg-yellow-400 transition text-sm"
      >
        <UserPlus className="w-4 h-4" />
        Dodaj studenta
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-navy border border-white/20 rounded-2xl p-8 w-full max-w-md shadow-2xl my-8">
            <h2 className="text-xl font-bold text-white mb-6">Dodaj novog studenta</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-white/60 mb-1.5">Ime i prezime *</label>
                <input
                  name="full_name"
                  required
                  placeholder="npr. Marko Marković"
                  className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-2.5 text-white placeholder-white/30 focus:outline-none focus:border-gold text-sm"
                />
              </div>
              <div>
                <label className="block text-sm text-white/60 mb-1.5">Email adresa *</label>
                <input
                  name="email"
                  type="email"
                  required
                  placeholder="marko@example.com"
                  className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-2.5 text-white placeholder-white/30 focus:outline-none focus:border-gold text-sm"
                />
              </div>

              {/* Izbor tečaja */}
              <div>
                <label className="block text-sm text-white/60 mb-1.5">Koji tečaj dodjeljuješ? *</label>
                <select
                  value={courseSlug}
                  onChange={e => setCourseSlug(e.target.value)}
                  className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-gold text-sm"
                >
                  {courses.map(c => (
                    <option key={c.slug} value={c.slug} className="bg-navy">{c.title}</option>
                  ))}
                </select>
                {courses.length === 1 && (
                  <p className="text-xs text-white/30 mt-1.5">Trenutno je dostupan samo jedan tečaj. Kad dodaš druge, izabrat ćeš ovdje.</p>
                )}
              </div>

              <div>
                <label className="block text-sm text-white/60 mb-2">Pristup tečaju</label>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setPaid(true)}
                    className={`flex-1 py-2.5 rounded-lg text-sm font-semibold border transition ${paid ? 'bg-green-500/20 border-green-500/50 text-green-400' : 'bg-white/5 border-white/10 text-white/40'}`}
                  >
                    ✓ Aktivan
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaid(false)}
                    className={`flex-1 py-2.5 rounded-lg text-sm font-semibold border transition ${!paid ? 'bg-white/10 border-white/30 text-white' : 'bg-white/5 border-white/10 text-white/40'}`}
                  >
                    Nije plaćeno
                  </button>
                </div>
              </div>

              {/* Affiliate toggle */}
              <div>
                <label className="block text-sm text-white/60 mb-2">Partnerski program (affiliate)</label>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setWithAffiliate(true)}
                    disabled={!paid}
                    className={`flex-1 py-2.5 rounded-lg text-sm font-semibold border transition disabled:opacity-40 disabled:cursor-not-allowed ${withAffiliate && paid ? 'bg-gold/20 border-gold/50 text-gold' : 'bg-white/5 border-white/10 text-white/40'}`}
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
                <p className="text-xs text-white/30 mt-1.5">
                  {!paid
                    ? 'Affiliate je dostupan samo kupcima tečaja.'
                    : withAffiliate
                      ? 'Student dobiva affiliate kod i 30% provizije po prodaji.'
                      : 'Student nema affiliate pristupa. Možeš ga aktivirati kasnije iz liste.'}
                </p>
              </div>

              <div className="bg-gold/10 border border-gold/20 rounded-lg p-3 text-xs text-gold/80">
                Student će dobiti email s magic linkom za pristup portalu (aktivan 24h).
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
                  {pending ? <><Loader2 className="w-4 h-4 animate-spin" /> Dodajem...</> : 'Dodaj studenta'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}

export function DeleteStudentButton({ userId, name }: { userId: string; name: string }) {
  const [pending, startTransition] = useTransition()
  return (
    <button
      onClick={() => {
        if (!confirm(`Obriši studenta ${name}?\n\nOvo briše profil, pristup i napredak.`)) return
        startTransition(() => deleteStudent(userId))
      }}
      disabled={pending}
      title="Obriši studenta"
      className="p-1.5 text-red-400/60 hover:text-red-400 hover:bg-red-500/10 rounded transition disabled:opacity-40"
    >
      {pending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
    </button>
  )
}

export function GrantAccessButton({ userId, name }: { userId: string; name: string }) {
  const [pending, startTransition] = useTransition()
  return (
    <button
      onClick={() => {
        if (!confirm(`Daj pristup tečaju studentu ${name}?`)) return
        startTransition(() => grantAccess(userId))
      }}
      disabled={pending}
      title="Daj pristup tečaju"
      className="flex items-center gap-1 px-2 py-1 text-xs text-gold border border-gold/30 rounded hover:bg-gold/10 transition disabled:opacity-40"
    >
      {pending ? <Loader2 className="w-3 h-3 animate-spin" /> : <Unlock className="w-3 h-3" />}
      Aktiviraj
    </button>
  )
}

export function RevokeAccessButton({ userId, name }: { userId: string; name: string }) {
  const [pending, startTransition] = useTransition()
  return (
    <button
      onClick={() => {
        if (!confirm(`Oduzmi pristup tečaju studentu ${name}?`)) return
        startTransition(() => revokeAccess(userId))
      }}
      disabled={pending}
      title="Oduzmi pristup tečaju"
      className="flex items-center gap-1 px-2 py-1 text-xs text-red-400 border border-red-500/30 rounded hover:bg-red-500/10 transition disabled:opacity-40"
    >
      {pending ? <Loader2 className="w-3 h-3 animate-spin" /> : <Lock className="w-3 h-3" />}
      Oduzmi pristup
    </button>
  )
}

export function RevokeAffiliateButton({ userId, name }: { userId: string; name: string }) {
  const [pending, startTransition] = useTransition()
  return (
    <button
      onClick={() => {
        if (!confirm(`Oduzmi affiliate status studentu ${name}?`)) return
        startTransition(() => revokeAffiliate(userId))
      }}
      disabled={pending}
      title="Oduzmi affiliate"
      className="flex items-center gap-1 px-2 py-1 text-xs text-orange-400 border border-orange-500/30 rounded hover:bg-orange-500/10 transition disabled:opacity-40"
    >
      {pending ? <Loader2 className="w-3 h-3 animate-spin" /> : <UserMinus className="w-3 h-3" />}
      Oduzmi affiliate
    </button>
  )
}

export function GrantAffiliateButton({ userId, name }: { userId: string; name: string }) {
  const [pending, startTransition] = useTransition()
  return (
    <button
      onClick={() => {
        if (!confirm(`Daj affiliate status studentu ${name}?`)) return
        startTransition(() => grantAffiliate(userId))
      }}
      disabled={pending}
      title="Daj affiliate"
      className="flex items-center gap-1 px-2 py-1 text-xs text-green-400 border border-green-500/30 rounded hover:bg-green-500/10 transition disabled:opacity-40"
    >
      {pending ? <Loader2 className="w-3 h-3 animate-spin" /> : <UserPlus className="w-3 h-3" />}
      Daj affiliate
    </button>
  )
}
