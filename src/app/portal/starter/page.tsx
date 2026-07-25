'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { createBrowserClient } from '@supabase/ssr'

type Tip = 'hedonist' | 'branic' | 'vrtlog' | 'teoreticar'

interface StarterData {
  email: string
  full_name: string
  financial_type: Tip | null
  purchased_at: string
  via_affiliate: boolean
  initial_score: number | null
}

// ─── Tip profili ──────────────────────────────────────────────────────────────

const TIPOVI: Record<Tip, {
  emoji: string
  naziv: string
  podnaslov: string
  zdravScore: number
  snage: string[]
  izazovi: string[]
  fokus: string
  savjet: string
}> = {
  hedonist: {
    emoji: '🔥',
    naziv: 'Hedonist',
    podnaslov: 'Živiš za danas — i u tome je problem',
    zdravScore: 38,
    snage: ['Znaš uživati u životu', 'Dobro se nosiš s trenutnim stresom', 'Generoznost prema drugima'],
    izazovi: ['Impulzivna potrošnja', 'Nema automatske štednje', 'Teško odgađanje zadovoljstva'],
    fokus: 'Automatizacija štednje PRIJE potrošnje',
    savjet: 'Postavi trajni nalog odmah čim stigne plaća: 10-20% na odvojen račun. Mozak se adaptira. Nećeš ni primijetiti.',
  },
  branic: {
    emoji: '🛡️',
    naziv: 'Branič',
    podnaslov: 'Čuvaš novac — ali i sebe od života',
    zdravScore: 52,
    snage: ['Disciplina i štedljivost', 'Rijetko se zaduživaš', 'Dugoročno razmišljanje'],
    izazovi: ['Pretjerana financijska anksioznost', 'Strah od trošenja i investiranja', 'Paraliza analizom'],
    fokus: 'Naučiti kada je PAMETNO trošiti i investirati',
    savjet: 'Definiraj "sigurnosni prag" — iznos koji ti daje mir. Sve iznad toga — investiraj. Novac koji miruje gubi vrijednost.',
  },
  vrtlog: {
    emoji: '🌀',
    naziv: 'Vrtlog',
    podnaslov: 'Imaš sve planove — samo nikad ne počneš',
    zdravScore: 45,
    snage: ['Motivacija i entuzijazam', 'Jasna vizija što želiš', 'Sposobnost planiranja'],
    izazovi: ['Problem s provedbom', 'Prokrastinacija kod financija', 'Prekidanje novih navika'],
    fokus: '30 dana korak-po-korak, bez skokova',
    savjet: 'Jedan mali korak dnevno je 100% bolji od savršenog plana koji nikad ne počneš. Počni s 5 minuta danas.',
  },
  teoreticar: {
    emoji: '📚',
    naziv: 'Teoretičar',
    podnaslov: 'Znaš sve — samo ne radiš ništa',
    zdravScore: 48,
    snage: ['Financijsko znanje', 'Analitičnost', 'Razumijevanje kompleksnih pojmova'],
    izazovi: ['Paraliza informacijama', 'Odgađanje akcije', 'Traženje savršenog rješenja'],
    fokus: '30 dana akcije — bez teorije',
    savjet: 'Svaki dan JEDNA konkretna stvar. Bez istraživanja, bez čitanja. Implementiraj, evaluiraj, prilagodi.',
  },
}

const DEFAULT_TIP = {
  emoji: '📊', naziv: 'Tvoja dijagnoza', podnaslov: 'Personalizirani uvid u tvoje financije',
  zdravScore: 44,
  snage: ['Odlučnost za promjenom', 'Svjesnost o problemu', 'Volja za učenjem'],
  izazovi: ['Nedostatak financijskog sustava', 'Nejasni ciljevi', 'Bez konkretnog akcijskog plana'],
  fokus: 'Postavljanje temelja za financijsku slobodu',
  savjet: 'Napravi financijski audit: zbroji prihode i rashode. Gdje novac odlazi? Svjesnost je prvi korak svake promjene.',
}

type Task = { day: number; task: string; tip_: string; detail?: string }

