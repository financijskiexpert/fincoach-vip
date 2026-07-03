import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://fincoach.vip'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}))
    const { email } = body as { email?: string }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: 'FinCoach — Financijski Starter Paket',
              description: 'Excel budžetski tracker + 90-dnevni plan + kalkulator hitnog fonda + tracker dugova + bonus PDF',
              images: [`${SITE_URL}/og-image.jpg`],
            },
            unit_amount: 2700,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${SITE_URL}/hvala?starter=1&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${SITE_URL}/hvala?lead=1`,
      ...(email ? { customer_email: email } : {}),
      metadata: {
        product: 'starter-paket',
      },
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Starter checkout error:', error)
    return NextResponse.json({ error: 'Greška pri kreiranju narudžbe.' }, { status: 500 })
  }
}
