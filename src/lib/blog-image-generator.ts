import { Resvg } from '@resvg/resvg-js'
import { createServiceClient } from './supabase/server'

const NAVY = '#0D1B3E'
const GOLD = '#D4AF37'
const WHITE = '#FFFFFF'
const DIM = 'rgba(255,255,255,0.12)'

// Deterministic seed iz sluga
function slugSeed(s: string): number {
  let h = 5381
  for (let i = 0; i < s.length; i++) h = (Math.imul(31, h) + s.charCodeAt(i)) | 0
  return Math.abs(h)
}

function seedRands(seed: number, n: number): number[] {
  const out: number[] = []
  let s = seed >>> 0
  for (let i = 0; i < n; i++) {
    s = (Math.imul(1664525, s) + 1013904223) >>> 0
    out.push(s / 0xffffffff)
  }
  return out
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

function renderTitle(title: string, x = 80, yStart = 52): string {
  const lines = wrapText(escXml(title))
  return lines.map((l, i) =>
    `<text x="${x}" y="${yStart + i * 44}" font-family="system-ui,sans-serif" font-size="${i === 0 ? 38 : 34}" font-weight="800" fill="${WHITE}">${l}</text>`
  ).join('\n')
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

// ── Chart types ─────────────────────────────────────────────────────────────

function barChart(title: string, seed: number): string {
  const r = seedRands(seed, 7)
  const W = 1200, H = 630
  const cX = 80, cY = 155, cW = W - 160, cH = H - 290
  const months = ['Sij', 'Vel', 'Ožu', 'Tra', 'Svi', 'Lip', 'Srp']
  const vals = r.map(v => 600 + Math.round(v * 3800))
  const maxV = Math.max(...vals)
  const bW = Math.floor(cW / 7) - 16

  const bars = months.map((m, i) => {
    const bH = Math.round((vals[i] / maxV) * cH)
    const x = cX + i * Math.floor(cW / 7) + 8
    const y = cY + cH - bH
    const highlight = vals[i] === maxV
    return [
      `<rect x="${x}" y="${y}" width="${bW}" height="${bH}" rx="7" fill="${highlight ? GOLD : DIM}"/>`,
      `<text x="${x + bW / 2}" y="${y - 12}" text-anchor="middle" font-family="system-ui" font-size="19" font-weight="${highlight ? '700' : '400'}" fill="${highlight ? GOLD : 'rgba(255,255,255,0.7)'}">€${(vals[i] / 1000).toFixed(1)}k</text>`,
      `<text x="${x + bW / 2}" y="${cY + cH + 30}" text-anchor="middle" font-family="system-ui" font-size="16" fill="rgba(255,255,255,0.5)">${m}</text>`,
    ].join('\n')
  }).join('\n')

  return `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
<rect width="${W}" height="${H}" fill="${NAVY}"/>
<rect width="7" height="${H}" fill="${GOLD}"/>
${renderTitle(title)}
<text x="${W - 80}" y="52" text-anchor="end" font-family="system-ui" font-size="19" fill="${GOLD}">${categoryLabel(null)}</text>
${bars}
<line x1="${cX}" y1="${cY + cH}" x2="${cX + cW}" y2="${cY + cH}" stroke="rgba(255,255,255,0.15)" stroke-width="2"/>
</svg>`
}

function lineChart(title: string, cat: string | null | undefined, seed: number): string {
  const r = seedRands(seed, 12)
  const W = 1200, H = 630
  const cX = 80, cY = 145, cW = W - 160, cH = H - 270

  const pts = r.map((v, i) => {
    const trend = i / 11
    return Math.round(40 + trend * 700 + v * 160 - 80)
  })
  const minP = Math.min(...pts), maxP = Math.max(...pts)

  const coords = pts.map((p, i) => {
    const x = cX + (i / 11) * cW
    const y = cY + cH - ((p - minP) / (maxP - minP + 1)) * cH
    return [Math.round(x), Math.round(y)]
  })

  const poly = coords.map(c => c.join(',')).join(' ')
  const area = `${cX},${cY + cH} ${poly} ${cX + cW},${cY + cH}`
  const last = coords[coords.length - 1]
  const growth = Math.round(r[0] * 120 + 45)

  return `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
<defs>
  <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="${GOLD}" stop-opacity="0.28"/>
    <stop offset="100%" stop-color="${GOLD}" stop-opacity="0.02"/>
  </linearGradient>
</defs>
<rect width="${W}" height="${H}" fill="${NAVY}"/>
<rect width="7" height="${H}" fill="${GOLD}"/>
${renderTitle(title)}
<text x="${W - 80}" y="52" text-anchor="end" font-family="system-ui" font-size="19" fill="${GOLD}">${categoryLabel(cat)}</text>
<polygon points="${area}" fill="url(#g)"/>
<polyline points="${poly}" fill="none" stroke="${GOLD}" stroke-width="4" stroke-linejoin="round" stroke-linecap="round"/>
<circle cx="${last[0]}" cy="${last[1]}" r="10" fill="${GOLD}"/>
<text x="${last[0] + 16}" y="${last[1] + 6}" font-family="system-ui" font-size="22" font-weight="700" fill="${GOLD}">+${growth}%</text>
<line x1="${cX}" y1="${cY + cH}" x2="${cX + cW}" y2="${cY + cH}" stroke="rgba(255,255,255,0.15)" stroke-width="2"/>
</svg>`
}

function donutChart(title: string, cat: string | null | undefined, seed: number): string {
  const r = seedRands(seed, 5)
  const W = 1200, H = 630
  const cx = Math.round(W * 0.36), cy = Math.round(H / 2), OR = 165, IR = 100

  const segments = [
    { label: 'Štednja', color: GOLD },
    { label: 'Troškovi', color: '#4A90D9' },
    { label: 'Investicije', color: '#2ECC71' },
    { label: 'Osiguranje', color: '#E67E22' },
    { label: 'Slobodno', color: '#9B59B6' },
  ]
  const rawVals = r.map(v => 10 + Math.round(v * 38))
  const total = rawVals.reduce((s, v) => s + v, 0)
  const pcts = rawVals.map(v => v / total)

  let angle = -Math.PI / 2
  const paths = segments.map((seg, i) => {
    const start = angle
    const end = angle + pcts[i] * 2 * Math.PI
    angle = end
    const x1 = cx + OR * Math.cos(start), y1 = cy + OR * Math.sin(start)
    const x2 = cx + OR * Math.cos(end), y2 = cy + OR * Math.sin(end)
    const ix1 = cx + IR * Math.cos(start), iy1 = cy + IR * Math.sin(start)
    const ix2 = cx + IR * Math.cos(end), iy2 = cy + IR * Math.sin(end)
    const large = pcts[i] > 0.5 ? 1 : 0
    return `<path d="M${ix1.toFixed(1)},${iy1.toFixed(1)} L${x1.toFixed(1)},${y1.toFixed(1)} A${OR},${OR} 0 ${large},1 ${x2.toFixed(1)},${y2.toFixed(1)} L${ix2.toFixed(1)},${iy2.toFixed(1)} A${IR},${IR} 0 ${large},0 ${ix1.toFixed(1)},${iy1.toFixed(1)}Z" fill="${seg.color}"/>`
  }).join('\n')

  const legendX = Math.round(W * 0.62)
  const legend = segments.map((seg, i) => `
<rect x="${legendX}" y="${135 + i * 68}" width="22" height="22" rx="5" fill="${seg.color}"/>
<text x="${legendX + 34}" y="${152 + i * 68}" font-family="system-ui" font-size="22" fill="${WHITE}">${seg.label}</text>
<text x="${W - 80}" y="${152 + i * 68}" text-anchor="end" font-family="system-ui" font-size="22" font-weight="700" fill="${seg.color}">${Math.round(pcts[i] * 100)}%</text>`
  ).join('\n')

  return `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
<rect width="${W}" height="${H}" fill="${NAVY}"/>
<rect width="7" height="${H}" fill="${GOLD}"/>
${renderTitle(title)}
<text x="${W - 80}" y="52" text-anchor="end" font-family="system-ui" font-size="19" fill="${GOLD}">${categoryLabel(cat)}</text>
${paths}
<circle cx="${cx}" cy="${cy}" r="${IR - 4}" fill="${NAVY}"/>
${legend}
</svg>`
}

function shieldCard(title: string, cat: string | null | undefined, seed: number): string {
  const r = seedRands(seed, 4)
  const W = 1200, H = 630
  const cx = Math.round(W * 0.34), cy = Math.round(H / 2)

  const stats = [
    { label: 'Pokrivenost', val: `${Math.round(85 + r[0] * 14)}%` },
    { label: 'Klijenti', val: `${Math.round(200 + r[1] * 800)}+` },
    { label: 'Iskustvo', val: '30+ god.' },
    { label: 'Isplata', val: `${Math.round(3 + r[2] * 4)} dana` },
  ]
  const cards = stats.map((s, i) => {
    const col = i % 2, row = Math.floor(i / 2)
    const x = Math.round(W * 0.57) + col * 240
    const y = 140 + row * 180
    return `<rect x="${x}" y="${y}" width="220" height="150" rx="14" fill="${DIM}"/>
<text x="${x + 110}" y="${y + 72}" text-anchor="middle" font-family="system-ui" font-size="44" font-weight="800" fill="${GOLD}">${s.val}</text>
<text x="${x + 110}" y="${y + 110}" text-anchor="middle" font-family="system-ui" font-size="18" fill="rgba(255,255,255,0.6)">${s.label}</text>`
  }).join('\n')

  // Shield path
  const sh = `M${cx},${cy - 155} L${cx + 125},${cy - 85} L${cx + 125},${cy + 55} Q${cx + 125},${cy + 125} ${cx},${cy + 162} Q${cx - 125},${cy + 125} ${cx - 125},${cy + 55} L${cx - 125},${cy - 85}Z`

  return `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
<rect width="${W}" height="${H}" fill="${NAVY}"/>
<rect width="7" height="${H}" fill="${GOLD}"/>
${renderTitle(title)}
<text x="${W - 80}" y="52" text-anchor="end" font-family="system-ui" font-size="19" fill="${GOLD}">${categoryLabel(cat)}</text>
<path d="${sh}" fill="${GOLD}" opacity="0.13"/>
<path d="${sh}" fill="none" stroke="${GOLD}" stroke-width="3" opacity="0.7"/>
<text x="${cx}" y="${cy + 22}" text-anchor="middle" font-family="system-ui" font-size="88" fill="${GOLD}" opacity="0.9">✓</text>
${cards}
</svg>`
}

function staircaseChart(title: string, cat: string | null | undefined, seed: number): string {
  const r = seedRands(seed, 5)
  const W = 1200, H = 630
  const steps = [
    { label: 'Start', sub: 'Osnove' },
    { label: 'Znanje', sub: 'Edukacija' },
    { label: 'Praksa', sub: 'Iskustvo' },
    { label: 'Rast', sub: 'Klijenti' },
    { label: 'Uspjeh', sub: 'Sloboda' },
  ]
  const bW = 162, bH = 68
  const startX = 90, baseY = H - 110

  const bars = steps.map((s, i) => {
    const x = startX + i * (bW + 14)
    const totalH = (i + 1) * bH
    const y = baseY - totalH
    const isTop = i === steps.length - 1
    return `<rect x="${x}" y="${y}" width="${bW}" height="${totalH}" rx="9" fill="${isTop ? GOLD : DIM}"/>
<text x="${x + bW / 2}" y="${y - 16}" text-anchor="middle" font-family="system-ui" font-size="21" font-weight="700" fill="${isTop ? GOLD : WHITE}">${s.label}</text>
<text x="${x + bW / 2}" y="${y + 32}" text-anchor="middle" font-family="system-ui" font-size="15" fill="rgba(255,255,255,0.55)">${s.sub}</text>`
  }).join('\n')

  const lineEnd = startX + steps.length * (bW + 14) - 14
  return `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
<rect width="${W}" height="${H}" fill="${NAVY}"/>
<rect width="7" height="${H}" fill="${GOLD}"/>
${renderTitle(title)}
<text x="${W - 80}" y="52" text-anchor="end" font-family="system-ui" font-size="19" fill="${GOLD}">${categoryLabel(cat)}</text>
${bars}
<line x1="${startX}" y1="${baseY}" x2="${lineEnd}" y2="${baseY}" stroke="rgba(255,255,255,0.15)" stroke-width="2"/>
</svg>`
}

// Odaberi tip grafa na osnovu kategorije i indexa
function buildSvg(title: string, cat: string | null | undefined, slug: string, idx: number): string {
  const seed = slugSeed(slug + String(idx))
  const c = cat ?? ''

  if (c.includes('investiranje')) return lineChart(title, cat, seed)
  if (c.includes('psihologija')) return donutChart(title, cat, seed)
  if (c.includes('osiguranje')) return shieldCard(title, cat, seed)
  if (c.includes('mentorstvo')) return staircaseChart(title, cat, seed)
  // osobne-financije, obiteljske-financije, default: izmjenjujemo bar i line
  return idx % 2 === 0 ? barChart(title, seed) : lineChart(title, cat, seed)
}

// ── Javna funkcija ───────────────────────────────────────────────────────────

export async function generateAndUploadArticleImages(
  title: string,
  category: string | null | undefined,
  slug: string
): Promise<{ coverUrl: string; img1Url: string; img2Url: string }> {
  const supabase = await createServiceClient()
  const urls: string[] = []

  for (let i = 0; i < 3; i++) {
    const svg = buildSvg(title, category, slug, i)
    const resvg = new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } })
    const png = Buffer.from(resvg.render().asPng())

    const fileName = `${slug}-${i}.png`
    const { error } = await supabase.storage
      .from('blog-images')
      .upload(fileName, png, { contentType: 'image/png', upsert: true })

    if (error) throw new Error(`Storage upload failed: ${error.message}`)

    const { data } = supabase.storage.from('blog-images').getPublicUrl(fileName)
    urls.push(data.publicUrl)
  }

  return { coverUrl: urls[0], img1Url: urls[1], img2Url: urls[2] }
}

// Umetne generisane slike u HTML sadržaj umjesto picsuma
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
