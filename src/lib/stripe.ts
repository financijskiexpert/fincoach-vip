import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
  typescript: true,
})

export interface CreateCheckoutSessionParams {
  courseId: string
  courseSlug: string
  priceAmountCents: number
  userId?: string
  userEmail?: string
  customerName?: string
  successUrl: string
  cancelUrl: string
  affiliateCode?: string
  couponCode?: string
  stripeCouponId?: string
}

export async function createCheckoutSession({
  courseId,
  courseSlug,
  priceAmountCents,
  userId,
  userEmail,
  customerName,
  successUrl,
  cancelUrl,
  affiliateCode,
  couponCode,
  stripeCouponId,
}: CreateCheckoutSessionParams): Promise<Stripe.Checkout.Session> {
  const sessionParams: Stripe.Checkout.SessionCreateParams = {
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'eur',
          product_data: {
            name: 'FinCoach VIP â€” 90-dnevni financijski teÄŤaj',
            description: '90 dana, 90 video lekcija, certifikat o zavrĹˇetku',
            images: [`${process.env.NEXT_PUBLIC_SITE_URL}/og-image.jpg`],
          },
          unit_amount: priceAmountCents,
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: successUrl,
    cancel_url: cancelUrl,
    customer_email: userEmail,
    metadata: {
      courseId,
      courseSlug,
      userId: userId ?? '',
      affiliateCode: affiliateCode ?? '',
      couponCode: couponCode ?? '',
    },
    allow_promotion_codes: !stripeCouponId,
  }

  if (stripeCouponId) {
    sessionParams.discounts = [{ coupon: stripeCouponId }]
  }

  if (userEmail) {
    sessionParams.customer_email = userEmail
  }

  const session = await stripe.checkout.sessions.create(sessionParams)
  return session
}

export async function createCustomer(email: string, name?: string): Promise<Stripe.Customer> {
  const customer = await stripe.customers.create({
    email,
    name,
  })
  return customer
}

export async function getSession(sessionId: string): Promise<Stripe.Checkout.Session> {
  const session = await stripe.checkout.sessions.retrieve(sessionId, {
    expand: ['payment_intent', 'customer'],
  })
  return session
}

export async function getPaymentIntent(paymentIntentId: string): Promise<Stripe.PaymentIntent> {
  return await stripe.paymentIntents.retrieve(paymentIntentId)
}
