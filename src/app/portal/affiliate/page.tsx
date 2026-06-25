import { redirect } from 'next/navigation'
import { createClient, createServiceClient } from '@/lib/supabase/server'
import AffiliateClient from './AffiliateClient'

export const dynamic = 'force-dynamic'

export default async function PortalAffiliatePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/prijava?redirect=/portal/affiliate')

  const service = await createServiceClient()

  const [purchaseRes, affRes, profileRes] = await Promise.all([
    service.from('purchases').select('id').eq('user_id', user.id).eq('status', 'completed').limit(1).maybeSingle(),
    service.from('affiliates').select('*').eq('user_id', user.id).maybeSingle(),
    service.from('profiles').select('role').eq('id', user.id).maybeSingle(),
  ])

  const isAdmin = profileRes.data?.role === 'admin' || user.email === 'brane.recek@gmail.com'
  const hasPurchase = !!purchaseRes.data || isAdmin
  const affiliate = affRes.data

  let conversions: any[] = []
  if (affiliate?.id) {
    const { data } = await service
      .from('affiliate_conversions')
      .select('id, commission_amount, status, created_at')
      .eq('affiliate_id', affiliate.id)
      .order('created_at', { ascending: false })
      .limit(20)
    conversions = data ?? []
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://fincoach.vip'

  return (
    <AffiliateClient
      hasPurchase={hasPurchase}
      affiliate={affiliate}
      conversions={conversions}
      siteUrl={siteUrl}
    />
  )
}
