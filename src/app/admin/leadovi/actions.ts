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

export async function deleteLead(leadId: string) {
  const service = await assertAdmin()
  await service.from('email_sequence_queue').delete().eq('lead_id', leadId)
  await service.from('leads').delete().eq('id', leadId)
  revalidatePath('/admin/leadovi')
}

export async function updateLead(leadId: string, fullName: string, email: string) {
  const service = await assertAdmin()
  await service.from('leads').update({ full_name: fullName, email: email.toLowerCase().trim() }).eq('id', leadId)
  revalidatePath('/admin/leadovi')
}

function generateAffiliateCode(name: string): string {
  const first = (name || 'PARTNER').split(' ')[0].toUpperCase().replace(/[^A-Z]/g, '').slice(0, 8)
  const suffix = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `${first}${suffix}`
}

export async function convertLeadToStudent(formData: FormData) {
  const service = await assertAdmin()
  const leadId = formData.get('lead_id') as string
  const courseSlug = (formData.get('course_slug') as string ?? 'volim-svoj-novac').trim()
  const withAffiliate = formData.get('with_affiliate') === 'true'

  if (!leadId) throw new Error('lead_id required')

  const { data: lead } = await service.from('leads').select('*').eq('id', leadId).maybeSingle()
  if (!lead) throw new Error('Lead not found')

  const email = lead.email.toLowerCase().trim()
  const fullName = lead.full_name || email.split('@')[0]

  // 1) Ustvari ali najdi auth user
  const { data: existingList } = await service.auth.admin.listUsers()
  let userId = existingList?.users?.find(u => u.email === email)?.id

  if (!userId) {
    const { data: newUser, error } = await service.auth.admin.createUser({
      email,
      email_confirm: true,
      user_metadata: { full_name: fullName },
    })
    if (error || !newUser.user) throw new Error(error?.message ?? 'Create user failed')
    userId = newUser.user.id
    await service.from('profiles').insert({
      id: userId,
      full_name: fullName,
      email,
      role: 'student',
    })
  } else {
    await service.from('profiles').upsert({
      id: userId,
      full_name: fullName,
      email,
      role: 'student',
    }, { onConflict: 'id' })
  }

  // 2) Purchase za izabrani tečaj
  const { data: course } = await service.from('courses').select('id').eq('slug', courseSlug).maybeSingle()
  if (course) {
    const { data: existing } = await service
      .from('purchases').select('id').eq('user_id', userId).eq('course_id', course.id).limit(1).maybeSingle()
    if (!existing) {
      await service.from('purchases').insert({
        user_id: userId,
        course_id: course.id,
        amount_paid: 0,
        status: 'completed',
        purchased_at: new Date().toISOString(),
      })
    }
  }

  // 3) Affiliate (opcijsko)
  if (withAffiliate) {
    const { data: existingAff } = await service.from('affiliates').select('id').eq('user_id', userId).maybeSingle()
    if (!existingAff) {
      let code = generateAffiliateCode(fullName)
      for (let i = 0; i < 5; i++) {
        const { data: taken } = await service.from('affiliates').select('id').eq('code', code).maybeSingle()
        if (!taken) break
        code = generateAffiliateCode(fullName)
      }
      await service.from('affiliates').insert({
        user_id: userId, code, commission_percent: 30, is_active: true,
      })
    } else {
      await service.from('affiliates').update({ is_active: true }).eq('user_id', userId)
    }
  }

  // 4) Označi lead kao konvertiran + ustavi nadaljne prodajne emaile
  await service.from('leads').update({ converted_to_purchase: true }).eq('id', leadId)
  await service.from('email_sequence_queue')
    .update({ status: 'skipped' })
    .eq('lead_id', leadId)
    .eq('status', 'pending')

  // 5) Pošlji magic link
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://fincoach.vip'
  const { data: magicData } = await service.auth.admin.generateLink({
    type: 'magiclink',
    email,
    options: { redirectTo: `${siteUrl}/portal` },
  })
  const inviteLink = magicData?.properties?.action_link ?? `${siteUrl}/prijava`

  const { sendTransactionalEmail } = await import('@/lib/brevo')
  await sendTransactionalEmail({
    to: [{ email, name: fullName }],
    subject: 'Dobrodošao/la u FinCoach VIP! Tvoj pristup je aktivan.',
    htmlContent: `<!DOCTYPE html><html><body style="font-family:Inter,Arial,sans-serif;background:#f1f5f9;margin:0;padding:0">
<div style="max-width:600px;margin:32px auto;background:#0D1B2A;border-radius:14px;overflow:hidden">
  <div style="background:linear-gradient(135deg,#0D1B2A,#1a2f47);padding:32px 40px;text-align:center">
    <div style="color:#D4AF37;font-size:22px;font-weight:800;letter-spacing:1px">FinCoach VIP</div>
  </div>
  <div style="padding:40px;color:#fff">
    <h2 style="color:#D4AF37;font-size:22px;margin:0 0 20px">Dobrodošao/la, ${fullName.split(' ')[0]}! 🎉</h2>
    <p style="color:#cbd5e0;line-height:1.75;font-size:15px">Tvoj pristup tečaju je aktiviran. Klikni gumb ispod za pristup portalu (aktivan 24h).</p>
    <div style="text-align:center;margin:24px 0">
      <a href="${inviteLink}" style="display:inline-block;background:#D4AF37;color:#0D1B2A;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:800">Pristupi portalu →</a>
    </div>
    ${withAffiliate ? '<p style="color:#cbd5e0;font-size:14px">U portalu te čeka i partnerski program (affiliate) — možeš zarađivati 30% provizije po prodaji.</p>' : ''}
    <p style="color:#718096;font-size:13px;margin-top:24px">Ako gumb ne radi, kopiraj: ${inviteLink}</p>
  </div>
</div>
</body></html>`,
  })

  revalidatePath('/admin/leadovi')
  revalidatePath('/admin/studenti')
}
