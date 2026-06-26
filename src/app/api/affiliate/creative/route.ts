import { NextRequest, NextResponse } from 'next/server'
import sharp from 'sharp'

export const dynamic = 'force-dynamic'
export const maxDuration = 30

/**
 * Generira PNG kreativu za affiliate (vsebuje LOGO + brand stiliranje).
 * Format: ?format=ig-a|ig-b|story-a|story-b|fb-a|fb-b|whatsapp
 *
 * Link NI na sliki (zaštita pred prepisovanjem URL-a + tracking).
 * Affiliate svoj link postavi v tekst objave / bio.
 *
 * Pravila:
 * - Background: #0D1B2A, accent #D4AF37, font Inter
 * - 8px zlata levo navpična linija (signature)
 * - Logo vedno levo zgoraj
 * - Formula: Problem → Razlog → Rešenje → Dokaz → CTA
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const format = searchParams.get('format') ?? 'ig-a'
  const asSvg = searchParams.get('svg') === '1'

  const svg = buildSvg(format)
  const filename = `fincoach-${format}`

  if (asSvg) {
    return new NextResponse(svg, {
      headers: {
        'Content-Type': 'image/svg+xml',
        'Content-Disposition': `attachment; filename="${filename}.svg"`,
        'Cache-Control': 'public, max-age=86400',
      },
    })
  }

  try {
    const pngBuffer = await sharp(Buffer.from(svg)).png({ quality: 92, compressionLevel: 8 }).toBuffer()
    return new NextResponse(new Uint8Array(pngBuffer), {
      headers: {
        'Content-Type': 'image/png',
        'Content-Disposition': `attachment; filename="${filename}.png"`,
        'Cache-Control': 'public, max-age=86400',
      },
    })
  } catch (err) {
    console.error('SVG→PNG conversion error:', err)
    return NextResponse.json({ error: 'Conversion failed' }, { status: 500 })
  }
}

/* ------- FinCoach logo (kopiran iz /public/logo/fincoach-logo-horizontal.svg) ------- */
const LOGO_SVG = (x: number, y: number, scale: number) => `
  <g transform="translate(${x}, ${y}) scale(${scale})">
    <path d="M44 8 L80 25 L80 62 Q80 86 44 98 Q8 86 8 62 L8 25 Z" fill="#D4AF37" opacity="0.08"/>
    <path d="M44 8 L80 25 L80 62 Q80 86 44 98 Q8 86 8 62 L8 25 Z" fill="none" stroke="#D4AF37" stroke-width="2"/>
    <path d="M44 18 L72 32 L72 62 Q72 80 44 90 Q16 80 16 62 L16 32 Z" fill="none" stroke="#D4AF37" stroke-width="0.6" opacity="0.35"/>
    <rect x="18" y="65" width="9" height="18" rx="1.5" fill="#D4AF37" opacity="0.38"/>
    <rect x="30" y="56" width="9" height="27" rx="1.5" fill="#D4AF37" opacity="0.58"/>
    <rect x="42" y="45" width="9" height="38" rx="1.5" fill="#D4AF37" opacity="0.78"/>
    <rect x="54" y="32" width="9" height="51" rx="1.5" fill="#D4AF37"/>
    <polyline points="19,63 31,54 43,43 55,30 66,20" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round"/>
    <circle cx="66" cy="20" r="4.5" fill="#D4AF37"/>
    <circle cx="66" cy="20" r="2" fill="#ffffff"/>
    <text x="100" y="52" font-family="Inter,Arial,sans-serif" font-size="28" font-weight="600" fill="#ffffff" letter-spacing="1">FinCoach</text>
    <line x1="100" y1="60" x2="248" y2="60" stroke="#D4AF37" stroke-width="0.8" opacity="0.4"/>
    <ellipse cx="138" cy="78" rx="36" ry="13" fill="#D4AF37" opacity="0.10"/>
    <ellipse cx="138" cy="78" rx="36" ry="13" fill="none" stroke="#D4AF37" stroke-width="1.8"/>
    <text x="138" y="82" text-anchor="middle" font-family="Inter,Arial,sans-serif" font-size="11" font-weight="700" fill="#D4AF37" letter-spacing="5">VIP</text>
  </g>`

const F = 'Inter,Arial,sans-serif'

