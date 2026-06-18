import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createServiceClient } from '@/lib/supabase/server'
import { sendWelcomeEmail } from '@/lib/brevo'
import Stripe from 'stripe'

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

  if (!signature) {
    return NextResponse.json({ error: 'Missing Stripe signature.' }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature.' }, { status: 400 })
  }

  const supabase = await createServiceClient()

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session

      if (session.payment_status !== 'paid') break

      const metadata = session.metadata ?? {}
      const { courseId, courseSlug, userId, affiliateCode, couponCode } = metadata
      const customerEmail = session.customer_details?.email ?? session.customer_email ?? ''
      const customerName = session.customer_details?.name ?? ''
      const amountPaid = session.amount_total ?? 0
      const paymentIntentId = typeof session.payment_intent === 'string'
        ? session.payment_intent
        : session.payment_intent?.id ?? ''

      // Create/find Supabase user
      let finalUserId = userId

      if (!finalUserId && customerEmail) {
        // Try to find existing user
        const { data: profile } = await supabase
          .from('profiles')
          .select('id')
          .eq('email', customerEmail.toLowerCase())
          .single()

        if (profile) {
          finalUserId = profile.id
        } else {
          // Generate a secure random password
          const generatedPassword = Array.from(
            { length: 12 },
            () => 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#'.charAt(
              Math.floor(Math.random() * 58)
            )
          ).join('')

          const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
            email: customerEmail,
            password: generatedPassword,
            email_confirm: true,
            user_metadata: {
              full_name: customerName,
              role: 'student',
            },
          })

          if (createError) {
            console.error('Error creating user:', createError)
          } else {
            finalUserId = newUser?.user?.id
            // Pass generated password to welcome email
            ;(metadata as any).__generatedPassword = generatedPassword
          }
        }
      }

      if (!finalUserId) {
        console.error('Could not determine user ID for purchase')
        break
      }

      // Create purchase record
      const { data: purchase, error: purchaseError } = await supabase
        .from('purchases')
        .upsert({
          user_id: finalUserId,
          course_id: courseId,
          stripe_payment_intent_id: paymentIntentId,
          stripe_session_id: session.id,
          amount_paid: amountPaid,
          coupon_code: couponCode ?? null,
          affiliate_code: affiliateCode ?? null,
          status: 'completed',
        }, {
          onConflict: 'stripe_payment_intent_id',
          ignoreDuplicates: true,
        })
        .select()
        .single()

      if (purchaseError) {
        console.error('Error creating purchase:', purchaseError)
      }

      // Handle affiliate commission
      if (affiliateCode && purchase?.id) {
        const { data: affiliate } = await supabase
          .from('affiliates')
          .select('id, commission_percent')
          .eq('code', affiliateCode)
          .eq('is_active', true)
          .single()

        if (affiliate) {
          const commissionAmount = Math.round(amountPaid * (affiliate.commission_percent / 100))

          await supabase.from('affiliate_conversions').insert({
            affiliate_id: affiliate.id,
            purchase_id: purchase.id,
            commission_amount: commissionAmount,
            status: 'pending',
          })

          await supabase.rpc('increment_affiliate_stats', {
            affiliate_id: affiliate.id,
            sale_amount: amountPaid,
            commission: commissionAmount,
          })
        }
      }

      // Mark lead as converted
      if (customerEmail) {
        await supabase
          .from('leads')
          .update({ converted_to_purchase: true })
          .eq('email', customerEmail.toLowerCase())
      }

      // Update coupon uses count
      if (couponCode) {
        await supabase.rpc('increment_coupon_uses', { coupon_code: couponCode })
      }

      // Send welcome email with login credentials
      if (customerEmail) {
        const generatedPassword = (metadata as any).__generatedPassword
        await sendWelcomeEmail(customerEmail, customerName || 'Polazniče', generatedPassword)
      }

      // Update Stripe customer ID in profile
      const stripeCustomerId = typeof session.customer === 'string'
        ? session.customer
        : session.customer?.id ?? ''

      if (stripeCustomerId && finalUserId) {
        await supabase
          .from('profiles')
          .update({ stripe_customer_id: stripeCustomerId })
          .eq('id', finalUserId)
      }

      break
    }

    case 'payment_intent.payment_failed': {
      const pi = event.data.object as Stripe.PaymentIntent
      console.error('Payment failed:', pi.id, pi.last_payment_error?.message)
      break
    }

    case 'charge.refunded': {
      const charge = event.data.object as Stripe.Charge
      const piId = typeof charge.payment_intent === 'string' ? charge.payment_intent : charge.payment_intent?.id

      if (piId) {
        await supabase
          .from('purchases')
          .update({ status: 'refunded' })
          .eq('stripe_payment_intent_id', piId)
      }
      break
    }

    default:
      console.log(`Unhandled event type: ${event.type}`)
  }

  return NextResponse.json({ received: true })
}

export const dynamic = 'force-dynamic'
