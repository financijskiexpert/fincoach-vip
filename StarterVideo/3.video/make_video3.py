# -*- coding: utf-8 -*-
"""
FinCoach VIP - Starter Video 3 Pipeline
Eliminacija duga — metode koje funkcioniraju
Output: E:/fincoach-vip/StarterVideo/3.video/video3_final.mp4
"""
import os, sys, io, json, time, subprocess, requests
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

# ── Konfiguracija ──────────────────────────────────────────────────────────────
VOICE_ID  = "UHqZihCaTRvL7TIfJCrQ"
BASE      = Path(r"E:\fincoach-vip\StarterVideo")
V_DIR     = BASE / "3.video"
OUTRO     = Path(r"E:\fincoach-vip\promo\outro_logo.mp4")
BG        = BASE / "ozadje" / "FinCoach_Zoom_Ozadje.png"
TEMP      = V_DIR / "_temp_v3"
TEMP.mkdir(exist_ok=True)
FDIR      = "C:/Windows/Fonts/"
W, H      = 1920, 1080
GOLD      = (212, 175, 55)
WHITE     = (255, 255, 255)
DARK_NAVY = (6, 14, 26)
GREY      = (185, 190, 202)

def _load_el_key():
    env_path = Path(r"E:\fincoach-vip\.env.local")
    for line in env_path.read_text(encoding="utf-8").splitlines():
        if line.startswith("ELEVENLABS_API_KEY="):
            return line.split("=", 1)[1].strip().strip('"').strip("'")
    return None

EL_KEY = _load_el_key()
if not EL_KEY:
    sys.exit("ERROR: ELEVENLABS_API_KEY nije u .env.local!")

