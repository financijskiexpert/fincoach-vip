import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/server'
import { createCheckoutSession } from '@/lib/stripe'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { courseSlug, couponCode, affiliateCode: bodyAffiliateCode } = body

    // Resolve affiliate from cookie (30-day tracking) or body
    const cookieAffiliate = request.cookies.get('aff_ref')?.value
    const affiliateCode = (bodyAffiliateCode ?? cookieAffiliate ?? '').toUpperCase()

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

    // Affiliate discount: ako je affiliate kod važeći, primjeni 10% popust
    // Pravilo: affiliate i coupon se NE kombiniraju — affiliate ima prednost
    let affiliateActive = false
    if (affiliateCode) {
      const { data: aff } = await serviceSupabase
        .from('affiliates')
        .select('id')
        .eq('code', affiliateCode)
        .eq('is_active', true)
        .maybeSingle()
      if (aff) {
        priceAmountCents = Math.round(priceAmountCents * 0.9)
        affiliateActive = true
      }
    }

    // Upgrade kupon (UPGRADE-XXXXXX): 50% off, samo 1x, samo ako affiliate NIJE aktivan
    let upgradeCouponId: string | null = null
    if (couponCode && !affiliateActive && couponCode.toUpperCase().startsWith('UPGRADE-')) {
      const { data: upgradeCoupon } = await serviceSupabase
        .from('upgrade_coupons')
        .select('id, discount_percent, used_at, expires_at')
        .eq('code', couponCode.toUpperCase())
        .maybeSingle()

      if (upgradeCoupon && !upgradeCoupon.used_at) {
        const notExpired = !upgradeCoupon.expires_at || new Date(upgradeCoupon.expires_at) > new Date()
        if (notExpired) {
          priceAmountCents = Math.round(priceAmountCents * (1 - upgradeCoupon.discount_percent / 100))
          upgradeCouponId = upgradeCoupon.id
        }
      }
    }

    // Regularni coupon: aplicira se SAMO ako affiliate NIJE aktivan i nije upgrade kupon
    if (couponCode && !affiliateActive && !upgradeCouponId) {
      const { data: coupon } = await serviceSupabase
        .from('coupons')
        .select('*')
        .eq('code', couponCode.toUpperCase())
        .eq('is_active', true)
        .maybeSingle()

      if (coupon) {
        const notExpired = !coupon.expires_at || new Date(coupon.expires_at) > new Date()
        const notMaxed = !coupon.max_uses || coupon.used_count < coupon.max_uses
        if (notExpired && notMaxed) {
          if (coupon.discount_type === 'percentage') {
            priceAmountCents = Math.round(priceAmountCents * (1 - coupon.discount_value / 100))
          } else if (coupon.discount_type === 'fixed') {
            priceAmountCents = Math.max(0, priceAmountCents - coupon.discount_value * 100)
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
      cancelUrl: `${siteUrl}/volim-svoj-novac`,
      affiliateCode,
      couponCode,
      stripeCouponId,
      upgradeCouponId: upgradeCouponId ?? undefined,
      allowPromotionCodes: !affiliateActive && !upgradeCouponId,
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
