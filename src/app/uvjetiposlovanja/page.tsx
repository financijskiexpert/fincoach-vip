import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import SiteFooter from '@/components/SiteFooter'

export const metadata: Metadata = {
  title: 'Uvjeti poslovanja — FinCoach VIP',
  description: 'Uvjeti korištenja usluga FinCoach VIP platforme.',
}

export default function UvjetiPoslovanjaPage() {
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
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">Uvjeti poslovanja</h1>
        <p className="text-white/40 text-sm mb-12">Zadnja izmjena: 17. lipnja 2026.</p>

        <div className="prose prose-invert max-w-none space-y-10 text-white/70 leading-relaxed">

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">1. Opće informacije</h2>
            <p>
              Ove Uvjete poslovanja primjenjuje <strong>Expert s.p.</strong>, Kidričeva 2, 2000 Maribor, Slovenija, davčna številka: 83099131 (u daljnjem tekstu: &quot;Pružatelj usluge&quot;, &quot;mi&quot;, &quot;nas&quot;), koja upravlja platformom <strong>FinCoach VIP</strong> dostupnom na adresi <strong>fincoach.vip</strong> (u daljnjem tekstu: &quot;Platforma&quot;).
            </p>
            <p className="mt-3">
              Korištenjem Platforme ili kupnjom bilo kojeg tečaja ili usluge potvrđujete da ste pročitali, razumjeli i prihvatili ove Uvjete u cijelosti. Ako se ne slažete s bilo kojim dijelom Uvjeta, molimo vas da ne koristite Platformu.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">2. Opis usluge</h2>
            <p>FinCoach VIP nudi:</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>90-dnevni online tečaj osobnih financija (video lekcije, radni listovi, predlošci)</li>
              <li>Pristup privatnoj zajednici polaznika</li>
              <li>Certifikat po uspješnom završetku programa</li>
              <li>Doživotni pristup svim materijalima i budućim nadopunama</li>
            </ul>
            <p className="mt-3">
              Sadržaj je isključivo obrazovne i informativne naravi. FinCoach VIP <strong>nije licencirani financijski savjetnik</strong> i ništa na Platformi ne predstavlja osobni financijski, investicijski, pravni ili porezni savjet. Svaku financijsku odluku donosite na vlastitu odgovornost.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">3. Kupnja i plaćanje</h2>
            <p>
              Cijene su prikazane u eurima (EUR) i uključuju PDV gdje je primjenjivo. Plaćanje se vrši putem sigurne platforme <strong>Stripe</strong> i kreditnim/debitnim karticama (Visa, Mastercard, American Express).
            </p>
            <p className="mt-3">
              Nakon uspješnog plaćanja pristup tečaju aktivira se automatski u roku od 15 minuta. Račun se dostavlja elektroničkim putem na e-mail adresu navedenu pri kupnji.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">4. Pravo na odustanak i povrat sredstava</h2>
            <p>
              U skladu s <strong>Direktivom EU 2011/83/EU o pravima potrošača</strong> i relevantnim nacionalnim propisima, imate pravo odustati od kupnje u roku od <strong>14 kalendarskih dana</strong> od datuma kupnje, bez navođenja razloga.
            </p>
            <p className="mt-3">
              <strong>Iznimka:</strong> Ako ste pristupili digitalnom sadržaju (pogledali lekciju, preuzeli materijale) i izričito pristali na gubitak prava na odustanak, pravo na povrat ne primjenjuje se na potrošeni sadržaj.
            </p>
            <p className="mt-3">
              Uz to, nudimo <strong>garanciju povrata novca u roku od 30 dana</strong> bez pitanja — ako niste zadovoljni programom iz bilo kojeg razloga. Zahtjev za povrat pošaljite na: <a href="mailto:brane.recek@gmail.com" className="text-gold hover:underline">brane.recek@gmail.com</a>
            </p>
            <p className="mt-3">Povrat se vrši istom metodom plaćanja u roku od 5–10 radnih dana.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">5. Pravo intelektualnog vlasništva</h2>
            <p>
              Sav sadržaj na Platformi — uključujući video lekcije, tekstove, grafike, logotipove, radne listove i predloške — isključivo je vlasništvo Pružatelja usluge i zaštićen je autorskim pravom.
            </p>
            <p className="mt-3">
              Zabranjeno je bez pisanog odobrenja: reproducirati, distribuirati, javno prikazivati, prodavati, iznajmljivati ili na bilo koji drugi način koristiti sadržaj Platforme u komercijalne svrhe. Osobna, nekomercijalna upotreba u okviru vlastitog obrazovanja je dopuštena.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">6. Korisnički račun</h2>
            <p>
              Za pristup tečaju potreban je korisnički račun. Odgovorni ste za čuvanje podataka za prijavu i za sve aktivnosti koje se odvijaju putem vašeg računa. U slučaju neovlaštenog pristupa, odmah nas obavijestite.
            </p>
            <p className="mt-3">Zadržavamo pravo suspendirati ili ukinuti korisnički račun u slučaju kršenja ovih Uvjeta.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">7. Affiliate program</h2>
            <p>
              FinCoach VIP nudi partnerski (affiliate) program kojim fizičke i pravne osobe mogu zaraditi proviziju preporukom naših tečajeva. Uvjeti affiliate programa dostupni su u zasebnim Uvjetima affiliate suradnje koje možete zatražiti na e-mail adresu navedenu u točki 9.
            </p>
            <p className="mt-3">
              Provizija se isplaćuje isključivo za uspješno naplaćene i nepovratne kupnje. Isplata se vrši na navedeni bankovni račun ili putem PayPala, jednom mjesečno, uz minimalnu akumuliranu svotu od 50 EUR.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">8. Ograničenje odgovornosti</h2>
            <p>
              Platforma se pruža &quot;kakva jest&quot; bez jamstava o određenim rezultatima. Financijski rezultati ovise o individualnim okolnostima svakog korisnika. Pružatelj usluge nije odgovoran za bilo kakvu izravnu ili neizravnu štetu nastalu korištenjem Platforme ili primjenom naučenog sadržaja.
            </p>
            <p className="mt-3">
              Ukupna odgovornost Pružatelja usluge ograničena je na iznos koji ste platili za uslugu.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">9. Kontakt i rješavanje sporova</h2>
            <p>
              Za sva pitanja, reklamacije ili zahtjeve kontaktirajte nas na:<br />
              <a href="mailto:brane.recek@gmail.com" className="text-gold hover:underline">brane.recek@gmail.com</a>
            </p>
            <p className="mt-3">
              Za rješavanje sporova s potrošačima nadležan je sud prema sjedištu Pružatelja usluge, uz mogućnost izvansudskog rješavanja sporova putem <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer" className="text-gold hover:underline">EU platforme za online rješavanje sporova (ODR)</a>.
            </p>
            <p className="mt-3">
              Primjenjivo pravo: pravo Republike Slovenije / Europske unije.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">10. Izmjene Uvjeta</h2>
            <p>
              Zadržavamo pravo izmjene ovih Uvjeta u bilo koje vrijeme. O značajnim izmjenama obavijestit ćemo vas e-mailom najmanje 14 dana unaprijed. Nastavak korištenja Platforme nakon stupanja izmjena na snagu smatra se prihvaćanjem novih Uvjeta.
            </p>
          </section>

        </div>
      </main>

      <SiteFooter />
    </div>
  )
}

