# -*- coding: utf-8 -*-
"""
FinCoach VIP - Starter Video 2 Pipeline
Automatizacija stednje i hitni fond
Output: E:/fincoach-vip/StarterVideo/2.video/video2_final.mp4
"""
import os, sys, io, json, time, subprocess, requests
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

# ── Konfiguracija ──────────────────────────────────────────────────────────────
VOICE_ID  = "UHqZihCaTRvL7TIfJCrQ"
BASE      = Path(r"E:\fincoach-vip\StarterVideo")
V_DIR     = BASE / "2.video"
OUTRO     = Path(r"E:\fincoach-vip\promo\outro_logo.mp4")
BG        = BASE / "ozadje" / "FinCoach_Zoom_Ozadje.png"
TEMP      = V_DIR / "_temp_v2"
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
    sys.exit("ERROR: ELEVENLABS_API_KEY ni v .env.local!")

# ── Sadrzaj sekcija ────────────────────────────────────────────────────────────
SECTIONS = [
    # ── 1. UVOD ────────────────────────────────────────────────────────────────
    {
        "id": "s1_uvod",
        "badge": "UVOD",
        "slide_title": "Tjedan 2 \u2014 Automatizacija \u0161tednje",
        "slide_lines": [
            ("head",   "U ovom videu nau\u010dit \u0107e\u0161:"),
            ("gap",    ""),
            ("bullet", "\u2022  Za\u0161to volja ne funkcionira za \u0161tednju"),
            ("bullet", "\u2022  Princip 'Plati sebi prvo' \u2014 kako najbogatiji \u0161tede"),
            ("bullet", "\u2022  Kako postaviti automatski trajni nalog za 5 minuta"),
            ("bullet", "\u2022  \u0160to je hitni fond i za\u0161to je to prva investicija"),
            ("gap",    ""),
            ("sep",    ""),
            ("gap",    ""),
            ("body",   "Volja ne funkcionira. Sustavi \u2014 funkcioniraju."),
            ("gap",    ""),
            ("sub",    "Jedan trajni nalog mo\u017ee promijeniti cijelu financijsku sliku."),
        ],
        "tts": (
            "Dobrodo\u0161ao u drugi tjedan tvojeg Financijskog Starter Paketa.\n\n"
            "Ako si napravio prora\u010dun iz prvog tjedna \u2014 odli\u010dno. Jesi napravio "
            "prvi korak koji ve\u0107ina nikada ne napravi.\n\n"
            "Ako nisi... i dalje si ovdje, i to je dobro. Po\u010dnemo danas.\n\n"
            "U ovom tjednu razgovarat \u0107emo o jednoj od najva\u017enijih financijskih "
            "istina koje znam.\n\n"
            "Volja ne funkcionira.\n\n"
            "Ponavljam: volja... ne... funkcionira.\n\n"
            "Nitko tko je izgradio financijsku sigurnost to nije napravio "
            "snagom volje. Napravio je to sustavima koji rade automatski "
            "dok spava.\n\n"
            "Danas \u0107e\u0161 nau\u010diti za\u0161to tvoj mozak sabotira \u0161tednju... "
            "princip koji koriste financijski najuspje\u0161niji ljudi... "
            "kako postaviti automatski trajni nalog koji mijenja sve... "
            "i \u0161to je hitni fond i za\u0161to je to prva investicija koju "
            "trebas napraviti."
        ),
    },

    # ── 2. DIO 1 ───────────────────────────────────────────────────────────────
    {
        "id": "s2_volja",
        "badge": "DIO 1",
        "slide_title": "Za\u0161to volja ne funkcionira?",
        "slide_lines": [
            ("head",   "Poznata situacija:"),
            ("gap",    ""),
            ("body",   "Stigne pla\u0107a \u2192 'Ovaj mjesec \u0161tedim 200 EUR'"),
            ("sub",    "  Tjedan prolazi... Dva tjedna..."),
            ("sub",    "  Na kraju: 200 EUR nekako nije ostalo."),
            ("gap",    ""),
            ("sep",    ""),
            ("gap",    ""),
            ("label",  "To nije tvoja krivica. To je neurologija."),
            ("gap",    ""),
            ("body",   "Na\u0161 mozak je dizajniran za TRENUTNO zadovoljstvo."),
            ("sub",    "  \u0160tednja za budu\u0107nost = apstraktna, nevidljiva, manje hitna."),
            ("gap",    ""),
            ("sep",    ""),
            ("gap",    ""),
            ("body",   "Rje\u0161enje nije vi\u0161e volje."),
            ("label",  "Rje\u0161enje je maknuti odluku iz jedna\u010dbe."),
            ("sub",    "  Ako novac ne vidi\u0161 \u2014 ne tro\u0161i\u0161 ga."),
        ],
        "tts": (
            "Zamislite ovakvu situaciju.\n\n"
            "Stigne pla\u0107a. Ka\u017ee\u0161 sebi: Ovaj mjesec \u0161tedim dvjesto eura.\n\n"
            "Pla\u0107a\u0161 ra\u010dune. Ide\u0161 na ru\u010dak. Mala kupovina tu i tamo.\n\n"
            "Tjedan dana prolazi. Dva tjedna.\n\n"
            "Na kraju mjeseca \u2014 dvjesto eura nekako nije ostalo.\n\n"
            "Zvuci poznato?\n\n"
            "To nije tvoja krivica. To je neurologija.\n\n"
            "Na\u0161 mozak je dizajniran za trenutno zadovoljstvo. Evolucijski... "
            "pre\u017eivljavanje je danas. \u0160tednja za budu\u0107nost je apstraktna, "
            "nevidljiva. Mozak ju tretira kao manje hitno.\n\n"
            "I zato \u2014 svaki put kada ima\u0161 novca dostupnog, mozak pronalazi "
            "razloge da ga potro\u0161i. Novi telefon koji ti treba. Odjevni "
            "predmet koji je na snizenju. Restoran jer si umoran.\n\n"
            "Rje\u0161enje nije vi\u0161e volje. Rje\u0161enje je maknuti odluku iz "
            "jedna\u010dbe.\n\n"
            "Ako novac ne vidi\u0161 \u2014 ne tro\u0161i\u0161 ga. Jednostavno. Efikasno. "
            "I bez i jednog trenutka disciplinirane volje."
        ),
    },

    # ── 3. DIO 2 ───────────────────────────────────────────────────────────────
    {
        "id": "s3_plati_sebi",
        "badge": "DIO 2",
        "slide_title": "Plati sebi prvo",
        "slide_lines": [
            ("head",   "Princip koji koriste financijski neovisni:"),
            ("gap",    ""),
            ("label",  "IM STIGNE PLA\u0106A \u2014 PRVI transfer je na \u0161tednju"),
            ("sub",    "  Ne na ra\u010dune. Ne na hranu. Ne na zabavu."),
            ("sub",    "  Prvo \u2014 sebi. Automatski."),
            ("gap",    ""),
            ("sep",    ""),
            ("gap",    ""),
            ("body",   "Konkretno:"),
            ("label",  "Dan 1: Stigne pla\u0107a 1.500 EUR"),
            ("sub",    "  \u21b3 Automatski trajni nalog: 200 EUR \u2192 \u0161tedni ra\u010dun"),
            ("label",  "Dan 2: Vidi\u0161 1.300 EUR. Tro\u0161i\u0161 od toga."),
            ("gap",    ""),
            ("sep",    ""),
            ("gap",    ""),
            ("body",   "Za 2\u20133 mjeseca ne\u0107e\u0161 ni primijetiti razliku."),
            ("label",  "Za godinu dana: 2.400 EUR u\u0161te\u0111eno."),
            ("sub",    "  Bez volje. Bez discipline svaki dan."),
            ("sub",    "  Samo jedan postavljeni trajni nalog."),
        ],
        "tts": (
            "Postoji princip koji koriste financijski neovisni ljudi diljem "
            "svijeta. Zove se: Plati sebi prvo.\n\n"
            "I zvuci jednostavno. Jer jest jednostavno.\n\n"
            "\u010cim ti stigne pla\u0107a \u2014 PRVI transfer koji se dogodi je na tvoj "
            "\u0161tedni ra\u010dun. Ne na ra\u010dune. Ne na hranu. Ne na zabavu.\n\n"
            "Prvo \u2014 sebi.\n\n"
            "I to je automatski. Ti to ne radi\u0161 svjesno svaki mjesec. "
            "Sustav to radi za tebe.\n\n"
            "Ovako to izgleda konkretno.\n\n"
            "Dana prvog stigne pla\u0107a... tisu\u0107u i petsto eura.\n\n"
            "Toga dana se automatski dogodi trajni nalog: dvjesto eura ide "
            "na \u0161tedni ra\u010dun.\n\n"
            "Dana drugog vidi\u0161 tisu\u0107u i tristo eura na ra\u010dunu. I tro\u0161i\u0161 od toga.\n\n"
            "Tvoj mozak se adaptira na tisu\u0107u i tristo kao na 'normalnu' "
            "pla\u0107u. Za dva do tri mjeseca \u2014 ne\u0107e\u0161 ni primijetiti.\n\n"
            "Ali za godinu dana \u2014 ima\u0161 dvije tisu\u0107e i \u010detiristo eura "
            "u\u0161te\u0111eno.\n\n"
            "Bez volje. Bez discipline svaki dan. Samo jedan postavljeni "
            "trajni nalog."
        ),
    },

    # ── 4. DIO 3 ───────────────────────────────────────────────────────────────
    {
        "id": "s4_trajni_nalog",
        "badge": "DIO 3",
        "slide_title": "Kako postaviti trajni nalog",
        "slide_lines": [
            ("head",   "4 koraka \u2014 napravi danas:"),
            ("gap",    ""),
            ("label",  "KORAK 1 \u2014 Otvori bankarsku aplikaciju"),
            ("sub",    "  ili idi u poslovnicu"),
            ("gap",    ""),
            ("label",  "KORAK 2 \u2014 Otvori ODVOJENI \u0161tedni ra\u010dun"),
            ("sub",    "  Ne smije biti dostupan jednim klikom."),
            ("sub",    "  Psiholo\u0161ka barijera = manje potro\u0161nje."),
            ("gap",    ""),
            ("label",  "KORAK 3 \u2014 Postavi trajni nalog"),
            ("sub",    "  Datum: 1. ili 2. u mjesecu (dan nakon pla\u0107e)"),
            ("sub",    "  Iznos: po\u010dni s onim s \u010dim si siguran. I 50 EUR je OK."),
            ("gap",    ""),
            ("label",  "KORAK 4 \u2014 Ne diraj taj ra\u010dun"),
            ("sub",    "  Daj mu ime: 'Sloboda 2027.' ili 'Hitni fond'"),
            ("sub",    "  Imenovan cilj te\u017ee \u0107e\u0161 dirnut."),
        ],
        "tts": (
            "Pokazat \u0107u ti to\u010dno \u0161to trebas napraviti. \u010cetiri koraka.\n\n"
            "Korak prvi \u2014 otvori bankarsku aplikaciju ili idi u poslovnicu.\n\n"
            "Korak drugi \u2014 otvori odvojeni \u0161tedni ra\u010dun ako ga nema\u0161. "
            "Za\u0161to odvojen? Jer ne smije biti dostupan jednim klikom. "
            "Psiholo\u0161ka barijera zna\u010di manje potro\u0161nje. Racun koji "
            "vidi\u0161 svaki dan... trosi\u0161 svaki dan.\n\n"
            "Korak tre\u0107i \u2014 postavi trajni nalog. "
            "Datum: prvi ili drugi u mjesecu... dan nakon pla\u0107e. "
            "Iznos: po\u010dni s onim s \u010dim si siguran. To mo\u017ee biti pedeset eura.\n\n"
            "\u010cujem ve\u0107: Brane, pedeset eura je premalo, \u0161to to vredi?\n\n"
            "Evo \u0161to vrijedi: pedeset eura puta dvanaest mjese\u010di je \u0161esto "
            "eura godi\u0161nje. Ali to nije samo \u0161esto eura.\n\n"
            "To je navika. To je dokaz sebi da mo\u017ee\u0161.\n\n"
            "I navika \u0161tednje raste. Po\u010dne\u0161 s pedeset... za \u0161est mjese\u010di "
            "di\u017ee\u0161 na sto.\n\n"
            "Korak \u010detvrti \u2014 ne diraj taj ra\u010dun. On postoji za jednu stvar: "
            "hitni fond i dugoro\u010dne ciljeve. Nije za godi\u0161nji odmor. "
            "Nije za novu televiziju.\n\n"
            "Daj mu ime ako treba. Sloboda 2027. Hitni fond. "
            "Imenovan cilj te\u017ee \u0107e\u0161 dirnut."
        ),
    },

    # ── 5. DIO 4 ───────────────────────────────────────────────────────────────
    {
        "id": "s5_hitni_fond",
        "badge": "DIO 4",
        "slide_title": "Hitni fond \u2014 prva investicija",
        "slide_lines": [
            ("head",   "Za\u0161to hitni fond dolazi PRIJE svega:"),
            ("gap",    ""),
            ("body",   "Hitni fond = novac za nepredvi\u0111ene situacije"),
            ("sub",    "  Gubitak posla \u00b7 kvar auta \u00b7 medicinski tro\u0161ak \u00b7 popravak"),
            ("gap",    ""),
            ("label",  "Koliko trebaS?"),
            ("sub",    "  Cilj: 3\u20136 mjese\u010dnih tro\u0161kova"),
            ("sub",    "  Tro\u0161i\u0161 1.200 EUR/mj. \u2192 hitni fond: 3.600 \u2013 7.200 EUR"),
            ("gap",    ""),
            ("label",  "Mini-cilj: 1.000 EUR"),
            ("sub",    "  Dovoljno za ve\u0107inu malih kriza. Po\u010dni ovdje."),
            ("gap",    ""),
            ("sep",    ""),
            ("gap",    ""),
            ("body",   "Bez hitnog fonda: svaka kriza = kreditna kartica = dug"),
            ("label",  "S hitnim fondom: spava\u0161 mirno. To nije mali cilj."),
        ],
        "tts": (
            "Sada govorimo o hitnom fondu.\n\n"
            "Hitni fond je novac koji \u010duva\u0161 isklju\u010divo za nepredvi\u0111ene "
            "situacije. Gubitak posla. Kvar automobila. Medicinski tro\u0161ak. "
            "Ku\u0107ni popravak.\n\n"
            "Koliko trebas? Financijski savjetnici ka\u017eu tri do \u0161est "
            "mjese\u010dnih tro\u0161kova.\n\n"
            "Ako tro\u0161i\u0161 tisu\u0107u i dvjesto eura mjese\u010dno \u2014 hitni fond je "
            "izme\u0111u tri tisu\u0107e i \u0161eststo i sedam tisu\u0107a i dvjesto eura.\n\n"
            "Znam \u2014 zvu\u010di puno. Ali to je cilj, ne startna to\u010dka.\n\n"
            "Po\u010dni s tisu\u0107u eura kao prvim mini-ciljem. To je dovoljno "
            "za ve\u0107inu malih kriza.\n\n"
            "Za\u0161to je ovo bitno?\n\n"
            "Jer bez hitnog fonda \u2014 svaka neo\u010dekivana situacija ide na "
            "kreditnu karticu. A kreditna kartica zna\u010di kamatu. A kamata "
            "zna\u010di dug. A dug zna\u010di stres.\n\n"
            "Hitni fond je tvoj financijski \u0161tit.\n\n"
            "I to je PRVA stvar u koju ula\u017ee\u0161 \u2014 prije dionica, prije "
            "kriptovaluta, prije svega.\n\n"
            "Kada ima\u0161 hitni fond \u2014 no\u0107i\u0161 mirno spavati. "
            "I to nije mali cilj. To je temelj svega."
        ),
    },

    # ── 6. ZAKLJUCAK ──────────────────────────────────────────────────────────
    {
        "id": "s6_zakljucak",
        "badge": "ZAKLJU\u010cAK",
        "slide_title": "Tvoj zadatak za ovaj tjedan",
        "slide_lines": [
            ("head",   "Trostruki zadatak \u2014 napravi danas:"),
            ("gap",    ""),
            ("bullet", "\u2022  JEDAN: Otvori odvojeni \u0161tedni ra\u010dun"),
            ("bullet", "\u2022  DVA: Postavi trajni nalog na dan nakon pla\u0107e"),
            ("sub",    "       Iznos \u2014 bilo \u0161to. 50 EUR, 100 EUR, 200 EUR."),
            ("bullet", "\u2022  TRI: Postavi mini-cilj hitnog fonda"),
            ("sub",    "       Zapi\u0161i datum kada planira\u0161 sti\u0107i do 1.000 EUR."),
            ("gap",    ""),
            ("sep",    ""),
            ("gap",    ""),
            ("body",   "Sljede\u0107i tjedan: Eliminacija duga"),
            ("sub",    "  Metode lavine i snje\u017ene grude \u2014 koje funkcioniraju?"),
            ("sub",    "  Konkretni koraci za koga ima kredite i kartice."),
            ("gap",    ""),
            ("body",   "Pitanja? \u2192 brane@fincoach.vip"),
            ("body",   "Vidimo se u Tjednu 3!"),
        ],
        "tts": (
            "Tvoj zadatak za ovaj tjedan je trostruk.\n\n"
            "Jedan: otvori odvojeni \u0161tedni ra\u010dun ako ga nema\u0161.\n\n"
            "Dva: postavi trajni nalog na dan nakon pla\u0107e. "
            "Iznos \u2014 bilo \u0161to. Pedeset eura, sto eura, dvjesto eura. "
            "Va\u017eno je da postoji.\n\n"
            "Tri: postavi si mini-cilj hitnog fonda. "
            "Zapi\u0161i ga. Napi\u0161i datum kada planira\u0161 sti\u0107i do tisu\u0107u eura.\n\n"
            "I oznaci u portalu kada zavr\u0161i\u0161 svaki od ovih koraka. "
            "Jer akcija \u2014 ne gledanje videa \u2014 je ono \u0161to mijenja financijski "
            "\u017eivot.\n\n"
            "Sljede\u0107i tjedan govorimo o dugu. "
            "Jer dug je drugi razlog za\u0161to novac nestaje \u2014 i postoje "
            "konkretne metode za rje\u0161avanje. Metoda lavine i snje\u017ene grude.\n\n"
            "Javi mi se na brane, na fincoach.vip, ako ima\u0161 pitanja.\n\n"
            "Vidimo se u videu broj tri."
        ),
    },
]

