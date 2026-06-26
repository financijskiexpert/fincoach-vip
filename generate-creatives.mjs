import { Resvg } from '@resvg/resvg-js'
import { readFileSync, writeFileSync, mkdirSync } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const fontsDir = path.join(__dirname, 'public', 'fonts')
const outDir = path.join(__dirname, 'public', 'creatives')
mkdirSync(outDir, { recursive: true })

const font400 = readFileSync(path.join(fontsDir, 'inter-400.woff2'))
const font700 = readFileSync(path.join(fontsDir, 'inter-700.woff2'))
const font900 = readFileSync(path.join(fontsDir, 'inter-900.woff2'))

// ── shared brand values ───────────────────────────────────────────────────────
const NAVY  = '#0D1B2A'
const GOLD  = '#D4AF37'
const WHITE = '#FFFFFF'
const MUTED = '#94A3B8'
const DIM   = '#475569'
const F     = 'Inter'

// ── logo SVG fragment ─────────────────────────────────────────────────────────
function logo(x, y, scale = 1) {
  const s = scale
  return `
  <g transform="translate(${x},${y}) scale(${s})">
    <path d="M44 8 L80 25 L80 62 Q80 86 44 98 Q8 86 8 62 L8 25 Z" fill="${GOLD}" opacity="0.08"/>
    <path d="M44 8 L80 25 L80 62 Q80 86 44 98 Q8 86 8 62 L8 25 Z" fill="none" stroke="${GOLD}" stroke-width="2"/>
    <path d="M44 18 L72 32 L72 62 Q72 80 44 90 Q16 80 16 62 L16 32 Z" fill="none" stroke="${GOLD}" stroke-width="0.6" opacity="0.35"/>
    <rect x="18" y="65" width="9" height="18" rx="1.5" fill="${GOLD}" opacity="0.38"/>
    <rect x="30" y="56" width="9" height="27" rx="1.5" fill="${GOLD}" opacity="0.58"/>
    <rect x="42" y="45" width="9" height="38" rx="1.5" fill="${GOLD}" opacity="0.78"/>
    <rect x="54" y="32" width="9" height="51" rx="1.5" fill="${GOLD}"/>
    <polyline points="19,63 31,54 43,43 55,30 66,20" fill="none" stroke="${WHITE}" stroke-width="2" stroke-linecap="round"/>
    <circle cx="66" cy="20" r="4.5" fill="${GOLD}"/>
    <circle cx="66" cy="20" r="2" fill="${WHITE}"/>
    <text x="100" y="52" font-family="${F}" font-size="28" font-weight="700" fill="${WHITE}" letter-spacing="1">FinCoach</text>
    <line x1="100" y1="60" x2="248" y2="60" stroke="${GOLD}" stroke-width="0.8" opacity="0.4"/>
    <ellipse cx="138" cy="78" rx="36" ry="13" fill="${GOLD}" opacity="0.10"/>
    <ellipse cx="138" cy="78" rx="36" ry="13" fill="none" stroke="${GOLD}" stroke-width="1.8"/>
    <text x="138" y="82" text-anchor="middle" font-family="${F}" font-size="11" font-weight="700" fill="${GOLD}" letter-spacing="5">VIP</text>
  </g>`
}

function divider(x1, y, x2, opacity = 0.2) {
  return `<line x1="${x1}" y1="${y}" x2="${x2}" y2="${y}" stroke="${GOLD}" stroke-width="1" opacity="${opacity}"/>`
}

