import { readFileSync } from 'fs'
import path from 'path'

/**
 * Vrne Inter Bold (700) in Black (900) kot base64 woff2 za embedanje v SVG.
 * Caching: read once at module load.
 */
let cachedFontFace: string | null = null

function getFontFace(): string {
  if (cachedFontFace) return cachedFontFace
  try {
    const fontsDir = path.join(process.cwd(), 'node_modules', '@fontsource', 'inter', 'files')
    const bold = readFileSync(path.join(fontsDir, 'inter-latin-700-normal.woff2')).toString('base64')
    const black = readFileSync(path.join(fontsDir, 'inter-latin-900-normal.woff2')).toString('base64')
    cachedFontFace = `<defs><style type="text/css"><![CDATA[
      @font-face { font-family: 'Inter'; src: url(data:font/woff2;base64,${bold}) format('woff2'); font-weight: 700; font-style: normal; }
      @font-face { font-family: 'Inter'; src: url(data:font/woff2;base64,${black}) format('woff2'); font-weight: 900; font-style: normal; }
    ]]></style></defs>`
    return cachedFontFace
  } catch {
    cachedFontFace = ''
    return ''
  }
}

const F = "Inter, 'Helvetica Neue', Arial, sans-serif"

const LOGO = (x: number, y: number, scale: number) => `
  <g transform="translate(${x}, ${y}) scale(${scale})">
    <path d="M44 8 L80 25 L80 62 Q80 86 44 98 Q8 86 8 62 L8 25 Z" fill="#D4AF37" opacity="0.08"/>
    <path d="M44 8 L80 25 L80 62 Q80 86 44 98 Q8 86 8 62 L8 25 Z" fill="none" stroke="#D4AF37" stroke-width="2"/>
    <rect x="18" y="65" width="9" height="18" rx="1.5" fill="#D4AF37" opacity="0.38"/>
    <rect x="30" y="56" width="9" height="27" rx="1.5" fill="#D4AF37" opacity="0.58"/>
    <rect x="42" y="45" width="9" height="38" rx="1.5" fill="#D4AF37" opacity="0.78"/>
    <rect x="54" y="32" width="9" height="51" rx="1.5" fill="#D4AF37"/>
    <polyline points="19,63 31,54 43,43 55,30 66,20" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round"/>
    <circle cx="66" cy="20" r="4.5" fill="#D4AF37"/>
    <circle cx="66" cy="20" r="2" fill="#ffffff"/>
    <text x="100" y="52" font-family="${F}" font-size="28" font-weight="700" fill="#ffffff" letter-spacing="1">FinCoach</text>
    <line x1="100" y1="60" x2="248" y2="60" stroke="#D4AF37" stroke-width="0.8" opacity="0.4"/>
    <ellipse cx="138" cy="78" rx="36" ry="13" fill="#D4AF37" opacity="0.10"/>
    <ellipse cx="138" cy="78" rx="36" ry="13" fill="none" stroke="#D4AF37" stroke-width="1.8"/>
    <text x="138" y="82" text-anchor="middle" font-family="${F}" font-size="11" font-weight="700" fill="#D4AF37" letter-spacing="5">VIP</text>
  </g>`

const wrap = (w: number, h: number, body: string) =>
  `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${getFontFace()}${body}</svg>`

/* ============ INSTAGRAM / FACEBOOK FEED — 1080×1080 ============ */

