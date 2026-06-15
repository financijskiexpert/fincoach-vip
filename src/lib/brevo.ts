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
          email: process.env.ADMIN_EMAIL ?? 'financijski.expert@gmail.com',
        },
        to: params.to,
        subject: params.subject,
        htmlContent: params.htmlContent,
        textContent: params.textContent,
        replyTo: params.replyTo ?? {
          email: process.env.ADMIN_EMAIL ?? 'financijski.expert@gmail.com',
          name: 'Brane',
        },
        params: params.params,
      }),
    })
  } catch (error) {
    console.error('Error sending Brevo transactional email:', error)
  }
}

export async function sendWelcomeEmail(email: string, name: string): Promise<void> {
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
          <div class="h1">DobrodoĹˇao/la, ${name}! đźŽ‰</div>
          <p class="p">ÄŚestitamo! UspjeĹˇno si se pridruĹľio/la programu <strong>FinCoach VIP â€” 90-dnevni financijski teÄŤaj</strong>.</p>
          <p class="p">Tvoj pristup portalu je aktivan. MoĹľeĹˇ poÄŤeti s prvom lekcijom odmah.</p>
          <p class="p">Svaki dan Ä‡eĹˇ dobiti novu video lekciju koja Ä‡e te korak po korak voditi prema financijskoj slobodi.</p>
          <div style="text-align: center;">
            <a href="${process.env.NEXT_PUBLIC_SITE_URL}/portal" class="btn">Idi na portal â†’</a>
          </div>
          <p class="p">Ako imaĹˇ bilo kakvih pitanja, slobodno mi se javi odgovorom na ovaj email.</p>
          <p class="p">Do prvog dana!</p>
          <p class="p"><strong>Brane</strong><br>Financijski coach</p>
        </div>
        <div class="footer">
          Â© 2024 FinCoach VIP Â· <a href="${process.env.NEXT_PUBLIC_SITE_URL}/odjava" style="color: #4a5568;">Odjava</a>
        </div>
      </div>
    </body>
    </html>
  `

  await sendTransactionalEmail({
    to: [{ email, name }],
    subject: 'DobrodoĹˇao/la u FinCoach VIP! Tvoj portal je spreman đźŽ‰',
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
          <div class="h1">Evo tvog besplatnog vodiÄŤa, ${name}!</div>
          <p class="p">Hvala Ĺˇto si preuzeo/la vodiÄŤ <strong>"5 koraka do financijske slobode"</strong>.</p>
          <p class="p">Unutar Ä‡eĹˇ pronaÄ‡i konkretne, odmah primjenjive korake koji su pomogli stotinama ljudi preuzeti kontrolu nad financijama.</p>
          <div style="text-align: center;">
            <a href="${pdfUrl}" class="btn">Preuzmi vodiÄŤ (PDF) â†’</a>
          </div>
          <p class="p">Kao poseban bonus, za sljedeÄ‡a <strong>3 dana</strong> imaĹˇ pristup posebnoj cijeni za naĹˇ kompletan 90-dnevni program.</p>
          <p class="p">Provjeri ovdje:</p>
          <div style="text-align: center;">
            <a href="${process.env.NEXT_PUBLIC_SITE_URL}/tecaj" style="color: #D4AF37;">Pogledaj teÄŤaj â†’</a>
          </div>
        </div>
        <div class="footer">
          Â© 2024 FinCoach VIP Â· <a href="${process.env.NEXT_PUBLIC_SITE_URL}/odjava" style="color: #4a5568;">Odjava</a>
        </div>
      </div>
    </body>
    </html>
  `

  await sendTransactionalEmail({
    to: [{ email, name }],
    subject: 'Tvoj besplatni vodiÄŤ je spreman za preuzimanje',
    htmlContent,
  })
}
