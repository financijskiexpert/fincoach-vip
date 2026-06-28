import Anthropic from '@anthropic-ai/sdk'
import { Resvg } from '@resvg/resvg-js'
import sharp from 'sharp'
import { createServiceClient } from './supabase/server'

const NAVY = '#0D1B3E'
const GOLD = '#D4AF37'
const WHITE = '#FFFFFF'
const DIM = 'rgba(255,255,255,0.12)'

function getAnthropicClient(): Anthropic {
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

// ── Pexels query po kategoriji i poziciji slike ───────────────────────────────

function buildPexelsQuery(category: string | null | undefined, imageIndex: number): string {
  const cat = category ?? ''
  const bank: Record<string, string[]> = {
    'osobne-financije':     ['personal finance savings money jar', 'budget planning notebook desk', 'money management lifestyle'],
    'investiranje':         ['investment portfolio financial growth', 'stock market trading success', 'money investment wealth'],
    'psihologija-novca':    ['mindset success confidence person', 'positive thinking motivation lifestyle', 'growth mindset achievement'],
    'osiguranje':           ['family protection insurance safety', 'life insurance family security home', 'protection safety umbrella family'],
    'mentorstvo':           ['business mentor coaching professional', 'career development leadership', 'business success meeting team'],
    'obiteljske-financije': ['family financial planning home', 'family together happy lifestyle', 'family budget kitchen table'],
  }
  for (const [k, v] of Object.entries(bank)) {
    if (cat === k || cat.includes(k)) return v[imageIndex % v.length]
  }
  const fallbacks = ['financial freedom success lifestyle', 'personal finance money growth', 'wealth success achievement']
  return fallbacks[imageIndex % fallbacks.length]
}

// ── Pexels API — realna fotografija ──────────────────────────────────────────

async function fetchAndResizePexelsPhoto(query: string, seed: number): Promise<Buffer | null> {
  const apiKey = process.env.PEXELS_API_KEY
  if (!apiKey) return null

  try {
    const res = await fetch(
      `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=10&orientation=landscape&size=large`,
      { headers: { Authorization: apiKey } }
    )
    if (!res.ok) {
      console.error(`Pexels API greška: ${res.status}`)
      return null
    }

    const data = (await res.json()) as {
      photos: Array<{ src: { large2x: string; large: string; original: string } }>
    }
    if (!data.photos?.length) {
      console.error(`Pexels: nema rezultata za "${query}"`)
      return null
    }

    const photo = data.photos[seed % data.photos.length]
    const imgUrl = photo.src.large2x || photo.src.large || photo.src.original

    const imgRes = await fetch(imgUrl)
    if (!imgRes.ok) return null

    const raw = Buffer.from(await imgRes.arrayBuffer())
    const resized = await sharp(raw)
      .resize(1200, 630, { fit: 'cover', position: 'center' })
      .jpeg({ quality: 90 })
      .toBuffer()

    console.log(`  Pexels fotografija: ${resized.length / 1024 | 0} KB`)
    return resized
  } catch (err) {
    console.error('Pexels fetch greška:', err)
    return null
  }
}

// ── Fallback SVG (deterministički, ako sve ostalo padne) ──────────────────────

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

function fallbackSvg(title: string, cat: string | null | undefined, seed: number): string {
  let s = (seed >>> 0)
  const rand = () => { s = (Math.imul(1664525, s) + 1013904223) >>> 0; return s / 0xffffffff }
  const lines = wrapText(escXml(title))
  const titleSvg = lines.map((l, i) =>
    `<text x="80" y="${52 + i * 44}" font-family="system-ui,sans-serif" font-size="${i === 0 ? 38 : 34}" font-weight="800" fill="${WHITE}">${l}</text>`
  ).join('\n')
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

// ── Claude Haiku fallback SVG (samo ako Pexels padne) ────────────────────────

async function generateSvgFallback(
  title: string,
  excerpt: string | null | undefined,
  category: string | null | undefined,
  imageIndex: number,
  seed: number
): Promise<Buffer> {
  const client = getAnthropicClient()
  const catLabel = categoryLabel(category)
  const imageRole = imageIndex === 0
    ? 'naslovna slika (cover)'
    : imageIndex === 1 ? 'ilustracija za prvu sekciju' : 'ilustracija za drugu sekciju'

  const prompt = `Napravi SVG ilustraciju za blog članak o osobnim financijama.
ČLANAK: "${title}" (${catLabel})${excerpt ? `\n${excerpt}` : ''}
Uloga: ${imageRole}
TEHNIČKE SPECIFIKACIJE:
- viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg"
- Pozadina: <rect width="1200" height="630" fill="${NAVY}"/>
- Zlatna lijeva traka: <rect width="7" height="630" fill="${GOLD}"/>
- Akcent boja: ${GOLD}, tekst bijeli (#FFFFFF)
- Naslov gornji lijevi kut (x=80, y=52, font-size=36, font-weight=800)
- Kategorija desno gore (x=1120, y=52, text-anchor=end, font-size=18, fill=${GOLD})
- Vizualizacija specifična za temu počinje od y=130
SVG ELEMENTI: rect, circle, ellipse, line, polyline, polygon, path, text, g, defs, linearGradient, stop
ZABRANJENO: filter, feGaussianBlur, mask, foreignObject, animacije
font-family: uvijek "system-ui,sans-serif"
Vrati SAMO SVG kod.`

  try {
    const msg = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 3500,
      messages: [{ role: 'user', content: prompt }],
    })
    const raw = msg.content
      .filter((b): b is Anthropic.TextBlock => b.type === 'text')
      .map(b => b.text).join('').trim()
    const match = raw.match(/<svg[\s\S]*?<\/svg>/i)
    if (!match) throw new Error('Claude nije vratio SVG')
    const resvg = new Resvg(match[0], { fitTo: { mode: 'width', value: 1200 } })
    const png = Buffer.from(resvg.render().asPng())
    return sharp(png).jpeg({ quality: 88 }).toBuffer()
  } catch (err) {
    console.error(`Claude SVG fallback (img ${imageIndex}):`, err)
    const svg = fallbackSvg(title, category, seed + imageIndex)
    const resvg = new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } })
    const png = Buffer.from(resvg.render().asPng())
    return sharp(png).jpeg({ quality: 88 }).toBuffer()
  }
}