// A: Problem → Rešitev (klasik)
function igFeedA(): string {
  return wrap(1080, 1080, `
  <rect width="1080" height="1080" fill="#0D1B2A"/>
  <circle cx="920" cy="180" r="360" fill="#D4AF37" opacity="0.04"/>
  <rect x="0" y="0" width="8" height="1080" fill="#D4AF37"/>
  ${LOGO(80, 68, 1.05)}
  <text x="80" y="310" font-family="${F}" font-size="92" fill="#FFFFFF" font-weight="900">Zašto na kraju</text>
  <text x="80" y="412" font-family="${F}" font-size="92" fill="#FFFFFF" font-weight="900">mjeseca nikad</text>
  <text x="80" y="514" font-family="${F}" font-size="92" fill="#D4AF37" font-weight="900">nema dovoljno?</text>
  <line x1="80" y1="560" x2="1000" y2="560" stroke="#D4AF37" stroke-width="1" opacity="0.2"/>
  <text x="80" y="624" font-family="${F}" font-size="44" fill="#94A3B8">Jer te nitko nije naučio</text>
  <text x="80" y="680" font-family="${F}" font-size="44" fill="#94A3B8">što raditi s novcem.</text>
  <text x="80" y="752" font-family="${F}" font-size="48" fill="#FFFFFF" font-weight="700">FinCoach VIP to mijenja.</text>
  <line x1="80" y1="790" x2="1000" y2="790" stroke="#D4AF37" stroke-width="1" opacity="0.2"/>
  <text x="80" y="854" font-family="${F}" font-size="38" fill="#D4AF37">✓</text>
  <text x="132" y="854" font-family="${F}" font-size="38" fill="#FFFFFF">Pronađi gdje novac nestaje</text>
  <text x="80" y="912" font-family="${F}" font-size="38" fill="#D4AF37">✓</text>
  <text x="132" y="912" font-family="${F}" font-size="38" fill="#FFFFFF">Štedi automatski svaki mj.</text>
  <text x="80" y="970" font-family="${F}" font-size="38" fill="#D4AF37">✓</text>
  <text x="132" y="970" font-family="${F}" font-size="38" fill="#FFFFFF">Investiraj bez straha</text>
  <line x1="80" y1="1010" x2="1000" y2="1010" stroke="#D4AF37" stroke-width="1" opacity="0.2"/>
  <text x="80" y="1054" font-family="${F}" font-size="34" fill="#475569">90 dana · Link u biu ↑</text>`)
}

// B: Statistika/Provokacija
function igFeedB(): string {
  return wrap(1080, 1080, `
  <rect width="1080" height="1080" fill="#0D1B2A"/>
  <rect x="0" y="0" width="8" height="1080" fill="#D4AF37"/>
  <circle cx="540" cy="540" r="420" fill="#D4AF37" opacity="0.04"/>
  ${LOGO(80, 72, 1.05)}
  <text x="540" y="380" font-family="${F}" font-size="120" fill="#D4AF37" font-weight="900" text-anchor="middle">73%</text>
  <text x="540" y="470" font-family="${F}" font-size="44" fill="#FFFFFF" font-weight="700" text-anchor="middle">ljudi živi od plaće</text>
  <text x="540" y="530" font-family="${F}" font-size="44" fill="#FFFFFF" font-weight="700" text-anchor="middle">do plaće.</text>
  <line x1="160" y1="600" x2="920" y2="600" stroke="#D4AF37" stroke-width="1" opacity="0.2"/>
  <text x="540" y="690" font-family="${F}" font-size="52" fill="#FFFFFF" font-weight="700" text-anchor="middle">Ne mora biti tako.</text>
  <text x="540" y="780" font-family="${F}" font-size="40" fill="#94A3B8" text-anchor="middle">Za 90 dana izgradio/la sam</text>
  <text x="540" y="836" font-family="${F}" font-size="40" fill="#94A3B8" text-anchor="middle">sustav koji radi za mene —</text>
  <text x="540" y="892" font-family="${F}" font-size="40" fill="#D4AF37" text-anchor="middle">bez stresa, bez odricanja.</text>
  <line x1="160" y1="950" x2="920" y2="950" stroke="#D4AF37" stroke-width="1" opacity="0.2"/>
  <text x="540" y="1010" font-family="${F}" font-size="34" fill="#475569" text-anchor="middle">FinCoach VIP · Link u biu ↑</text>`)
}

/* ============ STORY / TIKTOK / IG STORY — 1080×1920 ============ */

