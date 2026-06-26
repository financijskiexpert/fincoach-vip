import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

/**
 * Generira SVG kreativu z affiliate kodom.
 * Format: ?format=square|story|fb|whatsapp&code=BRANE2026&variant=a|b
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const format = searchParams.get('format') ?? 'square'
  const code = (searchParams.get('code') ?? 'PARTNER').toUpperCase()
  const variant = searchParams.get('variant') ?? 'a'

  const dims: Record<string, { w: number; h: number }> = {
    square: { w: 1080, h: 1080 },
    story: { w: 1080, h: 1920 },
    fb: { w: 1200, h: 628 },
    whatsapp: { w: 800, h: 800 },
  }
  const { w, h } = dims[format] ?? dims.square

  // Brand barve
  const navy = '#0D1B2A'
  const navyLight = '#1a2f47'
  const gold = '#D4AF37'

  const headlineA = '90 dana koja\nmijenjaju sve.'
  const headlineB = 'Volim\nsvoj novac.'
  const headline = variant === 'b' ? headlineB : headlineA

  const subline = variant === 'b'
    ? '90 video lekcija. Korak po korak. Bez stresa.'
    : 'FinCoach VIP — financijska transformacija u 90 dana.'

  const url = `fincoach.vip?ref=${code}`

  // Layout: store/square — center hero; FB — left-right split
  const isStory = format === 'story'
  const isFb = format === 'fb'

  const hSize = isFb ? 64 : isStory ? 96 : 88
  const subSize = isFb ? 22 : isStory ? 34 : 30
  const urlSize = isFb ? 22 : isStory ? 30 : 28
  const padding = isFb ? 50 : 80

  const headlineLines = headline.split('\n')
  const headlineY = isStory ? h * 0.42 : h * 0.42

  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${navy}"/>
      <stop offset="100%" stop-color="${navyLight}"/>
    </linearGradient>
    <linearGradient id="goldGrad" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="${gold}"/>
      <stop offset="100%" stop-color="#F5D061"/>
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#bg)"/>

  <!-- Decorative gold lines -->
  <line x1="${padding}" y1="${padding + 50}" x2="${padding + 60}" y2="${padding + 50}" stroke="${gold}" stroke-width="3"/>

  <!-- Brand mark -->
  <text x="${padding}" y="${padding + 40}" fill="${gold}" font-family="Arial, sans-serif" font-size="${isFb ? 22 : 28}" font-weight="800" letter-spacing="3">FINCOACH VIP</text>

  <!-- Headline -->
  ${headlineLines.map((line, i) => `<text x="${padding}" y="${headlineY + i * (hSize + 12)}" fill="white" font-family="Georgia, 'Times New Roman', serif" font-size="${hSize}" font-weight="900" letter-spacing="-1">${escapeXml(line)}</text>`).join('\n  ')}

  <!-- Subline -->
  <text x="${padding}" y="${headlineY + headlineLines.length * (hSize + 12) + 30}" fill="rgba(255,255,255,0.75)" font-family="Arial, sans-serif" font-size="${subSize}" font-weight="400">${escapeXml(subline)}</text>

  <!-- Bottom bar with URL -->
  <rect x="0" y="${h - 110}" width="${w}" height="110" fill="${gold}"/>
  <text x="${padding}" y="${h - 65}" fill="${navy}" font-family="Arial, sans-serif" font-size="${urlSize}" font-weight="800">${escapeXml(url)}</text>
  <text x="${padding}" y="${h - 32}" fill="${navy}" font-family="Arial, sans-serif" font-size="${urlSize - 6}" font-weight="600">10% popusta + doživotni pristup</text>
</svg>`

  return new NextResponse(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Content-Disposition': `attachment; filename="fincoach-${format}-${variant}-${code}.svg"`,
      'Cache-Control': 'public, max-age=3600',
    },
  })
}

function escapeXml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}
