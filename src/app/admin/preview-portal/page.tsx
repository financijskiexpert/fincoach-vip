import { redirect } from 'next/navigation'
import { createClient, createServiceClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Eye } from 'lucide-react'

export default async function PreviewPortalPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/prijava')

  const service = await createServiceClient()
  const { data: profile } = await service.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin' && user.email !== 'brane.recek@gmail.com') redirect('/portal')

  // Dohvati affiliate za admina
  const { data: aff } = await service
    .from('affiliates').select('*').eq('user_id', user.id).maybeSingle()

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://fincoach.vip'

  return (
    <div className="max-w-4xl mx-auto p-6 lg:p-8">
      <div className="flex items-center gap-3 mb-8">
        <Eye className="w-6 h-6 text-gold" />
        <div>
          <h1 className="text-2xl font-bold text-white">Preview — pogled studenta</h1>
          <p className="text-white/40 text-sm mt-0.5">Ovo vidiš samo ti kao admin. Ovako izgleda portal za studente.</p>
        </div>
      </div>

      <div className="grid gap-4">

        {/* Portal */}
        <div className="border border-white/10 rounded-xl p-5 bg-navy-50">
          <h3 className="text-white font-semibold mb-1">Student portal</h3>
          <p className="text-white/40 text-sm mb-3">Dashboard s napretkom, lekcijama i certifikatom.</p>
          <div className="flex gap-2">
            <a
              href="/portal/dan/1"
              className="px-4 py-2 bg-gold text-navy font-bold rounded-lg text-sm hover:bg-yellow-400 transition"
            >
              Otvori lekciju 1 →
            </a>
            <a
              href="/portal/certifikat"
              className="px-4 py-2 border border-white/20 text-white rounded-lg text-sm hover:bg-white/5 transition"
            >
              Certifikat
            </a>
          </div>
        </div>

        {/* Affiliate */}
        <div className="border border-white/10 rounded-xl p-5 bg-navy-50">
          <h3 className="text-white font-semibold mb-1">Partnerski program (Affiliate)</h3>
          <p className="text-white/40 text-sm mb-3">Student vidi personalizirani link, kreative i statistike.</p>
          {aff ? (
            <div className="space-y-3">
              <div className="bg-white/5 rounded-lg p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-white/40 text-xs">Tvoj affiliate kod:</span>
                  <span className="font-mono text-gold font-bold">{aff.code}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-white/40 text-xs">Affiliate link:</span>
                  <code className="text-xs text-white/60 break-all">{siteUrl}?ref={aff.code}</code>
                </div>
                <div className="grid grid-cols-3 gap-3 pt-2">
                  {[
                    { label: 'Klikovi', value: aff.total_clicks ?? 0 },
                    { label: 'Zarađeno', value: `€${(Number(aff.total_earned ?? 0) / 100).toFixed(2)}` },
                    { label: 'Prodaja', value: aff.total_sales ?? 0 },
                  ].map(s => (
                    <div key={s.label} className="text-center p-2 bg-white/5 rounded-lg">
                      <p className="text-gold font-bold">{s.value}</p>
                      <p className="text-white/30 text-xs">{s.label}</p>
                    </div>
                  ))}
                </div>
              </div>
              <a
                href="/portal/affiliate"
                className="inline-flex px-4 py-2 bg-gold text-navy font-bold rounded-lg text-sm hover:bg-yellow-400 transition"
              >
                Otvori affiliate stranicu →
              </a>
            </div>
          ) : (
            <div className="bg-white/5 rounded-lg p-4">
              <p className="text-white/40 text-sm mb-3">Nemaš affiliate koda. Kreiraj ga za testiranje:</p>
              <CreateAffiliateForm userId={user.id} adminName={profile?.role === 'admin' ? 'Admin Brane' : user.email!} />
            </div>
          )}
        </div>

        {/* Links */}
        <div className="border border-white/10 rounded-xl p-5 bg-navy-50">
          <h3 className="text-white font-semibold mb-3">Brze veze za testiranje</h3>
          <div className="grid grid-cols-2 gap-2">
            {[
              { href: '/portal/affiliate', label: '🔗 Affiliate stranica (student view)' },
              { href: '/portal/certifikat', label: '🏆 Certifikat stranica' },
              { href: '/portal/dan/1', label: '📹 Dan 1 lekcija' },
              { href: '/portal/kalkulatori', label: '🧮 Financijski kalkulatori' },
              { href: '/affiliate/uvjeti', label: '📄 Uvjeti affiliate programa' },
            ].map(l => (
              <a
                key={l.href}
                href={l.href}
                className="text-sm text-white/60 hover:text-white border border-white/10 rounded-lg px-3 py-2 hover:bg-white/5 transition"
              >
                {l.label}
              </a>
            ))}
          </div>
        </div>

      </div>

      <p className="text-center text-white/20 text-xs mt-8">
        <Link href="/admin" className="hover:text-white/40 transition">← Natrag na admin panel</Link>
      </p>
    </div>
  )
}

function CreateAffiliateForm({ userId, adminName }: { userId: string; adminName: string }) {
  return (
    <form action={async () => {
      'use server'
      const { createServiceClient } = await import('@/lib/supabase/server')
      const service = await createServiceClient()
      const code = adminName.split(' ')[0].toUpperCase().replace(/[^A-Z]/g, '').slice(0, 6) + 'ADM'
      await service.from('affiliates').upsert({
        user_id: userId,
        code,
        commission_percent: 30,
        is_active: true,
      }, { onConflict: 'user_id' })
      const { revalidatePath } = await import('next/cache')
      revalidatePath('/admin/preview-portal')
    }}>
      <button
        type="submit"
        className="px-4 py-2 bg-gold text-navy font-bold rounded-lg text-sm hover:bg-yellow-400 transition"
      >
        Kreiraj moj affiliate kod
      </button>
    </form>
  )
}
