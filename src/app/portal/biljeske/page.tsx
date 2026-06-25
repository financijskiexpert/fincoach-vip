import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient, createServiceClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { NotebookPen, PlayCircle } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function MyNotesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/prijava?redirect=/portal/biljeske')

  const service = await createServiceClient()

  const { data: notes } = await service
    .from('notes')
    .select('lesson_id, content, updated_at, lessons(day_number, title, section)')
    .eq('user_id', user.id)
    .order('updated_at', { ascending: false })

  const filled = (notes ?? []).filter(n => n.content && n.content.trim().length > 0)

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-gold/10 border border-gold/30 flex items-center justify-center">
          <NotebookPen className="w-5 h-5 text-gold" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Moje bilješke</h1>
          <p className="text-white/50 text-sm mt-0.5">
            {filled.length === 0 ? 'Još nemaš zapisanih bilješki.' : `${filled.length} zapisanih bilješki`}
          </p>
        </div>
      </div>

      {filled.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <NotebookPen className="w-12 h-12 text-white/20 mx-auto mb-4" />
            <p className="text-white/50 text-sm mb-4">
              Tijekom svake lekcije možeš zapisati svoje misli, zadatke i uvide.<br />
              Sve tvoje bilješke pojavit će se na ovoj stranici.
            </p>
            <Link
              href="/portal/dan/1"
              className="inline-flex items-center gap-2 bg-gold text-navy font-bold px-4 py-2 rounded-lg text-sm hover:bg-yellow-400 transition"
            >
              <PlayCircle className="w-4 h-4" />
              Idi na Dan 1
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filled.map((n: any) => {
            const lesson = Array.isArray(n.lessons) ? n.lessons[0] : n.lessons
            const dayNum = lesson?.day_number ?? '?'
            const title = lesson?.title ?? 'Lekcija'
            return (
              <Card key={n.lesson_id} className="hover:border-gold/30 transition-colors">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <Badge className="bg-navy text-white/70 border-white/10">Dan {dayNum}</Badge>
                      <CardTitle className="text-base">{title}</CardTitle>
                    </div>
                    <Link
                      href={`/portal/dan/${dayNum}`}
                      className="text-gold hover:text-yellow-400 text-xs font-medium flex items-center gap-1"
                    >
                      <PlayCircle className="w-3 h-3" />
                      Otvori lekciju
                    </Link>
                  </div>
                  <p className="text-white/30 text-xs">
                    Zadnja izmjena: {new Date(n.updated_at).toLocaleString('hr-HR')}
                  </p>
                </CardHeader>
                <CardContent>
                  <p className="text-white/70 text-sm whitespace-pre-wrap leading-relaxed">{n.content}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
