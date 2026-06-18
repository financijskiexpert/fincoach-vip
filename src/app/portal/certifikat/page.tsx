import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Award } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default async function CertifikatPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/prijava')

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name')
    .eq('id', user.id)
    .single()

  const { data: course } = await supabase
    .from('courses')
    .select('id')
    .eq('slug', 'volim-svojnovac')
    .single()

  // Check completion
  const { count: completedCount } = await supabase
    .from('progress')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)

  const totalLessons = 90
  const isComplete = (completedCount ?? 0) >= totalLessons

  if (!isComplete) redirect('/portal')

  const name = profile?.full_name ?? 'Polaznik'
  const today = new Date().toLocaleDateString('hr-HR', { day: 'numeric', month: 'long', year: 'numeric' })

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <div className="text-center mb-10">
        <Award className="w-16 h-16 text-gold mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-white mb-2">Tvoj certifikat je spreman!</h1>
        <p className="text-white/50">Čestitamo na završetku 90-dnevnog programa.</p>
      </div>

      {/* Certificate */}
      <div
        id="certificate"
        className="bg-gradient-to-br from-[#0D1B2A] to-[#1a2f47] border-2 border-gold/40 rounded-3xl p-10 sm:p-14 text-center relative overflow-hidden"
      >
        {/* Decorative corners */}
        <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-gold/30 rounded-tl-lg" />
        <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-gold/30 rounded-tr-lg" />
        <div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-gold/30 rounded-bl-lg" />
        <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-gold/30 rounded-br-lg" />

        <div className="text-gold text-sm font-semibold tracking-widest uppercase mb-6 opacity-70">
          FinCoach VIP
        </div>

        <div className="text-white/50 text-base mb-3">Ovim se potvrđuje da je</div>

        <div className="text-4xl sm:text-5xl font-black text-gold mb-4 leading-tight">
          {name}
        </div>

        <div className="text-white/60 text-base mb-8 leading-relaxed max-w-md mx-auto">
          uspješno završio/la <strong className="text-white">90-dnevni program financijske pismenosti</strong>{' '}
          i stekao/la praktična znanja i vještine za upravljanje osobnim financijama.
        </div>

        <div className="flex items-center justify-center gap-8 mb-8">
          <div className="text-center">
            <div className="text-2xl font-bold text-gold">90</div>
            <div className="text-white/40 text-xs">Dana programa</div>
          </div>
          <div className="w-px h-10 bg-white/10" />
          <div className="text-center">
            <div className="text-2xl font-bold text-gold">90</div>
            <div className="text-white/40 text-xs">Završenih lekcija</div>
          </div>
          <div className="w-px h-10 bg-white/10" />
          <div className="text-center">
            <div className="text-2xl font-bold text-gold">100%</div>
            <div className="text-white/40 text-xs">Napredak</div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-left">
            <div className="text-white/30 text-xs mb-1">Datum završetka</div>
            <div className="text-white/70 text-sm font-medium">{today}</div>
          </div>
          <div className="text-right">
            <div className="text-white/30 text-xs mb-1">Mentor</div>
            <div className="text-white/70 text-sm font-medium">Brane Recek</div>
            <div className="text-gold/50 text-xs">Financijski coach</div>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
        <Button onClick={() => window.print()} size="lg" className="gap-2">
          🖨️ Isprintaj / Spremi PDF
        </Button>
        <Link href="/portal">
          <Button variant="outline" size="lg">← Natrag na portal</Button>
        </Link>
      </div>

      <p className="text-center text-white/30 text-xs mt-6">
        Možeš podijeliti ovaj certifikat na LinkedIn kao dokaz o završenom obrazovanju.
      </p>
    </div>
  )
}