function buildSvg(format: string): string {
  switch (format) {
    case 'ig-a': return igA()
    case 'ig-b': return igB()
    case 'story-a': return storyA()
    case 'story-b': return storyB()
    case 'fb-a': return fbA()
    case 'fb-b': return fbB()
    case 'whatsapp': return whatsapp()
    default: return igA()
  }
}

/* ------- Instagram 1:1 Varianta A — problem/rešenje ------- */
function igA(): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1080" viewBox="0 0 1080 1080">
  <rect width="1080" height="1080" fill="#0D1B2A"/>
  <circle cx="920" cy="180" r="360" fill="#D4AF37" opacity="0.03"/>
  <circle cx="920" cy="180" r="220" fill="#D4AF37" opacity="0.03"/>
  <rect x="0" y="0" width="8" height="1080" fill="#D4AF37"/>
  ${LOGO_SVG(80, 68, 1.05)}
  <text x="80" y="310" font-family="${F}" font-size="96" fill="#FFFFFF" font-weight="900">Za&#353;to na kraju</text>
  <text x="80" y="418" font-family="${F}" font-size="96" fill="#FFFFFF" font-weight="900">mjeseca nikad</text>
  <text x="80" y="526" font-family="${F}" font-size="96" fill="#D4AF37" font-weight="900">nema dovoljno?</text>
  <line x1="80" y1="566" x2="1000" y2="566" stroke="#D4AF37" stroke-width="1" opacity="0.2"/>
  <text x="80" y="630" font-family="${F}" font-size="46" fill="#94A3B8">Jer te nitko nije nau&#269;io</text>
  <text x="80" y="686" font-family="${F}" font-size="46" fill="#94A3B8">&#353;to raditi s novcem.</text>
  <text x="80" y="756" font-family="${F}" font-size="50" fill="#FFFFFF" font-weight="700">FinCoach VIP to mijenja.</text>
  <line x1="80" y1="794" x2="1000" y2="794" stroke="#D4AF37" stroke-width="1" opacity="0.2"/>
  <text x="80" y="858" font-family="${F}" font-size="40" fill="#D4AF37">&#10003;</text>
  <text x="132" y="858" font-family="${F}" font-size="40" fill="#FFFFFF">Prona&#273;i gdje novac nestaje</text>
  <text x="80" y="918" font-family="${F}" font-size="40" fill="#D4AF37">&#10003;</text>
  <text x="132" y="918" font-family="${F}" font-size="40" fill="#FFFFFF">&#352;tedi automatski svaki mj.</text>
  <text x="80" y="978" font-family="${F}" font-size="40" fill="#D4AF37">&#10003;</text>
  <text x="132" y="978" font-family="${F}" font-size="40" fill="#FFFFFF">Investiraj bez straha</text>
  <line x1="80" y1="1012" x2="1000" y2="1012" stroke="#D4AF37" stroke-width="1" opacity="0.2"/>
  <text x="80" y="1058" font-family="${F}" font-size="36" fill="#475569">90 dana &#183; Link u biu &#128070;</text>
</svg>`
}

/* ------- Instagram 1:1 Varianta B — minimalistič ------- */
function igB(): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1080" viewBox="0 0 1080 1080">
  <rect width="1080" height="1080" fill="#0D1B2A"/>
  <rect x="0" y="0" width="8" height="1080" fill="#D4AF37"/>
  <circle cx="540" cy="540" r="420" fill="#D4AF37" opacity="0.03"/>
  <circle cx="540" cy="540" r="280" fill="#D4AF37" opacity="0.03"/>
  ${LOGO_SVG(80, 72, 1.05)}
  <text x="540" y="420" font-family="${F}" font-size="96" fill="#FFFFFF" font-weight="900" text-anchor="middle">Nitko te nije</text>
  <text x="540" y="530" font-family="${F}" font-size="96" fill="#FFFFFF" font-weight="900" text-anchor="middle">nau&#269;io &#353;to raditi</text>
  <text x="540" y="660" font-family="${F}" font-size="116" fill="#D4AF37" font-weight="900" text-anchor="middle">s novcem.</text>
  <line x1="160" y1="720" x2="920" y2="720" stroke="#D4AF37" stroke-width="1" opacity="0.2"/>
  <text x="540" y="800" font-family="${F}" font-size="48" fill="#94A3B8" text-anchor="middle">Mi jesmo.</text>
  <text x="540" y="920" font-family="${F}" font-size="40" fill="#475569" text-anchor="middle">Link u biu &#128070;</text>
</svg>`
}

