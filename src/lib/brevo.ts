const BREVO_API_KEY = process.env.BREVO_API_KEY!
const BREVO_API_URL = 'https://api.brevo.com/v3'

interface BrevoContact {
  email: string
  firstName?: string
  lastName?: string
  attributes?: Record<string, string | number | boolean>
  listIds?: number[]
}

interface TransactionalEmailParams {
  to: { email: string; name?: string }[]
  subject: string
  htmlContent: string
  textContent?: string
  replyTo?: { email: string; name?: string }
  params?: Record<string, string | number>
}

async function brevoFetch(endpoint: string, options: RequestInit) {
  const response = await fetch(`${BREVO_API_URL}${endpoint}`, {
    ...options,
    headers: {
      'api-key': BREVO_API_KEY,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Brevo API error ${response.status}: ${error}`)
  }

  if (response.status === 204) return null
  return response.json()
}

export async function addContact(contact: BrevoContact): Promise<{ id: number } | null> {
  try {
    const body: Record<string, unknown> = {
      email: contact.email,
      attributes: {
        FIRSTNAME: contact.firstName ?? '',
        LASTNAME: contact.lastName ?? '',
        ...contact.attributes,
      },
      updateEnabled: true,
    }

    if (contact.listIds && contact.listIds.length > 0) {
      body.listIds = contact.listIds
    }

    const result = await brevoFetch('/contacts', {
      method: 'POST',
      body: JSON.stringify(body),
    })

    return result
  } catch (error) {
    console.error('Error adding Brevo contact:', error)
    return null
  }
}

export async function triggerEmailSequence(email: string, workflowId: number): Promise<void> {
  try {
    await brevoFetch('/contacts/doubleOptinConfirmation', {
      method: 'POST',
      body: JSON.stringify({
        email,
        includeListIds: [workflowId],
        templateId: workflowId,
      }),
    })
  } catch (error) {
    console.error('Error triggering Brevo email sequence:', error)
  }
}

export async function sendTransactionalEmail(params: TransactionalEmailParams): Promise<void> {
  try {
    await brevoFetch('/smtp/email', {
      method: 'POST',
      body: JSON.stringify({
        sender: {
          name: 'Brane | FinCoach VIP',
          email: process.env.SENDER_EMAIL ?? 'brane@fincoach.vip',
        },
        to: params.to,
        subject: params.subject,
        htmlContent: params.htmlContent,
        textContent: params.textContent,
        replyTo: params.replyTo ?? {
          email: process.env.SENDER_EMAIL ?? 'brane@fincoach.vip',
          name: 'Brane',
        },
        params: params.params,
      }),
    })
  } catch (error) {
    console.error('Error sending Brevo transactional email:', error)
  }
}

export async function sendWelcomeEmail(email: string, name: string, generatedPassword?: string): Promise<void> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://fincoach.vip'

  const credentialsBlock = generatedPassword ? `
    <div style="background: #0a1929; border: 1px solid #D4AF37; border-radius: 10px; padding: 24px; margin: 24px 0;">
      <p style="color: #D4AF37; font-weight: 700; margin: 0 0 12px 0; font-size: 15px;">🔐 Tvoji prijavni podaci</p>
      <p style="color: #cbd5e0; margin: 6px 0; font-size: 14px;"><strong style="color: #fff;">Email:</strong> ${email}</p>
      <p style="color: #cbd5e0; margin: 6px 0; font-size: 14px;"><strong style="color: #fff;">Lozinka:</strong> <span style="font-family: monospace; background: #1a2f47; padding: 2px 8px; border-radius: 4px; letter-spacing: 1px;">${generatedPassword}</span></p>
      <p style="color: #718096; font-size: 12px; margin: 12px 0 0 0;">Možeš promijeniti lozinku nakon prijave klikom na "Zaboravili ste lozinku?".</p>
    </div>
  ` : ''

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Inter, sans-serif; background: #f8f9fa; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 40px auto; background: #0D1B2A; border-radius: 12px; overflow: hidden; }
        .header { background: linear-gradient(135deg, #0D1B2A 0%, #1a2f47 100%); padding: 40px; text-align: center; }
        .logo { color: #D4AF37; font-size: 24px; font-weight: 700; letter-spacing: 1px; }
        .body { padding: 40px; color: #ffffff; }
        .h1 { color: #D4AF37; font-size: 28px; font-weight: 700; margin-bottom: 20px; }
        .p { color: #cbd5e0; line-height: 1.7; margin-bottom: 16px; }
        .btn { display: inline-block; background: #D4AF37; color: #0D1B2A; padding: 16px 32px; border-radius: 8px; text-decoration: none; font-weight: 700; font-size: 16px; margin: 20px 0; }
        .footer { background: #091623; padding: 24px 40px; text-align: center; color: #4a5568; font-size: 13px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">FinCoach VIP</div>
        </div>
        <div class="body">
          <div class="h1">Dobrodošao/la, ${name}! 🎉</div>
          <p class="p">Čestitamo! Uspješno si se pridružio/la programu <strong>FinCoach VIP — 90-dnevni financijski tečaj</strong>.</p>
          ${credentialsBlock}
          <p class="p">Tvoj pristup portalu je aktivan. Možeš početi s prvom lekcijom odmah.</p>
          <p class="p">Svaki dan ćeš dobiti novu video lekciju koja će te korak po korak voditi prema financijskoj slobodi.</p>
          <div style="text-align: center;">
            <a href="${siteUrl}/prijava" class="btn">Prijavi se u portal →</a>
          </div>
          <p class="p">Ako imaš bilo kakvih pitanja, slobodno mi se javi odgovorom na ovaj email.</p>
          <p class="p">Do prvog dana!</p>
          <p class="p"><strong>Brane</strong><br>Financijski coach</p>
        </div>
        <div class="footer">
          © 2026 FinCoach VIP · <a href="${siteUrl}/odjava" style="color: #4a5568;">Odjava</a>
        </div>
      </div>
    </body>
    </html>
  `

  await sendTransactionalEmail({
    to: [{ email, name }],
    subject: 'Dobrodošao/la u FinCoach VIP! Tvoj portal je spreman 🎉',
    htmlContent,
  })
}

export async function sendStarterAccessEmail(
  email: string,
  name: string,
  accessUrl: string,
  financialType?: string
): Promise<void> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://fincoach.vip'

  const typeLabel: Record<string, string> = {
    hedonist: 'Hedonist 🔥',
    branic: 'Branič 🛡️',
    vrtlog: 'Vrtlog 🌀',
    teoreticar: 'Teoretičar 📚',
  }
  const tipText = financialType && typeLabel[financialType]
    ? `<p style="color:#D4AF37;font-weight:700;margin:0 0 6px;">Tvoj financijski tip: ${typeLabel[financialType]}</p>`
    : ''

  const firstName = name.split(' ')[0] || 'prijatelju'

  const htmlContent = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8">
<style>
  body { font-family: Inter, Arial, sans-serif; background: #f1f5f9; margin: 0; padding: 0; }
  .wrap { max-width: 600px; margin: 32px auto; background: #0D1B2A; border-radius: 14px; overflow: hidden; }
  .header { background: linear-gradient(135deg, #0D1B2A 0%, #1a2f47 100%); padding: 32px 40px; text-align: center; }
  .logo { color: #D4AF37; font-size: 22px; font-weight: 800; letter-spacing: 1px; }
  .body { padding: 40px; color: #fff; }
  h2 { color: #D4AF37; font-size: 22px; font-weight: 700; margin: 0 0 20px; line-height: 1.3; }
  p { color: #cbd5e0; line-height: 1.75; margin: 0 0 16px; font-size: 15px; }
  .btn { display: inline-block; background: #D4AF37; color: #0D1B2A; padding: 16px 36px; border-radius: 8px; text-decoration: none; font-weight: 800; font-size: 16px; margin: 8px 0; }
  .box { background: #0a1929; border: 1px solid rgba(212,175,55,0.35); border-radius: 10px; padding: 20px 24px; margin: 20px 0; }
  .footer { background: #091623; padding: 20px 40px; text-align: center; color: #4a5568; font-size: 12px; }
  .sig { color: #D4AF37; font-weight: 700; font-size: 15px; }
</style>
</head>
<body>
<div class="wrap">
  <div class="header"><div class="logo">FinCoach VIP</div></div>
  <div class="body">
    <h2>Dragi/a ${firstName}, Starter Paket je tvoj! 🎉</h2>
    <p>Hvala na povjerenju. Tvoja Financijska dijagnoza je aktivna i čeka te unutar aplikacije.</p>
    <div class="box">
      ${tipText}
      <p style="color:#fff;font-weight:700;margin:0 0 12px;">Što te čeka:</p>
      <p style="margin:0 0 6px;">📊 <strong>Financijski Health Score</strong> — vidiš točno gdje stojite</p>
      <p style="margin:0 0 6px;">🧠 <strong>Profil tvog financijskog tipa</strong> + personalizirani savjeti</p>
      <p style="margin:0 0 6px;">📅 <strong>30-dnevni plan</strong> prilagođen točno tvom tipu</p>
      <p style="margin:0;">🎬 <strong>4 ekskluzivna videa</strong> s Branetom (1 svaki tjedan)</p>
    </div>
    <p>Tvoj pristup je siguran i osoban — link ispod vrijedi samo za tebe:</p>
    <div style="text-align:center;margin:24px 0;">
      <a href="${accessUrl}" class="btn">Otvori svoju dijagnozu →</a>
    </div>
    <p style="font-size:13px;color:#718096;">Pohrani ovaj link — to je tvoj osobni pristup. Ne dijeli ga s drugima.</p>
    <p><span class="sig">Brane</span><br><span style="color:#718096;font-size:13px;">FinCoach VIP</span></p>
    <p style="margin-top:24px;padding-top:16px;border-top:1px solid rgba(255,255,255,0.08);font-size:12px;color:#718096;">
      Primio/la si ovaj email jer si kupio/la Financijski Starter Paket na fincoach.vip.<br>
      Ako smatraš da je ovo greška, kontaktiraj nas na <a href="mailto:brane@fincoach.vip" style="color:#718096;">brane@fincoach.vip</a><br>
      <a href="${siteUrl}/odjava?email=${encodeURIComponent(email)}" style="color:#4a5568;">Odjavi se od marketinških emailova</a>
    </p>
  </div>
  <div class="footer">© 2026 FinCoach VIP</div>
</div>
</body>
</html>`

  await sendTransactionalEmail({
    to: [{ email, name }],
    subject: `${firstName}, tvoj Starter Paket je spreman — otvori odmah`,
    htmlContent,
  })
}

export async function sendStarterPortalEmail(email: string, name: string, generatedPassword: string): Promise<void> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://fincoach.vip'
  const firstName = name.split(' ')[0] || 'prijatelju'

  const htmlContent = `<!DOCTYPE html>
<html><head><meta charset="utf-8">
<style>
  body{font-family:Inter,Arial,sans-serif;background:#f1f5f9;margin:0;padding:0}
  .wrap{max-width:600px;margin:32px auto;background:#0D1B2A;border-radius:14px;overflow:hidden}
  .header{background:linear-gradient(135deg,#0D1B2A 0%,#1a2f47 100%);padding:32px 40px;text-align:center}
  .logo{color:#D4AF37;font-size:22px;font-weight:800;letter-spacing:1px}
  .body{padding:40px;color:#fff}
  h2{color:#D4AF37;font-size:22px;font-weight:700;margin:0 0 20px;line-height:1.3}
  p{color:#cbd5e0;line-height:1.75;margin:0 0 16px;font-size:15px}
  .btn{display:inline-block;background:#D4AF37;color:#0D1B2A;padding:16px 36px;border-radius:8px;text-decoration:none;font-weight:800;font-size:16px;margin:8px 0}
  .box{background:#0a1929;border:1px solid rgba(212,175,55,0.35);border-radius:10px;padding:20px 24px;margin:20px 0}
  .footer{background:#091623;padding:20px 40px;text-align:center;color:#4a5568;font-size:12px}
</style>
</head>
<body>
<div class="wrap">
  <div class="header"><div class="logo">FinCoach VIP</div></div>
  <div class="body">
    <h2>Dragi/a ${firstName}, tvoj portal je spreman! 🎉</h2>
    <p>Uz Starter Paket dobivaš i pristup korisničkom portalu gdje ćeš pratiti svoju dijagnozu, 30-dnevni plan i ekskluzivne videe.</p>
    <div class="box">
      <p style="color:#D4AF37;font-weight:700;margin:0 0 12px;">🔐 Tvoji prijavni podaci</p>
      <p style="margin:6px 0;font-size:14px;color:#cbd5e0;"><strong style="color:#fff;">Email:</strong> ${email}</p>
      <p style="margin:6px 0;font-size:14px;color:#cbd5e0;"><strong style="color:#fff;">Lozinka:</strong> <span style="font-family:monospace;background:#1a2f47;padding:2px 8px;border-radius:4px;letter-spacing:1px;">${generatedPassword}</span></p>
      <p style="color:#718096;font-size:12px;margin:12px 0 0;">Možeš promijeniti lozinku unutar portala u postavkama.</p>
    </div>
    <p>U portalu ćeš naći:</p>
    <p style="margin:4px 0;">📊 <strong style="color:#fff;">Financijsku dijagnozu</strong> — Health Score + profil tvog tipa</p>
    <p style="margin:4px 0;">📅 <strong style="color:#fff;">30-dnevni plan</strong> — personaliziran za tvoj tip</p>
    <p style="margin:4px 0;">🎬 <strong style="color:#fff;">Ekskluzivna videa</strong> — svaki tjedan jedno novo</p>
    <p style="margin:4px 0 16px;">🤝 <strong style="color:#fff;">Affiliate program</strong> — zarađuj preporučujući FinCoach</p>
    <div style="text-align:center;margin:28px 0;">
      <a href="${siteUrl}/prijava" class="btn">Prijavi se u portal →</a>
    </div>
    <p style="font-size:13px;color:#718096;">Link vodi na stranicu za prijavu — unesi email i gore navedenu lozinku.</p>
    <p><strong style="color:#D4AF37;">Brane</strong><br><span style="color:#718096;font-size:13px;">FinCoach VIP</span></p>
  </div>
  <div class="footer">© 2026 FinCoach VIP</div>
</div>
</body></html>`

  await sendTransactionalEmail({
    to: [{ email, name }],
    subject: `${firstName}, tvoj FinCoach portal je aktivan — prijavni podaci unutra`,
    htmlContent,
  })
}

export async function sendStarterReengagementEmail(email: string, name: string): Promise<void> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://fincoach.vip'
  const firstName = name.split(' ')[0] || 'prijatelju'
  const portalUrl = `${siteUrl}/portal/starter`

  const htmlContent = `<!DOCTYPE html>
<html><head><meta charset="utf-8">
<style>
  body{font-family:Inter,Arial,sans-serif;background:#f1f5f9;margin:0;padding:0}
  .wrap{max-width:600px;margin:32px auto;background:#0D1B2A;border-radius:14px;overflow:hidden}
  .header{background:linear-gradient(135deg,#0D1B2A 0%,#1a2f47 100%);padding:32px 40px;text-align:center}
  .logo{color:#D4AF37;font-size:22px;font-weight:800;letter-spacing:1px}
  .body{padding:40px;color:#fff}
  h2{color:#D4AF37;font-size:22px;font-weight:700;margin:0 0 20px;line-height:1.3}
  p{color:#cbd5e0;line-height:1.75;margin:0 0 16px;font-size:15px}
  .btn{display:inline-block;background:#D4AF37;color:#0D1B2A;padding:16px 36px;border-radius:8px;text-decoration:none;font-weight:800;font-size:16px;margin:8px 0}
  .box{background:#0a1929;border:1px solid rgba(212,175,55,0.35);border-radius:10px;padding:20px 24px;margin:20px 0}
  .footer{background:#091623;padding:20px 40px;text-align:center;color:#4a5568;font-size:12px}
</style>
</head>
<body>
<div class="wrap">
  <div class="header"><div class="logo">FinCoach VIP</div></div>
  <div class="body">
    <h2>Čekamo te, ${firstName}! 👋</h2>
    <p>Primijetili smo da nisi bio/bila u svom Starter portalu već 2 dana.</p>
    <p>Razumijemo — život je gužva. Ali financijska sloboda ne čeka.</p>
    <div class="box">
      <p style="color:#D4AF37;font-weight:700;margin:0 0 10px;">💡 Zašto je kontinuitet važan:</p>
      <p style="margin:4px 0;font-size:14px;">✅ <strong style="color:#fff;">Polaznici koji svaki dan odrade bar 1 zadatak</strong> završe plan 4× češće.</p>
      <p style="margin:4px 0;font-size:14px;">📅 Samo <strong style="color:#fff;">5 minuta dnevno</strong> — to je sve što treba.</p>
      <p style="margin:4px 0 0;font-size:14px;">🏆 <strong style="color:#fff;">30 dana</strong> = trajne navike koje funkcioniraju i bez volje.</p>
    </div>
    <p>Tvoj 30-dnevni plan čeka točno tamo gdje si stao/la. Samo se vrati i nastavi — bez krivnje, bez ispočetka.</p>
    <div style="text-align:center;margin:28px 0;">
      <a href="${portalUrl}" class="btn">Nastavi plan →</a>
    </div>
    <p>Navijam za tebe! 💪</p>
    <p><strong style="color:#D4AF37;">Brane</strong><br><span style="color:#718096;font-size:13px;">Financijski coach · FinCoach VIP</span></p>
  </div>
  <div class="footer">© 2026 FinCoach VIP &nbsp;·&nbsp; <a href="${siteUrl}/odjava" style="color:#4a5568;">Odjava</a></div>
</div>
</body></html>`

  await sendTransactionalEmail({
    to: [{ email, name }],
    subject: `${firstName}, tvoj 30-dnevni plan čeka — nastavi gdje si stao/la 📅`,
    htmlContent,
  })
}

export async function sendLeadPdfEmail(email: string, name: string, pdfUrl: string): Promise<void> {
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Inter, sans-serif; background: #f8f9fa; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 40px auto; background: #0D1B2A; border-radius: 12px; overflow: hidden; }
        .header { background: linear-gradient(135deg, #0D1B2A 0%, #1a2f47 100%); padding: 40px; text-align: center; }
        .logo { color: #D4AF37; font-size: 24px; font-weight: 700; letter-spacing: 1px; }
        .body { padding: 40px; color: #ffffff; }
        .h1 { color: #D4AF37; font-size: 26px; font-weight: 700; margin-bottom: 20px; }
        .p { color: #cbd5e0; line-height: 1.7; margin-bottom: 16px; }
        .btn { display: inline-block; background: #D4AF37; color: #0D1B2A; padding: 16px 32px; border-radius: 8px; text-decoration: none; font-weight: 700; font-size: 16px; margin: 20px 0; }
        .footer { background: #091623; padding: 24px 40px; text-align: center; color: #4a5568; font-size: 13px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">FinCoach VIP</div>
        </div>
        <div class="body">
          <div class="h1">Evo tvog besplatnog vodiča, ${name}!</div>
          <p class="p">Hvala što si preuzeo/la vodič <strong>"Savjeti i tehnike za financijsku stabilnost"</strong> od Brane Recek.</p>
          <p class="p">Unutar ćeš pronaći konkretne, odmah primjenjive savjete i tehnike koji su pomogli stotinama ljudi preuzeti kontrolu nad financijama.</p>
          <div style="text-align: center;">
            <a href="${pdfUrl}" class="btn">Preuzmi vodič (PDF) →</a>
          </div>
          <p class="p">Kao poseban bonus, za sljedeća <strong>3 dana</strong> imaš pristup posebnoj cijeni za naš kompletan 90-dnevni program.</p>
          <div style="text-align: center; margin-top: 8px;">
            <a href="${process.env.NEXT_PUBLIC_SITE_URL}/volim-svoj-novac" style="color: #D4AF37;">Pogledaj kompletan tečaj →</a>
          </div>
          <p class="p" style="margin-top: 24px; font-size: 13px; color: #718096;">
            Primio/la si ovaj email jer si preuzeo/la besplatni vodič s fincoach.vip.<br>
            <a href="${process.env.NEXT_PUBLIC_SITE_URL}/odjava" style="color: #718096;">Odjavi se ovdje</a> ako ne želiš više primati emailove.
          </p>
        </div>
        <div class="footer">
          © 2026 FinCoach VIP · <a href="${process.env.NEXT_PUBLIC_SITE_URL}/odjava" style="color: #4a5568;">Odjava</a>
        </div>
      </div>
    </body>
    </html>
  `

  await sendTransactionalEmail({
    to: [{ email, name }],
    subject: 'Tvoj besplatni vodič je spreman za preuzimanje',
    htmlContent,
  })
}