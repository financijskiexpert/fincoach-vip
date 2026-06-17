import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Politika privatnosti â€” FinCoach VIP',
  description: 'Politika privatnosti i zaĹˇtite osobnih podataka FinCoach VIP platforme, u skladu s GDPR-om.',
}

export default function PolitikaPrivatnostiPage() {
  return (
    <div className="min-h-screen bg-navy">
      <nav className="border-b border-white/10 bg-navy/95 backdrop-blur-sm px-4 sm:px-6 h-16 flex items-center">
        <div className="max-w-4xl mx-auto w-full flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <Image src="/logo/fincoach-logo-horizontal.svg" alt="FinCoach VIP" width={150} height={47} priority />
          </Link>
          <Link href="/" className="text-white/50 hover:text-white text-sm transition-colors">â† Natrag</Link>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">Politika privatnosti</h1>
        <p className="text-white/40 text-sm mb-12">Zadnja izmjena: 17. lipnja 2026. Â· U skladu s Uredbom (EU) 2016/679 (GDPR)</p>

        <div className="prose prose-invert max-w-none space-y-10 text-white/70 leading-relaxed">

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">1. Voditelj obrade podataka</h2>
            <p>
              Voditelj obrade vaĹˇih osobnih podataka je:<br />
              <strong className="text-white">Smart Money Solutions d.o.o.</strong><br />
              E-mail: <a href="mailto:brane.recek@gmail.com" className="text-gold hover:underline">brane.recek@gmail.com</a>
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">2. Koje podatke prikupljamo</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse mt-2">
                <thead>
                  <tr className="border-b border-white/20">
                    <th className="text-left py-2 pr-4 text-white font-semibold">Kategorija podataka</th>
                    <th className="text-left py-2 pr-4 text-white font-semibold">Primjeri</th>
                    <th className="text-left py-2 text-white font-semibold">Svrha</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  <tr>
                    <td className="py-2 pr-4">Identifikacijski podaci</td>
                    <td className="py-2 pr-4">Ime, prezime</td>
                    <td className="py-2">Izrada raÄŤuna, personalizacija</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4">Kontaktni podaci</td>
                    <td className="py-2 pr-4">E-mail adresa</td>
                    <td className="py-2">Dostava usluge, komunikacija, e-mail marketing (uz suglasnost)</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4">Podaci o plaÄ‡anju</td>
                    <td className="py-2 pr-4">Zadnje 4 znamenke kartice, ID transakcije</td>
                    <td className="py-2">Obrada plaÄ‡anja putem Stripe-a (ne pohranjujemo broj kartice)</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4">Podaci o koriĹˇtenju</td>
                    <td className="py-2 pr-4">Napredak u teÄŤaju, zavrĹˇene lekcije</td>
                    <td className="py-2">PruĹľanje usluge, certifikacija</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4">TehniÄŤki podaci</td>
                    <td className="py-2 pr-4">IP adresa, vrsta preglednika, kolaÄŤiÄ‡i</td>
                    <td className="py-2">Sigurnost, analitika (uz suglasnost)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">3. Pravna osnova obrade (ÄŤl. 6. GDPR)</h2>
            <ul className="list-disc list-inside space-y-2">
              <li><strong className="text-white">IzvrĹˇenje ugovora (ÄŤl. 6/1/b)</strong> â€” obrada neophodna za pruĹľanje teÄŤaja koji ste kupili</li>
              <li><strong className="text-white">Pravna obveza (ÄŤl. 6/1/c)</strong> â€” ÄŤuvanje raÄŤuna i financijskih podataka prema poreznim propisima</li>
              <li><strong className="text-white">Legitimni interes (ÄŤl. 6/1/f)</strong> â€” sigurnost platforme, sprjeÄŤavanje prijevara</li>
              <li><strong className="text-white">Suglasnost (ÄŤl. 6/1/a)</strong> â€” slanje marketinĹˇkih e-mailova i koriĹˇtenje analitiÄŤkih kolaÄŤiÄ‡a (moĹľete povuÄ‡i u bilo trenutku)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">4. KolaÄŤiÄ‡i (cookies)</h2>
            <p>Koristimo sljedeÄ‡e kategorije kolaÄŤiÄ‡a:</p>
            <div className="mt-3 space-y-3">
              <div className="bg-white/5 rounded-xl p-4">
                <p className="font-semibold text-white">NuĹľni kolaÄŤiÄ‡i</p>
                <p className="text-sm mt-1">Neophodni za funkcioniranje stranice (sesija, autentifikacija). Ne mogu se iskljuÄŤiti.</p>
              </div>
              <div className="bg-white/5 rounded-xl p-4">
                <p className="font-semibold text-white">AnalitiÄŤki kolaÄŤiÄ‡i (uz suglasnost)</p>
                <p className="text-sm mt-1">PomaĹľu nam razumjeti kako koristite stranicu radi poboljĹˇanja sadrĹľaja. Koristi se anonimizirana analitika.</p>
              </div>
              <div className="bg-white/5 rounded-xl p-4">
                <p className="font-semibold text-white">MarketinĹˇki kolaÄŤiÄ‡i (uz suglasnost)</p>
                <p className="text-sm mt-1">Koriste se za praÄ‡enje affiliate referrala i personalizaciju oglasa. Aktiviraju se samo uz vaĹˇu izriÄŤitu suglasnost.</p>
              </div>
            </div>
            <p className="mt-4">Suglasnost za kolaÄŤiÄ‡e moĹľete upravljati putem bannera koji se prikazuje pri prvom posjetu, ili putem gumba &quot;Postavke kolaÄŤiÄ‡a&quot; u podnoĹľju stranice.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">5. Primatelji podataka (treÄ‡e strane)</h2>
            <ul className="list-disc list-inside space-y-2">
              <li><strong className="text-white">Stripe Inc.</strong> â€” obrada plaÄ‡anja (EU Data Processing Addendum sklopljen)</li>
              <li><strong className="text-white">Supabase Inc.</strong> â€” baza podataka korisnika i napretka (podatkovni centri u EU)</li>
              <li><strong className="text-white">Vercel Inc.</strong> â€” hosting platforme (podatkovni centri dostupni u EU)</li>
              <li><strong className="text-white">E-mail provider</strong> â€” slanje transakcijskih i marketinĹˇkih e-mailova</li>
            </ul>
            <p className="mt-3">S navedenim pruĹľateljima sklopljeni su ugovori o obradi podataka (DPA) koji jamÄŤe GDPR usklaÄ‘enost. VaĹˇi podaci se ne prodaju treÄ‡im stranama.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">6. Rok ÄŤuvanja podataka</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>KorisniÄŤki raÄŤun i podaci o teÄŤaju: do brisanja raÄŤuna + 30 dana</li>
              <li>Financijski zapisi (raÄŤuni): 7 godina (zakonska obveza)</li>
              <li>Marketing e-mail podaci: do odjave ili povlaÄŤenja suglasnosti</li>
              <li>AnalitiÄŤki podaci: 26 mjeseci</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">7. VaĹˇa prava (ÄŤl. 15â€“22 GDPR)</h2>
            <ul className="list-disc list-inside space-y-2">
              <li><strong className="text-white">Pravo pristupa</strong> â€” moĹľete zatraĹľiti kopiju svojih podataka</li>
              <li><strong className="text-white">Pravo ispravka</strong> â€” moĹľete zatraĹľiti ispravak netoÄŤnih podataka</li>
              <li><strong className="text-white">Pravo brisanja</strong> (&quot;pravo na zaborav&quot;) â€” moĹľete zatraĹľiti brisanje podataka</li>
              <li><strong className="text-white">Pravo prenosivosti</strong> â€” moĹľete zatraĹľiti podatke u strojno ÄŤitljivom formatu</li>
              <li><strong className="text-white">Pravo prigovora</strong> â€” moĹľete prigovoriti obradi temeljenoj na legitimnom interesu</li>
              <li><strong className="text-white">Pravo povlaÄŤenja suglasnosti</strong> â€” u bilo koje vrijeme, bez utjecaja na prethodnu obradu</li>
            </ul>
            <p className="mt-4">
              Zahtjeve ostvarujete slanjem e-maila na: <a href="mailto:brane.recek@gmail.com" className="text-gold hover:underline">brane.recek@gmail.com</a><br />
              Odgovaramo u roku od <strong className="text-white">30 dana</strong>. Imate pravo podnijeti prituĹľbu nadzornom tijelu â€” u Sloveniji je to <a href="https://www.ip-rs.si" target="_blank" rel="noopener noreferrer" className="text-gold hover:underline">Informacijski pooblaĹˇÄŤenec (IP-RS)</a>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">8. Sigurnost podataka</h2>
            <p>
              Primjenjujemo tehniÄŤke i organizacijske mjere zaĹˇtite: enkripcija podataka u prijenosu (HTTPS/TLS), enkripcija u pohrani, kontrola pristupa, redovite sigurnosne provjere. Lozinke se nikada ne pohranjuju u ÄŤitljivom obliku.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">9. Kontakt</h2>
            <p>
              Za sva pitanja o obradi podataka:<br />
              <a href="mailto:brane.recek@gmail.com" className="text-gold hover:underline">brane.recek@gmail.com</a>
            </p>
          </section>

        </div>
      </main>

      <footer className="border-t border-white/10 py-8 px-4 sm:px-6 mt-16">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <Image src="/logo/fincoach-logo-horizontal.svg" alt="FinCoach VIP" width={130} height={41} />
          <div className="flex gap-6 text-sm text-white/40">
            <Link href="/uvjetiposlovanja" className="hover:text-white transition-colors">Uvjeti poslovanja</Link>
            <Link href="/politikaprivatnosti" className="hover:text-white transition-colors">Politika privatnosti</Link>
          </div>
          <p className="text-white/30 text-sm">Â© 2026 FinCoach VIP</p>
        </div>
      </footer>
    </div>
  )
}

