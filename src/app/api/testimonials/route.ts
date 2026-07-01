import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  const service = await createServiceClient()
  const { data, error } = await service
    .from('testimonials')
    .select('id, full_name, role, quote, rating')
    .eq('is_published', true)
    .order('published_at', { ascending: false })

  if (error) return NextResponse.json({ testimonials: [] })
  return NextResponse.json({ testimonials: data ?? [] })
}
