import { NextRequest, NextResponse } from 'next/server'
import { readFileSync } from 'fs'
import path from 'path'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const format = searchParams.get('format') ?? 'ig-a'

  const allowed = ['ig-a','ig-b','story-a','story-b','fb-a','fb-b','whatsapp-a','whatsapp-b']
  if (!allowed.includes(format)) {
    return NextResponse.json({ error: 'Invalid format' }, { status: 400 })
  }

  try {
    const filePath = path.join(process.cwd(), 'public', 'creatives', `fincoach-${format}.png`)
    const png = readFileSync(filePath)
    return new NextResponse(new Uint8Array(png), {
      headers: {
        'Content-Type': 'image/png',
        'Content-Disposition': `attachment; filename="fincoach-${format}.png"`,
        'Cache-Control': 'public, max-age=86400',
      },
    })
  } catch (err) {
    console.error('Creative not found:', err)
    return NextResponse.json({ error: 'Creative not found' }, { status: 404 })
  }
}
