import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import SiteFooter from '@/components/SiteFooter'

export const metadata: Metadata = {
  title: 'Uvjeti poslovanja â€” FinCoach VIP',
  description: 'Uvjeti koriĹˇtenja usluga FinCoach VIP platforme.',
}

export default function UvjetiPoslovanjaPage() {
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
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">Uvjeti poslovanja</h1>
        <p className="text-white/40 text-sm mb-12">Zadnja izmjena: 17. lipnja 2026.</p>

        <div className="prose prose-invert max-w-none space-y-10 text-white/70 leading-relaxed">

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">1. OpÄ‡e informacije</h2>
            <p>
              Ove Uvjete poslovanja primjenjuje Smart Money Solutions d.o.o. (u daljnjem tekstu: &quot;PruĹľatelj usluge&quot;, &quot;mi&quot;, &quot;nas&quot;), sa sjediĹˇtem u Republici Sloveniji, OIB/matiÄŤni broj dostupan na zahtjev, koja upravlja platformom <strong>FinCoach VIP</strong> dostupnom na adresi <strong>fincoach.vip</strong> (u daljnjem tekstu: &quot;Platforma&quot;).
            </p>
            <p className="mt-3">
              KoriĹˇtenjem Platforme ili kupnjom bilo kojeg teÄŤaja ili usluge potvrÄ‘ujete da ste proÄŤitali, razumjeli i prihvatili ove Uvjete u cijelosti. Ako se ne slaĹľete s bilo kojim dijelom Uvjeta, molimo vas da ne koristite Platformu.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">2. Opis usluge</h2>
            <p>FinCoach VIP nudi:</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>90-dnevni online teÄŤaj osobnih financija (video lekcije, radni listovi, predloĹˇci)</li>
              <li>Pristup privatnoj zajednici polaznika</li>
              <li>Certifikat po uspjeĹˇnom zavrĹˇetku programa</li>
              <li>DoĹľivotni pristup svim materijalima i buduÄ‡im nadopunama</li>
            </ul>
            <p className="mt-3">
              SadrĹľaj je iskljuÄŤivo obrazovne i informativne naravi. FinCoach VIP <strong>nije licencirani financijski savjetnik</strong> i niĹˇta na Platformi ne predstavlja osobni financijski, investicijski, pravni ili porezni savjet. Svaku financijsku odluku donosite na vlastitu odgovornost.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">3. Kupnja i plaÄ‡anje</h2>
            <p>
              Cijene su prikazane u eurima (EUR) i ukljuÄŤuju PDV gdje je primjenjivo. PlaÄ‡anje se vrĹˇi putem sigurne platforme <strong>Stripe</strong> i kreditnim/debitnim karticama (Visa, Mastercard, American Express).
            </p>
            <p className="mt-3">
              Nakon uspjeĹˇnog plaÄ‡anja pristup teÄŤaju aktivira se automatski u roku od 15 minuta. RaÄŤun se dostavlja elektroniÄŤkim putem na e-mail adresu navedenu pri kupnji.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">4. Pravo na odustanak i povrat sredstava</h2>
            <p>
              U skladu s <strong>Direktivom EU 2011/83/EU o pravima potroĹˇaÄŤa</strong> i relevantnim nacionalnim propisima, imate pravo odustati od kupnje u roku od <strong>14 kalendarskih dana</strong> od datuma kupnje, bez navoÄ‘enja razloga.
            </p>
            <p className="mt-3">
              <strong>Iznimka:</strong> Ako ste pristupili digitalnom sadrĹľaju (pogledali lekciju, preuzeli materijale) i izriÄŤito pristali na gubitak prava na odustanak, pravo na povrat ne primjenjuje se na potroĹˇeni sadrĹľaj.
            </p>
            <p className="mt-3">
              Uz to, nudimo <strong>garanciju povrata novca u roku od 30 dana</strong> bez pitanja â€” ako niste zadovoljni programom iz bilo kojeg razloga. Zahtjev za povrat poĹˇaljite na: <a href="mailto:brane.recek@gmail.com" className="text-gold hover:underline">brane.recek@gmail.com</a>
            </p>
            <p className="mt-3">Povrat se vrĹˇi istom metodom plaÄ‡anja u roku od 5â€“10 radnih dana.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">5. Pravo intelektualnog vlasniĹˇtva</h2>
            <p>
              Sav sadrĹľaj na Platformi â€” ukljuÄŤujuÄ‡i video lekcije, tekstove, grafike, logotipove, radne listove i predloĹˇke â€” iskljuÄŤivo je vlasniĹˇtvo PruĹľatelja usluge i zaĹˇtiÄ‡en je autorskim pravom.
            </p>
            <p className="mt-3">
              Zabranjeno je bez pisanog odobrenja: reproducirati, distribuirati, javno prikazivati, prodavati, iznajmljivati ili na bilo koji drugi naÄŤin koristiti sadrĹľaj Platforme u komercijalne svrhe. Osobna, nekomercijalna upotreba u okviru vlastitog obrazovanja je dopuĹˇtena.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">6. KorisniÄŤki raÄŤun</h2>
            <p>
              Za pristup teÄŤaju potreban je korisniÄŤki raÄŤun. Odgovorni ste za ÄŤuvanje podataka za prijavu i za sve aktivnosti koje se odvijaju putem vaĹˇeg raÄŤuna. U sluÄŤaju neovlaĹˇtenog pristupa, odmah nas obavijestite.
            </p>
            <p className="mt-3">ZadrĹľavamo pravo suspendirati ili ukinuti korisniÄŤki raÄŤun u sluÄŤaju krĹˇenja ovih Uvjeta.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">7. Affiliate program</h2>
            <p>
              FinCoach VIP nudi partnerski (affiliate) program kojim fiziÄŤke i pravne osobe mogu zaraditi proviziju preporukom naĹˇih teÄŤajeva. Uvjeti affiliate programa dostupni su u zasebnim Uvjetima affiliate suradnje koje moĹľete zatraĹľiti na e-mail adresu navedenu u toÄŤki 9.
            </p>
            <p className="mt-3">
              Provizija se isplaÄ‡uje iskljuÄŤivo za uspjeĹˇno naplaÄ‡ene i nepovratne kupnje. Isplata se vrĹˇi na navedeni bankovni raÄŤun ili putem PayPala, jednom mjeseÄŤno, uz minimalnu akumuliranu svotu od 50 EUR.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">8. OgraniÄŤenje odgovornosti</h2>
            <p>
              Platforma se pruĹľa &quot;kakva jest&quot; bez jamstava o odreÄ‘enim rezultatima. Financijski rezultati ovise o individualnim okolnostima svakog korisnika. PruĹľatelj usluge nije odgovoran za bilo kakvu izravnu ili neizravnu Ĺˇtetu nastalu koriĹˇtenjem Platforme ili primjenom nauÄŤenog sadrĹľaja.
            </p>
            <p className="mt-3">
              Ukupna odgovornost PruĹľatelja usluge ograniÄŤena je na iznos koji ste platili za uslugu.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">9. Kontakt i rjeĹˇavanje sporova</h2>
            <p>
              Za sva pitanja, reklamacije ili zahtjeve kontaktirajte nas na:<br />
              <a href="mailto:brane.recek@gmail.com" className="text-gold hover:underline">brane.recek@gmail.com</a>
            </p>
            <p className="mt-3">
              Za rjeĹˇavanje sporova s potroĹˇaÄŤima nadleĹľan je sud prema sjediĹˇtu PruĹľatelja usluge, uz moguÄ‡nost izvansudskog rjeĹˇavanja sporova putem <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer" className="text-gold hover:underline">EU platforme za online rjeĹˇavanje sporova (ODR)</a>.
            </p>
            <p className="mt-3">
              Primjenjivo pravo: pravo Republike Slovenije / Europske unije.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">10. Izmjene Uvjeta</h2>
            <p>
              ZadrĹľavamo pravo izmjene ovih Uvjeta u bilo koje vrijeme. O znaÄŤajnim izmjenama obavijestit Ä‡emo vas e-mailom najmanje 14 dana unaprijed. Nastavak koriĹˇtenja Platforme nakon stupanja izmjena na snagu smatra se prihvaÄ‡anjem novih Uvjeta.
            </p>
          </section>

        </div>
      </main>

      <SiteFooter />
    </div>
  )
}

