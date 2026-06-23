import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { sendTransactionalEmail } from '@/lib/brevo'

export const dynamic = 'force-dynamic'

// Zaščita cron endpointa z secret tokenom
// Podpira Authorization header (Vercel Pro / ročni klici) in query param ?token= (Vercel Hobby / cron-job.org)
function isAuthorized(request: NextRequest): boolean {
  const cronSecret = process.env.CRON_SECRET
  const headerToken = request.headers.get('authorization')?.replace('Bearer ', '')
  const queryToken = request.nextUrl.searchParams.get('token')
  const token = headerToken ?? queryToken

  if (!cronSecret || token !== cronSecret) return false
  return true
}

function buildReminderEmail(name: string): string {
  const firstName = name?.split(' ')[0] ?? 'Prijatelju'
  const portalUrl = 'https://fincoach.vip/portal'
  const unsubscribeUrl = `${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://fincoach.vip'}/odjava`

  return `<!DOCTYPE html>
<html lang="hr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: Inter, Arial, sans-serif; background: #f4f6f9; margin: 0; padding: 0; }
    .wrapper { max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 24px rgba(10,22,40,0.10); }
    .header { background: linear-gradient(135deg, #0A1628 0%, #162540 100%); padding: 40px 40px 32px; text-align: center; }
    .logo { color: #F5A623; font-size: 22px; font-weight: 700; letter-spacing: 1px; }
    .body { padding: 40px; color: #1a1a2e; }
    .h1 { color: #0A1628; font-size: 26px; font-weight: 700; margin: 0 0 20px 0; line-height: 1.3; }
    .p { color: #4a5568; line-height: 1.75; font-size: 16px; margin: 0 0 18px 0; }
    .highlight { color: #0A1628; font-weight: 600; }
    .cta-wrap { text-align: center; margin: 32px 0; }
    .btn {
      display: inline-block;
      background: #F5A623;
      color: #0A1628;
      padding: 16px 36px;
      border-radius: 8px;
      text-decoration: none;
      font-weight: 700;
      font-size: 17px;
      letter-spacing: 0.3px;
    }
    .divider { border: none; border-top: 1px solid #e8ecf0; margin: 28px 0; }
    .contact { color: #718096; font-size: 14px; margin: 0 0 6px 0; }
    .contact a { color: #F5A623; text-decoration: none; }
    .footer { background: #f0f3f7; padding: 24px 40px; text-align: center; }
    .footer-text { color: #9aa5b4; font-size: 12px; margin: 0; line-height: 1.7; }
    .footer-text a { color: #9aa5b4; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <div class="logo">FinCoach VIP</div>
    </div>
    <div class="body">
      <p class="p">Hej <span class="highlight">${firstName}</span>,</p>
      <div class="h1">Čekamo te! Nastavi s tečajem Volim Svoj Novac 👋</div>
      <p class="p">
        Primijetili smo da nisi bio/bila aktivan/na na platformi već nekoliko dana.
      </p>
      <p class="p">
        <span class="highlight">Online tečaj Volim Svoj Novac važna je prekretnica u tvom životu</span> —
        svaka lekcija je korak koji te vodi bliže financijskoj slobodi. Bilo bi šteta stati sada kada si već krenuo/la.
      </p>
      <p class="p">
        Sve lekcije čekaju tamo gdje si stao/stala. Samo se vrati i nastavi.
      </p>
      <div class="cta-wrap">
        <a href="${portalUrl}" class="btn">Nastavi tečaj →</a>
      </div>
      <hr class="divider">
      <p class="contact">Za sva pitanja dostupan sam na: <a href="mailto:brane@fincoach.vip">brane@fincoach.vip</a></p>
      <p class="p" style="margin-top: 16px; font-size: 15px;">Navijam za tebe! 💪</p>
      <p class="p" style="margin-bottom: 0;"><strong>Brane</strong><br><span style="color:#718096; font-size:14px;">Financijski coach</span></p>
    </div>
    <div class="footer">
      <p class="footer-text">
        © 2026 FinCoach VIP &nbsp;·&nbsp;
        <a href="${unsubscribeUrl}">Odjava s mailing liste</a>
      </p>
    </div>
  </div>
</body>
</html>`
}

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Neovlašteni pristup.' }, { status: 401 })
  }

  const supabase = await createServiceClient()
  const now = new Date()
  const twoDaysAgo = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString()
  const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString()

  // 1. Dohvati sve aktivne studente (kupili tečaj)
  const { data: purchases, error: purchasesError } = await supabase
    .from('purchases')
    .select('user_id')
    .eq('status', 'completed')

  if (purchasesError) {
    console.error('Inactivity reminder — greška pri dohvatu kupaca:', purchasesError)
    return NextResponse.json({ error: purchasesError.message }, { status: 500 })
  }

  if (!purchases || purchases.length === 0) {
    return NextResponse.json({ processed: 0, message: 'Nema aktivnih studenata.' })
  }

  const userIds = purchases.map((p) => p.user_id)

  // 2. Dohvati profile (email + ime)
  const { data: profiles, error: profilesError } = await supabase
    .from('profiles')
    .select('id, email, full_name')
    .in('id', userIds)

  if (profilesError) {
    console.error('Inactivity reminder — greška pri dohvatu profila:', profilesError)
    return NextResponse.json({ error: profilesError.message }, { status: 500 })
  }

  // 3. Dohvati zadnju aktivnost za svaki user_id
  const { data: progressData, error: progressError } = await supabase
    .from('progress')
    .select('user_id, completed_at')
    .in('user_id', userIds)

  if (progressError) {
    console.error('Inactivity reminder — greška pri dohvatu progresa:', progressError)
    return NextResponse.json({ error: progressError.message }, { status: 500 })
  }

  // Izgradi mapu: user_id → zadnji completed_at
  const lastActivityMap: Record<string, string | null> = {}
  for (const row of progressData ?? []) {
    const existing = lastActivityMap[row.user_id]
    if (!existing || row.completed_at > existing) {
      lastActivityMap[row.user_id] = row.completed_at
    }
  }

  // 4. Dohvati nedavno poslane remindere (zadnja 3 dana)
  const { data: recentReminders } = await supabase
    .from('inactivity_reminders')
    .select('user_id')
    .in('user_id', userIds)
    .gte('sent_at', threeDaysAgo)

  const recentlyRemindedIds = new Set((recentReminders ?? []).map((r) => r.user_id))

  let sent = 0
  let skipped = 0
  let failed = 0

  for (const profile of profiles ?? []) {
    try {
      // Provjeri je li nedavno već dobio reminder
      if (recentlyRemindedIds.has(profile.id)) {
        skipped++
        continue
      }

      // Provjeri zadnju aktivnost: neaktivan 2+ dana ili nikad nije bio aktivan
      const lastActivity = lastActivityMap[profile.id] ?? null
      const isInactive = !lastActivity || lastActivity < twoDaysAgo

      if (!isInactive) {
        skipped++
        continue
      }

      // Pošalji reminder email
      await sendTransactionalEmail({
        to: [{ email: profile.email, name: profile.full_name ?? '' }],
        subject: 'Čekamo te! 👋 Nastavi s tečajem Volim Svoj Novac',
        htmlContent: buildReminderEmail(profile.full_name ?? ''),
      })

      // Zabilježi u inactivity_reminders
      await supabase.from('inactivity_reminders').insert({
        user_id: profile.id,
        sent_at: now.toISOString(),
      })

      sent++
    } catch (err) {
      console.error(`Inactivity reminder — greška za ${profile.email}:`, err)
      failed++
    }
  }

  return NextResponse.json({
    processed: (profiles ?? []).length,
    sent,
    skipped,
    failed,
  })
}
