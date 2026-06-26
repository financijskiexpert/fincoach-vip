import { NextRequest, NextResponse } from 'next/server'
import { Resvg } from '@resvg/resvg-js'
import path from 'path'
import { buildCreativeSvg } from '@/lib/creative-svg'

export const dynamic = 'force-dynamic'
export const maxDuration = 30

const fontsDir = path.join(process.cwd(), 'node_modules', '@fontsource', 'inter', 'files')

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const format = searchParams.get('format') ?? 'ig-a'
  const svg = buildCreativeSvg(format)

  try {
    const resvg = new Resvg(svg, {
      font: {
        fontFiles: [
          path.join(fontsDir, 'inter-latin-400-normal.woff2'),
          path.join(fontsDir, 'inter-latin-700-normal.woff2'),
          path.join(fontsDir, 'inter-latin-900-normal.woff2'),
        ],
        loadSystemFonts: false,
        defaultFontFamily: 'Inter',
      },
      fitTo: { mode: 'original' },
    })
    const pngBuffer = resvg.render().asPng()
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
