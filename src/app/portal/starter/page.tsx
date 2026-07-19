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
  savjet: 'Napravi financijski audit: zbrojvi prihode i rashode. Gdje novac odlazi? Svjesnost je prvi korak svake promjene.',
}

type Task = { day: number; task: string; tip_: string }

const PLANOVI: Record<Tip, Task[]> = {
  hedonist: [
    { day: 1,  task: 'Financijski audit: zbrojvi sve prihode i rashode zadnjeg mjeseca', tip_: '📊 Temelje ne možeš preskočiti' },
    { day: 2,  task: 'Pronađi 3 pretplate koje ne koristiš — odmah ih otkaži', tip_: '💸 Svaka otkazana pretplata = ušteđevina' },
    { day: 3,  task: 'Postavi trajni nalog: 10% plaće na odvojeni račun čim stigne', tip_: '🔒 Automatizirano = bez volje' },
    { day: 4,  task: 'Definiraj 3 troška koje ne osjećaš, a skupo koštaju (dostava, taxi, café)', tip_: '☕ Svjesnost je moć' },
    { day: 5,  task: 'Postavi "buffer" od 200 € za neočekivane troškove ovog mjeseca', tip_: '🛡️ Hitni fond počinje ovdje' },
    { day: 6,  task: 'Napravi "wish list" s 5 stvari koje želiš kupiti — pričekaj 48 sati', tip_: '⏳ Test impulzivnosti' },
    { day: 7,  task: 'Tjedni pregled: je li automatska štednja radila? Prilagodi ako treba', tip_: '✅ Tjedan 1 završen!' },
    { day: 8,  task: 'Prati troškove ovog tjedna u bilježnici ili aplikaciji', tip_: '📱 Što ne mjeriš, ne možeš kontrolirati' },
    { day: 9,  task: 'Pronađi jednu kategoriju troškova i smanji za 20% ovaj tjedan', tip_: '✂️ Mala redukcija, veliki efekt' },
    { day: 10, task: 'Pregovaraj jedan račun ili pretplatu — nazovi pružatelja usluge', tip_: '📞 Pregovaranje je vještina' },
    { day: 11, task: 'Definiraj 3 konkretna financijska cilja za sljedeće 6 mjeseci', tip_: '🎯 Cilj bez roka je samo želja' },
    { day: 12, task: 'Otkaži još 2 pretplate ili servis koji koristiš rijetko', tip_: '💰 Svaki euro vrijedi' },
    { day: 13, task: 'Izračunaj koliko imaš u hitnom fondu vs. cilj (3× mjesečne troškove)', tip_: '🛡️ Koliko si daleko?' },
    { day: 14, task: 'Tjedni pregled + prilagodba budžeta za sljedeći tjedan', tip_: '✅ 2 tjedna — ti si u top 10%!' },
    { day: 15, task: 'Postavi SMART cilj za hitni fond: iznos i rok (npr. 1.000 € za 3 mj.)', tip_: '📅 Specifičan = ostvariv' },
    { day: 16, task: 'Istraži visoko-prinosne štedne račune u tvojoj banci', tip_: '🏦 Inflacija jede ušteđevinu' },
    { day: 17, task: 'Prebaci hitni fond na odvojen račun bez debitne kartice', tip_: '🔒 Izvan vidokruga = izvan uma' },
    { day: 18, task: 'Napravi plan za jedan "zabranjeni trošak" — što umjesto toga?', tip_: '🔄 Zamjena, ne odricanje' },
    { day: 19, task: 'Izračunaj koliko bi imao/la za 5 god ako štediš 200 €/mj uz 4% prinos', tip_: '📈 Složeni efekt te će iznenaditi' },
    { day: 20, task: 'Napiši 3 razloga zašto ti je financijska sloboda važna', tip_: '💡 Svrha > volja' },
    { day: 21, task: 'Tjedni pregled: koliko si uštedjeo/la u 3 tjedna?', tip_: '✅ 21 dan — navika počinje!' },
    { day: 22, task: 'Istraži 1 opciju pasivnog prihoda realnu za tvoju situaciju', tip_: '💸 Novac koji radi za tebe' },
    { day: 23, task: 'Pregled svih dugova: iznos, kamata, rok — na jednom listu papira', tip_: '📋 Pregled = kontrola' },
    { day: 24, task: 'Odaberi metodu eliminacije duga: lavina ili snježna gruda', tip_: '⚡ Obje funkcioniraju — budi dosljedan/na' },
    { day: 25, task: 'Smanji jedan fiksni trošak za 10% (internet, mobitel, osiguranje)', tip_: '📞 Jedno pregovaranje tjedno' },
    { day: 26, task: 'Postavi automatski transfer za dug u skladu s tvojom metodom', tip_: '🤖 Automatizacija = konzistentnost' },
    { day: 27, task: 'Pronađi jedan "side hustle" koji možeš početi ovaj tjedan', tip_: '💡 Dodatnih 100 € = razlika' },
    { day: 28, task: 'Tjedni pregled: kako napreduju dugovi i hitni fond?', tip_: '✅ 4 tjedna — novi ti!' },
    { day: 29, task: 'Napiši 5 navika koje si izgradio/la u 30 dana', tip_: '🏆 Navike = bogatstvo' },
    { day: 30, task: 'Napravi financijski plan za sljedeći mjesec s konkretnim brojevima', tip_: '🎯 Kraj je novi početak' },
  ],
  branic: [
    { day: 1,  task: 'Financijski audit: zbrojvi sve prihode i rashode zadnjeg mjeseca', tip_: '📊 Crno na bijelo' },
    { day: 2,  task: 'Definiraj svoju "sigurnosnu granicu" — iznos koji ti daje apsolutni mir', tip_: '🛡️ Točno znaš, ne osjećaš' },
    { day: 3,  task: 'Sve iznad sigurnosne granice — napravi plan gdje to ide (štednja, investicije)', tip_: '📈 Mirujući novac gubi vrijednost' },
    { day: 4,  task: 'Istraži visoko-prinosni štedni račun — usporedi 3 banke', tip_: '💰 Inflacija jede ušteđevinu' },
    { day: 5,  task: 'Postavi automatski transfer 10% plaće na investicijski račun', tip_: '🤖 Automatizacija ruši anksioznost' },
    { day: 6,  task: 'Napravi "dozvoljeni trošak" lista — stvari na koje možeš trošiti bez krivnje', tip_: '✅ Dozvola je ključna' },
    { day: 7,  task: 'Tjedni pregled: je li automatski transfer radio? Kako se osjećaš?', tip_: '✅ Tjedan 1 završen!' },
    { day: 8,  task: 'Istraži ETF fondove — što su, kako funkcioniraju, minimalna ulaganja', tip_: '📚 Znanje smanjuje strah' },
    { day: 9,  task: 'Otvori investicijski račun (npr. interaktivni broker, DEGIRO)', tip_: '🚀 Akcija beats teorija' },
    { day: 10, task: 'Ulož 50-100 € u jedan S&P 500 ETF — samo za iskustvo', tip_: '🌱 Mali start, veliki efekt' },
    { day: 11, task: 'Prati investiciju 1 tjedan — bez panike zbog kratkoročnih oscilacija', tip_: '📉📈 Volatilnost je normalna' },
    { day: 12, task: 'Definiraj 3 financijska cilja: kratkoročni, srednjoročni, dugoročni', tip_: '🎯 Ciljevi ruše anksioznost' },
    { day: 13, task: 'Izračunaj koliko će rasti 200 €/mj uz 7% prinos za 20 god.', tip_: '📈 Složeni efekt = čarolija' },
    { day: 14, task: 'Tjedni pregled: 2 tjedna investitora. Kako se osjećaš?', tip_: '✅ 2 tjedna — hrabriji/a si nego misliš!' },
    { day: 15, task: 'Istraži diverzifikaciju: što je to i zašto štiti od rizika', tip_: '🥚🧺 Ne stavljaj jaja u jednu košaru' },
    { day: 16, task: 'Dodaj drugi ETF (npr. bond ETF) u portfelj — mali iznos', tip_: '⚖️ Balans = sigurnost' },
    { day: 17, task: 'Napravi plan za mirovinu: koliko trebaš i kada', tip_: '🏖️ Mirovinska matematika' },
    { day: 18, task: 'Razgovaraj s partnerom/obitelji o financijskim ciljevima', tip_: '👥 Zajednički ciljevi = manje konflikta' },
    { day: 19, task: 'Provjeri postoji li dopunska mirovina kod poslodavca', tip_: '💼 Iskoristi sve benefite' },
    { day: 20, task: 'Napiši zašto si počeo/la investirati — podsjeti se kad dođe strah', tip_: '💡 Tvoja "zašto" je tvoj sidro' },
    { day: 21, task: 'Tjedni pregled: kako ide investicija? Ostani miran/na, nastavi', tip_: '✅ 21 dan — investitor!' },
    { day: 22, task: 'Postavi mjesečni automatski doprinos investicijama', tip_: '🤖 Dollar cost averaging' },
    { day: 23, task: 'Istraži nekretnine kao investiciju — plus i minus', tip_: '🏠 Jedna od opcija, ne jedina' },
    { day: 24, task: 'Definiraj "trošak slobode" — iznos koji možeš trošiti bez analize', tip_: '🎉 Sloboda je i cilj' },
    { day: 25, task: 'Napravi jednu kupnju s "troškom slobode" — bez krivnje', tip_: '✨ Zaslužio/la si' },
    { day: 26, task: 'Pregled portfelja: je li diverzificiran kako si planirao/la?', tip_: '📊 Pregled, ne opsesija' },
    { day: 27, task: 'Napravi "što-ako" plan za recesiju — kako reagirati', tip_: '🛡️ Plan smanjuje paniku' },
    { day: 28, task: 'Tjedni pregled: napredak u 4 tjedna', tip_: '✅ 4 tjedna — pravi investitor!' },
    { day: 29, task: 'Napiši 5 stvari koje si naučio/la o sebi i novcu', tip_: '🏆 Uvid = rast' },
    { day: 30, task: 'Napravi financijski plan za sljedeće 3 mjeseca s konkretnim brojevima', tip_: '🎯 Planiranje = sigurnost' },
  ],
  vrtlog: [
    { day: 1,  task: 'SAMO ovo: postavi podsjetnik za 9 ujutro svaki dan s natpisom "Dan X"', tip_: '⏰ Struktura je tvoj prijatelj' },
    { day: 2,  task: 'Financijski audit: zbrojvi sve prihode i rashode — samo brojke, bez osude', tip_: '📊 5 minuta, bez izgovora' },
    { day: 3,  task: 'Odaberi JEDNU financijsku naviku za ovaj tjedan — samo jednu', tip_: '🎯 Fokus > višestruki ciljevi' },
    { day: 4,  task: 'Postavi automatski transfer štednje — odmah, ne sutra', tip_: '🤖 Automatizirano = ne ovisi o volji' },
    { day: 5,  task: 'Napiši 3 razloga zašto TI osobno trebaš financijsku slobodu', tip_: '💡 Tvoje "zašto" je gorivo' },
    { day: 6,  task: 'Pronađi "accountability partnera" — prijatelj koji će te pitati za napredak', tip_: '👥 Vanjska odgovornost' },
    { day: 7,  task: 'Tjedni pregled: je li automatska štednja radila? Odgovori accountability partneru', tip_: '✅ Tjedan 1 — napravio/la si!' },
    { day: 8,  task: 'Prati troškove 3 dana u bilježnici (papir, ne app — fizičan čin)', tip_: '✏️ Fizički čin = veća svjesnost' },
    { day: 9,  task: 'Pronađi jedan trošak koji možeš eliminirati ODMAH — otkaži danas', tip_: '✂️ Akcija danas, ne "od ponedjeljka"' },
    { day: 10, task: 'Podsjetnik na phone: "Jesi li provjerio/la financije?" — za 9 ujutro', tip_: '📱 Rutina gradi naviku' },
    { day: 11, task: 'Napiši 3 konkretna financijska cilja s rokovima (ne "uštedjeti više")', tip_: '📅 Bez roka = bez cilja' },
    { day: 12, task: 'Pronađi jednu financijsku aplikaciju i unesi JEDAN tjedan troškova', tip_: '📱 Jedna, ne trideset' },
    { day: 13, task: 'Provjeri hitni fond: imaš li ga? Koliko je velik vs. cilj?', tip_: '🛡️ Temelj, ne opcija' },
    { day: 14, task: 'Tjedni pregled + pričaj accountability partneru o napretku', tip_: '✅ 2 tjedna — u gornjoj trećini si!' },
    { day: 15, task: 'Napiši financijski plan za ovaj tjedan — na komadu papira, na vidljivom mjestu', tip_: '👀 Vidljivo = prisutno' },
    { day: 16, task: 'Jedan "mini cilj" za ovaj tjedan: uštedjeti X € specifično', tip_: '🎯 Mali, mjerljivi ciljevi' },
    { day: 17, task: 'Ako si propustio/la nešto ovog tjedna — nastavi TAMO gdje si stao/la (ne ispočetka)', tip_: '🔄 Nastavi, ne ponovi' },
    { day: 18, task: 'Istraži ETF fondove — 10 minuta, na YouTubeu, ne čitaj', tip_: '📺 Vizualno učenje brže' },
    { day: 19, task: 'Razgovaraj s bankom o boljem štednom računu ili fiksnoj štednji', tip_: '🏦 Jedna akcija, dugoročan prinos' },
    { day: 20, task: 'Postavi "30-dnevni novčani dnevnik" — svaki dan jedna rečenica o financijama', tip_: '📔 Refleksija gradi svjesnost' },
    { day: 21, task: 'Tjedni pregled: 3 tjedna dosljednosti — to je navika!', tip_: '✅ 21 dan — mozak prihvaća novu rutinu!' },
    { day: 22, task: 'Definiraj "automatski financijski sistem": što ide gdje čim stigne plaća', tip_: '🤖 Sistem > namjera' },
    { day: 23, task: 'Implementiraj jednu novu automatizaciju (štednja, kredit, investicija)', tip_: '⚡ Jednom postavljeno, funkcionira uvijek' },
    { day: 24, task: 'Provjeri: koliko se tvoj financijski status poboljšao od dana 1?', tip_: '📈 Mjerljivost = motivacija' },
    { day: 25, task: 'Napiši što ti je bio najveći "aha moment" u 30 dana', tip_: '💡 Uvid = trajni temelj' },
    { day: 26, task: 'Postavi financijsku rutinu za sljedeći mjesec — isti dani, iste aktivnosti', tip_: '📅 Rutina = sloboda' },
    { day: 27, task: 'Istraži jedan konkretan način povećanja prihoda — side hustle ili pregovaranje', tip_: '💰 Prihodi + štednja = ubrzanje' },
    { day: 28, task: 'Tjedni pregled: 4 tjedna sustava. Što će biti drugačije sljedeći mjesec?', tip_: '✅ 4 tjedna — sustav je uspostavljen!' },
    { day: 29, task: 'Napiši pismo sebi za 6 mjeseci: gdje želiš biti financijski', tip_: '🔮 Vizija vuče akciju' },
    { day: 30, task: 'Finalni plan: 3 financijska cilja za sljedeće 3 mjeseca s konkretnim koracima', tip_: '🎯 Kraj je novi početak' },
  ],
  teoreticar: [
    { day: 1,  task: 'PRAVILO: danas nema čitanja, nema istraživanja — samo akcija', tip_: '🚫 Bez teorije — samo radi' },
    { day: 2,  task: 'Financijski audit: zbrojvi SVE prihode i rashode — ODMAH, bez savršenosti', tip_: '📊 Gotovo > savršeno' },
    { day: 3,  task: 'Postavi automatski transfer štednje — 10% plaće, odmah, bez daljnjeg istraživanja', tip_: '🤖 Akcija, ne analiza' },
    { day: 4,  task: 'Otkaži JEDNU pretplatu — bez analiziranja alternativa. Otkaži i gotovo', tip_: '✂️ Savršena odluka ne postoji' },
    { day: 5,  task: 'Otvori investicijski račun (DEGIRO ili slično) — bez čitanja foruma', tip_: '🚀 Otvoriti račun ≠ obvezu ulaganja' },
    { day: 6,  task: 'Ulož 50 € u S&P 500 ETF — bez analize timing-a. Odmah.', tip_: '💸 Dollar-cost averaging > timing' },
    { day: 7,  task: 'Tjedni pregled: što si implementirao/la? (1 = automatska štednja; 2 = investicija)', tip_: '✅ Tjedan 1 — 2 konkretne akcije!' },
    { day: 8,  task: 'Definiraj hitni fond: koliko trebaš i gdje ćeš ga čuvati (odvojen račun)', tip_: '🛡️ Bez analize — postavi ga' },
    { day: 9,  task: 'Prebaci prvu ratu hitnog fonda — 200-300 €, odmah', tip_: '⚡ Nije savršen iznos — ali jest stvaran' },
    { day: 10, task: 'Postavi podsjetnik: svaki 1. u mjesecu prebacuješ ratu hitnog fonda', tip_: '📅 Automatizacija eliminira odluke' },
    { day: 11, task: 'Napiši 3 konkretna financijska cilja — bez istraživanja, iz glave', tip_: '🎯 Tvoje intuitivne vrijednosti su točne' },
    { day: 12, task: 'Nazovi banku i pitaj za bolji štedni kamatnjak — 10 min, bez pripreme', tip_: '📞 Improvizacija je u redu' },
    { day: 13, task: 'Provjeri postoji li kreditna kartica s boljim uvjetima od tvoje — apliciraj odmah', tip_: '💳 Akcija, ne usporedba 12 opcija' },
    { day: 14, task: 'Tjedni pregled: 2 tjedna akcije. Koliko te koštalo NEČINJENJE dosad?', tip_: '✅ 2 tjedna — više si napravio/la nego u godinu!' },
    { day: 15, task: 'Dodaj 50 € više u investicije ovog mjeseca — bez analiziranja', tip_: '📈 Svaki euro investiran danas vrijedi više' },
    { day: 16, task: 'Pronađi jedan dug s najvišom kamatom — pošalji extra 100 € sutra', tip_: '💸 Eliminacija duga = garantirani prinos' },
    { day: 17, task: 'Razgovaraj s partnerom/kolegom o financijama — bez prikazivanja znanja', tip_: '👥 Učiš podučavanjem' },
    { day: 18, task: 'Napravi "ne-analiza" pravilo: max 10 min istraživanja prije svake financ. odluke', tip_: '⏱️ Vremensko ograničenje ruši paralizu' },
    { day: 19, task: 'Ulož još 50 € u investicije — bez čekanja na "pravi trenutak"', tip_: '🎯 Pravi trenutak je sada' },
    { day: 20, task: 'Napiši jednu stvar koju si odgađao/la godinama — napravi je danas', tip_: '⚡ Odlaganje je skup luksuz' },
    { day: 21, task: 'Tjedni pregled: 21 dan akcije bez analize. Što si osjetio/la?', tip_: '✅ 21 dan — mozak se promijenio!' },
    { day: 22, task: 'Automatiziraj sve što možeš: štednja, investicije, računi — sve na trajne naloge', tip_: '🤖 Automatizirano > svjesno kontrolirano' },
    { day: 23, task: 'Pregledaj sve automatizacije — rade li? Prilagodi bez duboke analize', tip_: '🔧 Prilagodba ≠ perfekcionizam' },
    { day: 24, task: 'Napravi financijsku bilancu: imovina minus obveze = neto vrijednost', tip_: '📊 Jedna tablica, sav pregled' },
    { day: 25, task: 'Postavi cilj za neto vrijednost za 1 godinu — napiši ga', tip_: '🎯 Bez izračuna — procijeni intuitivno' },
    { day: 26, task: 'Istraži jedan NOVI izvor prihoda — 30 min max, onda ODLUČI', tip_: '💰 Odluka bez savršenih info' },
    { day: 27, task: 'Napravi jednu akciju prema tom izvoru prihoda — email, prijava, poziv', tip_: '⚡ Gotovo, ne savršeno' },
    { day: 28, task: 'Tjedni pregled: 4 tjedna akcije. Koliko si implementirao/la?', tip_: '✅ 4 tjedna — akcijski čovjek/žena!' },
    { day: 29, task: 'Napiši 3 stvari koje si naučio/la o SEBI (ne o financijama)', tip_: '🏆 Financije su samo ogledalo' },
    { day: 30, task: 'Plan za sljedeći mjesec: 3 konkretne akcije, bez analize', tip_: '🎯 Kraj je novi početak' },
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
  return (
    <button onClick={onToggle} className="w-full text-left flex items-start gap-3 rounded-xl px-4 py-3 transition-all"
      style={{ backgroundColor: done ? 'rgba(34,197,94,0.08)' : 'rgba(255,255,255,0.03)', border: `1px solid ${done ? 'rgba(34,197,94,0.25)' : 'rgba(255,255,255,0.07)'}` }}>
      <span className="flex-shrink-0 mt-0.5 w-5 h-5 rounded-full border flex items-center justify-center text-xs"
        style={{ borderColor: done ? '#22c55e' : 'rgba(255,255,255,0.25)', backgroundColor: done ? '#22c55e' : 'transparent', color: '#0D1B2A' }}>
        {done && '✓'}
      </span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-bold" style={{ color: 'rgba(212,175,55,0.6)' }}>Dan {task.day}</span>
        </div>
        <p className="text-sm leading-snug" style={{ color: done ? 'rgba(255,255,255,0.45)' : 'rgba(255,255,255,0.8)', textDecoration: done ? 'line-through' : 'none' }}>
          {task.task}
        </p>
        <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.3)' }}>{task.tip_}</p>
      </div>
    </button>
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
  const [activeTab, setActiveTab] = useState<'dijagnoza' | 'plan' | 'videa'>('dijagnoza')
  const [showQuiz, setShowQuiz] = useState(false)
  const [quizAnswers, setQuizAnswers] = useState<Record<number, Tip>>({})
  const [quizSubmitting, setQuizSubmitting] = useState(false)
  const [quizError, setQuizError] = useState('')

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
      setLoading(false)
    }
    load()
  }, [])

  async function toggleTask(day: number) {
    const { data: { user } } = await supabase.auth.getUser()
    setDoneTasks(prev => {
      const next = new Set(prev)
      if (next.has(day)) next.delete(day)
      else next.add(day)
      if (user) localStorage.setItem(`fc_starter_done_portal_${user.id}`, JSON.stringify(Array.from(next)))
      return next
    })
  }

  async function submitQuiz() {
    if (Object.keys(quizAnswers).length !== QUIZ_QUESTIONS.length) return
    setQuizSubmitting(true)
    setQuizError('')
    const detectedType = calculateType(quizAnswers)
    try {
      const res = await fetch('/api/starter/set-type-portal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ financial_type: detectedType }),
      })
      const json = await res.json()
      if (!json.ok) throw new Error(json.error ?? 'Greška')
      setData(prev => prev ? { ...prev, financial_type: detectedType } : prev)
      setShowQuiz(false)
    } catch {
      setQuizError('Greška pri spremanju — pokušaj ponovo.')
    } finally {
      setQuizSubmitting(false)
    }
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#0D1B2A' }}>
      <p style={{ color: 'rgba(255,255,255,0.45)' }}>Učitavam Starter Paket...</p>
    </div>
  )

  if (!data) return null

  // ── Quiz view ──────────────────────────────────────────────────────────────
  if (showQuiz) {
    const answeredCount = Object.keys(quizAnswers).length
    const allAnswered = answeredCount === QUIZ_QUESTIONS.length
    const firstName = data.full_name?.split(' ')[0] || 'prijatelju'
    return (
      <div className="min-h-screen px-4 pb-24 pt-8" style={{ backgroundColor: '#0D1B2A', color: '#fff' }}>
        <div className="max-w-xl mx-auto">
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
  const doneCount = doneTasks.size
  const progress = Math.round((doneCount / 30) * 100)

  return (
    <div className="min-h-screen px-4 pb-24 pt-8" style={{ backgroundColor: '#0D1B2A' }}>
      <div className="max-w-xl mx-auto">

        {/* Header */}
        <div className="text-center mb-6">
          <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: 'rgba(212,175,55,0.6)' }}>Starter Paket</p>
          <h1 className="text-2xl font-black mb-1" style={{ color: '#fff' }}>Zdravo, {firstName}! {tipData.emoji}</h1>
          <p className="text-sm" style={{ color: 'rgba(255,255,255,0.45)' }}>
            {tip ? `Ti si: ${tipData.naziv} — ${tipData.podnaslov}` : 'Tvoj personalizirani financijski plan'}
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 p-1 rounded-xl" style={{ backgroundColor: 'rgba(255,255,255,0.04)' }}>
          {(['dijagnoza', 'plan', 'videa'] as const).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className="flex-1 py-2 rounded-lg text-sm font-bold transition-all capitalize"
              style={{ backgroundColor: activeTab === tab ? 'rgba(212,175,55,0.2)' : 'transparent', color: activeTab === tab ? '#D4AF37' : 'rgba(255,255,255,0.4)', border: activeTab === tab ? '1px solid rgba(212,175,55,0.3)' : '1px solid transparent' }}>
              {tab === 'dijagnoza' ? '📊 Dijagnoza' : tab === 'plan' ? '📅 30-dnevni plan' : '🎬 Videa'}
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

            {/* Upsell na VSN */}
            <div className="rounded-2xl p-5" style={{ background: 'linear-gradient(135deg, rgba(212,175,55,0.1) 0%, rgba(212,175,55,0.04) 100%)', border: '1px solid rgba(212,175,55,0.25)' }}>
              <p className="text-sm font-bold mb-2" style={{ color: '#D4AF37' }}>Spreman/na ići dublje?</p>
              <p className="text-sm mb-4" style={{ color: 'rgba(255,255,255,0.55)' }}>
                90-dnevni program ide puno dalje — investiranje, eliminacija duga, pasivni prihodi. Poseban popust za Starter Paket korisnike: <strong style={{ color: '#fff' }}>197 € (umj. 397 €)</strong>.
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
            <div className="rounded-2xl p-5 mb-5" style={{ backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-bold" style={{ color: '#D4AF37' }}>Napredak</p>
                <p className="text-sm font-bold" style={{ color: '#fff' }}>{doneCount}/30 dana ({progress}%)</p>
              </div>
              <div className="rounded-full h-3" style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}>
                <div className="h-3 rounded-full transition-all duration-500" style={{ width: `${progress}%`, backgroundColor: '#D4AF37' }} />
              </div>
              {doneCount > 0 && (
                <p className="text-xs mt-2" style={{ color: 'rgba(255,255,255,0.35)' }}>
                  {doneCount === 30 ? '🎉 Završio/la si cijeli plan!' : `Nastavi — još ${30 - doneCount} dana do kraja.`}
                </p>
              )}
            </div>
            {[0, 1, 2, 3].map(week => {
              const weekTasks = plan.slice(week * 7, week * 7 + 7)
              const weekDone = weekTasks.filter(t => doneTasks.has(t.day)).length
              return (
                <div key={week} className="mb-5">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xs font-bold uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.35)' }}>Tjedan {week + 1}</p>
                    <span className="text-xs" style={{ color: 'rgba(255,255,255,0.25)' }}>{weekDone}/7</span>
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
            {[
              { week: 1, title: 'Financijski audit i postavljanje temelja', subtitle: 'Gdje si sada i kamo ideš', status: 'soon' },
              { week: 2, title: 'Automatizacija štednje i hitni fond', subtitle: 'Sustav koji radi dok spavaš', status: 'locked' },
              { week: 3, title: 'Eliminacija duga — metode koje funkcioniraju', subtitle: 'Lavina vs. snježna gruda', status: 'locked' },
              { week: 4, title: 'Prve investicije — bez straha', subtitle: 'ETF za početnike, korak po korak', status: 'locked' },
            ].map(video => (
              <div key={video.week} className="rounded-2xl p-5"
                style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', opacity: video.status === 'locked' ? 0.6 : 1 }}>
                <div className="flex items-center gap-4">
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

      </div>
    </div>
  )
}
