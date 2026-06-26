import Stripe from 'stripe'
import { readFileSync } from 'fs'

const env = readFileSync('.env.local', 'utf8').split('\n').reduce((acc, line) => {
  const [k, ...rest] = line.split('=')
  if (k && rest.length) acc[k.trim()] = rest.join('=').trim()
  return acc
}, {})

const stripe = new Stripe(env.STRIPE_SECRET_KEY, { apiVersion: '2024-06-20' })

// Ustvari PRILIKA coupon (€200 off od €397 = €197)
let coupon
try {
  coupon = await stripe.coupons.retrieve('PRILIKA')
  console.log('PRILIKA coupon already exists:', { id: coupon.id, amount_off: coupon.amount_off, valid: coupon.valid })
} catch {
  coupon = await stripe.coupons.create({
    id: 'PRILIKA',
    amount_off: 20000,
    currency: 'eur',
    duration: 'once',
    name: 'PRILIKA — €200 popust',
  })
  console.log('PRILIKA coupon CREATED:', { id: coupon.id, amount_off: coupon.amount_off })
}

// Ustvari promotion code "PRILIKA" povezan na coupon (da uporabnik vpiše tekst, ne ID)
try {
  const existing = await stripe.promotionCodes.list({ code: 'PRILIKA', limit: 1 })
  if (existing.data.length > 0) {
    console.log('PRILIKA promotion code already exists:', { id: existing.data[0].id, active: existing.data[0].active })
  } else {
    const promo = await stripe.promotionCodes.create({
      coupon: 'PRILIKA',
      code: 'PRILIKA',
    })
    console.log('PRILIKA promotion code CREATED:', { id: promo.id })
  }
} catch (e) {
  console.error('Promotion code error:', e.message)
}
