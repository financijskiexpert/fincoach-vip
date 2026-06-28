import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { buildEmailContent, EMAIL_SEQUENCE } from '@/lib/email-sequence'
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

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Neovlašteni pristup.' }, { status: 401 })
  }

  const supabase = await createServiceClient()
  const now = new Date().toISOString()

  // Dohvati sve due emailove + affiliate_code leada
  const { data: dueEmails, error } = await supabase
    .from('email_sequence_queue')
    .select('*, leads(affiliate_code)')
    .eq('status', 'pending')
    .lte('scheduled_at', now)
    .limit(50)

  if (error) {
    console.error('Email sequence cron error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  if (!dueEmails || dueEmails.length === 0) {
    return NextResponse.json({ processed: 0, message: 'Nema emailova za slanje.' })
  }

  let sent = 0
  let skipped = 0
  let failed = 0

  for (const item of dueEmails) {
    try {
      // Provjeri je li lead već kupio tečaj
      const seq = EMAIL_SEQUENCE[item.sequence_index]
      if (seq?.skipIfPurchased) {
        const { data: purchase } = await supabase
          .from('purchases')
          .select('id')
          .eq('status', 'completed')
          .then(async () => {
            // Pronađi user po emailu
            const { data: profile } = await supabase
              .from('profiles')
              .select('id')
              .eq('email', item.email.toLowerCase())
              .single()
            if (!profile) return { data: null }
            return supabase
              .from('purchases')
              .select('id')
              .eq('user_id', profile.id)
              .eq('status', 'completed')
              .single()
          })

        if (purchase) {
          // Lead je već kupio — preskoči prodajni email
          await supabase
            .from('email_sequence_queue')
            .update({ status: 'skipped', sent_at: now })
            .eq('id', item.id)
          skipped++
          continue
        }
      }

      // Generiraj sadržaj emaila (affiliate lead → bez PRIJATELJU koda u prodajnim emailima)
      const affiliateCode = (item as any).leads?.affiliate_code ?? null
      const emailContent = buildEmailContent(item.sequence_index, item.full_name ?? 'Prijatelju', item.email, affiliateCode)
      if (!emailContent) {
        await supabase
          .from('email_sequence_queue')
          .update({ status: 'skipped', sent_at: now })
          .eq('id', item.id)
        skipped++
        continue
      }

      // Pošalji email
      await sendTransactionalEmail({
        to: [{ email: item.email, name: item.full_name ?? '' }],
        subject: emailContent.subject,
        htmlContent: emailContent.html,
      })

      // Označi kao poslano
      await supabase
        .from('email_sequence_queue')
        .update({ status: 'sent', sent_at: now })
        .eq('id', item.id)

      sent++
    } catch (err) {
      console.error(`Greška pri slanju email sekvence za ${item.email}:`, err)
      await supabase
        .from('email_sequence_queue')
        .update({ status: 'failed', error_message: String(err) })
        .eq('id', item.id)
      failed++
    }
  }

  return NextResponse.json({
    processed: dueEmails.length,
    sent,
    skipped,
    failed,
  })
}
