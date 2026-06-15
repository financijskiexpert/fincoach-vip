import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/server'
import { createCheckoutSession } from '@/lib/stripe'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { courseSlug, couponCode, affiliateCode: bodyAffiliateCode } = body

    // Resolve affiliate from cookie or body
    const cookieAffiliate = request.cookies.get('affiliate_code')?.value
    const affiliateCode = bodyAffiliateCode ?? cookieAffiliate ?? ''

    const supabase = await createClient()
    const serviceSupabase = await createServiceClient()

    // Get current user (optional — not required to checkout)
    const { data: { user } } = await supabase.auth.getUser()

    // Fetch course
    const { data: course, error: courseError } = await serviceSupabase
      .from('courses')
      .select('*')
      .eq('slug', courseSlug)
      .eq('is_active', true)
      .single()

    if (courseError || !course) {
      return NextResponse.json({ error: 'Tečaj nije pronađen.' }, { status: 404 })
    }

    // Determine price
    let priceAmountCents = course.price_regular
    let stripeCouponId: string | undefined

    // Check if user has a lead with active countdown → launch price
    if (user?.email) {
      const { data: lead } = await serviceSupabase
        .from('leads')
        .select('countdown_expires_at')
        .eq('email', user.email.toLowerCase())
        .single()

      if (lead?.countdown_expires_at && new Date(lead.countdown_expires_at) > new Date()) {
        priceAmountCents = course.price_launch
      }
    }

    // Apply coupon if provided
    if (couponCode) {
      const { data: coupon } = await serviceSupabase
        .from('coupons')
        .select('*')
        .eq('code', couponCode.toUpperCase())
        .eq('is_active', true)
        .single()

      if (coupon) {
        // Check expiry
        if (!coupon.expires_at || new Date(coupon.expires_at) > new Date()) {
          // Check max uses
          if (!coupon.max_uses || coupon.uses_count < coupon.max_uses) {
            if (coupon.stripe_coupon_id) {
              stripeCouponId = coupon.stripe_coupon_id
            } else if (coupon.discount_percent) {
              priceAmountCents = Math.round(priceAmountCents * (1 - coupon.discount_percent / 100))
            } else if (coupon.discount_amount) {
              priceAmountCents = Math.max(0, priceAmountCents - coupon.discount_amount)
            }
          }
        }
      }
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://fincoach.vip'

    const session = await createCheckoutSession({
      courseId: course.id,
      courseSlug: course.slug,
      priceAmountCents,
      userId: user?.id,
      userEmail: user?.email,
      successUrl: `${siteUrl}/hvala?session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${siteUrl}/tecaj`,
      affiliateCode,
      couponCode,
      stripeCouponId,
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Checkout API error:', error)
    return NextResponse.json(
      { error: 'Greška pri kreiranju narudžbe.' },
      { status: 500 }
    )
  }
}