// ── 1. IG Feed A — 1080×1080 ──────────────────────────────────────────────────
function igA() {
  return `<svg width="1080" height="1080" viewBox="0 0 1080 1080" xmlns="http://www.w3.org/2000/svg">
  <rect width="1080" height="1080" fill="${NAVY}"/>
  <rect x="0" y="0" width="8" height="1080" fill="${GOLD}"/>
  ${logo(80, 72)}
  <text x="80" y="310" font-family="${F}" font-size="92" fill="${WHITE}" font-weight="900">Za&#353;to na kraju</text>
  <text x="80" y="415" font-family="${F}" font-size="92" fill="${WHITE}" font-weight="900">svakog mjeseca</text>
  <text x="80" y="520" font-family="${F}" font-size="92" fill="${GOLD}" font-weight="900">nema dovoljno?</text>
  ${divider(80, 568, 1000)}
  <text x="80" y="630" font-family="${F}" font-size="46" fill="${MUTED}">Jer te nitko nije nau&#269;io &#353;to raditi s novcem.</text>
  <text x="80" y="692" font-family="${F}" font-size="52" fill="${WHITE}" font-weight="700">FinCoach VIP to mijenja.</text>
  ${divider(80, 730, 1000)}
  <text x="80" y="790" font-family="${F}" font-size="42" fill="${WHITE}">&#10003; Prona&#273;i gdje novac nestaje</text>
  <text x="80" y="850" font-family="${F}" font-size="42" fill="${WHITE}">&#10003; &#352;teduj automatski svaki mj.</text>
  <text x="80" y="910" font-family="${F}" font-size="42" fill="${WHITE}">&#10003; Investiraj bez straha</text>
  ${divider(80, 948, 1000)}
  <text x="80" y="1000" font-family="${F}" font-size="38" fill="${DIM}">90 dana · Link u biu &#128070;</text>
</svg>`
}

// ── 2. IG Feed B — 1080×1080 ──────────────────────────────────────────────────
function igB() {
  return `<svg width="1080" height="1080" viewBox="0 0 1080 1080" xmlns="http://www.w3.org/2000/svg">
  <rect width="1080" height="1080" fill="${NAVY}"/>
  <rect x="0" y="0" width="8" height="1080" fill="${GOLD}"/>
  ${logo(80, 72)}
  <circle cx="540" cy="480" r="280" fill="${GOLD}" opacity="0.04"/>
  <circle cx="540" cy="480" r="280" fill="none" stroke="${GOLD}" stroke-width="1" opacity="0.12"/>
  <circle cx="540" cy="480" r="200" fill="none" stroke="${GOLD}" stroke-width="0.5" opacity="0.08"/>
  <text x="540" y="390" text-anchor="middle" font-family="${F}" font-size="88" fill="${WHITE}" font-weight="900">Nitko te nije</text>
  <text x="540" y="490" text-anchor="middle" font-family="${F}" font-size="88" fill="${WHITE}" font-weight="900">nau&#269;io &#353;to raditi</text>
  <text x="540" y="600" text-anchor="middle" font-family="${F}" font-size="96" fill="${GOLD}" font-weight="900">s novcem.</text>
  ${divider(200, 660, 880)}
  <text x="540" y="730" text-anchor="middle" font-family="${F}" font-size="52" fill="${MUTED}">Mi jesmo.</text>
  <text x="540" y="830" text-anchor="middle" font-family="${F}" font-size="44" fill="${DIM}">Link u biu &#128070;</text>
</svg>`
}

