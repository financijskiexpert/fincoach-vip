import { NextRequest, NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase/server'
import { getSignedVideoUrl } from '@/lib/r2'

export const dynamic = 'force-dynamic'

const STARTER_VIDEOS: Record<number, string> = {
  1: 'starter/video1.mp4',
  2: 'starter/video2.mp4',
  3: 'starter/video3.mp4',
  // 3: 'starter/video3.mp4',
  // 4: 'starter/video4.mp4',
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const week = parseInt(request.nextUrl.searchParams.get('week') ?? '0', 10)
    const videoKey = STARTER_VIDEOS[week]
    if (!videoKey) return NextResponse.json({ error: 'Video not found' }, { status: 404 })

    const service = await createServiceClient()

    // Admin ima vedno dostop
    const { data: profile } = await service.from('profiles').select('role').eq('id', user.id).maybeSingle()
    const isAdmin = profile?.role === 'admin' || user.email === 'brane.recek@gmail.com'

    if (!isAdmin) {
      // Preveri Starter nakup
      const { data: purchase } = await service
        .from('starter_purchases')
        .select('id')
        .eq('email', user.email)
        .eq('status', 'completed')
        .limit(1)
        .maybeSingle()

      if (!purchase) return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    const url = await getSignedVideoUrl(videoKey, 3600)
    return NextResponse.json({ url })
  } catch (err) {
    console.error('Starter video URL error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
