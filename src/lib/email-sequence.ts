const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://fincoach.vip'
const DISCOUNT_CODE = 'PRIJATELJ'

export const EMAIL_SEQUENCE: Array<{
  dayOffset: number
  subject: string
  type: 'educational' | 'sales' | 'story' | 'social_proof' | 'affiliate' | 'newsletter'
  skipIfPurchased: boolean
  phase: 1 | 2 | 3
}> = [
  // ── FAZA 1 (dani 2-21): Zagrijavanje + prva prodaja ──────────────────────
  { dayOffset: 2,   subject: 'Znaš li koliko novca "curi" svakog dana?',             type: 'educational',  skipIfPurchased: false, phase: 1 },
  { dayOffset: 4,   subject: 'Moja priča: Kako sam izgubio sve i krenuo ispočetka',  type: 'story',        skipIfPurchased: false, phase: 1 },
  { dayOffset: 6,   subject: '3 financijske navike koje mijenjaju sve',              type: 'educational',  skipIfPurchased: false, phase: 1 },
  { dayOffset: 8,   subject: 'Tomislav je u 60 dana eliminirao dug od 8.000 €',      type: 'social_proof', skipIfPurchased: false, phase: 1 },
  { dayOffset: 10,  subject: 'Posebna ponuda za tebe — samo 48 sati',               type: 'sales',        skipIfPurchased: true,  phase: 1 },
  { dayOffset: 14,  subject: 'Zadnja prilika + kod za popust (ističe u ponoć)',      type: 'sales',        skipIfPurchased: true,  phase: 1 },
  { dayOffset: 21,  subject: 'Zaradi dok preporučuješ — postani FinCoach partner',  type: 'affiliate',    skipIfPurchased: false, phase: 1 },

  // ── FAZA 2 (dani 28-84): Tjedno — vrijednost + meka prodaja ──────────────
  { dayOffset: 28,  subject: 'Zašto 80% ljudi nikad ne počne štedjeti (i kako ih 20% uspijeva)', type: 'educational',  skipIfPurchased: false, phase: 2 },
  { dayOffset: 35,  subject: 'Formula bogatih: što rade drugačije nego ostali?',     type: 'educational',  skipIfPurchased: false, phase: 2 },
  { dayOffset: 42,  subject: 'Ana je za 3 mjeseca uštedjela više nego za cijelu godinu', type: 'social_proof', skipIfPurchased: false, phase: 2 },
  { dayOffset: 49,  subject: 'Brane ti otkriva: moja 5 najvećih financijskih grešaka', type: 'story',      skipIfPurchased: false, phase: 2 },
  { dayOffset: 56,  subject: 'Pitanje koje ti mijenja odnos prema novcu zauvijek',   type: 'educational',  skipIfPurchased: false, phase: 2 },
  { dayOffset: 63,  subject: 'Jesi li spreman/na za sljedeći korak? (Posebna cijena)', type: 'sales',     skipIfPurchased: true,  phase: 2 },
  { dayOffset: 70,  subject: 'Pasivni prihod: mit ili stvarnost?',                   type: 'educational',  skipIfPurchased: false, phase: 2 },
  { dayOffset: 77,  subject: 'Darko je počeo investirati — na 42. godini, bez iskustva', type: 'social_proof', skipIfPurchased: false, phase: 2 },
  { dayOffset: 84,  subject: '90 dana može promijeniti tvoju financijsku budućnost', type: 'sales',        skipIfPurchased: true,  phase: 2 },

  // ── FAZA 3 (dani 98+): Dvotjedno — newsletter + prilike ──────────────────
  { dayOffset: 98,  subject: '💡 FinCoach Insights: Inflacija i tvoja štednja',      type: 'newsletter',   skipIfPurchased: false, phase: 3 },
  { dayOffset: 112, subject: '💡 FinCoach Insights: Kako postaviti financijske ciljeve za 2027.', type: 'newsletter', skipIfPurchased: false, phase: 3 },
  { dayOffset: 126, subject: 'Novo u FinCoach programu — pogledaj što smo dodali',   type: 'newsletter',   skipIfPurchased: false, phase: 3 },
  { dayOffset: 140, subject: 'Sezona poreza: 5 stvari koje moraš znati',             type: 'educational',  skipIfPurchased: false, phase: 3 },
  { dayOffset: 154, subject: 'Još uvijek razmišljaš? Evo zašto to ima smisla sada', type: 'sales',        skipIfPurchased: true,  phase: 3 },
  { dayOffset: 168, subject: '💡 FinCoach Insights: Investiranje za početnike',      type: 'newsletter',   skipIfPurchased: false, phase: 3 },
]