const PLANOVI: Record<Tip, Task[]> = {
  hedonist: [
    { day: 1,  task: 'Financijski audit: zbroji sve prihode i rashode zadnjeg mjeseca', tip_: '📊 Temelje ne možeš preskočiti', detail: 'Otvori internet bankarstvo ili aplikaciju banke. Zbroji sve prihode u jednu kolonu i sve troškove u drugu. Cilj: znati točne brojeve — ne procjene. Procjena je uvijek premala.' },
    { day: 2,  task: 'Pronađi 3 pretplate koje ne koristiš — odmah ih otkaži', tip_: '💸 Svaka otkazana pretplata = ušteđevina', detail: 'Provjeri Settings → Pretplate na mobitelu i bankovni izvod za redovne odljeve. Traži Netflix, Spotify, cloud storage, aplikacije koje ne koristiš. Otkaži odmah — svaka otkazana pretplata trajno povećava ušteđevinu.' },
    { day: 3,  task: 'Postavi trajni nalog: 10% plaće na odvojeni račun čim stigne', tip_: '🔒 Automatizirano = bez volje', detail: 'Internet bankarstvo → Trajni nalozi → Novi nalog. Datum: isti dan kad stiže plaća. Iznos: 10% neto plaće. Konto: odvojeni štedni račun bez debitne kartice. Kad je automatizirano — ne ovisi o volji ni motivaciji.' },
    { day: 4,  task: 'Definiraj 3 troška koje ne osjećaš, a skupo koštaju (dostava, taxi, café)', tip_: '☕ Svjesnost je moć', detail: 'Otvori bankovni izvod i traži: dostava hrane (Glovo, Wolt), prijevoz (Uber, taxi), kava i grickalice van kuće. Zbroji ukupni iznos svake kategorije. Svjesnost o trošku je prvi korak promjene — ne odricanje.' },
    { day: 5,  task: 'Postavi rezervu od 200 € za neočekivane troškove ovog mjeseca', tip_: '🛡️ Hitni fond počinje ovdje', detail: 'Prebaci 200€ odmah na odvojeni štedni račun — to je tvoj mini hitni fond. Bez ovog "jastuka" svako iznenađenje (kvar auta, liječnik) završava na kreditnoj kartici s kamatama.' },
    { day: 6,  task: 'Napravi listu želja s 5 stvari koje želiš kupiti — pričekaj 48 sati', tip_: '⏳ Test impulzivnosti', detail: 'Zapiši 5 željenih kupnji s datumom pisanja. Čekaj 48 sati. Što i dalje želiš jednako snažno? Što više i ne zanima? Impulzivna kupnja ne preživi 48 sati — prava želja da.' },
    { day: 7,  task: 'Tjedni pregled: je li automatska štednja radila? Prilagodi ako treba', tip_: '✅ Tjedan 1 završen!', detail: 'Provjeri 3 broja: 1) Je li automatski nalog prošao? 2) Kolika je ukupna ušteđevina? 3) Koliko si potrošio/la u tjednu? Zapiši rezultat — to je tvoja tjedna financijska mjera.' },
    { day: 8,  task: 'Prati troškove ovog tjedna u bilježnici ili aplikaciji', tip_: '📱 Što ne mjeriš, ne možeš kontrolirati', detail: 'Svaki trošak zapiši odmah: iznos + kategorija + dan. Može biti Notes na mobitelu, bilježnica ili aplikacija Spendee. Ono što mjeriš — mijenja se. Ono što ignoriraš — raste.' },
    { day: 9,  task: 'Pronađi jednu kategoriju troškova i smanji za 20% ovaj tjedan', tip_: '✂️ Mala redukcija, veliki efekt', detail: 'Odaberi kategoriju s najviše troškova (restoran, dostava, odjeća). Konkretno: 1 od 5 obroka kuhaj doma umjesto naručivati, ili preskoči jednu kupnju. Malo, ali učinak je trajan.' },
    { day: 10, task: 'Pregovaraj jedan račun ili pretplatu — nazovi pružatelja usluge', tip_: '📞 Pregovaranje je vještina', detail: 'Nazovi pružatelja mobitela, interneta ili osiguranja. Reci: "Gledam konkurenciju, možete li mi ponuditi bolju cijenu?" Funkcionira u 60% slučajeva. Najgori ishod je "ne" — stanje ostaje isto.' },
    { day: 11, task: 'Definiraj 3 konkretna financijska cilja za sljedeće 6 mjeseci', tip_: '🎯 Cilj bez roka je samo želja', detail: 'Format: ŠTO + KOLIKO€ + DO KADA. Primjer: "Hitni fond 1.000€ do 31.12." i "Bez dugova na kreditnoj kartici do 30.9." Bez datuma i iznosa cilj je samo nada — sa specifičnim brojevima postaje plan.' },
    { day: 12, task: 'Otkaži još 2 pretplate ili servis koji koristiš rijetko', tip_: '💰 Svaki euro vrijedi', detail: 'Pretraži bankovni izvod za sve redovne odljeve ispod 20€. Koje koristiš manje od jednom tjedno? Otkaži 2 danas. Kumulativni efekt malih uštedina je velik — 5+5+5€ = 180€ godišnje.' },
    { day: 13, task: 'Izračunaj koliko imaš u hitnom fondu vs. cilj (3× mjesečne troškove)', tip_: '🛡️ Koliko si daleko?', detail: 'Ukupni mjesečni troškovi × 3 = minimalni hitni fond. Primjer: 1.200€/mj × 3 = 3.600€ cilj. Koliko imaš trenutno na štednom računu? Razlika = put koji gradiš ovim programom.' },
    { day: 14, task: 'Tjedni pregled + prilagodba budžeta za sljedeći tjedan', tip_: '✅ 2 tjedna — ti si u top 10%!', detail: 'Provjeri: gdje si ovog tjedna prešao/la planirani budžet? Prilagodi plan za tjedan 3 na osnovu stvarnih podataka — ne na osnovu ideala. Realizam pobjeđuje savršenstvo.' },
    { day: 15, task: 'Postavi SMART cilj za hitni fond: iznos i rok (npr. 1.000 € za 3 mj.)', tip_: '📅 Specifičan = ostvariv', detail: 'Zapiši: "Do [datum] imati [iznos]€ na [naziv računa]." Unesi podsjetnik u kalendar za provjeru napretka svakih 30 dana. Specifičan cilj s rokom je 40% vjerojatnije ostvariti od nejasnog cilja.' },
    { day: 16, task: 'Istraži visoko-prinosne štedne račune u tvojoj banci i alternativama', tip_: '🏦 Inflacija jede ušteđevinu', detail: 'Usporedi kamatne stope tvoje banke s alternativama (online banke, štedionice). I 0,5% razlike na 5.000€ = 25€ godišnje extra — bez ikakvog napora. Inflacija 2-3% godišnje jede novac koji miruje.' },
    { day: 17, task: 'Prebaci hitni fond na odvojen račun bez debitne kartice', tip_: '🔒 Izvan vidokruga = izvan uma', detail: 'Otvori štedni račun bez debitne kartice (idealno u drugoj banci). Što ne vidiš svaki dan — ne trošiš impulsivno. Neuropsihološka istina: fizička dostupnost novca povećava trošenje za 30%.' },
    { day: 18, task: 'Napravi plan za jedan "zabranjeni trošak" — što umjesto toga?', tip_: '🔄 Zamjena, ne odricanje', detail: 'Identificiraj jedan trošak koji teško otkazuješ (kava van, dostava). Pronađi alternativu: domaća kava = 0,30€ vs. 3€ van. Zamjena smanjuje trošak bez osjećaja odricanja — mozak prihvaća lakše.' },
    { day: 19, task: 'Izračunaj koliko bi imao/la za 5 god ako štediš 200 €/mj uz 4% prinos', tip_: '📈 Složeni efekt te će iznenaditi', detail: 'Posjet compound-interest-calculator.net ili Excel. Unesi: 200€/mj, 4% godišnji prinos, 5 godina. Rezultat: ~13.200€ od čega 12.000€ uloženo i 1.200€ zarađenih. Složeni efekt raste s vremenom — počni što ranije.' },
    { day: 20, task: 'Napiši 3 razloga zašto ti je financijska sloboda važna', tip_: '💡 Svrha > volja', detail: 'Ne "financijska sloboda općenito" — konkretno. "Mogu uzeti godišnji odmor bez provjere računa", "Ne moram trpjeti posao koji mrzim samo zbog plaće." Emocionalni razlozi su 10× snažniji od racionalnih.' },
    { day: 21, task: 'Tjedni pregled: koliko si uštedjeo/la u 3 tjedna?', tip_: '✅ 21 dan — navika počinje!', detail: 'Jedan broj: ukupna ušteđevina od dana 1 do danas. Svaki euro koji nije potrošen impulsivno je tvoja pobjeda. Zapiši datum i iznos — tjedan za tjednom ta lista postaje dokaz promjene.' },
    { day: 22, task: 'Istraži 1 opciju pasivnog prihoda realnu za tvoju situaciju', tip_: '💸 Novac koji radi za tebe', detail: 'Pasivni prihod ne znači odmah milijune. Realne opcije: štednja s kamatama (odmah), ETF dividende (dugoročno), iznajmljivanje parkinga ili sobe (ako imaš prostor). Nađi jednu konkretnu za svoju situaciju.' },
    { day: 23, task: 'Pregled svih dugova: iznos, kamata, rok — na jednom listu papira', tip_: '📋 Pregled = kontrola', detail: 'Stavi na papir: naziv svakog duga, ukupni iznos, kamatna stopa %, minimalna rata, rok otplate. Pregled svih dugova zajedno daje kontrolu. Ignoriranje je uvijek skuplje od suočavanja s brojkama.' },
    { day: 24, task: 'Odaberi metodu eliminacije duga: lavina ili snježna gruda', tip_: '⚡ Obje funkcioniraju — budi dosljedan/na', detail: 'Lavina = počni s dugom koji ima najveću kamatnu stopu (matematički optimalno, uštediš više). Snježna gruda = počni s najmanjim dugom (psihološki motivirajuće, brže vidiš napredak). Obje funkcioniraju — bitan je odabir jedne i dosljednost.' },
    { day: 25, task: 'Smanji jedan fiksni trošak za 10% (internet, mobitel, osiguranje)', tip_: '📞 Jedno pregovaranje tjedno', detail: 'Nazovi pružatelja mobitela, interneta ili osiguranja. Reci: "Vidim povoljniju ponudu drugdje — možete li se uskladiti?" 10% na 3 fiksna troška = 30-60€ trajne uštedine svaki mjesec, zauvijek.' },
    { day: 26, task: 'Postavi automatski transfer za dug u skladu s tvojom metodom', tip_: '🤖 Automatizacija = konzistentnost', detail: 'Trajni nalog: datum = dan plaće. Iznos = minimalna rata + extra iznos prema metodi (lavina ili snježna gruda). Automatizacija eliminira iskušenje da potrošiš taj extra novac na nešto drugo.' },
    { day: 27, task: 'Pronađi jedan dodatni posao koji možeš početi ovaj tjedan', tip_: '💡 Dodatnih 100 € = razlika', detail: 'Što znaš raditi što bi drugi platili? Prijevoz, tutorstvo, fotografija, pisanje, popravci, prevođenje. Napiši jednu konkretnu ponudu na Njuškalu, Fiverru ili u lokalnu Facebook grupu. Extra 100€/mj = financijsko ubrzanje.' },
    { day: 28, task: 'Tjedni pregled: kako napreduju dugovi i hitni fond?', tip_: '✅ 4 tjedna — novi ti!', detail: 'Dva broja danas: 1) Za koliko su dugovi manji nego dan 1? 2) Kolika je ušteđevina na štednom računu? Zbroj ova dva broja = tvoja neto financijska promjena za 30 dana. Zapiši za uspomenu.' },
    { day: 29, task: 'Napiši 5 navika koje si izgradio/la u 30 dana', tip_: '🏆 Navike = bogatstvo', detail: 'Zapiši konkretno, ne apstraktno. Ne "bolje štedim" — nego "Automatski prebacujem 150€ svaki 1. u mj." i "Svaki tjedan pregledam troškove." Navike koje možeš opisati jednom rečenicom — to su prave navike.' },
    { day: 30, task: 'Napravi financijski plan za sljedeći mjesec s konkretnim brojevima', tip_: '🎯 Kraj je novi početak', detail: 'Tablica: prihodi - fiksni troškovi - automatska štednja - dug = slobodni novac. Slobodni novac rasporedi UNAPRIJED po kategorijama. Plan na papiru je 10× bolji od plana koji postoji samo u glavi.' },
  ],
  branic: [
    { day: 1,  task: 'Financijski audit: zbroji sve prihode i rashode zadnjeg mjeseca', tip_: '📊 Crno na bijelo', detail: 'Otvori internet bankarstvo ili aplikaciju banke. Zbroji sve prihode u jednu kolonu i sve troškove u drugu za prošli mjesec. Ovo nije za osudu — samo za jasnu sliku stvarnosti. Crno na bijelo.' },
    { day: 2,  task: 'Definiraj svoju "sigurnosnu granicu" — iznos koji ti daje apsolutni mir', tip_: '🛡️ Točno znaš, ne osjećaš', detail: 'Koji točan iznos na računu ti daje apsolutni financijski mir? Zapiši ga — ne raspon, nego jedan konkretan broj. Ova "sigurnosna granica" je temelj cijelog tvog financijskog sustava.' },
    { day: 3,  task: 'Sve iznad sigurnosne granice — napravi plan gdje to ide (štednja, investicije)', tip_: '📈 Mirujući novac gubi vrijednost', detail: 'Sve što imaš iznad sigurnosne granice šalješ na "rad." Opcije: visokoprinosni štedni račun, ETF fond, ili otplata duga. Novac koji miruje na tekućem računu gubi 2-3% godišnje zbog inflacije.' },
    { day: 4,  task: 'Istraži visoko-prinosni štedni račun — usporedi 3 banke', tip_: '💰 Inflacija jede ušteđevinu', detail: 'Usporedi kamatne stope tvoje banke i 2 alternative (online banke, štedionice). Zapiši: koja nudi više, koji su uvjeti i minimalni depozit. Razlika od 1% na 10.000€ = 100€ godišnje bez ikakvog napora.' },
    { day: 5,  task: 'Postavi automatski transfer 10% plaće na investicijski ili štedni račun', tip_: '🤖 Automatizacija smanjuje anksioznost', detail: 'Internet bankarstvo → Trajni nalozi → Novi nalog. Iznos: 10% neto plaće. Datum: isti dan kad stiže plaća. Automatizacija smanjuje anksioznost jer jednom donesena odluka se više ne mora ponavljati.' },
    { day: 6,  task: 'Napravi listu dozvoljenih troškova — stvari na koje možeš trošiti bez krivnje', tip_: '✅ Dozvola smanjuje anksioznost', detail: 'Napiši 5 kategorija na koje smiješ trošiti bez analize ili krivnje (npr. hrana, hobiji, godišnji odmor). Eksplicitna dozvola smanjuje anksioznost i sprečava kompenzacijska impulzivna trošenja.' },
    { day: 7,  task: 'Tjedni pregled: je li automatski transfer radio? Kako se osjećaš?', tip_: '✅ Tjedan 1 završen!', detail: 'Provjeri je li automatski nalog prošao. Zatim: kako se osjećaš kad vidiš manje novca na glavnom računu? Osjećaj straha ili mira? Bilješka o emocijama pomaže razumjeti vlastiti odnos prema novcu.' },
    { day: 8,  task: 'Istraži ETF fondove — što su, kako funkcioniraju, minimalna ulaganja', tip_: '📚 Znanje smanjuje strah', detail: 'ETF (Exchange Traded Fund) = košarica tisuća dionica kupljena kao jedna. Niski troškovi upravljanja (0,1-0,2% godišnje), automatska diverzifikacija. Istraži: Vanguard, iShares, Xtrackers. Znanje smanjuje strah od ulaganja.' },
    { day: 9,  task: 'Otvori investicijski račun (Degiro, Trading 212, IBKR ili slično)', tip_: '🚀 Otvoren račun ≠ obveza ulaganja', detail: 'Posjeti Degiro.hr, Trading212.com ili IBKR.com. Klikni "Otvori račun" i ispuni obrazac s osobnim podacima. Verifikacija traje 1-3 dana. Otvoren račun ne znači obvezu — samo opciju koja postoji.' },
    { day: 10, task: 'Ulož 50-100 € u jedan S&P 500 ETF — samo za iskustvo', tip_: '🌱 Mali start, veliki efekt', detail: 'U tražilici investicijskog računa piši "S&P 500 ETF." Pojave se opcije (VUSA, CSPX, SWDA). Kupi za 50-100€. Ovo je edukativna investicija — iskustvo biti investitor vrijedi više od iznosa.' },
    { day: 11, task: 'Prati investiciju 1 tjedan — bez panike zbog kratkoročnih oscilacija', tip_: '📉📈 Volatilnost je normalna', detail: 'Svaki dan pogledaj vrijednost — ali nemoj reagirati. Oscilacije ±1-3% su normalan dnevni šum. Dugoročni prosječni rast S&P 500 iznosi 10% godišnje unatoč kratkoročnim padovima od 20-40%.' },
    { day: 12, task: 'Definiraj 3 financijska cilja: kratkoročni, srednjoročni, dugoročni', tip_: '🎯 Ciljevi smanjuju anksioznost', detail: 'Kratkoročni (do 1 god) + Srednjoročni (1-5 god) + Dugoročni (5+ god). Svaki ima drugačiji rizičan profil. Format: ŠTO + KOLIKO€ + DO KADA. Konkretni ciljevi smanjuju financijsku anksioznost jer daju smjer.' },
    { day: 13, task: 'Izračunaj koliko će rasti 200 €/mj uz 7% prinos za 20 god.', tip_: '📈 Složeni efekt = čarolija', detail: '200€/mj × 12 × 20 god uz 7% = ~104.000€. Od toga uloženo 48.000€, zarađeno kamatama 56.000€. Složeni efekt raste eksponencijalno — svaka dodatna godina donosi više nego prethodna. Počni što ranije.' },
    { day: 14, task: 'Tjedni pregled: 2 tjedna investitora. Kako se osjećaš?', tip_: '✅ 2 tjedna — hrabriji/a si nego misliš!', detail: 'Kolika je vrijednost investicije danas vs. dan 10? Je li volatilnost manja briga nego si očekivao/la? 2 tjedna investiranja je tek početak — bitan je trend razumijevanja, ne konkretan broj.' },
    { day: 15, task: 'Istraži diverzifikaciju: što je to i zašto štiti od rizika', tip_: '🥚🧺 Ne stavljaj sva jaja u jednu košaru', detail: 'Diverzifikacija = kombinacija imovine koja se ne kreće uvijek u istom smjeru. Dionice (rast), obveznice (stabilnost), nekretnine, gotovina. Kad dionice padaju, obveznice često rastu — portfelj se izglađuje.' },
    { day: 16, task: 'Dodaj drugi ETF (npr. bond ETF) u portfelj — mali iznos', tip_: '⚖️ Balans = sigurnost', detail: 'Bond ETF primjeri: iShares Euro Aggregate Bond (AGGG), Vanguard EUR Corporate Bond. Konzervativno pravilo: udio obveznica = 100 minus tvoje godine. Npr. 35 god = 35% obveznice, 65% dionice.' },
    { day: 17, task: 'Napravi plan za mirovinu: koliko trebaš i kada', tip_: '🏖️ Mirovinska matematika', detail: 'Pravilo 4%: godišnji troškovi × 25 = potrebna štednja za mirovinu. Za 12.000€/god troškova = 300.000€ cilj. Uz 200€/mj i 7% prinos — za koliko godina dostiješ taj iznos? Izračunaj i zapiši.' },
    { day: 18, task: 'Razgovaraj s partnerom/obitelji o financijskim ciljevima', tip_: '👥 Zajednički ciljevi = manje konflikta', detail: 'Zajednički financijski ciljevi smanjuju konflikte oko novca u vezama za 60%. Dijelite: koliko štedite, koji su zajednički ciljevi, tko donosi koje odluke. Jedna konverzacija, dugoročna promjena dinamike.' },
    { day: 19, task: 'Provjeri postoji li dopunska mirovina ili benefiti kod poslodavca', tip_: '💼 Iskoristi sve benefite', detail: 'Provjeri ugovor o radu i pitaj HR. Može biti: dopunska mirovina, zdravstveno osiguranje, opcije dionica, edukacijski fond, prijevoz. Svaki neiskorišteni benefit je skrivena plaća koju ne primaš.' },
    { day: 20, task: 'Napiši zašto si počeo/la investirati — podsjeti se kad dođe strah', tip_: '💡 Tvoja "zašto" je sidro', detail: 'Kad tržište padne 30% (a hoće — to je normalno jednom u 5-7 god), jedina stvar koja sprečava paničnu prodaju je tvoj razlog. Zapiši ga sada, dok je lako. Drži ga pred sobom u budućoj krizi.' },
    { day: 21, task: 'Tjedni pregled: kako ide investicija? Ostani miran/na, nastavi', tip_: '✅ 21 dan — investitor!', detail: 'Provjeri: vrijednost portfelja, ukupno uloženo, razlika. Je li ovaj tjedan dodan dodatni doprinos? Dollar cost averaging = prosječiš cijenu kupnje kroz volatile tržište — moćna strategija za dugoročne investitore.' },
    { day: 22, task: 'Postavi automatski mjesečni doprinos investicijama', tip_: '🤖 Dollar cost averaging u akciji', detail: 'Trajni nalog za investiranje: isti datum (npr. 5. u mj.), isti iznos svaki mjesec. Automatski doprinos koji se uvijek dogodi > promjenjivi doprinos koji ovisi o raspoloženju. Dosljednost pobjeđuje iznos.' },
    { day: 23, task: 'Istraži nekretnine kao investiciju — usporedi s ETF fondovima', tip_: '🏠 Jedna od opcija, ne jedina', detail: 'Nekretnina: prednosti (stabilnost, prihod od najma), nedostaci (nelikvidnost, velik kapital, troškovi održavanja 1-2% godišnje). Usporedi prosječan prinos s ETF fondom. Svaka opcija ima mjesto — pitanje je proporcija.' },
    { day: 24, task: 'Definiraj "trošak slobode" — iznos koji možeš trošiti bez analize', tip_: '🎉 Sloboda je i cilj', detail: 'Definiraj iznos koji možeš potrošiti svaki mjesec na što god hoćeš — bez analize ili krivnje. Može biti 50€ ili 200€. Ugradi ga u budžet kao legitimnu kategoriju. Branič bez dozvole za trošenje postaje rob anksioznosti.' },
    { day: 25, task: 'Napravi jednu kupnju s "troškom slobode" — bez krivnje', tip_: '✨ Zaslužio/la si', detail: 'Iskoristi iznos slobodnog troška koji si definirao/la jučer. Kupi to što si htio/la — odmah, bez analiziranja je li "pametno." Ovo je vježba koja gradi zdrav odnos prema trošenju — bez krivnje, bez pretjerivanja.' },
    { day: 26, task: 'Pregled portfelja: je li diverzificiran kako si planirao/la?', tip_: '📊 Pregled, ne opsesija', detail: 'Otvori investicijski račun. Provjeri: imaš li više vrsta imovine? Je li alokacija (% po vrsti) u skladu s planom od dana 15? Malo prilagodi ako treba — ne preopčana analiza, samo kratki pregled.' },
    { day: 27, task: 'Napravi "što-ako" plan za recesiju — kako bi reagirao/la', tip_: '🛡️ Plan u miru = pamet u krizi', detail: 'Zapiši unaprijed: "Ako tržište padne 30%, ja ću [dodavati / ne reagirati / prodati X%]." Plan donesen u mirno doba funkcionira u panici — improvizirana emocionalna reakcija u krizi ne. Priprema = sigurnost.' },
    { day: 28, task: 'Tjedni pregled: napredak u 4 tjedna — je li portfelj diverzificiran?', tip_: '✅ 4 tjedna — pravi investitor!', detail: 'Kolika je vrijednost portfelja vs. dan 1? Što si naučio/la o sebi kao investitoru — jesi li mirniji/a nego na početku? Koji je sljedeći konkretan korak za naredni mjesec? Zapiši ova tri odgovora.' },
    { day: 29, task: 'Napiši 5 stvari koje si naučio/la o investiranju i novcu u 30 dana', tip_: '🏆 Znanje koje vrijedi', detail: 'Zapiši konkretno: "Volatilnost me manje plaši nego sam mislio/la", "Automatski nalog je moja najvažnija navika." Osobne lekcije iz vlastitog iskustva vrijede više od pročitanih knjiga — jer su tvoje.' },
    { day: 30, task: 'Napravi investicijski plan za sljedeća 3 mjeseca s konkretnim brojevima', tip_: '🎯 Kraj je novi početak', detail: 'Na papir: cilj (iznos, datum), mjesečni doprinos (€), što novo naučiti, jedna nova akcija. Plan koji zapišeš ima 40% veće šanse realizacije od plana koji postoji samo u glavi.' },
  ],
  vrtlog: [
    { day: 1,  task: 'SAMO ovo: postavi podsjetnik za 9 ujutro svaki dan s natpisom "Dan X"', tip_: '⏰ Struktura je tvoj prijatelj', detail: 'Otvori Google/Apple kalendar → Novi događaj → Ponavljanje svaki dan → Trajanje 30 dana → Naziv: "Financije — Dan X." Jedna minuta sada = 30 dana korisnosti. Struktura zamjenjuje motivaciju.' },
    { day: 2,  task: 'Financijski audit: zbroji sve prihode i rashode — samo brojke, bez osude', tip_: '📊 5 minuta, bez izgovora', detail: 'Uzmi bankovni izvod ili otvori aplikaciju banke. Zbroji prihode, zbroji troškove. Nije bitno da je savršeno — bitno je imati konkretan broj. Procjena je uvijek premala. Podaci, ne osjećaji.' },
    { day: 3,  task: 'Odaberi JEDNU financijsku naviku za ovaj tjedan — samo jednu', tip_: '🎯 Fokus pobjeđuje listu', detail: 'Odaberi JEDNU, ne nekoliko: "Svaki tjedan pratim troškove" ili "Automatski štedim 10%." Više od jedne navike istovremeno = nijedna navika. Jedan cilj koji se postiže vrijedi 10 nedovršenih ciljeva.' },
    { day: 4,  task: 'Postavi automatski transfer štednje — odmah, ne sutra', tip_: '🤖 Automatizirano = ne ovisi o volji', detail: 'Internet bankarstvo → Odmah, dok si motiviran/a. Trajni nalog: datum = dan plaće, iznos = 5-10% neto, konto = odvojen štedni račun. Jednom postavljeno → radi bez tvoje volje i motivacije.' },
    { day: 5,  task: 'Napiši 3 razloga zašto TI osobno trebaš financijsku slobodu', tip_: '💡 Osobni razlog = gorivo koje traje', detail: 'Ne "štednja je dobra ideja" — nego što konkretno možeš napraviti s financijskom slobodom. "Mogu dati otkaz kad hoću", "Mogu uzeti djeci godišnji odmor bez stresa." Osobni razlog je gorivo koje ne nestaje.' },
    { day: 6,  task: 'Pronađi partnera za praćenje napretka — osoba koja će te pitati za razvoj', tip_: '👥 Vanjska odgovornost je moćna', detail: 'Jedna poruka prijatelju, partneru ili kolegi: "Radim financijski program 30 dana — možeš li me pitati svaki tjedan kako ide?" Vanjska odgovornost poboljšava ishod za 65% u istraživanjima o navikama.' },
    { day: 7,  task: 'Tjedni pregled: je li automatska štednja radila? Javi se partneru', tip_: '✅ Tjedan 1 — napravio/la si!', detail: 'Javi se accountability partneru s 2 broja: 1) Je li automatski nalog prošao (da/ne)? 2) Koliko si uštedjeo/la ovaj tjedan? Dijeljenje napretka aktivira osjećaj odgovornosti koji čini nastavak lakšim.' },
    { day: 8,  task: 'Prati troškove 3 dana u bilježnici (papir, ne app — fizičan čin)', tip_: '✏️ Pisanje rukom = veća svjesnost', detail: 'Uzmi fizičku bilježnicu. Svaki trošak zapiši odmah: iznos + što + datum. Ruka koja piše aktivira drugačiji dio mozga nego tipkanje — fizičan čin pojačava svjesnost o potrošnji za 40%.' },
    { day: 9,  task: 'Pronađi jedan trošak koji možeš eliminirati ODMAH — otkaži danas', tip_: '✂️ Akcija danas, ne "od ponedjeljka"', detail: 'Otvori bankovni izvod — nađi jedan redovni odljev koji nije neophodan. Otkaži odmah — ne od ponedjeljka, ne kad se smirim, nego sada. Svaka odgoda od "ponedjeljka" košta 4 tjedna uštedine.' },
    { day: 10, task: 'Postavi podsjetnik na mobitelu: "Jesi li provjerio/la financije?"', tip_: '📱 Rutina gradi naviku', detail: 'Postavi ponavljajući podsjetnik za 9 ujutro: "Jesi li provjerio/la financije?" Kopiraj za svaki dan sljedećih 21 dana. Podsjetnik koji se ponavlja gradi naviku čak i bez motivacije.' },
    { day: 11, task: 'Napiši 3 konkretna financijska cilja s rokovima (ne "uštedjeti više")', tip_: '📅 Bez roka = bez cilja', detail: 'Format: "Do [datum] uštedjeti [iznos]€ za [svrhu]." Primjer: "Do 30.9. imati 500€ hitnog fonda." Zapiši 3 cilja u kalendar s podsjetnicima. Bez datuma i iznosa cilj je samo nada.' },
    { day: 12, task: 'Pronađi jednu financijsku aplikaciju i unesi JEDAN tjedan troškova', tip_: '📱 Jedna aplikacija, ne trideset', detail: 'Odaberi jednu: Spendee, Toshl, Money Manager ili Google Sheets. Unesi troškove samo za jedan prošli tjedan — kao test. Ne moraš biti savršen/na odmah — samo počni s jednim tjednom.' },
    { day: 13, task: 'Provjeri hitni fond: imaš li ga? Koliko je velik vs. cilj?', tip_: '🛡️ Hitni fond je temelj, ne opcija', detail: 'Hitni fond = 3-6 mjesečnih troškova na odvojenom računu bez debitne kartice. Koliko imaš sad? Razlika između cilja i stvarnosti = iznos koji gradiš ovim programom. Bez hitnog fonda, svako iznenađenje ruši plan.' },
    { day: 14, task: 'Tjedni pregled + javi se accountability partneru o napretku', tip_: '✅ 2 tjedna — u gornjoj trećini si!', detail: 'Javi se accountability partneru s 2 broja: ukupna ušteđevina od dana 1 i napredak prema cilju iz dana 11. Napredak koji dijelimo postaje napredak koji nastavljamo — to je sila vanjske odgovornosti.' },
    { day: 15, task: 'Napiši financijski plan za ovaj tjedan — na papiru, na vidljivom mjestu', tip_: '👀 Vidljivo = prisutno u umu', detail: 'Zapiši financijski plan za tjedan 3 na fizičan komad papira. Zalijepi na frižider ili monitor. Fizički vidljiv plan aktivira osjećaj odgovornosti svaki put kad ga vidiš — to nije slučajnost.' },
    { day: 16, task: 'Jedan mini cilj za ovaj tjedan: uštedjeti X € konkretno', tip_: '🎯 Mali mjerljivi ciljevi grade samopouzdanje', detail: 'Definiraj: "Ovaj tjedan uštedjeti X€ smanjivanjem troška Y." Konkretno, mjerljivo i ostvarivo u 7 dana. Niz malih pobjeda gradi samopouzdanje koje je potrebno za veće korake.' },
    { day: 17, task: 'Ako si propustio/la nešto — nastavi TAMO gdje si stao/la, ne ispočetka', tip_: '🔄 Nastavi, ne ponavljaj od početka', detail: 'Propuštanje je normalno — kraj programa je odustajanje, ne propuštanje jednog dana. Nastavi od točke gdje si stao/la. Mozak koji nastavlja unatoč prekidu gradi pravu otpornu naviku.' },
    { day: 18, task: 'Istraži ETF fondove — 10 minuta na YouTubeu, ne čitaj tekstove', tip_: '📺 Vizualno učenje brže usvaja', detail: 'Pretraži YouTube: "ETF za početnike" ili "S&P 500 objašnjeno." Gledaj 10 minuta — ne više. ETF = košarica tisuća dionica, jeftino i diverzificirano. Vizualan video usvaja koncept brže nego tekst.' },
    { day: 19, task: 'Razgovaraj s bankom o boljem štednom računu ili fiksnoj štednji', tip_: '🏦 Jedna akcija, dugoročna korist', detail: 'Nazovi banku, otvori chat ili posjeti poslovnicu. Pitaj: "Koji štedni račun ima najvišu kamatnu stopu?" i "Koji su uvjeti?" Jedna akcija od 10 minuta = dugoročna financijska korist.' },
    { day: 20, task: 'Postavi novčani dnevnik — svaki dan jedna rečenica o financijama', tip_: '📔 Refleksija gradi financijsku svjesnost', detail: 'Svaki večer napiši jednu rečenicu: "Danas sam potrošio/la X€ na Y i osjećam Z." 30 rečenica = uvid u vlastite financijske obrasce koji nije dostupan ni iz jednog bankovnog izvoda.' },
    { day: 21, task: 'Tjedni pregled: 3 tjedna dosljednosti — to je navika!', tip_: '✅ 21 dan — mozak prihvaća novu rutinu!', detail: '21 dan znači: mozak je prihvatio novu rutinu kao dio svakodnevice. Treći tjedan je statistički najtežji — i ti si ga prošao/la. To je temelj prave navike. Čestitamo — najteži dio je iza tebe.' },
    { day: 22, task: 'Definiraj automatski financijski sistem: što ide gdje čim stigne plaća', tip_: '🤖 Sustav pobjeđuje namjeru', detail: 'Crtaj na papiru: plaća → 10% štednja → 5% dug → ostatak slobodan. Postavi trajne naloge za svaku stavku. Sustav koji se izvršava automatski uvijek funkcionira bolje od dobre namjere bez sustava.' },
    { day: 23, task: 'Implementiraj jednu novu automatizaciju (štednja, kredit ili investicija)', tip_: '⚡ Jednom postavljeno, funkcionira zauvijek', detail: 'Odaberi jednu novu automatizaciju i postavi trajni nalog odmah. Štednja, rata kredita ili doprinos investicijama — nije važno što, važno je da je automatizirano. Jednom postavljeno = funkcionira bez tvoje prisutnosti.' },
    { day: 24, task: 'Provjeri: koliko se tvoj financijski status poboljšao od dana 1?', tip_: '📈 Mjerljivost je motivacija', detail: 'Usporedi: prihodi - troškovi - dugovi + ušteđevina danas vs. dan 1. Kolika je konkretna razlika? Mjerljivi napredak je motivacija koja ne nestaje — za razliku od osjećaja koji dolaze i odlaze.' },
    { day: 25, task: 'Napiši što ti je bio najveći "aha moment" u 30 dana', tip_: '💡 Uvid koji mijenja ponašanje', detail: '"Aha moment" = uvid koji trajno mijenja ponašanje. Može biti: "Automatska štednja mi je lakša nego mislim" ili "Trošim 200€/mj na dostavu a da to nisam osjećao/la." Konkretan uvid, ne opća lekcija.' },
    { day: 26, task: 'Postavi financijsku rutinu za sljedeći mjesec — isti dani, iste aktivnosti', tip_: '📅 Rutina = sloboda od odlučivanja', detail: 'Zapiši konkretno: svaki 1. u mj = pregled računa, svaku nedjelju = 5 min pregled troškova. Iste aktivnosti, isti dani, bez razmišljanja. Rutina eliminira trošenje mentalne energije na financijske odluke.' },
    { day: 27, task: 'Istraži jedan konkretan način povećanja prihoda — dodatni posao ili pregovaranje', tip_: '💰 Prihodi + štednja = ubrzanje', detail: 'Povećanje prihoda + štednja = financijsko ubrzanje koje nije moguće samo štednjom. Konkretno: nazovi poslodavca za pregovaranje, ili napiši prvu ponudu za dodatni posao danas — ne "sutra."' },
    { day: 28, task: 'Tjedni pregled: 4 tjedna sustava — radi li automatizacija?', tip_: '✅ 4 tjedna — sustav je uspostavljen!', detail: 'Što od automatizacija radi samostalno? Koji je bio najtežji moment ovog tjedna? Koji si korak napravio/la koji se činio nemogućim dana 1? Zapiši ova tri odgovora — vrijede više od bilo koje knjige.' },
    { day: 29, task: 'Napiši pismo sebi za 6 mjeseci: gdje želiš biti financijski', tip_: '💌 Vizija budućnosti koja motivira', detail: 'Format: "Dragi ja za 6 mj... Želim da si dostigao/la [X€ ušteđevine], [Y duga manje], [Z navika]." Vizualizacija željene budućnosti aktivira iste moždane krugove kao stvarno iskustvo — moćan motivacijski alat.' },
    { day: 30, task: 'Postavi 3 konkretna cilja za sljedeći mjesec s rokovima i akcijama', tip_: '🎯 Kraj je novi početak', detail: 'ŠTO + KOLIKO + DO KADA za svaki od 3 cilja. Unesi ih odmah u kalendar s podsjetnikom. Cilj koji ima datum ima 40% veće šanse realizacije od cilja koji postoji samo kao namjera.' },
  ],
  teoreticar: [
    { day: 1,  task: 'PRAVILO: danas nema čitanja, nema istraživanja — samo akcija', tip_: '🚫 Bez teorije — samo radi', detail: 'Danas nema istraživanja, nema uspoređivanja, nema čitanja. Jedna akcija: napravi financijski audit (Dan 2). Teorija bez akcije = nula eura na računu. Znanje koje se ne primjenjuje nema vrijednosti.' },
    { day: 2,  task: 'Financijski audit: zbroji SVE prihode i rashode — ODMAH, bez savršenosti', tip_: '📊 Gotovo > savršeno', detail: 'Uzmi bankovni izvod ili otvori aplikaciju. Zbroji prihode u jednu kolonu, troškove u drugu. Rezultat = neto prihod. Nije bitno da je savršeno — bitno je imati broj danas. Gotovo uvijek pobjeđuje savršeno.' },
    { day: 3,  task: 'Postavi automatski transfer štednje — 10% plaće, odmah, bez istraživanja', tip_: '🤖 Akcija, ne analiza', detail: 'Internet bankarstvo → Trajni nalozi → Novi nalog. Iznos: 10% neto plaće. Datum: dan plaće. Bez čitanja o "optimalnoj stopi štednje" — 10% je globalni standard koji funkcionira. Napravi sada.' },
    { day: 4,  task: 'Otkaži JEDNU pretplatu — bez analiziranja alternativa. Otkaži i gotovo', tip_: '✂️ Savršena alternativa ne postoji', detail: 'Otvori Settings na mobitelu ili bankovni izvod. Odaberi jednu pretplatu. Otkaži. Bez istraživanja zamjena, bez uspoređivanja opcija — samo otkaži jednu. Savršena alternativa ne postoji; dovoljna alternativa svuda je.' },
    { day: 5,  task: 'Otvori investicijski račun (Degiro, Trading 212) — bez čitanja foruma', tip_: '🚀 Otvoren račun ≠ obveza ulaganja', detail: 'Posjeti Degiro.hr ili Trading212.com. Klikni "Otvori račun." Ispuni obrazac. Verifikacija traje 1-3 dana. Otvoren račun ne znači obvezu ulaganja — samo opciju. Bez čitanja foruma — oni samo stvaraju paralizu.' },
    { day: 6,  task: 'Ulož 50 € u S&P 500 ETF — bez analize timing-a. Odmah.', tip_: '💸 Dollar-cost averaging > timing', detail: 'U tražilici investicijskog računa piši "S&P 500." Pojave se opcije (VUSA, CSPX, SWDA). Klikni Kupi → 50€ → Potvrdi. Gotovo. Savršen timing ne postoji — pravi trenutak za investiranje je uvijek sada.' },
    { day: 7,  task: 'Tjedni pregled: što si implementirao/la? (1 = štednja, 2 = investicija)', tip_: '✅ Tjedan 1 — 2 konkretne akcije!', detail: 'Provjeri 2 broja: 1) Je li automatski nalog za štednju prošao (da/ne)? 2) Koja je trenutna vrijednost investicije? Zapiši oba broja. Ne analiziraj — samo dokumentiraj napredak.' },
    { day: 8,  task: 'Definiraj hitni fond: koliko trebaš i gdje ćeš ga čuvati', tip_: '🛡️ Plan u 10 minuta, bez analize', detail: 'Izračunaj: mjesečni troškovi × 3 = minimalni hitni fond. Za 1.200€/mj = 3.600€ cilj. Odaberi štedni račun bez debitne kartice. Plan za hitni fond u 10 minuta — bez traženja "savršenog računa."' },
    { day: 9,  task: 'Prebaci prvu ratu hitnog fonda — 200-300 €, odmah', tip_: '⚡ Nije savršen iznos — ali je stvaran', detail: 'Otvori internet bankarstvo → Prenos → Štedni račun → 200-300€ → Potvrdi. Gotovo. Nije savršen iznos — ali je stvaran. Savršen iznos koji nikad ne prebacuješ matematički je jednak nuli.' },
    { day: 10, task: 'Postavi podsjetnik: svaki 1. u měsеcu prebacuješ ratu hitnog fonda', tip_: '📅 Automatizacija eliminira zaboravljanje', detail: 'Kalendar → Ponavljajući podsjetnik svaki 1. u mj: "Prebaci X€ na hitni fond." Bez podsjetnika = bez dosljednosti. Bez dosljednosti = bez hitnog fonda. Jedan podsjetnik = problem riješen zauvijek.' },
    { day: 11, task: 'Napiši 3 konkretna financijska cilja — bez istraživanja, iz glave', tip_: '🎯 Tvoja intuicija o prioritetima je točna', detail: 'Zapiši 3 cilja odmah, iz glave, bez istraživanja: kratkoročni (6 mj), srednjoročni (2-3 god), dugoročni (10+ god). Tvoja intuicija o vlastitim prioritetima je točna — ne treba potvrda iz knjige.' },
    { day: 12, task: 'Nazovi banku i pitaj za bolji štedni kamatnjak — 10 min, bez pripreme', tip_: '📞 Improvizacija je u redu', detail: 'Nazovi banku ili otvori chat. Reci: "Koji štedni račun kod vas ima najveću kamatnu stopu i koji su uvjeti?" Jedna akcija od 10 minuta, bez pripreme skripte. Improvizacija je u redu — važna je akcija.' },
    { day: 13, task: 'Provjeri postoji li kreditna kartica s boljim uvjetima — apliciraj odmah', tip_: '💳 Akcija, ne usporedba 12 opcija', detail: 'Usporedi uvjete svog i jedne alternative kreditne kartice (godišnja naknada, kamatna stopa, cashback). Nađi bolju opciju. Apliciraj odmah — bez uspoređivanja svih 12 opcija. Dovoljno dobro pobjeđuje savršeno.' },
    { day: 14, task: 'Tjedni pregled: 2 tjedna akcije. Koliko te koštalo NEČINJENJE dosad?', tip_: '✅ 2 tjedna — više si napravio/la nego godinu!', detail: 'Izračunaj: 200€/mj × 12 mj × prošle 2 godine = 4.800€ + kamate. To je iznos koji si izgubio/la čekajući. Trošak nečinjenja je realan — ali sad se oporavlja. 2 tjedna akcije > 2 godine planiranja.' },
    { day: 15, task: 'Dodaj 50 € više u investicije ovog mjeseca — bez analiziranja', tip_: '📈 Svaki euro investiran danas vrijedi više', detail: 'Otvori investicijski račun → Kupi → Dodaj 50€ extra u isti ETF kao dana 6. Bez analize je li "pravi trenutak." Dollar cost averaging funkcionira jer prosječiš cijenu kroz volatile tržište — kontinuitet pobjeđuje timing.' },
    { day: 16, task: 'Pronađi jedan dug s највišом kamatom — pošalji extra 100 € sutra', tip_: '💸 Eliminacija duga = garantirani prinos', detail: 'Otvori popis dugova. Pronađi onaj s najvećom kamatnom stopom. Pošalji extra 100€ na taj dug sutra ujutro. Prinos = kamatna stopa duga (garantiran). Bolji od tržišta kad kamate su visoke.' },
    { day: 17, task: 'Razgovaraj s partnerom ili kolegom o financijama — bez demonstriranja znanja', tip_: '👥 Podučavanjem usvajamo 90% sadržaja', detail: 'Objasni jednoj osobi što si naučio/la o financijama u 2 tjedna — jednostavnim riječima, bez žargona. Ne moraš biti stručnjak. Podučavanjem se konsolidira 90% naučenog sadržaja — bolje od ponovnog čitanja.' },
    { day: 18, task: 'Uspostavi pravilo: max 10 min istraživanja prije svake financijske odluke', tip_: '⏱️ Vremensko ograničenje ruši paralizu analize', detail: 'Za svaku buduću financijsku odluku: postavi timer na 10 minuta. Istraži. Kad timer istekne — odluči. Vremensko ograničenje eliminira paralizu analize bez gubitka kvalitete odluke. Implementiraj od danas.' },
    { day: 19, task: 'Ulož još 50 € u investicije — bez čekanja na "pravi trenutak"', tip_: '🎯 Pravi trenutak je uvijek sada', detail: 'Dodaj još 50€ u investicije danas. Ne čekaj bolje vijesti s tržišta — one nikad ne dolaze u "savršenom" trenutku. Kontinuitet investiranja statistički pobjeđuje timing svaki put na dugim rokovima.' },
    { day: 20, task: 'Napiši jednu stvar koju si financijski odgađao/la godinama — napravi je danas', tip_: '⚡ Trošak odlaganja je stvaran', detail: 'Koji financijski korak odgađaš godinama? Otvaranje investicijskog računa, plan mirovine, razgovor s partnerom o novcu, pregovaranje plaće. Napravi tu jednu stvar danas. Odlaganje ima stvaran matematički trošak.' },
    { day: 21, task: 'Tjedni pregled: 21 dan akcije bez analize. Što si osjetio/la?', tip_: '✅ 21 dan — mozak se promijenio!', detail: '3 tjedna akcije bez analize. Što si implementirao/la? Kako se osjećaš vs. dan 1 — manje anksioznosti? Više kontrole? Zapiši konkretno jer u tijeku zaboravljamo vlastiti napredak.' },
    { day: 22, task: 'Automatiziraj sve što možeš: štednja, investicije, računi — na trajne naloge', tip_: '🤖 Automatizirano > svjesno kontrolirano', detail: 'Napravi popis: štednja, investicije, rate kredita, fiksni računi. Svaki na automatski trajni nalog ako već nije. Manje financijskih odluka svaki mjesec = manje mentalne energije potrošene = više za ostalo.' },
    { day: 23, task: 'Pregledaj sve automatizacije — rade li? Prilagodi bez duboke analize', tip_: '🔧 Prilagodba ≠ perfekcionizam', detail: 'Provjeri svaki trajni nalog: je li prošao ovog mjeseca? Je li iznos ispravan? Prilagodi u jednom pogledu, bez produbljivanja analize. Kratki pregled, jedna prilagodba ako treba — gotovo.' },
    { day: 24, task: 'Napravi financijsku bilancu: imovina minus obveze = neto vrijednost', tip_: '📊 Jedan broj koji govori sve', detail: 'Imovina (ušteđevina + investicije + nekretnina) minus obveze (dugovi + krediti) = neto vrijednost. Taj jedan broj govori više o financijskom zdravlju od svakog pojedinog računa zasebno.' },
    { day: 25, task: 'Postavi cilj neto vrijednosti za 1 godinu — napiši ga bez kalkulatora', tip_: '🎯 Intuitivni cilj + plan > savršen cilj bez akcije', detail: 'Koji iznos neto vrijednosti želiš za godinu dana? Procijeni odmah, bez kalkulatora. Intuitivni cilj + plan je uvijek bolji od savršenog cilja koji čeka savršene informacije. Zapiši i zalijepi na vidljivo.' },
    { day: 26, task: 'Istraži jedan NOVI izvor prihoda — 30 min max, onda ODLUČI', tip_: '💰 Odluka bez savršenih informacija', detail: 'Postavi timer na 30 minuta. Istraži jedan novi izvor prihoda (dodatni posao, pregovaranje plaće, pasivni prihod). Kad timer istekne — odluči: da ili ne. Bez dodatnog "istraživanja." Odluka u nesavršenosti.' },
    { day: 27, task: 'Napravi jednu konkretnu akciju prema novom izvoru prihoda', tip_: '⚡ Gotovo, ne savršeno', detail: 'Pošalji email, uplati pristupninu, napiši prvu ponudu ili dogovori razgovor. Jedna konkretna akcija danas. Imperfektna akcija koja se dogodi pobjeđuje savršeni plan koji čeka savršene uvjete.' },
    { day: 28, task: 'Tjedni pregled: 4 tjedna akcije — koliko si implementirao/la?', tip_: '✅ 4 tjedna — akcijski čovjek/žena!', detail: 'Nabroji konkretno: koje akcije si implementirao/la od dana 1? Svaka implementirana akcija vrijedi 100× više od pročitane teorije. Bogatstvo grade implementirane akcije, ne akumulirano znanje.' },
    { day: 29, task: 'Napiši 3 stvari koje si naučio/la o SEBI (ne o financijama) u 30 dana', tip_: '🏆 Samosvijest = kapital koji ne gubi vrijednost', detail: 'Što si naučio/la o sebi — ne o financijama? Brže odlučuješ? Manje te paralizira neizvjesnost? Prihvaćaš imperfektne akcije? Samosvijest o vlastitim obrascima je kapital koji se ne amortizira.' },
    { day: 30, task: 'Postavi 3 konkretne akcije za sljedeći mjesec — bez analize, odmah napiši', tip_: '🎯 Kraj je novi početak', detail: 'Bez analize — odmah zapiši 3 konkretne akcije: broj 1, broj 2, broj 3. Akcija koja je zapisana ima 40% veću šansu realizacije. Akcija koja nije zapisana = nula šanse. Zapiši sada.' },
  ],
}

