import { NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

function generateCode(name: string): string {
  const firstName = name.split(' ')[0].toUpperCase().replace(/[^A-Z]/g, '').slice(0, 8)
  const suffix = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `${firstName}${suffix}`
}

export async function POST() {
  try {
    const supabaseAuth = await createClient()
    const { data: { user }, error: authError } = await supabaseAuth.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Nisi prijavljen/a.' }, { status: 401 })
    }

    const supabase = await createServiceClient()

    // Provjeri je li user kupio tečaj (lahko ima več nakupov)
    const { data: purchase } = await supabase
      .from('purchases')
      .select('id')
      .eq('user_id', user.id)
      .eq('status', 'completed')
      .limit(1)
      .maybeSingle()

    if (!purchase) {
      return NextResponse.json(
        { error: 'Affiliate program je dostupan samo kupcima tečaja.' },
        { status: 403 }
      )
    }

    // Provjeri je li već affiliate
    const { data: existing } = await supabase
      .from('affiliates')
      .select('id, code')
      .eq('user_id', user.id)
      .maybeSingle()

    if (existing) {
      return NextResponse.json({ alreadyAffiliate: true, code: existing.code, success: true })
    }

    // Dohvati profil
    const { data: profile } = await supabase
      .from('profiles')
      .select('full_name')
      .eq('id', user.id)
      .maybeSingle()

    const name = profile?.full_name || user.email?.split('@')[0] || 'Partner'

    // Generiraj unikatni kod
    let code = generateCode(name)
    let attempts = 0
    while (attempts < 5) {
      const { data: taken } = await supabase
        .from('affiliates')
        .select('id')
        .eq('code', code)
        .maybeSingle()
      if (!taken) break
      code = generateCode(name)
      attempts++
    }

    // Kreiraj affiliate zapis
    const { data: newAffiliate, error: createError } = await supabase
      .from('affiliates')
      .insert({
        user_id: user.id,
        code,
        commission_percent: 30,
        is_active: true,
      })
      .select()
      .single()

    if (createError) {
      console.error('Affiliate create error:', createError)
      return NextResponse.json({ error: 'Greška pri kreiranju računa.' }, { status: 500 })
    }

    // Pošalji welcome email
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://fincoach.vip'
    const affiliateLink = `${siteUrl}?ref=${code}`

    const { sendTransactionalEmail } = await import('@/lib/brevo')
    await sendTransactionalEmail({
      to: [{ email: user.email!, name }],
      subject: '🎉 Dobrodošao/la u FinCoach partnerski program!',
      htmlContent: `<!DOCTYPE html>
<html><head><meta charset="utf-8">
<style>
  body{font-family:Inter,Arial,sans-serif;background:#f1f5f9;margin:0;padding:0}
  .wrap{max-width:600px;margin:32px auto;background:#0D1B2A;border-radius:14px;overflow:hidden}
  .header{background:linear-gradient(135deg,#0D1B2A 0%,#1a2f47 100%);padding:32px 40px;text-align:center}
  .logo{color:#D4AF37;font-size:22px;font-weight:800;letter-spacing:1px}
  .body{padding:40px;color:#fff}
  h2{color:#D4AF37;font-size:22px;font-weight:700;margin:0 0 20px}
  p{color:#cbd5e0;line-height:1.75;margin:0 0 16px;font-size:15px}
  .box{background:#0a1929;border:1px solid rgba(212,175,55,0.4);border-radius:10px;padding:20px 24px;margin:20px 0}
  .btn{display:inline-block;background:#D4AF37;color:#0D1B2A;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:800;font-size:15px}
  .footer{background:#091623;padding:20px 40px;text-align:center;color:#4a5568;font-size:12px}
</style>
</head>
<body>
<div class="wrap">
  <div class="header"><div class="logo">FinCoach VIP</div></div>
  <div class="body">
    <h2>Dobrodošao/la u partnerski program! 🎉</h2>
    <p>Dragi/a ${name.split(' ')[0]},</p>
    <p>Tvoja prijava je odobrena! Sad možeš početi zarađivati preporučujući FinCoach VIP tečaj.</p>
    <div class="box">
      <p style="color:#D4AF37;font-weight:700;margin:0 0 12px;">Tvoji podaci:</p>
      <p style="margin:0 0 6px;">🔗 <strong style="color:#fff;">Affiliate link:</strong></p>
      <p style="font-family:monospace;background:#0D1B2A;padding:8px 12px;border-radius:6px;font-size:13px;margin:0 0 12px;word-break:break-all;">${affiliateLink}</p>
      <p style="margin:0 0 6px;">🏷️ <strong style="color:#fff;">Tvoj kod:</strong> <span style="font-family:monospace;font-size:18px;color:#D4AF37;">${code}</span></p>
      <p style="margin:0 0 6px;">💰 <strong style="color:#fff;">Tvoja provizija:</strong> 30% × €357,30 = €107,19 po prodaji</p>
      <p style="margin:0;">🎁 <strong style="color:#fff;">Popust za tvoje kupce:</strong> 10% (€397 → €357,30)</p>
    </div>
    <p>Sve statistike, kreative i tekstove za objave nadeš na partnerskoj stranici:</p>
    <div style="text-align:center;margin:24px 0;">
      <a href="${siteUrl}/portal/affiliate" class="btn">Otvori partnerski portal →</a>
    </div>
    <p style="color:#718096;font-size:13px;">Pitanja? Napiši na brane@fincoach.vip</p>
    <p><span style="color:#D4AF37;font-weight:700;">Brane</span><br><span style="color:#718096;font-size:13px;">FinCoach VIP</span></p>
  </div>
  <div class="footer">© 2026 FinCoach VIP</div>
</div>
</body></html>`,
    })

    return NextResponse.json({ success: true, code, affiliateLink })
  } catch (error) {
    console.error('Affiliate apply error:', error)
    return NextResponse.json({ error: 'Interna greška.' }, { status: 500 })
  }
}
