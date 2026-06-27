import Anthropic from '@anthropic-ai/sdk'
import { Resvg } from '@resvg/resvg-js'
import { createServiceClient } from './supabase/server'

const NAVY = '#0D1B3E'
const GOLD = '#D4AF37'
const WHITE = '#FFFFFF'
const DIM = 'rgba(255,255,255,0.12)'

function getClient(): Anthropic {
  if (!process.env.ANTHROPIC_API_KEY) throw new Error('ANTHROPIC_API_KEY nije postavljen')
  return new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
}

function categoryLabel(cat: string | null | undefined): string {
  const map: Record<string, string> = {
    'osobne-financije': 'Osobne financije',
    'investiranje': 'Investiranje',
    'psihologija-novca': 'Psihologija novca',
    'osiguranje': 'Financijska zaštita',
    'mentorstvo': 'Mentorstvo',
    'obiteljske-financije': 'Obiteljske financije',
  }
  if (!cat) return 'FinCoach VIP'
  for (const [k, v] of Object.entries(map)) if (cat.includes(k)) return v
  return 'FinCoach VIP'
}

function escXml(t: string): string {
  return t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

function wrapText(title: string, maxLen = 38): string[] {
  const words = title.split(' ')
  const lines: string[] = []
  let line = ''
  for (const w of words) {
    if ((line + ' ' + w).trim().length > maxLen && line) {
      lines.push(line.trim())
      line = w
    } else {
      line = (line + ' ' + w).trim()
    }
  }
  if (line) lines.push(line.trim())
  return lines.slice(0, 3)
}

// ── Fallback SVG (ako Claude ne vrati validan SVG) ────────────────────────────

function fallbackSvg(title: string, cat: string | null | undefined, seed: number): string {
  // Deterministični seed za "random" vrijednosti
  let s = (seed >>> 0)
  const rand = () => { s = (Math.imul(1664525, s) + 1013904223) >>> 0; return s / 0xffffffff }

  const lines = wrapText(escXml(title))
  const titleSvg = lines.map((l, i) =>
    `<text x="80" y="${52 + i * 44}" font-family="system-ui,sans-serif" font-size="${i === 0 ? 38 : 34}" font-weight="800" fill="${WHITE}">${l}</text>`
  ).join('\n')

  // Bar chart sa slučajnim vrijednostima baziranim na seedu
  const months = ['Sij', 'Vel', 'Ožu', 'Tra', 'Svi', 'Lip', 'Srp']
  const vals = months.map(() => 600 + Math.round(rand() * 3800))
  const maxV = Math.max(...vals)
  const cX = 80, cY = 165, cW = 1040, cH = 330
  const bW = Math.floor(cW / 7) - 16

  const bars = months.map((m, i) => {
    const bH = Math.round((vals[i] / maxV) * cH)
    const x = cX + i * Math.floor(cW / 7) + 8
    const y = cY + cH - bH
    const hi = vals[i] === maxV
    return `<rect x="${x}" y="${y}" width="${bW}" height="${bH}" rx="7" fill="${hi ? GOLD : DIM}"/>
<text x="${x + bW / 2}" y="${y - 12}" text-anchor="middle" font-family="system-ui" font-size="18" font-weight="${hi ? '700' : '400'}" fill="${hi ? GOLD : 'rgba(255,255,255,0.7)'}">€${(vals[i] / 1000).toFixed(1)}k</text>
<text x="${x + bW / 2}" y="${cY + cH + 30}" text-anchor="middle" font-family="system-ui" font-size="16" fill="rgba(255,255,255,0.5)">${m}</text>`
  }).join('\n')

  return `<svg viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
<rect width="1200" height="630" fill="${NAVY}"/>
<rect width="7" height="630" fill="${GOLD}"/>
${titleSvg}
<text x="1120" y="52" text-anchor="end" font-family="system-ui,sans-serif" font-size="19" fill="${GOLD}">${escXml(categoryLabel(cat))}</text>
${bars}
<line x1="${cX}" y1="${cY + cH}" x2="${cX + cW}" y2="${cY + cH}" stroke="rgba(255,255,255,0.15)" stroke-width="2"/>
</svg>`
}

// ── Claude Haiku generira SVG vezan uz temu članka ───────────────────────────

async function generateSvgWithClaude(
  title: string,
  excerpt: string | null | undefined,
  category: string | null | undefined,
  imageIndex: number,
  fallbackSeed: number
): Promise<string> {
  const client = getClient()
  const catLabel = categoryLabel(category)

  const imageRole = imageIndex === 0
    ? 'naslovna slika (cover) — vizualno najdojmljivija, prikazuje srž teme'
    : imageIndex === 1
      ? 'ilustracija za prvu sekciju teksta — vizualizira ključni koncept'
      : 'ilustracija za drugu sekciju teksta — vizualizira praktičan primjer ili rezultat'

  const prompt = `Napravi SVG ilustraciju za blog članak o osobnim financijama.

ČLANAK:
Naslov: "${title}"
Kategorija: ${catLabel}
${excerpt ? `Opis: ${excerpt}` : ''}
Uloga ove slike: ${imageRole}

TEHNIČKE SPECIFIKACIJE (OBAVEZNO):
- viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg"
- Prva stvar u SVG: <rect width="1200" height="630" fill="${NAVY}"/>
- Druga stvar: <rect width="7" height="630" fill="${GOLD}"/> (zlatna lijeva traka)
- Ključna boja: ${GOLD} za naglašene elemente
- Tekst: bijeli (#FFFFFF) ili zlatni (#D4AF37)
- Naslov članka prikaži u gornjem lijevom uglu (x=80, y=52, font-size=36, font-weight=800, fill=white)
  Ako je naslov dugačak, prelomi u 2 retka (y=52 i y=96)
- Oznaka kategorije desno gore (x=1120, y=52, text-anchor=end, font-size=18, fill=${GOLD})
- Sadržaj ilustracije počinje od y=130 ili niže

SADRŽAJ (NAJVAŽNIJE):
Napravi vizualizaciju SPECIFIČNU za ovu temu. Primjeri:
- Za temu o štednji: vizualni ciljar štednje, jar sa novcem, trakasta tabla napretka
- Za temu o investicijama: rastući graf portfelja, razredi imovine, složena kamata
- Za temu o dugovima: semafor duga, plan otplate, vizualizacija opterećenja
- Za psihologiju: mozak i novac, impulsi vs razum, mentalne blokade
- Za osiguranje: štit zaštite, obitelj i sigurnost, rizik bez vs sa osiguranjem
- Za mentorstvo: ljestve karijere, mreža klijenata, prihod zastopnika
- Za obitelj: kućanski proračun, djeca i novac, zajednički ciljevi

OGRANIČENJA SVG (resvg renderer — nema CSS filtera!):
- Dozvoljeno: rect, circle, ellipse, line, polyline, polygon, path, text, g, defs, linearGradient, radialGradient, stop, use, symbol
- NIJE dozvoljeno: filter, feGaussianBlur, feDropShadow, foreignObject, clip-path, mask, animacije
- font-family UVIJEK: font-family="system-ui,sans-serif"
- Koordinate: uvijek brojevi, nikada postotci u width/height atributima
- path d atribut: koristi samo M, L, H, V, C, S, Q, A, Z komande

Vrati SAMO SVG kod koji počinje s <svg i završava s </svg>. Bez ikakvog teksta, bez markdown, bez objašnjenja.`

  try {
    const msg = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 3500,
      messages: [{ role: 'user', content: prompt }],
    })

    const raw = msg.content
      .filter((b): b is Anthropic.TextBlock => b.type === 'text')
      .map(b => b.text)
      .join('')
      .trim()

    // Izvuci SVG iz odgovora
    const match = raw.match(/<svg[\s\S]*?<\/svg>/i)
    if (!match) return fallbackSvg(title, category, fallbackSeed)

    const svgCode = match[0]

    // Validiraj da resvg može parsirati
    new Resvg(svgCode, { fitTo: { mode: 'width', value: 1200 } })
    return svgCode
  } catch (err) {
    console.error(`SVG generacija neuspjela (img ${imageIndex}), koristim fallback:`, err)
    return fallbackSvg(title, category, fallbackSeed + imageIndex)
  }
}

