import { NextRequest, NextResponse } from 'next/server'
import sharp from 'sharp'

export const dynamic = 'force-dynamic'
export const maxDuration = 30

/**
 * Generira PNG kreativu za affiliate.
 * Format: ?format=square|story|fb|whatsapp&variant=a|b
 *
 * Link NI na sliki (zaštita pred prepisovanjem URL-a).
 * Affiliate svoj link postavi v tekst objave / bio (kjer je tracking).
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const format = searchParams.get('format') ?? 'square'
  const variant = searchParams.get('variant') ?? 'a'
  const asSvg = searchParams.get('svg') === '1'

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
    : 'Financijska transformacija u 90 dana.'

  const ctaText = 'Pogledaj link u opisu →'

  const isStory = format === 'story'
  const isFb = format === 'fb'

  const hSize = isFb ? 64 : isStory ? 96 : 88
  const subSize = isFb ? 22 : isStory ? 34 : 30
  const ctaSize = isFb ? 22 : isStory ? 28 : 26
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
    <radialGradient id="glow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="${gold}" stop-opacity="0.12"/>
      <stop offset="100%" stop-color="${gold}" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#bg)"/>
  <ellipse cx="${w / 2}" cy="${h / 2}" rx="${w / 1.5}" ry="${h / 2}" fill="url(#glow)"/>

  <!-- Gold accent line top-left -->
  <line x1="${padding}" y1="${padding + 50}" x2="${padding + 60}" y2="${padding + 50}" stroke="${gold}" stroke-width="3"/>

  <!-- Brand mark -->
  <text x="${padding}" y="${padding + 40}" fill="${gold}" font-family="Arial, Helvetica, sans-serif" font-size="${isFb ? 22 : 28}" font-weight="900" letter-spacing="3">FINCOACH VIP</text>

  <!-- Headline -->
  ${headlineLines.map((line, i) => `<text x="${padding}" y="${headlineY + i * (hSize + 12)}" fill="white" font-family="Georgia, 'Times New Roman', serif" font-size="${hSize}" font-weight="900" letter-spacing="-1">${escapeXml(line)}</text>`).join('\n  ')}

  <!-- Subline -->
  <text x="${padding}" y="${headlineY + headlineLines.length * (hSize + 12) + 30}" fill="rgba(255,255,255,0.78)" font-family="Arial, Helvetica, sans-serif" font-size="${subSize}" font-weight="400">${escapeXml(subline)}</text>

  <!-- CTA (NO URL — affiliate stavi svoj link v opisu objave) -->
  <text x="${padding}" y="${h - padding}" fill="${gold}" font-family="Arial, Helvetica, sans-serif" font-size="${ctaSize}" font-weight="800">${escapeXml(ctaText)}</text>
</svg>`

  if (asSvg) {
    return new NextResponse(svg, {
      headers: {
        'Content-Type': 'image/svg+xml',
        'Content-Disposition': `attachment; filename="fincoach-${format}-${variant}.svg"`,
        'Cache-Control': 'public, max-age=86400',
      },
    })
  }

  // Convert SVG → PNG via sharp
  try {
    const pngBuffer = await sharp(Buffer.from(svg))
      .png({ quality: 90, compressionLevel: 8 })
      .toBuffer()

    return new NextResponse(new Uint8Array(pngBuffer), {
      headers: {
        'Content-Type': 'image/png',
        'Content-Disposition': `attachment; filename="fincoach-${format}-${variant}.png"`,
        'Cache-Control': 'public, max-age=86400',
      },
    })
  } catch (err) {
    console.error('SVG→PNG conversion error:', err)
    return NextResponse.json({ error: 'Conversion failed' }, { status: 500 })
  }
}

function escapeXml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}