// A: Pitanje (klasik)
function storyA(): string {
  return wrap(1080, 1920, `
  <rect width="1080" height="1920" fill="#0D1B2A"/>
  <circle cx="900" cy="400" r="500" fill="#D4AF37" opacity="0.04"/>
  <rect x="0" y="0" width="8" height="1920" fill="#D4AF37"/>
  ${LOGO(80, 80, 1.1)}
  <text x="80" y="400" font-family="${F}" font-size="116" fill="#FFFFFF" font-weight="900">Zašto na</text>
  <text x="80" y="528" font-family="${F}" font-size="116" fill="#FFFFFF" font-weight="900">kraju</text>
  <text x="80" y="656" font-family="${F}" font-size="116" fill="#FFFFFF" font-weight="900">mjeseca</text>
  <text x="80" y="784" font-family="${F}" font-size="116" fill="#D4AF37" font-weight="900">nikad nema</text>
  <text x="80" y="912" font-family="${F}" font-size="116" fill="#D4AF37" font-weight="900">dovoljno?</text>
  <line x1="80" y1="960" x2="1000" y2="960" stroke="#D4AF37" stroke-width="1" opacity="0.2"/>
  <text x="80" y="1050" font-family="${F}" font-size="52" fill="#94A3B8">Jer te nitko nije naučio</text>
  <text x="80" y="1118" font-family="${F}" font-size="52" fill="#94A3B8">što raditi s novcem.</text>
  <text x="80" y="1220" font-family="${F}" font-size="56" fill="#FFFFFF" font-weight="700">FinCoach VIP to mijenja.</text>
  <line x1="80" y1="1268" x2="1000" y2="1268" stroke="#D4AF37" stroke-width="1" opacity="0.2"/>
  <text x="80" y="1350" font-family="${F}" font-size="46" fill="#D4AF37">✓</text>
  <text x="140" y="1350" font-family="${F}" font-size="46" fill="#FFFFFF">Pronađi gdje novac nestaje</text>
  <text x="80" y="1426" font-family="${F}" font-size="46" fill="#D4AF37">✓</text>
  <text x="140" y="1426" font-family="${F}" font-size="46" fill="#FFFFFF">Štedi automatski svaki mj.</text>
  <text x="80" y="1502" font-family="${F}" font-size="46" fill="#D4AF37">✓</text>
  <text x="140" y="1502" font-family="${F}" font-size="46" fill="#FFFFFF">Investiraj bez straha</text>
  <line x1="80" y1="1560" x2="1000" y2="1560" stroke="#D4AF37" stroke-width="1" opacity="0.2"/>
  <rect x="80" y="1610" width="920" height="160" rx="16" fill="#D4AF37" opacity="0.1"/>
  <rect x="80" y="1610" width="920" height="160" rx="16" fill="none" stroke="#D4AF37" stroke-width="1.5" opacity="0.4"/>
  <text x="540" y="1682" font-family="${F}" font-size="48" fill="#FFFFFF" font-weight="700" text-anchor="middle">90 dana · Korak po korak</text>
  <text x="540" y="1748" font-family="${F}" font-size="42" fill="#D4AF37" text-anchor="middle">Link u biu ↑ / swipe up</text>
  <text x="540" y="1862" font-family="${F}" font-size="32" fill="#2d3f52" text-anchor="middle">@fincoachvip</text>`)
}

// B: Before/After
function storyB(): string {
  return wrap(1080, 1920, `
  <rect width="1080" height="1920" fill="#091623"/>
  <rect x="0" y="0" width="8" height="1920" fill="#D4AF37"/>
  ${LOGO(80, 80, 1.1)}
  <text x="540" y="380" font-family="${F}" font-size="76" fill="#FFFFFF" font-weight="900" text-anchor="middle">Moja financijska</text>
  <text x="540" y="466" font-family="${F}" font-size="76" fill="#D4AF37" font-weight="900" text-anchor="middle">transformacija</text>
  <line x1="80" y1="510" x2="1000" y2="510" stroke="#D4AF37" stroke-width="1" opacity="0.2"/>
  <rect x="80" y="555" width="920" height="370" rx="16" fill="#1a0a0a" stroke="#7f1d1d" stroke-width="1.5"/>
  <text x="540" y="625" font-family="${F}" font-size="48" fill="#ef4444" font-weight="700" text-anchor="middle">PRIJE FinCoach VIP</text>
  <text x="120" y="700" font-family="${F}" font-size="42" fill="#94A3B8">✗  Novac nestajao bez traga</text>
  <text x="120" y="766" font-family="${F}" font-size="42" fill="#94A3B8">✗  Nula štednje, puno stresa</text>
  <text x="120" y="832" font-family="${F}" font-size="42" fill="#94A3B8">✗  Investiranje? Previše rizično</text>
  <text x="120" y="898" font-family="${F}" font-size="42" fill="#94A3B8">✗  Kraj mj. — uvijek kriza</text>
  <text x="540" y="1010" font-family="${F}" font-size="74" fill="#D4AF37" text-anchor="middle">↓</text>
  <text x="540" y="1090" font-family="${F}" font-size="42" fill="#D4AF37" text-anchor="middle">90 dana kasnije</text>
  <rect x="80" y="1120" width="920" height="370" rx="16" fill="#0a1a0a" stroke="#166534" stroke-width="1.5"/>
  <text x="540" y="1190" font-family="${F}" font-size="48" fill="#4ade80" font-weight="700" text-anchor="middle">NAKON FinCoach VIP</text>
  <text x="120" y="1265" font-family="${F}" font-size="42" fill="#FFFFFF">✓  Znam točno kamo ide novac</text>
  <text x="120" y="1331" font-family="${F}" font-size="42" fill="#FFFFFF">✓  Automatski štedim svaki mj.</text>
  <text x="120" y="1397" font-family="${F}" font-size="42" fill="#FFFFFF">✓  Investiram bez straha</text>
  <text x="120" y="1463" font-family="${F}" font-size="42" fill="#FFFFFF">✓  Financijska sloboda — plan</text>
  <line x1="80" y1="1540" x2="1000" y2="1540" stroke="#D4AF37" stroke-width="1" opacity="0.2"/>
  <rect x="80" y="1600" width="920" height="160" rx="16" fill="#D4AF37" opacity="0.1"/>
  <rect x="80" y="1600" width="920" height="160" rx="16" fill="none" stroke="#D4AF37" stroke-width="1.5" opacity="0.4"/>
  <text x="540" y="1672" font-family="${F}" font-size="46" fill="#FFFFFF" font-weight="700" text-anchor="middle">Želi i tvoja transformacija?</text>
  <text x="540" y="1736" font-family="${F}" font-size="42" fill="#D4AF37" text-anchor="middle">Link u biu ↑ / swipe up</text>
  <text x="540" y="1862" font-family="${F}" font-size="32" fill="#2d3f52" text-anchor="middle">@fincoachvip</text>`)
}

