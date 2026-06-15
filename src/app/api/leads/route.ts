import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { addContact, sendLeadPdfEmail } from '@/lib/brevo'
import { addDays } from 'date-fns'

const PDF_URL = `${process.env.NEXT_PUBLIC_SITE_URL}/pdf/5-koraka-do-financijske-slobode.pdf`

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, full_name, source = 'landing' } = body

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
        },
        {
          onConflict: 'email',
          ignoreDuplicates: false,
        }
      )
      .select()
      .single()

    if (leadError) {
      console.error('Supabase lead error:', leadError)
      // Don't fail — continue with email
    }

    // Add to Brevo contacts (list ID 2 = leads)
    const firstName = full_name?.split(' ')[0] ?? ''
    const lastName = full_name?.split(' ').slice(1).join(' ') ?? ''

    const brevoResult = await addContact({
      email: email.toLowerCase().trim(),
      firstName,
      lastName,
      attributes: {
        SOURCE: source,
        COUNTDOWN_EXPIRES: countdownExpiresAt,
      },
      listIds: [2], // Leads list — adjust ID per your Brevo setup
    })

    // Update Brevo contact ID in Supabase if we got one
    if (brevoResult?.id && lead?.id) {
      await supabase
        .from('leads')
        .update({ brevo_contact_id: brevoResult.id.toString() })
        .eq('id', lead.id)
    }

    // Send email with PDF
    await sendLeadPdfEmail(
      email.toLowerCase().trim(),
      full_name ?? 'Prijatelju',
      PDF_URL
    )

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
