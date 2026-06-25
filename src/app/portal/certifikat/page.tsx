import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient, createServiceClient } from '@/lib/supabase/server'

const CROATIAN_MONTHS = [
  'siječnja', 'veljače', 'ožujka', 'travnja', 'svibnja', 'lipnja',
  'srpnja', 'kolovoza', 'rujna', 'listopada', 'studenog', 'prosinca',
]

function formatCroatianDate(date: Date): string {
  const day = date.getDate()
  const month = CROATIAN_MONTHS[date.getMonth()]
  const year = date.getFullYear()
  return `${day}. ${month} ${year}.`
}

export default async function CertifikatPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/prijava')

  const service = await createServiceClient()

  const { data: profile } = await service
    .from('profiles')
    .select('full_name, email')
    .eq('id', user.id)
    .single()

  const { data: course } = await service
    .from('courses')
    .select('id')
    .eq('slug', 'volim-svojnovac')
    .single()

  let completedCount = 0
  let totalLessons = 90

  if (course) {
    const { count: lessonCount } = await service
      .from('lessons')
      .select('id', { count: 'exact', head: true })
      .eq('course_id', course.id)

    totalLessons = lessonCount ?? 90

    const { data: courseLessons } = await service
      .from('lessons')
      .select('id')
      .eq('course_id', course.id)

    const lessonIds = (courseLessons ?? []).map((l: { id: string }) => l.id)

    const { count: progressCount } = await service
      .from('progress')
      .select('lesson_id', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .in('lesson_id', lessonIds)

    completedCount = progressCount ?? 0
  }

  const isCompleted = completedCount >= totalLessons
  const progressPercent = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0
  const fullName = profile?.full_name ?? user.email ?? 'Polaznik/ca'
  const completionDate = formatCroatianDate(new Date())

  if (!isCompleted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center">
          <div className="mb-6">
            <svg
              className="w-20 h-20 mx-auto mb-4 text-white/20"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
              />
            </svg>
            <h1 className="text-2xl font-bold text-white mb-2">
              Još niste završili program
            </h1>
            <p className="text-white/60 mb-6">
              Certifikat ćete dobiti nakon što završite svih {totalLessons} lekcija programa
              &ldquo;Volim Svoj Novac&rdquo;.
            </p>
          </div>

          {/* Progress bar */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-6">
            <div className="flex justify-between text-sm mb-3">
              <span className="text-white/60">Vaš napredak</span>
              <span className="text-[#D4AF37] font-bold">{completedCount} / {totalLessons} lekcija</span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${progressPercent}%`,
                  background: 'linear-gradient(90deg, #D4AF37, #f0d060)',
                }}
              />
            </div>
            <p className="text-white/40 text-xs mt-2">{progressPercent}% završeno</p>
          </div>

          <Link
            href="/portal"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all hover:opacity-90 active:scale-95"
            style={{ background: 'linear-gradient(135deg, #D4AF37, #f0d060)', color: '#0f1e35' }}
          >
            ← Natrag na portal
          </Link>
        </div>
      </div>
    )
  }

  // Completed — show certificate
  return (
    <>
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; margin: 0 !important; }
          .cert-page-wrap { padding: 0 !important; min-height: unset !important; }
          .cert-card { box-shadow: none !important; }
        }
      `}</style>

      {/* Action bar — hidden on print */}
      <div className="no-print flex justify-center py-6 gap-4 flex-wrap">
        <Link
          href="/portal"
          className="px-5 py-2.5 rounded-xl border border-white/20 text-white/70 hover:text-white hover:border-white/40 transition-all text-sm font-medium"
        >
          ← Natrag na portal
        </Link>
        <button
          onClick={() => window.print()}
          className="px-6 py-2.5 rounded-xl font-semibold text-sm transition-all hover:opacity-90 active:scale-95 cursor-pointer"
          style={{ background: 'linear-gradient(135deg, #D4AF37, #f0d060)', color: '#0f1e35' }}
        >
          Preuzmi / Ispis
        </button>
      </div>

      {/* Certificate page */}
      <div
        className="cert-page-wrap flex items-center justify-center px-4 pb-12"
        style={{ minHeight: 'calc(100vh - 120px)' }}
      >
        {/* Outer gold frame */}
        <div
          className="cert-card w-full"
          style={{
            maxWidth: '820px',
            background: 'linear-gradient(135deg, #D4AF37 0%, #f5e08a 25%, #b8902a 50%, #f5e08a 75%, #D4AF37 100%)',
            padding: '5px',
            borderRadius: '6px',
            boxShadow: '0 25px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(212,175,55,0.2)',
          }}
        >
          {/* Navy inner */}
          <div
            style={{
              background: '#0f1e35',
              borderRadius: '3px',
              padding: '56px 64px',
              position: 'relative',
            }}
          >
            {/* Inner thin gold border */}
            <div
              style={{
                position: 'absolute',
                inset: '18px',
                border: '1px solid rgba(212,175,55,0.25)',
                borderRadius: '2px',
                pointerEvents: 'none',
              }}
            />

            {/* Corner decorations — top-left */}
            <div style={{ position: 'absolute', top: '14px', left: '14px', width: '28px', height: '28px', borderTop: '2px solid #D4AF37', borderLeft: '2px solid #D4AF37' }} />
            {/* top-right */}
            <div style={{ position: 'absolute', top: '14px', right: '14px', width: '28px', height: '28px', borderTop: '2px solid #D4AF37', borderRight: '2px solid #D4AF37' }} />
            {/* bottom-left */}
            <div style={{ position: 'absolute', bottom: '14px', left: '14px', width: '28px', height: '28px', borderBottom: '2px solid #D4AF37', borderLeft: '2px solid #D4AF37' }} />
            {/* bottom-right */}
            <div style={{ position: 'absolute', bottom: '14px', right: '14px', width: '28px', height: '28px', borderBottom: '2px solid #D4AF37', borderRight: '2px solid #D4AF37' }} />

            {/* Certificate content */}
            <div style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>

              {/* Brand label */}
              <p
                style={{
                  fontFamily: 'Georgia, "Times New Roman", serif',
                  fontSize: '12px',
                  letterSpacing: '6px',
                  textTransform: 'uppercase',
                  color: 'rgba(212,175,55,0.6)',
                  marginBottom: '6px',
                }}
              >
                FinCoach &nbsp;·&nbsp; VIP
              </p>

              {/* Top ornament rule */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '14px', marginBottom: '36px' }}>
                <div style={{ flex: 1, height: '1px', background: 'linear-gradient(to right, transparent, rgba(212,175,55,0.5))' }} />
                <span style={{ color: '#D4AF37', fontSize: '14px' }}>✦</span>
                <div style={{ flex: 1, height: '1px', background: 'linear-gradient(to left, transparent, rgba(212,175,55,0.5))' }} />
              </div>

              {/* CERTIFIKAT */}
              <h1
                style={{
                  fontFamily: 'Georgia, "Times New Roman", serif',
                  fontSize: 'clamp(24px, 4.5vw, 40px)',
                  fontWeight: 700,
                  letterSpacing: '8px',
                  textTransform: 'uppercase',
                  color: '#D4AF37',
                  marginBottom: '6px',
                  lineHeight: 1.15,
                }}
              >
                Certifikat
              </h1>
              <p
                style={{
                  fontFamily: 'Georgia, "Times New Roman", serif',
                  fontSize: 'clamp(10px, 1.8vw, 13px)',
                  letterSpacing: '5px',
                  textTransform: 'uppercase',
                  color: 'rgba(212,175,55,0.55)',
                  marginBottom: '44px',
                }}
              >
                o završetku programa
              </p>

              {/* Confirmation text */}
              <p
                style={{
                  fontFamily: 'Georgia, "Times New Roman", serif',
                  fontStyle: 'italic',
                  fontSize: '15px',
                  color: 'rgba(255,255,255,0.55)',
                  marginBottom: '18px',
                }}
              >
                Ovim se potvrđuje da je
              </p>

              {/* Student name */}
              <h2
                style={{
                  fontFamily: 'Georgia, "Times New Roman", serif',
                  fontSize: 'clamp(30px, 5.5vw, 56px)',
                  fontWeight: 700,
                  color: '#D4AF37',
                  letterSpacing: '1px',
                  lineHeight: 1.1,
                  marginBottom: '18px',
                  textShadow: '0 2px 20px rgba(212,175,55,0.3)',
                }}
              >
                {fullName}
              </h2>

              <p
                style={{
                  fontFamily: 'Georgia, "Times New Roman", serif',
                  fontStyle: 'italic',
                  fontSize: '15px',
                  color: 'rgba(255,255,255,0.55)',
                  marginBottom: '14px',
                }}
              >
                uspješno završio/la program
              </p>

              {/* Program title */}
              <p
                style={{
                  fontFamily: 'Georgia, "Times New Roman", serif',
                  fontSize: 'clamp(18px, 3vw, 26px)',
                  fontWeight: 700,
                  color: '#ffffff',
                  marginBottom: '6px',
                  letterSpacing: '0.5px',
                }}
              >
                Volim Svoj Novac
              </p>
              <p
                style={{
                  fontFamily: 'Georgia, serif',
                  fontSize: '12px',
                  letterSpacing: '3px',
                  textTransform: 'uppercase',
                  color: 'rgba(212,175,55,0.5)',
                  marginBottom: '44px',
                }}
              >
                90 dana do financijske slobode
              </p>

              {/* Middle ornament rule */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '14px', marginBottom: '40px' }}>
                <div style={{ flex: 1, height: '1px', background: 'rgba(212,175,55,0.2)' }} />
                <span style={{ color: '#D4AF37', fontSize: '18px' }}>✦</span>
                <div style={{ flex: 1, height: '1px', background: 'rgba(212,175,55,0.2)' }} />
              </div>

              {/* Date + seal + signature */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-end',
                  gap: '20px',
                  flexWrap: 'wrap',
                }}
              >
                {/* Date column */}
                <div style={{ textAlign: 'left', flex: '1 1 140px' }}>
                  <p style={{ fontSize: '10px', letterSpacing: '3px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: '6px' }}>
                    Datum završetka
                  </p>
                  <p style={{ fontFamily: 'Georgia, serif', fontSize: '15px', color: 'rgba(255,255,255,0.85)' }}>
                    {completionDate}
                  </p>
                </div>

                {/* Seal */}
                <div style={{ flex: '0 0 auto', textAlign: 'center' }}>
                  <div
                    style={{
                      width: '76px',
                      height: '76px',
                      borderRadius: '50%',
                      border: '2px solid #D4AF37',
                      background: 'radial-gradient(circle, rgba(212,175,55,0.12) 0%, transparent 70%)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto',
                    }}
                  >
                    <span style={{ fontSize: '24px', color: '#D4AF37', lineHeight: 1 }}>★</span>
                    <span style={{ fontSize: '7px', letterSpacing: '1.5px', color: 'rgba(212,175,55,0.7)', fontFamily: 'Georgia, serif', marginTop: '2px' }}>
                      OFFICIAL
                    </span>
                  </div>
                </div>

                {/* Signature column */}
                <div style={{ textAlign: 'right', flex: '1 1 140px' }}>
                  <div
                    style={{
                      height: '1px',
                      background: 'linear-gradient(to left, rgba(212,175,55,0.6), transparent)',
                      marginBottom: '8px',
                      marginLeft: 'auto',
                      width: '150px',
                    }}
                  />
                  <p style={{ fontFamily: 'Georgia, serif', fontSize: '15px', color: 'rgba(255,255,255,0.85)', marginBottom: '3px' }}>
                    Brane Rečak
                  </p>
                  <p style={{ fontSize: '11px', letterSpacing: '1px', color: 'rgba(212,175,55,0.55)' }}>
                    Financijski coach
                  </p>
                </div>
              </div>

              {/* Bottom brand footer */}
              <div
                style={{
                  marginTop: '36px',
                  paddingTop: '22px',
                  borderTop: '1px solid rgba(212,175,55,0.12)',
                }}
              >
                <p
                  style={{
                    fontFamily: 'Georgia, serif',
                    fontSize: '10px',
                    letterSpacing: '3px',
                    textTransform: 'uppercase',
                    color: 'rgba(212,175,55,0.35)',
                  }}
                >
                  fincoach.vip &nbsp;·&nbsp; FinCoach VIP Program
                </p>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* Social share hint — hidden on print */}
      <p className="no-print text-center text-white/30 text-xs pb-8">
        Podijeli ovaj certifikat na LinkedIn-u kao dokaz o završenom obrazovanju.
      </p>
    </>
  )
}
