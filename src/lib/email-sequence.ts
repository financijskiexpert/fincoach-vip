import { sendTransactionalEmail } from './brevo'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://fincoach.vip'
const DISCOUNT_CODE = 'PRIJATELJ'

// Email sequence — svake 2 dana, 7 emailova
// Indeks = redni broj emaila (0 = odmah/dan 0, već šalje sendLeadPdfEmail)
// Ovi emailovi kreću od dana 2

export const EMAIL_SEQUENCE: Array<{
  dayOffset: number
  subject: string
  type: 'educational' | 'sales' | 'story' | 'social_proof' | 'affiliate'
  skipIfPurchased: boolean
}> = [
  { dayOffset: 2,  subject: 'Znaš li koliko novca "curi" svakog dana?',            type: 'educational',   skipIfPurchased: false },
  { dayOffset: 4,  subject: 'Moja priča: Kako sam izgubio sve i krenuo ispočetka',  type: 'story',         skipIfPurchased: false },
  { dayOffset: 6,  subject: '3 financijske navike koje mijenjaju sve',              type: 'educational',   skipIfPurchased: false },
  { dayOffset: 8,  subject: 'Tomislav je u 60 dana eliminirao dug od 8.000 €',     type: 'social_proof',  skipIfPurchased: false },
  { dayOffset: 10, subject: 'Posebna ponuda za tebe — samo 48 sati',               type: 'sales',         skipIfPurchased: true  },
  { dayOffset: 14, subject: 'Zadnja prilika + kod za popust (ističe u ponoć)',      type: 'sales',         skipIfPurchased: true  },
  { dayOffset: 21, subject: 'Zaradi dok preporučuješ — postani FinCoach partner',  type: 'affiliate',     skipIfPurchased: false },
]

function emailBase(content: string, unsubEmail: string): string {
  return `<!DOCTYPE html>
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
  .btn { display: inline-block; background: #D4AF37; color: #0D1B2A; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 800; font-size: 15px; margin: 8px 0; }
  .box { background: #0a1929; border: 1px solid rgba(212,175,55,0.3); border-radius: 10px; padding: 20px 24px; margin: 20px 0; }
  .footer { background: #091623; padding: 20px 40px; text-align: center; color: #4a5568; font-size: 12px; }
  .signature { color: #D4AF37; font-weight: 700; font-size: 15px; }
</style>
</head>
<body>
<div class="wrap">
  <div class="header"><div class="logo">FinCoach VIP</div></div>
  <div class="body">${content}</div>
  <div class="footer">
    © 2026 FinCoach VIP · Smart Money Solutions d.o.o.<br>
    <a href="${SITE_URL}/odjava?email=${encodeURIComponent(unsubEmail)}" style="color: #4a5568;">Odjavi se od emailova</a>
  </div>
</div>
</body>
</html>`
}