const DEFAULT_PLAN: Task[] = PLANOVI.vrtlog

const QUIZ_QUESTIONS: { q: string; opts: { label: string; tip: Tip }[] }[] = [
  {
    q: 'Kako završavaš tipičan mjesec?',
    opts: [
      { label: 'Potrošio/la sam gotovo sve — živim punim plućima', tip: 'hedonist' },
      { label: 'Imam ušteđevinu, ali je ne diram — oprezan/na sam sa svime', tip: 'branic' },
      { label: 'Planirao/la sam štedjeti, ali nekako nije ispalo', tip: 'vrtlog' },
      { label: 'Analizirao/la sam gdje ide novac, ali nisam ništa promijenio/la', tip: 'teoreticar' },
    ],
  },
  {
    q: 'Kada pomisliš na kupnju nečeg skupljeg, obično...',
    opts: [
      { label: 'Kupim odmah ako mi se sviđa — za to i radim', tip: 'hedonist' },
      { label: 'Razmišljam mjesecima i na kraju najčešće ne kupim', tip: 'branic' },
      { label: 'Planirao/la sam to kupiti "sljedeći mjesec" već godinu dana', tip: 'vrtlog' },
      { label: 'Istražujem tjednima sve opcije, usporedbe i recenzije', tip: 'teoreticar' },
    ],
  },
  {
    q: 'Tvoj odnos prema investiranju trenutno:',
    opts: [
      { label: 'Radije potrošim — ulaganje mi nije prioritet', tip: 'hedonist' },
      { label: 'Plašim se izgubiti novac, volim sigurni štedni račun', tip: 'branic' },
      { label: 'Hoću investirati, ali uvijek odgodim za "kad se smirim"', tip: 'vrtlog' },
      { label: 'Znam sve o ETF-ovima i Buffettu — ali još nisam počeo/la', tip: 'teoreticar' },
    ],
  },
  {
    q: 'Kad stigne plaća, tvoj prvi impuls je:',
    opts: [
      { label: 'Isplanirati nešto lijepo — zaslužujem nagradu', tip: 'hedonist' },
      { label: 'Odmah prebaciti na štedni račun što god mogu', tip: 'branic' },
      { label: 'Napraviti budžet — ali ga se rijetko i držim', tip: 'vrtlog' },
      { label: 'Kalkulirati sve moguće načine alokacije', tip: 'teoreticar' },
    ],
  },
  {
    q: 'Što je tvoj najveći financijski izazov?',
    opts: [
      { label: 'Trošim previše na stvari koje volim', tip: 'hedonist' },
      { label: 'Imam ušteđevinu, ali se bojim investirati', tip: 'branic' },
      { label: 'Počnem s navikama, ali ne izdržim dulje od tjedan-dva', tip: 'vrtlog' },
      { label: 'Istražujem i planiram — ali rijetko dođem do akcije', tip: 'teoreticar' },
    ],
  },
]