# ── Metapodatki za portal ──────────────────────────────────────────────────────
LESSON_META = {
    "video_num": 2,
    "title": "Tjedan 2 \u2014 Automatizacija \u0161tednje i hitni fond",
    "o_ovoj_lekciji": {
        "uvod": (
            "U drugoj lekciji Starter Paketa u\u010dit \u0107e\u0161 najva\u017eniju financijsku "
            "istinu: volja ne funkcionira. Nitko tko je izgradio financijsku "
            "sigurnost to nije napravio snagom volje \u2014 napravio je to sustavima "
            "koji rade automatski dok spava. Jedan trajni nalog mo\u017ee zauvijek "
            "promijeniti tvoj odnos prema novcu."
        ),
        "kljucne_tocke": [
            "Za\u0161to mozak sabotira \u0161tednju \u2014 neurolo\u0161ko obja\u0161njenje",
            "Princip 'Plati sebi prvo' \u2014 kako funkcionira u praksi",
            "Kako postaviti automatski trajni nalog u 4 koraka",
            "Za\u0161to trebas odvojeni \u0161tedni ra\u010dun (psiholo\u0161ka barijera)",
            "Hitni fond \u2014 \u0161to je, koliko trebas i za\u0161to je to prva investicija",
            "Mini-cilj: 1.000 EUR \u2014 realni po\u010detni cilj za hitni fond",
        ],
        "zadatak_tjedna": (
            "Trostruki zadatak: (1) Otvori odvojeni \u0161tedni ra\u010dun. "
            "(2) Postavi automatski trajni nalog na dan nakon pla\u0107e \u2014 "
            "iznos nije va\u017ean, va\u017eno je da postoji. "
            "(3) Zapi\u0161i datum do kada planira\u0161 sti\u0107i do 1.000 EUR hitnog fonda. "
            "ROK: 7 dana."
        ),
        "sljedeci_tjedan": (
            "Eliminacija duga \u2014 metode lavine i snje\u017ene grude: "
            "koja funkcionira za tebe i konkretni koraci za koga ima kredite i kartice."
        ),
    }
}

