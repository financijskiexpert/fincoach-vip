'use client'

import { useEffect, useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface AffiliateData {
  id: string
  name: string
  code: string
  commission_percent: number
  total_sales: number
  total_commission: number
  total_conversions: number
  is_active: boolean
}

interface Conversion {
  id: string
  commission_amount: number
  status: string
  created_at: string
}

export default function PortalAffiliatePage() {
  const router = useRouter()
  const [affiliate, setAffiliate] = useState<AffiliateData | null>(null)
  const [conversions, setConversions] = useState<Conversion[]>([])
  const [loading, setLoading] = useState(true)
  const [applying, setApplying] = useState(false)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState('')
  const [hasPurchase, setHasPurchase] = useState(false)

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://fincoach.vip'

  useEffect(() => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/prijava'); return }

      // Check purchase
      const { data: purchase } = await supabase
        .from('purchases')
        .select('id')
        .eq('user_id', user.id)
        .eq('status', 'completed')
        .single()
      setHasPurchase(!!purchase)

      // Check if already affiliate
      const { data: aff } = await supabase
        .from('affiliates')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (aff) {
        setAffiliate(aff)
        const { data: convs } = await supabase
          .from('affiliate_conversions')
          .select('*')
          .eq('affiliate_id', aff.id)
          .order('created_at', { ascending: false })
          .limit(20)
        setConversions(convs ?? [])
      }
      setLoading(false)
    }
    load()
  }, [router])

  async function handleApply() {
    setApplying(true)
    setError('')
    try {
      const res = await fetch('/api/affiliate/apply', { method: 'POST' })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Greška.')
      // Reload
      window.location.reload()
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Greška.')
    } finally {
      setApplying(false)
    }
  }

  function copyLink() {
    if (!affiliate) return
    navigator.clipboard.writeText(`${siteUrl}?ref=${affiliate.code}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
    </div>
  )

  const pendingCommission = conversions
    .filter(c => c.status === 'pending')
    .reduce((s, c) => s + Number(c.commission_amount), 0)
  const paidCommission = conversions
    .filter(c => c.status === 'paid')
    .reduce((s, c) => s + Number(c.commission_amount), 0)

  return (
    <div className="max-w-3xl mx-auto px-6 py-10 text-white">
      <h1 className="text-3xl font-black mb-2">Partnerski program</h1>
      <p className="text-gray-400 mb-8">Zarade preporučujući tečaj prijateljima i pratiteljima.</p>

      {!affiliate ? (
        /* ── Nije još affiliate ─────────────────────────────────── */
        <div>
          {/* Kako funkcionira */}
          <div className="bg-[#091623] border border-white/10 rounded-xl p-6 mb-6">
            <h2 className="text-xl font-bold text-[#D4AF37] mb-5">Kako funkcionira?</h2>
            <div className="space-y-4">
              {[
                { icon: '🔗', title: 'Dobiš unikatnu affiliate vezu', desc: 'Tvoja osobna veza s kodom. Dijeli je gdje god hoćeš — Instagram, Facebook, email, WhatsApp.' },
                { icon: '🎁', title: 'Tvoji prijatelji kupuju s 10% popustom', desc: 'Svaki tko kupi putem tvoje veze automatski dobiva 10% popusta. Oni štede, a ti zarađuješ.' },
                { icon: '💰', title: 'Ti zarađuješ 30% provizije', desc: `Tečaj košta €397. Tvoji pratitelji plaćaju €357 (−10%). Ti zarađuješ €107 po prodaji.` },
                { icon: '📅', title: 'Isplata najkasnije 31. dan od prodaje', desc: 'Provizija se isplaćuje nakon isteka 30-dnevnog roka za povrat. Uvjet: najmanje 2 dozrele prodaje. Isplata SEPA nakazom (HR/SI/SRB) ili Wise (ostali Balkan).' },
              ].map(item => (
                <div key={item.icon} className="flex gap-4">
                  <span className="text-2xl shrink-0">{item.icon}</span>
                  <div>
                    <p className="font-semibold text-white">{item.title}</p>
                    <p className="text-gray-400 text-sm mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Zarada primjer */}
          <div className="bg-[#0D1B2A] border border-[#D4AF37]/30 rounded-xl p-6 mb-6">
            <h3 className="font-bold text-[#D4AF37] mb-4">Koliko možeš zaraditi?</h3>
            <div className="grid grid-cols-3 gap-3 text-center">
              {[
                { sales: '5 prodaja', earn: '€535' },
                { sales: '10 prodaja', earn: '€1.070' },
                { sales: '20 prodaja', earn: '€2.140' },
              ].map(r => (
                <div key={r.sales} className="bg-[#091623] rounded-lg p-4">
                  <div className="text-[#D4AF37] font-black text-xl">{r.earn}</div>
                  <div className="text-gray-500 text-xs mt-1">{r.sales}/mj.</div>
                </div>
              ))}
            </div>
            <p className="text-gray-600 text-xs mt-3 text-center">30% od €357 = €107,10 po prodaji</p>
          </div>

          {error && (
            <div className="bg-red-900/40 border border-red-500 text-red-300 px-4 py-3 rounded-lg mb-4 text-sm">
              {error}
            </div>
          )}

          {hasPurchase ? (
            <button
              onClick={handleApply}
              disabled={applying}
              className="w-full bg-[#D4AF37] text-[#0D1B2A] font-black text-lg py-4 rounded-xl hover:bg-yellow-400 transition disabled:opacity-60"
            >
              {applying ? 'Prijavljujem...' : 'Postani FinCoach partner →'}
            </button>
          ) : (
            <div className="bg-[#091623] border border-white/10 rounded-xl p-6 text-center text-gray-400 text-sm">
              Partnerski program je dostupan kupcima tečaja.
            </div>
          )}

          {/* Uvjeti */}
          <p className="text-center text-gray-600 text-xs mt-4">
            Prijavom prihvaćaš{' '}
            <Link href="/affiliate/uvjeti" className="underline hover:text-gray-400">
              Opće uvjete affiliate programa
            </Link>
          </p>
        </div>
      ) : (
        /* ── Već je affiliate ───────────────────────────────────── */
        <div className="space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: 'Ukupno prodaja', value: `€${Number(affiliate.total_sales).toFixed(0)}` },
              { label: 'Zarađena provizija', value: `€${Number(affiliate.total_commission).toFixed(2)}` },
              { label: 'Konverzije', value: affiliate.total_conversions },
              { label: 'Na čekanju (30d)', value: `€${pendingCommission.toFixed(2)}` },
            ].map(s => (
              <div key={s.label} className="bg-[#091623] border border-white/10 rounded-xl p-4 text-center">
                <div className="text-xl font-black text-[#D4AF37]">{s.value}</div>
                <div className="text-gray-500 text-xs mt-1">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Affiliate link */}
          <div className="bg-[#091623] border border-[#D4AF37]/30 rounded-xl p-6">
            <h2 className="text-lg font-bold text-[#D4AF37] mb-4">Tvoja affiliate veza</h2>
            <div className="flex gap-3 items-center flex-wrap mb-4">
              <div className="flex-1 bg-[#0D1B2A] border border-white/20 rounded-lg px-4 py-3 font-mono text-sm text-gray-300 min-w-0 truncate">
                {siteUrl}?ref={affiliate.code}
              </div>
              <button
                onClick={copyLink}
                className="bg-[#D4AF37] text-[#0D1B2A] font-bold px-5 py-3 rounded-lg hover:bg-yellow-400 transition text-sm whitespace-nowrap"
              >
                {copied ? '✓ Kopirano!' : 'Kopiraj'}
              </button>
            </div>
            <div className="bg-[#0D1B2A] rounded-lg p-4 text-sm space-y-2 text-gray-400">
              <p>✅ Kupci koji kupe putem tvoje veze automatski dobivaju <strong className="text-white">10% popusta</strong></p>
              <p>✅ Ti zarađuješ <strong className="text-white">€107,10</strong> (30%) po svakoj prodaji</p>
              <p>✅ Provizija se isplaćuje <strong className="text-white">najkasnije 31. dan</strong> od kupnje — po isteku roka za povrat</p>
              <p>✅ Uvjet za isplatu: najmanje <strong className="text-white">2 dozrele prodaje</strong></p>
              <p>✅ Isplata SEPA nakazom (HR/SI/SRB) ili Wise (BiH/MNE/MK/AL)</p>
            </div>
          </div>

          {/* Navodila */}
          <div className="bg-[#091623] border border-white/10 rounded-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-white/10">
              <h2 className="font-bold">Kako promovirati — pročitaj prije prve objave</h2>
            </div>
            <div className="divide-y divide-white/5 text-sm">
              {[
                { n: '01', text: 'Preuzmi kreativu za platformu na kojoj objavljuješ i kopiraj pripremljeni tekst ispod — sve je već prilagođeno pravilima svake platforme.', sub: '' },
                { n: '02', text: 'Postavi svoj unikatni link u bio (Instagram, TikTok) ili u komentar (Facebook) — nikad ga ne mijenjaj jer on prati tvoje konverzije.', sub: 'Instagram · TikTok → link u bio   |   Facebook → link u prvom komentaru   |   WhatsApp → direktno u poruku' },
                { n: '03', text: 'Svaka objava mora imati oznaku #ad — to je zakonska obveza u EU i štiti tebe. Hashtag je već uključen u sve tekstove.', sub: '' },
                { n: '04', text: 'Piši iz osobnog iskustva — objave koje govore o tvojoj transformaciji uvijek rade bolje od onih koje govore o popustu. Slobodno prilagodi tekst sebi.', sub: '' },
                { n: '✗', text: 'Nikad ne obećavaj konkretne financijske rezultate ("zarađuj €500 uz ovaj program") — to je zabranjeno i može dovesti do problema s platformom.', sub: '', warn: true },
              ].map((item) => (
                <div key={item.n} className={`px-6 py-4 flex gap-4 ${item.warn ? 'bg-red-950/20' : ''}`}>
                  <span className={`text-sm font-semibold shrink-0 ${item.warn ? 'text-red-400' : 'text-gray-600'}`}>{item.n}</span>
                  <div>
                    <p className={item.warn ? 'text-red-300' : 'text-gray-300'}>{item.text}</p>
                    {item.sub && <p className="text-gray-600 text-xs mt-1">{item.sub}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Materijali za dijeljenje */}
          <div className="bg-[#091623] border border-white/10 rounded-xl p-6">
            <h2 className="text-lg font-bold mb-1">Kreative i tekstovi za objave</h2>
            <p className="text-gray-500 text-sm mb-5">Preuzmi sliku + kopiraj tekst + postavi link u bio. Gotovo.</p>

            <div className="space-y-4">
              {/* Instagram A */}
              <details className="group bg-[#0D1B2A] border border-white/10 rounded-xl">
                <summary className="px-5 py-4 cursor-pointer flex justify-between items-center list-none">
                  <span className="font-semibold text-sm">Instagram — kvadrat 1:1 · Varianta A <span className="text-gray-500 font-normal">(problem → rješenje)</span></span>
                  <span className="text-gray-500 text-xs group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <div className="px-5 pb-5 space-y-3 border-t border-white/10 pt-4">
                  <p className="text-gray-500 text-xs">Preuzmi sliku iz Materijala u portalu, pa kopiraj tekst:</p>
                  <ShareTemplate label="Tekst za Instagram — Varianta A" text={`Na kraju svakog mjeseca postavljam si isto pitanje — kamo je otišao novac?\n\nJer nitko nas nije naučio što s njim raditi. Ni škola, ni roditelji.\n\nFinCoach VIP program to mijenja. Za 90 dana, korak po korak:\n\n✓ Pronađeš gdje ti novac nestaje\n✓ Počneš štedjeti automatski\n✓ Investiraš bez straha\n\nLink u biu vodi direktno na program. 👆\n\n#ad #fincoach #financijskasvoboda #novac #stednja #investiranje #osobnifinancije #financijskaedukacija`} />
                  <ShareTemplate label="Tvoj link — postavi u bio" text={`${siteUrl}/tecaj?ref=${affiliate.code}`} mono />
                </div>
              </details>

              {/* Instagram B */}
              <details className="group bg-[#0D1B2A] border border-white/10 rounded-xl">
                <summary className="px-5 py-4 cursor-pointer flex justify-between items-center list-none">
                  <span className="font-semibold text-sm">Instagram — kvadrat 1:1 · Varianta B <span className="text-gray-500 font-normal">(minimalistica)</span></span>
                  <span className="text-gray-500 text-xs group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <div className="px-5 pb-5 space-y-3 border-t border-white/10 pt-4">
                  <ShareTemplate label="Tekst za Instagram — Varianta B" text={`Nitko me nije naučio što raditi s novcem.\n\nNi škola. Ni roditelji. Ni faksi.\n\nTek kroz FinCoach VIP program shvatio sam kako novac zapravo funkcionira — i promijenilo mi je život.\n\n90 dana. Korak po korak. Link u biu. 👆\n\n#ad #fincoach #financijskasvoboda #novac #stednja #investiranje #osobnifinancije`} />
                  <ShareTemplate label="Tvoj link — postavi u bio" text={`${siteUrl}/tecaj?ref=${affiliate.code}`} mono />
                </div>
              </details>

              {/* Story / TikTok A */}
              <details className="group bg-[#0D1B2A] border border-white/10 rounded-xl">
                <summary className="px-5 py-4 cursor-pointer flex justify-between items-center list-none">
                  <span className="font-semibold text-sm">Instagram Story / TikTok · Varianta A <span className="text-gray-500 font-normal">(vprašanje)</span></span>
                  <span className="text-gray-500 text-xs group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <div className="px-5 pb-5 space-y-3 border-t border-white/10 pt-4">
                  <ShareTemplate label="Tekst za Story / TikTok — Varianta A" text={`Na kraju svakog mjeseca postavljam si isto pitanje — kamo je otišao novac?\n\nJer nitko nas nije naučio što s njim raditi. Ni škola, ni roditelji.\n\nFinCoach VIP program to mijenja. Za 90 dana, korak po korak, naučio sam:\n\n✓ Gdje mi novac "curi" svaki dan\n✓ Kako automatski štedjeti bez odricanja\n✓ Kako početi investirati bez straha\n\nLink u biu vodi direktno na program. 👆\n\n#ad #fincoach #financijskasvoboda #novac #stednja #tiktokfinance #financijskaedukacija`} />
                  <ShareTemplate label="Tvoj link — postavi u bio" text={`${siteUrl}/tecaj?ref=${affiliate.code}`} mono />
                </div>
              </details>

              {/* Story / TikTok B */}
              <details className="group bg-[#0D1B2A] border border-white/10 rounded-xl">
                <summary className="px-5 py-4 cursor-pointer flex justify-between items-center list-none">
                  <span className="font-semibold text-sm">Instagram Story / TikTok · Varianta B <span className="text-gray-500 font-normal">(before/after)</span></span>
                  <span className="text-gray-500 text-xs group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <div className="px-5 pb-5 space-y-3 border-t border-white/10 pt-4">
                  <ShareTemplate label="Tekst za Story / TikTok — Varianta B" text={`Ovo je moja financijska transformacija za 90 dana 👇\n\nPRIJE: novac nestajao, nula štednje, stres na kraju svakog mjeseca.\n\nNAKON FinCoach VIP programa: znam točno kamo ide svaki euro, štedim automatski, počeo sam investirati.\n\nNije magija — to je sustav koji svima može raditi.\n\nLink u biu za direktan pristup programu. 👆\n\n#ad #fincoach #financijskasvoboda #beforeafter #novac #stednja #tiktokfinance`} />
                  <ShareTemplate label="Tvoj link — postavi u bio" text={`${siteUrl}/tecaj?ref=${affiliate.code}`} mono />
                </div>
              </details>

              {/* Facebook A */}
              <details className="group bg-[#0D1B2A] border border-white/10 rounded-xl">
                <summary className="px-5 py-4 cursor-pointer flex justify-between items-center list-none">
                  <span className="font-semibold text-sm">Facebook / LinkedIn · Varianta A <span className="text-gray-500 font-normal">(edukacijska)</span></span>
                  <span className="text-gray-500 text-xs group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <div className="px-5 pb-5 space-y-3 border-t border-white/10 pt-4">
                  <p className="text-yellow-600 text-xs">Na Facebooku link stavi u prvi komentar — tako algoritam ne kažnjava doseg objave.</p>
                  <ShareTemplate label="Tekst za Facebook / LinkedIn — Varianta A" text={`Zašto na kraju svakog mjeseca nikad nema dovoljno?\n\nJer nas nitko nije naučio što raditi s novcem. Ni škola, ni roditelji.\n\nFinCoach VIP program to mijenja — za 90 dana, korak po korak, naučio sam:\n✓ Gdje mi novac zapravo nestaje\n✓ Kako štedjeti automatski, bez odricanja\n✓ Kako početi investirati bez straha\n\nLink u komentarima 👇\n\n#ad #fincoach #financijskasvoboda #novac #osobnifinancije`} />
                  <ShareTemplate label="Tekst za komentar (link)" text={`👉 ${siteUrl}/tecaj?ref=${affiliate.code}`} mono />
                </div>
              </details>

              {/* Facebook B */}
              <details className="group bg-[#0D1B2A] border border-white/10 rounded-xl">
                <summary className="px-5 py-4 cursor-pointer flex justify-between items-center list-none">
                  <span className="font-semibold text-sm">Facebook / LinkedIn · Varianta B <span className="text-gray-500 font-normal">(social proof)</span></span>
                  <span className="text-gray-500 text-xs group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <div className="px-5 pb-5 space-y-3 border-t border-white/10 pt-4">
                  <p className="text-yellow-600 text-xs">Na Facebooku link stavi u prvi komentar — tako algoritam ne kažnjava doseg objave.</p>
                  <ShareTemplate label="Tekst za Facebook / LinkedIn — Varianta B" text={`"Za 90 dana naučio sam više o novcu nego za cijeli život."\n\nNisam ni ja vjerovao dok nisam prošao sam. A onda se sve promijenilo.\n\nAko si spreman — link u komentarima. 👇\n\n#ad #fincoach #financijskasvoboda #novac #osobnifinancije #stednja`} />
                  <ShareTemplate label="Tekst za komentar (link)" text={`👉 ${siteUrl}/tecaj?ref=${affiliate.code}`} mono />
                </div>
              </details>

              {/* WhatsApp */}
              <details className="group bg-[#0D1B2A] border border-white/10 rounded-xl">
                <summary className="px-5 py-4 cursor-pointer flex justify-between items-center list-none">
                  <span className="font-semibold text-sm">WhatsApp / osobna poruka <span className="text-gray-500 font-normal">(neformalni ton)</span></span>
                  <span className="text-gray-500 text-xs group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <div className="px-5 pb-5 space-y-3 border-t border-white/10 pt-4">
                  <p className="text-gray-500 text-xs">Za WhatsApp šalješ sliku + ovu poruku zajedno. Nema potrebe za #ad oznakom u privatnim porukama.</p>
                  <ShareTemplate label="Tekst za WhatsApp" text={`Hej! Šaljem ti ovo jer mislim da bi ti moglo promijeniti pogled na novac.\n\nProšao sam FinCoach VIP program — za 90 dana naučio sam više o osobnim financijama nego za cijeli život. Sada znam gdje mi novac odlazi, štedim automatski i počeo sam investirati.\n\nUz moj link imaš 10% popusta: ${siteUrl}/tecaj?ref=${affiliate.code}`} />
                </div>
              </details>
            </div>
          </div>

          {/* Konverzije */}
          <div className="bg-[#091623] border border-white/10 rounded-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-white/10 flex justify-between items-center">
              <h2 className="font-bold">Moje konverzije</h2>
              {paidCommission > 0 && (
                <span className="text-green-400 text-sm font-semibold">Isplaćeno: €{paidCommission.toFixed(2)}</span>
              )}
            </div>
            {conversions.length === 0 ? (
              <div className="px-6 py-10 text-center text-gray-500 text-sm">
                Još nema konverzija. Podijeli svoju vezu i počni zarađivati! 🚀
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10 text-gray-500">
                    <th className="px-6 py-3 text-left font-medium">Datum kupnje</th>
                    <th className="px-6 py-3 text-right font-medium">Provizija</th>
                    <th className="px-6 py-3 text-left font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {conversions.map(c => {
                    const purchaseDate = new Date(c.created_at)
                    const payoutDate = new Date(purchaseDate)
                    payoutDate.setDate(payoutDate.getDate() + 30)
                    const daysLeft = Math.max(0, Math.ceil((payoutDate.getTime() - Date.now()) / 86400000))

                    return (
                      <tr key={c.id} className="border-b border-white/5 hover:bg-white/5">
                        <td className="px-6 py-3 text-gray-400">{purchaseDate.toLocaleDateString('hr-HR')}</td>
                        <td className="px-6 py-3 text-right text-[#D4AF37] font-bold">€{Number(c.commission_amount).toFixed(2)}</td>
                        <td className="px-6 py-3">
                          {c.status === 'paid' ? (
                            <span className="px-2 py-1 rounded text-xs font-semibold bg-green-900/50 text-green-400">Isplaćeno</span>
                          ) : c.status === 'pending' && daysLeft > 0 ? (
                            <span className="text-gray-500 text-xs">Isplata za {daysLeft} dana</span>
                          ) : c.status === 'pending' ? (
                            <span className="px-2 py-1 rounded text-xs font-semibold bg-yellow-900/50 text-yellow-400">Čeka isplatu</span>
                          ) : (
                            <span className="px-2 py-1 rounded text-xs font-semibold bg-red-900/50 text-red-400">Otkazano</span>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            )}
          </div>

          <p className="text-center text-gray-600 text-xs">
            Pitanja o isplati? <a href="mailto:brane@fincoach.vip" className="underline hover:text-gray-400">brane@fincoach.vip</a>
            {' · '}
            <Link href="/affiliate/uvjeti" className="underline hover:text-gray-400">Opći uvjeti</Link>
          </p>
        </div>
      )}
    </div>
  )
}

function ShareTemplate({ label, text, mono }: { label: string; text: string; mono?: boolean }) {
  const [copied, setCopied] = useState(false)
  function copy() {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <div className="bg-[#091623] border border-white/10 rounded-lg p-4">
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs text-gray-500 font-medium">{label}</span>
        <button onClick={copy} className="text-xs text-[#D4AF37] hover:text-yellow-400 transition">
          {copied ? '✓ Kopirano' : 'Kopiraj'}
        </button>
      </div>
      <p className={`text-sm whitespace-pre-wrap leading-relaxed ${mono ? 'font-mono text-[#D4AF37]' : 'text-gray-400'}`}>{text}</p>
    </div>
  )
}