// ── 3. Story A — 1080×1920 ────────────────────────────────────────────────────
function storyA() {
  return `<svg width="1080" height="1920" viewBox="0 0 1080 1920" xmlns="http://www.w3.org/2000/svg">
  <rect width="1080" height="1920" fill="${NAVY}"/>
  <rect x="0" y="0" width="8" height="1920" fill="${GOLD}"/>
  ${logo(80, 100)}
  <text x="80" y="480" font-family="${F}" font-size="100" fill="${WHITE}" font-weight="900">Za&#353;to na kraju</text>
  <text x="80" y="600" font-family="${F}" font-size="100" fill="${WHITE}" font-weight="900">svakog mjeseca</text>
  <text x="80" y="720" font-family="${F}" font-size="100" fill="${GOLD}" font-weight="900">nema dovoljno?</text>
  ${divider(80, 780, 1000)}
  <text x="80" y="860" font-family="${F}" font-size="52" fill="${MUTED}">Jer te nitko nije nau&#269;io</text>
  <text x="80" y="930" font-family="${F}" font-size="52" fill="${MUTED}">&#353;to raditi s novcem.</text>
  <text x="80" y="1020" font-family="${F}" font-size="56" fill="${WHITE}" font-weight="700">FinCoach VIP to mijenja.</text>
  ${divider(80, 1075, 1000)}
  <text x="80" y="1140" font-family="${F}" font-size="48" fill="${WHITE}">&#10003; Prona&#273;i gdje novac nestaje</text>
  <text x="80" y="1215" font-family="${F}" font-size="48" fill="${WHITE}">&#10003; &#352;teduj automatski svaki mj.</text>
  <text x="80" y="1290" font-family="${F}" font-size="48" fill="${WHITE}">&#10003; Investiraj bez straha</text>
  ${divider(80, 1348, 1000)}
  <rect x="80" y="1390" width="920" height="120" rx="16" fill="${GOLD}" opacity="0.12"/>
  <rect x="80" y="1390" width="920" height="120" rx="16" fill="none" stroke="${GOLD}" stroke-width="1.5" opacity="0.4"/>
  <text x="540" y="1462" text-anchor="middle" font-family="${F}" font-size="48" fill="${WHITE}" font-weight="700">90 dana · Korak po korak</text>
  <text x="80" y="1600" font-family="${F}" font-size="44" fill="${DIM}">Link u biu / swipe up &#128070;</text>
  <text x="80" y="1680" font-family="${F}" font-size="38" fill="${DIM}">@fincoachvip</text>
</svg>`
}

// ── 4. Story B — PRIJE/POSLIJE — 1080×1920 ───────────────────────────────────
function storyB() {
  return `<svg width="1080" height="1920" viewBox="0 0 1080 1920" xmlns="http://www.w3.org/2000/svg">
  <rect width="1080" height="1920" fill="${NAVY}"/>
  <rect x="0" y="0" width="8" height="1920" fill="${GOLD}"/>
  ${logo(80, 100)}
  <text x="80" y="440" font-family="${F}" font-size="88" fill="${WHITE}" font-weight="900">Moja financijska</text>
  <text x="80" y="545" font-family="${F}" font-size="88" fill="${GOLD}" font-weight="900">transformacija</text>
  <!-- PRIJE box -->
  <rect x="80" y="590" width="920" height="260" rx="16" fill="#7f1d1d" opacity="0.35"/>
  <rect x="80" y="590" width="920" height="260" rx="16" fill="none" stroke="#ef4444" stroke-width="1.5" opacity="0.5"/>
  <text x="110" y="640" font-family="${F}" font-size="36" fill="#fca5a5" font-weight="700">PRIJE FinCoach VIP</text>
  <text x="110" y="695" font-family="${F}" font-size="38" fill="#fca5a5">&#x2717; Novac nestajao bez traga</text>
  <text x="110" y="745" font-family="${F}" font-size="38" fill="#fca5a5">&#x2717; Nula &#353;tednje, puno stresa</text>
  <text x="110" y="795" font-family="${F}" font-size="38" fill="#fca5a5">&#x2717; Investiranje? Previ&#353;e rizi&#269;no</text>
  <text x="110" y="845" font-family="${F}" font-size="38" fill="#fca5a5">&#x2717; Kraj mj. &#8212; uvijek kriza</text>
  <!-- arrow -->
  <text x="540" y="930" text-anchor="middle" font-family="${F}" font-size="52" fill="${GOLD}" font-weight="700">&#8595; 90 dana kasnije</text>
  <!-- NAKON box -->
  <rect x="80" y="970" width="920" height="260" rx="16" fill="#14532d" opacity="0.35"/>
  <rect x="80" y="970" width="920" height="260" rx="16" fill="none" stroke="#22c55e" stroke-width="1.5" opacity="0.5"/>
  <text x="110" y="1020" font-family="${F}" font-size="36" fill="#86efac" font-weight="700">NAKON FinCoach VIP</text>
  <text x="110" y="1075" font-family="${F}" font-size="38" fill="#86efac">&#10003; Znam to&#269;no kamo ide novac</text>
  <text x="110" y="1125" font-family="${F}" font-size="38" fill="#86efac">&#10003; Automatski &#353;tedim svaki mj.</text>
  <text x="110" y="1175" font-family="${F}" font-size="38" fill="#86efac">&#10003; Investiram bez straha</text>
  <text x="110" y="1225" font-family="${F}" font-size="38" fill="#86efac">&#10003; Financijska sloboda &#8212; plan</text>
  <!-- CTA -->
  <rect x="80" y="1290" width="920" height="120" rx="16" fill="${GOLD}" opacity="0.15"/>
  <rect x="80" y="1290" width="920" height="120" rx="16" fill="none" stroke="${GOLD}" stroke-width="1.5" opacity="0.5"/>
  <text x="540" y="1338" text-anchor="middle" font-family="${F}" font-size="40" fill="${WHITE}">&#381;eli&#353; i tvoja transformacija?</text>
  <text x="540" y="1390" text-anchor="middle" font-family="${F}" font-size="44" fill="${GOLD}" font-weight="700">&#128070; Link u biu / swipe up</text>
</svg>`
}

