import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: { code: string } }
) {
  const code = params.code.toUpperCase()
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://fincoach.vip'

  const response = NextResponse.redirect(`${siteUrl}/volim-svoj-novac?ref=${code}`, { status: 302 })

  // Set affiliate cookie — 30 days
  response.cookies.set('aff_ref', code, {
    maxAge: 60 * 60 * 24 * 30,
    path: '/',
    httpOnly: false,
    sameSite: 'lax',
  })

  return response
}
