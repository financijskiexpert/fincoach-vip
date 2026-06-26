import { NextRequest, NextResponse } from 'next/server'
import sharp from 'sharp'
import { buildCreativeSvg } from '@/lib/creative-svg'

export const dynamic = 'force-dynamic'
export const maxDuration = 30

/**
 * Generira PNG kreativu za affiliate (z embedanim Inter fontom).
 * Format: ?format=ig-a|ig-b|story-a|story-b|fb-a|fb-b|whatsapp-a|whatsapp-b
 *
 * Link NIJE na sliki — affiliate ga postavlja u tekst objave / bio (tracking).
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const format = searchParams.get('format') ?? 'ig-a'
  const svg = buildCreativeSvg(format)

  try {
    const pngBuffer = await sharp(Buffer.from(svg), { density: 150 })
      .png({ quality: 92, compressionLevel: 8 })
      .toBuffer()
    return new NextResponse(new Uint8Array(pngBuffer), {
      headers: {
        'Content-Type': 'image/png',
        'Content-Disposition': `attachment; filename="fincoach-${format}.png"`,
        'Cache-Control': 'public, max-age=86400',
      },
    })
  } catch (err) {
    console.error('SVG→PNG conversion error:', err)
    return NextResponse.json({ error: 'Conversion failed' }, { status: 500 })
  }
}
