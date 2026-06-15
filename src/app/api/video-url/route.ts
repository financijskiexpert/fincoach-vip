import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
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

    // Verify user has purchased the course that contains this video
    const { data: lesson } = await supabase
      .from('lessons')
      .select('course_id')
      .eq('video_key', videoKey)
      .single()

    if (!lesson) {
      return NextResponse.json({ error: 'Video not found' }, { status: 404 })
    }

    const { data: purchase } = await supabase
      .from('purchases')
      .select('id')
      .eq('user_id', user.id)
      .eq('course_id', lesson.course_id)
      .eq('status', 'completed')
      .single()

    if (!purchase) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    const url = await getSignedVideoUrl(videoKey, 3600)
    return NextResponse.json({ url })
  } catch (error) {
    console.error('Video URL error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