export function buildEmailContent(
  sequenceIndex: number,
  name: string,
  email: string
): { subject: string; html: string } | null {
  const seq = EMAIL_SEQUENCE[sequenceIndex]
  if (!seq) return null

  const firstName = name.split(' ')[0] || 'prijatelju'

  switch (sequenceIndex) {
    // Email 1 — Dan 2 — Edukativni: "curi novac"
    case 0: return {
      subject: seq.subject,
      html: emailBase(`
        <h2>Znaš li koliko novca "curi" svakog dana, ${firstName}?</h2>
        <p>Nadam se da si dobio/la vodič i da si ga već počeo/la čitati. 😊</p>
        <p>Danas sam htio/htjela podijeliti s tobom nešto što većina ljudi nikad ne izračuna:</p>
        <div class="box">
          <p style="margin:0; color:#D4AF37; font-weight:700;">💡 Vježba: "Audit novca"</p>
          <p style="margin: 10px 0 0;">Uzmi zadnja 3 bankovinska izvoda. Zbrojivi sve što si potrošio/la na:</p>
          <p style="margin:6px 0;">→ Kavu van kuće<br>→ Pretplate (streaming, gym, appi...)<br>→ Dostava hrane<br>→ Impulzivne kupnje</p>
          <p style="margin:10px 0 0;">Većina ljudi otkrije da "izgubi" između <strong style="color:#fff;">200€ i 500€ mjesečno</strong> a da toga uopće nije svjesna.</p>
        </div>
        <p>Ovo nije o odricanju. Radi se o <strong style="color:#fff;">svjesnosti</strong>. Kad vidiš brojke, sve se promijeni.</p>
        <p>U vodiču koji si preuzeo/la nalazi se cijeli sustav za ovu vrstu analize. Ako još nisi stigao/la pročitati — preporučujem da krenem s poglavljem <strong style="color:#fff;">"Analiza financijske situacije"</strong>.</p>
        <p>Sutra ti ne pišem — ali za 2 dana dijelim nešto osobno što mi je promijenilo život. 🙏</p>
        <p>Srdačno,<br><span class="signature">Brane Recek</span><br><span style="color:#718096; font-size:13px;">Financijski coach · FinCoach VIP</span></p>
      `, email),
    }

    // Email 2 — Dan 4 — Priča
    case 1: return {
      subject: seq.subject,
      html: emailBase(`
        <h2>Kako sam izgubio sve i krenuo ispočetka</h2>
        <p>Dragi/a ${firstName},</p>
        <p>Ovo je priča koju rijetko pričam — ali mislim da je važna za tebe.</p>
        <p>Prije više od 30 godina radio sam kao i većina: radio, zarađivao, trošio. Bio sam uvjeren da znam sve o novcu jer sam radio u financijama.</p>
        <p>Griješio sam.</p>
        <div class="box">
          <p style="margin:0; color:#fff; font-style: italic;">"Zarađivao sam pristojno, ali novac je nekako uvijek nestajao. Imao sam dugove, stres, i osjećaj da financijska sloboda nije za ljude poput mene."</p>
        </div>
        <p>Tada sam upoznao mentora koji mi je rekao nešto što me je promijenilo:</p>
        <p style="font-size: 17px; color: #D4AF37; font-weight: 700; line-height: 1.5;">"Brane, problem nije u tome koliko zarađuješ. Problem je u tome što nikad nisi naučio što raditi s novcem."</p>
        <p>Počeo sam od nule. Primjenio sam sustav. I danas živim financijsku slobodu o kojoj sam nekad samo sanjao.</p>
        <p>Sve što sam naučio — komprimirano u 90 dana — sada dijelim s tobom.</p>
        <p>Za 2 dana šaljem ti 3 konkretne navike koje su mi promijenile sve. 💪</p>
        <p>Do tada,<br><span class="signature">Brane</span></p>
      `, email),
    }

    // Email 3 — Dan 6 — Edukativni: 3 navike
    case 2: return {
      subject: seq.subject,
      html: emailBase(`
        <h2>3 financijske navike koje mijenjaju sve</h2>
        <p>Bok ${firstName},</p>
        <p>Kao što sam obećao — evo 3 navike koje su mi (i stotinama mojih polaznika) promijenile financijsku situaciju:</p>
        <div class="box">
          <p style="color:#D4AF37; font-weight:700; margin: 0 0 12px;">1. 🧾 "Plati prvo sebe" — 10% odmah</p>
          <p style="margin:0;">Čim primite plaću — odmah prebaci 10% na poseban račun. Prije svih računa. Automatski. Ovo je temelj svega.</p>
        </div>
        <div class="box">
          <p style="color:#D4AF37; font-weight:700; margin: 0 0 12px;">2. 📊 Tjedni "financijski check-in" — 10 minuta</p>
          <p style="margin:0;">Svaki ponedjeljak, 10 minuta: pregled troškova prošlog tjedna, usporedba s planom. Samo svjesnost — bez kazni.</p>
        </div>
        <div class="box">
          <p style="color:#D4AF37; font-weight:700; margin: 0 0 12px;">3. 🎯 Formula 50/30/20</p>
          <p style="margin:0;">50% na potrebe, 30% na želje, 20% na štednju i dugove. Jednostavno, ali brutalno učinkovito kada se konzistentno primjenjuje.</p>
        </div>
        <p>Ove 3 navike — ako ih primjenjiš samo ovaj tjedan — već ćeš vidjeti razliku.</p>
        <p>U mojem 90-dnevnom programu gradimo ove navike korak po korak, svaki dan, s video podrškom i radnim listovima.</p>
        <div style="text-align:center; margin: 24px 0;">
          <a href="${SITE_URL}/tecaj" class="btn">Pogledaj kompletan program →</a>
        </div>
        <p>Za 2 dana šaljem ti priču jednog od mojih polaznika koja te neće ostaviti ravnodušnim. 🙏</p>
        <p><span class="signature">Brane</span></p>
      `, email),
    }

    // Email 4 — Dan 8 — Social proof
    case 3: return {
      subject: seq.subject,
      html: emailBase(`
        <h2>Tomislav je u 60 dana eliminirao dug od 8.000 €</h2>
        <p>Bok ${firstName},</p>
        <p>Danas ti dijelim priču Tomislava, freelancera iz Osijeka:</p>
        <div class="box">
          <p style="color:#fff; font-style:italic; margin:0 0 12px;">"Kao freelancer, nikad nisam znao planirati s nepravilnim prihodima. Kad dođe dobri mjesec — potrošim. Kad dođe loš — panika.</p>
          <p style="color:#fff; font-style:italic; margin:0 0 12px;">Nakon što sam krenuo s Braninim programom, postavio sam sustav koji radi bez obzira na to je li bio dobar ili loš mjesec.</p>
          <p style="color:#fff; font-style:italic; margin:0;">Za 60 dana eliminirao sam dug od 8.000 €. Danas investiram — prvi put u životu."</p>
          <p style="color:#D4AF37; font-size:13px; margin:12px 0 0;">— Tomislav R., freelancer, Osijek ⭐⭐⭐⭐⭐</p>
        </div>
        <p>Tomislav nije iznimka. Isti rezultati čekaju i tebe — samo trebaš sustav.</p>
        <p>Zapamti: <strong style="color:#fff;">nije pitanje volje. Pitanje je sustava.</strong></p>
        <div style="text-align:center; margin: 24px 0;">
          <a href="${SITE_URL}/tecaj" class="btn">Saznaj više o programu →</a>
        </div>
        <p><span class="signature">Brane</span></p>
      `, email),
    }

    // Email 5 — Dan 10 — Sales sa kodom (skipIfPurchased)
    case 4: return {
      subject: seq.subject,
      html: emailBase(`
        <h2>Posebna ponuda za tebe, ${firstName} — samo 48 sati</h2>
        <p>Dragi/a ${firstName},</p>
        <p>Zadnjih 10 dana dijelio/la sam s tobom:</p>
        <p>✅ Vodič "Savjeti i tehnike za financijsku stabilnost"<br>
           ✅ Vježbu "Audit novca"<br>
           ✅ Moju osobnu priču<br>
           ✅ 3 navike koje mijenjaju sve<br>
           ✅ Priču Tomislava koji je eliminirao dug od 8.000 €</p>
        <p>Sve ovo je samo <strong style="color:#fff;">uvod</strong> u ono što dobivate u kompletnom 90-dnevnom programu.</p>
        <div class="box" style="border-color: #D4AF37; text-align: center;">
          <p style="color:#D4AF37; font-weight:800; font-size:18px; margin: 0 0 8px;">Posebna cijena samo za tebe</p>
          <p style="text-decoration:line-through; color:#718096; margin:0; font-size:14px;">Redovna cijena: €397</p>
          <p style="font-size:42px; font-weight:900; color:#D4AF37; margin: 4px 0;">€97</p>
          <p style="color:#fff; margin:0 0 16px; font-size:13px;">Vrijedi samo 48 sati · Upiši kod pri naplati:</p>
          <p style="font-family:monospace; font-size:24px; font-weight:900; color:#fff; background:#1a2f47; padding:10px 20px; border-radius:8px; display:inline-block; letter-spacing:2px;">${DISCOUNT_CODE}</p>
        </div>
        <div style="text-align:center; margin: 24px 0;">
          <a href="${SITE_URL}/tecaj" class="btn">Upiši se po cijeni od €97 →</a>
        </div>
        <p style="color:#718096; font-size:13px; text-align:center;">30-dnevna garancija povrata novca — bez pitanja.</p>
        <p><span class="signature">Brane</span></p>
      `, email),
    }

    // Email 6 — Dan 14 — Urgency
    case 5: return {
      subject: seq.subject,
      html: emailBase(`
        <h2>⏰ Zadnja šansa — kod ističe večeras u ponoć</h2>
        <p>Dragi/a ${firstName},</p>
        <p>Znam da si zauzet/a. Znam da postoji "idealan trenutak za početak".</p>
        <p>Ali reci mi iskreno — koliko puta si si to rekao/la u zadnjoj godini?</p>
        <p>Savršen trenutak neće doći. <strong style="color:#fff;">Trenutak je sada.</strong></p>
        <div class="box" style="border-color: #ef4444;">
          <p style="color:#ef4444; font-weight:800; margin:0 0 8px;">⏳ ISTIČE VEČERAS U PONOĆ</p>
          <p style="margin:0;">Kod <strong style="font-family:monospace; font-size:18px; color:#D4AF37;">${DISCOUNT_CODE}</strong> — cijena €97 umjesto €397</p>
          <p style="margin:8px 0 0; color:#718096; font-size:13px;">Nakon ponoći, cijena se vraća na €197.</p>
        </div>
        <p>Što dobivaš:</p>
        <p>✅ 90 video lekcija (10-20 minuta dnevno)<br>
           ✅ Radni listovi i predlošci<br>
           ✅ Privatna zajednica polaznika<br>
           ✅ Certifikat po završetku<br>
           ✅ Doživotni pristup + sve buduće nadopune</p>
        <div style="text-align:center; margin: 24px 0;">
          <a href="${SITE_URL}/tecaj" class="btn">Da, upisujem se sada →</a>
        </div>
        <p style="color:#718096; font-size:13px; text-align:center;">30-dnevna garancija povrata. Nema rizika.</p>
        <p><span class="signature">Brane</span></p>
      `, email),
    }

    // Email 7 — Dan 21 — Affiliate poziv
    case 6: return {
      subject: seq.subject,
      html: emailBase(`
        <h2>Zaradi preporučujući ono što ti pomoglo</h2>
        <p>Bok ${firstName},</p>
        <p>Ako ti je vodič koji smo ti poslali bio od pomoći — zamislih kako bi bilo da za svako priporučivanje dobiš i nagradu? 💰</p>
        <p>FinCoach VIP upravo lansira partnerski program — i tražimo <strong style="color:#fff;">prave ambasadore</strong> koji vjeruju u financijsku slobodu.</p>
        <div class="box">
          <p style="color:#D4AF37; font-weight:700; margin: 0 0 12px;">🤝 Kako funkcionira?</p>
          <p style="margin:0 0 8px;">→ Dobiš svoju unikatnu affiliate vezu</p>
          <p style="margin:0 0 8px;">→ Dijeli je s prijatelji, obiteljem, pratiteljima</p>
          <p style="margin:0 0 8px;">→ Za svaku prodaju zaradiš proviziju</p>
          <p style="margin:0;">→ Isplata jednom mjesečno, direktno na tvoj račun</p>
        </div>
        <p>Više detalja (provizije, uvjete, prijavu) uskoro objavljujemo. Ako si zainteresiran/a, odgovori na ovaj email s riječju <strong style="color:#D4AF37;">"PARTNER"</strong> i bit ćeš među prvima koji dobiju pristup.</p>
        <div style="text-align:center; margin: 24px 0;">
          <a href="mailto:brane@fincoach.vip?subject=PARTNER&body=Zanima%20me%20affiliate%20program" class="btn">Zanima me — pošalji mi info →</a>
        </div>
        <p>Hvala ti što si dio FinCoach zajednice. 🙏</p>
        <p><span class="signature">Brane</span></p>
      `, email),
    }

    default: return null
  }
}
