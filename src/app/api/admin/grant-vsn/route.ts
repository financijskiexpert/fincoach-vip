import { NextRequest, NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

async function checkAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  const service = await createServiceClient()
  const { data: profile } = await service.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin' && user.email !== 'brane.recek@gmail.com') return null
  return user
}

export async function POST(request: NextRequest) {
  const admin = await checkAdmin()
  if (!admin) return NextResponse.json({ error: 'Neovlašteni pristup.' }, { status: 403 })

  const { email, full_name } = await request.json()
  if (!email) return NextResponse.json({ error: 'Email je obavezan.' }, { status: 400 })

  const service = await createServiceClient()

  // Provjeri postoji li već Supabase Auth account za ovaj email
  const { data: existingProfile } = await service
    .from('profiles')
    .select('id, role')
    .eq('email', email.toLowerCase())
    .maybeSingle()

  let userId: string

  if (existingProfile) {
    userId = existingProfile.id
    // Ako postoji, samo promijeni ulogu u student (ako nije admin)
    if (existingProfile.role !== 'admin') {
      await service
        .from('profiles')
        .update({ role: 'student' })
        .eq('id', userId)
    }
  } else {
    // Kreiraj novi Supabase Auth account s generiranom lozinkom
    const generatedPassword = Array.from({ length: 12 },
      () => 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#'.charAt(
        Math.floor(Math.random() * 58)
      )
    ).join('')

    const { data: newUser, error: createError } = await service.auth.admin.createUser({
      email: email.toLowerCase(),
      password: generatedPassword,
      email_confirm: true,
      user_metadata: {
        full_name: full_name ?? email.split('@')[0],
        role: 'student',
      },
    })

    if (createError || !newUser.user) {
      console.error('grant-vsn createUser error:', createError)
      return NextResponse.json({ error: 'Greška pri kreiranju računa.' }, { status: 500 })
    }

    userId = newUser.user.id

    // Pošalji email s prijavnim podacima
    const { sendStarterPortalEmail } = await import('@/lib/brevo')
    await sendStarterPortalEmail(email, full_name ?? email.split('@')[0], generatedPassword)
  }

  // Kreiraj purchases zapis za VSN tečaj
  // Pronađi ID aktivnog tečaja
  const { data: course } = await service
    .from('courses')
    .select('id')
    .eq('is_active', true)
    .limit(1)
    .maybeSingle()

  if (!course) {
    return NextResponse.json({ error: 'Nema aktivnog tečaja u bazi.' }, { status: 404 })
  }

  // Provjeri postoji li već purchase za ovaj user+course
  const { data: existingPurchase } = await service
    .from('purchases')
    .select('id')
    .eq('user_id', userId)
    .eq('course_id', course.id)
    .maybeSingle()

  if (!existingPurchase) {
    const { error: purchaseError } = await service
      .from('purchases')
      .insert({
        user_id: userId,
        course_id: course.id,
        amount_paid: 0,
        status: 'completed',
        stripe_session_id: `admin_grant_${Date.now()}`,
      })

    if (purchaseError) {
      console.error('grant-vsn purchase error:', purchaseError)
      return NextResponse.json({ error: 'Greška pri kreiranju pristupa.' }, { status: 500 })
    }
  }

  return NextResponse.json({ ok: true, userId })
}