/* ------- Story/TikTok 9:16 Varianta A — problem/rešenje vertikalen ------- */
function storyA(): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1920" viewBox="0 0 1080 1920">
  <rect width="1080" height="1920" fill="#0D1B2A"/>
  <circle cx="900" cy="400" r="500" fill="#D4AF37" opacity="0.03"/>
  <circle cx="900" cy="400" r="300" fill="#D4AF37" opacity="0.03"/>
  <rect x="0" y="0" width="8" height="1920" fill="#D4AF37"/>
  ${LOGO_SVG(80, 80, 1.1)}
  <text x="80" y="400" font-family="${F}" font-size="118" fill="#FFFFFF" font-weight="900">Za&#353;to na</text>
  <text x="80" y="530" font-family="${F}" font-size="118" fill="#FFFFFF" font-weight="900">kraju</text>
  <text x="80" y="660" font-family="${F}" font-size="118" fill="#FFFFFF" font-weight="900">mjeseca</text>
  <text x="80" y="790" font-family="${F}" font-size="118" fill="#D4AF37" font-weight="900">nikad nema</text>
  <text x="80" y="920" font-family="${F}" font-size="118" fill="#D4AF37" font-weight="900">dovoljno?</text>
  <line x1="80" y1="970" x2="1000" y2="970" stroke="#D4AF37" stroke-width="1" opacity="0.2"/>
  <text x="80" y="1060" font-family="${F}" font-size="54" fill="#94A3B8">Jer te nitko nije nau&#269;io</text>
  <text x="80" y="1128" font-family="${F}" font-size="54" fill="#94A3B8">&#353;to raditi s novcem.</text>
  <text x="80" y="1230" font-family="${F}" font-size="58" fill="#FFFFFF" font-weight="700">FinCoach VIP to mijenja.</text>
  <line x1="80" y1="1278" x2="1000" y2="1278" stroke="#D4AF37" stroke-width="1" opacity="0.2"/>
  <text x="80" y="1360" font-family="${F}" font-size="48" fill="#D4AF37">&#10003;</text>
  <text x="140" y="1360" font-family="${F}" font-size="48" fill="#FFFFFF">Prona&#273;i gdje novac nestaje</text>
  <text x="80" y="1438" font-family="${F}" font-size="48" fill="#D4AF37">&#10003;</text>
  <text x="140" y="1438" font-family="${F}" font-size="48" fill="#FFFFFF">&#352;tedi automatski svaki mj.</text>
  <text x="80" y="1516" font-family="${F}" font-size="48" fill="#D4AF37">&#10003;</text>
  <text x="140" y="1516" font-family="${F}" font-size="48" fill="#FFFFFF">Investiraj bez straha</text>
  <line x1="80" y1="1570" x2="1000" y2="1570" stroke="#D4AF37" stroke-width="1" opacity="0.2"/>
  <rect x="80" y="1620" width="920" height="160" rx="16" fill="#D4AF37" opacity="0.1"/>
  <rect x="80" y="1620" width="920" height="160" rx="16" fill="none" stroke="#D4AF37" stroke-width="1.5" opacity="0.4"/>
  <text x="540" y="1692" font-family="${F}" font-size="50" fill="#FFFFFF" font-weight="700" text-anchor="middle">90 dana &#183; Korak po korak</text>
  <text x="540" y="1758" font-family="${F}" font-size="44" fill="#D4AF37" text-anchor="middle">&#128070; Link u biu / swipe up</text>
  <text x="540" y="1870" font-family="${F}" font-size="34" fill="#2d3f52" text-anchor="middle">@fincoachvip</text>