function calculateType(answers: Record<number, Tip>): Tip {
  const counts: Record<Tip, number> = { hedonist: 0, branic: 0, vrtlog: 0, teoreticar: 0 }
  Object.values(answers).forEach(t => counts[t]++)
  return (['hedonist', 'branic', 'vrtlog', 'teoreticar'] as Tip[])
    .reduce((best, t) => counts[t] > counts[best] ? t : best)
}

// ─── Subkomponente ────────────────────────────────────────────────────────────

function HealthScoreGauge({ score }: { score: number }) {
  const color = score < 40 ? '#ef4444' : score < 60 ? '#f59e0b' : score < 80 ? '#22c55e' : '#D4AF37'
  const label = score < 40 ? 'Kritično' : score < 60 ? 'Osnovno' : score < 80 ? 'Dobro' : 'Odlično'
  return (
    <div className="flex flex-col items-center">
      <svg viewBox="0 0 200 120" width="200" height="120">
        <path d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="16" strokeLinecap="round" />
        <path d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke={color} strokeWidth="16" strokeLinecap="round"
          strokeDasharray={`${(score / 100) * 251.2} 251.2`} style={{ transition: 'stroke-dasharray 1.5s ease-out' }} />
        <text x="100" y="88" textAnchor="middle" fontSize="36" fontWeight="900" fill={color}>{score}</text>
        <text x="100" y="108" textAnchor="middle" fontSize="13" fill="rgba(255,255,255,0.45)">/100 · {label}</text>
      </svg>
      <p className="text-xs text-center mt-1" style={{ color: 'rgba(255,255,255,0.35)' }}>Početni Health Score baziran na tvojem tipu</p>
    </div>
  )
}