# ── Sadržaj sekcija — UTF-8 znakovi direktno ──────────────────────────────────
SECTIONS = [
    # ── 1. UVOD ────────────────────────────────────────────────────────────────
    {
        "id": "s1_uvod",
        "badge": "UVOD",
        "slide_title": "Tjedan 3 — Eliminacija duga",
        "slide_lines": [
            ("head",   "Danas učiš:"),
            ("gap",    ""),
            ("bullet", "•  Zašto dug raste brže nego što mislimo"),
            ("bullet", "•  Dvije najmoćnije metode eliminacije duga"),
            ("bullet", "•  Kako pregovarati s bankom — da, moguće je"),
            ("bullet", "•  Kako napraviti osobni plan bez stresa"),
            ("gap",    ""),
            ("sep",    ""),
            ("gap",    ""),
            ("label",  "Dug nije moralni propust."),
            ("body",   "Dug je financijsko stanje —"),
            ("body",   "i iz svakog stanja postoji izlaz."),
            ("gap",    ""),
            ("sub",    "Uzmi papir i olovku. Danas pišeš."),
        ],
        "tts": (
            "Dobrodošao u treći tjedan.\n\n"
            "Danas govorimo o temi koja za mnoge ljude nosi osjećaj srama, stresa ili straha.\n\n"
            "Govorimo o dugu.\n\n"
            "I odmah na početku želim reći: dug nije moralni propust.\n\n"
            "Dug je financijsko stanje — i iz svakog financijskog stanja postoji izlaz.\n\n"
            "Samo treba znati kojim putem ići.\n\n"
            "U ovom videu naučit ćeš: zašto dug raste brže nego što mislimo, "
            "dvije najmoćnije metode eliminacije duga na svijetu, "
            "kako pregovarati s bankom — da, to je moguće — "
            "i kako napraviti osobni plan bez stresa.\n\n"
            "Uzmi papir i olovku. Danas pišeš."
        ),
    },

    # ── 2. DIO 1: PSIHOLOGIJA DUGA ─────────────────────────────────────────────
    {
        "id": "s2_psihologija",
        "badge": "DIO 1",
        "slide_title": "Psihologija duga",
        "slide_lines": [
            ("head",   "Zašto je dug tako teško eliminirati?"),
            ("gap",    ""),
            ("body",   "Nije samo matematika. To je psihologija."),
            ("sub",    "  Više dugova → mozak se ne zna fokusirati"),
            ("sub",    "  Sve izgleda hitno → paraliza → ne radimo ništa"),
            ("gap",    ""),
            ("sep",    ""),
            ("gap",    ""),
            ("label",  "Kamata radi PROTIV tebe 24/7"),
            ("gap",    ""),
            ("body",   "Primjer: 5.000 EUR × 18% godišnje"),
            ("sub",    "  Plaćaš samo minimum:"),
            ("sub",    "  → 14 godina otplate"),
            ("sub",    "  → ukupno platiš 9.000 EUR"),
            ("gap",    ""),
            ("label",  "Za 5.000 EUR — platiš 9.000."),
            ("sub",    "  Ovo nije kritika. Ovo je matematika koja tebe košta."),
        ],
        "tts": (
            "Zašto je dug tako teško eliminirati?\n\n"
            "Nije samo matematika. To je psihologija.\n\n"
            "Kada imaš više dugova — mozak se ne zna fokusirati. "
            "Sve izgleda hitno. Sve izgleda podjednako teško. "
            "I u toj paralizi — ne radimo ništa.\n\n"
            "Plus — kamata radi protiv tebe dvadeset i četiri sata na dan. "
            "Dok spavaš, dok si na godišnjem odmoru, dok gledaš seriju — kamata se akumulira.\n\n"
            "Primjer.\n\n"
            "Imaš pet tisuća eura duga na kreditnoj kartici s kamatom osamnaest posto godišnje.\n\n"
            "Ako plaćaš samo minimum — trebat će ti četrnaest godina da ga otplatiš. "
            "I ukupno ćeš platiti više od devet tisuća eura.\n\n"
            "Za pet tisuća eura — platiš devet tisuća.\n\n"
            "Ovo nije kritika. Ovo je matematika koja tebe košta. "
            "I zato trebamo sustav."
        ),
    },

    # ── 3. DIO 2a: METODA LAVINA ──────────────────────────────────────────────
    {
        "id": "s3_lavina",
        "badge": "DIO 2a",
        "slide_title": "Metoda Lavina",
        "slide_lines": [
            ("head",   "Lavina — matematički optimalna"),
            ("gap",    ""),
            ("label",  "Korak 1:"),
            ("sub",    "  Nastavi plaćati MINIMUME na sve dugove"),
            ("gap",    ""),
            ("label",  "Korak 2:"),
            ("sub",    "  Sav extra novac → dug s NAJVEĆOM KAMATOM"),
            ("gap",    ""),
            ("label",  "Korak 3:"),
            ("sub",    "  Kada taj otplatiš → sve na sljedeći po kamati"),
            ("gap",    ""),
            ("sep",    ""),
            ("gap",    ""),
            ("body",   "Rezultat: plaćaš NAJMANJE kamate ukupno"),
            ("sub",    "  Matematički — ovo je optimalna metoda."),
            ("sub",    "  Uštediš najviše novca."),
            ("gap",    ""),
            ("label",  "Ali: možda nećeš vidjeti napredak tjednima."),
            ("sub",    "  Ako odustaneš — nema koristi od optimalne matematike."),
        ],
        "tts": (
            "Postoje dvije metode eliminacije duga koje zaista funkcioniraju. "
            "Zvuče romantično, ali iza njih stoji konkretna psihologija i matematika.\n\n"
            "Prva: Metoda Lavina.\n\n"
            "Lavina funkcionira matematički.\n\n"
            "Korak jedan: nastavi plaćati minimume na sve dugove.\n\n"
            "Korak dva: sav preostali novac koji možeš namijeniti otplati — "
            "stavi na dug s najvećom kamatom.\n\n"
            "Korak tri: kada taj otplatiš — sve prebaci na sljedeći po kamati.\n\n"
            "Zašto ovo funkcionira? Jer plaćaš najmanje kamate ukupno. "
            "Matematički — ovo je optimalna metoda. Uštediš najviše novca.\n\n"
            "Ali — ima jedan problem.\n\n"
            "Ako je dug s najvećom kamatom i najveći iznos — "
            "možda nećeš vidjeti napredak tjednima ili mjesecima. "
            "I odustaneš.\n\n"
            "Zato postoji i druga metoda."
        ),
    },

    # ── 4. DIO 2b: METODA SNJEŽNA GRUDA ──────────────────────────────────────
    {
        "id": "s4_snjezna_gruda",
        "badge": "DIO 2b",
        "slide_title": "Metoda Snježna gruda",
        "slide_lines": [
            ("head",   "Snježna gruda — psihološki optimalna"),
            ("gap",    ""),
            ("label",  "Korak 1:"),
            ("sub",    "  Nastavi plaćati MINIMUME na sve dugove"),
            ("gap",    ""),
            ("label",  "Korak 2:"),
            ("sub",    "  Sav extra novac → dug s NAJMANJIM IZNOSOM"),
            ("sub",    "  (bez obzira na kamatu)"),
            ("gap",    ""),
            ("label",  "Korak 3:"),
            ("sub",    "  Kada ga otplatiš → slaviš → sljedeći po veličini"),
            ("gap",    ""),
            ("sep",    ""),
            ("gap",    ""),
            ("body",   "Koja je bolja?"),
            ("sub",    "  Analitičan tip → LAVINA (štediš više novca)"),
            ("sub",    "  Trebaš brze pobjede → SNJEŽNA GRUDA"),
            ("gap",    ""),
            ("label",  "Obje funkcioniraju."),
            ("sub",    "  Jedina loša metoda: ne raditi ništa."),
        ],
        "tts": (
            "Snježna gruda funkcionira psihološki.\n\n"
            "Korak jedan: nastavi plaćati minimume na sve dugove.\n\n"
            "Korak dva: sav extra novac stavi na dug s najmanjim iznosom — "
            "bez obzira na kamatu.\n\n"
            "Korak tri: kada ga otplatiš — slaviš. Zatim sve na sljedeći po veličini.\n\n"
            "Zašto ovo funkcionira? Jer vidiš rezultate brže. "
            "Svaki dug koji zatvorite je pobjeda. "
            "Pobjeda daje motivaciju. Motivacija daje kontinuitet.\n\n"
            "Koja je bolja?\n\n"
            "Ovisi o tebi.\n\n"
            "Ako si analitičan tip — Lavina. Štediš više novca. "
            "Ako trebaš brze rezultate da ostaneš motiviran — Snježna gruda.\n\n"
            "Obje funkcioniraju. Jedina loša metoda — ne raditi ništa.\n\n"
            "Sada: napiši sve svoje dugove. "
            "Uz svaki napiši: iznos, kamatu, minimalna rata. "
            "To je tvoja mapa duga. I odatle kreće plan."
        ),
    },

    # ── 5. DIO 3: PREGOVARANJE S BANKOM ──────────────────────────────────────
    {
        "id": "s5_pregovaranje",
        "badge": "DIO 3",
        "slide_title": "Pregovaraj s bankom",
        "slide_lines": [
            ("head",   "Što možeš tražiti:"),
            ("gap",    ""),
            ("label",  "OPCIJA 1 — Reprogram kredita"),
            ("sub",    "  Produljenje roka → niža rata"),
            ("sub",    "  U kriznom periodu: manja rata = dah za disanje"),
            ("gap",    ""),
            ("label",  "OPCIJA 2 — Smanjenje kamatne stope"),
            ("sub",    "  Posebno ako plaćaš redovno godinama"),
            ("sub",    "  Pitaj: 'Ima li mogućnosti za refinanciranje?'"),
            ("gap",    ""),
            ("label",  "OPCIJA 3 — Konsolidacija dugova"),
            ("sub",    "  Više dugova → jedan kredit s nižom kamatom"),
            ("sub",    "  Manje stresa, lakše upravljanje"),
            ("gap",    ""),
            ("sep",    ""),
            ("gap",    ""),
            ("body",   "Najgore što banka može reći je: NE."),
            ("label",  "A često — kažu DA."),
        ],
        "tts": (
            "Sada — o nečemu o čemu malo tko govori.\n\n"
            "Možeš pregovarati s bankom.\n\n"
            "Mnogi misle da je kamatna stopa fiksna. Da je iznos rate fiksna. "
            "Da ne postoji alternativa osim platiti.\n\n"
            "To nije istina.\n\n"
            "Banke su poslovni subjekti. Njima je u interesu da ti vraćaš dug. "
            "Ako vide da imaš problem — radije će pregovarati nego riskirati neplaćanje.\n\n"
            "Što možeš tražiti?\n\n"
            "Opcija jedan — reprogram kredita. "
            "Produljenje roka otplate znači nižu ratu. "
            "Da, dulje plaćaš — ali u kriznom periodu, manja rata znači dah.\n\n"
            "Opcija dva — smanjenje kamatne stope. "
            "Posebno ako plaćaš redovno godinama. "
            "Nazovi i pitaj: ima li mogućnosti za refinanciranje pod povoljnijim uvjetima?\n\n"
            "Opcija tri — konsolidacija dugova. "
            "Više manjih dugova spojiti u jedan kredit s nižom kamatom. "
            "Manje stresa, lakše upravljanje, često bolja stopa.\n\n"
            "Najgore što banka može reći je: ne. "
            "A u tom slučaju — nisi lošije nego što si bio.\n\n"
            "Ali često — kažu da."
        ),
    },

    # ── 6. ZAKLJUČAK ──────────────────────────────────────────────────────────
    {
        "id": "s6_zakljucak",
        "badge": "ZAKLJUČAK",
        "slide_title": "Tvoj zadatak za ovaj tjedan",
        "slide_lines": [
            ("head",   "Trostruki zadatak — napravi danas:"),
            ("gap",    ""),
            ("bullet", "•  JEDAN: Napiši listu svih dugova"),
            ("sub",    "       iznos · kamata · minimalna rata"),
            ("bullet", "•  DVA: Odaberi metodu"),
            ("sub",    "       Lavina ili Snježna gruda — nema krivog odgovora"),
            ("bullet", "•  TRI: Napravi JEDAN konkretan korak"),
            ("sub",    "       Pozovi banku. Postavi extra 20 EUR na najmanji dug."),
            ("gap",    ""),
            ("sep",    ""),
            ("gap",    ""),
            ("body",   "Dug se eliminira korak po korak. Ne odjednom."),
            ("label",  "Ali svaki korak mijenja smjer."),
            ("gap",    ""),
            ("body",   "Sljedeći tjedan: Prve investicije — bez straha"),
            ("sub",    "  ETF za početnike · zašto investiranje nije samo za bogate"),
            ("body",   "Pitanja? → brane@fincoach.vip"),
        ],
        "tts": (
            "Tvoj zadatak za ovaj tjedan je trostruk.\n\n"
            "Jedan: napiši listu svih dugova — iznos, kamata, rata.\n\n"
            "Dva: odaberi metodu — Lavina ili Snježna gruda. "
            "Nema krivog odgovora.\n\n"
            "Tri: napravi jedan konkretan korak. "
            "Bilo koji. Pozovi banku. "
            "Postavi extra dvadeset eura na najmanji dug. "
            "Jedan korak.\n\n"
            "Dug se eliminira korak po korak. Ne odjednom. "
            "Ali svaki korak mijenja smjer.\n\n"
            "Sljedeći tjedan — govorimo o investiranju. "
            "I znam što misliš: investiranje nije za mene, to je za bogate.\n\n"
            "Pogrešno. I objasnit ću ti zašto u videu četiri.\n\n"
            "Javi mi se na brane, na fincoach.vip, ako imaš pitanja.\n\n"
            "Vidimo se."
        ),
    },
]

