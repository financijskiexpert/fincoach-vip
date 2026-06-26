import { NextRequest, NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  // Verify user is authenticated
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Neovlašteni pristup.' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const day = searchParams.get('day')
  if (!day) return NextResponse.json({ error: 'Parametar day je obavezan.' }, { status: 400 })

  const dayNumber = parseInt(day, 10)
  if (isNaN(dayNumber)) return NextResponse.json({ error: 'Parametar day mora biti broj.' }, { status: 400 })

  // Use service client to bypass RLS
  const service = await createServiceClient()

  // Find lesson by day_number for course 'volim-svoj-novac'
  const { data: lesson, error } = await service
    .from('lessons')
    .select('*, courses!inner(slug)')
    .eq('day_number', dayNumber)
    .eq('courses.slug', 'volim-svoj-novac')
    .single()

  if (error || !lesson) {
    // Fallback: fetch by day_number only (if course join fails)
    const { data: lessonFallback, error: fallbackError } = await service
      .from('lessons')
      .select('*')
      .eq('day_number', dayNumber)
      .single()

    if (fallbackError || !lessonFallback) {
      return NextResponse.json({ lesson: null })
    }
    return NextResponse.json({ lesson: lessonFallback })
  }

  return NextResponse.json({ lesson })
}