// ── 5. FB/LinkedIn A — 1200×630 ───────────────────────────────────────────────
function fbA() {
  return `<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <rect width="1200" height="630" fill="${NAVY}"/>
  <rect x="0" y="0" width="8" height="630" fill="${GOLD}"/>
  ${logo(64, 48, 0.85)}
  <!-- Vertical divider -->
  <line x1="560" y1="60" x2="560" y2="570" stroke="${GOLD}" stroke-width="1" opacity="0.3"/>
  <!-- Left side -->
  <text x="80" y="260" font-family="${F}" font-size="96" fill="${WHITE}" font-weight="900">Novac</text>
  <text x="80" y="365" font-family="${F}" font-size="96" fill="${WHITE}" font-weight="900">ne radi</text>
  <text x="80" y="468" font-family="${F}" font-size="96" fill="${GOLD}" font-weight="900">za tebe?</text>
  <text x="80" y="535" font-family="${F}" font-size="38" fill="${MUTED}">Jer te nitko nije nau&#269;io kako.</text>
  <!-- Right side -->
  <text x="600" y="185" font-family="${F}" font-size="46" fill="${GOLD}" font-weight="700">FinCoach VIP to mijenja.</text>
  ${divider(600, 210, 1140, 0.3)}
  <text x="600" y="272" font-family="${F}" font-size="40" fill="${WHITE}">&#10003; Prona&#273;i gdje novac nestaje</text>
  <text x="600" y="335" font-family="${F}" font-size="40" fill="${WHITE}">&#10003; &#352;teduj automatski svaki mj.</text>
  <text x="600" y="398" font-family="${F}" font-size="40" fill="${WHITE}">&#10003; Investiraj bez straha</text>
  ${divider(600, 430, 1140, 0.3)}
  <text x="600" y="490" font-family="${F}" font-size="36" fill="${MUTED}">90 dana · Korak po korak</text>
  <text x="600" y="545" font-family="${F}" font-size="36" fill="${DIM}">Link u komentarima &#128071;</text>
</svg>`
}

// ── 6. FB/LinkedIn B — social proof — 1200×630 ────────────────────────────────
function fbB() {
  return `<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <rect width="1200" height="630" fill="${NAVY}"/>
  <rect x="0" y="0" width="8" height="630" fill="${GOLD}"/>
  ${logo(64, 48, 0.85)}
  <text x="80" y="240" font-family="${F}" font-size="72" fill="${GOLD}" font-weight="900">&#8220;Za 90 dana nau&#269;io/la sam</text>
  <text x="80" y="328" font-family="${F}" font-size="72" fill="${WHITE}" font-weight="900">vi&#353;e o novcu nego</text>
  <text x="80" y="416" font-family="${F}" font-size="72" fill="${WHITE}" font-weight="900">za cijeli &#382;ivot.&#8221;</text>
  ${divider(80, 455, 1140)}
  <text x="80" y="510" font-family="${F}" font-size="38" fill="${MUTED}">&#8212; polaznik FinCoach VIP programa</text>
  <text x="900" y="510" font-family="${F}" font-size="44" fill="${GOLD}">&#9733;&#9733;&#9733;&#9733;&#9733;</text>
  <text x="80" y="570" font-family="${F}" font-size="36" fill="${DIM}">Link u komentarima &#128071;</text>
</svg>`
}

