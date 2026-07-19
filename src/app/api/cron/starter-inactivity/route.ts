import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { sendStarterReengagementEmail } from '@/lib/brevo'

export const dynamic = 'force-dynamic'

function isAuthorized(request: NextRequest): boolean {
  const cronSecret = process.env.CRON_SECRET
  const headerToken = request.headers.get('authorization')?.replace('Bearer ', '')
  const queryToken = request.nextUrl.searchParams.get('token')
  const token = headerToken ?? queryToken
  if (!cronSecret || token !== cronSecret) return false
  return true
}

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Neovlašteni pristup.' }, { status: 401 })
  }

  const supabase = await createServiceClient()
  const now = new Date()
  const twoDaysAgo = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString()
  const fiveDaysAgo = new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString()
  const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000).toISOString()

  // Active Starter users who haven't been seen for 2+ days (but purchase is under 60 days old)
  const { data: purchases, error } = await supabase
    .from('starter_purchases')
    .select('email, full_name, last_seen_starter, created_at')
    .eq('status', 'active')
    .gte('created_at', sixtyDaysAgo)
    .or(`last_seen_starter.is.null,last_seen_starter.lt.${twoDaysAgo}`)

  if (error) {
    console.error('Starter inactivity cron — greška pri dohvatu:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  if (!purchases || purchases.length === 0) {
    return NextResponse.json({ processed: 0, message: 'Nema korisnika za provjeru.' })
  }

  // Fetch who already got a reminder in the last 5 days
  const emails = purchases.map((p) => p.email)
  const { data: recentReminders } = await supabase
    .from('starter_inactivity_reminders')
    .select('email')
    .in('email', emails)
    .gte('sent_at', fiveDaysAgo)

  const recentlyRemindedEmails = new Set((recentReminders ?? []).map((r) => r.email))

  let sent = 0
  let skipped = 0
  let failed = 0

  for (const purchase of purchases) {
    try {
      if (recentlyRemindedEmails.has(purchase.email)) {
        skipped++
        continue
      }

      await sendStarterReengagementEmail(purchase.email, purchase.full_name ?? '')

      await supabase.from('starter_inactivity_reminders').insert({
        email: purchase.email,
        sent_at: now.toISOString(),
      })

      sent++
    } catch (err) {
      console.error(`Starter inactivity — greška za ${purchase.email}:`, err)
      failed++
    }
  }

  return NextResponse.json({ processed: purchases.length, sent, skipped, failed })
}
