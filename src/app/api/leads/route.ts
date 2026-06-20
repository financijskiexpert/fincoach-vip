import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { addContact, sendLeadPdfEmail } from '@/lib/brevo'
import { addDays } from 'date-fns'
import { EMAIL_SEQUENCE } from '@/lib/email-sequence'

const PDF_URL = `${process.env.NEXT_PUBLIC_SITE_URL}/downloads/vodic-financijska-stabilnost.pdf`

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, full_name, source = 'landing', marketing_consent = false } = body

    if (!email) {
      return NextResponse.json({ error: 'Email je obavezan.' }, { status: 400 })
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Neispravna email adresa.' }, { status: 400 })
    }

    const supabase = await createServiceClient()

    const countdownExpiresAt = addDays(new Date(), 3).toISOString()

    // Upsert lead in Supabase
    const { data: lead, error: leadError } = await supabase
      .from('leads')
      .upsert(
        {
          email: email.toLowerCase().trim(),
          full_name: full_name ?? '',
          source,
          countdown_expires_at: countdownExpiresAt,
          marketing_consent: marketing_consent,
          marketing_consent_at: marketing_consent ? new Date().toISOString() : null,
        },
        {
          onConflict: 'email',
          ignoreDuplicates: false,
        }
      )
      .select()
      .single()

    if (leadError) {
      console.error('Supabase lead error:', JSON.stringify(leadError))
      return NextResponse.json({ error: 'DB error: ' + leadError.message }, { status: 500 })
    }

    // Add to Brevo contacts (list ID 2 = leads)
    const firstName = full_name?.split(' ')[0] ?? ''
    const lastName = full_name?.split(' ').slice(1).join(' ') ?? ''

    // Checkbox je pogoj za oddajo forme — torej vsi kontakti imajo soglasje
    // Lista 2 = "Leads — marketing vodič" v Brevu (zamenjaj ID če je drugačen)
    const brevoResult = await addContact({
      email: email.toLowerCase().trim(),
      firstName,
      lastName,
      attributes: {
        SOURCE: source,
        COUNTDOWN_EXPIRES: countdownExpiresAt,
        MARKETING_CONSENT: 'true',
      },
      listIds: [],
    })

    // Update Brevo contact ID in Supabase if we got one
    if (brevoResult?.id && lead?.id) {
      await supabase
        .from('leads')
        .update({ brevo_contact_id: brevoResult.id.toString() })
        .eq('id', lead.id)
    }

    // Send email with PDF (dan 0)
    await sendLeadPdfEmail(
      email.toLowerCase().trim(),
      full_name ?? 'Prijatelju',
      PDF_URL
    )

    // Zapolni email sekvenco v queue (emaili 1-7, vsake 2 dni)
    if (lead?.id) {
      const emailLower = email.toLowerCase().trim()
      const queueItems = EMAIL_SEQUENCE.map((seq, index) => ({
        lead_id: lead.id,
        email: emailLower,
        full_name: full_name ?? '',
        sequence_index: index,
        scheduled_at: addDays(new Date(), seq.dayOffset).toISOString(),
        status: 'pending',
      }))

      await supabase
        .from('email_sequence_queue')
        .upsert(queueItems, { onConflict: 'lead_id,sequence_index', ignoreDuplicates: true })
    }

    return NextResponse.json({
      success: true,
      countdown_expires_at: countdownExpiresAt,
    })
  } catch (error) {
    console.error('Leads API error:', error)
    return NextResponse.json(
      { error: 'Interna greška servera.' },
      { status: 500 }
    )
  }
}