// ── Deterministični seed iz stringa ──────────────────────────────────────────

function strSeed(s: string): number {
  let h = 5381
  for (let i = 0; i < s.length; i++) h = (Math.imul(31, h) + s.charCodeAt(i)) | 0
  return Math.abs(h)
}

// ── Javna funkcija ───────────────────────────────────────────────────────────

export async function generateAndUploadArticleImages(
  title: string,
  category: string | null | undefined,
  slug: string,
  excerpt?: string | null
): Promise<{ coverUrl: string; img1Url: string; img2Url: string }> {
  const supabase = await createServiceClient()
  const seed = strSeed(slug)

  // Generiraj sva 3 SVG-a paralelno (cover + 2 slike u tekstu)
  const svgs = await Promise.all([0, 1, 2].map(i =>
    generateSvgWithClaude(title, excerpt, category, i, seed + i)
  ))

  const urls: string[] = []
  for (let i = 0; i < 3; i++) {
    const resvg = new Resvg(svgs[i], { fitTo: { mode: 'width', value: 1200 } })
    const png = Buffer.from(resvg.render().asPng())

    const fileName = `${slug}-${i}.png`
    const { error } = await supabase.storage
      .from('blog-images')
      .upload(fileName, png, { contentType: 'image/png', upsert: true })

    if (error) throw new Error(`Storage upload greška: ${error.message}`)

    const { data } = supabase.storage.from('blog-images').getPublicUrl(fileName)
    urls.push(data.publicUrl)
  }

  return { coverUrl: urls[0], img1Url: urls[1], img2Url: urls[2] }
}

// ── Ubaci slike u HTML sadržaj članka ────────────────────────────────────────

export function injectGeneratedImages(
  html: string,
  img1Url: string,
  img2Url: string
): string {
  const h2Regex = /<h2[^>]*>/g
  const positions: number[] = []
  let m: RegExpExecArray | null
  while ((m = h2Regex.exec(html)) !== null) positions.push(m.index)

  if (positions.length === 0) return html

  const insertions: { pos: number; url: string }[] = []
  if (positions[0] !== undefined) insertions.push({ pos: positions[0], url: img1Url })
  if (positions[2] !== undefined) insertions.push({ pos: positions[2], url: img2Url })
  insertions.sort((a, b) => b.pos - a.pos)

  let result = html
  for (const { pos, url } of insertions) {
    const imgHtml = `\n<figure class="blog-image"><img src="${url}" alt="" loading="lazy" width="1200" height="630" /></figure>\n`
    result = result.slice(0, pos) + imgHtml + result.slice(pos)
  }
  return result
}
