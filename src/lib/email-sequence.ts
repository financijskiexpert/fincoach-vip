const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://fincoach.vip'
const CODE = 'PRILIKA'
const CODE_VIP = 'PRIJATELJ'

export const EMAIL_SEQUENCE: Array<{
  dayOffset: number
  subject: string
  type: 'educational' | 'sales' | 'story' | 'social_proof' | 'affiliate' | 'newsletter' | 'reengagement'
  skipIfPurchased: boolean
  phase: 1 | 2 | 3
}> = [
  // ── FAZA 1 — svaki dan (dani 1-21) — animacija prema kupnji ─────────────────
  { dayOffset: 1,   subject: 'Tvoj vodič je spreman — i imam nešto važno za reći',              type: 'educational',  skipIfPurchased: false, phase: 1 },
  { dayOffset: 2,   subject: 'Gdje nestaje tvoj novac svaki mjesec? (Istina je neugodna)',      type: 'educational',  skipIfPurchased: false, phase: 1 },
  { dayOffset: 3,   subject: 'Kako sam ostao bez svega — i što mi je to naučilo',               type: 'story',        skipIfPurchased: false, phase: 1 },
  { dayOffset: 4,   subject: 'Zamisli sebe za točno 90 dana...',                                type: 'educational',  skipIfPurchased: false, phase: 1 },
  { dayOffset: 5,   subject: 'Zašto pametni, vrijedni ljudi ostaju bez novca',                  type: 'educational',  skipIfPurchased: false, phase: 1 },
  { dayOffset: 6,   subject: 'Tomislav je eliminirao 8.000 € duga — za 60 dana',               type: 'social_proof', skipIfPurchased: false, phase: 1 },
  { dayOffset: 7,   subject: '3 laži o novcu koje su te naučili (i koštaju te svaki dan)',     type: 'educational',  skipIfPurchased: false, phase: 1 },
  { dayOffset: 8,   subject: 'Koliko te košta svaki dan čekanja? Izračunaj odmah.',            type: 'educational',  skipIfPurchased: false, phase: 1 },
  { dayOffset: 9,   subject: 'Ana je za 3 mjeseca uštedjela više nego za cijelu godinu',       type: 'social_proof', skipIfPurchased: false, phase: 1 },
  { dayOffset: 10,  subject: 'Tvoja prilika — posebna cijena samo za čitatelje vodiča',        type: 'sales',        skipIfPurchased: true,  phase: 1 },
  { dayOffset: 11,  subject: 'Što točno dobivaš? (Ovo nisu samo video lekcije)',               type: 'sales',        skipIfPurchased: true,  phase: 1 },
  { dayOffset: 12,  subject: 'Pitanja koja te vjerojatno muče — odgovori ovdje',               type: 'educational',  skipIfPurchased: true,  phase: 1 },
  { dayOffset: 13,  subject: 'Darko je počeo investirati u 42. godini — bez iskustva',         type: 'social_proof', skipIfPurchased: false, phase: 1 },
  { dayOffset: 14,  subject: 'Zašto baš danas? (Ne sutra, ne sljedeći tjedan)',                type: 'sales',        skipIfPurchased: true,  phase: 1 },
  { dayOffset: 15,  subject: 'Pogledaj što te čeka iznutra',                                   type: 'educational',  skipIfPurchased: true,  phase: 1 },
  { dayOffset: 16,  subject: 'Što se dogodi za 5 godina ako se ništa ne promijeni?',           type: 'educational',  skipIfPurchased: false, phase: 1 },
  { dayOffset: 17,  subject: 'Marija je platila 3 kredita odjednom — evo kako',                type: 'social_proof', skipIfPurchased: false, phase: 1 },
  { dayOffset: 18,  subject: '⏰ Zadnja šansa — cijena se vraća na 397 € u ponoć',              type: 'sales',        skipIfPurchased: true,  phase: 1 },
  { dayOffset: 19,  subject: 'Nisam te zaboravio/la — i imam razlog što pišem',                type: 'reengagement', skipIfPurchased: true,  phase: 1 },
  { dayOffset: 20,  subject: 'Neurološki razlog zašto 90 dana mijenja sve',                    type: 'educational',  skipIfPurchased: false, phase: 1 },
  { dayOffset: 21,  subject: '🔒 Samo za tebe — kod koji ne objavljujem nigdje',               type: 'sales',        skipIfPurchased: true,  phase: 1 },

  // ── FAZA 2 — svaki 2 dana (dani 23-167) ────────────────────────────────────
  { dayOffset: 23,  subject: 'Navika #1 koju dijele svi financijski slobodni ljudi',           type: 'educational',  skipIfPurchased: false, phase: 2 },
  { dayOffset: 25,  subject: 'Još uvijek razmišljaš? Evo što mi polaznici govore...',         type: 'sales',        skipIfPurchased: true,  phase: 2 },
  { dayOffset: 27,  subject: 'Budžet koji ne osjećaš — ali koji funkcionira',                 type: 'educational',  skipIfPurchased: false, phase: 2 },
  { dayOffset: 29,  subject: 'Psihologija novca: zašto radimo suprotno od onoga što znamo',   type: 'educational',  skipIfPurchased: false, phase: 2 },
  { dayOffset: 31,  subject: 'Računica koja ruši sve izlike',                                  type: 'sales',        skipIfPurchased: true,  phase: 2 },
  { dayOffset: 33,  subject: 'Hitni fond — jedina stvar između tebe i financijske krize',     type: 'educational',  skipIfPurchased: false, phase: 2 },
  { dayOffset: 35,  subject: 'Ivan je smanjio troškove za 30% — a da se nije ni odricao',    type: 'social_proof', skipIfPurchased: false, phase: 2 },
  { dayOffset: 37,  subject: 'Jesi li znao/la da PRILIKA vrijedi i dalje?',                   type: 'sales',        skipIfPurchased: true,  phase: 2 },
  { dayOffset: 39,  subject: 'Dug nije sramota — ali ostati u njemu je izbor',                type: 'educational',  skipIfPurchased: false, phase: 2 },
  { dayOffset: 41,  subject: 'Automatska štednja: postavi jednom, zaboravi, bogati se',       type: 'educational',  skipIfPurchased: false, phase: 2 },
  { dayOffset: 43,  subject: 'Što te zapravo koči? (Iskreno pitanje)',                        type: 'sales',        skipIfPurchased: true,  phase: 2 },
  { dayOffset: 45,  subject: 'Investiranje s 50 € — nije mit, nego matematika',               type: 'educational',  skipIfPurchased: false, phase: 2 },
  { dayOffset: 47,  subject: 'Sandra je otplatila stan 8 godina ranije — evo kako',           type: 'social_proof', skipIfPurchased: false, phase: 2 },
  { dayOffset: 49,  subject: 'Pridruži se zajednici koja se zajedno bogati',                  type: 'sales',        skipIfPurchased: true,  phase: 2 },
  { dayOffset: 51,  subject: 'Mindset bogataša — i nije o novcu',                             type: 'educational',  skipIfPurchased: false, phase: 2 },
  { dayOffset: 53,  subject: '5 financijskih aplikacija koje koristim svaki dan',             type: 'educational',  skipIfPurchased: false, phase: 2 },
  { dayOffset: 55,  subject: '30-dnevna garancija — nema rizika, samo rezultati',             type: 'sales',        skipIfPurchased: true,  phase: 2 },
  { dayOffset: 57,  subject: 'Pregovaraj plaću — dodaj 200 € bez mijenjanja posla',          type: 'educational',  skipIfPurchased: false, phase: 2 },
  { dayOffset: 59,  subject: 'Josip je s dugom od 15.000 € stigao do prve investicije',      type: 'social_proof', skipIfPurchased: false, phase: 2 },
  { dayOffset: 61,  subject: 'Dva mjeseca. Pogledaj gdje su naši polaznici.',                 type: 'sales',        skipIfPurchased: true,  phase: 2 },
  { dayOffset: 63,  subject: 'Pasivni prihodi nisu mit — evo odakle početi',                 type: 'educational',  skipIfPurchased: false, phase: 2 },
  { dayOffset: 65,  subject: 'Inflacija te krade tiho — evo kako se obraniti',               type: 'educational',  skipIfPurchased: false, phase: 2 },
  { dayOffset: 67,  subject: 'Ovo tjedan — posebna cijena još vrijedi',                      type: 'sales',        skipIfPurchased: true,  phase: 2 },
  { dayOffset: 69,  subject: 'ETF fondovi za početnike — sve što trebaš znati',              type: 'educational',  skipIfPurchased: false, phase: 2 },
  { dayOffset: 71,  subject: 'Petra je s 400 € počela — danas ima portfelj od 12.000 €',    type: 'social_proof', skipIfPurchased: false, phase: 2 },
  { dayOffset: 73,  subject: 'Čekaš savršen trenutak? Imam vijesti za tebe.',                type: 'sales',        skipIfPurchased: true,  phase: 2 },
  { dayOffset: 75,  subject: 'Financijska sloboda — kako zaista izgleda taj život',          type: 'educational',  skipIfPurchased: false, phase: 2 },
  { dayOffset: 77,  subject: 'Kreditna kartica — prijatelj ili najveći neprijatelj?',        type: 'educational',  skipIfPurchased: false, phase: 2 },
  { dayOffset: 79,  subject: 'ROI koji ne možeš ignorirati (matematika ne laže)',            type: 'sales',        skipIfPurchased: true,  phase: 2 },
  { dayOffset: 81,  subject: 'Kako pregovarati s bankom — i dobiti bolji uvjet',             type: 'educational',  skipIfPurchased: false, phase: 2 },
  { dayOffset: 83,  subject: 'Luka je izgradio hitni fond za 4 mjeseca — evo kako',          type: 'social_proof', skipIfPurchased: false, phase: 2 },
  { dayOffset: 85,  subject: '85 dana. Jedan korak te dijeli od promjene.',                  type: 'sales',        skipIfPurchased: true,  phase: 2 },
  { dayOffset: 87,  subject: 'Investiranje u nekretnine — mit ili stvarnost u 2026.',        type: 'educational',  skipIfPurchased: false, phase: 2 },
  { dayOffset: 89,  subject: 'Crypto — istina bez hype-a i bez laži',                       type: 'educational',  skipIfPurchased: false, phase: 2 },
  { dayOffset: 91,  subject: 'Tri mjeseca. Evo gdje su polaznici koji su počeli s tobom.',   type: 'sales',        skipIfPurchased: true,  phase: 2 },
  { dayOffset: 93,  subject: 'Financijski ciljevi — kako ih postaviti da ih stvarno postigneš', type: 'educational', skipIfPurchased: false, phase: 2 },
  { dayOffset: 95,  subject: 'Maja je s 250 € počela — danas ima 12.000 € u fondovima',     type: 'social_proof', skipIfPurchased: false, phase: 2 },
  { dayOffset: 97,  subject: 'Kad ćeš početi? Jedno pitanje koje mijenja sve.',              type: 'sales',        skipIfPurchased: true,  phase: 2 },
  { dayOffset: 99,  subject: '💡 Insights: Globalna ekonomija i tvoj džep',                 type: 'newsletter',   skipIfPurchased: false, phase: 2 },
  { dayOffset: 101, subject: '5 knjiga koje su promijenile moj odnos prema novcu',           type: 'educational',  skipIfPurchased: false, phase: 2 },
  { dayOffset: 103, subject: '100 dana je prošlo. Samo ti nedostaješ.',                     type: 'sales',        skipIfPurchased: true,  phase: 2 },
  { dayOffset: 105, subject: 'Porezna optimizacija — legalno zadrži više svog novca',        type: 'educational',  skipIfPurchased: false, phase: 2 },
  { dayOffset: 107, subject: 'Nikola je za 6 mjeseci eliminirao sve dugove',                 type: 'social_proof', skipIfPurchased: false, phase: 2 },
  { dayOffset: 109, subject: 'PRILIKA — ponuda koja ne ističe',                              type: 'sales',        skipIfPurchased: true,  phase: 2 },
  { dayOffset: 111, subject: 'Zlatna pravila ulaganja koja vrijede u svakoj krizi',          type: 'educational',  skipIfPurchased: false, phase: 2 },
  { dayOffset: 113, subject: 'Životno osiguranje — što stvarno trebaš (i što ne)',           type: 'educational',  skipIfPurchased: false, phase: 2 },
  { dayOffset: 115, subject: 'Poruka od polaznika koja me je ganula',                        type: 'sales',        skipIfPurchased: true,  phase: 2 },
  { dayOffset: 117, subject: 'Mirovina — misli 30 godina unaprijed (i počni danas)',         type: 'educational',  skipIfPurchased: false, phase: 2 },
  { dayOffset: 119, subject: 'Tea je u 35. počela planirati mirovinu — evo zašto se isplati', type: 'social_proof', skipIfPurchased: false, phase: 2 },
  { dayOffset: 121, subject: 'Danas je pravi dan. Sutra postaje jučer.',                     type: 'sales',        skipIfPurchased: true,  phase: 2 },
  { dayOffset: 123, subject: 'Side hustle — kako zaraditi extra 300-500 € bez napuštanja posla', type: 'educational', skipIfPurchased: false, phase: 2 },
  { dayOffset: 125, subject: 'Novac u vezi i braku — kako da ne bude izvor sukoba',          type: 'educational',  skipIfPurchased: false, phase: 2 },
  { dayOffset: 127, subject: '4 razloga zašto se isplati upisati upravo sad',                type: 'sales',        skipIfPurchased: true,  phase: 2 },
  { dayOffset: 129, subject: 'Složeni kamatni efekt — najmoćnija sila u osobnim financijama', type: 'educational', skipIfPurchased: false, phase: 2 },
  { dayOffset: 131, subject: 'Goran je s minusa prešao na prvu investiciju za 5 mj.',        type: 'social_proof', skipIfPurchased: false, phase: 2 },
  { dayOffset: 133, subject: 'Sutra postaje jučer — posljednji poziv',                       type: 'sales',        skipIfPurchased: true,  phase: 2 },
  { dayOffset: 135, subject: '10 navika financijski slobodnih ljudi (provjeri se)',           type: 'educational',  skipIfPurchased: false, phase: 2 },
  { dayOffset: 137, subject: 'Robert je kupio stan u 29. godini — bez nasljedstva',          type: 'social_proof', skipIfPurchased: false, phase: 2 },
  { dayOffset: 139, subject: 'Moja osobna garancija — ovo nisam nikad rekao javno',          type: 'sales',        skipIfPurchased: true,  phase: 2 },
  { dayOffset: 141, subject: 'Diverzifikacija portfelja — kako ne staviti sva jaja u jednu košaru', type: 'educational', skipIfPurchased: false, phase: 2 },
  { dayOffset: 143, subject: 'Maja i Ivan — par koji je zajedno izgradio slobodu',            type: 'social_proof', skipIfPurchased: false, phase: 2 },
  { dayOffset: 145, subject: '145 dana razmišljaš o ovome. Jedno pitanje.',                  type: 'sales',        skipIfPurchased: true,  phase: 2 },
  { dayOffset: 147, subject: 'Recesija dolazi? Kako se zaštititi (i zaraditi)',              type: 'educational',  skipIfPurchased: false, phase: 2 },
  { dayOffset: 149, subject: '💡 Insights: Financijski trendovi 2027.',                      type: 'newsletter',   skipIfPurchased: false, phase: 2 },
  { dayOffset: 151, subject: 'Zadnja garantirana šansa — ovo je ozbiljno',                   type: 'sales',        skipIfPurchased: true,  phase: 2 },
  { dayOffset: 153, subject: 'Godišnji financijski pregled — napravi ga odmah',              type: 'educational',  skipIfPurchased: false, phase: 2 },
  { dayOffset: 155, subject: 'Planiranje nasljedstva — nije samo za bogate',                 type: 'educational',  skipIfPurchased: false, phase: 2 },
  { dayOffset: 157, subject: 'Ako ne sad — kad? (Iskreno pitanje)',                          type: 'sales',        skipIfPurchased: true,  phase: 2 },
  { dayOffset: 159, subject: 'Zdravlje = bogatstvo — veza koju financijska industrija ignorira', type: 'educational', skipIfPurchased: false, phase: 2 },
  { dayOffset: 161, subject: '💡 Insights: Do kraja godine — gdje stojiš financijski?',     type: 'newsletter',   skipIfPurchased: false, phase: 2 },
  { dayOffset: 163, subject: 'Moja zadnja poruka o ovoj temi — pročitaj do kraja',          type: 'sales',        skipIfPurchased: true,  phase: 2 },
  { dayOffset: 165, subject: 'Valutni rizik — kako zaštititi ušteđevinu',                   type: 'educational',  skipIfPurchased: false, phase: 2 },
  { dayOffset: 167, subject: '💡 Insights: Počinjemo novu godinu — financijski plan',        type: 'newsletter',   skipIfPurchased: false, phase: 2 },
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
  .soft-cta { margin-top: 24px; padding-top: 16px; border-top: 1px solid rgba(255,255,255,0.08); color: #718096; font-size: 13px; }
</style>
</head>
<body>
<div class="wrap">
  <div class="header"><div class="logo">FinCoach VIP</div></div>
  <div class="body">${content}</div>
  <div class="footer">
    <div style="margin-bottom:12px;">
      Već si polaznik programa? <a href="${SITE_URL}/prijava" style="color:#D4AF37;font-weight:600;">Prijavi se u tečaj →</a>
    </div>
    © 2026 FinCoach VIP<br>
    <a href="${SITE_URL}/odjava?email=${encodeURIComponent(unsubEmail)}" style="color:#4a5568;">Odjavi se od emailova</a>
  </div>
</div>
</body>
</html>`
}

// ─── Sadržaj emaila po indexu ─────────────────────────────────────────────────

// ─── Affiliate prodajni emaili (bez PRIJATELJU/PRIJATELJU koda) ──────────────

function buildAffiliateSalesEmail(
  sequenceIndex: number,
  name: string,
  email: string,
  affiliateCode: string
): { subject: string; html: string } | null {
  const seq = EMAIL_SEQUENCE[sequenceIndex]
  if (!seq) return null
  const n = name.split(' ')[0] || 'prijatelju'
  const sig = `<p><span class="sig">Brane</span><br><span style="color:#718096;font-size:13px;">FinCoach VIP</span></p>`

  const affiliateOffer = `
    <div class="box" style="border-color:#D4AF37;text-align:center;">
      <p style="color:#D4AF37;font-weight:800;font-size:15px;margin:0 0 8px;">Tvoja ekskluzivna cijena:</p>
      <p style="font-size:44px;font-weight:900;color:#D4AF37;margin:4px 0;">357 €</p>
      <p style="color:#718096;font-size:12px;margin:0 0 4px;">Umjesto redovnih <s style="color:#718096;">397 €</s> · <strong style="color:#fff;">10% ekskluzivni popust</strong></p>
      <p style="color:#718096;font-size:12px;margin:0 0 16px;">Doživotni pristup · 90 lekcija · Aktivno zajednica</p>
    </div>
    <div style="text-align:center;margin:20px 0;">
      <a href="${SITE_URL}/volim-svoj-novac?ref=${affiliateCode}" class="btn">Upiši se s popustom →</a>
    </div>
    <p style="color:#718096;font-size:12px;text-align:center;">30-dnevna garancija povrata novca. Nema rizika.</p>`

  // 5 rotacijskih tijela za prodajne emaile — rotiraju po sequenceIndex
  const variant = Math.floor(sequenceIndex / 5) % 5

  const bodies: Array<() => string> = [
    () => `
      <h2>Dragi/a ${n}, tvoj ekskluzivni popust je aktivan</h2>
      <p>Nekad sam pitao polaznike: "Zašto ste čekali toliko dugo?"</p>
      <p>Odgovor je uvijek isti: <strong style="color:#fff;">"Mislio/la sam da nije pravi trenutak."</strong></p>
      <div class="box">
        <p style="color:#D4AF37;font-weight:700;margin:0 0 8px;">Istina o "pravom trenutku":</p>
        <p style="margin:0;">Savršen trenutak nikad ne dolazi sam od sebe. Pravi trenutak je onaj koji <strong style="color:#fff;">ti odabereš</strong>.</p>
      </div>
      <p>Tvoj ekskluzivni popust od 10% je aktivan. Upiši se danas i za 90 dana bit ćeš na sasvim drugom mjestu.</p>
      ${affiliateOffer}
      ${sig}`,

    () => `
      <h2>Dragi/a ${n}, koliko te košta svaki dan odgađanja?</h2>
      <p>Napravimo brzu matematiku zajedno.</p>
      <div class="box">
        <p style="margin:0 0 8px;">📊 Prosječan polaznik programa uštedi <strong style="color:#fff;">200 € miesečno</strong> u prvih 90 dana</p>
        <p style="margin:0 0 8px;">⏳ Svaki dan bez sustava = izgubljena ušteđevina</p>
        <p style="margin:0;">🎯 Tvoj ekskluzivni popust pokriva se sam za manje od 2 mieseca</p>
      </div>
      <p>Ovo nije trošak — ovo je <strong style="color:#fff;">investicija koja se vraća.</strong></p>
      <p>Tvoj 10% popust je aktivan i čeka te:</p>
      ${affiliateOffer}
      ${sig}`,

    () => `
      <h2>Dragi/a ${n}, evo što kažu oni koji su počeli</h2>
      <div class="box" style="font-style:italic;">
        <p style="color:#fff;margin:0 0 12px;">"Za 3 mieseca sam eliminirala 5.000 € duga i prvi put u životu imam hitni fond. Nisam vjerovala da je moguće."</p>
        <p style="color:#D4AF37;font-size:13px;margin:0;">— Ana, 34 god., Zagreb</p>
      </div>
      <div class="box" style="font-style:italic;">
        <p style="color:#fff;margin:0 0 12px;">"Počeo sam s 50 € miesečno. Danas imam diversificirani portfelj. Nitko me nikad nije naučio kako."</p>
        <p style="color:#D4AF37;font-size:13px;margin:0;">— Marko, 41 god., Split</p>
      </div>
      <p>Tvoja priča još nije napisana. Ali možeš početi pisati je danas, s ekskluzivnim popustom koji te čeka:</p>
      ${affiliateOffer}
      ${sig}`,

    () => `
      <h2>Dragi/a ${n}, jedna odluka koja mijenja sve</h2>
      <p>U 30 godina rada u financijama naučio sam jednu stvar:</p>
      <p>Razlika između onih koji postignu financijsku slobodu i onih koji ne, nije u inteligenciji, ni u prihodima, ni u sreći.</p>
      <div class="box">
        <p style="color:#D4AF37;font-weight:700;margin:0 0 8px;">Razlika je u jednoj odluci:</p>
        <p style="font-size:18px;color:#fff;margin:0;"><strong>Odlučiti početi. Danas.</strong></p>
      </div>
      <p>Imaš ekskluzivni pristup programu uz 10% popust. Iskoristi ga:</p>
      ${affiliateOffer}
      ${sig}`,

    () => `
      <h2>Dragi/a ${n}, osobna poruka za tebe</h2>
      <p>Svaki put kad netko upiše program, osjećam istu radost.</p>
      <p>Ne zbog naplate — nego jer znam što slijedi: <strong style="color:#fff;">90 dana u kojima se stvari zaista počnu mijenjati.</strong></p>
      <p>Tvoj popust je osiguran. Sve što trebaš napraviti je jedan klik:</p>
      ${affiliateOffer}
      <div class="box">
        <p style="margin:0 0 8px;color:#D4AF37;font-weight:700;">Što dobivaš:</p>
        <p style="margin:0 0 6px;">✓ 90 lekcija o osobnim financijama</p>
        <p style="margin:0 0 6px;">✓ Praktični alati i predlošci</p>
        <p style="margin:0 0 6px;">✓ Pristup zajednici polaznika</p>
        <p style="margin:0;">✓ 30-dnevna garancija povrata novca</p>
      </div>
      ${sig}`,
  ]

  const content = bodies[variant]()
  return {
    subject: seq.subject,
    html: emailBase(content, email),
  }
}

export function buildEmailContent(
  sequenceIndex: number,
  name: string,
  email: string,
  affiliateCode?: string | null
): { subject: string; html: string } | null {
  const seq = EMAIL_SEQUENCE[sequenceIndex]
  if (!seq) return null

  // Affiliate lead + prodajni email → pošalji affiliate verziju bez PRIJATELJU koda
  if (affiliateCode && seq.type === 'sales') {
    return buildAffiliateSalesEmail(sequenceIndex, name, email, affiliateCode)
  }

  const n = name.split(' ')[0] || 'prijatelju'

  const sig = `<p><span class="sig">Brane</span><br><span style="color:#718096;font-size:13px;">FinCoach VIP</span></p>`

  const offerBox = (code: string = CODE) => `
    <div class="box" style="border-color:#D4AF37;text-align:center;">
      <p style="color:#D4AF37;font-weight:800;font-size:15px;margin:0 0 8px;">Tvoja cijena uz kod:</p>
      <p style="font-family:monospace;font-size:28px;font-weight:900;color:#fff;background:#1a2f47;padding:8px 24px;border-radius:8px;display:inline-block;letter-spacing:3px;margin:0 0 12px;">${code}</p>
      <p style="font-size:44px;font-weight:900;color:#D4AF37;margin:4px 0;">197 €</p>
      <p style="color:#718096;font-size:12px;margin:0 0 16px;">Umjesto redovnih 397 € · Doživotni pristup · 90 lekcija</p>
    </div>
    <div style="text-align:center;margin:20px 0;"><a href="${SITE_URL}/volim-svoj-novac" class="btn">Upiši se sada →</a></div>
    <p style="color:#718096;font-size:12px;text-align:center;">30-dnevna garancija povrata novca. Nema rizika.</p>`

  const softCta = affiliateCode
    ? `<p class="soft-cta">Tvoj ekskluzivni 10% popust je aktivan! → <a href="${SITE_URL}/volim-svoj-novac?ref=${affiliateCode}" style="color:#D4AF37;">fincoach.vip/volim-svoj-novac</a></p>`
    : `<p class="soft-cta">Još nisi dio programa? Upiši se s kodom <strong style="color:#D4AF37;font-family:monospace;">PRILIKA</strong> i počni transformaciju danas → <a href="${SITE_URL}/volim-svoj-novac" style="color:#D4AF37;">fincoach.vip/volim-svoj-novac</a></p>`

  const cases: Record<number, () => string> = {

    // ── FAZA 1 ────────────────────────────────────────────────────────────────

    // Dan 1 — Welcome, bez ponude
    0: () => `
      <h2>Dragi/a ${n}, tvoj vodič je na putu!</h2>
      <p>Upravo si napravio/la nešto što 90% ljudi nikad ne napravi — podigao/la si ruku i rekao/la: <strong style="color:#fff;">hoću više od ovoga.</strong></p>
      <p>Vodič "Savjeti i tehnike za financijsku stabilnost" stiže na tvoj email uskoro. Ali dok čekaš, imam nešto važno za reći.</p>
      <div class="box">
        <p style="color:#D4AF37;font-weight:700;margin:0 0 8px;">Što te čeka u sljedećih 21 dan:</p>
        <p style="margin:0 0 6px;">→ Svaki dan ću ti dijeliti jedan konkretan uvid o novcu</p>
        <p style="margin:0 0 6px;">→ Čujet ćeš priče pravih ljudi koji su promijenili svoju financijsku realnost</p>
        <p style="margin:0;">→ Pokazat ću ti sustav koji radi — bez odricanja, bez mučenja</p>
      </div>
      <p>Jedna molba: ne brišući ove emailove. Svaki nosi nešto što ti može vrijediti više od sata tvog vremena.</p>
      <p>Vidimo se sutra. 🙏</p>
      ${sig}`,

    // Dan 2 — Pain, gdje nestaje novac, bez ponude
    1: () => `
      <h2>Gdje nestaje tvoj novac svaki mjesec?</h2>
      <p>Dragi/a ${n},</p>
      <p>Imam za tebe vježbu koja traje 15 minuta — ali može promijeniti sve.</p>
      <p>Uzmi zadnja 3 bankovna izvoda i zbrojvi iznose u ove 3 kategorije:</p>
      <div class="box">
        <p style="margin:0 0 8px;">☕ <strong style="color:#fff;">Kava, dostava, izlasci</strong> — koliko tjedno?</p>
        <p style="margin:0 0 8px;">📱 <strong style="color:#fff;">Pretplate koje zaboravljaš</strong> — streaming, aplikacije, gym koji ne posjećuješ</p>
        <p style="margin:0;">🛒 <strong style="color:#fff;">Impulzivne kupnje</strong> — stvari koje si kupio/la, a nisi planirao/la</p>
      </div>
      <p>Većina ljudi otkrije da im <strong style="color:#fff;">200-500 € miesečno "curi"</strong> kroz ove tri kategorije. A da toga uopće nisu svjesni.</p>
      <p>Ovo nije o odricanju. Ovo je o <strong style="color:#fff;">svjesnosti</strong>. Kad vidiš brojke, mozak automatski počne donositi bolje odluke.</p>
      <p>Napiši mi na reply — koliko si pronašao/la? Svaki odgovor pročitam osobno.</p>
      ${sig}`,

    // Dan 3 — Priča, soft PRILIKA
    2: () => `
      <h2>Kako sam ostao bez svega — i što mi je to naučilo</h2>
      <p>Dragi/a ${n},</p>
      <p>Ovo je priča koju rijetko pričam. Ali tebi je važna.</p>
      <p>Radio sam u financijama godinama. Zarađivao pristojno. I bio sam uvjeren da znam sve o novcu.</p>
      <p>Griješio sam.</p>
      <p>Novac je uvijek nekamo nestajao. Imao sam dugove. Imao sam stres koji se nije gasio ni vikendom. I imao sam ponos koji me je sprečavao da zatražim pomoć.</p>
      <div class="box">
        <p style="font-style:italic;color:#fff;margin:0 0 12px;">"Problem nije u tome koliko zarađuješ. Problem je što te nikad nitko nije naučio što raditi s novcem."</p>
        <p style="color:#D4AF37;font-size:13px;margin:0;">— moj mentor, koji mi je promijenio život</p>
      </div>
      <p>Počeo sam od nule. Naučio sam sustav. I danas živim financijsku slobodu o kojoj sam nekad samo sanjao.</p>
      <p>Taj isti sustav — komprimiran u 90 dana — čeka i tebe.</p>
      <p>Ako si spreman/na napraviti korak, počni ovdje s kodom <strong style="color:#D4AF37;font-family:monospace;">PRILIKA</strong>:</p>
      <div style="text-align:center;margin:20px 0;"><a href="${SITE_URL}/volim-svoj-novac" class="btn">Pogledaj program →</a></div>
      ${sig}`,

    // Dan 4 — Future pacing + PRILIKA
    3: () => `
      <h2>Zamisli sebe za točno 90 dana...</h2>
      <p>Dragi/a ${n},</p>
      <p>Zatvori oči na trenutak i zamisli:</p>
      <div class="box">
        <p style="margin:0 0 8px;">✅ Znaš <strong style="color:#fff;">točno gdje odlazi svaki euro</strong> — bez stresa, bez iznenađenja</p>
        <p style="margin:0 0 8px;">✅ Svaki mjesec <strong style="color:#fff;">automatski štedeš</strong> — bez da o tome razmišljaš</p>
        <p style="margin:0 0 8px;">✅ Dug koji te tišti <strong style="color:#fff;">polako nestaje</strong> prema jasnom planu</p>
        <p style="margin:0 0 8px;">✅ Napravio/la si <strong style="color:#fff;">prve investicije</strong> — čak i ako si počeo/la s 50 €</p>
        <p style="margin:0;">✅ Spavaš mirno jer imaš <strong style="color:#fff;">hitni fond</strong> koji te štiti od neočekivanog</p>
      </div>
      <p>Ovo nije fantazija. Ovo su rezultati koje polaznici programa vide u 90 dana.</p>
      <p>90 dana proteći će bez obzira što napraviš. Pitanje je samo — kakav ćeš biti za 90 dana?</p>
      ${offerBox()}
      ${sig}`,

    // Dan 5 — Volja vs sustav + PRILIKA
    4: () => `
      <h2>Zašto pametni, vrijedni ljudi ostaju bez novca</h2>
      <p>Dragi/a ${n},</p>
      <p>Ovo je pitanje koje me godinama mučilo: zašto toliko pametnih, marljivih ljudi ne uspijeva financijski?</p>
      <p>Odgovor nije nedostatak inteligencije. Nije lijenost. I sigurno nije slaba volja.</p>
      <div class="box">
        <p style="color:#D4AF37;font-weight:700;margin:0 0 10px;">Odgovor je: oslanjaju se na volju umjesto sustava.</p>
        <p style="margin:0 0 8px;">Volja je ograničen resurs. Svaki dan donosiš stotine odluka — i do večeri je volja iscrpljena.</p>
        <p style="margin:0;">Sustav radi automatski. Bez volje. Bez napora. Bez odlučivanja.</p>
      </div>
      <p>Bogati ne štede ostatak od potrošnje. <strong style="color:#fff;">Troše ostatak od štednje.</strong> Taj jedan uvid — primijenjen — mijenja sve.</p>
      <p>U programu ti pokazujem kako postaviti sustav koji radi za tebe dok spavaš. Počni s kodom <strong style="color:#D4AF37;font-family:monospace;">PRILIKA</strong>:</p>
      <div style="text-align:center;margin:20px 0;"><a href="${SITE_URL}/volim-svoj-novac" class="btn">Postavi sustav danas →</a></div>
      ${sig}`,

    // Dan 6 — Tomislav social proof + PRILIKA
    5: () => `
      <h2>Tomislav je eliminirao 8.000 € duga — za 60 dana</h2>
      <p>Dragi/a ${n},</p>
      <p>Tomislav je freelancer iz Osijeka. Zarađivao je dobro — ali nepravilno. Jedan mjesec odlično, drugi katastrofa.</p>
      <p>Imao je 8.000 € duga na karticama i kreditima. I mislio je da nema izlaza sve dok prihodi ne postanu redovni.</p>
      <div class="box">
        <p style="font-style:italic;color:#fff;margin:0 0 12px;">"Brane mi je pokazao kako planirati financije s nepravilnim prihodom. Napravio sam 'bafer račun' i počeo primjenjivati metodu lavine dugova. Za 60 dana eliminirao sam 8.000 € duga. Danas investiram — prvi put u životu."</p>
        <p style="color:#D4AF37;font-size:13px;margin:0;">— Tomislav R., freelancer, Osijek ⭐⭐⭐⭐⭐</p>
      </div>
      <p>Tomislav nije imao posebnih preduvjeta. Imao je <strong style="color:#fff;">sustav i odlučnost</strong>.</p>
      <p>Njegova situacija bila je teža od tvoje? Možda. Ali njegov rezultat može biti i tvoj.</p>
      ${offerBox()}
      ${sig}`,

    // Dan 7 — 3 laži + PRILIKA
    6: () => `
      <h2>3 laži o novcu koje su te naučili</h2>
      <p>Dragi/a ${n},</p>
      <div class="box">
        <p style="color:#ef4444;font-weight:700;margin:0 0 6px;">❌ Laž #1: "Moraš više zarađivati da bi štedjeo/la"</p>
        <p style="color:#cbd5e0;margin:0 0 16px;font-size:14px;">Istina: Ljudi koji zarade duplo više — troše duplo više. Problem nije prihod, nego sustav.</p>
        <p style="color:#ef4444;font-weight:700;margin:0 0 6px;">❌ Laž #2: "Štednja znači odricanje"</p>
        <p style="color:#cbd5e0;margin:0 0 16px;font-size:14px;">Istina: Pametan budžet znači svjesnu potrošnju — i više para za stvari koje ti zaista znače.</p>
        <p style="color:#ef4444;font-weight:700;margin:0 0 6px;">❌ Laž #3: "Investiranje je za bogate"</p>
        <p style="color:#cbd5e0;margin:0;font-size:14px;">Istina: S 50 € miesečno i 20 godina vremena — možeš izgraditi portfelj od 40.000 €+.</p>
      </div>
      <p>Koliko te ove tri laži koštaju godišnje? Desetke tisuća eura, vjerovatno.</p>
      <p>U programu rastavljamo svaku od njih — i gradimo sustav na istini.</p>
      ${offerBox()}
      ${sig}`,

    // Dan 8 — ROI / cost of inaction
    7: () => `
      <h2>Koliko te košta svaki dan čekanja?</h2>
      <p>Dragi/a ${n},</p>
      <p>Znam da razmišljaš. I poštivam to. Ali hajdemo biti konkretni.</p>
      <div class="box">
        <p style="color:#D4AF37;font-weight:700;margin:0 0 12px;">Jednostavna matematika:</p>
        <p style="margin:0 0 8px;">Prosječni polaznik programa uštedi <strong style="color:#fff;">200 € više miesečno</strong> već u prvom miesecu.</p>
        <p style="margin:0 0 8px;">Program košta <strong style="color:#fff;">197 €</strong> s kodom PRILIKA.</p>
        <p style="margin:0 0 8px;">ROI: <strong style="color:#fff;">program se "isplati" za manje od prvog mieseca.</strong></p>
        <p style="margin:0;color:#718096;font-size:13px;">Svaki dan čekanja = ~6-7 € izgubljene prilike.</p>
      </div>
      <p>30-dnevna garancija povrata. Ako ne vidiš razliku — vratiš novac bez pitanja.</p>
      <p>Jedini pravi rizik je ostati točno tamo gdje si.</p>
      ${offerBox()}
      ${sig}`,

    // Dan 9 — Ana social proof + PRILIKA
    8: () => `
      <h2>Ana je za 3 mieseca uštedjela više nego za cijelu godinu</h2>
      <p>Dragi/a ${n},</p>
      <p>Ana je marketing menadžerica iz Rijeke. Zarađivala je dobro — ali nikad nije uspijevala štedjeti konzistentno.</p>
      <p>"Uvijek bi se nešto pojavilo" — brak, auto, godišnji odmor. Novca nikad dovoljno.</p>
      <div class="box">
        <p style="font-style:italic;color:#fff;margin:0 0 12px;">"Mislila sam da je problem u tome što ne zarađujem dovoljno. Brane mi je pokazao da je problem u sustavu — ili, bolje rečeno, u nedostatku sustava. Za 3 mieseca uštedjela sam više nego za cijelu prethodnu godinu. I to bez da sam se odrekla ičega što mi je zaista važno."</p>
        <p style="color:#D4AF37;font-size:13px;margin:0;">— Ana M., marketing menadžerica, Rijeka ⭐⭐⭐⭐⭐</p>
      </div>
      <p>Ana nije imala posebnog financijskog znanja. Imala je <strong style="color:#fff;">sustav i 20 minuta dnevno</strong>.</p>
      ${offerBox()}
      ${sig}`,

    // Dan 10 — Prodajni #1 (skipIfPurchased: true)
    9: () => `
      <h2>Tvoja posebna cijena — samo za čitatelje vodiča</h2>
      <p>Dragi/a ${n},</p>
      <p>Zadnjih 9 dana dijelio/la sam s tobom uvide koji većini ljudi trebaju godine da sami otkriju.</p>
      <p>Danas ti nudim pristup sustavu koji je sve to promijenio — za mene i za stotine polaznika.</p>
      <div class="box">
        <p style="color:#D4AF37;font-weight:700;margin:0 0 12px;">Što dobivaš:</p>
        <p style="margin:0 0 6px;">🎥 <strong style="color:#fff;">90 video lekcija</strong> — 3 faze, 90 dana transformacije</p>
        <p style="margin:0 0 6px;">📊 <strong style="color:#fff;">Radni listovi i predlošci</strong> — Excel budžet, plan dugova, investicijski tracker</p>
        <p style="margin:0 0 6px;">🏆 <strong style="color:#fff;">Certifikat</strong> — potvrda završetka programa</p>
        <p style="margin:0 0 6px;">♾️ <strong style="color:#fff;">Doživotni pristup</strong> — uključujući sve buduće nadogradnje</p>
        <p style="margin:0;">🛡️ <strong style="color:#fff;">30-dnevna garancija</strong> — nema rizika</p>
      </div>
      ${offerBox()}
      ${sig}`,

    // Dan 11 — Value stack (skipIfPurchased: true)
    10: () => `
      <h2>Što točno dobivaš? (Ovo nisu samo video lekcije)</h2>
      <p>Dragi/a ${n},</p>
      <p>Dopusti da budem konkretan/na.</p>
      <div class="box">
        <p style="color:#D4AF37;font-weight:700;margin:0 0 10px;">📅 FAZA 1 (Dani 1-30): Temelji</p>
        <p style="margin:0 0 4px;font-size:14px;">→ Financijski audit — gdje si sada</p>
        <p style="margin:0 0 4px;font-size:14px;">→ Budžet koji funkcionira za tvoj stil života</p>
        <p style="margin:0 0 16px;font-size:14px;">→ Hitni fond — od nule do 3 mieseca troškova</p>
        <p style="color:#D4AF37;font-weight:700;margin:0 0 10px;">🏗️ FAZA 2 (Dani 31-60): Izgradnja</p>
        <p style="margin:0 0 4px;font-size:14px;">→ Metode eliminacije duga (lavina i snježna gruda)</p>
        <p style="margin:0 0 4px;font-size:14px;">→ Automatska štednja — postavi i zaboravi</p>
        <p style="margin:0 0 16px;font-size:14px;">→ Pregovaranje s bankama i kreditorima</p>
        <p style="color:#D4AF37;font-weight:700;margin:0 0 10px;">📈 FAZA 3 (Dani 61-90): Rast</p>
        <p style="margin:0 0 4px;font-size:14px;">→ Uvod u investiranje — ETF, obveznice, dionice</p>
        <p style="margin:0 0 4px;font-size:14px;">→ Pasivni prihodi — gdje i kako početi</p>
        <p style="margin:0;font-size:14px;">→ Financijski plan za sljedeće 5 godina</p>
      </div>
      ${offerBox()}
      ${sig}`,

    // Dan 12 — FAQ (skipIfPurchased: true)
    11: () => `
      <h2>Pitanja koja te vjerojatno muče</h2>
      <p>Dragi/a ${n},</p>
      <div class="box">
        <p style="color:#D4AF37;font-weight:700;margin:0 0 4px;">❓ "Nemam puno vremena"</p>
        <p style="margin:0 0 16px;font-size:14px;">Program je dizajniran za zaposlene ljude. 20-30 minuta dnevno — to je sve što trebaš.</p>
        <p style="color:#D4AF37;font-weight:700;margin:0 0 4px;">❓ "Nisam financijski stručnjak"</p>
        <p style="margin:0 0 16px;font-size:14px;">Savršeno. Program počinje od nule i gradi znanje korak po korak. Nema preduvjeta.</p>
        <p style="color:#D4AF37;font-weight:700;margin:0 0 4px;">❓ "Što ako ne funkcionira za mene?"</p>
        <p style="margin:0 0 16px;font-size:14px;">30-dnevna garancija povrata. Ako u prvih 30 dana ne vidiš vrijednost — vraćam ti novac bez pitanja.</p>
        <p style="color:#D4AF37;font-weight:700;margin:0 0 4px;">❓ "Kad vidim prve rezultate?"</p>
        <p style="margin:0;font-size:14px;">Većina polaznika vidi promjenu već u prvom tjednu — samim financijskim auditom.</p>
      </div>
      ${offerBox()}
      ${sig}`,

    // Dan 13 — Darko social proof (skipIfPurchased: false)
    12: () => `
      <h2>Darko je počeo investirati u 42. godini — bez iskustva</h2>
      <p>Dragi/a ${n},</p>
      <p>Jedno od najčešćih uvjerenja koja čujem: <strong style="color:#fff;">"Za mene je kasno."</strong></p>
      <p>Darko je bio uvjeren u isto. Inženjer iz Ljubljane, 42 godine, nikad nije investirao. Mislio je da je prozor zatvoren.</p>
      <div class="box">
        <p style="font-style:italic;color:#fff;margin:0 0 12px;">"Mislio sam da je kasno početi. Brane mi je pokazao konkretnu matematiku — svaka godina čekanja me košta puno više nego trošak programa. Počeo sam s 100 € miesečno u ETF fondove. Danas, 8 mieseci kasnije, imam portfelj i spavam mirno."</p>
        <p style="color:#D4AF37;font-size:13px;margin:0;">— Darko V., inženjer, Ljubljana ⭐⭐⭐⭐⭐</p>
      </div>
      <p>Nije kasno. <strong style="color:#fff;">Jedino što košta skuplje od programa — je čekanje.</strong></p>
      <div style="text-align:center;margin:20px 0;"><a href="${SITE_URL}/volim-svoj-novac" class="btn">Počni danas →</a></div>
      ${sig}`,

    // Dan 14 — Zašto danas (skipIfPurchased: true)
    13: () => `
      <h2>Zašto baš danas? Ne sutra, ne sljedeći tjedan.</h2>
      <p>Dragi/a ${n},</p>
      <p>Čekamo savršen trenutak. A savršen trenutak nikad ne dolazi.</p>
      <p>Znaš li što su rekli svi polaznici koji su čekali? <strong style="color:#fff;">"Jedino što žalim je što nisam počeo/la ranije."</strong></p>
      <div class="box">
        <p style="color:#D4AF37;font-weight:700;margin:0 0 10px;">Moć složenog efekta (konkretno):</p>
        <p style="margin:0 0 6px;">200 € miesečno, 7% godišnji prinos:</p>
        <p style="margin:0 0 6px;">→ Za 10 godina: <strong style="color:#fff;">34.000 €</strong></p>
        <p style="margin:0 0 6px;">→ Za 20 godina: <strong style="color:#fff;">102.000 €</strong></p>
        <p style="margin:0;">→ Za 30 godina: <strong style="color:#fff;">240.000 €</strong></p>
      </div>
      <p>Svaka godina čekanja oduzima desetke tisuća eura s kraja te tablice.</p>
      <p><strong style="color:#fff;">Savršen trenutak je sada.</strong></p>
      ${offerBox()}
      ${sig}`,

    // Dan 15 — Iza kulisa (skipIfPurchased: true)
    14: () => `
      <h2>Pogledaj što te čeka iznutra programa</h2>
      <p>Dragi/a ${n},</p>
      <p>Mnogi me pitaju: "Kako izgleda program u praksi?" Evo konkretno:</p>
      <div class="box">
        <p style="color:#D4AF37;font-weight:700;margin:0 0 8px;">Dan 1 — Financijski audit</p>
        <p style="margin:0 0 16px;font-size:14px;">Točno mapiramo gdje si sada — prihodi, rashodi, dugovi, štednja. Bez osude, bez panike. Samo jasna slika.</p>
        <p style="color:#D4AF37;font-weight:700;margin:0 0 8px;">Tjedan 2 — Budžet koji diše</p>
        <p style="margin:0 0 16px;font-size:14px;">Ne rigidni, ne nemoguć. Budžet koji funkcionira za tvoj život — i koji počinje raditi automatski.</p>
        <p style="color:#D4AF37;font-weight:700;margin:0 0 8px;">Miesec 2 — Eliminacija duga</p>
        <p style="margin:0 0 16px;font-size:14px;">Metodama koje su polaznicima pomogle eliminirati dugove 2-3x brže nego standardnom otplatom.</p>
        <p style="color:#D4AF37;font-weight:700;margin:0 0 8px;">Miesec 3 — Prve investicije</p>
        <p style="margin:0;font-size:14px;">Korak po korak uvod u investiranje — bez rizika, bez žargona, bez hype-a.</p>
      </div>
      ${offerBox()}
      ${sig}`,

    // Dan 16 — Fear / 5 godina (skipIfPurchased: false)
    15: () => `
      <h2>Što se dogodi za 5 godina ako se ništa ne promijeni?</h2>
      <p>Dragi/a ${n},</p>
      <p>Ovo je pitanje koje postavljam svim polaznicima na prvom danu. I nitko ga ne voli.</p>
      <p>Zatvori oči i zamisli se za 5 godina — <strong style="color:#fff;">ako nastavio/la točno onako kako si do sada:</strong></p>
      <div class="box">
        <p style="margin:0 0 8px;">→ Isti financijski stres svaki kraj mieseca</p>
        <p style="margin:0 0 8px;">→ Isti dugovi — možda i veći</p>
        <p style="margin:0 0 8px;">→ Nula ušteđevine za hitne situacije</p>
        <p style="margin:0 0 8px;">→ Nula investicija koje rade za tebe</p>
        <p style="margin:0;">→ I isto osjećanje: "trebao/la sam krenuti ranije"</p>
      </div>
      <p>Sada zamislil isti datum — ali ako počneš <strong style="color:#fff;">danas</strong>:</p>
      <div class="box" style="border-color:#22c55e;">
        <p style="margin:0 0 8px;color:#22c55e;">→ Hitni fond koji te štiti od svake krize</p>
        <p style="margin:0 0 8px;color:#22c55e;">→ Dugovi eliminirani ili u zadnjoj fazi otplate</p>
        <p style="margin:0 0 8px;color:#22c55e;">→ Investicije koje rastu bez tvojeg napora</p>
        <p style="margin:0;color:#22c55e;">→ I osjećaj kontrole koji nema cijenu</p>
      </div>
      <div style="text-align:center;margin:20px 0;"><a href="${SITE_URL}/volim-svoj-novac" class="btn">Odaberi drugu verziju budućnosti →</a></div>
      ${sig}`,

    // Dan 17 — Marija social proof (skipIfPurchased: false)
    16: () => `
      <h2>Marija je otplatila 3 kredita odjednom — evo kako</h2>
      <p>Dragi/a ${n},</p>
      <p>Marija je dolazila iz Splita s osjećajem koji mnogi poznajemo: previše dugova, premalo prihoda, i nikakav izlaz na vidiku.</p>
      <p>Imala je 3 simultana kredita — auto, kartica, osobni zajam. Svaki miesec samo kamate, bez da se glavnica micala.</p>
      <div class="box">
        <p style="font-style:italic;color:#fff;margin:0 0 12px;">"Nisam vjerovala da postoji sustavan način izlaska. Metodom lavine dugova i restrukturiranjem budžeta — za 8 mieseci otplatila sam sva tri. Danas imam hitni fond i počinjem štedjeti za mirovinu. Ne mogu vjerovati da je bilo moguće."</p>
        <p style="color:#D4AF37;font-size:13px;margin:0;">— Marija K., Split ⭐⭐⭐⭐⭐</p>
      </div>
      <p>Marija nije dobila povišicu. Nije dobila nasljedstvo. Dobila je <strong style="color:#fff;">pravi sustav</strong>.</p>
      <div style="text-align:center;margin:20px 0;"><a href="${SITE_URL}/volim-svoj-novac" class="btn">Saznaj više o programu →</a></div>
      ${sig}`,

    // Dan 18 — Zadnja šansa PRILIKA (skipIfPurchased: true)
    17: () => `
      <h2>⏰ Zadnja šansa — vraćam cijenu na 397 € u ponoć</h2>
      <p>Dragi/a ${n},</p>
      <p>Ozbiljno. Ovo nije marketing taktika.</p>
      <p>Kod <strong style="color:#D4AF37;font-family:monospace;">PRILIKA</strong> koji ti daje cijenu 197 € umjesto 397 € — večeras ga povlačim.</p>
      <p>Znam da razmišljaš. Znam da imaš pitanja. Ali postoji jedna stvar koju znam sigurno:</p>
      <div class="box" style="border-color:#ef4444;">
        <p style="color:#fff;font-weight:700;font-size:17px;margin:0 0 8px;text-align:center;">Svaki dan čekanja je dan koji gubim.</p>
        <p style="color:#718096;font-size:13px;text-align:center;margin:0;">Ne gubim ja. Gubiš ti — u izgubljenoj ušteđevini, u kamatama koje platiš, u investicijama koje ne rastu.</p>
      </div>
      <p>30-dnevna garancija. Ako ne vidiš razliku — vraćam ti novac. Osobno.</p>
      ${offerBox()}
      ${sig}`,

    // Dan 19 — Re-engagement (skipIfPurchased: true)
    18: () => `
      <h2>Nisam te zaboravio/la.</h2>
      <p>Dragi/a ${n},</p>
      <p>Znam da ti pišem već neko vrijeme. I znam da još nisi napravio/la korak.</p>
      <p>Ne osuđujem. Svaka promjena zahtijeva odluku — a odluke nisu uvijek lagane.</p>
      <p>Ali pitam te iskreno: <strong style="color:#fff;">što te koči?</strong></p>
      <div class="box">
        <p style="margin:0 0 8px;">💭 Je li to cijena? Kod PRILIKA daje 197 € — i garancija povrata postoji.</p>
        <p style="margin:0 0 8px;">💭 Je li to vrijeme? Program traje 20-30 min dnevno.</p>
        <p style="margin:0 0 8px;">💭 Je li to sumnja: "možda to nije za mene"? Svaki polaznik je mislio isto.</p>
        <p style="margin:0;">💭 Je li nešto drugo? Odgovori na ovaj email — osobno ću ti odgovoriti.</p>
      </div>
      <p>Ozbiljno. Napiši mi. Čitam svaki email.</p>
      ${offerBox()}
      ${sig}`,

    // Dan 20 — Neurološki razlog (skipIfPurchased: false)
    19: () => `
      <h2>Neurološki razlog zašto 90 dana mijenja sve</h2>
      <p>Dragi/a ${n},</p>
      <p>Čuo/la si sigurno da treba 21 dan da se formira navika. To je mit.</p>
      <p>Istraživanja University College London pokazuju da prosječno treba <strong style="color:#fff;">66 dana</strong> da nova navika postane automatska. A za složenije financijske navike — do 90 dana.</p>
      <div class="box">
        <p style="color:#D4AF37;font-weight:700;margin:0 0 10px;">Što se u mozgu događa za 90 dana:</p>
        <p style="margin:0 0 6px;">→ Nove neuralne veze postaju dominantne</p>
        <p style="margin:0 0 6px;">→ Stari automatizmi (impulzivna potrošnja) slabe</p>
        <p style="margin:0;">→ Novi automatizmi (štednja, planiranje) postaju default</p>
      </div>
      <p>Program je dizajniran točno za taj vremenski okvir. Ne 30 dana. Ne 60. <strong style="color:#fff;">90 dana — jer to je koliko mozgu treba.</strong></p>
      <div style="text-align:center;margin:20px 0;"><a href="${SITE_URL}/volim-svoj-novac" class="btn">Pokreni svoju transformaciju →</a></div>
      ${sig}`,

    // Dan 21 — Ekskluzivni PRIJATELJ (skipIfPurchased: true)
    20: () => `
      <h2>🔒 Samo za tebe — kod koji ne dijeljim nigdje javno</h2>
      <p>Dragi/a ${n},</p>
      <p>Ovo je zadnji email u ovoj sekvenci. I dajem ti nešto što nema nitko drugi.</p>
      <p>Pratim tebe konkretno — vidim da si otvorio/la emailove, da te tema zanima. I cijenim to.</p>
      <p>Zato ti danas dajem kod koji ne postoji javno nigdje:</p>
      <div class="box" style="border-color:#D4AF37;text-align:center;">
        <p style="color:#718096;margin:0 0 8px;font-size:13px;">Ekskluzivni kod — samo za tebe:</p>
        <p style="font-family:monospace;font-size:32px;font-weight:900;color:#D4AF37;background:#1a2f47;padding:12px 28px;border-radius:8px;display:inline-block;letter-spacing:4px;margin:0 0 12px;">${CODE_VIP}</p>
        <p style="font-size:44px;font-weight:900;color:#D4AF37;margin:4px 0;">197 €</p>
        <p style="color:#718096;font-size:12px;margin:0;">Ista cijena kao PRILIKA — ali ovaj kod je samo tvoj.</p>
      </div>
      <div style="text-align:center;margin:20px 0;"><a href="${SITE_URL}/volim-svoj-novac" class="btn">Upiši se s kodom PRIJATELJ →</a></div>
      <p style="color:#718096;font-size:13px;text-align:center;">30-dnevna garancija. Ako ne vidiš razliku — vraćam ti novac. Osobno.</p>
      ${sig}`,

    // ── FAZA 2 ────────────────────────────────────────────────────────────────

    // Dan 23 — Navika #1 (edu, svima)
    21: () => `
      <h2>Navika #1 koju dijele svi financijski slobodni ljudi</h2>
      <p>Dragi/a ${n},</p>
      <p>Godinama sam pratio financijski uspješne ljude. Jednoglasno — svi imaju ovu jednu naviku:</p>
      <div class="box">
        <p style="color:#D4AF37;font-weight:800;font-size:18px;text-align:center;margin:0 0 12px;">"Plati prvo sebe."</p>
        <p style="margin:0 0 8px;">Čim stigne plaća — <strong style="color:#fff;">odmah automatski prebaci 10-20% na odvojeni račun.</strong> Prije računa. Prije hrane. Prije svega.</p>
        <p style="margin:0;">Ono što ostane — to je tvoj budžet za život.</p>
      </div>
      <p>Ova jedna promjena — ništa više — polaznicima programa donosi <strong style="color:#fff;">1.200-3.000 € više ušteđevine godišnje</strong>.</p>
      <p>Postavi to danas. Automatski. I zaboravi.</p>
      ${softCta}
      ${sig}`,

    // Dan 25 — sales (nekupci)
    22: () => `
      <h2>Što mi polaznici govore nakon prvog tjedna</h2>
      <p>Dragi/a ${n},</p>
      <p>Pitam svakog polaznika isti tjedan: "Što te najviše iznenadilo?"</p>
      <p>Najčešći odgovor: <strong style="color:#fff;">"Koliko novca mi je 'curilo' — a nisam bio/la svjestan/na."</strong></p>
      <div class="box">
        <p style="font-style:italic;color:#fff;margin:0 0 10px;">"Već nakon prvog tjedna pronašla sam 340 € miesečno koje su odlazili na pretplate i navike koje mi nisu bile važne. Samo od toga se program isplatio trostruko."</p>
        <p style="color:#D4AF37;font-size:13px;margin:0;">— Petra L., Zagreb ⭐⭐⭐⭐⭐</p>
      </div>
      <p>340 € miesečno × 12 = <strong style="color:#fff;">4.080 € godišnje.</strong> Pronađeno u prvom tjednu.</p>
      <p>Program košta 197 €. ROI: 2000%+.</p>
      ${offerBox()}
      ${sig}`,

    // Dan 27 — Budžet edu (svima)
    23: () => `
      <h2>Budžet koji ne osjećaš — ali koji funkcionira</h2>
      <p>Dragi/a ${n},</p>
      <p>Kad čuju "budžet" — većina ljudi zamisli Excel tablicu s milijun kategorija i osjećajem odricanja.</p>
      <p>To nije budžet koji ti trebam naučiti.</p>
      <div class="box">
        <p style="color:#D4AF37;font-weight:700;margin:0 0 10px;">Formula 50/30/20 — jednostavno i brutalno učinkovito:</p>
        <p style="margin:0 0 8px;"><strong style="color:#fff;">50%</strong> → Potrebe (stanarina, hrana, prijevoz, računi)</p>
        <p style="margin:0 0 8px;"><strong style="color:#fff;">30%</strong> → Želje (izlasci, hobi, putovanja — bez krivnje)</p>
        <p style="margin:0;"><strong style="color:#D4AF37;">20%</strong> → Štednja i dugovi — automatski, odmah</p>
      </div>
      <p>Ako si u fazi s puno duga — privremeno: 50/20/30 ili čak 50/10/40. Fleksibilno prema situaciji.</p>
      <p>Ključ: <strong style="color:#fff;">automatizacija 20%</strong>. Ne čekaj kraj mieseca. Postavi trajni nalog.</p>
      ${softCta}
      ${sig}`,

    // Dan 29 — Psihologija novca (svima)
    24: () => `
      <h2>Psihologija novca: zašto radimo suprotno od onoga što znamo</h2>
      <p>Dragi/a ${n},</p>
      <p>Znamo da trebamo štedjeti. Znamo da ne trebamo trošiti impulzivno. I svejedno to radimo.</p>
      <p>Zašto?</p>
      <div class="box">
        <p style="color:#D4AF37;font-weight:700;margin:0 0 10px;">3 psihološke zamke koje nas drže siromaštva:</p>
        <p style="margin:0 0 8px;">🧠 <strong style="color:#fff;">Instant gratifikacija</strong> — mozak preferira malu nagradu sada nad velikom nagradom later</p>
        <p style="margin:0 0 8px;">🧠 <strong style="color:#fff;">Status potrošnja</strong> — kupujemo da bismo impresionirali ljude koji nas ne zanima</p>
        <p style="margin:0;">🧠 <strong style="color:#fff;">Bol gubitka</strong> — strah od gubitka jači je od radosti dobitka (zato ne investiramo)</p>
      </div>
      <p>Znanje nije dovoljno. Treba nam <strong style="color:#fff;">sustav koji zaobilazi ove zamke</strong> — automatizmom, ne voljom.</p>
      ${softCta}
      ${sig}`,

    // Dan 31 — Računica (sales, nekupci)
    25: () => `
      <h2>Računica koja ruši sve izlike</h2>
      <p>Dragi/a ${n},</p>
      <p>Hajdemo biti brutalno konkretni.</p>
      <div class="box">
        <p style="color:#D4AF37;font-weight:700;margin:0 0 10px;">Scenarij A — ne upisuješ program:</p>
        <p style="margin:0 0 6px;font-size:14px;">→ Nastavljaš kao do sada</p>
        <p style="margin:0 0 6px;font-size:14px;">→ Prosječni "leak" novca: 200-400 € miesečno</p>
        <p style="margin:0 0 16px;font-size:14px;">→ Za 5 godina: 12.000-24.000 € izgubljene prilike</p>
        <p style="color:#D4AF37;font-weight:700;margin:0 0 10px;">Scenarij B — upisuješ program s PRILIKA:</p>
        <p style="margin:0 0 6px;font-size:14px;">→ Investicija: 197 €</p>
        <p style="margin:0 0 6px;font-size:14px;">→ Prosječna ušteda u prvom miesecu: 200 €+</p>
        <p style="margin:0;font-size:14px;">→ ROI: <strong style="color:#fff;">program se isplati za manje od 30 dana</strong></p>
      </div>
      <p>Koji scenarij biraš?</p>
      ${offerBox()}
      ${sig}`,

    // Dan 33 — Hitni fond (edu, svima)
    26: () => `
      <h2>Hitni fond — jedina stvar između tebe i financijske krize</h2>
      <p>Dragi/a ${n},</p>
      <p>Istraživanja pokazuju da 60% odraslih ne bi moglo pokriti neočekivani trošak od 400 € bez pozajmljivanja.</p>
      <p>Pukne guma. Slomi se bojler. Dođe zdravstveni trošak. I odjednom — kriza.</p>
      <div class="box">
        <p style="color:#D4AF37;font-weight:700;margin:0 0 10px;">Hitni fond — 3 pravila:</p>
        <p style="margin:0 0 8px;">1️⃣ <strong style="color:#fff;">Cilj: 3-6 mieseca troškova</strong> — ne prihoda, nego troškova</p>
        <p style="margin:0 0 8px;">2️⃣ <strong style="color:#fff;">Odvojen račun</strong> — ne miješati s tekućim, ne dostupan karticom</p>
        <p style="margin:0;">3️⃣ <strong style="color:#fff;">Gradi polako</strong> — i 50 € miesečno je početak. Za 12 mieseci: 600 €.</p>
      </div>
      <p>Hitni fond nije trošak — on je <strong style="color:#fff;">financijska sloboda u malom</strong>. Jer kad imaš ga, krize postaju neugodnosti.</p>
      ${softCta}
      ${sig}`,

    // Dan 35 — Ivan social proof (svima)
    27: () => `
      <h2>Ivan je smanjio troškove za 30% — a nije se ni odricao</h2>
      <p>Dragi/a ${n},</p>
      <p>Ivan, IT stručnjak iz Beograda, bio je uvjeren da troši "razumno". Nije imao luksuzne navike. Nije puno izlazio.</p>
      <p>A opet — na kraju mieseca nije ostajalo ništa.</p>
      <div class="box">
        <p style="font-style:italic;color:#fff;margin:0 0 12px;">"Financijskim auditom otkrio sam 14 aktivnih pretplata — od kojih sam aktivno koristio 4. Tri mobilna plana od kojih mi trebaju dva. I naviku naručivanja hrane 4-5 puta tjedno koja me stajala 180 € miesečno. Bez ikakve 'žrtve' — samo svjesnošću — smanjio sam troškove za 30%."</p>
        <p style="color:#D4AF37;font-size:13px;margin:0;">— Ivan T., IT stručnjak, Beograd ⭐⭐⭐⭐⭐</p>
      </div>
      <p>Svjesnost je moćnija od volje. Uvijek.</p>
      ${softCta}
      ${sig}`,

    // Dan 37 — PRILIKA vrijedi (sales, nekupci)
    28: () => `
      <h2>Jesi li znao/la da PRILIKA kod vrijedi i dalje?</h2>
      <p>Dragi/a ${n},</p>
      <p>Mnogi misle da je posebna cijena istekla. Nije.</p>
      <p>Kod <strong style="color:#D4AF37;font-family:monospace;">PRILIKA</strong> daje ti cijenu 197 € — i to je stalna cijena za čitatelje vodiča.</p>
      <div class="box">
        <p style="color:#D4AF37;font-weight:700;margin:0 0 10px;">Što još uvijek dobivaš:</p>
        <p style="margin:0 0 6px;">✅ 90 video lekcija u 3 faze (90 dana transformacije)</p>
        <p style="margin:0 0 6px;">✅ Excel predlošci i radni listovi</p>
        <p style="margin:0 0 6px;">✅ Certifikat završetka programa</p>
        <p style="margin:0 0 6px;">✅ Doživotni pristup + sve buduće nadogradnje</p>
        <p style="margin:0;">✅ 30-dnevna garancija povrata novca</p>
      </div>
      ${offerBox()}
      ${sig}`,

    // Dan 39 — Dug (edu, svima)
    29: () => `
      <h2>Dug nije sramota — ali ostati u njemu je izbor</h2>
      <p>Dragi/a ${n},</p>
      <p>Kultura nas je naučila da je dug sramota. A nije. Dug je alat — koji može biti dobro ili loše korišten.</p>
      <div class="box">
        <p style="color:#D4AF37;font-weight:700;margin:0 0 10px;">2 metode eliminacije duga (obje funkcioniraju):</p>
        <p style="margin:0 0 8px;"><strong style="color:#fff;">Metoda Lavine</strong> — prvo plati dug s najvišom kamatom. Matematički optimalna.</p>
        <p style="margin:0 0 16px;color:#718096;font-size:13px;">Štedi najviše novca dugoročno.</p>
        <p style="margin:0 0 8px;"><strong style="color:#fff;">Metoda Snježne Grude</strong> — prvo plati najmanji dug. Psihološki najmoćnija.</p>
        <p style="margin:0;color:#718096;font-size:13px;">Brže vidiš rezultate, ostaneš motiviran/a.</p>
      </div>
      <p>Koja je bolja? Ona koju ćeš <strong style="color:#fff;">zaista primjeniti</strong>. Odaberi i počni danas.</p>
      ${softCta}
      ${sig}`,

    // Dan 41 — Automatska štednja (edu, svima)
    30: () => `
      <h2>Automatska štednja: postavi jednom, bogati se</h2>
      <p>Dragi/a ${n},</p>
      <p>Ovo je možda najvažniji financijski savjet koji ćeš ikad čuti:</p>
      <div class="box" style="text-align:center;">
        <p style="color:#D4AF37;font-weight:800;font-size:19px;margin:0 0 8px;">"Automatizuj štednju. Svaki euro koji vidiš — potrošit ćeš."</p>
      </div>
      <p>Kako to napraviti konkretno:</p>
      <p>1. Otvori odvojen štedni račun (idealno bez debitne kartice)<br>
      2. Postavi trajni nalog: <strong style="color:#fff;">isti dan kad primiš plaću</strong> — automatski prebaci X € na taj račun<br>
      3. Ne diraj taj novac. On nije za potrošnju.</p>
      <p>Počni s <strong style="color:#fff;">10% prihoda</strong>. Ako ti je to previše — počni s 5%. Ili s 50 €. Iznos je manje važan od navike.</p>
      ${softCta}
      ${sig}`,

    // Dan 43 — Što te koči (sales, nekupci)
    31: () => `
      <h2>Što te zapravo koči? (Iskreno pitanje)</h2>
      <p>Dragi/a ${n},</p>
      <p>Prateći vas dulje vrijeme, uočio sam 3 najčešća razloga zašto se ljudi ne odluče:</p>
      <div class="box">
        <p style="margin:0 0 12px;"><strong style="color:#D4AF37;">1. "Nije pravi trenutak."</strong><br><span style="font-size:14px;color:#cbd5e0;">Savršen trenutak nije ni sutra. Nije ni sljedeće polugodište. Počni kad si spreman/na — ali znaš što? Spreman/na si sad.</span></p>
        <p style="margin:0 0 12px;"><strong style="color:#D4AF37;">2. "Možda ne funkcionira za mene."</strong><br><span style="font-size:14px;color:#cbd5e0;">Zato postoji 30-dnevna garancija. Prvih 30 dana — bez rizika.</span></p>
        <p style="margin:0;"><strong style="color:#D4AF37;">3. "197 € je puno novca."</strong><br><span style="font-size:14px;color:#cbd5e0;">Prosječna ušteda u prvom miesecu: 200 €+. Program se isplati u prvih 30 dana.</span></p>
      </div>
      <p>Koji od ovih je tvoj? Odgovori na ovaj email — razgovaram s tobom osobno.</p>
      ${offerBox()}
      ${sig}`,

    // Dan 45 — Investiranje s 50€ (edu, svima)
    32: () => `
      <h2>Investiranje s 50 € — nije mit, nego matematika</h2>
      <p>Dragi/a ${n},</p>
      <p>"Nemam dovoljno novca za investiranje." — najčešća izlika koju čujem.</p>
      <p>Hajdemo vidjeti što matematika kaže:</p>
      <div class="box">
        <p style="color:#D4AF37;font-weight:700;margin:0 0 10px;">50 € miesečno, 7% godišnji prinos (globalni ETF prosjek):</p>
        <p style="margin:0 0 6px;">→ Za 10 godina: <strong style="color:#fff;">8.654 €</strong></p>
        <p style="margin:0 0 6px;">→ Za 20 godina: <strong style="color:#fff;">26.074 €</strong></p>
        <p style="margin:0 0 6px;">→ Za 30 godina: <strong style="color:#fff;">60.934 €</strong></p>
        <p style="margin:0;color:#718096;font-size:13px;">Od čega si uložio/la samo 18.000 €. Ostatak je složeni kamatni efekt.</p>
      </div>
      <p>50 € miesečno. To je 1-2 večere vani. I to gradi bogatstvo koje mijenja obitelji.</p>
      ${softCta}
      ${sig}`,

    // Dan 47 — Sandra social proof (svima)
    33: () => `
      <h2>Sandra je otplatila stan 8 godina ranije</h2>
      <p>Dragi/a ${n},</p>
      <p>Sandra, učiteljica iz Sarajeva, imala je stambeni kredit s 20 godina otplate. "Normalna" situacija za većinu.</p>
      <p>No pitala se: što ako bih ubrzala otplatu? Koliko bih uštedjela na kamatama?</p>
      <div class="box">
        <p style="font-style:italic;color:#fff;margin:0 0 12px;">"Naučila sam o overpaymentu kredita i refinanciranju. Svaki miesec uplaćujem 15% više od rate — i prema izračunu, otplatit ću stan 8 godina ranije. Ušteda na kamatama: 22.000 €. To je više od godišnje plaće."</p>
        <p style="color:#D4AF37;font-size:13px;margin:0;">— Sandra H., učiteljica, Sarajevo ⭐⭐⭐⭐⭐</p>
      </div>
      <p><strong style="color:#fff;">22.000 €</strong> ušteđenih na kamatama — bez povišice, bez nasljedstva. Samo znanje i sustav.</p>
      ${softCta}
      ${sig}`,

    // Dan 49 — Zajednica (sales, nekupci)
    34: () => `
      <h2>Nisi sam/a — pridruži se zajednici koja se zajedno bogati</h2>
      <p>Dragi/a ${n},</p>
      <p>Jedna od stvari o kojoj rijetko govorim, a polaznici je najčešće hvale:</p>
      <p><strong style="color:#fff;">Okruženje.</strong></p>
      <p>Kad si okružen/a ljudima koji rade na istom cilju — financijska sloboda postaje norma, a ne iznimka.</p>
      <div class="box">
        <p style="color:#D4AF37;font-weight:700;margin:0 0 10px;">Što se događa u zajednici polaznika:</p>
        <p style="margin:0 0 6px;">→ Dijele uspjehe ("uštedjeo/la sam 500 € ovaj miesec!")</p>
        <p style="margin:0 0 6px;">→ Postavljaju pitanja i dobivaju konkretne odgovore</p>
        <p style="margin:0 0 6px;">→ Drže jedni druge odgovornim</p>
        <p style="margin:0;">→ Motiviraju se međusobno kad je teško</p>
      </div>
      <p>Seth Godin kaže: <em style="color:#fff;">"Pronađi pleme koje ide tamo kuda ideš ti."</em></p>
      ${offerBox()}
      ${sig}`,

    // Dan 51 — Mindset bogataša (edu, svima)
    35: () => `
      <h2>Mindset bogataša — i nije o novcu</h2>
      <p>Dragi/a ${n},</p>
      <p>Godinama sam pratio financijski uspješne ljude. I otkrio sam nešto neočekivano:</p>
      <p>Ključna razlika nije u znanju. Nije u prilikama. Nije ni u naslijeđu.</p>
      <div class="box">
        <p style="color:#D4AF37;font-weight:700;margin:0 0 10px;">Ključna razlika je u ovim 3 uvjerenja:</p>
        <p style="margin:0 0 8px;">💡 <strong style="color:#fff;">"Ja kontroliram svoju financijsku situaciju"</strong> — ne sreća, ne okolnosti</p>
        <p style="margin:0 0 8px;">💡 <strong style="color:#fff;">"Novac je alat, ne cilj"</strong> — cilj je sloboda, sigurnost, mogućnosti</p>
        <p style="margin:0;">💡 <strong style="color:#fff;">"Investiranje je odgovornost, ne rizik"</strong> — ne investirati je stvarni rizik</p>
      </div>
      <p>Ova uvjerenja ne nalaziš u školama. Ali možeš ih naučiti — i primijeniti.</p>
      ${softCta}
      ${sig}`,

    // Dan 53 — 5 aplikacija (edu, svima)
    36: () => `
      <h2>5 aplikacija koje koristim svaki dan za financije</h2>
      <p>Dragi/a ${n},</p>
      <div class="box">
        <p style="margin:0 0 10px;">📱 <strong style="color:#fff;">YNAB (You Need A Budget)</strong> — budžetiranje koje zaista funkcionira. Platforma, ali vrijedi svaki euro.</p>
        <p style="margin:0 0 10px;">📱 <strong style="color:#fff;">Revolut</strong> — brza analiza potrošnje po kategorijama, automatska štednja, džepovi za ciljeve.</p>
        <p style="margin:0 0 10px;">📱 <strong style="color:#fff;">Trading 212</strong> — za početnike koji žele početi s ETF investiranjem. Bez naknada za dionice.</p>
        <p style="margin:0 0 10px;">📱 <strong style="color:#fff;">Google Sheets</strong> — moja vlastita tablica (predložak dajem u programu). Jednostavno i moćno.</p>
        <p style="margin:0;">📱 <strong style="color:#fff;">Notion</strong> — financijski ciljevi, praćenje napretka, godišnji pregled.</p>
      </div>
      <p>Alati su samo toliko dobri koliko je sustav iza njih. Aplikacije bez plana = kaos.</p>
      ${softCta}
      ${sig}`,

    // Dan 57 — Pregovaranje plaće (edu, svima)
    38: () => `
      <h2>Pregovaraj plaću — dodaj 200 € bez mijenjanja posla</h2>
      <p>Dragi/a ${n},</p>
      <p>Većina ljudi nikad ne pregovara plaću. Prihvate prvu ponudu i ostanu na njoj godinama.</p>
      <div class="box">
        <p style="color:#D4AF37;font-weight:700;margin:0 0 10px;">3 koraka za uspješno pregovaranje:</p>
        <p style="margin:0 0 8px;">1️⃣ <strong style="color:#fff;">Istraži tržište</strong> — saznaj prosječnu plaću za tvoju poziciju (LinkedIn, Glassdoor, razgovori s kolegama)</p>
        <p style="margin:0 0 8px;">2️⃣ <strong style="color:#fff;">Dokumentiraj postignuća</strong> — konkretni brojevi, projekti, uštede koje si donio/la tvrtki</p>
        <p style="margin:0;">3️⃣ <strong style="color:#fff;">Zatraži razgovor</strong> — ne čekaj godišnji pregled. Zatraži meeting i dođi pripremljeno.</p>
      </div>
      <p>Prosječno povećanje plaće pregovaranjem: <strong style="color:#fff;">10-20%</strong>. Na plaći od 1.500 € — to je 150-300 € miesečno više.</p>
      <p>Jedan razgovor od 30 minuta može vrijediti 3.600 € godišnje.</p>
      ${softCta}
      ${sig}`,

    // Dan 59 — Josip social proof (svima)
    39: () => `
      <h2>Josip je s dugom od 15.000 € stigao do prve investicije</h2>
      <p>Dragi/a ${n},</p>
      <p>Josip, građevinski inženjer iz Sarajeva, imao je 15.000 € raznih dugova — kredit, kartica, pozajmice od obitelji.</p>
      <p>Osjećao se zarobljeno. Svaki miesec samo plaćao kamate, bez napretka.</p>
      <div class="box">
        <p style="font-style:italic;color:#fff;margin:0 0 12px;">"Metodom lavine dugova i strogim budžetom — za 18 mieseci eliminirao sam svih 15.000 €. Odmah sljedeći miesec počeo sam investirati 100 € miesečno u ETF. Osjećaj? Nemoguće opisati riječima."</p>
        <p style="color:#D4AF37;font-size:13px;margin:0;">— Josip B., inženjer, Sarajevo ⭐⭐⭐⭐⭐</p>
      </div>
      <p>18 mieseci. 15.000 € duga — eliminirano. Počeo investirati. Isti čovjek, isti prihod, <strong style="color:#fff;">drugačiji sustav</strong>.</p>
      ${softCta}
      ${sig}`,

    // Dan 61 — Dva mieseca (sales, nekupci)
    40: () => `
      <h2>Dva mieseca. Pogledaj gdje su polaznici koji su počeli s tobom.</h2>
      <p>Dragi/a ${n},</p>
      <p>Prošla su 2 mieseca otkako si preuzeo/la vodič.</p>
      <p>Polaznici koji su se upisali tada — evo gdje su sada:</p>
      <div class="box">
        <p style="margin:0 0 8px;">✅ Znaju točno kuda odlazi svaki euro</p>
        <p style="margin:0 0 8px;">✅ Imaju automatsku štednju postavljenu</p>
        <p style="margin:0 0 8px;">✅ Hitni fond u izgradnji ili već izgrađen</p>
        <p style="margin:0 0 8px;">✅ Dug pada svaki miesec prema planu</p>
        <p style="margin:0;">✅ Mnogi su već napravili prve investicije</p>
      </div>
      <p>Gdje si ti za 2 mieseca? To ovisi samo o jednoj odluci — danas.</p>
      ${offerBox()}
      ${sig}`,

    // Dan 63 — Pasivni prihodi (edu, svima)
    41: () => `
      <h2>Pasivni prihodi nisu mit — evo odakle početi</h2>
      <p>Dragi/a ${n},</p>
      <p>Pasivni prihod znači: novac koji dolazi bez da razmjenjivaš sat za sat.</p>
      <p>Ali postoji redoslijed koji moraš poštivati:</p>
      <div class="box">
        <p style="color:#D4AF37;font-weight:700;margin:0 0 10px;">Putanja do pasivnog prihoda:</p>
        <p style="margin:0 0 6px;"><strong style="color:#fff;">Korak 1:</strong> Zaustavi "curenje" — budžet i svjesnost</p>
        <p style="margin:0 0 6px;"><strong style="color:#fff;">Korak 2:</strong> Hitni fond (3-6 mieseci troškova)</p>
        <p style="margin:0 0 6px;"><strong style="color:#fff;">Korak 3:</strong> Eliminiraj dugove s visokim kamatama</p>
        <p style="margin:0 0 6px;"><strong style="color:#fff;">Korak 4:</strong> Počni investirati (ETF, dionice, obveznice)</p>
        <p style="margin:0;"><strong style="color:#fff;">Korak 5:</strong> Diverzificiraj (nekretnine, vlastiti projekt, affiliate)</p>
      </div>
      <p>Preskočiti korake ne funkcionira. Ali napraviti ih redom — <strong style="color:#fff;">funkcionira uvijek</strong>.</p>
      ${softCta}
      ${sig}`,

    // Dan 65 — Inflacija (edu, svima)
    42: () => `
      <h2>Inflacija te krade tiho — evo kako se obraniti</h2>
      <p>Dragi/a ${n},</p>
      <p>Inflacija od 4% godišnje znači da tvoj novac koji "miruje" na tekućem računu — gubi 4% vrijednosti svake godine. Tiho. Bez da ikoga pitaš.</p>
      <div class="box">
        <p style="color:#D4AF37;font-weight:700;margin:0 0 10px;">Konkretna obrana:</p>
        <p style="margin:0 0 8px;">🏦 <strong style="color:#fff;">Kratkoročna rezerva (1-3 mj):</strong> visoko-kamatni štedni račun ili kratkoroč. obveznice</p>
        <p style="margin:0 0 8px;">📈 <strong style="color:#fff;">Dugoročna štednja (5+ god):</strong> ETF fondovi koji historijski vraćaju 7-10% godišnje</p>
        <p style="margin:0;">🏠 <strong style="color:#fff;">Nekretnine:</strong> ako imaš kapital — dobra hedge protiv inflacije</p>
      </div>
      <p>Minimum: novac ne smije "spavati" na 0% kamate. Inflacija je tihi porez na pasivnost.</p>
      ${softCta}
      ${sig}`,

    // Dan 67 — Sales (nekupci)
    43: () => `
      <h2>Posebna cijena još vrijedi — za tebe</h2>
      <p>Dragi/a ${n},</p>
      <p>Znam da puno čitaš ove emailove. I cijenim to — zaista.</p>
      <p>Samo ti podsjetiti: kod <strong style="color:#D4AF37;font-family:monospace;">PRILIKA</strong> i dalje vrijedi.</p>
      <p>Nema fake rokova. Nema lažnog marketinga. Jednostavno — ako si spreman/na, cijena te čeka.</p>
      <div class="box">
        <p style="font-style:italic;color:#fff;margin:0 0 10px;">"Čekao sam 3 mieseca prije nego što sam se upisao. I jedino što žalim — što nisam to napravio odmah."</p>
        <p style="color:#D4AF37;font-size:13px;margin:0;">— Marko D., polaznik programa ⭐⭐⭐⭐⭐</p>
      </div>
      ${offerBox()}
      ${sig}`,

    // Dan 69 — ETF fondovi (edu, svima)
    44: () => `
      <h2>ETF fondovi za početnike — sve što trebaš znati</h2>
      <p>Dragi/a ${n},</p>
      <p>ETF (Exchange-Traded Fund) — najjednostavniji put do dugoročnog bogatstva za prosječnog ulagača.</p>
      <div class="box">
        <p style="color:#D4AF37;font-weight:700;margin:0 0 10px;">Što je ETF i zašto ga Warren Buffett preporučuje svima?</p>
        <p style="margin:0 0 8px;">→ Košarica stotina/tisuća dionica u jednom instrumentu</p>
        <p style="margin:0 0 8px;">→ Automatska diverzifikacija — jedan pad ne ruinira te</p>
        <p style="margin:0 0 8px;">→ Niske naknade (0.07-0.20% godišnje)</p>
        <p style="margin:0;">→ Možeš početi s 1 €. Ozbiljno.</p>
      </div>
      <p><strong style="color:#fff;">VWCE</strong> (Vanguard FTSE All-World) — moj favorit za početnike. Globalna diverzifikacija, niska naknada, dugi track record.</p>
      <p>Ne savjet. Edukacija. Uvijek konzultiraj financijskog savjetnika za osobne odluke.</p>
      ${softCta}
      ${sig}`,

    // Dan 71 — Petra social proof (svima)
    45: () => `
      <h2>Petra je s 400 € počela — danas ima portfelj od 12.000 €</h2>
      <p>Dragi/a ${n},</p>
      <p>Petra, fizioterapeutica iz Beograda, počela je investirati s 400 € — sve što je imala ušteđeno.</p>
      <p>Bila je prestrašena. "Što ako izgubim sve?" bila je njena glavna briga.</p>
      <div class="box">
        <p style="font-style:italic;color:#fff;margin:0 0 12px;">"Naučila sam da diverzifikacijom kroz globalni ETF — ne možeš 'izgubiti sve' osim ako cijela globalna ekonomija ne propadne. A tada ni gotovina u ladici ne bi bila sigurna. Počela sam s 400 €, dodajem 150 € miesečno. Za 4 godine — portfelj od 12.000 €."</p>
        <p style="color:#D4AF37;font-size:13px;margin:0;">— Petra J., fizioterapeutica, Beograd ⭐⭐⭐⭐⭐</p>
      </div>
      <p>4 godine. 150 € miesečno. <strong style="color:#fff;">12.000 € portfelja.</strong> Bez sreće. Bez povlaštenih informacija. Samo sustav.</p>
      ${softCta}
      ${sig}`,

    // Dan 73 — Savršen trenutak (sales, nekupci)
    46: () => `
      <h2>Čekaš savršen trenutak? Imam vijesti za tebe.</h2>
      <p>Dragi/a ${n},</p>
      <p>Savršen trenutak ne postoji.</p>
      <p>Uvijek će biti razlog za čekanje. Uvijek će biti nešto "što se treba prvo urediti". Uvijek će biti...</p>
      <div class="box" style="text-align:center;">
        <p style="font-size:20px;font-weight:700;color:#D4AF37;margin:0 0 8px;">"Jedina razlika između tebe danas i tebe za godinu dana su knjige koje pročitaš, odluke koje napraviš i akcije koje poduzmeš."</p>
        <p style="color:#718096;font-size:13px;margin:0;">— Jim Rohn</p>
      </div>
      <p>Koji korak ćeš danas poduzeti?</p>
      ${offerBox()}
      ${sig}`,

    // Dan 75 — Financijska sloboda (edu, svima)
    47: () => `
      <h2>Financijska sloboda — kako zaista izgleda taj život</h2>
      <p>Dragi/a ${n},</p>
      <p>Financijska sloboda nije o milijunima. Nije o luksuznom životu. Bar ne na početku.</p>
      <div class="box">
        <p style="color:#D4AF37;font-weight:700;margin:0 0 10px;">Financijska sloboda ima 5 razina:</p>
        <p style="margin:0 0 6px;"><strong style="color:#fff;">Razina 1:</strong> Živiš unutar prihoda — nema novih dugova</p>
        <p style="margin:0 0 6px;"><strong style="color:#fff;">Razina 2:</strong> Imaš hitni fond — krize su neugodnosti, ne katastrofe</p>
        <p style="margin:0 0 6px;"><strong style="color:#fff;">Razina 3:</strong> Dugovi su eliminirani — više ne radaš za bankama</p>
        <p style="margin:0 0 6px;"><strong style="color:#fff;">Razina 4:</strong> Investicije rastu — novac radi za tebe</p>
        <p style="margin:0;"><strong style="color:#fff;">Razina 5:</strong> Pasivni prihod pokriva troškove — pravo sloboda</p>
      </div>
      <p>Gdje si ti sada? Gdje želiš biti za 5 godina?</p>
      <p>Svaka razina počinje jednom odlukom: <strong style="color:#fff;">početi</strong>.</p>
      ${softCta}
      ${sig}`,

    // Dan 77 — Kreditna kartica (edu, svima)
    48: () => `
      <h2>Kreditna kartica — prijatelj ili najveći neprijatelj?</h2>
      <p>Dragi/a ${n},</p>
      <p>Kontroverzno pitanje. Odgovor nije jednoznačan.</p>
      <div class="box">
        <p style="color:#22c55e;font-weight:700;margin:0 0 6px;">✅ Kreditna kartica KAO ALAT (dobro):</p>
        <p style="margin:0 0 16px;font-size:14px;">Plaćaš je u cijelosti svaki miesec. Nula kamata. Dobivaš cashback, milje, benefite. Gradiš kreditnu povijest.</p>
        <p style="color:#ef4444;font-weight:700;margin:0 0 6px;">❌ Kreditna kartica KAO ZAMKA (loše):</p>
        <p style="margin:0;font-size:14px;">Plaćaš minimum. Kamate 18-24% godišnje. Dug raste brže nego što ga otplaćuješ. Financijsko ropstvo.</p>
      </div>
      <p>Pravilo: <strong style="color:#fff;">ako ne možeš platiti cijeli iznos na kraju mieseca — ne kupuj to kreditnom karticom.</strong></p>
      <p>Nije o kartici. O disciplini i sustavu.</p>
      ${softCta}
      ${sig}`,

    // Dan 79 — ROI (sales, nekupci)
    49: () => `
      <h2>ROI koji ne možeš ignorirati</h2>
      <p>Dragi/a ${n},</p>
      <p>Matematika ne laže. Ajmo kroz nju zajedno.</p>
      <div class="box">
        <p style="color:#D4AF37;font-weight:700;margin:0 0 10px;">Investicija: 197 € (program s kodom PRILIKA)</p>
        <p style="margin:0 0 8px;">📊 <strong style="color:#fff;">Prosječna ušteda u 1. miesecu:</strong> 200-300 €</p>
        <p style="margin:0 0 8px;">📊 <strong style="color:#fff;">Ušteda na dugovima (kamate):</strong> 500-2.000 € godišnje</p>
        <p style="margin:0 0 8px;">📊 <strong style="color:#fff;">Investicije koje pokrećeš:</strong> dugoročni prinos tisućama</p>
        <p style="margin:0;color:#718096;font-size:13px;">ROI: program se isplati za &lt;30 dana.</p>
      </div>
      <p>197 € je trošak jednog vikend putovanja. Razlika je — putovanje se troši za 3 dana. Ovaj sustav gradi bogatstvo godinama.</p>
      ${offerBox()}
      ${sig}`,

    // Dan 81 — Pregovaranje s bankom (edu, svima)
    50: () => `
      <h2>Kako pregovarati s bankom — i dobiti bolji uvjet</h2>
      <p>Dragi/a ${n},</p>
      <p>Banke te ne vole. Ali te trebaju. I to je tvoja prednost.</p>
      <div class="box">
        <p style="color:#D4AF37;font-weight:700;margin:0 0 10px;">3 situacije gdje možeš pregovarati:</p>
        <p style="margin:0 0 10px;"><strong style="color:#fff;">1. Kamatna stopa na kredit</strong><br><span style="font-size:14px;">Dobra kreditna povijest? Ponuda konkurencije? Banka će pregovarati — naročito pri refinanciranju.</span></p>
        <p style="margin:0 0 10px;"><strong style="color:#fff;">2. Naknada za vođenje računa</strong><br><span style="font-size:14px;">Dugoročni klijent? Traži ukidanje ili smanjenje naknade. Często dobivaju kto pita.</span></p>
        <p style="margin:0;"><strong style="color:#fff;">3. Kamatna stopa na overdraft</strong><br><span style="font-size:14px;">Prijetnja prelaskom konkurenciji često funkcionira — posebno za dobre klijente.</span></p>
      </div>
      <p>Najgore što može reći: ne. Ali najčešće — kažu da.</p>
      ${softCta}
      ${sig}`,

    // Dan 83 — Luka social proof (svima)
    51: () => `
      <h2>Luka je izgradio hitni fond za 4 mieseca — evo kako</h2>
      <p>Dragi/a ${n},</p>
      <p>Luka, programer iz Splita, imao je nula ušteđevine. Doslovno nula. Svaki miesec — na nuli.</p>
      <p>Nije bio rasipnik. Jednostavno — novac bi nestao bez da je znao kamo.</p>
      <div class="box">
        <p style="font-style:italic;color:#fff;margin:0 0 12px;">"Financijskim auditom pronašao sam 380 € miesečno koje sam trošio na stvari koje mi uopće nisu bile bitne. Sve to automatski prebacio na štedni račun. Za 4 mieseca — 1.500 € hitnog fonda. Za godinu dana — 4.500 €. Sad spim mirno prvi put u životu."</p>
        <p style="color:#D4AF37;font-size:13px;margin:0;">— Luka M., programer, Split ⭐⭐⭐⭐⭐</p>
      </div>
      <p><strong style="color:#fff;">Spavati mirno</strong> — to je vrijednost hitnog fonda. I ona nema cijenu.</p>
      ${softCta}
      ${sig}`,

    // Dan 85 — Sales (nekupci)
    52: () => `
      <h2>85 dana. Jedan korak te dijeli od promjene.</h2>
      <p>Dragi/a ${n},</p>
      <p>Prošlo je 85 dana otkako si preuzeo/la vodič.</p>
      <p>I znam da te tema zanima — jer i dalje čitaš.</p>
      <p>Samo jedno pitanje: <strong style="color:#fff;">što čekaš?</strong></p>
      <div class="box">
        <p style="margin:0 0 8px;">Polaznici koji su krenuli s tobom — već su na Fazi 3 programa.</p>
        <p style="margin:0 0 8px;">Već su pronašli 200-400 € miesečnog "curenja".</p>
        <p style="margin:0;">Već su postavili automatsku štednju. Neki su počeli investirati.</p>
      </div>
      <p>Kod <strong style="color:#D4AF37;font-family:monospace;">PRILIKA</strong> i dalje vrijedi. I garancija povrata je tu ako ne budeš zadovoljan/na.</p>
      ${offerBox()}
      ${sig}`,

    // Dan 87 — Nekretnine (edu, svima)
    53: () => `
      <h2>Investiranje u nekretnine — mit ili stvarnost u 2026.</h2>
      <p>Dragi/a ${n},</p>
      <p>Nekretnine su mit broj 1 u regiji: "Sigurna investicija, uvijek raste."</p>
      <p>Istina je kompleksnija.</p>
      <div class="box">
        <p style="color:#22c55e;font-weight:700;margin:0 0 6px;">✅ Nekretnine JESU dobra investicija kad:</p>
        <p style="margin:0 0 12px;font-size:14px;">Nema hipoteke (ili je mala), tržišna zakupnina pokriva troškove, ne trebate taj kapital drugdje, tržište raste.</p>
        <p style="color:#ef4444;font-weight:700;margin:0 0 6px;">❌ Nekretnine NISU dobra investicija kad:</p>
        <p style="margin:0;font-size:14px;">Uzimate visoku hipoteku, kupujete na vrhuncu tržišta, treba ti taj kapital, nemate drugog fonda za hitne situacije.</p>
      </div>
      <p>Nekretnine su jedan alat — ne jedini. Pametni investitori imaju diverzificirane portfelje.</p>
      ${softCta}
      ${sig}`,

    // Dan 89 — Crypto (edu, svima)
    54: () => `
      <h2>Crypto — istina bez hype-a i bez laži</h2>
      <p>Dragi/a ${n},</p>
      <p>Crypto je tema koja dijeli ljude: jedni kažu "budućnost", drugi "prijevara". Istina je negdje između.</p>
      <div class="box">
        <p style="color:#D4AF37;font-weight:700;margin:0 0 10px;">Što o cryptu trebate znati kao početnik:</p>
        <p style="margin:0 0 8px;">→ <strong style="color:#fff;">Volatilnost je ekstremna</strong> — Bitcoin je izgubio 80%+ vrijednosti nekoliko puta</p>
        <p style="margin:0 0 8px;">→ <strong style="color:#fff;">Tehnologija je realna</strong> — blockchain ima legitimne primjene</p>
        <p style="margin:0 0 8px;">→ <strong style="color:#fff;">Spekulacija vs investicija</strong> — crypto je trenutno bliže spekulaciji</p>
        <p style="margin:0;">→ <strong style="color:#fff;">Pravilo:</strong> nikad ne ulažete više od onoga što si možete priuštiti izgubiti u potpunosti</p>
      </div>
      <p>Ako baš hoćeš crypto — max 5% portfelja. Sve ostalo u diversificirane, dokazane instrumente.</p>
      ${softCta}
      ${sig}`,

    // Dan 91 — 3 mieseca polaznici (sales, nekupci)
    55: () => `
      <h2>Tri mieseca. Evo gdje su polaznici koji su počeli s tobom.</h2>
      <p>Dragi/a ${n},</p>
      <p>90 dana programa. Polaznici koji su počeli kad i ti — završili su transformaciju.</p>
      <div class="box">
        <p style="color:#D4AF37;font-weight:700;margin:0 0 10px;">Što je prosječni polaznik postigao u 90 dana:</p>
        <p style="margin:0 0 6px;">✅ Pronašao/la 200-400 € miesečnog "curenja"</p>
        <p style="margin:0 0 6px;">✅ Izgradio/la hitni fond od 1.000-3.000 €</p>
        <p style="margin:0 0 6px;">✅ Smanjio/la dug za 20-40%</p>
        <p style="margin:0;">✅ Napravio/la prve investicije</p>
      </div>
      <p>Ti si za 3 mieseca mogao/la biti ovdje. Još uvijek možeš — samo 3 mieseca od sada.</p>
      ${offerBox()}
      ${sig}`,

    // Dan 93 — Financijski ciljevi (edu, svima)
    56: () => `
      <h2>Financijski ciljevi — kako ih postaviti da ih stvarno postigneš</h2>
      <p>Dragi/a ${n},</p>
      <p>"Želim štedjeti više." — nije cilj. To je želja.</p>
      <div class="box">
        <p style="color:#D4AF37;font-weight:700;margin:0 0 10px;">SMART financijski cilj (primjer):</p>
        <p style="margin:0 0 6px;">❌ "Želim štedjeti više novca."</p>
        <p style="margin:0 0 12px;color:#22c55e;">✅ "Do 31. prosinca 2026., imam 3.000 € na štednom računu — automatskim uplatama od 250 € svaki 1. u miesecu."</p>
        <p style="color:#D4AF37;font-weight:700;margin:0 0 8px;">SMART znači:</p>
        <p style="margin:0 0 4px;font-size:14px;"><strong>S</strong>pecifičan · <strong>M</strong>jerljiv · <strong>A</strong>mbiciozan ali dostižan · <strong>R</strong>elevantan · <strong>T</strong>imski određen</p>
      </div>
      <p>Napiši 3 SMART financijska cilja sada. Odmah. Dok čitaš ovo.</p>
      <p>Zapisani ciljevi imaju 42% veću vjerojatnost ostvarenja. Nije mistika — to je psihologija.</p>
      ${softCta}
      ${sig}`,

    // Dan 95 — Maja social proof (svima)
    57: () => `
      <h2>Maja je s 250 € počela — danas ima 12.000 € u fondovima</h2>
      <p>Dragi/a ${n},</p>
      <p>Maja, administrativna radnica iz Skoplja, smatrala je da nema dovoljno novca za investiranje.</p>
      <p>Plaća ispod prosjeka. Dvoje djece. Stambeni kredit.</p>
      <div class="box">
        <p style="font-style:italic;color:#fff;margin:0 0 12px;">"Mislila sam da investiranje nije za mene. Brane mi je pokazao da i s 50 € miesečno možeš početi. Počela sam s 250 € jednokratno i 80 € miesečno. Za 6 godina — portfelj je na 12.000 €. Moje kćerke imat će bolji početak nego što sam ja imala."</p>
        <p style="color:#D4AF37;font-size:13px;margin:0;">— Maja S., Skoplje ⭐⭐⭐⭐⭐</p>
      </div>
      <p>Maja nije čekala više prihode. Nije čekala "bolji trenutak". <strong style="color:#fff;">Počela je s onim što je imala.</strong></p>
      ${softCta}
      ${sig}`,

    // Dan 97 — Kad ćeš početi (sales, nekupci)
    58: () => `
      <h2>Kad ćeš početi? Jedno pitanje koje mijenja sve.</h2>
      <p>Dragi/a ${n},</p>
      <p>Imam jedno jedino pitanje za tebe danas.</p>
      <div class="box" style="text-align:center;">
        <p style="font-size:22px;font-weight:700;color:#D4AF37;margin:0;">"Ako ne sad — kad?"</p>
      </div>
      <p>Nije retoričko. Ozbiljno — kad?</p>
      <p>Kad dobiješ povišicu? Kad otplatiš ovaj kredit? Kad djeca odrastu? Kad se smire okolnosti?</p>
      <p>Te okolnosti se ne smiruju. Uvijek se nešto pojavljuje. Uvijek će biti razlog za čekanje.</p>
      <p><strong style="color:#fff;">Ili — počneš danas, s onim što imaš, tamo gdje si.</strong></p>
      ${offerBox()}
      ${sig}`,

    // Dan 99 — Newsletter (svima)
    59: () => `
      <h2>💡 FinCoach Insights: Globalna ekonomija i tvoj džep</h2>
      <p>Dragi/a ${n},</p>
      <p>Kratki financijski update koji je relevantan za svakoga:</p>
      <div class="box">
        <p style="color:#D4AF37;font-weight:700;margin:0 0 10px;">Što prati svaki pametan ulagač:</p>
        <p style="margin:0 0 8px;">📊 <strong style="color:#fff;">Kamatne stope ECB-a</strong> — utječu na sve kredite i štednju u eurozoni</p>
        <p style="margin:0 0 8px;">📊 <strong style="color:#fff;">Inflacija u regiji</strong> — koliko tvoja ušteđevina gubi vrijednosti</p>
        <p style="margin:0 0 8px;">📊 <strong style="color:#fff;">Globalni dionički indeksi</strong> — S&P 500 i MSCI World kao barometri</p>
        <p style="margin:0;">📊 <strong style="color:#fff;">Tečajevi valuta</strong> — važno za sve koji štede u stranim valutama</p>
      </div>
      <p>Ne trebaš biti ekonomist. Ali trebaš razumjeti kakav utjecaj ovi faktori imaju na tvoj novac.</p>
      <p>To učimo u programu — bez žargona, bez kompleksnosti.</p>
      ${softCta}
      ${sig}`,

    // Dan 101 — 5 knjiga (edu, svima)
    60: () => `
      <h2>5 knjiga koje su promijenile moj odnos prema novcu</h2>
      <p>Dragi/a ${n},</p>
      <div class="box">
        <p style="margin:0 0 10px;">📚 <strong style="color:#fff;">Rich Dad Poor Dad</strong> — Robert Kiyosaki<br><span style="font-size:13px;color:#718096;">Temeljna promjena perspektive: aktiva vs pasiva. Obavezno čitanje.</span></p>
        <p style="margin:0 0 10px;">📚 <strong style="color:#fff;">The Psychology of Money</strong> — Morgan Housel<br><span style="font-size:13px;color:#718096;">Zašto naše ponašanje s novcem nije racionalno — i što s tim.</span></p>
        <p style="margin:0 0 10px;">📚 <strong style="color:#fff;">I Will Teach You to Be Rich</strong> — Ramit Sethi<br><span style="font-size:13px;color:#718096;">Praktičan, bez moraliziranja. Sustavi koji rade.</span></p>
        <p style="margin:0 0 10px;">📚 <strong style="color:#fff;">The Millionaire Next Door</strong> — Stanley & Danko<br><span style="font-size:13px;color:#718096;">Tko su zaista bogati — i zašto ih ne prepoznaješ.</span></p>
        <p style="margin:0;">📚 <strong style="color:#fff;">Die With Zero</strong> — Bill Perkins<br><span style="font-size:13px;color:#718096;">Kako balansirati između štednje i življenja. Provokativno i vrijedno.</span></p>
      </div>
      <p>Jedna knjiga miesečno. Za 5 mieseci — imat ćeš temelje koje većina odraslih nikad ne izgradi.</p>
      ${softCta}
      ${sig}`,

    // Dan 103 — 100 dana (sales, nekupci)
    61: () => `
      <h2>100 dana je prošlo. Samo ti nedostaješ.</h2>
      <p>Dragi/a ${n},</p>
      <p>100 dana. Sto emailova nisam ti poslao/la — ali sto dana je svejedno prošlo.</p>
      <p>I ti si i dalje ovdje. Čitaš. Znatiželjan/na si.</p>
      <p>A to mi govori jedno: <strong style="color:#fff;">dio tebe zna da je promjena moguća.</strong></p>
      <div class="box">
        <p style="margin:0 0 8px;">Recite mi — odgovorite na ovaj email — što vas koči?</p>
        <p style="margin:0;">Čitam svaki odgovor. Osobno odgovaram. Ozbiljno.</p>
      </div>
      <p>I ako ste spreman/na — kod <strong style="color:#D4AF37;font-family:monospace;">PRILIKA</strong> i dalje vrijedi.</p>
      ${offerBox()}
      ${sig}`,

    // Dan 105 — Porezi (edu, svima)
    62: () => `
      <h2>Porezna optimizacija — legalno zadrži više svog novca</h2>
      <p>Dragi/a ${n},</p>
      <p>Plaćamo poreze — to je zakonska obveza. Ali plaćati VIŠE poreza nego što moraš — to nije.</p>
      <div class="box">
        <p style="color:#D4AF37;font-weight:700;margin:0 0 10px;">Legalni načini smanjenja porezne obveze:</p>
        <p style="margin:0 0 8px;">🏠 <strong style="color:#fff;">Odbitak stambenog kredita</strong> — kamate na stambeni kredit često su porezno odbitne</p>
        <p style="margin:0 0 8px;">🎓 <strong style="color:#fff;">Obrazovanje</strong> — troškovi obrazovanja za posao mogu biti odbitni</p>
        <p style="margin:0 0 8px;">💙 <strong style="color:#fff;">Donacije</strong> — priznatim organizacijama, do određenog iznosa</p>
        <p style="margin:0;">👶 <strong style="color:#fff;">Olakšice za djecu</strong> — provjeri aktualne olakšice u svojoj zemlji</p>
      </div>
      <p>Napomena: porezni zakoni razlikuju se po zemljama (HR, SLO, BIH, SRB...). Uvijek konzultiraj lokalnog poreznog savjetnika.</p>
      ${softCta}
      ${sig}`,

    // Dan 107 — Nikola social proof (svima)
    63: () => `
      <h2>Nikola je za 6 mieseci eliminirao sve dugove</h2>
      <p>Dragi/a ${n},</p>
      <p>Nikola, vozač kamiona iz Beograda, imao je 4 različita duga ukupno 11.000 €. Na pitanje kako izaći — nije imao odgovor.</p>
      <div class="box">
        <p style="font-style:italic;color:#fff;margin:0 0 12px;">"Brane mi je pokazao metodu lavine dugova. Složio sam ih po kamatnoj stopi, zadnji euro prihoda koji preostane — ide na prvi dug. Kad ga eliminiram, prebacim taj iznos na drugi. Snowball. Za 6 mieseci — svih 11.000 € eliminirano. Nije čudo. Matematika."</p>
        <p style="color:#D4AF37;font-size:13px;margin:0;">— Nikola P., Beograd ⭐⭐⭐⭐⭐</p>
      </div>
      <p>Nije magija. Nije sreća. <strong style="color:#fff;">Matematika + sustav + dosljednost = sloboda.</strong></p>
      ${softCta}
      ${sig}`,

    // Dan 109 — PRILIKA (sales, nekupci)
    64: () => `
      <h2>PRILIKA — ponuda koja ne ističe</h2>
      <p>Dragi/a ${n},</p>
      <p>Nema lažnih rokova. Nema countdown timera koji se resetira svaki put kad učitaš stranicu.</p>
      <p>Samo činjenica: kod <strong style="color:#D4AF37;font-family:monospace;">PRILIKA</strong> daje ti pristup programu za 197 € umjesto 397 €. Trajno. Za čitatelje vodiča.</p>
      <div class="box">
        <p style="color:#D4AF37;font-weight:700;margin:0 0 10px;">Recapitulacija — što dobivaš:</p>
        <p style="margin:0 0 6px;">✅ 90 video lekcija · 3 faze · 90 dana transformacije</p>
        <p style="margin:0 0 6px;">✅ Excel predlošci i radni listovi</p>
        <p style="margin:0 0 6px;">✅ Certifikat završetka</p>
        <p style="margin:0 0 6px;">✅ Doživotni pristup + nadogradnje</p>
        <p style="margin:0;">✅ 30-dnevna garancija povrata</p>
      </div>
      ${offerBox()}
      ${sig}`,

    // Dan 111 — Zlatna pravila (edu, svima)
    65: () => `
      <h2>Zlatna pravila ulaganja koja vrijede u svakoj krizi</h2>
      <p>Dragi/a ${n},</p>
      <p>Tržišta padaju. Ekonomije ulaze u recesije. Krize dolaze — to je jedino sigurno.</p>
      <p>Ova 4 pravila štite te uvijek:</p>
      <div class="box">
        <p style="margin:0 0 10px;">🥇 <strong style="color:#fff;">Diversificiraj</strong> — nikad sve u jednu investiciju, jednu klasu imovine, jednu valutu</p>
        <p style="margin:0 0 10px;">🥈 <strong style="color:#fff;">Investiraj dugoročno</strong> — kratkoročni padovi su buka. Dugoročni trend globalnih tržišta: gore.</p>
        <p style="margin:0 0 10px;">🥉 <strong style="color:#fff;">Ne paničari</strong> — prodati na dnu je najveća investicijska greška. Krize su prilike za kupnju.</p>
        <p style="margin:0;">🏅 <strong style="color:#fff;">Investiraj redovito</strong> — bez obzira na tržišno raspoloženje. DCA (Dollar Cost Averaging) strategija.</p>
      </div>
      <p>Ova pravila nisu glamurozna. Ali stvaraju bogatstvo — konzistentno, godinu za godinom.</p>
      ${softCta}
      ${sig}`,

    // Dan 113 — Životno osiguranje (edu, svima)
    66: () => `
      <h2>Životno osiguranje — što stvarno trebaš (i što ne)</h2>
      <p>Dragi/a ${n},</p>
      <p>Životno osiguranje jedna je od najzlouporabljivanijih financijskih tema — od strane prodavača koji rade na proviziji.</p>
      <div class="box">
        <p style="color:#22c55e;font-weight:700;margin:0 0 6px;">✅ TREBATE životno osiguranje ako:</p>
        <p style="margin:0 0 12px;font-size:14px;">Imate osobe koje financijski ovise o vama (djeca, supružnik). Preporuka: term insurance (oročeno), ne whole life.</p>
        <p style="color:#ef4444;font-weight:700;margin:0 0 6px;">❌ NE TREBATE životno osiguranje kao investiciju:</p>
        <p style="margin:0;font-size:14px;">Unit-linked proizvodi, mješovita osiguranja, "endowment" police — naknade su visoke, prinosi niski. Investirajte odvojeno.</p>
      </div>
      <p>Pravilo: osiguranje je zaštita, ne investicija. Razdvoj te dvije stvari.</p>
      ${softCta}
      ${sig}`,

    // Dan 115 — Poruka polaznika (sales, nekupci)
    67: () => `
      <h2>Poruka od polaznika koja me je ganula</h2>
      <p>Dragi/a ${n},</p>
      <p>Prošli tjedan primio/la sam ovu poruku (objavljujem uz dopuštenje):</p>
      <div class="box">
        <p style="font-style:italic;color:#fff;margin:0 0 12px;">"Brane, juče sam svom 8-godišnjem sinu objašnjavao/la zašto se novac ne troši odmah. Koristio/la sam jezik koji sam naučio/la u tvom programu. I on je razumio. To je prava vrijednost ovog programa — mijenja kako razmišljamo, a ta promjena ide dalje od nas."</p>
        <p style="color:#D4AF37;font-size:13px;margin:0;">— Polaznik programa (ime čuvam privatnim)</p>
      </div>
      <p>Ovo je razlog zašto radim ovo. Ne radi brojeva — radi generacijske promjene.</p>
      <p>Želiš li biti dio toga?</p>
      ${offerBox()}
      ${sig}`,

    // Dan 117 — Mirovina (edu, svima)
    68: () => `
      <h2>Mirovina — misli 30 godina unaprijed (i počni danas)</h2>
      <p>Dragi/a ${n},</p>
      <p>Državna mirovina — u svim zemljama regije — neće biti dovoljna. To je matematička činjenica.</p>
      <div class="box">
        <p style="color:#D4AF37;font-weight:700;margin:0 0 10px;">Moć ranog početka (konkretna matematika):</p>
        <p style="margin:0 0 8px;">Počneš u 30 s 100 € miesečno, 7% prinos:</p>
        <p style="margin:0 0 12px;"><strong style="color:#fff;">U 65 godini: 284.000 €</strong></p>
        <p style="margin:0 0 8px;">Počneš u 40 s 100 € miesečno, isti prinos:</p>
        <p style="margin:0;"><strong style="color:#fff;">U 65 godini: 121.000 €</strong> — gotovo upola manje!</p>
      </div>
      <p>10 godina razlike = 163.000 € razlike u mirovini. Isti novac. Isti prinos. <strong style="color:#fff;">Samo raniji početak.</strong></p>
      <p>Kada god čitaš ovo — pravi trenutak za početi je sada.</p>
      ${softCta}
      ${sig}`,

    // Dan 119 — Tea social proof (svima)
    69: () => `
      <h2>Tea je u 35. počela planirati mirovinu — evo zašto se isplati</h2>
      <p>Dragi/a ${n},</p>
      <p>Tea, odvjetnica iz Zagreba, dolazila je s uvjerenjem da mirovinu "ne treba planirati još". Ima puno vremena.</p>
      <div class="box">
        <p style="font-style:italic;color:#fff;margin:0 0 12px;">"Brane mi je pokazao konkretnu matematiku. Ako počnem s 35 s 150 € miesečno vs. s 45 s 150 € miesečno — razlika u mirovini je 120.000 €. To je stan. Počela sam odmah. Sad spim mirno gledajući u budućnost."</p>
        <p style="color:#D4AF37;font-size:13px;margin:0;">— Tea V., odvjetnica, Zagreb ⭐⭐⭐⭐⭐</p>
      </div>
      <p>Nije o tome kad počneš planirati mirovinu. O tome je <strong style="color:#fff;">koliko ti taj odgod košta.</strong></p>
      ${softCta}
      ${sig}`,

    // Dan 121 — Danas je dan (sales, nekupci)
    70: () => `
      <h2>Danas je pravi dan. Sutra postaje jučer.</h2>
      <p>Dragi/a ${n},</p>
      <p>Kratko i jasno danas.</p>
      <div class="box" style="text-align:center;">
        <p style="font-size:19px;font-weight:700;color:#fff;margin:0 0 12px;">Svaki dan koji prođe bez akcije je dan koji ne možeš vratiti.</p>
        <p style="color:#D4AF37;font-weight:700;margin:0;">Svaki dan koji prođe S akcijom — gradi slobodu.</p>
      </div>
      <p>Kod <strong style="color:#D4AF37;font-family:monospace;">PRILIKA</strong>. 197 €. 30-dnevna garancija. Doživotni pristup.</p>
      <p>Napravi korak.</p>
      ${offerBox()}
      ${sig}`,

    // Dan 123 — Side hustle (edu, svima)
    71: () => `
      <h2>Side hustle — kako zaraditi extra 300-500 € bez napuštanja posla</h2>
      <p>Dragi/a ${n},</p>
      <p>Side hustle nije trend. To je alat — za ubrzavanje otplate dugova, izgradnju hitnog fonda, brže investiranje.</p>
      <div class="box">
        <p style="color:#D4AF37;font-weight:700;margin:0 0 10px;">5 side hustle ideja koje funkcioniraju u regiji:</p>
        <p style="margin:0 0 6px;">💻 <strong style="color:#fff;">Freelancing</strong> — prijevodi, dizajn, tekstovi, programiranje, konzultacije</p>
        <p style="margin:0 0 6px;">📚 <strong style="color:#fff;">Podučavanje</strong> — privatne lekcije, online tečajevi iz tvog ekspertnog područja</p>
        <p style="margin:0 0 6px;">🛒 <strong style="color:#fff;">Online prodaja</strong> — second-hand, vlastiti proizvodi, dropshipping</p>
        <p style="margin:0 0 6px;">📸 <strong style="color:#fff;">Kreativni sadržaj</strong> — fotografija, video, blog, newsletter</p>
        <p style="margin:0;">🚗 <strong style="color:#fff;">Usluge</strong> — vrtlarstvo, čišćenje, dostava, majstorski radovi</p>
      </div>
      <p>Ključ: <strong style="color:#fff;">extra prihod direktno na otplatu duga ili investicije</strong>. Ne za veću potrošnju.</p>
      ${softCta}
      ${sig}`,

    // Dan 125 — Novac u braku (edu, svima)
    72: () => `
      <h2>Novac u vezi i braku — kako da ne bude izvor sukoba</h2>
      <p>Dragi/a ${n},</p>
      <p>Novac je jedan od glavnih uzroka razvoda u regiji. A nije moralo biti tako.</p>
      <div class="box">
        <p style="color:#D4AF37;font-weight:700;margin:0 0 10px;">3 pravila za financijsku harmoniju u vezi:</p>
        <p style="margin:0 0 10px;">1️⃣ <strong style="color:#fff;">Transparentnost</strong> — oboje znate sve: prihode, dugove, ušteđevinu, investicije. Bez tajni.</p>
        <p style="margin:0 0 10px;">2️⃣ <strong style="color:#fff;">Zajednički ciljevi</strong> — uskladite prioritete. Stan? Putovanje? Djeca? Mirovina? Zajedno.</p>
        <p style="margin:0;">3️⃣ <strong style="color:#fff;">Osobni džeparac</strong> — svako ima mali iznos koji može trošiti bez objašnjavanja. Autonomija unutar zajedničkog plana.</p>
      </div>
      <p>Novac nije problem u vezama. <strong style="color:#fff;">Tajne i neoček ivani troškovi su problem.</strong></p>
      ${softCta}
      ${sig}`,

    // Dan 127 — 4 razloga (sales, nekupci)
    73: () => `
      <h2>4 razloga zašto se isplati upisati upravo sad</h2>
      <p>Dragi/a ${n},</p>
      <div class="box">
        <p style="margin:0 0 12px;">1️⃣ <strong style="color:#fff;">Složeni kamatni efekt radi od danas</strong><br><span style="font-size:14px;color:#cbd5e0;">Svaki dan odgode je dan koji složeni efekt ne radi za tebe.</span></p>
        <p style="margin:0 0 12px;">2️⃣ <strong style="color:#fff;">97 € je manje od jedne greške</strong><br><span style="font-size:14px;color:#cbd5e0;">Jedna impulzivna kupnja, jedan neplanirani kredit — košta više od cijelog programa.</span></p>
        <p style="margin:0 0 12px;">3️⃣ <strong style="color:#fff;">30-dnevna garancija eliminira rizik</strong><br><span style="font-size:14px;color:#cbd5e0;">Prvih 30 dana — bez rizika. Ako ne funkcionira, vraćam ti novac.</span></p>
        <p style="margin:0;">4️⃣ <strong style="color:#fff;">Sustav koji gradiš traje cijeli život</strong><br><span style="font-size:14px;color:#cbd5e0;">Ne kupuješ 90 dana lekcija. Kupuješ navike i sustav koji rade dok živiš.</span></p>
      </div>
      ${offerBox()}
      ${sig}`,

    // Dan 129 — Složeni kamatni efekt (edu, svima)
    74: () => `
      <h2>Složeni kamatni efekt — najmoćnija sila u osobnim financijama</h2>
      <p>Dragi/a ${n},</p>
      <p>Albert Einstein ga je navodno nazvao "osmim svjetskim čudom". Istinito ili ne — matematika iza toga je nepobitna.</p>
      <div class="box">
        <p style="color:#D4AF37;font-weight:700;margin:0 0 10px;">Kako složeni efekt radi ZA tebe:</p>
        <p style="margin:0 0 8px;">1.000 € na 7% godišnje:</p>
        <p style="margin:0 0 4px;font-size:14px;">→ Za 10 god: <strong style="color:#fff;">1.967 €</strong></p>
        <p style="margin:0 0 4px;font-size:14px;">→ Za 20 god: <strong style="color:#fff;">3.870 €</strong></p>
        <p style="margin:0 0 12px;font-size:14px;">→ Za 30 god: <strong style="color:#fff;">7.612 €</strong> — bez ijednog eura više!</p>
        <p style="color:#ef4444;font-weight:700;margin:0 0 8px;">Kako složeni efekt radi PROTIV tebe (dug):</p>
        <p style="margin:0;font-size:14px;">Isti princip, samo na kamate koje plaćaš. Zato dug s 20% kamate eksplodira ako ga ne eliminiuješ brzo.</p>
      </div>
      <p>Složeni efekt ne pita je li pravedan. On samo radi — u tvoju korist ili na tvoj trošak. Odaberi stranu.</p>
      ${softCta}
      ${sig}`,

    // Dan 131 — Goran social proof (svima)
    75: () => `
      <h2>Goran je s minusa prešao na prvu investiciju za 5 mieseci</h2>
      <p>Dragi/a ${n},</p>
      <p>Goran, konobar iz Dubrovnika, dolazio je s negativnim stanjem na računu. Minus 600 €. Svaki miesec — minus.</p>
      <div class="box">
        <p style="font-style:italic;color:#fff;margin:0 0 12px;">"Nisam mislio da je moguće. Minus na računu, bez ušteđevine, bez plana. Brane mi je pokazao korak po korak. Prihodi sezonski — ali sustav funkcionira i u toj situaciji. Za 5 mieseci: s minusa na nulu. Za 8 mieseci: 500 € hitnog fonda. Za godinu dana: prve 50 € u ETF fondovima."</p>
        <p style="color:#D4AF37;font-size:13px;margin:0;">— Goran R., Dubrovnik ⭐⭐⭐⭐⭐</p>
      </div>
      <p>S minusa na investicije. <strong style="color:#fff;">Za godinu dana. Isti prihodi. Drugačiji sustav.</strong></p>
      ${softCta}
      ${sig}`,

    // Dan 133 — Posljednji poziv (sales, nekupci)
    76: () => `
      <h2>Sutra postaje jučer — posljednji poziv</h2>
      <p>Dragi/a ${n},</p>
      <p>Dugo te pratim. Cijenim tvoju pažnju.</p>
      <p>I otvoren/na ću biti: ne znam hoću li uvijek slati emailove. Newsletteri se mijenjaju, fokusi se mijenjaju.</p>
      <p>Ali ono što ostaje — to je matematika složenog efekta. I ona ne čeka.</p>
      <div class="box">
        <p style="text-align:center;margin:0;">
          <span style="font-size:40px;font-weight:900;color:#D4AF37;">197 €</span><br>
          <span style="color:#718096;font-size:13px;">Kod PRILIKA · Doživotni pristup · 30-dnevna garancija</span>
        </p>
      </div>
      <div style="text-align:center;margin:20px 0;"><a href="${SITE_URL}/volim-svoj-novac" class="btn">Da — krećem s promjenom →</a></div>
      ${sig}`,

    // Dan 135 — 10 navika (edu, svima)
    77: () => `
      <h2>10 navika financijski slobodnih ljudi (provjeri se)</h2>
      <p>Dragi/a ${n},</p>
      <div class="box">
        <p style="margin:0 0 6px;">✅ Žive ispod svojih mogućnosti</p>
        <p style="margin:0 0 6px;">✅ Automatski štede — prvi, ne zadnji</p>
        <p style="margin:0 0 6px;">✅ Imaju pisane financijske ciljeve</p>
        <p style="margin:0 0 6px;">✅ Redovito prate troškove</p>
        <p style="margin:0 0 6px;">✅ Investiraju konzistentno, bez obzira na tržišne uvjete</p>
        <p style="margin:0 0 6px;">✅ Ne kupuju status — kupuju slobodu</p>
        <p style="margin:0 0 6px;">✅ Neprestano uče o financijama</p>
        <p style="margin:0 0 6px;">✅ Imaju više izvora prihoda</p>
        <p style="margin:0 0 6px;">✅ Čitaju financijske izvještaje i znaju gdje im novac "radi"</p>
        <p style="margin:0;">✅ Okruženi su ljudima s istim vrijednostima</p>
      </div>
      <p>Koliko od ovih 10 možeš zaokružiti? Svaka koju ne možeš — to je priložnost za rast.</p>
      ${softCta}
      ${sig}`,

    // Dan 137 — Robert social proof (svima)
    78: () => `
      <h2>Robert je kupio stan u 29. godini — bez nasljedstva</h2>
      <p>Dragi/a ${n},</p>
      <p>Robert, fizioterapeut iz Beograda, postavio si je cilj koji se svima činio nerealan: kupiti stan do 30. godine, bez roditeljske pomoći.</p>
      <div class="box">
        <p style="font-style:italic;color:#fff;margin:0 0 12px;">"Svi su me gledali kao da sam lud. Plaća ispod prosjeka, visoki stanovi u Beogradu. Ali postavio sam sustav: 35% prihoda odmah na odvojen račun za stan. Smanjio troškove, uzeo side hustle vikendom. Za 4 godine — 18.000 € za predujam. Danas imam stan. U 29. godini."</p>
        <p style="color:#D4AF37;font-size:13px;margin:0;">— Robert M., Beograd ⭐⭐⭐⭐⭐</p>
      </div>
      <p>Nije sreća. Nije nasljedstvo. <strong style="color:#fff;">Sustav + cilj + dosljednost = rezultat.</strong></p>
      ${softCta}
      ${sig}`,

    // Dan 139 — Osobna garancija (sales, nekupci)
    79: () => `
      <h2>Moja osobna garancija — ovo nisam nikad rekao javno</h2>
      <p>Dragi/a ${n},</p>
      <p>Postoji formalna 30-dnevna garancija povrata. Ali danas ti dajem nešto više:</p>
      <div class="box" style="border-color:#D4AF37;">
        <p style="color:#D4AF37;font-weight:800;font-size:16px;margin:0 0 12px;text-align:center;">Moja osobna obaveza:</p>
        <p style="margin:0 0 8px;">Prođeš program. Primijenjiš sustav koji naučiš. I ne vidiš <strong style="color:#fff;">konkretnu financijsku promjenu u prvom miesecu</strong> —</p>
        <p style="margin:0;">Vraćam ti novac. I izvinjavam se osobno. Jer to bi značilo da sam ja negdje pogriješio/la.</p>
      </div>
      <p>To je koliko vjerujem u ovaj program. Jer vidim rezultate polaznika svaki tjedan.</p>
      ${offerBox()}
      ${sig}`,

    // Dan 141 — Diverzifikacija (edu, svima)
    80: () => `
      <h2>Diverzifikacija portfelja — kako ne staviti sva jaja u jednu košaru</h2>
      <p>Dragi/a ${n},</p>
      <p>Diverzifikacija je jedini "besplatni ručak" u investiranju — kaže Nobel-ovac Harry Markowitz.</p>
      <div class="box">
        <p style="color:#D4AF37;font-weight:700;margin:0 0 10px;">Što znači dobro diverzificirati:</p>
        <p style="margin:0 0 8px;">🌍 <strong style="color:#fff;">Geografski</strong> — ne samo domaće tržište, nego globalno (MSCI World, S&P 500)</p>
        <p style="margin:0 0 8px;">📊 <strong style="color:#fff;">Po klasama imovine</strong> — dionice, obveznice, nekretnine (REIT), gotovina</p>
        <p style="margin:0 0 8px;">⏳ <strong style="color:#fff;">Vremenski</strong> — investiraj redovito (DCA), ne sve odjednom</p>
        <p style="margin:0;">💰 <strong style="color:#fff;">Po valutama</strong> — eurima, dolarima, eventualno CHF za stabilnost</p>
      </div>
      <p>Jedan pad ne ruinira dobro diversificiran portfelj. To je cijela poanta.</p>
      ${softCta}
      ${sig}`,

    // Dan 143 — Maja i Ivan (svima)
    81: () => `
      <h2>Maja i Ivan — par koji je zajedno izgradio slobodu</h2>
      <p>Dragi/a ${n},</p>
      <p>Maja i Ivan, bračni par iz Sarajeva, imali su isti problem koji muči mnoge parove: svako je imalo drugačiji odnos prema novcu. Maja štedljiva, Ivan trošač. Konstantni sukobi.</p>
      <div class="box">
        <p style="font-style:italic;color:#fff;margin:0 0 12px;">"Program smo prošli zajedno. Zajedno smo napravili financijski audit, zajedno postavili ciljeve, zajedno odlučili kako alocirati prihode. Novac je prestao biti uzrok sukoba — postao je naš zajednički projekt. Za 2 godine: otplaćen auto kredit, hitni fond od 8.000 €, počeli investirati."</p>
        <p style="color:#D4AF37;font-size:13px;margin:0;">— Maja i Ivan K., Sarajevo ⭐⭐⭐⭐⭐</p>
      </div>
      <p>Financijska sloboda je ljepša kad je dijeliš. 💛</p>
      ${softCta}
      ${sig}`,

    // Dan 145 — 145 dana (sales, nekupci)
    82: () => `
      <h2>145 dana razmišljaš o ovome. Jedno pitanje.</h2>
      <p>Dragi/a ${n},</p>
      <p>145 dana. Gotovo 5 mieseci otkako si pokazao/la interes.</p>
      <p>Jedna jedina stvar te dijeli od promjene — odluka.</p>
      <div class="box" style="text-align:center;">
        <p style="font-size:19px;color:#fff;font-weight:700;margin:0 0 8px;">Za 145 dana — gdje ćeš biti?</p>
        <p style="color:#718096;margin:0;">Na istom mjestu? Ili 145 dana bliže financijskoj slobodi?</p>
      </div>
      ${offerBox()}
      ${sig}`,

    // Dan 147 — Recesija (edu, svima)
    83: () => `
      <h2>Recesija dolazi? Kako se zaštititi (i zaraditi)</h2>
      <p>Dragi/a ${n},</p>
      <p>Recesija nije "ako" — nego "kada". Ekonomije ciklički osciliraju. To je normalno.</p>
      <div class="box">
        <p style="color:#D4AF37;font-weight:700;margin:0 0 10px;">Kako se pripremiti na recesiju:</p>
        <p style="margin:0 0 8px;">🛡️ <strong style="color:#fff;">Hitni fond 6+ mieseci</strong> — najvažnija zaštita u recesiji</p>
        <p style="margin:0 0 8px;">💳 <strong style="color:#fff;">Minimalni dug</strong> — u recesiji, manje dugova = manje ranjivosti</p>
        <p style="margin:0 0 8px;">📈 <strong style="color:#fff;">Nastavi investirati</strong> — recesije su popusti. Dionice su jeftinije. Nastavi DCA.</p>
        <p style="margin:0;">🎓 <strong style="color:#fff;">Ulagaj u sebe</strong> — vještine su jedina imovina koja ne devalvira</p>
      </div>
      <p>Financijski pripremljeni ljudi recesije prolaze mirno. Nepripremljeni — u krizi.</p>
      <p>Koji si ti?</p>
      ${softCta}
      ${sig}`,

    // Dan 149 — Newsletter (svima)
    84: () => `
      <h2>💡 FinCoach Insights: Financijski trendovi 2027.</h2>
      <p>Dragi/a ${n},</p>
      <div class="box">
        <p style="color:#D4AF37;font-weight:700;margin:0 0 10px;">Što nam donosi 2027. financijski:</p>
        <p style="margin:0 0 8px;">📊 <strong style="color:#fff;">Kamatne stope</strong> — ECB nastavlja normalizaciju. Krediti ostaju skuplji nego u 2020. Refinanciraj ako možeš.</p>
        <p style="margin:0 0 8px;">🏠 <strong style="color:#fff;">Nekretnine</strong> — stagnacija u većini gradova regije. Nije trenutak za spekulativnu kupnju.</p>
        <p style="margin:0 0 8px;">📈 <strong style="color:#fff;">Dionice</strong> — globalna tržišta i dalje dugoročno rastu. DCA strategija ostaje optimalna za prosječnog investitora.</p>
        <p style="margin:0;">💰 <strong style="color:#fff;">Inflacija</strong> — pada, ali ostaje iznad 2%. Novac u ladici i dalje gubi vrijednost.</p>
      </div>
      <p>Bez paničarenja. Bez spekulacija. Samo — nastavi s planom i sustav će raditi za tebe.</p>
      ${softCta}
      ${sig}`,

    // Dan 151 — Zadnja šansa (sales, nekupci)
    85: () => `
      <h2>Zadnja garantirana šansa — ovo je ozbiljno</h2>
      <p>Dragi/a ${n},</p>
      <p>Ne znam hoće li ovaj email doći narednog tjedna ili ne. Newsletteri se mijenjaju.</p>
      <p>Ali znam ovo: matematika složenog efekta ne čeka ni na koga.</p>
      <div class="box" style="border-color:#D4AF37;">
        <p style="color:#D4AF37;font-weight:800;font-size:15px;text-align:center;margin:0 0 12px;">Ono što je sigurno:</p>
        <p style="margin:0 0 6px;">✅ Program postoji i funkcionira</p>
        <p style="margin:0 0 6px;">✅ Kod PRILIKA daje ti 197 € umjesto 397 €</p>
        <p style="margin:0 0 6px;">✅ 30-dnevna garancija eliminira svaki rizik</p>
        <p style="margin:0;">✅ Složeni efekt počinje raditi prvog dana kad počneš</p>
      </div>
      ${offerBox()}
      ${sig}`,

    // Dan 153 — Godišnji pregled (edu, svima)
    86: () => `
      <h2>Godišnji financijski pregled — napravi ga odmah</h2>
      <p>Dragi/a ${n},</p>
      <p>Jednom godišnje — "financijski audit" cijele slike. Traje 2 sata, može promijeniti narednu godinu.</p>
      <div class="box">
        <p style="color:#D4AF37;font-weight:700;margin:0 0 10px;">Checklist godišnjeg pregleda:</p>
        <p style="margin:0 0 6px;">□ Ukupni prihodi ove godine vs. prošle</p>
        <p style="margin:0 0 6px;">□ Ukupni rashodi — kategorije, trendovi</p>
        <p style="margin:0 0 6px;">□ Stanje hitnog fonda</p>
        <p style="margin:0 0 6px;">□ Ukupan dug — manji ili veći nego lani?</p>
        <p style="margin:0 0 6px;">□ Stanje investicija i prinos</p>
        <p style="margin:0 0 6px;">□ Financijski ciljevi — postignuti / u tijeku / propušteni</p>
        <p style="margin:0;">□ Plan za sljedeću godinu — konkretno, s brojevima</p>
      </div>
      <p>Što ne mjerite — ne možete poboljšati. Izmjerite. Ove godine.</p>
      ${softCta}
      ${sig}`,

    // Dan 155 — Nasljedstvo (edu, svima)
    87: () => `
      <h2>Planiranje nasljedstva — nije samo za bogate</h2>
      <p>Dragi/a ${n},</p>
      <p>Neugodna tema. Ali važna — posebno ako imaš djecu, partnera, ili imovinu kojom brineš.</p>
      <div class="box">
        <p style="color:#D4AF37;font-weight:700;margin:0 0 10px;">Minimalni koraci koje svaki odrasli trebao/la napraviti:</p>
        <p style="margin:0 0 8px;">📝 <strong style="color:#fff;">Oporuka</strong> — čak i jednostavna. Bez nje, zakon odlučuje umjesto tebe.</p>
        <p style="margin:0 0 8px;">📋 <strong style="color:#fff;">Popis imovine i dugova</strong> — tvoja obitelj treba znati što postoji</p>
        <p style="margin:0 0 8px;">🔑 <strong style="color:#fff;">Lozinke i pristup</strong> — bankovni računi, investicije, osiguranja</p>
        <p style="margin:0;">💬 <strong style="color:#fff;">Razgovor s obitelji</strong> — tvoje želje, jasno komunicirane</p>
      </div>
      <p>Ovo nije morbidno. Ovo je <strong style="color:#fff;">odgovorno</strong>. Svakog od nas čeka isti kraj — razlikujemo se po tome jesmo li se pripremili.</p>
      ${softCta}
      ${sig}`,

    // Dan 157 — Ako ne sad (sales, nekupci)
    88: () => `
      <h2>Ako ne sad — kad? (Iskreno pitanje)</h2>
      <p>Dragi/a ${n},</p>
      <p>Pratim te dugo. Čitaš, razmišljaš — i tu staneš.</p>
      <p>Imam jedno iskreno pitanje za tebe, i molim te da ga ozbiljno razmotriš:</p>
      <div class="box" style="text-align:center;">
        <p style="font-size:20px;font-weight:700;color:#D4AF37;margin:0;">"Kada odlučiš postati osoba koja vlada svojim novcem — a ne osoba kojom vlada novac?"</p>
      </div>
      <p>Ne osuđujem. Razumijem. Promjena je teška.</p>
      <p>Ali znam i ovo: <strong style="color:#fff;">jedina stvar koja se nije promijenila u 157 dana — je tvoja financijska situacija.</strong></p>
      <p>Spreman/na promijeniti to?</p>
      ${offerBox()}
      ${sig}`,

    // Dan 159 — Zdravlje i novac (edu, svima)
    89: () => `
      <h2>Zdravlje = bogatstvo — veza koju financijska industrija ignorira</h2>
      <p>Dragi/a ${n},</p>
      <p>Ovo nije motivacijska poruka. To je financijska matematika.</p>
      <div class="box">
        <p style="color:#D4AF37;font-weight:700;margin:0 0 10px;">Zašto zdravlje je financijska strategija:</p>
        <p style="margin:0 0 8px;">💊 <strong style="color:#fff;">Troškovi liječenja</strong> — kronične bolesti koštaju tisuće godišnje. Prevencija košta daleko manje.</p>
        <p style="margin:0 0 8px;">🏃 <strong style="color:#fff;">Produktivnost</strong> — zdravi ljudi zarađuju više. Studije pokazuju direktnu korelaciju.</p>
        <p style="margin:0 0 8px;">🧠 <strong style="color:#fff;">Mentalno zdravlje</strong> — financijski stres je glavni uzrok mentalnih problema. Rješavanjem financija rješavaš i mentalno zdravlje.</p>
        <p style="margin:0;">⏳ <strong style="color:#fff;">Radni vijek</strong> — zdravi ljudi rade dulje, biraju kada se povući, ne moraju.</p>
      </div>
      <p>Investicija u zdravlje je jedna od najvišeg ROI-a financijskih odluka koje možeš napraviti.</p>
      ${softCta}
      ${sig}`,

    // Dan 161 — Newsletter (svima)
    90: () => `
      <h2>💡 FinCoach Insights: Do kraja godine — gdje stojiš financijski?</h2>
      <p>Dragi/a ${n},</p>
      <p>Kraj godine je idealan trenutak za kratki financijski "check-up". Pet pitanja koja postavite sebi:</p>
      <div class="box">
        <p style="margin:0 0 8px;">1️⃣ Imam li hitni fond od minimalno 3 mieseca troškova?</p>
        <p style="margin:0 0 8px;">2️⃣ Smanjiuh li dug ove godine?</p>
        <p style="margin:0 0 8px;">3️⃣ Štedjeh li automatski svaki miesec?</p>
        <p style="margin:0 0 8px;">4️⃣ Počeh li ili nastavio/la investirati?</p>
        <p style="margin:0;">5️⃣ Imam li jasan plan za sljedeću godinu?</p>
      </div>
      <p>Ako si na svako odgovorio/la "da" — čestitam. Ideš dobrim putem.</p>
      <p>Ako nisi — svaki "ne" je priložnost. I svaka priložnost počinje jednom odlukom.</p>
      ${softCta}
      ${sig}`,

    // Dan 163 — Zadnja poruka (sales, nekupci)
    91: () => `
      <h2>Moja zadnja poruka o ovoj temi — pročitaj do kraja</h2>
      <p>Dragi/a ${n},</p>
      <p>Ovo je moja zadnja prodajna poruka. Obećavam.</p>
      <p>Slat ću ti i dalje edukativne emailove — jer financijska edukacija je besplatna i korisna svima.</p>
      <p>Ali neću te više pozivati na program. Jer — ili si spreman/na ili nisi. I oboje je u redu.</p>
      <div class="box">
        <p style="color:#D4AF37;font-weight:700;margin:0 0 10px;">Ako jesi spreman/na — ovo su tvoji podaci:</p>
        <p style="margin:0 0 6px;">💻 <strong style="color:#fff;">Stranica:</strong> fincoach.vip/volim-svoj-novac</p>
        <p style="margin:0 0 6px;">🏷️ <strong style="color:#fff;">Kod:</strong> PRILIKA</p>
        <p style="margin:0 0 6px;">💰 <strong style="color:#fff;">Cijena:</strong> 197 € (umjesto 397 €)</p>
        <p style="margin:0;">🛡️ <strong style="color:#fff;">Garancija:</strong> 30 dana, bez pitanja</p>
      </div>
      <p>Hvala ti na pažnji. Hvala na povjerenju. Bez obzira na tvoju odluku — vrijedno si proveo/la ovo vrijema.</p>
      <div style="text-align:center;margin:20px 0;"><a href="${SITE_URL}/volim-svoj-novac" class="btn">Upiši se — zadnji put nudim →</a></div>
      ${sig}`,

    // Dan 165 — Valutni rizik (edu, svima)
    92: () => `
      <h2>Valutni rizik — kako zaštititi ušteđevinu</h2>
      <p>Dragi/a ${n},</p>
      <p>Živiš u zemlji s lokalnom valutom (kuna, dinar, marka...) ali štediš u eurima? Pametno. Ali ima i tu zamki.</p>
      <div class="box">
        <p style="color:#D4AF37;font-weight:700;margin:0 0 10px;">Valutni rizik — konkretno:</p>
        <p style="margin:0 0 8px;">→ Štediš u eurima, trošiš u kunama/dinarima — devalvacija lokalne valute je tvoj prijatelj</p>
        <p style="margin:0 0 8px;">→ Uzmeš kredit u eurima, zaradjuješ u lokalnoj valuti — devalvacija te uništava</p>
        <p style="margin:0;">→ Diversifikacija valuta: EUR, eventualno USD, CHF — smanjuje izloženost</p>
      </div>
      <p>Pravilo: <strong style="color:#fff;">štedi i investiraj u valuti u kojoj su ti prihodi, ili u eurima.</strong> Izbjegavaj dug u stranoj valuti ako prihode imaš u lokalnoj.</p>
      ${softCta}
      ${sig}`,

    // Dan 167 — Newsletter završni (svima)
    93: () => `
      <h2>💡 FinCoach Insights: Nova godina — financijski plan od nule</h2>
      <p>Dragi/a ${n},</p>
      <p>Nova godina. Nova priložnost za bolju financijsku realnost.</p>
      <p>Bez obzira jesi li prošle godine ostvario/la sve ciljeve ili nisi — ovo je tvoj plan od 6 koraka za narednih 12 mieseci:</p>
      <div class="box">
        <p style="margin:0 0 6px;">1️⃣ <strong style="color:#fff;">Financijski audit</strong> — gdje si sada (broj, crno na bijelo)</p>
        <p style="margin:0 0 6px;">2️⃣ <strong style="color:#fff;">Postavi 3 SMART cilja</strong> — specifična, mjerljiva, s rokovima</p>
        <p style="margin:0 0 6px;">3️⃣ <strong style="color:#fff;">Postavi automatsku štednju</strong> — odmah, trajnim nalogom</p>
        <p style="margin:0 0 6px;">4️⃣ <strong style="color:#fff;">Plan eliminacije duga</strong> — lavina ili snježna gruda</p>
        <p style="margin:0 0 6px;">5️⃣ <strong style="color:#fff;">Počni/nastavi investirati</strong> — i 50 € miesečno je početak</p>
        <p style="margin:0;">6️⃣ <strong style="color:#fff;">Pratite napredak</strong> — miesečni check-in, 15 minuta</p>
      </div>
      <p>Ovo je sve što trebaš. Jednostavno — ali ne i lako.</p>
      <p>Želim ti godinu pune financijske slobode, sigurnosti i mira. Zaslužio/la si to. 🙏</p>
      ${sig}`,
  }

  const buildFn = cases[sequenceIndex]
  if (!buildFn) return null

  return {
    subject: seq.subject,
    html: emailBase(buildFn(), email),
  }
}