// ── Deterministički seed ──────────────────────────────────────────────────────

function strSeed(s: string): number {
  let h = 5381
  for (let i = 0; i < s.length; i++) h = (Math.imul(31, h) + s.charCodeAt(i)) | 0
  return Math.abs(h)
}

// ── Javna funkcija ────────────────────────────────────────────────────────────

export async function generateAndUploadArticleImages(
  title: string,
  category: string | null | undefined,
  slug: string,
  excerpt?: string | null
): Promise<{ coverUrl: string; img1Url: string; img2Url: string }> {
  const supabase = await createServiceClient()
  const seed = strSeed(slug)

  const buffers = await Promise.all([0, 1, 2].map(async (i) => {
    // 1. Pokušaj Pexels realnu fotografiju
    const query = buildPexelsQuery(category, i)
    const pexels = await fetchAndResizePexelsPhoto(query, seed + i)
    if (pexels) return pexels

    // 2. Fallback: Claude SVG ilustracija
    console.warn(`Pexels nije dostupan za img ${i}, koristim Claude SVG fallback`)
    return generateSvgFallback(title, excerpt, category, i, seed)
  }))

  const urls: string[] = []
  for (let i = 0; i < 3; i++) {
    const fileName = `${slug}-${i}.jpg`
    const { error } = await supabase.storage
      .from('blog-images')
      .upload(fileName, buffers[i], { contentType: 'image/jpeg', upsert: true })

    if (error) throw new Error(`Storage upload greška: ${error.message}`)

    const { data } = supabase.storage.from('blog-images').getPublicUrl(fileName)
    urls.push(data.publicUrl)
  }

  return { coverUrl: urls[0], img1Url: urls[1], img2Url: urls[2] }
}

// ── Ubaci slike u HTML sadržaj članka ────────────────────────────────────────

export function injectGeneratedImages(html: string, img1Url: string, img2Url: string): string {
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
