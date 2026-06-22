# FinCoach VIP — Project Guide for Claude

## Glavna mapa projekta
`E:\fincoach-vip` — Next.js 14 spletna stran + admin panel

## Video pipeline mape (na C: disku)
- **Stari tečaj (vir audio):** `C:\Users\Lenovo\Downloads\Put prema financijskoj slobodi - DELAVNICA\Financijske strategije za osvajanje ciljeva 30-60\video posnetki 31-60\`
- **Novi video izhod Dan 1-30:** `C:\Users\Lenovo\Downloads\Put prema financijskoj slobodi - DELAVNICA\tecaj1-30\`
- **Novi video izhod Dan 31-60:** `C:\Users\Lenovo\Downloads\Put prema financijskoj slobodi - DELAVNICA\tecaj31-60\`
- **Build skripti:** `C:\Users\Lenovo\Downloads\Put prema financijskoj slobodi - DELAVNICA\`

## Referenca: Dan 1 struktura (STANDARD za vse dneve)
Mapa: `C:\Users\Lenovo\Downloads\Put prema financijskoj slobodi - DELAVNICA\tecaj1-30\Dan 1\`
```
Dan_1_FinCoach_VIP.mp4   ← končni video (logo_in 2s + slide+audio + logo_out 2s)
Dan_1_opis.txt            ← opis za upload (format spodaj)
logo_card.png             ← 1280x720 logo kartica (fade in/out) - iz tecaj1-30/_logo_card.png
slide_dan1.png            ← branded slide PNG 1280x720
video_noaudio.mp4         ← vmesni fajl (slide brez zvoka)
```

## Opis.txt format (referenca Dan 1)
```
X. Dan - Financijske strategije za osvajanje ciljeva

[Ključno vprašanje dneva]

Uzmite vremena za sebe. Razmislite o ovim pitanjima. Zapišite svoje misli.

X. Dan
```

## Slide dizajn (ODOBRENI STANDARD — Dan 31 kot referenca)
- Ozadje: `#0D1B2A` (temno navy), resolucija 1280x720
- Header bar (dark, 75px): logo LEVO (cairosvg SVG 220x52 na pos 14,11), "Volim Svojnovac" CENTER (24pt bold bela), "DAN X" badge DESNO (zlato)
- **Logo:** `cairosvg.svg2png(fincoach-logo-horizontal.svg, 220x52)` — NE risati, NE poustvarjati
- Section title (pos 44,92): **"Volim Svojnovac"** — VEDNO ENAKO za vse dni, 30pt bold zlato
- Bullet točke od y=152: **28pt** bela, diamond Pillow polygon zlat (size=10), 6 bullets na dan
- Nadaljevalne vrstice (word-wrap): 27pt svetlo siva, razmik 44px/40px, +4px med bullets
- Footer (46px od dna): zlata črta, "FinCoach VIP — 90-dnevni program..." sivo, "fincoach.vip" zlato
- Referenčni build script: `build_dan31_final.py`, batch: `rebuild_slides_31_60.py`

## Video pipeline (ODOBRENI STANDARD)
1. Audio: `zvok za video 31-60/XX dan.mp3` (ElevenLabs, že shranjeni) — NE iz starih MP4!
2. Slide PNG z zgornjim dizajnom (cairosvg logo, polygon diamonds, 28pt)
3. ffmpeg: silent.aac → logo fade-in 2s → slide+MP3 audio → logo fade-out 2s → concat (ASCII!)
4. Output: `tecaj31-60/Dan XX/Dan_XX_FinCoach_VIP.mp4` + slide_danXX.png + opis.txt
5. Za Dan 61-90: preveriti lokacijo audio datotek pred začetkom!

## Logo fajli
- **Horizontal SVG (za slide):** `E:\fincoach-vip\public\logo\fincoach-logo-horizontal.svg`
- **Logo kartica (fade in/out):** `C:\Users\Lenovo\Downloads\Put prema financijskoj slobodi - DELAVNICA\tecaj1-30\_logo_card.png`

## Spletna stran — tech stack
- Next.js 14 App Router, TypeScript, Tailwind CSS
- Supabase (auth + DB)
- Deployment: Vercel
- DNS: GoDaddy (NE Cloudflare)
- Git repo: github.com/financijskiexpert/fincoach-vip

## Supabase — kritično
- `createServiceClient()` mora biti iz `@supabase/supabase-js` (NE `@supabase/ssr`) — sicer RLS blokira
- Fajl: `E:\fincoach-vip\src\lib\supabase\server.ts`

## Admin dostop
- Admin email: `brane.recek@gmail.com`
- User ID: `fad5e316-40c1-4a53-8cfb-e3c6f8d37d6e`
- Admin check: `profile.role === 'admin' || user.email === 'brane.recek@gmail.com'`
- Po loginu: /portal → zazna admina → redirect /admin

## Uporabniške vloge
- **admin:** polni dostop (brane.recek@gmail.com)
- **student:** kupci tečaja — dostop do /portal in /portal/dan/[x]
- **affiliate:** partnerji — dostop samo do affiliate dashboarda (še ni implementirano)

## Komunikacija
- S uporabnikom: **slovenščina**
- Vsebina strani/tečaja: **hrvaščina**