function PlanRow({ task, done, onToggle }: { task: Task; done: boolean; onToggle: () => void }) {
  const [showInfo, setShowInfo] = useState(false)
  return (
    <div>
      <button onClick={onToggle} className="w-full text-left flex items-start gap-3 rounded-xl px-4 py-3 transition-all"
        style={{ backgroundColor: done ? 'rgba(34,197,94,0.08)' : 'rgba(255,255,255,0.03)', border: `1px solid ${done ? 'rgba(34,197,94,0.25)' : 'rgba(255,255,255,0.07)'}`, borderBottomLeftRadius: showInfo ? 0 : undefined, borderBottomRightRadius: showInfo ? 0 : undefined }}>
        <span className="flex-shrink-0 mt-0.5 w-5 h-5 rounded-full border flex items-center justify-center text-xs"
          style={{ borderColor: done ? '#22c55e' : 'rgba(255,255,255,0.25)', backgroundColor: done ? '#22c55e' : 'transparent', color: '#0D1B2A' }}>
          {done && '✓'}
        </span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold" style={{ color: 'rgba(212,175,55,0.6)' }}>Dan {task.day}</span>
            <button
              onClick={e => { e.stopPropagation(); setShowInfo(s => !s) }}
              className="flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center text-xs leading-none font-bold"
              style={{ backgroundColor: showInfo ? 'rgba(212,175,55,0.3)' : 'rgba(255,255,255,0.1)', color: showInfo ? '#D4AF37' : 'rgba(255,255,255,0.35)', border: '1px solid ' + (showInfo ? 'rgba(212,175,55,0.4)' : 'rgba(255,255,255,0.12)') }}
              title="Što trebam napraviti?"
            >i</button>
          </div>
          <p className="text-sm leading-snug" style={{ color: done ? 'rgba(255,255,255,0.45)' : 'rgba(255,255,255,0.8)', textDecoration: done ? 'line-through' : 'none' }}>
            {task.task}
          </p>
        </div>
      </button>
      {showInfo && (
        <div className="px-4 py-3 rounded-b-xl" style={{ backgroundColor: 'rgba(212,175,55,0.07)', border: '1px solid rgba(212,175,55,0.18)', borderTop: 'none' }}>
          <p className="text-xs font-bold mb-1" style={{ color: '#D4AF37' }}>💡 Što trebam napraviti:</p>
          <p className="text-xs leading-relaxed mb-2" style={{ color: 'rgba(255,255,255,0.75)' }}>
            {task.detail ?? 'Napravi ovaj zadatak u cijelosti, ne samo pročitaj. Svaki završeni dan gradi financijsku naviku koja ostaje cijeli život.'}
          </p>
          <p className="text-xs italic" style={{ color: 'rgba(212,175,55,0.6)' }}>{task.tip_}</p>
        </div>
      )}
    </div>
  )
}

// ─── Proračun tracker ─────────────────────────────────────────────────────────

const BUDZET_KAT: Array<{
  key: 'potrebe' | 'zelje' | 'buducnost'
  label: string; emoji: string; target: number; color: string; items: string[]
}> = [
  { key: 'potrebe',   label: 'POTREBE',   emoji: '🏠', target: 50, color: '#3b82f6',
    items: ['Stanarina / Kredit', 'Hrana', 'Prijevoz / Gorivo', 'Struja / Komunalije', 'Osiguranje', 'Pretplate (fiksne)', 'Ostalo'] },
  { key: 'zelje',     label: 'ŽELJE',     emoji: '🎭', target: 30, color: '#f59e0b',
    items: ['Restoran / Kava', 'Odjeća', 'Zabava / Izlasci', 'Hobiji', 'Njega / Kozmetika', 'Ostalo'] },
  { key: 'buducnost', label: 'BUDUĆNOST', emoji: '📈', target: 20, color: '#22c55e',
    items: ['Štednja', 'Hitni fond', 'Investicije / ETF', 'Otplata duga', 'Ostalo'] },
]

interface BudzetData {
  income: number
  potrebe: number[]
  zelje: number[]
  buducnost: number[]
  notes: string
}

function defaultBudzet(): BudzetData {
  return { income: 0, potrebe: Array(7).fill(0), zelje: Array(6).fill(0), buducnost: Array(5).fill(0), notes: '' }
}