/* ============ FACEBOOK / LINKEDIN — 1200×630 ============ */

// A: Split layout
function fbA(): string {
  return wrap(1200, 630, `
  <rect width="1200" height="630" fill="#0D1B2A"/>
  <circle cx="1050" cy="120" r="320" fill="#D4AF37" opacity="0.04"/>
  <rect x="0" y="0" width="8" height="630" fill="#D4AF37"/>
  ${LOGO(48, 40, 0.72)}
  <line x1="580" y1="60" x2="580" y2="570" stroke="#D4AF37" stroke-width="1" opacity="0.15"/>
  <text x="48" y="260" font-family="${F}" font-size="84" fill="#FFFFFF" font-weight="900">Novac</text>
  <text x="48" y="356" font-family="${F}" font-size="84" fill="#FFFFFF" font-weight="900">ne radi</text>
  <text x="48" y="452" font-family="${F}" font-size="84" fill="#D4AF37" font-weight="900">za tebe?</text>
  <text x="48" y="534" font-family="${F}" font-size="32" fill="#94A3B8">Jer te nitko nije naučio kako.</text>
  <text x="618" y="138" font-family="${F}" font-size="36" fill="#D4AF37" font-weight="700">FinCoach VIP to mijenja.</text>
  <line x1="618" y1="160" x2="1152" y2="160" stroke="#D4AF37" stroke-width="1" opacity="0.2"/>
  <text x="618" y="234" font-family="${F}" font-size="42" fill="#D4AF37">✓</text>
  <text x="670" y="234" font-family="${F}" font-size="38" fill="#FFFFFF">Pronađi gdje novac nestaje</text>
  <text x="618" y="306" font-family="${F}" font-size="42" fill="#D4AF37">✓</text>
  <text x="670" y="306" font-family="${F}" font-size="38" fill="#FFFFFF">Štedi automatski svaki mj.</text>
  <text x="618" y="378" font-family="${F}" font-size="42" fill="#D4AF37">✓</text>
  <text x="670" y="378" font-family="${F}" font-size="38" fill="#FFFFFF">Investiraj bez straha</text>
  <line x1="618" y1="420" x2="1152" y2="420" stroke="#D4AF37" stroke-width="1" opacity="0.2"/>
  <text x="618" y="486" font-family="${F}" font-size="34" fill="#94A3B8">90 dana · Korak po korak</text>
  <text x="618" y="546" font-family="${F}" font-size="34" fill="#D4AF37" font-weight="700">Link u prvom komentaru ↓</text>`)
}

