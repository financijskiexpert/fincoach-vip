import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import SiteFooter from '@/components/SiteFooter'

export const metadata: Metadata = {
  title: 'Politika privatnosti — FinCoach VIP',
  description: 'Politika privatnosti i zaštite osobnih podataka FinCoach VIP platforme, u skladu s GDPR-om.',
}

export default function PolitikaPrivatnostiPage() {
  return (
    <div className="min-h-screen bg-navy">
      <nav className="border-b border-white/10 bg-navy/95 backdrop-blur-sm px-4 sm:px-6 h-16 flex items-center">
        <div className="max-w-4xl mx-auto w-full flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <Image src="/logo/fincoach-logo-horizontal.svg" alt="FinCoach VIP" width={150} height={47} priority />
          </Link>
          <Link href="/" className="text-white/50 hover:text-white text-sm transition-colors">← Natrag</Link>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">Politika privatnosti</h1>
        <p className="text-white/40 text-sm mb-12">Zadnja izmjena: 17. lipnja 2026. · U skladu s Uredbom (EU) 2016/679 (GDPR)</p>

        <div className="prose prose-invert max-w-none space-y-10 text-white/70 leading-relaxed">

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">1. Voditelj obrade podataka</h2>
            <p>
              Voditelj obrade vaših osobnih podataka je:<br />
              <strong className="text-white">Expert s.p.</strong><br />
              Kidričeva 2, 2000 Maribor, Slovenija<br />
              Davčna številka: 83099131<br />
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
                    <td className="py-2">Izrada računa, personalizacija</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4">Kontaktni podaci</td>
                    <td className="py-2 pr-4">E-mail adresa</td>
                    <td className="py-2">Dostava usluge, komunikacija, e-mail marketing (uz suglasnost)</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4">Podaci o plaćanju</td>
                    <td className="py-2 pr-4">Zadnje 4 znamenke kartice, ID transakcije</td>
                    <td className="py-2">Obrada plaćanja putem Stripe-a (ne pohranjujemo broj kartice)</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4">Podaci o korištenju</td>
                    <td className="py-2 pr-4">Napredak u tečaju, završene lekcije</td>
                    <td className="py-2">Pružanje usluge, certifikacija</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4">Tehnički podaci</td>
                    <td className="py-2 pr-4">IP adresa, vrsta preglednika, kolačići</td>
                    <td className="py-2">Sigurnost, analitika (uz suglasnost)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">3. Pravna osnova obrade (čl. 6. GDPR)</h2>
            <ul className="list-disc list-inside space-y-2">
              <li><strong className="text-white">Izvršenje ugovora (čl. 6/1/b)</strong> — obrada neophodna za pružanje tečaja koji ste kupili</li>
              <li><strong className="text-white">Pravna obveza (čl. 6/1/c)</strong> — čuvanje računa i financijskih podataka prema poreznim propisima</li>
              <li><strong className="text-white">Legitimni interes (čl. 6/1/f)</strong> — sigurnost platforme, sprječavanje prijevara</li>
              <li><strong className="text-white">Suglasnost (čl. 6/1/a)</strong> — slanje marketinških e-mailova i korištenje analitičkih kolačića (možete povući u bilo trenutku)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">4. Kolačići (cookies)</h2>
            <p>Koristimo sljedeće kategorije kolačića:</p>
            <div className="mt-3 space-y-3">
              <div className="bg-white/5 rounded-xl p-4">
                <p className="font-semibold text-white">Nužni kolačići</p>
                <p className="text-sm mt-1">Neophodni za funkcioniranje stranice (sesija, autentifikacija). Ne mogu se isključiti.</p>
              </div>
              <div className="bg-white/5 rounded-xl p-4">
                <p className="font-semibold text-white">Analitički kolačići (uz suglasnost)</p>
                <p className="text-sm mt-1">Pomažu nam razumjeti kako koristite stranicu radi poboljšanja sadržaja. Koristi se anonimizirana analitika.</p>
              </div>
              <div className="bg-white/5 rounded-xl p-4">
                <p className="font-semibold text-white">Marketinški kolačići (uz suglasnost)</p>
                <p className="text-sm mt-1">Koriste se za praćenje affiliate referrala i personalizaciju oglasa. Aktiviraju se samo uz vašu izričitu suglasnost.</p>
              </div>
            </div>
            <p className="mt-4">Suglasnost za kolačiće možete upravljati putem bannera koji se prikazuje pri prvom posjetu, ili putem gumba &quot;Postavke kolačića&quot; u podnožju stranice.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">5. Primatelji podataka (treće strane)</h2>
            <ul className="list-disc list-inside space-y-2">
              <li><strong className="text-white">Stripe Inc.</strong> — obrada plaćanja (EU Data Processing Addendum sklopljen)</li>
              <li><strong className="text-white">Supabase Inc.</strong> — baza podataka korisnika i napretka (podatkovni centri u EU)</li>
              <li><strong className="text-white">Vercel Inc.</strong> — hosting platforme (podatkovni centri dostupni u EU)</li>
              <li><strong className="text-white">E-mail provider</strong> — slanje transakcijskih i marketinških e-mailova</li>
            </ul>
            <p className="mt-3">S navedenim pružateljima sklopljeni su ugovori o obradi podataka (DPA) koji jamče GDPR usklađenost. Vaši podaci se ne prodaju trećim stranama.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">6. Rok čuvanja podataka</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>Korisnički račun i podaci o tečaju: do brisanja računa + 30 dana</li>
              <li>Financijski zapisi (računi): 7 godina (zakonska obveza)</li>
              <li>Marketing e-mail podaci: do odjave ili povlačenja suglasnosti</li>
              <li>Analitički podaci: 26 mjeseci</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">7. Vaša prava (čl. 15–22 GDPR)</h2>
            <ul className="list-disc list-inside space-y-2">
              <li><strong className="text-white">Pravo pristupa</strong> — možete zatražiti kopiju svojih podataka</li>
              <li><strong className="text-white">Pravo ispravka</strong> — možete zatražiti ispravak netočnih podataka</li>
              <li><strong className="text-white">Pravo brisanja</strong> (&quot;pravo na zaborav&quot;) — možete zatražiti brisanje podataka</li>
              <li><strong className="text-white">Pravo prenosivosti</strong> — možete zatražiti podatke u strojno čitljivom formatu</li>
              <li><strong className="text-white">Pravo prigovora</strong> — možete prigovoriti obradi temeljenoj na legitimnom interesu</li>
              <li><strong className="text-white">Pravo povlačenja suglasnosti</strong> — u bilo koje vrijeme, bez utjecaja na prethodnu obradu</li>
            </ul>
            <p className="mt-4">
              Zahtjeve ostvarujete slanjem e-maila na: <a href="mailto:brane.recek@gmail.com" className="text-gold hover:underline">brane.recek@gmail.com</a><br />
              Odgovaramo u roku od <strong className="text-white">30 dana</strong>. Imate pravo podnijeti pritužbu nadzornom tijelu — u Sloveniji je to <a href="https://www.ip-rs.si" target="_blank" rel="noopener noreferrer" className="text-gold hover:underline">Informacijski pooblaščenec (IP-RS)</a>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">8. Sigurnost podataka</h2>
            <p>
              Primjenjujemo tehničke i organizacijske mjere zaštite: enkripcija podataka u prijenosu (HTTPS/TLS), enkripcija u pohrani, kontrola pristupa, redovite sigurnosne provjere. Lozinke se nikada ne pohranjuju u čitljivom obliku.
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

      <SiteFooter />
    </div>
  )
}

