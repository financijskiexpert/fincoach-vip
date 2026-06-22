'use server'

import { revalidatePath } from 'next/cache'
import { createClient, createServiceClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

async function assertAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/prijava')
  const service = await createServiceClient()
  const { data: profile } = await service.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin' && user.email !== 'brane.recek@gmail.com') redirect('/portal')
  return service
}

function generateAffiliateCode(name: string): string {
  const first = name.split(' ')[0].toUpperCase().replace(/[^A-Z]/g, '').slice(0, 8)
  const suffix = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `${first}${suffix}`
}

export async function addStudent(formData: FormData) {
  const service = await assertAdmin()

  const fullName = (formData.get('full_name') as string ?? '').trim()
  const email = (formData.get('email') as string ?? '').toLowerCase().trim()
  const paid = formData.get('paid') === 'true'

  if (!email || !fullName) throw new Error('Ime i email su obavezni.')

  // 1. Provjeri postoji li user u auth
  const { data: existingList } = await service.auth.admin.listUsers()
  const existingUser = existingList?.users?.find(u => u.email === email)

  let userId: string

  if (existingUser) {
    userId = existingUser.id
    // Update profil ako postoji
    await service.from('profiles').upsert({
      id: userId,
      full_name: fullName,
      email,
      role: 'student',
    }, { onConflict: 'id' })
  } else {
    // Kreiraj novog auth usera (bez slanja verification emaila — mi šaljemo welcome)
    const { data: newUser, error: createError } = await service.auth.admin.createUser({
      email,
      email_confirm: true,
      user_metadata: { full_name: fullName },
    })
    if (createError || !newUser.user) throw new Error(createError?.message ?? 'Greška pri kreiranju korisnika.')
    userId = newUser.user.id

    // Kreiraj profil
    await service.from('profiles').insert({
      id: userId,
      full_name: fullName,
      email,
      role: 'student',
    })
  }

  // 2. Ako je plaćeno — kreiraj purchase record
  if (paid) {
    const { data: course } = await service
      .from('courses').select('id').eq('slug', 'volim-svojnovac').single()

    if (course) {
      const { data: existingPurchase } = await service
        .from('purchases').select('id').eq('user_id', userId).eq('course_id', course.id).single()

      if (!existingPurchase) {
        await service.from('purchases').insert({
          user_id: userId,
          course_id: course.id,
          amount_paid: 0,
          status: 'completed',
          purchased_at: new Date().toISOString(),
        })
      }
    }
  }

  // 3. Kreiraj affiliate kod automatski (ako kupac)
  if (paid) {
    const { data: existingAff } = await service
      .from('affiliates').select('id').eq('email', email).single()

    if (!existingAff) {
      let code = generateAffiliateCode(fullName)
      for (let i = 0; i < 5; i++) {
        const { data: taken } = await service.from('affiliates').select('id').eq('code', code).single()
        if (!taken) break
        code = generateAffiliateCode(fullName)
      }
      await service.from('affiliates').insert({
        name: fullName,
        email,
        code,
        commission_percent: 30,
        is_active: true,
      })
    }
  }

  // 4. Pošalji magic link za pristup (password reset = invite link)
  const { sendTransactionalEmail } = await import('@/lib/brevo')
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://fincoach.vip'

  const { data: magicData } = await service.auth.admin.generateLink({
    type: 'magiclink',
    email,
    options: { redirectTo: `${siteUrl}/portal` },
  })
  const inviteLink = magicData?.properties?.action_link ?? `${siteUrl}/prijava`

  await sendTransactionalEmail({
    to: [{ email, name: fullName }],
    subject: 'Dobrodošao/la u FinCoach VIP! Tvoj pristup je aktivan.',
    htmlContent: `<!DOCTYPE html>
<html><head><meta charset="utf-8">
<style>
  body{font-family:Inter,Arial,sans-serif;background:#f1f5f9;margin:0;padding:0}
  .wrap{max-width:600px;margin:32px auto;background:#0D1B2A;border-radius:14px;overflow:hidden}
  .header{background:linear-gradient(135deg,#0D1B2A,#1a2f47);padding:32px 40px;text-align:center}
  .logo{color:#D4AF37;font-size:22px;font-weight:800;letter-spacing:1px}
  .body{padding:40px;color:#fff}
  h2{color:#D4AF37;font-size:22px;font-weight:700;margin:0 0 20px}
  p{color:#cbd5e0;line-height:1.75;margin:0 0 16px;font-size:15px}
  .box{background:#0a1929;border:1px solid rgba(212,175,55,0.3);border-radius:10px;padding:20px 24px;margin:20px 0}
  .btn{display:inline-block;background:#D4AF37;color:#0D1B2A;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:800;font-size:15px}
  .footer{background:#091623;padding:20px 40px;text-align:center;color:#4a5568;font-size:12px}
</style>
</head>
<body>
<div class="wrap">
  <div class="header"><div class="logo">FinCoach VIP</div></div>
  <div class="body">
    <h2>Dobrodošao/la, ${fullName.split(' ')[0]}! 🎉</h2>
    <p>Tvoj pristup FinCoach VIP programu je aktiviran. Spreman/na za 90 dana transformacije?</p>
    <div class="box">
      <p style="color:#D4AF37;font-weight:700;margin:0 0 10px;">Što te čeka:</p>
      <p style="margin:0 0 6px;">📹 90 video lekcija — 3 faze, 90 dana</p>
      <p style="margin:0 0 6px;">💰 Partnerski program — zaradit ćeš preporučujući</p>
      <p style="margin:0;">🎓 Certifikat po završetku programa</p>
    </div>
    <p>Klikni gumb ispod za pristup svom portalu. Link je aktivan 24 sata.</p>
    <div style="text-align:center;margin:24px 0;">
      <a href="${inviteLink}" class="btn">Pristupi portalu →</a>
    </div>
    <p style="color:#718096;font-size:13px;">Ako gumb ne radi, kopiraj ovaj link: ${inviteLink}</p>
    <p><span style="color:#D4AF37;font-weight:700;">Brane</span><br><span style="color:#718096;font-size:13px;">FinCoach VIP</span></p>
  </div>
  <div class="footer">© 2026 FinCoach VIP · <a href="${siteUrl}" style="color:#4a5568;">fincoach.vip</a></div>
</div>
</body></html>`,
  })

  revalidatePath('/admin/studenti')
}

