import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { buildEmailContent, buildLeadEmail, buildStarterEmail, EMAIL_SEQUENCE, LEAD_SEQUENCE, STARTER_SEQUENCE } from '@/lib/email-sequence'
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
      const seqType: string = (item as any).sequence_type ?? null
      const idx: number = item.sequence_index
      let emailContent: { subject: string; html: string } | null = null

      if (seqType === 'lead') {
        // ── Nova lead sekvenca (13 emailov, indeksi 0-12) ─────────────────────
        const leadSeq = LEAD_SEQUENCE[idx]
        if (!leadSeq) {
          await supabase.from('email_sequence_queue').update({ status: 'skipped', sent_at: now }).eq('id', item.id)
          skipped++; continue
        }

        // Skip Starter Paket emaile če je lead že kupil
        if (leadSeq.sellsStarterPaket) {
          const { data: leadRow } = await supabase
            .from('leads').select('starter_purchased').eq('email', item.email.toLowerCase()).single()
          if (leadRow?.starter_purchased) {
            await supabase.from('email_sequence_queue').update({ status: 'skipped', sent_at: now }).eq('id', item.id)
            skipped++; continue
          }
        }

        // Skip 397€ emaile če je lead že kupil 90-dnevni tečaj
        if (leadSeq.sells397) {
          const { data: profile } = await supabase
            .from('profiles').select('id').eq('email', item.email.toLowerCase()).single()
          if (profile?.id) {
            const { data: purchase } = await supabase
              .from('purchases').select('id').eq('user_id', profile.id).eq('status', 'completed').maybeSingle()
            if (purchase) {
              await supabase.from('email_sequence_queue').update({ status: 'skipped', sent_at: now }).eq('id', item.id)
              skipped++; continue
            }
          }
        }

        const affiliateCode = (item as any).leads?.affiliate_code ?? null
        emailContent = buildLeadEmail(idx, item.full_name ?? 'Prijatelju', item.email, affiliateCode)

      } else if (seqType === 'starter') {
        // ── Starter sekvenca (indeksi 100-104, 110, 105-109) ─────────────────
        // Non-sequential: 100-104 → pos 0-4, 110 → pos 5 (day 28), 105-109 → pos 6-10
        const STARTER_IDX_MAP: Record<number, number> = {
          100: 0, 101: 1, 102: 2, 103: 3, 104: 4,
          110: 5,
          105: 6, 106: 7, 107: 8, 108: 9, 109: 10,
        }
        const arrPos = STARTER_IDX_MAP[idx]
        const starterSeq = arrPos !== undefined ? STARTER_SEQUENCE[arrPos] : null
        if (!starterSeq) {
          await supabase.from('email_sequence_queue').update({ status: 'skipped', sent_at: now }).eq('id', item.id)
          skipped++; continue
        }

        // Skip 397€ emaile če je starter kupec već kupil 90-dnevni tečaj
        if (starterSeq.sells397) {
          const { data: profile } = await supabase
            .from('profiles').select('id').eq('email', item.email.toLowerCase()).single()
          if (profile?.id) {
            const { data: purchase } = await supabase
              .from('purchases').select('id').eq('user_id', profile.id).eq('status', 'completed').maybeSingle()
            if (purchase) {
              await supabase.from('email_sequence_queue').update({ status: 'skipped', sent_at: now }).eq('id', item.id)
              skipped++; continue
            }
          }
        }

        // Za dan 30 (idx 105) — dohvati unikatni upgrade kupon iz DB
        let uniqueCoupon: string | null = null
        if (idx === 105) {
          const { data: couponRow } = await supabase
            .from('upgrade_coupons')
            .select('code')
            .eq('email', item.email.toLowerCase())
            .is('used_at', null)
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle()
          uniqueCoupon = couponRow?.code ?? null
        }

        emailContent = buildStarterEmail(idx, item.full_name ?? 'Prijatelju', item.email, uniqueCoupon)

      } else {
        // ── Legacna sekvenca (stari leads, sequence_type = null) ──────────────
        const seq = EMAIL_SEQUENCE[idx]
        if (seq?.skipIfPurchased) {
          const { data: profile } = await supabase
            .from('profiles').select('id').eq('email', item.email.toLowerCase()).single()
          if (profile?.id) {
            const { data: purchase } = await supabase
              .from('purchases').select('id').eq('user_id', profile.id).eq('status', 'completed').maybeSingle()
            if (purchase) {
              await supabase.from('email_sequence_queue').update({ status: 'skipped', sent_at: now }).eq('id', item.id)
              skipped++; continue
            }
          }
        }
        const affiliateCode = (item as any).leads?.affiliate_code ?? null
        emailContent = buildEmailContent(idx, item.full_name ?? 'Prijatelju', item.email, affiliateCode)
      }

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