# ── Metapodatki za portal ──────────────────────────────────────────────────────
LESSON_META = {
    "video_num": 3,
    "title": "Tjedan 3 — Eliminacija duga",
    "o_ovoj_lekciji": {
        "uvod": (
            "U trećoj lekciji govorimo o temi koja za mnoge nosi sram i stres: dug. "
            "Dug nije moralni propust — to je financijsko stanje s konkretnim izlazom. "
            "Naučit ćeš dvije najmoćnije metode eliminacije duga i saznati da možeš "
            "pregovarati s bankom."
        ),
        "kljucne_tocke": [
            "Psihologija duga — zašto mozak sabotira otplatu",
            "Matematika kamate: 5.000 EUR × 18% = 14 godina i 9.000 EUR ukupno",
            "Metoda Lavina — matematički optimalna (najveća kamata prva)",
            "Metoda Snježna gruda — psihološki optimalna (najmanji iznos prvi)",
            "Kako pregovarati s bankom: reprogram, refinanciranje, konsolidacija",
            "Trostruki plan: lista dugova → metoda → jedan konkretan korak",
        ],
        "zadatak_tjedna": (
            "Trostruki zadatak: (1) Napiši listu svih dugova s iznosom, kamatom i ratom. "
            "(2) Odaberi metodu — Lavina ili Snježna gruda. "
            "(3) Napravi jedan konkretan korak danas — pozovi banku ili postavi extra 20 EUR na najmanji dug. "
            "ROK: 7 dana."
        ),
        "sljedeci_tjedan": (
            "Prve investicije bez straha — ETF za početnike i zašto investiranje "
            "nije samo za bogate."
        ),
    }
}