export async function deleteStudent(userId: string) {
  const service = await assertAdmin()
  await service.from('progress').delete().eq('user_id', userId)
  await service.from('purchases').delete().eq('user_id', userId)
  await service.from('profiles').delete().eq('id', userId)
  await service.auth.admin.deleteUser(userId)
  revalidatePath('/admin/studenti')
}

export async function grantAccess(userId: string) {
  const service = await assertAdmin()
  const { data: profile } = await service.from('profiles').select('email, full_name').eq('id', userId).single()
  if (!profile) return

  const { data: course } = await service.from('courses').select('id').eq('slug', 'volim-svojnovac').single()
  if (!course) return

  const { data: existing } = await service.from('purchases').select('id').eq('user_id', userId).eq('course_id', course.id).single()
  if (!existing) {
    await service.from('purchases').insert({
      user_id: userId,
      course_id: course.id,
      amount_paid: 0,
      status: 'completed',
      purchased_at: new Date().toISOString(),
    })
  }

  // Auto-kreiraj affiliate
  const { data: existingAff } = await service.from('affiliates').select('id').eq('email', profile.email).single()
  if (!existingAff) {
    let code = generateAffiliateCode(profile.full_name ?? profile.email)
    for (let i = 0; i < 5; i++) {
      const { data: taken } = await service.from('affiliates').select('id').eq('code', code).single()
      if (!taken) break
      code = generateAffiliateCode(profile.full_name ?? profile.email)
    }
    await service.from('affiliates').insert({
      name: profile.full_name ?? profile.email,
      email: profile.email,
      code,
      commission_percent: 30,
      is_active: true,
    })
  }

  revalidatePath('/admin/studenti')
}