function openBudzetPrint(data: BudzetData, monthLabel: string, blank: boolean) {
  const G = '#C5A028'
  const katHtml = (k: 'potrebe' | 'zelje' | 'buducnost') => {
    const kat = BUDZET_KAT.find(x => x.key === k)!
    const vals = blank ? Array(kat.items.length).fill(0) : data[k] as number[]
    const tot = (vals as number[]).reduce((s: number, v: number) => s + v, 0)
    const pct = !blank && data.income > 0 ? `${Math.round((tot / data.income) * 100)}%` : '—'
    const rows = kat.items.map((item, i) => `
      <tr><td style="padding:5px 8px;border-bottom:1px solid #eee;font-size:11px;color:#555">${item}</td>
      <td style="padding:5px 8px;border-bottom:1px solid #eee;text-align:right;font-size:11px;font-weight:bold">
        ${blank ? '<span style="color:#bbb">_____________ €</span>' : `${((vals as number[])[i] || 0).toFixed(2)} €`}
      </td></tr>`).join('')
    return `<table style="width:100%;border-collapse:collapse;margin-bottom:16px">
      <thead><tr style="background:${kat.color}22">
        <th style="padding:8px;text-align:left;font-size:12px;color:${kat.color};border-left:3px solid ${kat.color}">
          ${kat.emoji} ${kat.label} <span style="font-weight:400;color:#888;font-size:10px">  cilj ${kat.target}%</span></th>
        <th style="padding:8px;text-align:right;font-size:13px;color:#333">
          ${blank ? '<span style="color:#bbb">_____________ €</span>' : `${tot.toFixed(2)} €`}
          <span style="font-size:11px;color:${kat.color};margin-left:8px">${pct}</span>
        </th></tr></thead><tbody>${rows}</tbody></table>`
  }
  const totAll = blank ? 0 : (['potrebe','zelje','buducnost'] as const).reduce((s, k) => s + (data[k] as number[]).reduce((a, b) => a + b, 0), 0)
  const ostaje = blank ? 0 : data.income - totAll
  const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Proračun ${monthLabel}</title>
    <style>body{font-family:Arial,sans-serif;padding:15mm 20mm;color:#222;font-size:12px}@media print{body{padding:10mm 15mm}}</style>
    </head><body>
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:24px;padding-bottom:12px;border-bottom:3px solid ${G}">
      <div><div style="font-size:10px;letter-spacing:2px;color:${G};font-weight:bold;text-transform:uppercase">FinCoach VIP · Starter Paket</div>
        <div style="font-size:22px;font-weight:900;color:#1a1a2e;margin-top:2px">Moj Proračun</div>
        <div style="font-size:13px;color:#666;margin-top:2px">${monthLabel}</div></div>
      <div style="text-align:right;font-size:10px;color:#aaa">www.fincoach.vip</div></div>
    <table style="width:100%;margin-bottom:20px;border-collapse:collapse"><tr style="background:#f8f6f0">
      <td style="padding:10px 12px;font-weight:bold;font-size:14px">💰 Neto prihodi ovog mjeseca</td>
      <td style="padding:10px 12px;text-align:right;font-size:16px;font-weight:900;color:${G}">
        ${blank ? '<span style="color:#bbb">_____________ €</span>' : `${data.income.toFixed(2)} €`}</td></tr></table>
    ${katHtml('potrebe')}${katHtml('zelje')}${katHtml('buducnost')}
    <table style="width:100%;border-collapse:collapse;margin-top:8px">
      <tr style="background:#f8f6f0"><td style="padding:8px 12px;font-size:12px;color:#555">Ukupni troškovi</td>
        <td style="padding:8px 12px;text-align:right;font-weight:bold">${blank ? '— €' : `${totAll.toFixed(2)} €`}</td></tr>
      <tr style="background:${blank ? '#f8f8f8' : ostaje >= 0 ? '#e8f5e9' : '#fde8e8'}">
        <td style="padding:8px 12px;font-size:13px;font-weight:bold">Ostaje (prihodi − troškovi)</td>
        <td style="padding:8px 12px;text-align:right;font-size:14px;font-weight:900;color:${blank ? '#bbb' : ostaje >= 0 ? '#22c55e' : '#ef4444'}">
          ${blank ? '— €' : `${ostaje >= 0 ? '+' : ''}${ostaje.toFixed(2)} €`}</td></tr></table>
    <div style="margin-top:20px;padding:10px;background:#fffbf0;border:1px solid ${G}40;border-radius:6px">
      <div style="font-size:10px;font-weight:bold;color:${G};margin-bottom:4px">METODA 50/30/20</div>
      <div style="font-size:10px;color:#666;display:flex;gap:20px">
        <span>🏠 Potrebe: max 50%</span><span>🎭 Željé: max 30%</span><span>📈 Budućnost: min 20%</span></div></div>
    ${!blank && data.notes ? `<div style="margin-top:16px;padding:12px;background:#f8f8f8;border-left:3px solid ${G};border-radius:4px">
      <div style="font-size:10px;font-weight:bold;color:#888;margin-bottom:4px">BILJEŠKE</div>
      <div style="font-size:11px;color:#555">${data.notes.replace(/\n/g, '<br>')}</div></div>` : ''}
    ${blank ? `<div style="margin-top:20px;border:1px dashed #ccc;padding:12px;min-height:60px">
      <div style="font-size:10px;color:#aaa;margin-bottom:4px">BILJEŠKE:</div></div>` : ''}
    <script>window.onload=function(){window.print();window.onafterprint=function(){window.close()}}</script>
    </body></html>`
  const w = window.open('', '_blank', 'width=800,height=900')
  if (w) { w.document.write(html); w.document.close() }
}

function BudzetTracker({ userEmail }: { userEmail: string }) {
  const now = new Date()
  const [month, setMonth] = useState(`${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`)
  const [data, setData] = useState<BudzetData>(defaultBudzet)

  useEffect(() => {
    try {
      const s = localStorage.getItem(`fc_b_${userEmail}_${month}`)
      setData(s ? JSON.parse(s) : defaultBudzet())
    } catch { setData(defaultBudzet()) }
  }, [month, userEmail])

  function save(next: BudzetData) {
    localStorage.setItem(`fc_b_${userEmail}_${month}`, JSON.stringify(next))
    setData(next)
  }

  const sumFn = (arr: number[]) => arr.reduce((s, v) => s + v, 0)
  const pctFn = (n: number) => data.income > 0 ? Math.round((n / data.income) * 100) : 0
  const totAll = sumFn(data.potrebe) + sumFn(data.zelje) + sumFn(data.buducnost)
  const ostaje = data.income - totAll
  const monthLabel = new Date(month + '-01').toLocaleDateString('hr-HR', { month: 'long', year: 'numeric' })

  return (
    <div>
      <div className="flex items-start justify-between mb-5">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: 'rgba(212,175,55,0.6)' }}>Odaberi mjesec</p>
          <input type="month" value={month} onChange={e => setMonth(e.target.value)}
            className="rounded-lg px-3 py-1.5 text-sm font-bold"
            style={{ backgroundColor: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', color: '#D4AF37' }} />
        </div>
        <div className="flex flex-col gap-2 mt-5">
          <button onClick={() => openBudzetPrint(data, monthLabel, false)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap"
            style={{ backgroundColor: 'rgba(212,175,55,0.15)', color: '#D4AF37', border: '1px solid rgba(212,175,55,0.3)' }}>
            🖨️ Ispis / PDF
          </button>
          <button onClick={() => openBudzetPrint(defaultBudzet(), monthLabel, true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap"
            style={{ backgroundColor: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.45)', border: '1px solid rgba(255,255,255,0.1)' }}>
            📄 Prazan predložak
          </button>
        </div>
      </div>

      <div className="rounded-xl p-4 mb-4" style={{ backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(212,175,55,0.25)' }}>
        <div className="flex items-center justify-between gap-3">
          <span className="text-sm font-bold" style={{ color: '#fff' }}>💰 Neto prihodi — {monthLabel}</span>
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <input type="number" min={0} value={data.income || ''} placeholder="npr. 1800"
              onChange={e => save({ ...data, income: Number(e.target.value) || 0 })}
              className="w-24 text-right rounded-lg px-2 py-1.5 text-sm font-bold"
              style={{ backgroundColor: 'rgba(255,255,255,0.08)', border: '1px solid rgba(212,175,55,0.4)', color: '#D4AF37' }} />
            <span className="text-sm font-bold" style={{ color: 'rgba(255,255,255,0.4)' }}>€</span>
          </div>
        </div>
      </div>

      {BUDZET_KAT.map(kat => {
        const amounts = data[kat.key] as number[]
        const tot = sumFn(amounts); const p = pctFn(tot); const diff = p - kat.target
        const sc = diff > 5 ? '#ef4444' : (Math.abs(diff) <= 5 && data.income > 0) ? '#22c55e' : 'rgba(255,255,255,0.35)'
        return (
          <div key={kat.key} className="rounded-xl mb-4 overflow-hidden" style={{ border: `1px solid ${kat.color}30` }}>
            <div className="flex items-center justify-between px-4 py-3"
              style={{ backgroundColor: `${kat.color}18`, borderBottom: `1px solid ${kat.color}22` }}>
              <span className="text-sm font-black" style={{ color: kat.color }}>{kat.emoji} {kat.label}</span>
              <div className="flex items-center gap-2">
                {data.income > 0 && <span className="text-xs font-bold" style={{ color: sc }}>{p}% / {kat.target}%</span>}
                <span className="text-sm font-black" style={{ color: '#fff' }}>{tot.toFixed(0)} €</span>
              </div>
            </div>
            <div className="px-4 py-3 space-y-2" style={{ backgroundColor: 'rgba(0,0,0,0.1)' }}>
              {kat.items.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between gap-3">
                  <span className="text-xs flex-1" style={{ color: 'rgba(255,255,255,0.5)' }}>{item}</span>
                  <div className="flex items-center gap-1">
                    <input type="number" min={0} value={amounts[idx] || ''} placeholder="0"
                      onChange={e => {
                        const arr = [...amounts]; arr[idx] = Number(e.target.value) || 0
                        save({ ...data, [kat.key]: arr })
                      }}
                      className="w-20 text-right rounded px-2 py-1 text-xs"
                      style={{ backgroundColor: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }} />
                    <span className="text-xs" style={{ color: 'rgba(255,255,255,0.25)' }}>€</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      })}

      <div className="rounded-xl p-5 mb-4" style={{ backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}>
        <p className="text-xs font-bold uppercase tracking-wider mb-4" style={{ color: 'rgba(255,255,255,0.35)' }}>📊 Usporedba s metodom 50/30/20</p>
        {BUDZET_KAT.map(kat => {
          const tot = sumFn(data[kat.key] as number[]); const p = pctFn(tot)
          return (
            <div key={kat.key} className="flex items-center gap-3 mb-3">
              <span className="text-xs w-20 flex-shrink-0" style={{ color: 'rgba(255,255,255,0.5)' }}>{kat.label}</span>
              <div className="flex-1 rounded-full h-2.5" style={{ backgroundColor: 'rgba(255,255,255,0.06)' }}>
                <div className="h-2.5 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(p, 100)}%`, backgroundColor: kat.color }} />
              </div>
              <span className="text-xs w-14 text-right tabular-nums font-bold" style={{ color: data.income > 0 ? kat.color : 'rgba(255,255,255,0.2)' }}>
                {data.income > 0 ? `${p}% / ${kat.target}` : '—'}
              </span>
            </div>
          )
        })}
        <div className="h-px my-3" style={{ backgroundColor: 'rgba(255,255,255,0.08)' }} />
        <div className="flex justify-between items-center">
          <span className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>Ostaje neraspoređeno</span>
          <span className="text-xl font-black" style={{ color: ostaje >= 0 ? '#22c55e' : '#ef4444' }}>
            {ostaje >= 0 ? '+' : ''}{ostaje.toFixed(0)} €
          </span>
        </div>
      </div>

      <div className="rounded-xl p-4" style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
        <p className="text-xs font-bold mb-2" style={{ color: 'rgba(255,255,255,0.35)' }}>📝 Bilješke — {monthLabel}</p>
        <textarea rows={3} value={data.notes} placeholder="Npr. Plaća stiže 5., auto servis 80€ neplanirano..."
          onChange={e => save({ ...data, notes: e.target.value })}
          className="w-full resize-none rounded-lg px-3 py-2 text-xs"
          style={{ backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.65)', outline: 'none' }} />
      </div>
    </div>
  )
}

// ─── Glavni page ──────────────────────────────────────────────────────────────

