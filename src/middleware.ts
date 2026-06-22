import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) {
          // Update request cookies so server components see refreshed token
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          // Rebuild supabaseResponse so refreshed cookies are forwarded
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Single getUser() call — refreshes session if needed, sets cookies via setAll
  const { data: { user } } = await supabase.auth.getUser()

  // ── Affiliate ref tracking ──────────────────────────────────────────
  const ref = request.nextUrl.searchParams.get('ref')
  if (ref) {
    supabaseResponse.cookies.set('aff_ref', ref.toUpperCase(), {
      maxAge: 60 * 60 * 24 * 30,
      path: '/',
      httpOnly: false,
      sameSite: 'lax',
    })
  }

  // ── Protect /portal and /admin routes ──────────────────────────────
  const { pathname } = request.nextUrl
  if (pathname.startsWith('/portal') || pathname.startsWith('/admin')) {
    if (!user) {
      const loginUrl = new URL('/prijava', request.url)
      if (pathname.startsWith('/admin')) loginUrl.searchParams.set('redirect', '/admin')
      const redirectResponse = NextResponse.redirect(loginUrl)
      // Forward any refreshed session cookies to the redirect response
      supabaseResponse.cookies.getAll().forEach(cookie =>
        redirectResponse.cookies.set(cookie.name, cookie.value, cookie)
      )
      return redirectResponse
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api/|.*\\..*).*)'],
}