// B: Social proof (citat + zvjezdice)
function fbB(): string {
  return wrap(1200, 630, `
  <rect width="1200" height="630" fill="#091623"/>
  <rect x="0" y="0" width="8" height="630" fill="#D4AF37"/>
  ${LOGO(48, 40, 0.72)}
  <text x="48" y="234" font-family="${F}" font-size="64" fill="#D4AF37" font-weight="900">"Za 90 dana naučio/la sam</text>
  <text x="48" y="318" font-family="${F}" font-size="64" fill="#FFFFFF" font-weight="900">više o novcu nego</text>
  <text x="48" y="402" font-family="${F}" font-size="64" fill="#FFFFFF" font-weight="900">za cijeli život."</text>
  <line x1="48" y1="440" x2="1152" y2="440" stroke="#D4AF37" stroke-width="1" opacity="0.2"/>
  <text x="48" y="504" font-family="${F}" font-size="34" fill="#94A3B8">— polaznik FinCoach VIP programa</text>
  <text x="48" y="556" font-family="${F}" font-size="34" fill="#D4AF37" font-weight="700">Link u prvom komentaru ↓</text>
  <text x="900" y="510" font-family="${F}" font-size="52" fill="#D4AF37" text-anchor="middle">★★★★★</text>
  <text x="900" y="560" font-family="${F}" font-size="30" fill="#475569" text-anchor="middle">fincoach.vip</text>`)
}

/* ============ WHATSAPP — 1080×1080 ============ */

// A: Osebna preporuka
function whatsappA(): string {
  return wrap(1080, 1080, `
  <rect width="1080" height="1080" fill="#0D1B2A"/>
  <rect x="0" y="0" width="8" height="1080" fill="#D4AF37"/>
  ${LOGO(80, 72, 1.05)}
  <text x="80" y="350" font-family="${F}" font-size="72" fill="#D4AF37" font-weight="900">"Ovo je program</text>
  <text x="80" y="440" font-family="${F}" font-size="72" fill="#FFFFFF" font-weight="900">koji sam želio</text>
  <text x="80" y="530" font-family="${F}" font-size="72" fill="#FFFFFF" font-weight="900">imati kad sam</text>
  <text x="80" y="620" font-family="${F}" font-size="72" fill="#D4AF37" font-weight="900">počinjao."</text>
  <line x1="80" y1="670" x2="1000" y2="670" stroke="#D4AF37" stroke-width="1" opacity="0.2"/>
  <text x="80" y="750" font-family="${F}" font-size="44" fill="#94A3B8">Iskreno ga preporučujem.</text>
  <text x="80" y="826" font-family="${F}" font-size="44" fill="#94A3B8">90 dana · Korak po korak.</text>
  <line x1="80" y1="884" x2="1000" y2="884" stroke="#D4AF37" stroke-width="1" opacity="0.2"/>
  <text x="80" y="960" font-family="${F}" font-size="38" fill="#475569">Link u poruci ↓</text>`)
}

// B: Direkten poziv
function whatsappB(): string {
  return wrap(1080, 1080, `
  <rect width="1080" height="1080" fill="#0D1B2A"/>
  <rect x="0" y="0" width="8" height="1080" fill="#D4AF37"/>
  <circle cx="540" cy="540" r="380" fill="#D4AF37" opacity="0.04"/>
  ${LOGO(80, 72, 1.05)}
  <text x="540" y="380" font-family="${F}" font-size="84" fill="#FFFFFF" font-weight="900" text-anchor="middle">90 dana koja</text>
  <text x="540" y="478" font-family="${F}" font-size="84" fill="#D4AF37" font-weight="900" text-anchor="middle">mijenjaju sve.</text>
  <line x1="200" y1="540" x2="880" y2="540" stroke="#D4AF37" stroke-width="1" opacity="0.2"/>
  <text x="540" y="630" font-family="${F}" font-size="42" fill="#94A3B8" text-anchor="middle">Bez složenih teorija.</text>
  <text x="540" y="686" font-family="${F}" font-size="42" fill="#94A3B8" text-anchor="middle">Bez praznih obećanja.</text>
  <text x="540" y="780" font-family="${F}" font-size="48" fill="#FFFFFF" font-weight="700" text-anchor="middle">Samo sustav koji radi —</text>
  <text x="540" y="846" font-family="${F}" font-size="48" fill="#D4AF37" font-weight="700" text-anchor="middle">čak i kad nisi motiviran/a.</text>
  <line x1="200" y1="900" x2="880" y2="900" stroke="#D4AF37" stroke-width="1" opacity="0.2"/>
  <text x="540" y="970" font-family="${F}" font-size="38" fill="#475569" text-anchor="middle">FinCoach VIP · Link u poruci ↓</text>`)
}

export function buildCreativeSvg(format: string): string {
  switch (format) {
    case 'ig-a': return igFeedA()
    case 'ig-b': return igFeedB()
    case 'story-a': return storyA()
    case 'story-b': return storyB()
    case 'fb-a': return fbA()
    case 'fb-b': return fbB()
    case 'whatsapp-a': return whatsappA()
    case 'whatsapp-b': return whatsappB()
    default: return igFeedA()
  }
}
