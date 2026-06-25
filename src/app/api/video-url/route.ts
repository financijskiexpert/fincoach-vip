import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
import { createClient, createServiceClient } from '@/lib/supabase/server'
import { getSignedVideoUrl } from '@/lib/r2'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const videoKey = searchParams.get('key')

    if (!videoKey) {
      return NextResponse.json({ error: 'Missing video key' }, { status: 400 })
    }

    const service = await createServiceClient()

    // Najdi lekcijo po video_key
    const { data: lesson } = await service
      .from('lessons')
      .select('course_id')
      .eq('video_key', videoKey)
      .maybeSingle()

    if (!lesson) {
      return NextResponse.json({ error: 'Video not found' }, { status: 404 })
    }

    // Admin ima dostop do vseh videov
    const { data: profile } = await service
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .maybeSingle()
    const isAdmin = profile?.role === 'admin' || user.email === 'brane.recek@gmail.com'

    if (!isAdmin) {
      // Sicer mora imeti completed purchase tečaja
      const { data: purchase } = await service
        .from('purchases')
        .select('id')
        .eq('user_id', user.id)
        .eq('course_id', lesson.course_id)
        .eq('status', 'completed')
        .limit(1)
        .maybeSingle()

      if (!purchase) {
        return NextResponse.json({ error: 'Access denied' }, { status: 403 })
      }
    }

    const url = await getSignedVideoUrl(videoKey, 3600)
    return NextResponse.json({ url })
  } catch (error) {
    console.error('Video URL error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