// ── 7. WhatsApp A — 1080×1080 ─────────────────────────────────────────────────
function waA() {
  return `<svg width="1080" height="1080" viewBox="0 0 1080 1080" xmlns="http://www.w3.org/2000/svg">
  <rect width="1080" height="1080" fill="${NAVY}"/>
  <rect x="0" y="0" width="8" height="1080" fill="${GOLD}"/>
  ${logo(80, 72)}
  <text x="80" y="360" font-family="${F}" font-size="80" fill="${GOLD}" font-weight="900">&#8220;Ovo je program</text>
  <text x="80" y="455" font-family="${F}" font-size="80" fill="${WHITE}" font-weight="900">koji sam &#382;elio</text>
  <text x="80" y="550" font-family="${F}" font-size="80" fill="${WHITE}" font-weight="900">imati kad sam</text>
  <text x="80" y="645" font-family="${F}" font-size="80" fill="${GOLD}" font-weight="900">po&#269;injao.&#8221;</text>
  ${divider(80, 690, 1000)}
  <text x="80" y="760" font-family="${F}" font-size="48" fill="${MUTED}">Iskreno ga preporu&#269;ujem.</text>
  <text x="80" y="840" font-family="${F}" font-size="48" fill="${MUTED}">90 dana · Korak po korak.</text>
  ${divider(80, 890, 1000)}
  <text x="80" y="960" font-family="${F}" font-size="42" fill="${DIM}">Link u poruci &#128071;</text>
</svg>`
}

// ── 8. WhatsApp B — 1080×1080 ─────────────────────────────────────────────────
function waB() {
  return `<svg width="1080" height="1080" viewBox="0 0 1080 1080" xmlns="http://www.w3.org/2000/svg">
  <rect width="1080" height="1080" fill="${NAVY}"/>
  <rect x="0" y="0" width="8" height="1080" fill="${GOLD}"/>
  ${logo(80, 72)}
  <text x="80" y="360" font-family="${F}" font-size="76" fill="${WHITE}" font-weight="900">Promijeni odnos</text>
  <text x="80" y="452" font-family="${F}" font-size="76" fill="${WHITE}" font-weight="900">prema novcu za</text>
  <text x="80" y="550" font-family="${F}" font-size="96" fill="${GOLD}" font-weight="900">90 dana.</text>
  ${divider(80, 598, 1000)}
  <text x="80" y="668" font-family="${F}" font-size="46" fill="${MUTED}">Korak po korak. Bez zargona.</text>
  <text x="80" y="744" font-family="${F}" font-size="46" fill="${MUTED}">Prilagodeno tvom zivotu.</text>
  ${divider(80, 800, 1000)}
  <text x="80" y="870" font-family="${F}" font-size="52" fill="${WHITE}" font-weight="700">FinCoach VIP — link u poruci &#128071;</text>
</svg>`
}

const formats = [
  { name: 'ig-a',      svg: igA() },
  { name: 'ig-b',      svg: igB() },
  { name: 'story-a',   svg: storyA() },
  { name: 'story-b',   svg: storyB() },
  { name: 'fb-a',      svg: fbA() },
  { name: 'fb-b',      svg: fbB() },
  { name: 'whatsapp-a', svg: waA() },
  { name: 'whatsapp-b', svg: waB() },
]

for (const { name, svg } of formats) {
  // Use system fonts (Arial/Helvetica) — woff2 not supported by prebuilt resvg binary
  const svgWithArial = svg.replace(/font-family="[^"]*"/g, 'font-family="Arial"')
  const resvg = new Resvg(svgWithArial, {
    font: { loadSystemFonts: true, defaultFontFamily: 'Arial' },
    fitTo: { mode: 'original' },
  })
  const png = resvg.render().asPng()

  const outPath = path.join(outDir, `fincoach-${name}.png`)
  writeFileSync(outPath, png)
  console.log(`✓ ${name} — ${(png.length / 1024).toFixed(0)} KB → ${outPath}`)
}
console.log('\nDone! 8 PNGs saved to public/creatives/')
