import { NextRequest, NextResponse } from 'next/server'
import { sendTransactionalEmail } from '@/lib/brevo'

export const dynamic = 'force-dynamic'

const TOPIC_LABELS: Record<string, string> = {
  'osiguranje-karijera': 'Karijera u osiguranju / suradnja',
  'mentorstvo': 'Mentorstvo za zastopnike',
  'financijsko-savjetovanje': 'Financijsko savjetovanje',
  'fincoach-vip': 'FinCoach VIP program',
  'ostalo': 'Ostalo',
}

export async function POST(request: NextRequest) {
  let body: Record<string, string>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { name, email, phone, topic, message } = body

  if (!name?.trim() || !email?.trim() || !topic?.trim() || !message?.trim()) {
    return NextResponse.json({ error: 'Sva obavezna polja moraju biti popunjena.' }, { status: 400 })
  }

  const topicLabel = TOPIC_LABELS[topic] ?? topic

  try {
    await sendTransactionalEmail({
      to: [{ email: 'brane@fincoach.vip', name: 'Brane Recek' }],
      replyTo: { email, name },
      subject: `📬 Kontakt: ${topicLabel} — ${name}`,
      htmlContent: `
        <div style="font-family: Arial, sans-serif; max-width: 600px;">
          <h2 style="color: #0D1B2A;">Nova poruka s kontakt forme</h2>
          <table style="border-collapse: collapse; width: 100%;">
            <tr><td style="padding: 8px; color: #666;"><strong>Ime:</strong></td><td style="padding: 8px;">${name}</td></tr>
            <tr style="background: #f9f9f9;"><td style="padding: 8px; color: #666;"><strong>Email:</strong></td><td style="padding: 8px;"><a href="mailto:${email}">${email}</a></td></tr>
            ${phone ? `<tr><td style="padding: 8px; color: #666;"><strong>Telefon:</strong></td><td style="padding: 8px;">${phone}</td></tr>` : ''}
            <tr style="background: #f9f9f9;"><td style="padding: 8px; color: #666;"><strong>Tema:</strong></td><td style="padding: 8px;">${topicLabel}</td></tr>
          </table>
          <div style="margin-top: 20px; padding: 16px; background: #f5f5f5; border-radius: 8px;">
            <strong>Poruka:</strong>
            <p style="white-space: pre-wrap; margin-top: 8px;">${message}</p>
          </div>
        </div>
      `,
    })
    return NextResponse.json({ ok: true })
  } catch (err: any) {
    console.error('Kontakt email error:', err)
    return NextResponse.json({ error: 'Greška pri slanju emaila.' }, { status: 500 })
  }
}