// ─── HTML template ────────────────────────────────────────────────────────────

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
  .sig { color: #D4AF37; font-weight: 700; font-size: 15px; }
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

// ─── Sadržaj emaila po indexu ─────────────────────────────────────────────────

export function buildEmailContent(
  sequenceIndex: number,
  name: string,
  email: string
): { subject: string; html: string } | null {
  const seq = EMAIL_SEQUENCE[sequenceIndex]
  if (!seq) return null
  const n = name.split(' ')[0] || 'prijatelju'

  const cases: Record<number, () => string> = {
    // FAZA 1
    0: () => `
      <h2>Znaš li koliko novca "curi" svakog dana, ${n}?</h2>
      <p>Nadam se da si dobio/la vodič i da si ga već počeo/la čitati. 😊</p>
      <p>Danas ti ostavljam jednu vježbu koja većini ljudi otvori oči:</p>
      <div class="box">
        <p style="margin:0; color:#D4AF37; font-weight:700;">💡 "Audit novca" — traje 15 minuta</p>
        <p style="margin:10px 0 0;">Uzmi zadnja 3 bankovinska izvoda i zbrojivi sve što si potrošio/la na: kavu van kuće, pretplate, dostavu hrane i impulzivne kupnje.</p>
        <p style="margin:10px 0 0;">Većina ljudi otkrije da <strong style="color:#fff;">gubi 200-500€ mjesečno</strong> a da toga uopće nije svjesna.</p>
      </div>
      <p>Ovo nije o odricanju — radi se o <strong style="color:#fff;">svjesnosti</strong>. Kad vidiš brojke, sve se promijeni.</p>
      <p>Za 2 dana dijelim svoju osobnu priču. 🙏</p>
      <p><span class="sig">Brane Recek</span><br><span style="color:#718096;font-size:13px;">FinCoach VIP</span></p>`,

    1: () => `
      <h2>Kako sam izgubio sve i krenuo ispočetka</h2>
      <p>Dragi/a ${n},</p>
      <p>Ovo je priča koju rijetko pričam — ali za tebe je važna.</p>
      <p>Zarađivao sam pristojno ali novac je uvijek nekako nestajao. Imao sam dugove i stres. Bio sam uvjeren da znam sve o novcu jer sam radio u financijama godinama.</p>
      <p>Griješio sam.</p>
      <div class="box">
        <p style="margin:0;font-style:italic;color:#fff;">"Problem nije u tome koliko zarađuješ. Problem je što nikad nisi naučio što raditi s novcem."</p>
        <p style="color:#D4AF37;font-size:13px;margin:10px 0 0;">— moj mentor Smiljan Mori</p>
      </div>
      <p>Počeo sam od nule. Primjenio sam sustav. I danas živim financijsku slobodu o kojoj sam nekad samo sanjao.</p>
      <p>Sve to — komprimirano u 90 dana — čeka i tebe.</p>
      <p><span class="sig">Brane</span></p>`,

    2: () => `
      <h2>3 financijske navike koje mijenjaju sve</h2>
      <p>Bok ${n},</p>
      <div class="box"><p style="color:#D4AF37;font-weight:700;margin:0 0 8px;">1. 🧾 "Plati prvo sebe" — 10% odmah</p><p style="margin:0;">Čim primite plaću — odmah prebaci 10% na poseban račun. Automatski. Prije svih računa.</p></div>
      <div class="box"><p style="color:#D4AF37;font-weight:700;margin:0 0 8px;">2. 📊 Tjedni check-in — 10 minuta</p><p style="margin:0;">Svaki ponedjeljak: 10 minuta pregleda troškova. Samo svjesnost — bez kazni.</p></div>
      <div class="box"><p style="color:#D4AF37;font-weight:700;margin:0 0 8px;">3. 🎯 Formula 50/30/20</p><p style="margin:0;">50% potrebe · 30% želje · 20% štednja i dugovi. Jednostavno i brutalno učinkovito.</p></div>
      <p>Ove 3 navike — primjenjiš li ih ovaj tjedan — već ćeš vidjeti razliku.</p>
      <div style="text-align:center;margin:24px 0;"><a href="${SITE_URL}/tecaj" class="btn">Pogledaj kompletan program →</a></div>
      <p><span class="sig">Brane</span></p>`,

    3: () => `
      <h2>Tomislav je u 60 dana eliminirao dug od 8.000 €</h2>
      <p>Bok ${n},</p>
      <div class="box">
        <p style="font-style:italic;color:#fff;margin:0 0 12px;">"Kao freelancer, nikad nisam znao planirati s nepravilnim prihodima. Nakon Braninog programa — eliminirao sam dug od 8.000 € za 60 dana. Danas investiram prvi put u životu."</p>
        <p style="color:#D4AF37;font-size:13px;margin:0;">— Tomislav R., freelancer, Osijek ⭐⭐⭐⭐⭐</p>
      </div>
      <p>Tomislav nije iznimka. <strong style="color:#fff;">Nije pitanje volje. Pitanje je sustava.</strong></p>
      <div style="text-align:center;margin:24px 0;"><a href="${SITE_URL}/tecaj" class="btn">Saznaj više o programu →</a></div>
      <p><span class="sig">Brane</span></p>`,

    4: () => `
      <h2>Posebna ponuda za tebe, ${n} — samo 48 sati</h2>
      <div class="box" style="border-color:#D4AF37;text-align:center;">
        <p style="color:#D4AF37;font-weight:800;font-size:17px;margin:0 0 8px;">Exkluzivna cijena za čitatelje vodiča</p>
        <p style="text-decoration:line-through;color:#718096;margin:0;font-size:13px;">Redovna cijena: €397</p>
        <p style="font-size:44px;font-weight:900;color:#D4AF37;margin:4px 0;">€97</p>
        <p style="color:#fff;margin:0 0 12px;font-size:13px;">Upiši kod pri naplati:</p>
        <p style="font-family:monospace;font-size:24px;font-weight:900;background:#1a2f47;padding:8px 20px;border-radius:8px;display:inline-block;letter-spacing:2px;color:#fff;">${DISCOUNT_CODE}</p>
      </div>
      <p>✅ 90 video lekcija · ✅ Radni listovi · ✅ Certifikat · ✅ Doživotni pristup</p>
      <div style="text-align:center;margin:24px 0;"><a href="${SITE_URL}/tecaj" class="btn">Upiši se po cijeni od €97 →</a></div>
      <p style="color:#718096;font-size:13px;text-align:center;">30-dnevna garancija povrata. Nema rizika.</p>
      <p><span class="sig">Brane</span></p>`,

    5: () => `
      <h2>⏰ Zadnja šansa — kod ističe večeras u ponoć</h2>
      <p>Dragi/a ${n},</p>
      <p>Savršen trenutak neće doći. <strong style="color:#fff;">Trenutak je sada.</strong></p>
      <div class="box" style="border-color:#ef4444;">
        <p style="color:#ef4444;font-weight:800;margin:0 0 8px;">⏳ ISTIČE VEČERAS U PONOĆ</p>
        <p style="margin:0;">Kod <strong style="font-family:monospace;font-size:18px;color:#D4AF37;">${DISCOUNT_CODE}</strong> — cijena €97 umjesto €397</p>
      </div>
      <div style="text-align:center;margin:24px 0;"><a href="${SITE_URL}/tecaj" class="btn">Da, upisujem se sada →</a></div>
      <p style="color:#718096;font-size:13px;text-align:center;">30-dnevna garancija. Nema rizika.</p>
      <p><span class="sig">Brane</span></p>`,

    6: () => `
      <h2>Zaradi preporučujući ono što ti pomoglo</h2>
      <p>Bok ${n},</p>
      <p>FinCoach VIP lansira partnerski program — i tražimo <strong style="color:#fff;">prave ambasadore</strong>.</p>
      <div class="box">
        <p style="color:#D4AF37;font-weight:700;margin:0 0 12px;">🤝 Kako funkcionira?</p>
        <p style="margin:0 0 6px;">→ Dobiš svoju unikatnu affiliate vezu i kod</p>
        <p style="margin:0 0 6px;">→ Tvoji pratitelji kupe s <strong style="color:#fff;">10% popustom</strong> zahvaljujući tebi</p>
        <p style="margin:0 0 6px;">→ Ti zarađuješ <strong style="color:#fff;">30% provizije</strong> od svake prodaje</p>
        <p style="margin:0;">→ Isplata jednom mjesečno, direktno na tvoj račun</p>
      </div>
      <p>Odgovori na ovaj email s riječju <strong style="color:#D4AF37;">"PARTNER"</strong> i bit ćeš među prvima koji dobiju pristup.</p>
      <p><span class="sig">Brane</span></p>`,

    // FAZA 2
    7: () => `
      <h2>Zašto 80% ljudi nikad ne počne štedjeti</h2>
      <p>Bok ${n},</p>
      <p>Istraživanja pokazuju da 80% odraslih planira početi štedjeti — "od sljedećeg mjeseca".</p>
      <div class="box">
        <p style="color:#D4AF37;font-weight:700;margin:0 0 8px;">Razlog nije nedostatak volje.</p>
        <p style="margin:0;">Razlog je što nikad nisu naučili <strong style="color:#fff;">sustav koji radi automatski</strong> — bez volje, bez napora, bez odricanja.</p>
      </div>
      <p>20% koji uspijevaju imaju jedno zajedničko: sustav koji radi za njih, a ne oni za njega.</p>
      <p>Upravo taj sustav gradimo u 90-dnevnom programu — korak po korak.</p>
      <div style="text-align:center;margin:20px 0;"><a href="${SITE_URL}/tecaj" class="btn">Pogledaj kako to izgleda →</a></div>
      <p><span class="sig">Brane</span></p>`,

    8: () => `
      <h2>Formula bogatih: što rade drugačije?</h2>
      <p>Bok ${n},</p>
      <p>Godinama sam pratio financijski uspješne ljude. Evo što ih razlikuje:</p>
      <div class="box">
        <p style="margin:0 0 8px;">💰 <strong style="color:#fff;">Ne troše sve što zarade</strong> — uvijek ostave 20%+ za štednju/investicije</p>
        <p style="margin:0 0 8px;">📈 <strong style="color:#fff;">Novac radi za njih</strong> — pasivni prihodi nisu mit, nego navika</p>
        <p style="margin:0 0 8px;">🧠 <strong style="color:#fff;">Razmišljaju dugoročno</strong> — ne "što mogu priuštiti danas" nego "gdje ću biti za 10 godina"</p>
        <p style="margin:0;">🎯 <strong style="color:#fff;">Imaju plan</strong> — ne improviziraju s novcem</p>
      </div>
      <p>Nijedna od ovih stvari nije genetska ni privilegija bogatih. Sve se uči.</p>
      <div style="text-align:center;margin:20px 0;"><a href="${SITE_URL}/tecaj" class="btn">Nauči i ti →</a></div>
      <p><span class="sig">Brane</span></p>`,

    9: () => `
      <h2>Ana je u 3 mjeseca uštedjela više nego za cijelu godinu</h2>
      <p>Bok ${n},</p>
      <div class="box">
        <p style="font-style:italic;color:#fff;margin:0 0 12px;">"Za 3 mjeseca uspjela sam uštedjeti više nego za cijelu prethodnu godinu. Konačno razumijem kamo odlazi svaka kuna i imam plan. Ovo stvarno funkcionira!"</p>
        <p style="color:#D4AF37;font-size:13px;margin:0;">— Ana M., marketing menadžerica, Rijeka ⭐⭐⭐⭐⭐</p>
      </div>
      <p>Ana nije imala posebnih financijskih znanja. Imala je sustav i 10-20 minuta dnevno.</p>
      <div style="text-align:center;margin:20px 0;"><a href="${SITE_URL}/tecaj" class="btn">Počni i ti danas →</a></div>
      <p><span class="sig">Brane</span></p>`,

    10: () => `
      <h2>Moje 5 najvećih financijskih grešaka</h2>
      <p>Bok ${n},</p>
      <p>Bit ću iskren — i ja sam napravio puno grešaka. Evo pet koje te koštaju i tebe:</p>
      <div class="box">
        <p style="margin:0 0 8px;">❌ Trošio sam VIŠE kad sam zarađivao VIŠE (tzv. lifestyle inflation)</p>
        <p style="margin:0 0 8px;">❌ Nisam imao hitni fond — svaki neočekivani trošak bio je kriza</p>
        <p style="margin:0 0 8px;">❌ Odlagao sam investiranje jer "nisam dovoljno znao"</p>
        <p style="margin:0 0 8px;">❌ Plaćao sam visoke kamate na dugove umjesto da ih konsolidujem</p>
        <p style="margin:0;">❌ Nisam imao pisani financijski plan — sve je bilo "u glavi"</p>
      </div>
      <p>Te greške koštale su me godine napretka. U programu učim kako ih izbjegavate ti.</p>
      <div style="text-align:center;margin:20px 0;"><a href="${SITE_URL}/tecaj" class="btn">Saznaj više →</a></div>
      <p><span class="sig">Brane</span></p>`,

    11: () => `
      <h2>Jedno pitanje koje mijenja odnos prema novcu</h2>
      <p>Bok ${n},</p>
      <p>Ovo je pitanje koje postavljam svim polaznicima na prvom danu:</p>
      <div class="box" style="text-align:center;">
        <p style="font-size:20px;font-weight:700;color:#D4AF37;margin:0;">"Ako bi tvoj novac mogao govoriti — što bi ti rekao?"</p>
      </div>
      <p>Većina ostane u tišini. Jer novac im govori stvari koje ne žele čuti: da ga ignoriraju, da ga ne cijene, da ga ne planiraju.</p>
      <p>Taj trenutak svjesnosti — to je početak promjene.</p>
      <p>Spreman/na za tu promjenu? 90 dana. Korak po korak.</p>
      <div style="text-align:center;margin:20px 0;"><a href="${SITE_URL}/tecaj" class="btn">Pogledaj program →</a></div>
      <p><span class="sig">Brane</span></p>`,

    12: () => `
      <h2>Jesi li spreman/na? Posebna cijena ovaj tjedan</h2>
      <p>Bok ${n},</p>
      <p>Zadnjih 9 tjedana dijelio sam s tobom:</p>
      <p>✅ Vodič za financijsku stabilnost<br>✅ Vježbu "Audit novca"<br>✅ Moju osobnu priču<br>✅ 3 ključne navike<br>✅ Priče polaznika koji su promijenili živote</p>
      <p>Sve ovo je samo uvod u 90-dnevni program.</p>
      <div class="box" style="border-color:#D4AF37;text-align:center;">
        <p style="color:#D4AF37;font-weight:800;font-size:16px;margin:0 0 8px;">Ovo tjedan: kod <span style="font-family:monospace;font-size:20px;">${DISCOUNT_CODE}</span></p>
        <p style="font-size:38px;font-weight:900;color:#D4AF37;margin:4px 0;">€97</p>
        <p style="color:#718096;font-size:12px;margin:0;">Umjesto redovnih €397</p>
      </div>
      <div style="text-align:center;margin:20px 0;"><a href="${SITE_URL}/tecaj" class="btn">Upiši se sada →</a></div>
      <p><span class="sig">Brane</span></p>`,

    13: () => `
      <h2>Pasivni prihod: mit ili stvarnost?</h2>
      <p>Bok ${n},</p>
      <p>Jedan od najčešćih mitova: "Pasivni prihod je samo za bogate."</p>
      <p>Nije. Ali treba red prioriteta:</p>
      <div class="box">
        <p style="color:#D4AF37;font-weight:700;margin:0 0 8px;">Putanja do pasivnog prihoda:</p>
        <p style="margin:0 0 6px;">Korak 1: Zaustavi "curenje" novca</p>
        <p style="margin:0 0 6px;">Korak 2: Izgradi hitni fond (3-6 mjeseci troškova)</p>
        <p style="margin:0 0 6px;">Korak 3: Eliminiraj dugove s visokim kamatama</p>
        <p style="margin:0;">Korak 4: Počni investirati (čak i s 50€/mj)</p>
      </div>
      <p>Upravo ta putanja — korak po korak — je srž 90-dnevnog programa.</p>
      <div style="text-align:center;margin:20px 0;"><a href="${SITE_URL}/tecaj" class="btn">Pogledaj program →</a></div>
      <p><span class="sig">Brane</span></p>`,

    14: () => `
      <h2>Darko je počeo investirati — na 42. godini</h2>
      <p>Bok ${n},</p>
      <div class="box">
        <p style="font-style:italic;color:#fff;margin:0 0 12px;">"Mislio sam da je kasno. Imao sam 42 godine i nikad nisam investirao. Brane mi je pokazao da nije kasno — nego da svaka godina odgode košta puno više nego trošak programa."</p>
        <p style="color:#D4AF37;font-size:13px;margin:0;">— Darko V., inženjer, Ljubljana ⭐⭐⭐⭐⭐</p>
      </div>
      <p>Nije kasno. Jedino što košta skuplje od programa — je čekanje.</p>
      <div style="text-align:center;margin:20px 0;"><a href="${SITE_URL}/tecaj" class="btn">Počni danas →</a></div>
      <p><span class="sig">Brane</span></p>`,

    15: () => `
      <h2>90 dana može promijeniti tvoju financijsku budućnost</h2>
      <p>Bok ${n},</p>
      <p>3 mjeseca od sada — bez obzira što napraviš — proteći će.</p>
      <p>Jedino pitanje je: <strong style="color:#fff;">kakva će biti tvoja financijska situacija za 3 mjeseca?</strong></p>
      <div class="box">
        <p style="color:#D4AF37;font-weight:700;margin:0 0 8px;">Polaznici koji završe program:</p>
        <p style="margin:0 0 6px;">✅ Znaju točno gdje odlazi svaki euro</p>
        <p style="margin:0 0 6px;">✅ Imaju hitni fond od 3+ mjeseca troškova</p>
        <p style="margin:0 0 6px;">✅ Štede 10-20% prihoda automatski</p>
        <p style="margin:0;">✅ Počinju investirati — bez obzira na visinu prihoda</p>
      </div>
      <p>Kod <strong style="font-family:monospace;color:#D4AF37;">${DISCOUNT_CODE}</strong> — cijena €97 umjesto €397.</p>
      <div style="text-align:center;margin:20px 0;"><a href="${SITE_URL}/tecaj" class="btn">Upiši se → počni za 90 dana živjeti drugačije</a></div>
      <p><span class="sig">Brane</span></p>`,

    // FAZA 3 — newsletter stil
    16: () => `
      <h2>💡 FinCoach Insights: Inflacija i tvoja štednja</h2>
      <p>Bok ${n},</p>
      <p>Inflacija od 4-6% godišnje znači da novac koji stoji na tekućem računu <strong style="color:#fff;">gubi vrijednost</strong> svake godine.</p>
      <div class="box">
        <p style="color:#D4AF37;font-weight:700;margin:0 0 8px;">Što možeš napraviti?</p>
        <p style="margin:0 0 6px;">→ Kratkoročna štednja (3-6 mj): visoko kamatni štedni račun ili kratkoročne obveznice</p>
        <p style="margin:0 0 6px;">→ Dugoročna štednja (5+ god): indeksni fondovi (ETF) koji historijski vraćaju 7-10% godišnje</p>
        <p style="margin:0;">→ Minimum: novac ne smije "spavati" na 0% kamate</p>
      </div>
      <p>Ovo i mnogo više — detaljno, s konkretnim primjerima za naše tržište — pokrivamo u programu.</p>
      <div style="text-align:center;margin:20px 0;"><a href="${SITE_URL}/tecaj" class="btn">Pogledaj program →</a></div>
      <p><span class="sig">Brane</span></p>`,

    17: () => `
      <h2>💡 Kako postaviti financijske ciljeve za sljedeću godinu</h2>
      <p>Bok ${n},</p>
      <p>Konkretni financijski ciljevi moraju biti SMART: Specifični, Mjerljivi, Dostižni, Relevantni, Vremenski određeni.</p>
      <div class="box">
        <p style="color:#D4AF37;font-weight:700;margin:0 0 8px;">Primjer lošeg cilja vs. dobrog:</p>
        <p style="margin:0 0 6px;">❌ "Želim štedjeti više novca"</p>
        <p style="margin:0;">✅ "Do 31. prosinca, štedim 200€ automatski svakog 1. u mjesecu na zasebnom računu"</p>
      </div>
      <p>Napiši 3 SMART financijska cilja za sljedeću godinu. Odmah. Dok čitaš ovo. 📝</p>
      <div style="text-align:center;margin:20px 0;"><a href="${SITE_URL}/tecaj" class="btn">Program koji ti pomaže ostvariti te ciljeve →</a></div>
      <p><span class="sig">Brane</span></p>`,

    18: () => `
      <h2>Novo u FinCoach programu</h2>
      <p>Bok ${n},</p>
      <p>Upravo smo dodali nove materijale u program:</p>
      <div class="box">
        <p style="margin:0 0 6px;">📊 <strong style="color:#fff;">Excel predložak za godišnji budžet</strong> — planiranje po tjednima</p>
        <p style="margin:0 0 6px;">📋 <strong style="color:#fff;">Checklista "Financijski red u kući"</strong> — 20 koraka koje svaka obitelj treba napraviti</p>
        <p style="margin:0;">🎥 <strong style="color:#fff;">Bonus video:</strong> Investiranje za apsolutne početnike</p>
      </div>
      <p>Svi polaznici dobivaju ove materijale automatski. Ako još nisi s nama — ovo je odličan trenutak.</p>
      <div style="text-align:center;margin:20px 0;"><a href="${SITE_URL}/tecaj" class="btn">Pridruži se programu →</a></div>
      <p><span class="sig">Brane</span></p>`,

    19: () => `
      <h2>Sezona poreza: 5 stvari koje moraš znati</h2>
      <p>Bok ${n},</p>
      <div class="box">
        <p style="margin:0 0 6px;">1️⃣ <strong style="color:#fff;">Zahtjev za povrat poreza</strong> — mnogi ostavljaju 200-500€ na stolu jer ga ne traže</p>
        <p style="margin:0 0 6px;">2️⃣ <strong style="color:#fff;">Odbitne stavke</strong> — provjeri što možeš odbiti (donacije, stambeni kredit, osobni odbitak)</p>
        <p style="margin:0 0 6px;">3️⃣ <strong style="color:#fff;">Rok</strong> — u HR/SI obično do 28. veljače za prethodno porezno razdoblje</p>
        <p style="margin:0 0 6px;">4️⃣ <strong style="color:#fff;">Freelanceri</strong> — obavezno pratite predujmove i kvartalne obračune</p>
        <p style="margin:0;">5️⃣ <strong style="color:#fff;">Povrat odmah investiraj</strong> — ne troši ga, stavi u hitni fond ili investiciju</p>
      </div>
      <div style="text-align:center;margin:20px 0;"><a href="${SITE_URL}/tecaj" class="btn">Program koji te uči upravljati svim ovim →</a></div>
      <p><span class="sig">Brane</span></p>`,

    20: () => `
      <h2>Znam da još razmišljaš. Evo zašto ima smisla sada.</h2>
      <p>Bok ${n},</p>
      <p>Pratim te već nekoliko mjeseci. Čitaš, razmišljaš — ali još nisi napravio/la korak.</p>
      <p>Razumijem. Svaka investicija u sebe zahtijeva odluku.</p>
      <div class="box">
        <p style="color:#D4AF37;font-weight:700;margin:0 0 8px;">Računica koja sve mijenja:</p>
        <p style="margin:0 0 6px;">Program košta €97 (s kodom <span style="font-family:monospace;">${DISCOUNT_CODE}</span>)</p>
        <p style="margin:0 0 6px;">Prosječni polaznik uštedi <strong style="color:#fff;">200€+ mjesečno</strong> već u prvom mjesecu</p>
        <p style="margin:0;">ROI: <strong style="color:#fff;">program se "isplati" za pola prvog mjeseca</strong></p>
      </div>
      <p>30-dnevna garancija povrata. Ako ne vidiš rezultate — vratiš novac.</p>
      <div style="text-align:center;margin:20px 0;"><a href="${SITE_URL}/tecaj" class="btn">Zadnja šansa — upiši se s kodom ${DISCOUNT_CODE} →</a></div>
      <p><span class="sig">Brane</span></p>`,

    21: () => `
      <h2>💡 FinCoach Insights: Investiranje za početnike</h2>
      <p>Bok ${n},</p>
      <p>Najčešće pitanje koje dobivam: <strong style="color:#fff;">"Brane, gdje da počnem investirati?"</strong></p>
      <div class="box">
        <p style="color:#D4AF37;font-weight:700;margin:0 0 8px;">Moj odgovor (ukratko):</p>
        <p style="margin:0 0 6px;">1. Prvo eliminiraj dugove s kamatom >5%</p>
        <p style="margin:0 0 6px;">2. Izgradi hitni fond (3-6 mj. troškova)</p>
        <p style="margin:0 0 6px;">3. Tek onda investiraj — počni s globalnim ETF fondovima (npr. VWCE)</p>
        <p style="margin:0;">4. Konzistentnost > savršenstvo — i 50€/mj kroz 20 god. postaje puno</p>
      </div>
      <p>Ovo razrađujemo detaljno u Fazi 3 (dani 61-90) programa.</p>
      <div style="text-align:center;margin:20px 0;"><a href="${SITE_URL}/tecaj" class="btn">Pogledaj cijeli program →</a></div>
      <p><span class="sig">Brane</span></p>`,
  }

  const buildFn = cases[sequenceIndex]
  if (!buildFn) return null

  return {
    subject: seq.subject,
    html: emailBase(buildFn(), email),
  }
}
