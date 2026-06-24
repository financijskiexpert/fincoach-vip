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

interface HealthStats {
  studentsCount: number
  completedPurchasesCount: number
  lessonsCount: number
  lastEmailSentAt: string | null
  pendingAffiliateConversions: number
  checkedAt: string
  errors: string[]
}

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Neovlašteni pristup.' }, { status: 401 })
  }

  const supabase = await createServiceClient()
  const checkedAt = new Date().toISOString()
  const errors: string[] = []

  // a. Broj studenata
  let studentsCount = 0
  {
    const { count, error } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .eq('role', 'student')
    if (error) {
      errors.push(`profiles: ${error.message}`)
    } else {
      studentsCount = count ?? 0
    }
  }

  // b. Broj završenih kupnji
  let completedPurchasesCount = 0
  {
    const { count, error } = await supabase
      .from('purchases')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'completed')
    if (error) {
      errors.push(`purchases: ${error.message}`)
    } else {
      completedPurchasesCount = count ?? 0
    }
  }

  // c. Broj lekcija
  let lessonsCount = 0
  {
    const { count, error } = await supabase
      .from('lessons')
      .select('*', { count: 'exact', head: true })
    if (error) {
      errors.push(`lessons: ${error.message}`)
    } else {
      lessonsCount = count ?? 0
    }
  }

  // d. Zadnji poslani email iz email_logs (ako tablica postoji)
  let lastEmailSentAt: string | null = null
  {
    const { data, error } = await supabase
      .from('email_logs')
      .select('sent_at')
      .order('sent_at', { ascending: false })
      .limit(1)
      .maybeSingle()
    if (error) {
      // Tablica možda ne postoji — tiho preskoči
      if (!error.message.includes('does not exist') && !error.message.includes('relation')) {
        errors.push(`email_logs: ${error.message}`)
      }
    } else {
      lastEmailSentAt = data?.sent_at ?? null
    }
  }

  // e. Broj pending affiliate konverzija
  let pendingAffiliateConversions = 0
  {
    const { count, error } = await supabase
      .from('affiliate_conversions')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending')
    if (error) {
      if (!error.message.includes('does not exist') && !error.message.includes('relation')) {
        errors.push(`affiliate_conversions: ${error.message}`)
      }
    } else {
      pendingAffiliateConversions = count ?? 0
    }
  }

  const stats: HealthStats = {
    studentsCount,
    completedPurchasesCount,
    lessonsCount,
    lastEmailSentAt,
    pendingAffiliateConversions,
    checkedAt,
    errors,
  }

  // Pošalji izvještaj emailom
  const notifyEmail = process.env.NOTIFY_EMAIL ?? 'brane.recek@gmail.com'

  const formattedDate = new Date(checkedAt).toLocaleString('hr-HR', {
    timeZone: 'Europe/Zagreb',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

  const lastEmailDisplay = lastEmailSentAt
    ? new Date(lastEmailSentAt).toLocaleString('hr-HR', {
        timeZone: 'Europe/Zagreb',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : 'Nema podataka'

  const errorsBlock =
    errors.length > 0
      ? `
        <div style="background: #2d1515; border: 1px solid #e53e3e; border-radius: 8px; padding: 16px; margin-top: 20px;">
          <p style="color: #fc8181; font-weight: 700; margin: 0 0 8px 0;">Greške pri provjeri:</p>
          ${errors.map((e) => `<p style="color: #feb2b2; margin: 4px 0; font-size: 13px;">• ${e}</p>`).join('')}
        </div>`
      : `<p style="color: #68d391; margin-top: 20px;">Sve provjere su prošle bez grešaka.</p>`

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Inter, sans-serif; background: #f8f9fa; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 40px auto; background: #0D1B2A; border-radius: 12px; overflow: hidden; }
        .header { background: linear-gradient(135deg, #0D1B2A 0%, #1a2f47 100%); padding: 40px; text-align: center; }
        .logo { color: #D4AF37; font-size: 24px; font-weight: 700; letter-spacing: 1px; }
        .subtitle { color: #718096; font-size: 13px; margin-top: 6px; }
        .body { padding: 40px; color: #ffffff; }
        .h1 { color: #D4AF37; font-size: 22px; font-weight: 700; margin-bottom: 24px; }
        .stat-row { display: flex; justify-content: space-between; align-items: center; padding: 14px 0; border-bottom: 1px solid #1a2f47; }
        .stat-label { color: #a0aec0; font-size: 14px; }
        .stat-value { color: #ffffff; font-size: 20px; font-weight: 700; }
        .stat-value.highlight { color: #D4AF37; }
        .stat-value.warning { color: #f6ad55; }
        .footer { background: #091623; padding: 24px 40px; text-align: center; color: #4a5568; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">FinCoach VIP</div>
          <div class="subtitle">Dnevni zdravstveni izvještaj</div>
        </div>
        <div class="body">
          <div class="h1">Stanje platforme — ${formattedDate}</div>
          <div class="stat-row">
            <span class="stat-label">Broj studenata</span>
            <span class="stat-value highlight">${studentsCount}</span>
          </div>
          <div class="stat-row">
            <span class="stat-label">Završene kupnje</span>
            <span class="stat-value">${completedPurchasesCount}</span>
          </div>
          <div class="stat-row">
            <span class="stat-label">Broj lekcija</span>
            <span class="stat-value">${lessonsCount}</span>
          </div>
          <div class="stat-row">
            <span class="stat-label">Zadnji poslani email</span>
            <span class="stat-value" style="font-size: 14px; color: #a0aec0;">${lastEmailDisplay}</span>
          </div>
          <div class="stat-row" style="border-bottom: none;">
            <span class="stat-label">Čekaju affiliate konverzije</span>
            <span class="stat-value ${pendingAffiliateConversions > 0 ? 'warning' : ''}">${pendingAffiliateConversions}</span>
          </div>
          ${errorsBlock}
        </div>
        <div class="footer">
          © 2026 FinCoach VIP · Automatski izvještaj
        </div>
      </div>
    </body>
    </html>
  `

  try {
    await sendTransactionalEmail({
      to: [{ email: notifyEmail, name: 'Brane' }],
      subject: 'FinCoach VIP - Dnevni zdravstveni izvještaj',
      htmlContent,
    })
  } catch (emailErr) {
    console.error('Health-check: greška pri slanju izvještajnog emaila:', emailErr)
    errors.push(`email: ${String(emailErr)}`)
  }

  return NextResponse.json(stats)
}