export default function StarterPortalPage() {
  const router = useRouter()
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<StarterData | null>(null)
  const [doneTasks, setDoneTasks] = useState<Set<number>>(new Set())
  const [activeTab, setActiveTab] = useState<'dijagnoza' | 'plan' | 'videa' | 'materijali'>('dijagnoza')
  const [tabInitialized, setTabInitialized] = useState(false)
  const [showQuiz, setShowQuiz] = useState(false)
  const [quizAnswers, setQuizAnswers] = useState<Record<number, Tip>>({})
  const [quizSubmitting, setQuizSubmitting] = useState(false)
  const [quizError, setQuizError] = useState('')
  const [completionStep, setCompletionStep] = useState<null | 'quiz' | 'result'>(null)
  const [finalScore, setFinalScore] = useState<number | null>(null)
  const [reassessmentAnswers, setReassessmentAnswers] = useState<Record<number, Tip>>({})

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/prijava?redirect=/portal/starter'); return }

      const res = await fetch('/api/starter/portal-data')
      const json = await res.json()

      if (!json.ok) { router.push('/portal'); return }

      setData(json)
      if (!json.financial_type) setShowQuiz(true)

      const stored = localStorage.getItem(`fc_starter_done_portal_${user.id}`)
      if (stored) {
        try { setDoneTasks(new Set(JSON.parse(stored))) } catch { /* ignore */ }
      }

      // Persist active tab — default to 'plan' if quiz already completed
      const savedTab = localStorage.getItem('fc_starter_tab') as 'dijagnoza' | 'plan' | 'videa' | 'materijali' | null
      if (savedTab) {
        setActiveTab(savedTab)
      } else if (json.financial_type) {
        setActiveTab('plan')
      }
      setTabInitialized(true)
      setLoading(false)
    }
    load()
  }, [])

  async function toggleTask(day: number) {
    if (doneTasks.has(day)) return
    const { data: { user } } = await supabase.auth.getUser()
    const next = new Set(doneTasks)
    next.add(day)
    if (user) localStorage.setItem(`fc_starter_done_portal_${user.id}`, JSON.stringify(Array.from(next)))
    setDoneTasks(next)
    if (day === 30) setCompletionStep('quiz')
  }

  async function submitQuiz() {
    if (Object.keys(quizAnswers).length !== QUIZ_QUESTIONS.length) return
    setQuizSubmitting(true)
    setQuizError('')
    const detectedType = calculateType(quizAnswers)
    const initialScore = TIPOVI[detectedType].zdravScore
    try {
      const res = await fetch('/api/starter/set-type-portal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ financial_type: detectedType, initial_score: initialScore }),
      })
      const json = await res.json()
      if (!json.ok) throw new Error(json.error ?? 'Greška')
      setData(prev => prev ? { ...prev, financial_type: detectedType, initial_score: prev.initial_score ?? initialScore } : prev)
      setShowQuiz(false)
    } catch {
      setQuizError('Greška pri spremanju — pokušaj ponovo.')
    } finally {
      setQuizSubmitting(false)
    }
  }

  async function resetDijagnoza() {
    await fetch('/api/starter/reset-type', { method: 'POST' })
    setData(prev => prev ? { ...prev, financial_type: null } : prev)
    setShowQuiz(true)
  }

  async function submitReassessment() {
    if (Object.keys(reassessmentAnswers).length !== QUIZ_QUESTIONS.length) return
    const baseScore = data?.initial_score ?? DEFAULT_TIP.zdravScore
    const bonus = Math.round((doneTasks.size / 30) * 22)
    const newScore = Math.min(100, baseScore + bonus)
    setFinalScore(newScore)
    setCompletionStep('result')
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#0D1B2A' }}>
      <p style={{ color: 'rgba(255,255,255,0.45)' }}>Učitavam Starter Paket...</p>
    </div>
  )

  if (!data) return null

  // ── Completion re-assessment quiz ──────────────────────────────────────────
  if (completionStep === 'quiz') {
    const answeredCount = Object.keys(reassessmentAnswers).length
    const allAnswered = answeredCount === QUIZ_QUESTIONS.length
    const firstName = data.full_name?.split(' ')[0] || 'prijatelju'
    return (
      <div className="min-h-screen px-4 pb-24 pt-8" style={{ backgroundColor: '#0D1B2A', color: '#fff' }}>
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-block text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-5"
              style={{ backgroundColor: 'rgba(34,197,94,0.12)', color: '#22c55e', border: '1px solid rgba(34,197,94,0.3)' }}>
              🎉 30 dana završeno!
            </div>
            <h1 className="text-2xl font-black mb-2">Ponovna procjena, {firstName}!</h1>
            <p className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>Odgovori na ista 5 pitanja kako bismo vidjeli tvoj napredak.</p>
          </div>
          <div className="mb-4 flex items-center gap-2">
            <div className="flex-1 rounded-full h-1.5" style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}>
              <div className="h-1.5 rounded-full transition-all duration-500"
                style={{ width: `${(answeredCount / QUIZ_QUESTIONS.length) * 100}%`, backgroundColor: '#22c55e' }} />
            </div>
            <span className="text-xs tabular-nums" style={{ color: 'rgba(255,255,255,0.35)' }}>{answeredCount}/{QUIZ_QUESTIONS.length}</span>
          </div>
          <div className="space-y-6">
            {QUIZ_QUESTIONS.map((q, qi) => (
              <div key={qi} className="rounded-2xl p-5"
                style={{ backgroundColor: 'rgba(255,255,255,0.04)', border: `1px solid ${reassessmentAnswers[qi] ? 'rgba(34,197,94,0.3)' : 'rgba(255,255,255,0.08)'}` }}>
                <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: 'rgba(255,255,255,0.3)' }}>Pitanje {qi + 1}</p>
                <p className="font-bold mb-4" style={{ lineHeight: 1.4 }}>{q.q}</p>
                <div className="space-y-2">
                  {q.opts.map((opt, oi) => {
                    const selected = reassessmentAnswers[qi] === opt.tip
                    return (
                      <button key={oi} onClick={() => setReassessmentAnswers(prev => ({ ...prev, [qi]: opt.tip }))}
                        className="w-full text-left rounded-xl px-4 py-3 text-sm transition-all"
                        style={{ backgroundColor: selected ? 'rgba(34,197,94,0.15)' : 'rgba(255,255,255,0.03)', border: `1px solid ${selected ? 'rgba(34,197,94,0.5)' : 'rgba(255,255,255,0.07)'}`, color: selected ? '#22c55e' : 'rgba(255,255,255,0.7)', fontWeight: selected ? 700 : 400 }}>
                        {selected && <span className="mr-2">✓</span>}{opt.label}
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
          <button onClick={submitReassessment} disabled={!allAnswered}
            className="w-full mt-6 rounded-xl py-4 font-black text-lg transition-opacity hover:opacity-90 disabled:opacity-40"
            style={{ backgroundColor: '#22c55e', color: '#0D1B2A' }}>
            {allAnswered ? 'Vidi rezultat →' : `Odgovori na sva pitanja (${answeredCount}/5)`}
          </button>
          <button onClick={() => setCompletionStep(null)} className="w-full mt-3 text-sm py-2"
            style={{ color: 'rgba(255,255,255,0.35)' }}>
            Preskoči
          </button>
        </div>
      </div>
    )
  }

  // ── Completion result view ─────────────────────────────────────────────────
  if (completionStep === 'result' && finalScore !== null) {
    const initialScore = data.initial_score ?? DEFAULT_TIP.zdravScore
    const improved = finalScore > initialScore
    const diff = finalScore - initialScore
    const firstName = data.full_name?.split(' ')[0] || 'prijatelju'
    return (
      <div className="min-h-screen px-4 pb-24 pt-8" style={{ backgroundColor: '#0D1B2A', color: '#fff' }}>
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <div className="text-5xl mb-4">{improved ? '🏆' : '📊'}</div>
            <h1 className="text-2xl font-black mb-2">
              {improved ? `Čestitamo, ${firstName}!` : `Tvoj napredak, ${firstName}!`}
            </h1>
            <p className="text-sm" style={{ color: 'rgba(255,255,255,0.45)' }}>
              {improved ? 'Tvoj financijski Health Score je porastao.' : 'Završio/la si 30-dnevni program!'}
            </p>
          </div>

          <div className="rounded-2xl p-6 mb-5" style={{ backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}>
            <h2 className="text-base font-bold mb-5 text-center" style={{ color: '#D4AF37' }}>📊 Usporedba Health Score-a</h2>
            <div className="flex items-center justify-around">
              <div className="text-center">
                <p className="text-xs uppercase tracking-wider mb-2" style={{ color: 'rgba(255,255,255,0.35)' }}>Početak</p>
                <p className="text-5xl font-black" style={{ color: 'rgba(255,255,255,0.5)' }}>{initialScore}</p>
                <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.3)' }}>/100</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-black" style={{ color: improved ? '#22c55e' : '#f59e0b' }}>
                  {improved ? `+${diff}` : `±${Math.abs(diff)}`}
                </p>
                <p className="text-xs" style={{ color: improved ? 'rgba(34,197,94,0.6)' : 'rgba(245,158,11,0.6)' }}>bodova</p>
              </div>
              <div className="text-center">
                <p className="text-xs uppercase tracking-wider mb-2" style={{ color: 'rgba(255,255,255,0.35)' }}>Sada</p>
                <p className="text-5xl font-black" style={{ color: improved ? '#22c55e' : '#D4AF37' }}>{finalScore}</p>
                <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.3)' }}>/100</p>
              </div>
            </div>
          </div>

          {improved && (
            <div className="rounded-2xl p-5 mb-5" style={{ backgroundColor: 'rgba(34,197,94,0.07)', border: '1px solid rgba(34,197,94,0.2)' }}>
              <p className="text-sm font-bold mb-2" style={{ color: '#22c55e' }}>🎉 Nevjerojatan napredak!</p>
              <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.65)' }}>
                Podigao/la si score za <strong style={{ color: '#22c55e' }}>{diff} bodova</strong> za samo 30 dana!
                To je dokaz da financijske navike funkcioniraju — i da ti funkcioniraš.
                Zamisli što možeš postići za 90 dana.
              </p>
            </div>
          )}

          <div className="rounded-2xl p-5 mb-5" style={{ background: 'linear-gradient(135deg, rgba(212,175,55,0.12) 0%, rgba(212,175,55,0.04) 100%)', border: '1px solid rgba(212,175,55,0.3)' }}>
            <p className="text-sm font-bold mb-2" style={{ color: '#D4AF37' }}>🚀 Sljedeći korak: FinCoach VIP 90 dana</p>
            <p className="text-sm mb-4" style={{ color: 'rgba(255,255,255,0.6)' }}>
              Starter Paket bio je 30 dana. Program koji te vodi do financijske slobode traje 90 dana —
              investiranje, eliminacija duga, pasivni prihodi, individualni coaching.
              {improved
                ? ' Iskoristio/la si impuls koji si izgradio/la — ne zaustavljaj se sada.'
                : ' Nastavi dalje — 90 dana je dovoljno za trajnu promjenu.'}
            </p>
            <Link href="/volim-svojnovac"
              className="block text-center rounded-xl py-3 text-sm font-bold"
              style={{ backgroundColor: 'rgba(212,175,55,0.2)', color: '#D4AF37', border: '1px solid rgba(212,175,55,0.4)' }}>
              Saznaj više o FinCoach VIP 90 dana →
            </Link>
          </div>

          <button onClick={() => setCompletionStep(null)}
            className="w-full rounded-xl py-3 text-sm font-bold"
            style={{ backgroundColor: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.1)' }}>
            ← Vrati se na portal
          </button>
        </div>
      </div>
    )
  }

  // ── Quiz view ──────────────────────────────────────────────────────────────
  if (showQuiz) {
    const answeredCount = Object.keys(quizAnswers).length
    const allAnswered = answeredCount === QUIZ_QUESTIONS.length
    const firstName = data.full_name?.split(' ')[0] || 'prijatelju'
    return (
      <div className="min-h-screen px-4 pb-24 pt-8" style={{ backgroundColor: '#0D1B2A', color: '#fff' }}>
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-block text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-5"
              style={{ backgroundColor: 'rgba(212,175,55,0.12)', color: '#D4AF37', border: '1px solid rgba(212,175,55,0.3)' }}>
              5 pitanja · 2 minute
            </div>
            <h1 className="text-2xl font-black mb-2">Zdravo, {firstName}! 👋</h1>
            <p className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>Odgovori na 5 pitanja kako bismo personalizirali tvoj plan.</p>
          </div>
          <div className="mb-4 flex items-center gap-2">
            <div className="flex-1 rounded-full h-1.5" style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}>
              <div className="h-1.5 rounded-full transition-all duration-500"
                style={{ width: `${(answeredCount / QUIZ_QUESTIONS.length) * 100}%`, backgroundColor: '#D4AF37' }} />
            </div>
            <span className="text-xs tabular-nums" style={{ color: 'rgba(255,255,255,0.35)' }}>{answeredCount}/{QUIZ_QUESTIONS.length}</span>
          </div>
          <div className="space-y-6">
            {QUIZ_QUESTIONS.map((q, qi) => (
              <div key={qi} className="rounded-2xl p-5"
                style={{ backgroundColor: 'rgba(255,255,255,0.04)', border: `1px solid ${quizAnswers[qi] ? 'rgba(212,175,55,0.3)' : 'rgba(255,255,255,0.08)'}` }}>
                <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: 'rgba(255,255,255,0.3)' }}>Pitanje {qi + 1}</p>
                <p className="font-bold mb-4" style={{ lineHeight: 1.4 }}>{q.q}</p>
                <div className="space-y-2">
                  {q.opts.map((opt, oi) => {
                    const selected = quizAnswers[qi] === opt.tip
                    return (
                      <button key={oi} onClick={() => setQuizAnswers(prev => ({ ...prev, [qi]: opt.tip }))}
                        className="w-full text-left rounded-xl px-4 py-3 text-sm transition-all"
                        style={{ backgroundColor: selected ? 'rgba(212,175,55,0.15)' : 'rgba(255,255,255,0.03)', border: `1px solid ${selected ? 'rgba(212,175,55,0.5)' : 'rgba(255,255,255,0.07)'}`, color: selected ? '#D4AF37' : 'rgba(255,255,255,0.7)', fontWeight: selected ? 700 : 400 }}>
                        {selected && <span className="mr-2">✓</span>}{opt.label}
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
          {quizError && <p className="mt-4 text-sm text-center" style={{ color: '#f87171' }}>{quizError}</p>}
          <button onClick={submitQuiz} disabled={!allAnswered || quizSubmitting}
            className="w-full mt-6 rounded-xl py-4 font-black text-lg transition-opacity hover:opacity-90 disabled:opacity-40"
            style={{ backgroundColor: '#D4AF37', color: '#0D1B2A' }}>
            {quizSubmitting ? 'Analiziramo...' : allAnswered ? 'Prikaži moju dijagnozu →' : `Odgovori na sva pitanja (${answeredCount}/5)`}
          </button>
        </div>
      </div>
    )
  }

  const tip = data.financial_type
  const tipData = tip && TIPOVI[tip] ? TIPOVI[tip] : DEFAULT_TIP
  const plan = tip && PLANOVI[tip] ? PLANOVI[tip] : DEFAULT_PLAN
  const firstName = data.full_name?.split(' ')[0] || 'prijatelju'
  const TOTAL_DAYS = 30
  const doneCount = doneTasks.size
  const progress = Math.round((doneCount / TOTAL_DAYS) * 100)

  return (
    <div className="min-h-screen px-4 pb-24 pt-8" style={{ backgroundColor: '#0D1B2A' }}>
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="text-center mb-6">
          <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: 'rgba(212,175,55,0.6)' }}>Starter Paket</p>
          <h1 className="text-2xl font-black mb-1" style={{ color: '#fff' }}>Zdravo, {firstName}! {tipData.emoji}</h1>
          <p className="text-sm" style={{ color: 'rgba(255,255,255,0.45)' }}>
            {tip ? `Ti si: ${tipData.naziv} — ${tipData.podnaslov}` : 'Tvoj personalizirani financijski plan'}
          </p>
        </div>

        {/* Tabs */}
        <div className="grid grid-cols-4 gap-1 mb-6 p-1 rounded-xl" style={{ backgroundColor: 'rgba(255,255,255,0.04)' }}>
          {(['dijagnoza', 'plan', 'videa', 'materijali'] as const).map(tab => (
            <button key={tab} onClick={() => { setActiveTab(tab); localStorage.setItem('fc_starter_tab', tab) }}
              className="py-2 rounded-lg text-xs font-bold transition-all"
              style={{ backgroundColor: activeTab === tab ? 'rgba(212,175,55,0.2)' : 'transparent', color: activeTab === tab ? '#D4AF37' : 'rgba(255,255,255,0.4)', border: activeTab === tab ? '1px solid rgba(212,175,55,0.3)' : '1px solid transparent' }}>
              {tab === 'dijagnoza' ? '📊 Dijagnoza' : tab === 'plan' ? '📅 Plan' : tab === 'videa' ? '🎬 Videa' : '📁 Materijali'}
            </button>
          ))}
        </div>

        {/* ── TAB: Dijagnoza ────────────────────────────────────────────────── */}
        {activeTab === 'dijagnoza' && (
          <div className="space-y-5">
            <div className="rounded-2xl p-6" style={{ backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <h2 className="text-base font-bold mb-4 text-center" style={{ color: '#D4AF37' }}>📊 Financijski Health Score</h2>
              <HealthScoreGauge score={tipData.zdravScore} />
              <div className="mt-4 rounded-xl px-4 py-3 text-sm" style={{ backgroundColor: 'rgba(212,175,55,0.06)', border: '1px solid rgba(212,175,55,0.15)' }}>
                <p style={{ color: 'rgba(255,255,255,0.65)' }}>
                  Tvoj score će rasti kako budeš napredovao/la kroz 30-dnevni plan. Polaznici koji završe plan prosječno poboljšaju score za <strong style={{ color: '#D4AF37' }}>22 boda</strong>.
                </p>
              </div>
            </div>

            {tip && (
              <div className="rounded-2xl p-6" style={{ backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}>
                <h2 className="text-base font-bold mb-4" style={{ color: '#D4AF37' }}>🧠 Tvoj financijski profil</h2>
                <p className="text-sm leading-relaxed mb-4" style={{ color: 'rgba(255,255,255,0.65)' }}>{tipData.fokus}</p>
                <div className="mb-4">
                  <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: 'rgba(255,255,255,0.35)' }}>Snage</p>
                  {tipData.snage.map((s, i) => (
                    <div key={i} className="flex items-center gap-2 mb-1.5">
                      <span style={{ color: '#22c55e', fontSize: '0.8rem' }}>✓</span>
                      <span className="text-sm" style={{ color: 'rgba(255,255,255,0.65)' }}>{s}</span>
                    </div>
                  ))}
                </div>
                <div className="mb-4">
                  <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: 'rgba(255,255,255,0.35)' }}>Izazovi</p>
                  {tipData.izazovi.map((iz, i) => (
                    <div key={i} className="flex items-center gap-2 mb-1.5">
                      <span style={{ color: '#f59e0b', fontSize: '0.8rem' }}>△</span>
                      <span className="text-sm" style={{ color: 'rgba(255,255,255,0.65)' }}>{iz}</span>
                    </div>
                  ))}
                </div>
                <div className="rounded-xl p-4" style={{ backgroundColor: 'rgba(212,175,55,0.07)', border: '1px solid rgba(212,175,55,0.2)' }}>
                  <p className="text-xs font-bold mb-1" style={{ color: '#D4AF37' }}>💡 Ključni savjet za tvoj tip</p>
                  <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.7)' }}>{tipData.savjet}</p>
                </div>
              </div>
            )}

            {/* Ponovi dijagnozu */}
            {tip && (
              <div className="rounded-2xl p-4 flex items-center justify-between" style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <p className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>Pogrešno odgovorena pitanja?</p>
                <button onClick={resetDijagnoza}
                  className="text-xs font-bold px-3 py-1.5 rounded-lg"
                  style={{ backgroundColor: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.1)' }}>
                  🔄 Ponovi dijagnozu
                </button>
              </div>
            )}

            {/* Upsell na VSN */}
            <div className="rounded-2xl p-5" style={{ background: 'linear-gradient(135deg, rgba(212,175,55,0.1) 0%, rgba(212,175,55,0.04) 100%)', border: '1px solid rgba(212,175,55,0.25)' }}>
              <p className="text-sm font-bold mb-2" style={{ color: '#D4AF37' }}>Spreman/na ići dublje?</p>
              <p className="text-sm mb-4" style={{ color: 'rgba(255,255,255,0.55)' }}>
                90-dnevni program ide puno dalje — investiranje, eliminacija duga, pasivni prihodi.{' '}
                {data.via_affiliate
                  ? <>Cijena za tebe: <strong style={{ color: '#fff' }}>397 €</strong>.</>
                  : <>Poseban popust za Starter Paket korisnike: <strong style={{ color: '#fff' }}>197 € (umj. 397 €)</strong>.</>
                }
              </p>
              <Link href="/volim-svojnovac"
                className="block text-center rounded-xl py-3 text-sm font-bold"
                style={{ backgroundColor: 'rgba(212,175,55,0.15)', color: '#D4AF37', border: '1px solid rgba(212,175,55,0.3)' }}>
                Saznaj više o programu →
              </Link>
            </div>
          </div>
        )}

        {/* ── TAB: 30-dnevni plan ───────────────────────────────────────────── */}
        {activeTab === 'plan' && (
          <div>
            {doneTasks.has(30) && completionStep === null && (
              <div className="rounded-2xl p-5 mb-5" style={{ background: 'linear-gradient(135deg, rgba(34,197,94,0.1) 0%, rgba(34,197,94,0.04) 100%)', border: '1px solid rgba(34,197,94,0.25)' }}>
                <p className="text-sm font-bold mb-1" style={{ color: '#22c55e' }}>🏆 Čestitamo — završio/la si program!</p>
                <p className="text-sm mb-3" style={{ color: 'rgba(255,255,255,0.55)' }}>
                  30 dana je iza tebe. Pogledaj kako se promijenio tvoj financijski Health Score.
                </p>
                <button onClick={() => setCompletionStep('quiz')}
                  className="w-full rounded-xl py-2.5 text-sm font-bold"
                  style={{ backgroundColor: 'rgba(34,197,94,0.2)', color: '#22c55e', border: '1px solid rgba(34,197,94,0.3)' }}>
                  Procijeni napredak →
                </button>
              </div>
            )}
            <div className="rounded-2xl p-5 mb-5" style={{ backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-bold" style={{ color: '#D4AF37' }}>Napredak</p>
                <p className="text-sm font-bold" style={{ color: '#fff' }}>{doneCount}/{TOTAL_DAYS} dana ({progress}%)</p>
              </div>
              <div className="rounded-full h-3" style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}>
                <div className="h-3 rounded-full transition-all duration-500" style={{ width: `${progress}%`, backgroundColor: '#D4AF37' }} />
              </div>
              {doneCount > 0 && (
                <p className="text-xs mt-2" style={{ color: 'rgba(255,255,255,0.35)' }}>
                  {doneCount === TOTAL_DAYS ? '🎉 Završio/la si cijeli plan!' : `Nastavi — još ${TOTAL_DAYS - doneCount} dana do kraja.`}
                </p>
              )}
            </div>
            {[0, 1, 2, 3, 4].map(week => {
              const weekTasks = plan.slice(week * 7, week * 7 + 7)
              if (weekTasks.length === 0) return null
              const weekDone = weekTasks.filter(t => doneTasks.has(t.day)).length
              return (
                <div key={week} className="mb-5">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xs font-bold uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.35)' }}>Tjedan {week + 1}</p>
                    <span className="text-xs" style={{ color: 'rgba(255,255,255,0.25)' }}>{weekDone}/{weekTasks.length}</span>
                  </div>
                  <div className="space-y-2">
                    {weekTasks.map(t => (
                      <PlanRow key={t.day} task={t} done={doneTasks.has(t.day)} onToggle={() => toggleTask(t.day)} />
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* ── TAB: Videa ────────────────────────────────────────────────────── */}
        {activeTab === 'videa' && (
          <div className="space-y-4">
            <p className="text-sm text-center" style={{ color: 'rgba(255,255,255,0.45)' }}>
              Brane snima 4 ekskluzivna videa — svaki tjedan jedan stiže direktno na tvoj email.
            </p>

            {/* Dnevni plan podsjetnik */}
            <div className="rounded-2xl p-4 flex items-start gap-3" style={{ backgroundColor: 'rgba(34,197,94,0.07)', border: '1px solid rgba(34,197,94,0.2)' }}>
              <span className="text-lg flex-shrink-0">📅</span>
              <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>
                <strong style={{ color: '#22c55e' }}>Važno:</strong> Videa su dodatna podrška — ali napredak dolazi od svakodnevnog rada na <strong style={{ color: '#fff' }}>30-dnevnom planu</strong>. Prati zadatke svaki dan. Samo oni koji zaista rade zadatke mogu očekivati promjenu.
              </p>
            </div>

            {[
              {
                week: 1, title: 'Financijski audit i postavljanje temelja', subtitle: 'Gdje si sada i kamo ideš', status: 'soon',
                afterWatch: 'Nakon gledanja: napravi financijski audit (Dan 2 plana) i postavi automatski transfer štednje. Ne čekaj — napravi danas.',
              },
              {
                week: 2, title: 'Automatizacija štednje i hitni fond', subtitle: 'Sustav koji radi dok spavaš', status: 'locked',
                afterWatch: 'Nakon gledanja: otvori odvojen račun za hitni fond i postavi trajni nalog. Automatizacija eliminira potrebu za voljom.',
              },
              {
                week: 3, title: 'Eliminacija duga — metode koje funkcioniraju', subtitle: 'Lavina vs. snježna gruda', status: 'locked',
                afterWatch: 'Nakon gledanja: napiši sve dugove (iznos + kamata) na papir i odaberi jednu metodu eliminacije — danas, ne sutra.',
              },
              {
                week: 4, title: 'Prve investicije — bez straha', subtitle: 'ETF za početnike, korak po korak', status: 'locked',
                afterWatch: 'Ne znaš odakle početi s ulaganjem? To je normalno — ali skupo. Jedan razgovor s Branetom (besplatno, bez obveze) i znat ćeš točno gdje tvoj novac treba ići. Štednja, osiguranje ili investicija — prilagođeno tebi.',
              },
            ].map(video => (
              <div key={video.week} className="rounded-2xl overflow-hidden"
                style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', opacity: video.status === 'locked' ? 0.65 : 1 }}>
                <div className="flex items-center gap-4 p-5">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center text-xl"
                    style={{ backgroundColor: video.status === 'soon' ? 'rgba(212,175,55,0.15)' : 'rgba(255,255,255,0.05)' }}>
                    {video.status === 'locked' ? '🔒' : '🎬'}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold" style={{ color: 'rgba(212,175,55,0.6)' }}>Tjedan {video.week}</span>
                      {video.status === 'soon' && (
                        <span className="text-xs px-2 py-0.5 rounded-full font-bold" style={{ backgroundColor: 'rgba(212,175,55,0.15)', color: '#D4AF37' }}>Uskoro</span>
                      )}
                    </div>
                    <p className="text-sm font-bold mb-0.5" style={{ color: '#fff' }}>{video.title}</p>
                    <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>{video.subtitle}</p>
                  </div>
                </div>
                {video.status !== 'locked' && (
                  <div className="px-5 pb-4 pt-0">
                    <div className="rounded-xl px-4 py-3" style={{ backgroundColor: 'rgba(212,175,55,0.07)', border: '1px solid rgba(212,175,55,0.15)' }}>
                      <p className="text-xs font-bold mb-1" style={{ color: '#D4AF37' }}>✅ Što napraviti nakon gledanja:</p>
                      <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>{video.afterWatch}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}

            <div className="rounded-2xl p-5 text-center" style={{ backgroundColor: 'rgba(212,175,55,0.07)', border: '1px solid rgba(212,175,55,0.2)' }}>
              <p className="text-sm font-bold mb-1" style={{ color: '#D4AF37' }}>📧 Video #1 dolazi uskoro</p>
              <p className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>
                Videa stižu direktno na <strong style={{ color: '#fff' }}>{data.email}</strong>.<br />
                Provjeri inbox i folder Promotions.
              </p>
            </div>
          </div>
        )}

        {/* ── TAB: Materijali ───────────────────────────────────────────────── */}
        {activeTab === 'materijali' && (
          <div className="space-y-5">

            {/* Interaktivni proračun */}
            <div className="rounded-2xl p-5" style={{ backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <h2 className="text-base font-bold mb-1" style={{ color: '#D4AF37' }}>💰 Moj proračun — metoda 50/30/20</h2>
              <p className="text-xs mb-5" style={{ color: 'rgba(255,255,255,0.4)' }}>
                Unesi prihode i troškove — sve se sprema automatski. Klikni 🖨️ za PDF izvoz ili 📄 za prazan predložak za tiskanje.
              </p>
              <BudzetTracker userEmail={data.email} />
            </div>

            {/* Ostali materijali — placeholder za videe 2/3/4 */}
            <div className="rounded-2xl p-5" style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <h2 className="text-base font-bold mb-1" style={{ color: 'rgba(255,255,255,0.45)' }}>📂 Ostali materijali</h2>
              <p className="text-xs mb-4" style={{ color: 'rgba(255,255,255,0.3)' }}>Otključavaju se s novim tjednima programa.</p>
              <div className="space-y-2">
                {[
                  'Tjedan 2 — Radni list za automatizaciju štednje',
                  'Tjedan 3 — Tablica za pregled i eliminaciju dugova',
                  'Tjedan 4 — Starter vodič za ETF investicije',
                ].map((label, i) => (
                  <div key={i} className="flex items-center gap-3 rounded-xl px-4 py-3"
                    style={{ backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', opacity: 0.55 }}>
                    <span>🔒</span>
                    <span className="text-sm" style={{ color: 'rgba(255,255,255,0.45)' }}>{label}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  )
}