</svg>`
}

/* ------- Story/TikTok 9:16 Varianta B — before/after ------- */
function storyB(): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1920" viewBox="0 0 1080 1920">
  <rect width="1080" height="1920" fill="#091623"/>
  <rect x="0" y="0" width="8" height="1920" fill="#D4AF37"/>
  ${LOGO_SVG(80, 80, 1.1)}
  <text x="540" y="380" font-family="${F}" font-size="80" fill="#FFFFFF" font-weight="900" text-anchor="middle">Moja financijska</text>
  <text x="540" y="474" font-family="${F}" font-size="80" fill="#D4AF37" font-weight="900" text-anchor="middle">transformacija</text>
  <line x1="80" y1="520" x2="1000" y2="520" stroke="#D4AF37" stroke-width="1" opacity="0.2"/>
  <rect x="80" y="560" width="920" height="380" rx="16" fill="#1a0a0a" stroke="#7f1d1d" stroke-width="1.5"/>
  <text x="540" y="630" font-family="${F}" font-size="52" fill="#ef4444" font-weight="700" text-anchor="middle">PRIJE FinCoach VIP</text>
  <text x="120" y="710" font-family="${F}" font-size="46" fill="#94A3B8">&#10007;  Novac nestajao bez traga</text>
  <text x="120" y="778" font-family="${F}" font-size="46" fill="#94A3B8">&#10007;  Nula &#353;tednje, puno stresa</text>
  <text x="120" y="846" font-family="${F}" font-size="46" fill="#94A3B8">&#10007;  Investiranje? Previ&#353;e rizi&#269;no</text>
  <text x="120" y="914" font-family="${F}" font-size="46" fill="#94A3B8">&#10007;  Kraj mj. &#8212; uvijek kriza</text>
  <text x="540" y="1020" font-family="${F}" font-size="80" fill="#D4AF37" text-anchor="middle">&#8595;</text>
  <text x="540" y="1100" font-family="${F}" font-size="44" fill="#D4AF37" text-anchor="middle">90 dana kasnije</text>
  <rect x="80" y="1130" width="920" height="380" rx="16" fill="#0a1a0a" stroke="#166534" stroke-width="1.5"/>
  <text x="540" y="1200" font-family="${F}" font-size="52" fill="#4ade80" font-weight="700" text-anchor="middle">NAKON FinCoach VIP</text>
  <text x="120" y="1280" font-family="${F}" font-size="46" fill="#FFFFFF">&#10003;  Znam to&#269;no kamo ide novac</text>
  <text x="120" y="1348" font-family="${F}" font-size="46" fill="#FFFFFF">&#10003;  Automatski &#353;tedim svaki mj.</text>
  <text x="120" y="1416" font-family="${F}" font-size="46" fill="#FFFFFF">&#10003;  Investiram bez straha</text>
  <text x="120" y="1484" font-family="${F}" font-size="46" fill="#FFFFFF">&#10003;  Financijska sloboda &#8212; plan</text>
  <line x1="80" y1="1560" x2="1000" y2="1560" stroke="#D4AF37" stroke-width="1" opacity="0.2"/>
  <rect x="80" y="1610" width="920" height="160" rx="16" fill="#D4AF37" opacity="0.1"/>
  <rect x="80" y="1610" width="920" height="160" rx="16" fill="none" stroke="#D4AF37" stroke-width="1.5" opacity="0.4"/>
  <text x="540" y="1682" font-family="${F}" font-size="50" fill="#FFFFFF" font-weight="700" text-anchor="middle">&#381;eli i tvoja transformacija?</text>
  <text x="540" y="1748" font-family="${F}" font-size="44" fill="#D4AF37" text-anchor="middle">&#128070; Link u biu / swipe up</text>
  <text x="540" y="1868" font-family="${F}" font-size="34" fill="#2d3f52" text-anchor="middle">@fincoachvip</text>
</svg>`
}

