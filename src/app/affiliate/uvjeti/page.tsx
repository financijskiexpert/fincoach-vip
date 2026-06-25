import Link from 'next/link'
import SiteFooter from '@/components/SiteFooter'

export const metadata = {
  title: 'Opći uvjeti affiliate programa — FinCoach VIP',
}

export default function AffiliateUvjetiPage() {
  return (
    <main className="min-h-screen bg-[#0D1B2A] text-white">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <Link href="/portal/affiliate" className="text-gray-500 text-sm hover:text-gray-300 mb-8 inline-block">
          ← Natrag na partnerski program
        </Link>

        <h1 className="text-3xl font-black mb-2">Opći uvjeti affiliate programa</h1>
        <p className="text-gray-500 text-sm mb-10">Expert s.p. · Kidričeva 2, 2000 Maribor · Davčna številka: 83099131 · Zadnja izmjena: lipanj 2026.</p>

        <div className="prose prose-invert prose-sm max-w-none space-y-8 text-gray-300 leading-relaxed">

          <section>
            <h2 className="text-xl font-bold text-white mb-3">1. Definicije i sudionici</h2>
            <p><strong className="text-white">Organizator programa:</strong> Expert s.p., Kidričeva 2, 2000 Maribor, Slovenija, davčna številka: 83099131 — prodavač tečaja "Volim Svoj Novac" putem platforme fincoach.vip.</p>
            <p><strong className="text-white">Affiliate partner (Partner):</strong> fizička ili pravna osoba koja se prijavila u affiliate program i prihvatila ove uvjete.</p>
            <p><strong className="text-white">Kupac:</strong> osoba koja je kupila tečaj putem affiliate veze Partnera.</p>
            <p><strong className="text-white">Provizija:</strong> novčana naknada koja se Partneru isplaćuje za uspješno posredovanu prodaju.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">2. Uvjeti sudjelovanja</h2>
            <p>U affiliate program mogu se prijaviti isključivo <strong className="text-white">kupci tečaja "Volim Svoj Novac"</strong> koji su tečaj platili i imaju aktivan pristup. Prijava se vrši putem portala na stranici <em>/portal/affiliate</em>.</p>
            <p>Organizator zadržava pravo odbiti ili ukinuti pristup partneru bez navođenja razloga, osobito u slučaju kršenja ovih uvjeta.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">3. Mehanizam praćenja i atribucija</h2>
            <p>Svakom Partneru dodjeljuje se unikatni affiliate kod (npr. <em>MARKO7F3K</em>) i veza oblika <em>fincoach.vip?ref=KOD</em>.</p>
            <p>Klikom na affiliate vezu, u pregledniku Kupca postavlja se kolačić (cookie) koji vrijedi <strong className="text-white">30 kalendarskih dana</strong>. Ako Kupac kupi tečaj unutar tog perioda, prodaja se pripisuje Partneru.</p>
            <p>Atribucija je moguća samo ako Kupac nije prethodno koristio affiliate vezu drugog Partnera. U slučaju višestrukih klikova, vrijedi <strong className="text-white">zadnji klik</strong> (last-click atribucija).</p>
            <p>Partner ne smije koristiti vlastitu affiliate vezu za kupnju tečaja za sebe (samoreferenciranje). Takva transakcija neće biti nagrađena provizijom.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">4. Visina provizije i popust za kupca</h2>
            <p>Partner ostvaruje proviziju u iznosu od <strong className="text-white">30% od iznosa koji Kupac plati</strong> putem affiliate veze.</p>
            <p>Kupac koji kupi putem affiliate veze automatski dobiva <strong className="text-white">popust od 10%</strong> na redovnu cijenu tečaja (€397), tj. plaća €357. Partner tada zarađuje <strong className="text-white">€107,10</strong> po prodaji.</p>
            <p>Affiliate popust <strong className="text-white">ne kombinira</strong> se s drugim promotivnim kodovima ili kuponcima. Ako Kupac posjeduje drugi kupon, primjenjuje se samo affiliate popust od 10%.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">5. Rok za isplatu i pravo na povrat kupca</h2>
            <p>Sukladno <strong className="text-white">Direktivi EU 2011/83/EU</strong> o pravima potrošača i Zakonu o zaštiti potrošača Republike Hrvatske, kupac digitalnog sadržaja ima pravo na povrat u roku od <strong className="text-white">30 kalendarskih dana</strong> od kupnje (dobrovoljno jamstvo Organizatora, šire od zakonskog minimuma).</p>
            <p>Iz tog razloga, sve provizije imaju status <strong className="text-white">"Na čekanju"</strong> prvih 30 dana. Provizija prelazi u status <strong className="text-white">"Čeka isplatu"</strong> tek po isteku tog roka — kada više nije moguće tražiti povrat.</p>
            <p>Ako Kupac zatraži i ostvari povrat kupovnine unutar 30 dana, odgovarajuća provizija se <strong className="text-white">poništava</strong> i neće biti isplaćena.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">6. Isplata provizije</h2>
            <p>Isplata se vrši <strong className="text-white">najkasnije 31. dan od datuma svake prodaje</strong> — nakon isteka roka za povrat kupovnine.</p>
            <p>Uvjet za prvu i svaku sljedeću isplatu: Partner mora imati <strong className="text-white">najmanje 2 dozrele konverzije</strong> (2 prodaje kod kojih je prošlo 30 kalendarskih dana bez zahtjeva za povratom). Konverzije ispod tog praga prenose se u sljedeći obračunski period.</p>
            <p><strong className="text-white">Način isplate prema zemlji Partnera:</strong></p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong className="text-white">Hrvatska, Slovenija, Srbija:</strong> SEPA bankovni prijenos — isplaćuje se puni iznos provizije</li>
              <li><strong className="text-white">BiH, Crna Gora, Makedonija, Albanija:</strong> Wise prijenos — od provizije se oduzimaju stvarni troškovi transfera, najviše €10</li>
            </ul>
            <p>Isplata se vrši na IBAN koji Partner navede u postavkama svog profila. Partner je odgovoran za točnost bankovnih podataka i za prijavu prihoda poreznim tijelima prema zakonodavstvu vlastite zemlje.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">7. Zabranjene prakse</h2>
            <p>Zabranjeno je:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Oglašavanje putem plaćenih oglasa koji sadrže robnu marku "FinCoach" ili "fincoach.vip" bez prethodnog pisanog odobrenja</li>
              <li>Slanje neželjenih poruka (spam) putem emaila, SMS-a ili društvenih mreža</li>
              <li>Lažno predstavljanje ili davanje neistinitih tvrdnji o tečaju</li>
              <li>Samoreferenciranje (kupnja tečaja vlastitim affiliate kodom)</li>
              <li>Manipulacija sustavom praćenja (npr. automatsko generiranje klikova)</li>
            </ul>
            <p className="mt-3">Kršenje bilo kojeg od ovih pravila rezultira trenutačnim isključenjem iz programa i poništenjem svih neisplaćenih provizija.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">8. Izmjene uvjeta i raskid</h2>
            <p>Organizator zadržava pravo izmjene ovih uvjeta uz <strong className="text-white">najavu od 14 dana</strong> emailom svim aktivnim Partnerima. Nastavak sudjelovanja u programu nakon izmjene smatra se prihvaćanjem novih uvjeta.</p>
            <p>Svaka strana može raskinuti suradnju u bilo koje vrijeme bez posebnog razloga. Sve provizije koje su dozrele do datuma raskida bit će isplaćene u redovnom roku.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">9. Mjerodavno pravo</h2>
            <p>Na ove uvjete primjenjuje se pravo <strong className="text-white">Republike Slovenije</strong>. Za sve sporove nadležno je Okrožno sodišče v Mariboru.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">10. Kontakt</h2>
            <p>Za sva pitanja vezana uz affiliate program: <a href="mailto:brane@fincoach.vip" className="text-[#D4AF37] hover:underline">brane@fincoach.vip</a></p>
          </section>

        </div>
      </div>
      <SiteFooter />
    </main>
  )
}
