import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'

const BREVO_API_KEY = process.env.BREVO_API_KEY!
const BREVO_API_URL = 'https://api.brevo.com/v3'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: 'Email je obavezan.' }, { status: 400 })
    }

    const emailLower = email.toLowerCase().trim()

    // 1. Update Supabase — clear marketing consent
    const supabase = await createServiceClient()
    await supabase
      .from('leads')
      .update({
        marketing_consent: false,
        marketing_consent_at: null,
      })
      .eq('email', emailLower)

    // Also update users table if exists
    await supabase
      .from('users')
      .update({ marketing_consent: false })
      .eq('email', emailLower)

    // 2. Unsubscribe from Brevo list
    try {
      await fetch(`${BREVO_API_URL}/contacts/${encodeURIComponent(emailLower)}`, {
        method: 'PUT',
        headers: {
          'api-key': BREVO_API_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          emailBlacklisted: true,
        }),
      })
    } catch (brevoErr) {
      console.error('Brevo unsubscribe error:', brevoErr)
      // Don't fail the whole request if Brevo fails
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Unsubscribe error:', error)
    return NextResponse.json({ error: 'Interna greška.' }, { status: 500 })
  }
}