# ── Pomocne funkcije (identične kao video 1 i 2) ───────────────────────────────
def fnt(name: str, size: int) -> ImageFont.FreeTypeFont:
    for f in [name, "arialbd.ttf", "arial.ttf"]:
        try:
            return ImageFont.truetype(FDIR + f, size)
        except Exception:
            pass
    return ImageFont.load_default()


def elevenlabs_tts(text: str, out_path: Path) -> None:
    url = f"https://api.elevenlabs.io/v1/text-to-speech/{VOICE_ID}"
    headers = {"xi-api-key": EL_KEY, "Content-Type": "application/json"}
    data = {
        "text": text,
        "model_id": "eleven_multilingual_v2",
        "voice_settings": {
            "stability": 0.55,
            "similarity_boost": 0.82,
            "style": 0.18,
            "use_speaker_boost": True,
        },
    }
    r = requests.post(url, headers=headers, json=data, timeout=180)
    if r.status_code != 200:
        raise RuntimeError(f"ElevenLabs {r.status_code}: {r.text[:300]}")
    out_path.write_bytes(r.content)
    print(f"    Audio: {len(r.content)//1024} KB -> {out_path.name}")


def make_slide(section: dict, out_path: Path) -> None:
    bg = Image.open(BG).convert("RGB").resize((W, H), Image.LANCZOS)
    img = bg.copy().convert("RGBA")
    panel = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    pd = ImageDraw.Draw(panel)
    pd.rounded_rectangle([(48, 48), (W - 48, H - 48)], radius=14, fill=(6, 14, 26, 240))
    img = Image.alpha_composite(img, panel).convert("RGB")
    draw = ImageDraw.Draw(img)

    draw.rectangle([(48, 48), (W - 48, 56)], fill=GOLD)

    f_badge = fnt("arialbd.ttf", 20)
    badge_txt = f"  FinCoach VIP  |  STARTER PAKET  |  {section['badge']}  "
    draw.text((80, 70), badge_txt, font=f_badge, fill=GOLD)

    f_title = fnt("arialbd.ttf", 72)
    title = section["slide_title"]
    draw.text((80, 104), title, font=f_title, fill=WHITE)

    tw = int(draw.textlength(title, font=f_title))
    draw.rectangle([(80, 192), (80 + min(tw, W - 180), 200)], fill=GOLD)

    f_head   = fnt("arialbd.ttf", 46)
    f_label  = fnt("arialbd.ttf", 40)
    f_body   = fnt("arial.ttf",   36)
    f_sub    = fnt("arial.ttf",   30)
    f_bullet = fnt("arial.ttf",   36)

    y = 216
    for kind, text in section["slide_lines"]:
        if y > H - 90:
            break
        if kind == "gap":
            y += 10
        elif kind == "sep":
            draw.rectangle([(80, y + 8), (W - 180, y + 12)], fill=(80, 85, 95))
            y += 20
        elif kind == "head":
            draw.text((80, y), text, font=f_head, fill=GOLD)
            y += 64
        elif kind == "label":
            draw.text((80, y), text, font=f_label, fill=GOLD)
            y += 56
        elif kind == "bullet":
            draw.text((80, y), text, font=f_bullet, fill=WHITE)
            y += 52
        elif kind == "body":
            draw.text((80, y), text, font=f_body, fill=WHITE)
            y += 52
        elif kind == "sub":
            draw.text((80, y), text, font=f_sub, fill=GREY)
            y += 44

    draw.rectangle([(48, H - 56), (W - 48, H - 48)], fill=GOLD)
    f_url = fnt("arialbd.ttf", 20)
    uw = int(draw.textlength("www.fincoach.vip", font=f_url))
    draw.text(((W - uw) // 2, H - 44), "www.fincoach.vip", font=f_url, fill=GOLD)

    img.save(str(out_path), quality=95)
    print(f"    Slide: {out_path.name}")


def make_intro(out_path: Path) -> None:
    img = Image.new("RGB", (W, H), (10, 22, 42))
    draw = ImageDraw.Draw(img)
    mid = H // 2

    draw.rectangle([(0, mid - 88), (W, mid - 80)], fill=GOLD)
    draw.rectangle([(0, mid + 80), (W, mid + 88)], fill=GOLD)

    f_week = fnt("arialbd.ttf", 30)
    wt = "TJEDAN 3"
    draw.text(((W - int(draw.textlength(wt, font=f_week))) // 2, mid - 142),
              wt, font=f_week, fill=GOLD)

    f_main = fnt("arialbd.ttf", 76)
    t1 = "Eliminacija duga"
    draw.text(((W - int(draw.textlength(t1, font=f_main))) // 2, mid - 68),
              t1, font=f_main, fill=WHITE)

    f_sub2 = fnt("arial.ttf", 38)
    t2 = "metode koje funkcioniraju"
    draw.text(((W - int(draw.textlength(t2, font=f_sub2))) // 2, mid + 22),
              t2, font=f_sub2, fill=WHITE)

    f_brand = fnt("arial.ttf", 24)
    tb = "FinCoach VIP  |  Financijski Starter Paket"
    draw.text(((W - int(draw.textlength(tb, font=f_brand))) // 2, mid + 108),
              tb, font=f_brand, fill=GOLD)

    intro_png = TEMP / "00_intro.png"
    img.save(str(intro_png))

    intro_s = TEMP / "00_intro_silent.mp4"
    subprocess.run([
        "ffmpeg", "-y", "-loop", "1", "-framerate", "25",
        "-i", str(intro_png), "-t", "5",
        "-c:v", "libx264", "-preset", "fast", "-crf", "20", "-pix_fmt", "yuv420p",
        str(intro_s)
    ], capture_output=True, check=True)

    subprocess.run([
        "ffmpeg", "-y",
        "-i", str(intro_s),
        "-f", "lavfi", "-i", "anullsrc=r=44100:cl=stereo",
        "-c:v", "copy", "-c:a", "aac", "-b:a", "192k", "-shortest",
        str(out_path)
    ], capture_output=True, check=True)
    print(f"    Intro: {out_path.name}")


def png_audio_to_mp4(png: Path, audio: Path, out: Path) -> None:
    result = subprocess.run([
        "ffmpeg", "-y",
        "-loop", "1", "-framerate", "25",
        "-i", str(png),
        "-i", str(audio),
        "-c:v", "libx264", "-preset", "fast", "-crf", "20",
        "-c:a", "aac", "-b:a", "192k", "-ar", "44100", "-ac", "2",
        "-vf", f"scale={W}:{H}:force_original_aspect_ratio=decrease,"
               f"pad={W}:{H}:(ow-iw)/2:(oh-ih)/2:color=black",
        "-shortest", "-pix_fmt", "yuv420p",
        str(out)
    ], capture_output=True, text=True)
    if result.returncode != 0:
        raise RuntimeError(f"ffmpeg segment: {result.stderr[-400:]}")
    print(f"    Segment: {out.name}")


def get_duration(path: Path) -> float:
    r = subprocess.run(
        ["ffprobe", "-v", "quiet", "-show_entries", "format=duration",
         "-of", "csv", str(path)],
        capture_output=True, text=True
    )
    return float(r.stdout.strip().split(",")[-1])


def concat_all(videos: list, out: Path) -> None:
    print("  Korak 1: Normalizacija svih segmenata -> stereo 44100Hz")
    normalized = []
    for v in videos:
        p = Path(v)
        dst = TEMP / ("norm_" + p.name)
        if not dst.exists():
            print(f"    norm {p.name}...")
            probe = subprocess.run(
                ["ffprobe", "-v", "error", "-select_streams", "a",
                 "-show_entries", "stream=codec_name",
                 "-of", "default=noprint_wrappers=1", str(p)],
                capture_output=True, text=True
            )
            has_audio = bool(probe.stdout.strip())
            if has_audio:
                subprocess.run([
                    "ffmpeg", "-y", "-i", str(p),
                    "-c:v", "copy", "-ar", "44100", "-ac", "2",
                    "-c:a", "aac", "-b:a", "192k",
                    str(dst)
                ], capture_output=True, check=True)
            else:
                subprocess.run([
                    "ffmpeg", "-y",
                    "-i", str(p),
                    "-f", "lavfi", "-i", "anullsrc=r=44100:cl=stereo",
                    "-c:v", "copy",
                    "-c:a", "aac", "-b:a", "192k", "-shortest",
                    str(dst)
                ], capture_output=True, check=True)
                print(f"    (nema audio -> dodana tišina)")
        normalized.append(dst)

    print(f"  Korak 2: filter_complex concat ({len(normalized)} segmenata)...")
    n = len(normalized)
    filter_streams = "".join(f"[{i}:v][{i}:a]" for i in range(n))
    filter_complex = f"{filter_streams}concat=n={n}:v=1:a=1[v][a]"

    cmd = ["ffmpeg", "-y"]
    for seg in normalized:
        cmd += ["-i", str(seg)]
    cmd += [
        "-filter_complex", filter_complex,
        "-map", "[v]", "-map", "[a]",
        "-c:v", "libx264", "-preset", "fast", "-crf", "20",
        "-c:a", "aac", "-b:a", "192k",
        "-pix_fmt", "yuv420p",
        str(out)
    ]
    result = subprocess.run(cmd, capture_output=True, text=True)
    if result.returncode != 0:
        raise RuntimeError(f"concat: {result.stderr[-600:]}")


# ── Glavni pipeline ────────────────────────────────────────────────────────────
def main():
    print("\n" + "="*55)
    print("  FinCoach Starter Video 3 — Pipeline")
    print("="*55)

    segments = []

    # 0. Intro
    print("\n[INTRO]")
    intro_mp4 = TEMP / "00_intro.mp4"
    if not intro_mp4.exists():
        make_intro(intro_mp4)
    else:
        print(f"    Intro že obstaja.")
    segments.append(intro_mp4)

    # 1-6. Vsebinske sekcije
    total_chars = 0
    for i, sec in enumerate(SECTIONS, 1):
        print(f"\n[SEKCIJA {i}: {sec['badge']}]")
        audio_f   = TEMP / f"{i:02d}_{sec['id']}.mp3"
        slide_f   = TEMP / f"{i:02d}_{sec['id']}.png"
        segment_f = TEMP / f"{i:02d}_{sec['id']}.mp4"

        if not audio_f.exists():
            print(f"    ElevenLabs TTS ({len(sec['tts'])} znakova)...")
            elevenlabs_tts(sec["tts"], audio_f)
            time.sleep(0.8)
        else:
            print(f"    Audio već postoji: {audio_f.name}")
        total_chars += len(sec["tts"])

        if not slide_f.exists():
            make_slide(sec, slide_f)
        else:
            print(f"    Slide već postoji: {slide_f.name}")

        if not segment_f.exists():
            png_audio_to_mp4(slide_f, audio_f, segment_f)
        else:
            print(f"    Segment već postoji: {segment_f.name}")

        dur = get_duration(segment_f)
        print(f"    Trajanje: {dur:.1f}s ({dur/60:.1f} min)")
        segments.append(segment_f)

    # 7. Outro
    print(f"\n[OUTRO]")
    segments.append(OUTRO)
    print(f"    outro_logo.mp4 dodan")

    # 8. Concat -> final
    print(f"\n[CONCAT -> FINAL]")
    final = V_DIR / "video3_final.mp4"
    concat_all(segments, final)
    dur_f = get_duration(final)
    print(f"    video3_final.mp4: {dur_f/60:.1f} min")

    # 9. Portal metapodatki
    meta_path = V_DIR / "lesson_meta.json"
    LESSON_META["duration_min"] = round(dur_f / 60, 1)
    meta_path.write_text(
        json.dumps(LESSON_META, ensure_ascii=False, indent=2), encoding="utf-8"
    )

    print(f"\n{'='*55}")
    print(f"  ZAVRŠENO!")
    print(f"  TTS znakova: {total_chars:,}")
    print(f"  Trajanje:    {dur_f/60:.1f} min")
    print(f"  Output:      {final}")
    print(f"  Portal meta: {meta_path}")
    print(f"{'='*55}\n")


if __name__ == "__main__":
    main()