/* ------- Facebook/LinkedIn 1200×630 Varianta A — split layout ------- */
function fbA(): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#0D1B2A"/>
  <circle cx="1050" cy="120" r="320" fill="#D4AF37" opacity="0.03"/>
  <rect x="0" y="0" width="8" height="630" fill="#D4AF37"/>
  ${LOGO_SVG(48, 40, 0.72)}
  <line x1="580" y1="60" x2="580" y2="570" stroke="#D4AF37" stroke-width="1" opacity="0.15"/>
  <text x="48" y="260" font-family="${F}" font-size="86" fill="#FFFFFF" font-weight="900">Novac</text>
  <text x="48" y="358" font-family="${F}" font-size="86" fill="#FFFFFF" font-weight="900">ne radi</text>
  <text x="48" y="456" font-family="${F}" font-size="86" fill="#D4AF37" font-weight="900">za tebe?</text>
  <text x="48" y="540" font-family="${F}" font-size="34" fill="#475569">Jer te nitko nije nau&#269;io kako.</text>
  <text x="618" y="140" font-family="${F}" font-size="38" fill="#D4AF37" font-weight="700">FinCoach VIP to mijenja.</text>
  <line x1="618" y1="162" x2="1152" y2="162" stroke="#D4AF37" stroke-width="1" opacity="0.2"/>
  <text x="618" y="240" font-family="${F}" font-size="44" fill="#D4AF37">&#10003;</text>
  <text x="672" y="240" font-family="${F}" font-size="44" fill="#FFFFFF">Prona&#273;i gdje novac nestaje</text>
  <text x="618" y="316" font-family="${F}" font-size="44" fill="#D4AF37">&#10003;</text>
  <text x="672" y="316" font-family="${F}" font-size="44" fill="#FFFFFF">&#352;tedi automatski svaki mj.</text>
  <text x="618" y="392" font-family="${F}" font-size="44" fill="#D4AF37">&#10003;</text>
  <text x="672" y="392" font-family="${F}" font-size="44" fill="#FFFFFF">Investiraj bez straha</text>
  <line x1="618" y1="436" x2="1152" y2="436" stroke="#D4AF37" stroke-width="1" opacity="0.2"/>
  <text x="618" y="500" font-family="${F}" font-size="38" fill="#94A3B8">90 dana &#183; Korak po korak</text>
  <text x="618" y="554" font-family="${F}" font-size="38" fill="#D4AF37" font-weight="600">Link u komentarima &#128071;</text>
</svg>`
}

/* ------- Facebook/LinkedIn 1200×630 Varianta B — social proof ------- */
function fbB(): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#091623"/>
  <rect x="0" y="0" width="8" height="630" fill="#D4AF37"/>
  ${LOGO_SVG(48, 40, 0.72)}
  <text x="48" y="240" font-family="${F}" font-size="72" fill="#D4AF37" font-weight="900">&#8220;Za 90 dana nau&#269;io/la sam</text>
  <text x="48" y="328" font-family="${F}" font-size="72" fill="#FFFFFF" font-weight="900">vi&#353;e o novcu nego</text>
  <text x="48" y="416" font-family="${F}" font-size="72" fill="#FFFFFF" font-weight="900">za cijeli &#382;ivot.&#8221;</text>
  <line x1="48" y1="452" x2="1152" y2="452" stroke="#D4AF37" stroke-width="1" opacity="0.2"/>
  <text x="48" y="516" font-family="${F}" font-size="38" fill="#94A3B8">&#8212; polaznik FinCoach VIP programa</text>
  <text x="48" y="568" font-family="${F}" font-size="38" fill="#D4AF37">Link u komentarima &#128071;</text>
  <text x="900" y="520" font-family="${F}" font-size="56" fill="#D4AF37" text-anchor="middle">&#9733;&#9733;&#9733;&#9733;&#9733;</text>
  <text x="900" y="572" font-family="${F}" font-size="34" fill="#475569" text-anchor="middle">fincoach.vip</text>
</svg>`
}

/* ------- WhatsApp 1:1 — osebna preporuka ------- */
function whatsapp(): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1080" viewBox="0 0 1080 1080">
  <rect width="1080" height="1080" fill="#0D1B2A"/>
  <rect x="0" y="0" width="8" height="1080" fill="#D4AF37"/>
  ${LOGO_SVG(80, 72, 1.05)}
  <text x="80" y="360" font-family="${F}" font-size="74" fill="#D4AF37" font-weight="900">&#8220;Ovo je program</text>
  <text x="80" y="450" font-family="${F}" font-size="74" fill="#FFFFFF" font-weight="900">koji sam &#382;elio</text>
  <text x="80" y="540" font-family="${F}" font-size="74" fill="#FFFFFF" font-weight="900">imati kad sam</text>
  <text x="80" y="630" font-family="${F}" font-size="74" fill="#D4AF37" font-weight="900">po&#269;injao.&#8221;</text>
  <line x1="80" y1="678" x2="1000" y2="678" stroke="#D4AF37" stroke-width="1" opacity="0.2"/>
  <text x="80" y="760" font-family="${F}" font-size="46" fill="#94A3B8">Iskreno ga preporu&#269;ujem.</text>
  <text x="80" y="840" font-family="${F}" font-size="46" fill="#94A3B8">90 dana &#183; Korak po korak.</text>
  <line x1="80" y1="894" x2="1000" y2="894" stroke="#D4AF37" stroke-width="1" opacity="0.2"/>
  <text x="80" y="970" font-family="${F}" font-size="40" fill="#475569">Link u poruci &#128071;</text>
</svg>`
}