# ── Pomocne funkcije (identicne kao video 1) ───────────────────────────────────
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
    wt = "TJEDAN 2"
    draw.text(((W - int(draw.textlength(wt, font=f_week))) // 2, mid - 142),
              wt, font=f_week, fill=GOLD)

    f_main = fnt("arialbd.ttf", 76)
    t1 = "Automatizacija \u0161tednje"
    draw.text(((W - int(draw.textlength(t1, font=f_main))) // 2, mid - 68),
              t1, font=f_main, fill=WHITE)

    f_sub2 = fnt("arial.ttf", 38)
    t2 = "i hitni fond"
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


def ensure_audio(src: Path, dst: Path) -> Path:
    r = subprocess.run(
        ["ffprobe", "-v", "error", "-select_streams", "a",
         "-show_entries", "stream=codec_name", "-of", "default=noprint_wrappers=1",
         str(src)], capture_output=True, text=True
    )
    if r.stdout.strip():
        return src
    subprocess.run([
        "ffmpeg", "-y", "-i", str(src),
        "-f", "lavfi", "-i", "anullsrc=r=44100:cl=stereo",
        "-c:v", "libx264", "-preset", "fast", "-crf", "20",
        "-c:a", "aac", "-b:a", "192k",
        "-vf", f"scale={W}:{H}:force_original_aspect_ratio=decrease,"
               f"pad={W}:{H}:(ow-iw)/2:(oh-ih)/2:color=black",
        "-pix_fmt", "yuv420p", "-shortest", str(dst)
    ], capture_output=True, check=True)
    return dst


def concat_all(videos: list, out: Path) -> None:
    # KRITIČNO: najprej normaliziraj vse na stereo 44100Hz (ElevenLabs = mono!)
    print("  Korak 1: Normalizacija vseh segmentov -> stereo 44100Hz")
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
                # Ni audio streama (npr. outro_logo) — dodaj tiho stereo
                subprocess.run([
                    "ffmpeg", "-y",
                    "-i", str(p),
                    "-f", "lavfi", "-i", "anullsrc=r=44100:cl=stereo",
                    "-c:v", "copy",
                    "-c:a", "aac", "-b:a", "192k", "-shortest",
                    str(dst)
                ], capture_output=True, check=True)
                print(f"    (ni audio -> dodana tišina)")
        normalized.append(dst)

    print(f"  Korak 2: filter_complex concat ({len(normalized)} segmentov)...")
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
    print("  FinCoach Starter Video 2 \u2014 Pipeline")
    print("="*55)

    segments = []

    # 0. Intro
    print("\n[INTRO]")
    intro_mp4 = TEMP / "00_intro.mp4"
    if not intro_mp4.exists():
        make_intro(intro_mp4)
    else:
        print(f"    Intro ze obstaja.")
    segments.append(intro_mp4)

    # 1-6. Vsebinske sekcije
    total_chars = 0
    for i, sec in enumerate(SECTIONS, 1):
        print(f"\n[SEKCIJA {i}: {sec['badge']}]")
        audio_f   = TEMP / f"{i:02d}_{sec['id']}.mp3"
        slide_f   = TEMP / f"{i:02d}_{sec['id']}.png"
        segment_f = TEMP / f"{i:02d}_{sec['id']}.mp4"

        if not audio_f.exists():
            print(f"    ElevenLabs TTS ({len(sec['tts'])} znakov)...")
            elevenlabs_tts(sec["tts"], audio_f)
            time.sleep(0.8)
        else:
            print(f"    Audio ze obstaja: {audio_f.name}")
        total_chars += len(sec["tts"])

        if not slide_f.exists():
            make_slide(sec, slide_f)
        else:
            print(f"    Slide ze obstaja: {slide_f.name}")

        if not segment_f.exists():
            png_audio_to_mp4(slide_f, audio_f, segment_f)
        else:
            print(f"    Segment ze obstaja: {segment_f.name}")

        dur = get_duration(segment_f)
        print(f"    Trajanje: {dur:.1f}s ({dur/60:.1f} min)")
        segments.append(segment_f)

    # 7. Outro
    print(f"\n[OUTRO]")
    segments.append(OUTRO)
    print(f"    outro_logo.mp4 dodan")

    # 8. Concat -> final (z normalizacijo mono->stereo)
    print(f"\n[CONCAT -> FINAL]")
    final = V_DIR / "video2_final.mp4"
    concat_all(segments, final)
    dur_f = get_duration(final)
    print(f"    video2_final.mp4: {dur_f/60:.1f} min")

    # 9. Portal metapodatki
    meta_path = V_DIR / "lesson_meta.json"
    LESSON_META["duration_min"] = round(dur_f / 60, 1)
    meta_path.write_text(
        json.dumps(LESSON_META, ensure_ascii=False, indent=2), encoding="utf-8"
    )

    print(f"\n{'='*55}")
    print(f"  ZAKLJU\u010cENO!")
    print(f"  TTS znakov: {total_chars:,}")
    print(f"  Trajanje:   {dur_f/60:.1f} min")
    print(f"  Output:     {final}")
    print(f"  Portal meta:{meta_path}")
    print(f"{'='*55}\n")


if __name__ == "__main__":
    main()
